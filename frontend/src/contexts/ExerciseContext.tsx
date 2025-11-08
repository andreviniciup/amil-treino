import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';

interface ExerciseContextType {
  allSeriesCompleted: boolean;
  exerciseCompleted: boolean;
  setAllSeriesCompleted: (value: boolean) => void;
  setExerciseCompleted: (value: boolean) => void;
  onCompleteExercise: (() => void) | null;
  setOnCompleteExercise: (callback: (() => void) | null) => void;
}

const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined);

export function ExerciseProvider({ children }: { children: ReactNode }) {
  const [allSeriesCompleted, setAllSeriesCompleted] = useState(false);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [onCompleteExercise, setOnCompleteExercise] = useState<(() => void) | null>(null);

  // Memoizar o valor do contexto para evitar recriações desnecessárias
  const contextValue = useMemo(() => ({
    allSeriesCompleted,
    exerciseCompleted,
    setAllSeriesCompleted,
    setExerciseCompleted,
    onCompleteExercise,
    setOnCompleteExercise,
  }), [allSeriesCompleted, exerciseCompleted, onCompleteExercise]);

  return (
    <ExerciseContext.Provider value={contextValue}>
      {children}
    </ExerciseContext.Provider>
  );
}

export function useExercise() {
  const context = useContext(ExerciseContext);
  if (context === undefined) {
    throw new Error('useExercise must be used within an ExerciseProvider');
  }
  return context;
}

