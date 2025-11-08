import React, { createContext, useContext, useState, ReactNode } from 'react';

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

  return (
    <WorkoutContext.Provider
      value={{
        workoutName,
        setWorkoutName,
        onStartWorkout,
        setOnStartWorkout,
      }}
    >
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

