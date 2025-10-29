import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Serviço para buscar exercícios diretamente do banco de dados
 * Todos os exercícios já estão traduzidos para português
 */
class DatabaseExerciseService {
  
  /**
   * Busca todos os exercícios do banco
   */
  async getAllExercises() {
    try {
      console.log('🔍 Buscando todos os exercícios do banco...');
      
      const exercises = await prisma.exercise.findMany({
        orderBy: { name: 'asc' }
      });

      console.log(`✅ ${exercises.length} exercícios encontrados`);
      
      return exercises.map(ex => this.formatExercise(ex));
    } catch (error) {
      console.error('❌ Erro ao buscar exercícios:', error);
      throw new Error('Falha ao buscar exercícios do banco de dados');
    }
  }

  /**
   * Busca exercícios por parte do corpo
   */
  async getExercisesByBodyPart(bodyPart: string) {
    try {
      console.log(`🔍 Buscando exercícios para: ${bodyPart}`);
      
      const exercises = await prisma.exercise.findMany({
        where: {
          bodyPart: {
            contains: bodyPart,
            mode: 'insensitive'
          }
        },
        orderBy: { name: 'asc' }
      });

      console.log(`✅ ${exercises.length} exercícios encontrados para ${bodyPart}`);
      
      return exercises.map(ex => this.formatExercise(ex));
    } catch (error) {
      console.error(`❌ Erro ao buscar exercícios por parte do corpo:`, error);
      throw new Error('Falha ao buscar exercícios por parte do corpo');
    }
  }

  /**
   * Busca exercícios por equipamento
   */
  async getExercisesByEquipment(equipment: string) {
    try {
      console.log(`🔍 Buscando exercícios para equipamento: ${equipment}`);
      
      const exercises = await prisma.exercise.findMany({
        where: {
          equipment: {
            contains: equipment,
            mode: 'insensitive'
          }
        },
        orderBy: { name: 'asc' }
      });

      console.log(`✅ ${exercises.length} exercícios encontrados para ${equipment}`);
      
      return exercises.map(ex => this.formatExercise(ex));
    } catch (error) {
      console.error(`❌ Erro ao buscar exercícios por equipamento:`, error);
      throw new Error('Falha ao buscar exercícios por equipamento');
    }
  }

  /**
   * Busca exercício por ID
   */
  async getExerciseById(id: string) {
    try {
      console.log(`🔍 Buscando exercício: ${id}`);
      
      const exercise = await prisma.exercise.findUnique({
        where: { id }
      });

      if (!exercise) {
        throw new Error('Exercício não encontrado');
      }

      console.log(`✅ Exercício encontrado: ${exercise.name}`);
      
      return this.formatExercise(exercise);
    } catch (error) {
      console.error(`❌ Erro ao buscar exercício:`, error);
      throw error;
    }
  }

  /**
   * Busca exercícios por nome (pesquisa)
   */
  async searchExercises(query: string) {
    try {
      console.log(`🔍 Pesquisando exercícios: "${query}"`);
      
      const exercises = await prisma.exercise.findMany({
        where: {
          OR: [
            {
              name: {
                contains: query,
                mode: 'insensitive'
              }
            },
            {
              bodyPart: {
                contains: query,
                mode: 'insensitive'
              }
            },
            {
              equipment: {
                contains: query,
                mode: 'insensitive'
              }
            },
            {
              target: {
                contains: query,
                mode: 'insensitive'
              }
            }
          ]
        },
        orderBy: { name: 'asc' },
        take: 50 // Limitar resultados de pesquisa
      });

      console.log(`✅ ${exercises.length} exercícios encontrados para "${query}"`);
      
      return exercises.map(ex => this.formatExercise(ex));
    } catch (error) {
      console.error(`❌ Erro ao pesquisar exercícios:`, error);
      throw new Error('Falha ao pesquisar exercícios');
    }
  }

  /**
   * Busca lista de partes do corpo disponíveis
   */
  async getBodyPartsList() {
    try {
      const bodyParts = await prisma.exercise.findMany({
        distinct: ['bodyPart'],
        select: { bodyPart: true }
      });

      return bodyParts.map(bp => bp.bodyPart).sort();
    } catch (error) {
      console.error('❌ Erro ao buscar partes do corpo:', error);
      throw new Error('Falha ao buscar lista de partes do corpo');
    }
  }

  /**
   * Busca lista de equipamentos disponíveis
   */
  async getEquipmentsList() {
    try {
      const equipments = await prisma.exercise.findMany({
        distinct: ['equipment'],
        select: { equipment: true }
      });

      return equipments.map(eq => eq.equipment).sort();
    } catch (error) {
      console.error('❌ Erro ao buscar equipamentos:', error);
      throw new Error('Falha ao buscar lista de equipamentos');
    }
  }

  /**
   * Busca lista de músculos alvo disponíveis
   */
  async getTargetsList() {
    try {
      const targets = await prisma.exercise.findMany({
        distinct: ['target'],
        select: { target: true },
        where: {
          target: { not: null }
        }
      });

      return targets
        .map(t => t.target)
        .filter(t => t !== null)
        .sort() as string[];
    } catch (error) {
      console.error('❌ Erro ao buscar músculos alvo:', error);
      throw new Error('Falha ao buscar lista de músculos alvo');
    }
  }

  /**
   * Estatísticas dos exercícios
   */
  async getStats() {
    try {
      const [
        total,
        bySource,
        byBodyPart,
        byEquipment
      ] = await Promise.all([
        prisma.exercise.count(),
        prisma.exercise.groupBy({
          by: ['source'],
          _count: true
        }),
        prisma.exercise.groupBy({
          by: ['bodyPart'],
          _count: true
        }),
        prisma.exercise.groupBy({
          by: ['equipment'],
          _count: true
        })
      ]);

      return {
        total,
        bySource,
        byBodyPart,
        byEquipment
      };
    } catch (error) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      throw new Error('Falha ao buscar estatísticas');
    }
  }

  /**
   * Busca histórico de um exercício específico para um usuário
   */
  async getExerciseHistory(exerciseId: string, userId: string) {
    try {
      console.log(`🔍 Buscando histórico do exercício ${exerciseId} para usuário ${userId}`);
      
      // Buscar últimos 12 registros de performance
      const performanceHistory = await prisma.performanceHistory.findMany({
        where: {
          exerciseId,
          userId
        },
        orderBy: {
          date: 'desc'
        },
        take: 12
      });

      console.log(`✅ ${performanceHistory.length} registros encontrados no histórico`);

      // Calcular estatísticas
      const lastSets = performanceHistory.map(p => p.reps || 0);
      const lastWeight = performanceHistory[0]?.weight || 0;
      const lastReps = performanceHistory[0]?.reps || 0;
      const maxWeight = Math.max(...performanceHistory.map(p => p.weight || 0), 0);
      const maxReps = Math.max(...performanceHistory.map(p => p.reps || 0), 0);

      return {
        lastSets,
        lastWeight,
        lastReps,
        maxWeight,
        maxReps,
        history: performanceHistory.map(p => ({
          date: p.date,
          weight: p.weight,
          reps: p.reps,
          sets: p.sets,
          rpe: p.rpe,
          notes: p.notes
        }))
      };
    } catch (error) {
      console.error('❌ Erro ao buscar histórico do exercício:', error);
      throw new Error('Falha ao buscar histórico do exercício');
    }
  }

  /**
   * Formata exercício para o formato da API
   */
  private formatExercise(exercise: any) {
    return {
      id: exercise.id,
      externalId: exercise.externalId,
      name: exercise.name,
      bodyPart: exercise.bodyPart,
      equipment: exercise.equipment,
      gifUrl: exercise.gifUrl,
      target: exercise.target,
      secondaryMuscles: exercise.secondaryMuscles ? JSON.parse(exercise.secondaryMuscles) : [],
      instructions: exercise.instructions ? JSON.parse(exercise.instructions) : [],
      source: exercise.source
    };
  }
}

export default new DatabaseExerciseService();
