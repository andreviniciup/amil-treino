import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ExerciseCard } from './ExerciseCard';
import svgPaths from "../imports/svg-c71qf4vhvy";
import { workoutApi, WorkoutPlan } from '../services/api';

interface TreinoPageProps {
  onExerciseClick: (exercise: Exercise) => void;
}

interface Exercise {
  id: string;
  name: string;
  sets: number;
  completed: boolean;
  improvement?: {
    type: 'weight' | 'reps';
    value: string;
  };
  // Dados adicionais do exercício
  gifUrl?: string;
  bodyPart?: string;
  equipment?: string;
  target?: string;
  reps?: string;
  restTime?: number;
}

function MuscleGroup({ label }: { label: string }) {
  return (
    <div className="bg-[#202020] border border-[#252525] box-border content-stretch flex flex-col gap-[10px] items-center justify-center px-[20px] py-[20px] relative rounded-[20px] shrink-0 w-[120px] h-[120px] min-w-[120px]">
      <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[10px] text-white w-[80px] text-center">{label}</p>
    </div>
  );
}

export function TreinoPage({ onExerciseClick }: TreinoPageProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<WorkoutPlan | null>(null);
  const [workoutName, setWorkoutName] = useState<string>('Treino');

  // Carregar planos e workout do dia
  useEffect(() => {
    const loadWorkout = async () => {
      try {
        setLoading(true);
        setError(null);

        const plans = await workoutApi.getUserPlans();
        
        if (plans.length === 0) {
          setExercises([]);
          setLoading(false);
          return;
        }

        // Pegar o primeiro plano (pode ser ajustado para selecionar por dia da semana)
        const plan = plans[0];
        setCurrentPlan(plan);

        // Pegar o primeiro workout do plano
        const workout = plan.workouts[0];
        
        if (workout) {
          setWorkoutName(workout.trainingType);
          
          // Mapear exercícios do workout
          const mappedExercises: Exercise[] = workout.exercises.map(ex => ({
            id: ex.id,
            name: ex.exerciseName,
            sets: ex.sets,
            completed: false,
            // Adicionar dados completos do exercício
            gifUrl: ex.gifUrl,
            bodyPart: ex.bodyPart,
            equipment: ex.equipment,
            target: ex.target,
            reps: ex.reps,
            restTime: ex.restTime
          }));
          
          setExercises(mappedExercises);
        }
      } catch (err) {
        console.error('Erro ao carregar treino:', err);
        setError('Erro ao carregar treino do dia.');
      } finally {
        setLoading(false);
      }
    };

    loadWorkout();
  }, []);

  // Verifica se um exercício foi concluído
  useEffect(() => {
    if (location.state?.exerciseCompleted) {
      const exerciseName = location.state.exerciseName;
      setExercises(prevExercises => 
        prevExercises.map(exercise => 
          exercise.name === exerciseName 
            ? { ...exercise, completed: true, improvement: { type: 'weight', value: '5kg' } }
            : exercise
        )
      );
    }
  }, [location.state]);

  if (loading) {
    return (
      <div className="bg-[#181818] relative size-full flex items-center justify-center" data-name="treino">
        <p className="text-white text-[18px] font-['Alexandria:Regular',_sans-serif]">
          Carregando treino...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#181818] relative size-full flex flex-col items-center justify-center gap-4" data-name="treino">
        <p className="text-red-400 text-[18px] font-['Alexandria:Regular',_sans-serif]">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#d9d9d9] px-6 py-3 rounded-full text-[#202020] font-['Alexandria:Medium',_sans-serif]"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="bg-[#181818] relative size-full flex flex-col items-center justify-center gap-4" data-name="treino">
        <p className="text-white text-[18px] font-['Alexandria:Regular',_sans-serif] text-center px-8">
          Você ainda não tem treinos. Crie seu primeiro plano!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#181818] relative size-full overflow-hidden" data-name="treino">
      <div className="absolute content-stretch flex flex-col gap-[18px] items-start left-[20px] top-[98px] right-[20px] pb-[100px]">
        {/* Header */}
        <div className="content-stretch flex font-['Alexandria:Regular',_sans-serif] font-normal items-center justify-between leading-[normal] relative shrink-0 text-[20px] text-nowrap w-full whitespace-pre">
          <p className="relative shrink-0 text-white">Hoje</p>
          <p className="relative shrink-0 text-[#2c2c2c]">{workoutName}</p>
        </div>
        
        {/* Muscle Groups Carousel */}
        <div className="relative w-full">
          <div 
            ref={scrollRef}
            className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full overflow-x-auto scrollbar-hide touch-pan-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <MuscleGroup label="vector com musculo trabalhado" />
            <MuscleGroup label="vector com musculo trabalhado" />
            <MuscleGroup label="vector com musculo trabalhado" />
            <MuscleGroup label="vector com musculo trabalhado" />
            <MuscleGroup label="vector com musculo trabalhado" />
          </div>
        </div>

        {/* Exercises List */}
        <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
          {exercises.map((exercise, index) => (
            <ExerciseCard 
              key={exercise.id}
              name={exercise.name}
              sets={exercise.sets}
              completed={exercise.completed}
              improvement={exercise.improvement}
              onExerciseClick={() => onExerciseClick(exercise)}
              defaultExpanded={index === 0}
            />
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
