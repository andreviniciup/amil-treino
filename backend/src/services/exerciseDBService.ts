import axios from 'axios';
import NodeCache from 'node-cache';
import { ExerciseDBExercise } from '../types';

const cache = new NodeCache({ stdTTL: 3600 }); // Cache de 1 hora

class ExerciseDBService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.RAPIDAPI_KEY || '';
    this.baseUrl = 'https://exercisedb.p.rapidapi.com';
  }

  private getHeaders() {
    return {
      'X-RapidAPI-Key': this.apiKey,
      'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
    };
  }

  async getAllExercises(): Promise<ExerciseDBExercise[]> {
    // Validar API key antes de fazer requisição
    if (!this.apiKey) {
      console.error('⚠️ RAPIDAPI_KEY not configured');
      throw new Error('ExerciseDB API key not configured');
    }

    const cacheKey = 'all_exercises';
    const cached = cache.get<ExerciseDBExercise[]>(cacheKey);
    
    if (cached) {
      console.log('✓ Returning cached exercises');
      return cached;
    }

    try {
      console.log('Fetching all exercises from ExerciseDB...');
      const response = await axios.get(`${this.baseUrl}/exercises`, {
        headers: this.getHeaders(),
        params: { limit: 1000 }
      });

      cache.set(cacheKey, response.data);
      console.log(`✓ Fetched ${response.data.length} exercises`);
      return response.data;
    } catch (error) {
      console.error('Error fetching exercises:', error);
      throw new Error('Failed to fetch exercises from ExerciseDB');
    }
  }

  async getExercisesByBodyPart(bodyPart: string): Promise<ExerciseDBExercise[]> {
    // Validar API key antes de fazer requisição
    if (!this.apiKey) {
      console.error('⚠️ RAPIDAPI_KEY not configured');
      throw new Error('ExerciseDB API key not configured');
    }

    const cacheKey = `exercises_${bodyPart}`;
    const cached = cache.get<ExerciseDBExercise[]>(cacheKey);
    
    if (cached) {
      console.log(`✓ Returning cached exercises for ${bodyPart}`);
      return cached;
    }

    try {
      console.log(`Fetching exercises for ${bodyPart}...`);
      const response = await axios.get(
        `${this.baseUrl}/exercises/bodyPart/${bodyPart}`,
        {
          headers: this.getHeaders()
        }
      );

      cache.set(cacheKey, response.data);
      console.log(`✓ Fetched ${response.data.length} exercises for ${bodyPart}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching exercises for ${bodyPart}:`, error);
      throw new Error('Failed to fetch exercises by body part');
    }
  }

  async getExerciseById(id: string): Promise<ExerciseDBExercise> {
    // Validar API key antes de fazer requisição
    if (!this.apiKey) {
      console.error('⚠️ RAPIDAPI_KEY not configured');
      throw new Error('ExerciseDB API key not configured');
    }

    const cacheKey = `exercise_${id}`;
    const cached = cache.get<ExerciseDBExercise>(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await axios.get(
        `${this.baseUrl}/exercises/exercise/${id}`,
        {
          headers: this.getHeaders()
        }
      );

      cache.set(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching exercise ${id}:`, error);
      throw new Error('Failed to fetch exercise');
    }
  }

  async searchExercises(query: string): Promise<ExerciseDBExercise[]> {
    // Validar API key antes de fazer requisição
    if (!this.apiKey) {
      console.error('⚠️ RAPIDAPI_KEY not configured');
      throw new Error('ExerciseDB API key not configured');
    }

    try {
      console.log(`Searching exercises for: ${query}`);
      const response = await axios.get(
        `${this.baseUrl}/exercises/name/${query}`,
        {
          headers: this.getHeaders()
        }
      );

      console.log(`✓ Found ${response.data.length} exercises`);
      return response.data;
    } catch (error) {
      console.error(`Error searching exercises:`, error);
      throw new Error('Failed to search exercises');
    }
  }

  // Mapear categorias do frontend para bodyParts do ExerciseDB
  async getExercisesByCategory(category: string): Promise<ExerciseDBExercise[]> {
    const categoryMap: { [key: string]: string[] } = {
      musculacao: ['chest', 'back', 'lower legs', 'upper legs', 'shoulders', 'upper arms', 'lower arms'],
      cardio: ['cardio'],
      yoga: ['waist'], // Yoga não está bem representado no ExerciseDB
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
        console.error(`Error fetching ${bodyPart}:`, error);
      }
    }

    // Remove duplicates
    const uniqueExercises = allExercises.filter(
      (exercise, index, self) =>
        index === self.findIndex((e) => e.id === exercise.id)
    );

    return uniqueExercises;
  }

  clearCache() {
    cache.flushAll();
    console.log('✓ Cache cleared');
  }
}

export default new ExerciseDBService();



