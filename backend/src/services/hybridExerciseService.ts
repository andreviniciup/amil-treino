import prisma from '../config/database';
import exerciseDBService from './exerciseDBService';
import wgerService from './wgerService';
import cacheService from './cacheService';
import { ExerciseDBExercise } from '../types';

class HybridExerciseService {
  /**
   * Busca exercícios usando estratégia híbrida:
   * 1. Primeiro no banco interno
   * 2. Se não encontrar, busca na API externa
   * 3. Salva dados da API no banco interno para próximas consultas
   */
  async getAllExercises(): Promise<ExerciseDBExercise[]> {
    try {
      // 0. Verificar cache primeiro
      const cacheKey = 'all_exercises';
      const cachedExercises = cacheService.getExerciseList(cacheKey);
      if (cachedExercises) {
        console.log(`🚀 Found ${cachedExercises.length} exercises in cache`);
        return cachedExercises;
      }

      // 1. Buscar no banco interno primeiro
      const internalExercises = await prisma.exercise.findMany({
        orderBy: { name: 'asc' },
        take: 100 // Limitar para performance
      });

      if (internalExercises.length > 0) {
        console.log(`✓ Found ${internalExercises.length} exercises in internal DB`);
        const mappedExercises = this.mapInternalToExternal(internalExercises);
        
        // Salvar no cache
        cacheService.setExerciseList(cacheKey, mappedExercises);
        
        return mappedExercises;
      }

      // 2. Se banco interno vazio, buscar na API externa
      console.log('⚠️ Internal DB empty, fetching from external APIs...');
      let externalExercises: ExerciseDBExercise[] = [];

      try {
        externalExercises = await exerciseDBService.getAllExercises();
        console.log('✓ Using ExerciseDB API');
      } catch (exerciseDBError) {
        console.log('⚠️ ExerciseDB failed, trying Wger API...');
        try {
          externalExercises = await wgerService.getAllExercises();
          console.log('✓ Using Wger API');
        } catch (wgerError) {
          console.error('⚠️ Both APIs failed. Returning empty array.');
          return []; // Retornar array vazio em vez de erro 500
        }
      }

      // 3. Salvar dados da API no banco interno (em background)
      if (externalExercises.length > 0) {
        // Salvar no cache imediatamente
        cacheService.setExerciseList(cacheKey, externalExercises);
        
        // Não aguardar o salvamento para não bloquear a resposta
        this.saveExternalExercisesToDB(externalExercises).catch(error => {
          console.error('Error saving exercises to DB:', error);
        });
      }

      return externalExercises;
    } catch (error) {
      console.error('Error in hybrid getAllExercises:', error);
      // Retornar array vazio em vez de lançar erro
      return [];
    }
  }

  async getExercisesByBodyPart(bodyPart: string): Promise<ExerciseDBExercise[]> {
    try {
      console.log(`🔍 Fetching exercises for body part: ${bodyPart}`);
      
      // Mapear bodyPart do inglês para português
      const bodyPartMapping: { [key: string]: string } = {
        'chest': 'peito',
        'back': 'costas',
        'shoulders': 'ombros',
        'arms': 'braços',
        'legs': 'pernas',
        'glutes': 'glúteos',
        'core': 'core',
        'cardio': 'cardio'
      };
      
      const mappedBodyPart = bodyPartMapping[bodyPart.toLowerCase()] || bodyPart;
      console.log(`🔄 Mapped ${bodyPart} -> ${mappedBodyPart}`);
      
      // 1. Buscar no banco interno primeiro
      const internalExercises = await prisma.exercise.findMany({
        where: {
          bodyPart: mappedBodyPart
        },
        orderBy: { name: 'asc' }
      });

      if (internalExercises.length > 0) {
        console.log(`✓ Found ${internalExercises.length} exercises for "${bodyPart}" in internal DB`);
        return this.mapInternalToExternal(internalExercises);
      }

      // 2. Se não encontrar, buscar na API externa
      console.log(`⚠️ No exercises for "${bodyPart}" in internal DB, fetching from external APIs...`);
      let externalExercises: ExerciseDBExercise[] = [];

      try {
        externalExercises = await exerciseDBService.getExercisesByBodyPart(bodyPart);
        console.log('✓ Using ExerciseDB API');
      } catch (exerciseDBError) {
        console.log('⚠️ ExerciseDB failed, trying Wger API...');
        externalExercises = await wgerService.getExercisesByBodyPart(bodyPart);
        console.log('✓ Using Wger API');
      }

      // 3. Salvar dados da API no banco interno
      await this.saveExternalExercisesToDB(externalExercises);

      console.log(`✓ Found ${externalExercises.length} exercises for ${bodyPart}`);
      return externalExercises;
    } catch (error) {
      console.error(`Error in hybrid getExercisesByBodyPart for ${bodyPart}:`, error);
      throw new Error('Failed to fetch exercises by body part');
    }
  }

  async getExerciseById(id: string): Promise<ExerciseDBExercise> {
    try {
      // 1. Buscar no banco interno primeiro
      const internalExercise = await prisma.exercise.findFirst({
        where: {
          OR: [
            { id },
            { externalId: id }
          ]
        }
      });

      if (internalExercise) {
        console.log(`✓ Found exercise ${id} in internal DB`);
        return this.mapInternalToExternal([internalExercise])[0];
      }

      // 2. Se não encontrar, buscar na API externa
      console.log(`⚠️ Exercise ${id} not found in internal DB, fetching from external APIs...`);
      let externalExercise: ExerciseDBExercise;

      try {
        externalExercise = await exerciseDBService.getExerciseById(id);
        console.log('✓ Using ExerciseDB API for exercise');
      } catch (exerciseDBError) {
        console.log('⚠️ ExerciseDB failed, trying Wger API...');
        externalExercise = await wgerService.getExerciseById(id);
        console.log('✓ Using Wger API for exercise');
      }

      // 3. Salvar dados da API no banco interno
      await this.saveExternalExercisesToDB([externalExercise]);

      return externalExercise;
    } catch (error) {
      console.error(`Error in hybrid getExerciseById for ${id}:`, error);
      throw new Error('Failed to fetch exercise');
    }
  }

  async searchExercises(query: string): Promise<ExerciseDBExercise[]> {
    try {
      // 1. Buscar no banco interno primeiro
      const internalExercises = await prisma.exercise.findMany({
        where: {
          name: {
            contains: query
          }
        },
        orderBy: { name: 'asc' }
      });

      if (internalExercises.length > 0) {
        console.log(`✓ Found ${internalExercises.length} exercises matching "${query}" in internal DB`);
        return this.mapInternalToExternal(internalExercises);
      }

      // 2. Se não encontrar, buscar na API externa
      console.log(`⚠️ No exercises matching "${query}" in internal DB, fetching from external APIs...`);
      let externalExercises: ExerciseDBExercise[] = [];

      try {
        externalExercises = await exerciseDBService.searchExercises(query);
        console.log('✓ Using ExerciseDB API for search');
      } catch (exerciseDBError) {
        console.log('⚠️ ExerciseDB failed, trying Wger API...');
        try {
          externalExercises = await wgerService.searchExercises(query);
          console.log('✓ Using Wger API for search');
        } catch (wgerError) {
          console.error('⚠️ Both APIs failed for search. Returning empty array.');
          return []; // Retornar array vazio em vez de erro 500
        }
      }

      // 3. Salvar dados da API no banco interno
      if (externalExercises.length > 0) {
        await this.saveExternalExercisesToDB(externalExercises);
      }

      return externalExercises;
    } catch (error) {
      console.error(`Error in hybrid searchExercises for "${query}":`, error);
      // Retornar array vazio em vez de lançar erro
      return [];
    }
  }

  async getExercisesByCategory(category: string): Promise<ExerciseDBExercise[]> {
    try {
      // 1. Buscar no banco interno primeiro
      const internalExercises = await prisma.exercise.findMany({
        where: {
          OR: [
            { bodyPart: { contains: category } },
            { target: { contains: category } }
          ]
        },
        orderBy: { name: 'asc' }
      });

      if (internalExercises.length > 0) {
        console.log(`✓ Found ${internalExercises.length} exercises for category "${category}" in internal DB`);
        return this.mapInternalToExternal(internalExercises);
      }

      // 2. Se não encontrar, buscar na API externa
      console.log(`⚠️ No exercises for category "${category}" in internal DB, fetching from external APIs...`);
      let externalExercises: ExerciseDBExercise[] = [];

      try {
        externalExercises = await exerciseDBService.getExercisesByCategory(category);
        console.log('✓ Using ExerciseDB API for category');
      } catch (exerciseDBError) {
        console.log('⚠️ ExerciseDB failed, trying Wger API...');
        externalExercises = await wgerService.getExercisesByCategory(category);
        console.log('✓ Using Wger API for category');
      }

      // 3. Salvar dados da API no banco interno
      await this.saveExternalExercisesToDB(externalExercises);

      return externalExercises;
    } catch (error) {
      console.error(`Error in hybrid getExercisesByCategory for "${category}":`, error);
      throw new Error('Failed to fetch exercises by category');
    }
  }

  /**
   * Salva exercícios da API externa no banco interno
   */
  private async saveExternalExercisesToDB(exercises: ExerciseDBExercise[]): Promise<void> {
    try {
      console.log(`💾 Saving ${exercises.length} exercises to internal DB...`);
      
      for (const exercise of exercises) {
        // Verificar se já existe
        const existing = await prisma.exercise.findFirst({
          where: {
            externalId: exercise.id,
            source: 'exercisedb'
          }
        });

        if (existing) {
          // Atualizar se já existe (e tem name válido)
          if (exercise.name && exercise.name.trim() !== '') {
            await prisma.exercise.update({
              where: { id: existing.id },
              data: {
                name: exercise.name.trim(),
                bodyPart: exercise.bodyPart || existing.bodyPart,
                equipment: exercise.equipment || existing.equipment,
                gifUrl: exercise.gifUrl || existing.gifUrl,
                target: exercise.target || existing.target,
                secondaryMuscles: JSON.stringify(exercise.secondaryMuscles || []),
                instructions: JSON.stringify(exercise.instructions || []),
                updatedAt: new Date()
              }
            });
          }
        } else {
          // Criar novo se não existe
          // Validar que name não está vazio
          if (!exercise.name || exercise.name.trim() === '') {
            console.warn(`⚠️ Skipping exercise ${exercise.id} - missing name`);
            continue;
          }

          await prisma.exercise.create({
            data: {
              externalId: exercise.id,
              name: exercise.name.trim(),
              bodyPart: exercise.bodyPart || 'unknown',
              equipment: exercise.equipment || 'bodyweight',
              gifUrl: exercise.gifUrl || 'https://via.placeholder.com/300x300?text=Exercise',
              target: exercise.target || '',
              secondaryMuscles: JSON.stringify(exercise.secondaryMuscles || []),
              instructions: JSON.stringify(exercise.instructions || []),
              source: 'exercisedb'
            }
          });
        }
      }
      
      console.log(`✓ Successfully saved ${exercises.length} exercises to internal DB`);
    } catch (error) {
      console.error('Error saving exercises to internal DB:', error);
      // Não falha a operação principal se não conseguir salvar
    }
  }

  /**
   * Mapeia exercícios do banco interno para formato da API externa
   */
  private mapInternalToExternal(internalExercises: any[]): ExerciseDBExercise[] {
    return internalExercises.map(exercise => ({
      id: exercise.id,
      name: exercise.name,
      bodyPart: exercise.bodyPart,
      equipment: exercise.equipment,
      gifUrl: exercise.gifUrl || 'https://via.placeholder.com/300x300?text=Exercise',
      target: exercise.target || '',
      secondaryMuscles: exercise.secondaryMuscles ? JSON.parse(exercise.secondaryMuscles) : [],
      instructions: exercise.instructions ? JSON.parse(exercise.instructions) : []
    }));
  }

  /**
   * Limpa cache do banco interno
   */
  async clearInternalCache(): Promise<void> {
    try {
      const result = await prisma.exercise.deleteMany({
        where: {
          source: {
            not: 'internal'
          }
        }
      });
      console.log(`✓ Internal exercise cache cleared (${result.count} exercises deleted)`);
    } catch (error) {
      console.error('Error clearing internal cache:', error);
      // Não lançar erro se a tabela estiver vazia ou houver outro problema
      console.log('⚠️ Cache clear failed, but continuing...');
    }
  }

  /**
   * Busca e atualiza imagens dos exercícios usando Unsplash
   */
  async updateExerciseImages(): Promise<{ updated: number; errors: number }> {
    try {
      console.log('🖼️ Starting image update process...');
      
      // Buscar exercícios sem imagem ou com placeholder
      const exercisesWithoutImages = await prisma.exercise.findMany({
        where: {
          OR: [
            { gifUrl: null },
            { gifUrl: '' },
            { gifUrl: { contains: 'placeholder' } },
            { gifUrl: { contains: 'test.gif' } }
          ]
        },
        take: 50 // Limitar para não sobrecarregar a API
      });

      console.log(`📊 Found ${exercisesWithoutImages.length} exercises without proper images`);

      let updated = 0;
      let errors = 0;

      for (const exercise of exercisesWithoutImages) {
        try {
          // Usar Unsplash como fallback gratuito
          const searchTerms = [exercise.name];
          if (exercise.bodyPart) {
            searchTerms.push(exercise.bodyPart);
          }
          
          const query = encodeURIComponent(searchTerms.join(' '));
          const imageUrl = `https://source.unsplash.com/400x400/?${query}`;

          // Atualizar exercício com nova imagem
          await prisma.exercise.update({
            where: { id: exercise.id },
            data: { gifUrl: imageUrl }
          });
          
          updated++;
          console.log(`✅ Updated image for: ${exercise.name} -> ${imageUrl}`);

          // Pequena pausa para não sobrecarregar
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`❌ Error updating image for ${exercise.name}:`, error);
          errors++;
        }
      }

      console.log(`🎉 Image update completed: ${updated} updated, ${errors} errors`);
      return { updated, errors };
    } catch (error) {
      console.error('Error updating exercise images:', error);
      throw new Error('Failed to update exercise images');
    }
  }

  /**
   * Estatísticas do banco interno
   */
  async getInternalStats(): Promise<{
    totalExercises: number;
    bySource: { source: string; count: number }[];
    byBodyPart: { bodyPart: string; count: number }[];
  }> {
    try {
      const totalExercises = await prisma.exercise.count();
      
      const bySource = await prisma.exercise.groupBy({
        by: ['source'],
        _count: { source: true }
      });

      const byBodyPart = await prisma.exercise.groupBy({
        by: ['bodyPart'],
        _count: { bodyPart: true },
        orderBy: { _count: { bodyPart: 'desc' } }
      });

      return {
        totalExercises,
        bySource: bySource.map(item => ({
          source: item.source,
          count: item._count.source
        })),
        byBodyPart: byBodyPart.map(item => ({
          bodyPart: item.bodyPart,
          count: item._count.bodyPart
        }))
      };
    } catch (error) {
      console.error('Error getting internal stats:', error);
      throw new Error('Failed to get internal stats');
    }
  }
}

export default new HybridExerciseService();
