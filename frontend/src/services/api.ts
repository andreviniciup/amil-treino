import axios from 'axios';

// Base URL do backend - usa variável de ambiente ou localhost
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

// Instância axios configurada
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tipos
export interface ExerciseDB {
  id: string;
  name: string;
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  target: string;
  secondaryMuscles: string[];
  instructions: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  age?: number;
  gender?: string;
  weight?: number;
  height?: number;
  fitnessGoal?: string;
  trainingDays?: string[];
  createdAt: string;
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  name: string;
  description?: string;
  frequency: number;
  trainingTypes: string[] | string; // Pode ser array ou string JSON
  workouts: Workout[];
  createdAt: string;
  updatedAt: string;
}

export interface Workout {
  id: string;
  planId: string;
  dayOfWeek: string;
  trainingType: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutExercise {
  id: string;
  workoutId: string;
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: string;
  weight?: number;
  duration?: number;
  restTime: number;
  order: number;
  notes?: string;
  gifUrl?: string;
  bodyPart?: string;
  equipment?: string;
  target?: string;
}

export interface CreateWorkoutPlanDto {
  name: string;
  description?: string;
  frequency: number;
  trainingTypes: string[];
  workouts: {
    name?: string;  // Nome individual do treino
    dayOfWeek: string;
    trainingType: string;
    exercises: {
      exerciseId: string;
      exerciseName: string;
      sets: number;
      reps: string;
      weight?: number;
      duration?: number;
      restTime: number;
      order: number;
      notes?: string;
      gifUrl?: string;
      bodyPart?: string;
      equipment?: string;
      target?: string;
    }[];
  }[];
}

// API de exercícios (ExerciseDB)
export const exerciseApi = {
  // Buscar todos os exercícios
  getAll: async (): Promise<ExerciseDB[]> => {
    const response = await api.get('/exercises');
    return response.data.data;
  },

  // Buscar exercícios por categoria (musculacao, cardio, etc)
  getByCategory: async (category: string): Promise<ExerciseDB[]> => {
    const response = await api.get(`/exercises/category/${category}`);
    return response.data.data;
  },

  // Buscar exercícios por grupo muscular
  getByBodyPart: async (bodyPart: string): Promise<ExerciseDB[]> => {
    // Encode do bodyPart para evitar problemas com caracteres especiais (/, espaços, acentos)
    const encodedBodyPart = encodeURIComponent(bodyPart);
    const response = await api.get(`/exercises/bodypart/${encodedBodyPart}`);
    return response.data.data;
  },

  // Buscar exercício por ID
  getById: async (id: string): Promise<ExerciseDB> => {
    const response = await api.get(`/exercises/${id}`);
    return response.data.data;
  },

  // Buscar exercícios por nome
  search: async (query: string): Promise<ExerciseDB[]> => {
    const response = await api.get(`/exercises/search?q=${query}`);
    return response.data.data;
  }
};

// API de usuários e autenticação
export const authApi = {
  // Registrar novo usuário
  register: async (email: string, name: string, password: string, profileData?: {
    age?: number;
    gender?: string;
    weight?: number;
    height?: number;
    fitnessGoal?: string;
    trainingDays?: string[];
  }): Promise<{ user: User; token: string }> => {
    const response = await api.post('/users/register', { 
      email, 
      name, 
      password,
      ...profileData 
    });
    const { token, user } = response.data.data;
    localStorage.setItem('auth_token', token);
    return { user, token };
  },

  // Login
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const response = await api.post('/users/login', { email, password });
    const { token, user } = response.data.data;
    localStorage.setItem('auth_token', token);
    return { user, token };
  },

  // Obter perfil do usuário autenticado
  getProfile: async (): Promise<User> => {
    const response = await api.get('/users/profile');
    return response.data.data;
  },

  // Atualizar perfil do usuário
  updateProfile: async (profileData: {
    name?: string;
    age?: number;
    gender?: string;
    weight?: number;
    height?: number;
    fitnessGoal?: string;
    trainingDays?: string[];
  }): Promise<User> => {
    const response = await api.put('/users/profile', profileData);
    return response.data.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('auth_token');
  },

  // Verificar se está autenticado
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token');
  }
};

// API de workouts e planos
export const workoutApi = {
  // Criar plano de treino completo
  createPlan: async (plan: CreateWorkoutPlanDto): Promise<WorkoutPlan> => {
    const response = await api.post('/workouts/plans', plan);
    return response.data.data;
  },

  // Listar planos do usuário
  getUserPlans: async (): Promise<WorkoutPlan[]> => {
    const response = await api.get('/workouts/plans');
    return response.data.data;
  },

  // Obter plano específico
  getPlanById: async (id: string): Promise<WorkoutPlan> => {
    const response = await api.get(`/workouts/plans/${id}`);
    return response.data.data;
  },

  // Atualizar plano
  updatePlan: async (id: string, data: Partial<CreateWorkoutPlanDto>): Promise<WorkoutPlan> => {
    const response = await api.put(`/workouts/plans/${id}`, data);
    return response.data.data;
  },

  // Deletar plano
  deletePlan: async (id: string): Promise<void> => {
    await api.delete(`/workouts/plans/${id}`);
  },

  // Registrar treino concluído
  createLog: async (log: {
    workoutId: string;
    duration?: number;
    notes?: string;
    exercises: {
      exerciseId: string;
      sets: number;
      reps: number[];
      weights: number[];
      completed: boolean;
    }[];
  }): Promise<any> => {
    const response = await api.post('/workouts/logs', log);
    return response.data.data;
  },

  // Obter logs de treinos
  getUserLogs: async (limit = 50, offset = 0): Promise<any[]> => {
    const response = await api.get(`/workouts/logs?limit=${limit}&offset=${offset}`);
    return response.data.data;
  },

  // Obter estatísticas
  getStats: async (): Promise<{
    totalWorkouts: number;
    totalMinutes: number;
    recentWorkouts: number;
    currentStreak: number;
  }> => {
    const response = await api.get('/workouts/stats');
    return response.data.data;
  }
};

export { api };
export default api;

