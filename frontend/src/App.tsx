import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Home from './imports/Home';
import { StreakPage } from './components/StreakPage';
import { TreinoPage } from './components/TreinoPage';
import TreinoIniciado from './imports/TreinoIniciado';
import { TreinoIdPage } from './components/TreinoIdPage';
import { TreinoTempoDescansoPage } from './components/TreinoTempoDescansoPage';
import { MenuBar } from './components/MenuBar';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { OnboardingProvider } from './contexts/OnboardingContext';
import { WorkoutCreatorProvider } from './contexts/WorkoutCreatorContext';
import { OnboardingPersonalInfoPage } from './components/onboarding/OnboardingPersonalInfoPage';
import { OnboardingGoalPage } from './components/onboarding/OnboardingGoalPage';
import { OnboardingTrainingTypesPage } from './components/onboarding/OnboardingTrainingTypesPage';
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
import { CreateWorkoutReady } from './components/workout-creator/CreateWorkoutReady';
import { PageTransition } from './components/common/PageTransition';
import { MyWorkoutsPage } from './components/MyWorkoutsPage';

type Page = 'home' | 'streak' | 'treino' | 'treino-iniciado' | 'treino-id' | 'treino-tempo-descanso' | 'my-workouts';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('home' as Page);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [showSplash, setShowSplash] = useState(true);

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

  // Timer for workout
  useEffect(() => {
    let interval: any;
    
    if (isWorkoutActive) {
      interval = setInterval(() => {
        setWorkoutTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWorkoutActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStartWorkout = () => {
    setIsWorkoutActive(true);
    setWorkoutTime(0);
  };

  const handleStopWorkout = () => {
    setIsWorkoutActive(false);
    setWorkoutTime(0);
    setCurrentPage('treino');
  };

  // Sincroniza estado com a URL
  useEffect(() => {
    const path = location.pathname.replace(/^\/+/, '');
    const page = (path.split('/')[0] || 'home') as Page;
    if (page !== currentPage) setCurrentPage(page);
  }, [location.pathname]);

  const handleMenuNavigate = (page: 'home' | 'streak' | 'treino') => {
    setCurrentPage(page);
    navigate(`/${page}`);
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
    <div className="relative w-full h-screen overflow-hidden">
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
          <Route path="/onboarding/days" element={<OnboardingDaysPage />} />
          <Route path="/onboarding/final" element={<OnboardingFinalPage />} />

          {/* Workout Creator routes */}
          <Route path="/workout/create/intro" element={<CreateWorkoutIntro />} />
          <Route path="/workout/create/type" element={<CreateWorkoutType />} />
          <Route path="/workout/create/name" element={<CreateWorkoutName />} />
          <Route path="/workout/create/muscles" element={<CreateWorkoutMuscles />} />
          <Route path="/workout/create/exercises" element={<CreateWorkoutExercises />} />
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
            element={<TreinoPage onStartWorkout={handleStartWorkout} onExerciseClick={(exercise) => navigate('/treino-id', { state: { exercise } })} />} 
          />
          <Route path="/pagina/treino" element={<Navigate to="/treino" replace />} />
          <Route path="/treino-iniciado" element={<div onClick={() => navigate('/treino-id')}><TreinoIniciado /></div>} />
          <Route path="/pagina/treino-iniciado" element={<Navigate to="/treino-iniciado" replace />} />
          <Route path="/treino-id" element={<TreinoIdPage />} />
          <Route path="/pagina/treino-id" element={<Navigate to="/treino-id" replace />} />
          <Route path="/treino-tempo-descanso" element={<TreinoTempoDescansoPage onFinish={() => navigate('/treino-id', { state: { fromRest: true } })} />} />
          <Route path="/pagina/treino-tempo-descanso" element={<Navigate to="/treino-tempo-descanso" replace />} />
          <Route path="/my-workouts" element={<MyWorkoutsPage />} />
          
          {/* fallback */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AnimatePresence>

      {/* Não mostra a MenuBar nas páginas especiais */}
      {!isOnboarding && !isAuth && !isLanding && !isSplash && !isWorkoutCreator && (
        <MenuBar 
          currentPage={currentPage} 
          onNavigate={handleMenuNavigate}
          isWorkoutActive={isWorkoutActive}
          workoutTime={formatTime(workoutTime)}
          workoutName="Treino de Peito"
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
          <AppContent />
        </WorkoutCreatorProvider>
      </OnboardingProvider>
    </AuthProvider>
  );
}
