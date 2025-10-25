import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ExerciseDB } from '../services/api';

interface WorkoutData {
  tipoTreino: string | null;
  nomeTreino: string | null;
  musculos: string[];
  exercises?: ExerciseDB[];
  series?: string;
  hasWarmup?: boolean;
  reps?: string;
  restTime?: number;
  trainingDays?: string[];
}

interface WorkoutCreatorContextType {
  workoutData: WorkoutData;
  setTipoTreino: (tipo: string) => void;
  setNomeTreino: (nome: string) => void;
  setMusculos: (musculos: string[]) => void;
  updateWorkoutData: (data: Partial<WorkoutData>) => void;
  resetWorkoutData: () => void;
  resetWorkout: () => void;
}

const WorkoutCreatorContext = createContext<WorkoutCreatorContextType | undefined>(undefined);

export function WorkoutCreatorProvider({ children }: { children: ReactNode }) {
  const [workoutData, setWorkoutData] = useState<WorkoutData>({
    tipoTreino: null,
    nomeTreino: null,
    musculos: [],
    trainingDays: [],
  });

  const setTipoTreino = (tipo: string) => {
    setWorkoutData((prev) => ({ ...prev, tipoTreino: tipo }));
  };

  const setNomeTreino = (nome: string) => {
    setWorkoutData((prev) => ({ ...prev, nomeTreino: nome }));
  };

  const setMusculos = (musculos: string[]) => {
    setWorkoutData((prev) => ({ ...prev, musculos }));
  };

  const updateWorkoutData = (data: Partial<WorkoutData>) => {
    setWorkoutData((prev) => ({ ...prev, ...data }));
  };

  const resetWorkoutData = () => {
    setWorkoutData({
      tipoTreino: null,
      nomeTreino: null,
      musculos: [],
      exercises: [],
      series: '',
      hasWarmup: undefined,
      reps: '',
    });
  };

  const resetWorkout = () => {
    setWorkoutData({
      tipoTreino: null,
      nomeTreino: null,
      musculos: [],
    });
  };

  return (
    <WorkoutCreatorContext.Provider
      value={{
        workoutData,
        setTipoTreino,
        setNomeTreino,
        setMusculos,
        updateWorkoutData,
        resetWorkoutData,
        resetWorkout,
      }}
    >
      {children}
    </WorkoutCreatorContext.Provider>
  );
}

export function useWorkoutCreator() {
  const context = useContext(WorkoutCreatorContext);
  if (context === undefined) {
    throw new Error('useWorkoutCreator must be used within a WorkoutCreatorProvider');
  }
  return context;
}

