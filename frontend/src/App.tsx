import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Home from './imports/Home';
import { StreakPage } from './components/StreakPage';
import { TreinoPage } from './components/TreinoPage';
import TreinoIniciado from './imports/TreinoIniciado';
import { TreinoIdPage } from './components/TreinoIdPage';
import { ExerciseIdPage } from './components/ExerciseIdPage';
import { TreinoTempoDescansoPage } from './components/TreinoTempoDescansoPage';
import { WorkoutCompletionPage } from './components/WorkoutCompletionPage';
import { MenuBar } from './components/MenuBar';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { OnboardingProvider } from './contexts/OnboardingContext';
import { WorkoutCreatorProvider } from './contexts/WorkoutCreatorContext';
import { WorkoutTimerProvider, useWorkoutTimer } from './contexts/WorkoutTimerContext';
import { OnboardingPersonalInfoPage } from './components/onboarding/OnboardingPersonalInfoPage';
import { OnboardingGoalPage } from './components/onboarding/OnboardingGoalPage';
import { OnboardingTrainingTypesPage } from './components/onboarding/OnboardingTrainingTypesPage';
import { OnboardingSplitPage } from './components/onboarding/OnboardingSplitPage';
import { OnboardingDaysPage } from './components/onboarding/OnboardingDaysPage';
import { OnboardingFinalPage } from './components/onboarding/OnboardingFinalPage';
import { SplashScreen } from './components/splash/SplashScreen';
import { LandingPage } from './components/landing/LandingPage';
import { CreateWorkoutIntro } from './components/workout-creator/CreateWorkoutIntro';
import { CreateWorkoutType } from './components/workout-creator/CreateWorkoutType';
import { CreateWorkoutName } from './components/workout-creator/CreateWorkoutName';
import { CreateWorkoutMuscles } from './components/workout-creator/CreateWorkoutMuscles';
import { CreateWorkoutExercises } from './components/workout-creator/CreateWorkoutExercises';
import { CreateWorkoutConfig } from './components/workout-creator/CreateWorkoutConfig';
import { CreateWorkoutDay } from './components/workout-creator/CreateWorkoutDay';
import { CreateWorkoutReady } from './components/workout-creator/CreateWorkoutReady';
import { PageTransition } from './components/common/PageTransition';
import { MyWorkoutsPage } from './components/MyWorkoutsPage';
import { WorkoutList } from './components/WorkoutList';

type Page = 'home' | 'streak' | 'treino' | 'treino-iniciado' | 'treino-id' | 'exercise-id' | 'treino-tempo-descanso' | 'my-workouts' | 'workout-list';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const { isRunning, elapsedTime, formatTime, stopTimer, resetTimer } = useWorkoutTimer();
  const [currentPage, setCurrentPage] = useState('home' as Page);
  const [showSplash, setShowSplash] = useState(true);
  const [workoutName, setWorkoutName] = useState('Treino');

  // Splash screen timer
  useEffect(() => {
    if (location.pathname === '/' && !isAuthenticated) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        navigate('/landing');
      }, 2500);
      return () => clearTimeout(timer);
    } else {
      setShowSplash(false);
    }
  }, [location.pathname, isAuthenticated, navigate]);

  const handleStopWorkout = () => {
    stopTimer();
    resetTimer();
    setCurrentPage('treino');
  };

  // Sincroniza estado com a URL
  useEffect(() => {
    const path = location.pathname.replace(/^\/+/, '');
    let page = (path.split('/')[0] || 'home') as Page;
    
    // Mapear workout-list para treino
    if (page === 'workout-list') {
      page = 'treino';
    }
    
    // Mapear exercise-id para treino
    if (page === 'exercise-id') {
      page = 'treino';
    }
    
    if (page !== currentPage) setCurrentPage(page);
  }, [location.pathname]);

  const handleMenuNavigate = (page: 'home' | 'streak' | 'treino') => {
    setCurrentPage(page);
    if (page === 'treino') {
      navigate('/workout-list');
    } else {
      navigate(`/${page}`);
    }
  };

  // Verifica em que contexto está
  const isOnboarding = location.pathname.startsWith('/onboarding');
  const isAuth = location.pathname.startsWith('/login') || location.pathname.startsWith('/register');
  const isLanding = location.pathname === '/landing';
  const isSplash = location.pathname === '/' && showSplash;
  const isWorkoutCreator = location.pathname.startsWith('/workout/create');

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-white text-lg">Carregando...</div>
      </div>
    );
  }

  // Splash screen
  if (isSplash && !isAuthenticated) {
    return <SplashScreen />;
  }

  // Redirecionar usuários não autenticados
  if (!isAuthenticated && !isAuth && !isLanding && location.pathname !== '/') {
    return <Navigate to="/landing" replace />;
  }

  // Redirecionar usuários autenticados de landing/login/register
  if (isAuthenticated && (isAuth || isLanding)) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="relative w-full h-screen overflow-y-auto">
      <AnimatePresence mode="wait">
        <Routes location={location}>
          {/* Splash and Landing */}
          <Route path="/" element={<SplashScreen />} />
          <Route path="/landing" element={
            <LandingPage 
              onLogin={() => navigate('/login')}
              onRegister={() => navigate('/register')}
            />
          } />

          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Onboarding routes */}
          <Route path="/onboarding/personal-info" element={<OnboardingPersonalInfoPage />} />
          <Route path="/onboarding/goal" element={<OnboardingGoalPage />} />
          <Route path="/onboarding/training-types" element={<OnboardingTrainingTypesPage />} />
          <Route path="/onboarding/split" element={<OnboardingSplitPage />} />
          <Route path="/onboarding/days" element={<OnboardingDaysPage />} />
          <Route path="/onboarding/final" element={<OnboardingFinalPage />} />

          {/* Workout Creator routes */}
          <Route path="/workout/create/intro" element={<CreateWorkoutIntro />} />
          <Route path="/workout/create/type" element={<CreateWorkoutType />} />
          <Route path="/workout/create/name" element={<CreateWorkoutName />} />
          <Route path="/workout/create/muscles" element={<CreateWorkoutMuscles />} />
          <Route path="/workout/create/exercises" element={<CreateWorkoutExercises />} />
              <Route path="/workout/create/day" element={<CreateWorkoutDay />} />
              <Route path="/workout/create/config" element={<CreateWorkoutConfig />} />
              <Route path="/workout/create/ready" element={<CreateWorkoutReady />} />
          
          {/* Protected routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/pagina" element={<Navigate to="/home" replace />} />
          <Route path="/pagina/home" element={<Navigate to="/home" replace />} />
          <Route path="/streak" element={<StreakPage />} />
          <Route path="/pagina/streak" element={<Navigate to="/streak" replace />} />
          <Route 
            path="/treino" 
            element={<TreinoPage onExerciseClick={(exercise) => navigate('/exercise-id', { state: { exercise } })} />} 
          />
          <Route path="/pagina/treino" element={<Navigate to="/treino" replace />} />
          <Route path="/treino-iniciado" element={<div onClick={() => navigate('/exercise-id')}><TreinoIniciado /></div>} />
          <Route path="/pagina/treino-iniciado" element={<Navigate to="/treino-iniciado" replace />} />
          <Route path="/treino-id" element={<TreinoIdPage />} />
          <Route path="/pagina/treino-id" element={<Navigate to="/treino-id" replace />} />
          <Route path="/exercise-id" element={<ExerciseIdPage />} />
          <Route path="/pagina/exercise-id" element={<Navigate to="/exercise-id" replace />} />
          <Route path="/treino-tempo-descanso" element={<TreinoTempoDescansoPage onFinish={() => navigate('/treino-id', { state: { fromRest: true } })} />} />
          <Route path="/pagina/treino-tempo-descanso" element={<Navigate to="/treino-tempo-descanso" replace />} />
          <Route path="/workout-completion" element={<WorkoutCompletionPage />} />
          <Route path="/my-workouts" element={<MyWorkoutsPage />} />
          <Route path="/workout-list" element={<WorkoutList />} />
          
          {/* fallback */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AnimatePresence>

      {/* Não mostra a MenuBar nas páginas especiais */}
      {!isOnboarding && !isAuth && !isLanding && !isSplash && !isWorkoutCreator && (
        <MenuBar 
          currentPage={currentPage} 
          onNavigate={handleMenuNavigate}
          isWorkoutActive={isRunning}
          workoutTime={formatTime(elapsedTime)}
          workoutName={workoutName}
          onStopWorkout={handleStopWorkout}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <WorkoutCreatorProvider>
          <WorkoutTimerProvider>
            <AppContent />
          </WorkoutTimerProvider>
        </WorkoutCreatorProvider>
      </OnboardingProvider>
    </AuthProvider>
  );
}
