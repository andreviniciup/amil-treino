import { useLocation } from 'react-router-dom';
import { NavigationMenuBar } from './NavigationMenuBar';
import { WorkoutActionBar } from './WorkoutActionBar';
import { ExerciseCompleteBar } from './ExerciseCompleteBar';
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
  
  const workoutTime = formatTime(elapsedTime);
  
  // Páginas que não devem mostrar menubar
  const isWorkoutCompletion = location.pathname === '/workout-completion';
  const isOnboarding = location.pathname.startsWith('/onboarding');
  const isAuth = location.pathname.startsWith('/login') || location.pathname.startsWith('/register');
  const isLanding = location.pathname === '/landing';
  const isSplash = location.pathname === '/';
  const isWorkoutCreator = location.pathname.startsWith('/workout/create');

  if (isWorkoutCompletion || isOnboarding || isAuth || isLanding || isSplash || isWorkoutCreator) {
    return null;
  }

  // Páginas principais - mostrar NavigationMenuBar
  const isMainPage = 
    location.pathname === '/home' || 
    location.pathname === '/streak' || 
    location.pathname === '/workout-list' ||
    location.pathname === '/my-workouts';

  if (isMainPage) {
    return (
      <div className="fixed bottom-[20px] left-1/2 -translate-x-1/2 z-50">
        <NavigationMenuBar currentPage={currentPage} onNavigate={onNavigate} />
      </div>
    );
  }

  // Página de treino (TreinoIdPage) - mostrar WorkoutActionBar
  const isTreinoIdPage = 
    location.pathname.startsWith('/treino/') && 
    !location.pathname.includes('/descanso') &&
    location.pathname.split('/').length === 3; // /treino/:workoutPlanId

  if (isTreinoIdPage || location.pathname === '/treino-id') {
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

  // Página de exercício (ExerciseIdPage) - mostrar ExerciseCompleteBar
  const isExerciseIdPage = 
    location.pathname.startsWith('/treino/') && 
    !location.pathname.includes('/descanso') &&
    location.pathname.split('/').length === 5; // /treino/:workoutPlanId/:workoutId/:exerciseId

  if (isExerciseIdPage || location.pathname === '/exercise-id') {
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

  // Página de descanso - mostrar apenas timer
  const isRestPage = 
    location.pathname.includes('/descanso') || 
    location.pathname === '/treino-tempo-descanso';

  if (isRestPage) {
    return (
      <div className="fixed bottom-[20px] left-1/2 -translate-x-1/2 z-50">
        <div className="w-[320px] h-[40px] px-[32px] py-[11px] bg-[#222222] rounded-[99px] flex flex-col items-start justify-start gap-[10px]">
          <div className="w-full flex items-center justify-end">
            <div className="flex items-center justify-center gap-[10px]">
              <div className="flex items-end justify-center">
                <div className="text-[#FDCB1A] text-[14px] font-['Alexandria:Medium',_sans-serif] font-medium">
                  {workoutTime}
                </div>
                <div className="text-center text-[#484848] text-[12px] font-['Alexandria:Regular',_sans-serif] font-normal">
                  min
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback - mostrar NavigationMenuBar
  return (
    <div className="fixed bottom-[20px] left-1/2 -translate-x-1/2 z-50">
      <NavigationMenuBar currentPage={currentPage} onNavigate={onNavigate} />
    </div>
  );
}

