import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PersonalInfo {
  nome: string;
  idade: string;
  genero: string;
  peso: string;
  altura: string;
}

interface OnboardingContextType {
  personalInfo: PersonalInfo | null;
  interests: string[];
  workouts: string[];
  trainingDays: string[];
  setPersonalInfo: (info: PersonalInfo) => void;
  setInterests: (interests: string[]) => void;
  setWorkouts: (workouts: string[]) => void;
  setTrainingDays: (days: string[]) => void;
  isOnboardingComplete: () => boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [workouts, setWorkouts] = useState<string[]>([]);
  const [trainingDays, setTrainingDays] = useState<string[]>([]);

  const isOnboardingComplete = () => {
    return localStorage.getItem('onboarding-complete') === 'true';
  };

  return (
    <OnboardingContext.Provider
      value={{
        personalInfo,
        interests,
        workouts,
        trainingDays,
        setPersonalInfo,
        setInterests,
        setWorkouts,
        setTrainingDays,
        isOnboardingComplete,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}





