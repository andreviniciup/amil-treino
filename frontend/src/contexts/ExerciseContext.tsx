import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';

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
  const [onCompleteExercise, setOnCompleteExerciseState] = useState<(() => void) | null>(null);

  // Memoizar setters com useCallback para evitar recriações
  const handleSetAllSeriesCompleted = useCallback((value: boolean) => {
    setAllSeriesCompleted(value);
  }, []);

  const handleSetExerciseCompleted = useCallback((value: boolean) => {
    setExerciseCompleted(value);
  }, []);

  const handleSetOnCompleteExercise = useCallback((callback: (() => void) | null) => {
    setOnCompleteExerciseState(callback);
  }, []);

  // Memoizar o valor do contexto para evitar recriações desnecessárias
  const contextValue = useMemo(() => ({
    allSeriesCompleted,
    exerciseCompleted,
    setAllSeriesCompleted: handleSetAllSeriesCompleted,
    setExerciseCompleted: handleSetExerciseCompleted,
    onCompleteExercise,
    setOnCompleteExercise: handleSetOnCompleteExercise,
  }), [allSeriesCompleted, exerciseCompleted, onCompleteExercise, handleSetAllSeriesCompleted, handleSetExerciseCompleted, handleSetOnCompleteExercise]);

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

