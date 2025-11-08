import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';

interface WorkoutTimerContextType {
  isRunning: boolean;
  elapsedTime: number; // em segundos
  startTimer: () => void;
  pauseTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  formatTime: (seconds: number) => string;
}

const WorkoutTimerContext = createContext<WorkoutTimerContextType | undefined>(undefined);

export function WorkoutTimerProvider({ children }: { children: ReactNode }) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const startTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const stopTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setElapsedTime(0);
  }, []);

  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const contextValue = useMemo(() => ({
    isRunning,
    elapsedTime,
    startTimer,
    pauseTimer,
    stopTimer,
    resetTimer,
    formatTime,
  }), [isRunning, elapsedTime, startTimer, pauseTimer, stopTimer, resetTimer, formatTime]);

  return (
    <WorkoutTimerContext.Provider value={contextValue}>
      {children}
    </WorkoutTimerContext.Provider>
  );
}

export function useWorkoutTimer() {
  const context = useContext(WorkoutTimerContext);
  if (context === undefined) {
    throw new Error('useWorkoutTimer must be used within a WorkoutTimerProvider');
  }
  return context;
}
