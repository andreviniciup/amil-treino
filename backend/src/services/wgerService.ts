import axios from 'axios';
import NodeCache from 'node-cache';
import { ExerciseDBExercise } from '../types';

const cache = new NodeCache({ stdTTL: 3600 }); // Cache de 1 hora

class WgerService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'https://wger.de/api/v2';
  }

  private async makeRequest(endpoint: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'TreinoApp/1.0'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching from Wger: ${endpoint}`, error);
      throw new Error('Failed to fetch from Wger API');
    }
  }

  async getAllExercises(): Promise<ExerciseDBExercise[]> {
    const cacheKey = 'wger_all_exercises';
    const cached = cache.get<ExerciseDBExercise[]>(cacheKey);
    
    if (cached) {
      console.log('✓ Returning cached Wger exercises');
      return cached;
    }

    try {
      console.log('Fetching exercises from Wger API...');
      
      // Buscar exercícios com imagens
      const response = await this.makeRequest('/exercise/?language=2&status=2&limit=100');
      
      const exercises: ExerciseDBExercise[] = response.results.map((ex: any) => ({
        id: ex.id.toString(),
        name: ex.name,
        bodyPart: this.mapBodyPart(ex.category),
        equipment: ex.equipment.map((eq: any) => eq.name).join(', '),
        gifUrl: ex.images?.[0]?.image || 'https://via.placeholder.com/300x300?text=Exercise',
        target: ex.muscles.map((muscle: any) => muscle.name).join(', '),
        secondaryMuscles: ex.muscles_secondary?.map((muscle: any) => muscle.name) || [],
        instructions: ex.description ? [ex.description] : []
      }));

      cache.set(cacheKey, exercises);
      console.log(`✓ Fetched ${exercises.length} exercises from Wger`);
      return exercises;
    } catch (error) {
      console.error('Error fetching exercises from Wger:', error);
      throw new Error('Failed to fetch exercises from Wger');
    }
  }

  async getExercisesByBodyPart(bodyPart: string): Promise<ExerciseDBExercise[]> {
    const cacheKey = `wger_exercises_${bodyPart}`;
    const cached = cache.get<ExerciseDBExercise[]>(cacheKey);
    
    if (cached) {
      console.log(`✓ Returning cached Wger exercises for ${bodyPart}`);
      return cached;
    }

    try {
      console.log(`Fetching exercises for ${bodyPart} from Wger...`);
      
      const categoryId = this.getCategoryId(bodyPart);
      const response = await this.makeRequest(`/exercise/?language=2&status=2&category=${categoryId}&limit=50`);
      
      const exercises: ExerciseDBExercise[] = response.results.map((ex: any) => ({
        id: ex.id.toString(),
        name: ex.name,
        bodyPart: this.mapBodyPart(ex.category),
        equipment: ex.equipment.map((eq: any) => eq.name).join(', '),
        gifUrl: ex.images?.[0]?.image || 'https://via.placeholder.com/300x300?text=Exercise',
        target: ex.muscles.map((muscle: any) => muscle.name).join(', '),
        secondaryMuscles: ex.muscles_secondary?.map((muscle: any) => muscle.name) || [],
        instructions: ex.description ? [ex.description] : []
      }));

      cache.set(cacheKey, exercises);
      console.log(`✓ Fetched ${exercises.length} exercises for ${bodyPart} from Wger`);
      return exercises;
    } catch (error) {
      console.error(`Error fetching exercises for ${bodyPart} from Wger:`, error);
      throw new Error('Failed to fetch exercises by body part from Wger');
    }
  }

  async getExerciseById(id: string): Promise<ExerciseDBExercise> {
    const cacheKey = `wger_exercise_${id}`;
    const cached = cache.get<ExerciseDBExercise>(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await this.makeRequest(`/exercise/${id}/`);
      
      const exercise: ExerciseDBExercise = {
        id: response.id.toString(),
        name: response.name,
        bodyPart: this.mapBodyPart(response.category),
        equipment: response.equipment.map((eq: any) => eq.name).join(', '),
        gifUrl: response.images?.[0]?.image || 'https://via.placeholder.com/300x300?text=Exercise',
        target: response.muscles.map((muscle: any) => muscle.name).join(', '),
        secondaryMuscles: response.muscles_secondary?.map((muscle: any) => muscle.name) || [],
        instructions: response.description ? [response.description] : []
      };

      cache.set(cacheKey, exercise);
      return exercise;
    } catch (error) {
      console.error(`Error fetching exercise ${id} from Wger:`, error);
      throw new Error('Failed to fetch exercise from Wger');
    }
  }

  async searchExercises(query: string): Promise<ExerciseDBExercise[]> {
    try {
      console.log(`Searching exercises for: ${query} in Wger...`);
      const response = await this.makeRequest(`/exercise/?language=2&status=2&search=${encodeURIComponent(query)}&limit=50`);
      
      const exercises: ExerciseDBExercise[] = response.results.map((ex: any) => ({
        id: ex.id.toString(),
        name: ex.name,
        bodyPart: this.mapBodyPart(ex.category),
        equipment: ex.equipment.map((eq: any) => eq.name).join(', '),
        gifUrl: ex.images?.[0]?.image || 'https://via.placeholder.com/300x300?text=Exercise',
        target: ex.muscles.map((muscle: any) => muscle.name).join(', '),
        secondaryMuscles: ex.muscles_secondary?.map((muscle: any) => muscle.name) || [],
        instructions: ex.description ? [ex.description] : []
      }));

      console.log(`✓ Found ${exercises.length} exercises in Wger`);
      return exercises;
    } catch (error) {
      console.error(`Error searching exercises in Wger:`, error);
      throw new Error('Failed to search exercises in Wger');
    }
  }

  async getExercisesByCategory(category: string): Promise<ExerciseDBExercise[]> {
    const categoryMap: { [key: string]: string[] } = {
      musculacao: ['chest', 'back', 'lower legs', 'upper legs', 'shoulders', 'upper arms', 'lower arms'],
      cardio: ['cardio'],
      yoga: ['waist'],
      mobilidade: ['waist'],
      crossfit: ['cardio', 'chest', 'back', 'upper legs'],
      pilates: ['waist'],
      natacao: ['cardio'],
      lutas: ['cardio']
    };

    const bodyParts = categoryMap[category] || ['chest'];
    const allExercises: ExerciseDBExercise[] = [];

    for (const bodyPart of bodyParts) {
      try {
        const exercises = await this.getExercisesByBodyPart(bodyPart);
        allExercises.push(...exercises);
      } catch (error) {
        console.error(`Error fetching ${bodyPart} from Wger:`, error);
      }
    }

    // Remove duplicates
    const uniqueExercises = allExercises.filter(
      (exercise, index, self) =>
        index === self.findIndex((e) => e.id === exercise.id)
    );

    return uniqueExercises;
  }

  private mapBodyPart(category: any): string {
    const categoryName = category?.name?.toLowerCase() || '';
    const categoryId = category?.id;
    
    // Log para debug
    console.log(`🔍 Mapping category: ID=${categoryId}, Name="${categoryName}"`);
    
    // Mapeamento baseado em IDs CORRETOS da API Wger
    if (categoryId === 8 || categoryName.includes('chest') || categoryName.includes('pectorals') || categoryName.includes('peito')) {
      console.log(`✓ Mapped to: chest`);
      return 'chest';
    }
    if (categoryId === 12 || categoryName.includes('back') || categoryName.includes('lats') || categoryName.includes('costas')) {
      console.log(`✓ Mapped to: back`);
      return 'back';
    }
    if (categoryId === 9 || categoryId === 14 || categoryName.includes('legs') || categoryName.includes('quadriceps') || categoryName.includes('thighs') || categoryName.includes('pernas')) {
      console.log(`✓ Mapped to: legs`);
      return 'legs';
    }
    if (categoryId === 13 || categoryName.includes('shoulders') || categoryName.includes('deltoids') || categoryName.includes('ombros')) {
      console.log(`✓ Mapped to: shoulders`);
      return 'shoulders';
    }
    if (categoryId === 11 || categoryName.includes('arms') || categoryName.includes('biceps') || categoryName.includes('triceps') || categoryName.includes('braços')) {
      console.log(`✓ Mapped to: arms`);
      return 'arms';
    }
    if (categoryId === 10 || categoryName.includes('waist') || categoryName.includes('core') || categoryName.includes('abs') || categoryName.includes('abdomen')) {
      console.log(`✓ Mapped to: waist`);
      return 'waist';
    }
    if (categoryId === 15 || categoryName.includes('cardio')) {
      console.log(`✓ Mapped to: cardio`);
      return 'cardio';
    }
    
    // Log do fallback
    console.log(`⚠️ No mapping found for category: ID=${categoryId}, Name="${categoryName}" - using default: waist`);
    return 'waist'; // Usar 'waist' como padrão mais neutro
  }

  private getCategoryId(bodyPart: string): number {
    // IDs corretos baseados na API oficial Wger
    const categoryMap: { [key: string]: number } = {
      'chest': 8,           // Peito/Pectorais
      'back': 12,           // Costas
      'upper legs': 9,      // Pernas superiores/Coxas
      'lower legs': 14,     // Pernas inferiores/Panturrilhas
      'legs': 9,            // Pernas (default para upper legs)
      'shoulders': 13,      // Ombros
      'upper arms': 11,     // Braços superiores
      'lower arms': 8,      // Braços inferiores
      'arms': 11,           // Braços (default para upper arms)
      'waist': 10,          // Cintura/Core/Abdômen
      'cardio': 15          // Cardio
    };
    
    return categoryMap[bodyPart] || 10;
  }

  clearCache() {
    cache.flushAll();
    console.log('✓ Wger cache cleared');
  }
}

export default new WgerService();


