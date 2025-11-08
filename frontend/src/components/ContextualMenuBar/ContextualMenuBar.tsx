import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { NavigationMenuBar } from './NavigationMenuBar';
import { WorkoutActionBar } from './WorkoutActionBar';
import { ExerciseCompleteBar } from './ExerciseCompleteBar';
import { RestTimerBar } from './RestTimerBar';
import { useWorkoutTimer } from '../../contexts/WorkoutTimerContext';

interface ContextualMenuBarProps {
  currentPage: string;
  onNavigate: (page: 'home' | 'streak' | 'treino') => void;
  workoutName?: string;
  onStartWorkout?: () => void;
  // Props para ExerciseCompleteBar
  allSeriesCompleted?: boolean;
  exerciseCompleted?: boolean;
  onCompleteExercise?: () => void;
}

export function ContextualMenuBar({
  currentPage,
  onNavigate,
  workoutName = 'Treino',
  onStartWorkout,
  allSeriesCompleted = false,
  exerciseCompleted = false,
  onCompleteExercise
}: ContextualMenuBarProps) {
  const location = useLocation();
  const { isRunning, elapsedTime, formatTime } = useWorkoutTimer();
  
  const workoutTime = useMemo(() => formatTime(elapsedTime), [formatTime, elapsedTime]);
  
  // Páginas que não devem mostrar menubar (memoizado)
  const shouldHideMenubar = useMemo(() => {
    const isWorkoutCompletion = location.pathname === '/workout-completion';
    const isOnboarding = location.pathname.startsWith('/onboarding');
    const isAuth = location.pathname.startsWith('/login') || location.pathname.startsWith('/register');
    const isLanding = location.pathname === '/landing';
    const isSplash = location.pathname === '/';
    const isWorkoutCreator = location.pathname.startsWith('/workout/create');
    
    return isWorkoutCompletion || isOnboarding || isAuth || isLanding || isSplash || isWorkoutCreator;
  }, [location.pathname]);

  // Páginas principais - mostrar NavigationMenuBar (memoizado)
  const isMainPage = useMemo(() => 
    location.pathname === '/home' || 
    location.pathname === '/streak' || 
    location.pathname === '/workout-list' ||
    location.pathname === '/my-workouts',
    [location.pathname]
  );

  // Página de treino (TreinoIdPage) - mostrar WorkoutActionBar (memoizado)
  const isTreinoIdPage = useMemo(() => {
    return (location.pathname.startsWith('/treino/') && 
      !location.pathname.includes('/descanso') &&
      location.pathname.split('/').length === 3) || // /treino/:workoutPlanId
      location.pathname === '/treino-id';
  }, [location.pathname]);

  // Página de exercício (ExerciseIdPage) - mostrar ExerciseCompleteBar (memoizado)
  const isExerciseIdPage = useMemo(() => {
    return (location.pathname.startsWith('/treino/') && 
      !location.pathname.includes('/descanso') &&
      location.pathname.split('/').length === 5) || // /treino/:workoutPlanId/:workoutId/:exerciseId
      location.pathname === '/exercise-id';
  }, [location.pathname]);

  // Página de descanso - mostrar apenas timer (memoizado)
  const isRestPage = useMemo(() => 
    location.pathname.includes('/descanso') || 
    location.pathname === '/treino-tempo-descanso',
    [location.pathname]
  );

  if (shouldHideMenubar) {
    return null;
  }

  if (isMainPage) {
    return (
      <div className="fixed bottom-[20px] left-1/2 -translate-x-1/2 z-50">
        <NavigationMenuBar currentPage={currentPage} onNavigate={onNavigate} />
      </div>
    );
  }

  if (isTreinoIdPage) {
    return (
      <div className="fixed bottom-[20px] left-1/2 -translate-x-1/2 z-50">
        <WorkoutActionBar
          workoutName={workoutName}
          workoutTime={workoutTime}
          isWorkoutActive={isRunning}
          onStartWorkout={onStartWorkout}
        />
      </div>
    );
  }

  if (isExerciseIdPage) {
    return (
      <div className="fixed bottom-[20px] left-1/2 -translate-x-1/2 z-50">
        <ExerciseCompleteBar
          workoutTime={workoutTime}
          allSeriesCompleted={allSeriesCompleted}
          exerciseCompleted={exerciseCompleted}
          onComplete={onCompleteExercise || (() => {})}
        />
      </div>
    );
  }

  if (isRestPage) {
    return <RestTimerBar workoutTime={workoutTime} />;
  }

  // Fallback - mostrar NavigationMenuBar
  return (
    <div className="fixed bottom-[20px] left-1/2 -translate-x-1/2 z-50">
      <NavigationMenuBar currentPage={currentPage} onNavigate={onNavigate} />
    </div>
  );
}

