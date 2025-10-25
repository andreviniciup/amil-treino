// Exemplo de como adicionar o LogViewer no seu App.tsx

// 1. Adicione no topo do arquivo (com os outros imports):
import LogViewer from './components/LogViewer';

// 2. Adicione antes do fechamento do componente principal (antes do último </div>):
// Logo após </AnimatePresence> e antes de fechar o div principal

function AppContent() {
  // ... seu código existente ...

  return (
    <div className="app-container">
      {/* ... todo seu conteúdo existente ... */}
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* ... suas rotas ... */}
        </Routes>
      </AnimatePresence>

      {/* Adicione aqui - Log Viewer (apenas em desenvolvimento) */}
      {import.meta.env.DEV && <LogViewer />}
      
    </div>
  );
}

// ============================
// EXEMPLOS DE INTEGRAÇÃO
// ============================

// Exemplo 1: LoginPage.tsx
import logService from '../services/logService';

const LoginPage = () => {
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password);
      
      // Log de sucesso
      logService.logLogin(response.user.id, 'email');
      
      navigate('/home');
    } catch (error) {
      logService.logError(error as Error, 'Login failed');
    }
  };
};

// Exemplo 2: TreinoPage.tsx
import { useLogger } from '../hooks/useLogger';

const TreinoPage = () => {
  const { logClick, logWorkoutStart } = useLogger();
  
  const handleStartWorkout = (workoutId: string) => {
    logClick('button-start-workout', { workoutId });
    logWorkoutStart(workoutId);
    
    navigate(`/treino/${workoutId}`);
  };
};

// Exemplo 3: ExerciseCard.tsx
import logService from '../services/logService';

const ExerciseCard = ({ exercise }) => {
  const handleClick = () => {
    logService.logExerciseSelect(exercise.id, exercise.nome);
    logService.logClick('exercise-card', window.location.pathname, {
      exerciseId: exercise.id,
      musculo: exercise.musculo,
      category: exercise.categoria
    });
    
    navigate(`/exercise/${exercise.id}`);
  };
};

// Exemplo 4: API Service - api.ts
import logService from './logService';

export const api = {
  async fetchWorkouts() {
    try {
      const response = await fetch('/api/workouts');
      logService.logApiCall('/api/workouts', 'GET', response.status);
      return await response.json();
    } catch (error) {
      logService.logError(error as Error, 'Failed to fetch workouts');
      throw error;
    }
  }
};

// Exemplo 5: Workout Complete (TreinoIdConcluidoPage.tsx)
const TreinoIdConcluidoPage = () => {
  useEffect(() => {
    const duration = Date.now() - workoutStartTime;
    logService.logWorkoutComplete(workoutId, duration);
  }, []);
};

// Para visualizar logs no console do navegador:
// 1. Abra DevTools (F12)
// 2. Digite no console:
//    logService.printSummary()
//    logService.getLogs()
//    logService.getLogsByAction('WORKOUT_START')

// Para abrir o Log Viewer visual:
// Pressione CTRL+L em qualquer lugar da aplicação
