import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';

interface WorkoutContextType {
  workoutName: string;
  setWorkoutName: (name: string) => void;
  onStartWorkout: (() => void) | null;
  setOnStartWorkout: (callback: (() => void) | null) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [workoutName, setWorkoutName] = useState('Treino');
  const [onStartWorkout, setOnStartWorkout] = useState<(() => void) | null>(null);

  const handleSetWorkoutName = useCallback((name: string) => {
    setWorkoutName(name);
  }, []);

  const handleSetOnStartWorkout = useCallback((callback: (() => void) | null) => {
    setOnStartWorkout(callback);
  }, []);

  const contextValue = useMemo(() => ({
    workoutName,
    setWorkoutName: handleSetWorkoutName,
    onStartWorkout,
    setOnStartWorkout: handleSetOnStartWorkout,
  }), [workoutName, handleSetWorkoutName, onStartWorkout, handleSetOnStartWorkout]);

  return (
    <WorkoutContext.Provider value={contextValue}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
}

