import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { workoutApi, WorkoutPlan } from '../services/api';
import { getMuscleImage, getUniqueMuscles } from '../utils/muscleMapping';
import { useWorkoutTimer } from '../contexts/WorkoutTimerContext';
import { useWorkout } from '../contexts/WorkoutContext';
import { MuscleGroupCarousel } from './workout/MuscleGroupCarousel';
import { WorkoutHeader } from './workout/WorkoutHeader';
import { ExercisesList } from './workout/ExercisesList';

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

export function TreinoIdPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams<{ workoutPlanId?: string }>();
  const { startTimer, stopTimer, resetTimer, isRunning, elapsedTime, formatTime } = useWorkoutTimer();
  
  // Se temos workoutPlanId na URL, usar ele para carregar o treino
  const workoutPlanIdFromUrl = params.workoutPlanId;
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<WorkoutPlan | null>(null);
  const { workoutName, setWorkoutName, setOnStartWorkout } = useWorkout();
  const [musclesWorked, setMusclesWorked] = useState<Array<{ name: string; imageUrl: string }>>([]);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  
  // Ajustar padding-top baseado se o treino está ativo
  const topPadding = useMemo(() => isRunning ? 'pt-[120px]' : 'pt-[98px]', [isRunning]);

  // Carregar planos e workout do dia
  useEffect(() => {
    const loadWorkout = async () => {
      try {
        setLoading(true);
        setError(null);

        // Se veio da lista de treinos, usar dados do estado
        let workoutData = location.state?.workout;
        console.log('Workout data from state:', workoutData);
        
        // Se não temos dados no state mas temos workoutPlanId na URL, carregar do backend
        if (!workoutData && workoutPlanIdFromUrl) {
          console.log('📥 Carregando workout do backend com ID:', workoutPlanIdFromUrl);
          workoutData = await workoutApi.getPlanById(workoutPlanIdFromUrl);
          console.log('✅ Workout carregado do backend:', workoutData);
        }
        
        if (workoutData) {
          setCurrentPlan(workoutData);
          console.log('Full workout data:', workoutData);
          
          // Verificar se tem workouts
          if (workoutData.workouts && workoutData.workouts.length > 0) {
            const workout = workoutData.workouts[0];
            console.log('First workout:', workout);
            console.log('Workout exercises:', workout?.exercises);
            console.log('Workout exercises length:', workout?.exercises?.length);
            console.log('Workout structure:', JSON.stringify(workout, null, 2));
            
            if (workout && workout.exercises && workout.exercises.length > 0) {
              const name = workout.trainingType || workoutName;
              setWorkoutName(name);
              
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
              
              console.log('Mapped exercises:', mappedExercises);
              
              // Verificar estado de conclusão dos exercícios hoje
              try {
                const workoutDayId = workout.id;
                console.log('🔍 Verificando estado de conclusão do workout:', workoutDayId);
                const status = await workoutApi.getWorkoutExercisesStatus(workoutDayId);
                console.log('✅ Estado de conclusão:', status);
                
                // Verificar se o workout inteiro foi concluído
                setWorkoutCompleted(status.workoutCompleted);
                
                // Atualizar exercícios com estado de conclusão
                const exercisesWithStatus = mappedExercises.map(ex => {
                  const exerciseId = ex.id;
                  const isCompleted = status.exercises[exerciseId] === true;
                  console.log(`📋 Exercício ${ex.name} (${exerciseId}): ${isCompleted ? 'CONCLUÍDO' : 'PENDENTE'}`);
                  return {
                    ...ex,
                    completed: isCompleted
                  };
                });
                
                setExercises(exercisesWithStatus);
              } catch (statusErr) {
                console.error('Erro ao verificar estado de conclusão:', statusErr);
                // Se der erro, usar exercícios sem status
              setExercises(mappedExercises);
                setWorkoutCompleted(false);
              }
              
              // Extrair músculos únicos trabalhados (será calculado com useMemo depois)
              const uniqueMuscles = getUniqueMuscles(mappedExercises);
              const musclesWithImages = uniqueMuscles.map(muscle => ({
                name: muscle,
                imageUrl: getMuscleImage(muscle)
              }));
              setMusclesWorked(musclesWithImages);
            } else {
              console.log('No exercises in workout');
              setExercises([]);
            }
          } else {
            console.log('No workouts in plan');
            setExercises([]);
          }
        } else {
          // Fallback: carregar do backend
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
            
            // Verificar estado de conclusão dos exercícios hoje
            try {
              const workoutDayId = workout.id;
              const status = await workoutApi.getWorkoutExercisesStatus(workoutDayId);
              
              // Verificar se o workout inteiro foi concluído
              setWorkoutCompleted(status.workoutCompleted);
              
              // Atualizar exercícios com estado de conclusão
              const exercisesWithStatus = mappedExercises.map(ex => {
                const exerciseId = ex.id;
                const isCompleted = status.exercises[exerciseId] === true;
                return {
                  ...ex,
                  completed: isCompleted
                };
              });
              
              setExercises(exercisesWithStatus);
            } catch (statusErr) {
              console.error('Erro ao verificar estado de conclusão:', statusErr);
            setExercises(mappedExercises);
              setWorkoutCompleted(false);
            }
            
            // Extrair músculos únicos trabalhados
            const uniqueMuscles = getUniqueMuscles(mappedExercises);
            const musclesWithImages = uniqueMuscles.map(muscle => ({
              name: muscle,
              imageUrl: getMuscleImage(muscle)
            }));
            setMusclesWorked(musclesWithImages);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar treino:', err);
        setError('Erro ao carregar treino do dia.');
      } finally {
        setLoading(false);
      }
    };

    loadWorkout();
  }, [location.state, workoutPlanIdFromUrl]);

  // Verifica se um exercício foi concluído
  useEffect(() => {
    if (location.state?.exerciseCompleted && location.state?.allSeriesCompleted) {
      const exerciseName = location.state.exerciseName;
      const exerciseId = location.state.exerciseId;
      
      // Só marca como concluído se todas as séries foram completadas
      setExercises(prevExercises => 
        prevExercises.map(exercise => 
          (exercise.name === exerciseName || exercise.id === exerciseId)
            ? { ...exercise, completed: true, improvement: { type: 'weight', value: '5kg' } }
            : exercise
        )
      );
    }
  }, [location.state]);

  const handleStartWorkout = useCallback(() => {
    // Bloquear se o workout já foi concluído hoje
    if (workoutCompleted) {
      console.log('⚠️ Workout já foi concluído hoje');
      return;
    }
    
    if (exercises.length > 0) {
      // Resetar e iniciar o timer
      resetTimer();
      startTimer();
      
      const workoutPlanId = currentPlan?.id || workoutPlanIdFromUrl;
      const workoutId = currentPlan?.workouts?.[0]?.id;
      const firstExercise = exercises[0];
      
      // Usar rota semântica se temos os IDs necessários
      if (workoutPlanId && workoutId && firstExercise?.id) {
        navigate(`/treino/${workoutPlanId}/${workoutId}/${firstExercise.id}`, {
          state: {
            workout: currentPlan,
            currentExerciseIndex: 0,
            fromWorkout: true
          }
        });
      } else {
        // Fallback para rota legada
      navigate('/exercise-id', {
        state: {
          workout: currentPlan,
          currentExerciseIndex: 0,
          fromWorkout: true
        }
      });
    }
    }
  }, [workoutCompleted, exercises, currentPlan, workoutPlanIdFromUrl, resetTimer, startTimer, navigate]);
  
  // Registrar callback e nome do workout no contexto
  useEffect(() => {
    setOnStartWorkout(() => handleStartWorkout);
    return () => setOnStartWorkout(null);
  }, [setOnStartWorkout, exercises.length, workoutCompleted, currentPlan, workoutPlanIdFromUrl]);

  const handleExerciseClick = useCallback((exercise: Exercise) => {
    const exerciseIndex = exercises.findIndex(ex => ex.id === exercise.id);
    const workoutPlanId = currentPlan?.id || workoutPlanIdFromUrl;
    const workoutId = currentPlan?.workouts?.[0]?.id;
    
    // Usar rota semântica se temos os IDs necessários
    if (workoutPlanId && workoutId && exercise.id) {
      navigate(`/treino/${workoutPlanId}/${workoutId}/${exercise.id}`, {
        state: {
          exercise: exercise,
          workout: currentPlan,
          currentExerciseIndex: exerciseIndex,
          fromWorkout: true
        }
      });
    } else {
      // Fallback para rota legada
    navigate('/exercise-id', {
      state: {
          exercise: exercise,
        workout: currentPlan,
        currentExerciseIndex: exerciseIndex,
        fromWorkout: true
      }
    });
    }
  }, [exercises, currentPlan, workoutPlanIdFromUrl, navigate]);

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
          Este treino não possui exercícios. Volte para a lista e escolha outro treino.
        </p>
        <button
          onClick={() => navigate('/workout-list')}
          className="bg-[#d9d9d9] px-6 py-3 rounded-full text-[#202020] font-['Alexandria:Medium',_sans-serif]"
        >
          Voltar para Lista
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#181818] fixed inset-0 flex flex-col" data-name="treino">
      {/* Container com scroll */}
      <div className={`flex-1 overflow-y-auto overflow-x-hidden px-5 ${topPadding} pb-5`}>
        <div className="flex flex-col gap-[18px] max-w-[393px] mx-auto">
          <WorkoutHeader workoutName={workoutName} />
          
          <MuscleGroupCarousel muscles={musclesWorked} />

          <ExercisesList exercises={exercises} onExerciseClick={handleExerciseClick} />
          
          {workoutCompleted && (
            <div className="bg-[#6D9F28] box-border content-stretch flex flex-col gap-[10px] h-[50px] items-center justify-center px-[106px] py-[14px] relative rounded-[999px] shrink-0 w-full max-w-[393px] mx-auto">
              <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-white text-[16px] text-nowrap whitespace-pre">
                Treino Concluído Hoje
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}