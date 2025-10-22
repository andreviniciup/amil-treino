import { Request } from 'express';

// Extend Express Request to include user
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

// ExerciseDB API Types
export interface ExerciseDBExercise {
  id: string;
  name: string;
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  target: string;
  secondaryMuscles: string[];
  instructions: string[];
}

// Workout Plan Types
export interface CreateWorkoutPlanDto {
  name: string;
  description?: string;
  frequency: number;
  trainingTypes: string[];
  workouts: CreateWorkoutDto[];
}

export interface CreateWorkoutDto {
  dayOfWeek: string;
  trainingType: string;
  exercises: CreateWorkoutExerciseDto[];
}

export interface CreateWorkoutExerciseDto {
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

// Workout Log Types
export interface CreateWorkoutLogDto {
  workoutId: string;
  duration?: number;
  notes?: string;
  exercises: CreateExerciseLogDto[];
}

export interface CreateExerciseLogDto {
  exerciseId: string;
  sets: number;
  reps: number[];
  weights: number[];
  completed: boolean;
}

// User Types
export interface RegisterDto {
  email: string;
  name: string;
  password: string;
  age?: number;
  gender?: string;
  weight?: number;
  height?: number;
  fitnessGoal?: string;
  trainingDays?: string[];
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UpdateProfileDto {
  name?: string;
  age?: number;
  gender?: string;
  weight?: number;
  height?: number;
  fitnessGoal?: string;
  trainingDays?: string[];
}

