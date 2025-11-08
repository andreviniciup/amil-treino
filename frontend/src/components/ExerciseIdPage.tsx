import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { AnimatedExerciseImage } from "./AnimatedExerciseImage";
import { SeriesCard } from "./SeriesCard";
import { WeeklyProgressBar } from "./exercise/WeeklyProgressBar";
import { workoutApi, exerciseApi, WorkoutPlan } from "../services/api";
import { useWorkoutTimer } from "../contexts/WorkoutTimerContext";
import { useExercise } from "../contexts/ExerciseContext";
import { BackButton } from "./BackButton";

interface SeriesData {
  repetitions: string;
  weight: string;
  restTime: string;
  status: "active" | "pending" | "completed";
  actualReps?: number;
  actualWeight?: number;
  actualRestTime?: number;
}

export function ExerciseIdPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ workoutPlanId?: string; workoutId?: string; exerciseId?: string }>();
  const { stopTimer, elapsedTime, isRunning } = useWorkoutTimer();
  
  // Obter dados do exercício ou treino do estado OU dos parâmetros da URL
  const [workoutData, setWorkoutData] = useState<WorkoutPlan | null>(location.state?.workout || null);
  const [exerciseData, setExerciseData] = useState(location.state?.exercise || null);
  const [exerciseIndex, setExerciseIndex] = useState(location.state?.currentExerciseIndex || 0);
  const [loadingWorkout, setLoadingWorkout] = useState(false);
  
  const exercise = exerciseData;
  const workout = workoutData;
  const currentExerciseIndex = exerciseIndex;
  const fromWorkout = location.state?.fromWorkout || !!params.workoutPlanId;
  
  // Se temos parâmetros da URL, significa que veio de uma rota semântica
  const hasUrlParams = useMemo(() => !!(params.workoutPlanId && params.workoutId && params.exerciseId), [params.workoutPlanId, params.workoutId, params.exerciseId]);
  
  console.log('🔗 URL Params:', params);
  console.log('Exercise data:', exercise);
  console.log('Workout data:', workout);
  console.log('Current exercise index:', currentExerciseIndex);
  console.log('From workout:', fromWorkout);
  console.log('Has URL params:', hasUrlParams);
  
  // Flag para evitar múltiplas chamadas simultâneas
  const loadingWorkoutRef = useRef(false);
  const workoutLoadedRef = useRef(false);
  
  // Carregar dados do workout do backend se temos parâmetros da URL mas não temos dados no state
  useEffect(() => {
    const loadWorkoutFromUrl = async () => {
      // Evitar múltiplas chamadas simultâneas ou se já foi carregado
      if (loadingWorkoutRef.current || workoutLoadedRef.current) {
        console.log('⏭️ Carregamento de workout já em andamento ou já carregado, pulando...');
        return;
      }
      
      // Carregar se temos parâmetros da URL mas não temos dados no state
      // OU se temos preservedSeries mas não temos workout (componente remontado)
      const shouldLoad = (hasUrlParams && !workoutData && params.workoutPlanId) ||
        (location.state?.preservedSeries && !workoutData && params.workoutPlanId);
      
      if (shouldLoad) {
        try {
          loadingWorkoutRef.current = true;
          setLoadingWorkout(true);
          console.log('📥 Carregando workout do backend com ID:', params.workoutPlanId);
          const loadedWorkout = await workoutApi.getPlanById(params.workoutPlanId);
          console.log('✅ Workout carregado:', loadedWorkout);
          setWorkoutData(loadedWorkout);
          workoutLoadedRef.current = true;
          
          // Encontrar o exercício correto usando o exerciseId da URL
          if (params.exerciseId && loadedWorkout.workouts?.[0]?.exercises) {
            const foundIndex = loadedWorkout.workouts[0].exercises.findIndex(
              (ex: any) => ex.id === params.exerciseId || ex.exerciseId === params.exerciseId
            );
            if (foundIndex !== -1) {
              console.log('✅ Exercício encontrado no índice:', foundIndex);
              setExerciseIndex(foundIndex);
              setExerciseData(loadedWorkout.workouts[0].exercises[foundIndex]);
            } else {
              console.warn('⚠️ Exercício não encontrado com ID:', params.exerciseId);
            }
          }
        } catch (err) {
          console.error('❌ Erro ao carregar workout:', err);
          workoutLoadedRef.current = false; // Resetar em caso de erro para permitir nova tentativa
        } finally {
          loadingWorkoutRef.current = false;
          setLoadingWorkout(false);
        }
      }
    };
    
    loadWorkoutFromUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.workoutPlanId, params.exerciseId, hasUrlParams]);
  
  // Se veio do treino, usar dados do treino
  const currentExercise = fromWorkout && workout?.workouts?.[0]?.exercises?.[currentExerciseIndex] 
    ? workout.workouts[0].exercises[currentExerciseIndex] 
    : exercise;
  const exerciseName = currentExercise?.exerciseName || currentExercise?.name || "nome do exercicio";
  const exerciseGifUrl = currentExercise?.gifUrl;
  const exerciseReps = currentExercise?.reps || "6 a 8";
  const exerciseRestTime = currentExercise?.restTime || 90;
  
  console.log('Exercise GIF URL:', exerciseGifUrl);
  
  const [currentSeriesIndex, setCurrentSeriesIndex] = useState(0);
  
  // Inicializar séries baseado no treino ou exercício
  const initializeSeries = () => {
    if (fromWorkout && currentExercise) {
      const sets = currentExercise.sets || 3;
      const reps = currentExercise.reps || 8;
      const weight = currentExercise.weight || 12;
      
      return Array.from({ length: sets }, (_, index) => ({
        repetitions: reps.toString(),
        weight: weight.toString(),
        restTime: exerciseRestTime.toString(),
        status: index === 0 ? "active" : "pending"
      }));
    } else {
      return [
        { repetitions: exerciseReps, weight: "12", restTime: exerciseRestTime.toString(), status: "active" },
        { repetitions: exerciseReps, weight: "12", restTime: exerciseRestTime.toString(), status: "pending" },
        { repetitions: exerciseReps, weight: "12", restTime: exerciseRestTime.toString(), status: "pending" },
      ];
    }
  };
  
  // Inicializar séries - verificar se há séries preservadas no location.state
  const [series, setSeries] = useState<SeriesData[]>(() => {
    // Se há séries preservadas no state, usar elas
    if (location.state?.preservedSeries) {
      const preserved = location.state.preservedSeries;
      const completedCount = preserved.filter((s: SeriesData) => s.status === "completed").length;
      console.log('📦 Restaurando séries preservadas na inicialização:', {
        total: preserved.length,
        completed: completedCount,
        series: preserved.map((s: SeriesData, idx: number) => ({
          index: idx + 1,
          status: s.status,
          reps: s.actualReps || s.repetitions,
          weight: s.actualWeight || s.weight
        }))
      });
      return preserved;
    }
    const initialSeries = initializeSeries();
    console.log('🆕 Inicializando novas séries:', initialSeries);
    console.log('📋 Contexto:', { fromWorkout, workout: workout?.id, exercise: exercise?.id });
    return initialSeries;
  });
  const [saving, setSaving] = useState(false);
  const [exerciseHistory, setExerciseHistory] = useState<number[]>([]);
  const [lastWeight, setLastWeight] = useState(0);
  const [expandedSeriesIndex, setExpandedSeriesIndex] = useState<number | null>(null);
  const [lastReps, setLastReps] = useState(0);
  const [currentWeight, setCurrentWeight] = useState(12);
  const [currentReps, setCurrentReps] = useState(8);
  const { 
    exerciseCompleted, 
    setExerciseCompleted, 
    setAllSeriesCompleted, 
    setOnCompleteExercise 
  } = useExercise();

  // Flag para evitar múltiplas chamadas simultâneas
  const checkingCompletionRef = useRef(false);
  const loadingHistoryRef = useRef(false);
  const completingExerciseRef = useRef(false);

  // Verificar se o exercício já foi concluído hoje
  useEffect(() => {
    const checkExerciseCompletion = async () => {
      // Não verificar se há séries preservadas no state (significa que estamos em uma sessão ativa)
      if (location.state?.preservedSeries) {
        console.log('⏭️ Pulando verificação de conclusão - há séries preservadas (sessão ativa)');
        return;
      }
      
      // Evitar múltiplas chamadas simultâneas
      if (checkingCompletionRef.current) {
        console.log('⏭️ Verificação de conclusão já em andamento, pulando...');
        return;
      }
      
      if (!workout || !currentExercise) return;
      
      try {
        checkingCompletionRef.current = true;
        const workoutDayId = workout.workouts?.[0]?.id;
        const exerciseId = currentExercise.exerciseId || currentExercise.id;
        
        if (workoutDayId && exerciseId) {
          console.log('🔍 Verificando se exercício foi concluído hoje:', { workoutDayId, exerciseId });
          const status = await workoutApi.checkExerciseCompletedToday(workoutDayId, exerciseId);
          console.log('✅ Status de conclusão do exercício:', status);
          
          if (status.completed && status.workoutLog) {
            setExerciseCompleted(true);
            
            // Carregar séries completadas do log
            const exerciseLog = status.workoutLog.exercises.find(
              (ex: any) => ex.exerciseId === exerciseId && ex.completed === true
            );
            
            if (exerciseLog) {
              const repsArray = JSON.parse(exerciseLog.reps || '[]');
              const weightsArray = JSON.parse(exerciseLog.weights || '[]');
              
              // Atualizar séries com dados do log (só se não houver séries preservadas)
              setSeries(prevSeries => {
                return prevSeries.map((serie, index) => {
                  if (index < repsArray.length && index < weightsArray.length) {
                    return {
                      ...serie,
                      status: "completed",
                      repetitions: repsArray[index].toString(),
                      weight: weightsArray[index].toString(),
                      actualReps: repsArray[index],
                      actualWeight: weightsArray[index]
                    };
                  }
                  return serie;
                });
              });
            }
          }
        }
      } catch (error) {
        console.error('Erro ao verificar conclusão do exercício:', error);
        // Não propagar erro para não quebrar a UI
      } finally {
        checkingCompletionRef.current = false;
      }
    };
    
    // Adicionar debounce de 500ms para evitar chamadas muito frequentes
    const timeoutId = setTimeout(() => {
      checkExerciseCompletion();
    }, 500);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [workout?.id, workout?.workouts?.[0]?.id, currentExercise?.id, currentExercise?.exerciseId, location.state?.preservedSeries]);

  // Carregar histórico do exercício
  useEffect(() => {
    const loadHistory = async () => {
      // Evitar múltiplas chamadas simultâneas
      if (loadingHistoryRef.current) {
        console.log('⏭️ Carregamento de histórico já em andamento, pulando...');
        return;
      }
      
      try {
        if (currentExercise?.exerciseId) {
          loadingHistoryRef.current = true;
          const history = await exerciseApi.getHistory(currentExercise.exerciseId);
          setExerciseHistory(history.lastSets);
          setLastWeight(history.lastWeight);
          setLastReps(history.lastReps);
          
          // Inicializar com valores do histórico
          if (history.lastWeight > 0) {
            setCurrentWeight(history.lastWeight);
          }
          if (history.lastReps > 0) {
            setCurrentReps(history.lastReps);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        // Não fazer nada se falhar - continua com valores padrão
      } finally {
        loadingHistoryRef.current = false;
      }
    };

    // Adicionar debounce de 500ms para evitar chamadas muito frequentes
    const timeoutId = setTimeout(() => {
      loadHistory();
    }, 500);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentExercise?.exerciseId]);

  // Verifica se está retornando da página de descanso
  useEffect(() => {
    if (location.state?.fromRest) {
      const seriesIndex = location.state.seriesIndex;
      const reps = location.state.reps;
      const weight = location.state.weight;
      const restTime = location.state.restTime;

      setSeries(prevSeries => {
        // Se há séries preservadas, usar elas como base (para manter séries já completadas)
        const baseSeries = location.state?.preservedSeries || prevSeries;
        const newSeries = [...baseSeries];
        
        // Atualizar status e valores numéricos da série atual
        newSeries[seriesIndex].status = "completed";
        newSeries[seriesIndex].actualReps = reps;
        newSeries[seriesIndex].actualWeight = weight;
        newSeries[seriesIndex].actualRestTime = restTime;
        // Atualizar também as props string para manter sincronização
        newSeries[seriesIndex].repetitions = reps.toString();
        newSeries[seriesIndex].weight = weight.toString();
        newSeries[seriesIndex].restTime = restTime.toString();
        
        // Garantir que séries anteriores completadas permaneçam completadas
        // (isso já deve estar preservado nas preservedSeries, mas garantimos)
        for (let i = 0; i < seriesIndex; i++) {
          if (baseSeries[i]?.status === "completed") {
            newSeries[i].status = "completed";
            // Preservar valores também
            if (baseSeries[i].actualReps !== undefined) {
              newSeries[i].actualReps = baseSeries[i].actualReps;
            }
            if (baseSeries[i].actualWeight !== undefined) {
              newSeries[i].actualWeight = baseSeries[i].actualWeight;
            }
            if (baseSeries[i].actualRestTime !== undefined) {
              newSeries[i].actualRestTime = baseSeries[i].actualRestTime;
            }
          }
        }
        
        // Verifica se há próxima série
        if (seriesIndex < newSeries.length - 1) {
          // Só mudar para active se não estiver completed
          if (newSeries[seriesIndex + 1].status !== "completed") {
            newSeries[seriesIndex + 1].status = "active";
          }
          setCurrentSeriesIndex(seriesIndex + 1);
        }
        
        console.log('✅ Séries atualizadas após timer:', newSeries.map((s, idx) => ({
          index: idx,
          status: s.status,
          reps: s.actualReps,
          weight: s.actualWeight
        })));
        
        return newSeries;
      });
      setExpandedSeriesIndex(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.fromRest]);

  // Preservar séries quando o componente é remontado ou quando o workout é carregado
  const preservedSeriesRef = useRef(location.state?.preservedSeries);
  useEffect(() => {
    if (location.state?.preservedSeries) {
      preservedSeriesRef.current = location.state.preservedSeries;
    }
  }, [location.state?.preservedSeries]);

  useEffect(() => {
    // Se há séries preservadas no state, sempre restaurar (mesmo que workout seja carregado depois)
    const preserved = preservedSeriesRef.current;
    if (preserved) {
      const preservedCompleted = preserved.filter((s: SeriesData) => s.status === "completed").length;
      
      console.log('🔄 Verificando séries preservadas:', {
        hasWorkout: !!workout,
        fromWorkout,
        preservedSeriesCount: preserved.length,
        completedCount: preservedCompleted,
        preservedSeries: preserved.map((s: SeriesData, idx: number) => ({
          index: idx + 1,
          status: s.status,
          reps: s.actualReps || s.repetitions,
          weight: s.actualWeight || s.weight
        }))
      });
      
      // Verificar se as séries preservadas são diferentes das atuais antes de atualizar
      setSeries(prevSeries => {
        const currentCompleted = prevSeries.filter(s => s.status === "completed").length;
        const seriesEqual = JSON.stringify(preserved) === JSON.stringify(prevSeries);
        
        console.log('🔍 Comparando séries:', {
          preservedCompleted,
          currentCompleted,
          seriesEqual,
          prevSeries: prevSeries.map((s, idx) => ({
            index: idx + 1,
            status: s.status,
            reps: s.actualReps || s.repetitions,
            weight: s.actualWeight || s.weight
          }))
        });
        
        // Se as séries preservadas têm mais séries completadas OU são diferentes, usar elas
        if (preservedCompleted > currentCompleted || !seriesEqual) {
          console.log('✅ Atualizando séries com dados preservados');
          return preserved;
        }
        
        console.log('⏭️ Mantendo séries atuais (já estão atualizadas)');
        return prevSeries;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workout?.id, location.state?.preservedSeries]);

  const handleStartRest = (index: number, reps: number, weight: number, restTime: number) => {
    // Navega para a página de tempo de descanso com os valores ajustados
    // Preservar dados do workout/exercise E as séries completadas
    setCurrentSeriesIndex(index);
    
    // Usar rota semântica se temos os IDs necessários
    const workoutPlanId = workout?.id || params.workoutPlanId;
    const workoutId = workout?.workouts?.[0]?.id || params.workoutId;
    const exerciseId = currentExercise?.id || currentExercise?.exerciseId || params.exerciseId;
    
    if (workoutPlanId && workoutId && exerciseId) {
      navigate(`/treino/${workoutPlanId}/${workoutId}/${exerciseId}/descanso`, { 
        state: { 
          seriesIndex: index,
          reps,
          weight,
          restTime,
          workout,
          exercise,
          currentExerciseIndex,
          fromWorkout,
          preservedSeries: series
        } 
      });
    } else {
      // Fallback para rota legada
      navigate("/treino-tempo-descanso", { 
        state: { 
          seriesIndex: index,
          reps,
          weight,
          restTime,
          workout,
          exercise,
          currentExerciseIndex,
          fromWorkout,
          preservedSeries: series
        } 
      });
    }
  };

  const handleRepetitionsChange = (index: number, value: string) => {
    setSeries(prevSeries => {
      // Não permitir alterar séries completadas
      if (prevSeries[index].status === "completed") {
        console.warn('⚠️ Tentativa de alterar série completada:', index);
        return prevSeries;
      }
      
      const newSeries = [...prevSeries];
      const repsNum = parseInt(value, 10);
      newSeries[index].repetitions = value;
      // Salvar também o valor numérico para uso no backend
      if (!isNaN(repsNum)) {
        newSeries[index].actualReps = repsNum;
      }
      return newSeries;
    });
  };

  const handleWeightChange = (index: number, value: string) => {
    setSeries(prevSeries => {
      // Não permitir alterar séries completadas
      if (prevSeries[index].status === "completed") {
        console.warn('⚠️ Tentativa de alterar série completada:', index);
        return prevSeries;
      }
      
      const newSeries = [...prevSeries];
      const weightNum = parseFloat(value);
      newSeries[index].weight = value;
      // Salvar também o valor numérico para uso no backend
      if (!isNaN(weightNum)) {
        newSeries[index].actualWeight = weightNum;
      }
      return newSeries;
    });
  };

  const handleRestTimeChange = (index: number, value: string) => {
    setSeries(prevSeries => {
      // Não permitir alterar séries completadas
      if (prevSeries[index].status === "completed") {
        console.warn('⚠️ Tentativa de alterar série completada:', index);
        return prevSeries;
      }
      
      const newSeries = [...prevSeries];
      const restTimeNum = parseInt(value, 10);
      newSeries[index].restTime = value;
      // Salvar também o valor numérico para uso no backend
      if (!isNaN(restTimeNum)) {
        newSeries[index].actualRestTime = restTimeNum;
      }
      return newSeries;
    });
  };

  // Usar useRef para elapsedTime para evitar recriações do callback
  const elapsedTimeRef = useRef(elapsedTime);
  useEffect(() => {
    elapsedTimeRef.current = elapsedTime;
  }, [elapsedTime]);

  // Usar useRef para series para evitar recriações do callback
  const seriesRef = useRef(series);
  useEffect(() => {
    seriesRef.current = series;
  }, [series]);

  const handleCompleteExercise = useCallback(async () => {
    // Bloquear se o exercício já foi concluído hoje
    if (exerciseCompleted) {
      console.log('⚠️ Exercício já foi concluído hoje');
      return;
    }
    
    // Evitar múltiplas chamadas simultâneas
    if (completingExerciseRef.current) {
      console.log('⏭️ Conclusão de exercício já em andamento, pulando...');
      return;
    }
    
    // Bloquear se não temos dados do workout ou exercício (componente ainda carregando)
    if (!workout || !currentExercise) {
      console.log('⚠️ Workout ou exercício não disponível ainda, pulando...');
      return;
    }
    
    try {
      completingExerciseRef.current = true;
      setSaving(true);
      
      // Usar valores dos refs para evitar dependências desnecessárias
      const currentElapsedTime = elapsedTimeRef.current;
      const currentSeries = seriesRef.current;
      
      // Verificar se é o último exercício do treino
      const isLastExercise = fromWorkout && 
        workout?.workouts?.[0]?.exercises && 
        currentExerciseIndex === workout.workouts[0].exercises.length - 1;
      
      console.log('🔍 Verificando se é último exercício:', {
        fromWorkout,
        hasWorkout: !!workout,
        exercisesCount: workout?.workouts?.[0]?.exercises?.length,
        currentIndex: currentExerciseIndex,
        isLastExercise
      });
      
      // Se for o último exercício, parar o timer
      if (isLastExercise) {
        stopTimer();
        console.log(`Treino finalizado! Tempo total: ${currentElapsedTime} segundos`);
      }
      
      // Coletar dados das séries completadas (usar valores reais)
      const repsArray = currentSeries.map((s, idx) => {
        // Priorizar actualReps, depois tentar extrair do string
        if (s.actualReps !== undefined) {
          console.log(`Série ${idx + 1} - Reps (actualReps):`, s.actualReps);
          return s.actualReps;
        }
        const match = s.repetitions.match(/(\d+)/);
        if (match) {
          const parsed = parseInt(match[1], 10);
          console.log(`Série ${idx + 1} - Reps (parsed):`, parsed);
          return parsed;
        }
        console.warn(`Série ${idx + 1} - Reps não encontrado, usando 0`);
        return 0;
      });
      const weightsArray = currentSeries.map((s, idx) => {
        // Priorizar actualWeight, depois parseFloat do string
        if (s.actualWeight !== undefined) {
          console.log(`Série ${idx + 1} - Weight (actualWeight):`, s.actualWeight);
          return s.actualWeight;
        }
        const parsed = parseFloat(s.weight);
        if (!isNaN(parsed)) {
          console.log(`Série ${idx + 1} - Weight (parsed):`, parsed);
          return parsed;
        }
        console.warn(`Série ${idx + 1} - Weight não encontrado, usando 0`);
        return 0;
      });
      
      console.log('📊 Dados coletados para envio:', {
        repsArray,
        weightsArray,
        series: currentSeries.map(s => ({
          repetitions: s.repetitions,
          weight: s.weight,
          actualReps: s.actualReps,
          actualWeight: s.actualWeight,
          status: s.status
        }))
      });
      
      // Obter o ID do Workout (treino do dia), não do WorkoutPlan
      // workout?.workouts?.[0]?.id é o ID do Workout específico do dia
      const workoutDayId = workout?.workouts?.[0]?.id || workout?.id || '1';
      
      // Criar log do exercício (será agrupado no treino completo depois)
      const logData = {
        workoutId: workoutDayId, // ID do Workout (treino do dia), não do WorkoutPlan
        duration: currentElapsedTime,
        exercises: [{
          exerciseId: currentExercise?.exerciseId || currentExercise?.id || '1',
          sets: currentSeries.length,
          reps: repsArray,
          weights: weightsArray,
          completed: true
        }]
      };
      
      console.log('📤 Enviando para backend:', logData);
      console.log('📅 Workout ID (treino do dia):', workoutDayId);
      console.log('📅 Workout Plan ID:', workout?.id);
      console.log('📅 Workout Day:', workout?.workouts?.[0]?.dayOfWeek);
      
      // Salvar no backend
      await workoutApi.createLog(logData);
      
      // Se for o último exercício, navegar para a página de conclusão
      if (isLastExercise) {
        console.log('🏁 Último exercício completado - navegando para conclusão');
        navigate("/workout-completion", {
          state: {
            workoutData: {
              name: workout?.name || 'Treino',
              exercises: workout?.workouts?.[0]?.exercises || []
            },
            duration: currentElapsedTime
          }
        });
      } else {
        console.log('📋 Exercício completado (não é o último) - navegando para /treino-id');
        // Navega de volta para a página de treino com informação de que o exercício foi concluído
        // Só marca como concluído se todas as séries foram completadas
        const allSeriesCompleted = currentSeries.every((s) => s.status === "completed");
        
        // Usar rota semântica se temos os IDs necessários
        const workoutPlanId = workout?.id || params.workoutPlanId;
        
        if (fromWorkout && workoutPlanId) {
          navigate(`/treino/${workoutPlanId}`, { 
            state: { 
              exerciseCompleted: allSeriesCompleted,
              exerciseName: exerciseName,
              exerciseId: currentExercise?.id || currentExercise?.exerciseId,
              allSeriesCompleted: allSeriesCompleted,
              workout: workout,
              fromWorkout: fromWorkout
            } 
          });
        } else {
          // Fallback para rota legada
          const targetRoute = fromWorkout ? "/treino-id" : "/treino";
          navigate(targetRoute, { 
            state: { 
              exerciseCompleted: allSeriesCompleted,
              exerciseName: exerciseName,
              exerciseId: currentExercise?.id || currentExercise?.exerciseId,
              allSeriesCompleted: allSeriesCompleted,
              workout: workout,
              fromWorkout: fromWorkout
            } 
          });
        }
      }
    } catch (err: any) {
      console.error('Erro ao salvar progresso:', err);
      
      // Tratar erros específicos
      if (err?.message?.includes('insecure') || err?.name === 'SecurityError') {
        console.warn('Erro de segurança ao salvar - tentando continuar sem salvar no backend');
        // Continuar navegação mesmo com erro de segurança
      }
      
      // Não marcar como concluído em caso de erro crítico
      // Mas ainda permitir navegação para não bloquear o usuário
      const targetRoute = fromWorkout ? "/treino-id" : "/treino";
      const workoutPlanId = workout?.id || params.workoutPlanId;
      
      if (fromWorkout && workoutPlanId) {
        navigate(`/treino/${workoutPlanId}`, { 
          state: { 
            exerciseCompleted: false,
            exerciseName: exerciseName,
            exerciseId: currentExercise?.id || currentExercise?.exerciseId,
            workout: workout,
            fromWorkout: fromWorkout
          } 
        });
      } else {
        navigate(targetRoute, { 
          state: { 
            exerciseCompleted: false,
            exerciseName: exerciseName,
            exerciseId: currentExercise?.id || currentExercise?.exerciseId,
            workout: workout,
            fromWorkout: fromWorkout
          } 
        });
      }
    } finally {
      completingExerciseRef.current = false;
      setSaving(false);
    }
  }, [exerciseCompleted, fromWorkout, workout?.id, workout?.workouts?.[0]?.id, currentExerciseIndex, navigate, params.workoutPlanId, exerciseName, currentExercise?.id, currentExercise?.exerciseId, stopTimer]);

  // Memoizar allSeriesCompleted para evitar recálculos desnecessários
  const allSeriesCompleted = useMemo(() => {
    return series.every((s) => s.status === "completed");
  }, [series]);
  
  // Atualizar contexto quando o estado muda
  useEffect(() => {
    setAllSeriesCompleted(allSeriesCompleted);
  }, [allSeriesCompleted, setAllSeriesCompleted]);
  
  // Registrar callback de conclusão - usar useRef para evitar recriação
  const handleCompleteExerciseRef = useRef(handleCompleteExercise);
  useEffect(() => {
    handleCompleteExerciseRef.current = handleCompleteExercise;
  }, [handleCompleteExercise]);
  
  useEffect(() => {
    const callback = () => {
      console.log('🔔 Callback onCompleteExercise chamado!');
      handleCompleteExerciseRef.current();
    };
    console.log('📝 Registrando callback onCompleteExercise');
    setOnCompleteExercise(callback);
    return () => {
      console.log('🧹 Limpando callback onCompleteExercise');
      setOnCompleteExercise(null);
    };
  }, [setOnCompleteExercise]);
  
  // Ajustar top baseado se o treino está ativo
  const topPosition = isRunning ? 'top-[90px]' : 'top-[56px]';

  // Se está carregando o workout do backend, mostrar loading
  if (loadingWorkout) {
    return (
      <div className="bg-[#181818] relative size-full flex items-center justify-center">
        <div className="text-white text-[18px] font-['Alexandria:Regular',_sans-serif]">
          Carregando exercício...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#181818] relative size-full" data-name="treino-id">
      <BackButton onClick={() => {
        // Usar rota semântica se temos workoutPlanId
        if (workout?.id || params.workoutPlanId) {
          const workoutPlanId = workout?.id || params.workoutPlanId;
          navigate(`/treino/${workoutPlanId}`);
        } else {
          navigate("/treino");
        }
      }} />
      <div className={`absolute content-stretch flex flex-col gap-[19px] items-start left-[20px] ${topPosition} w-[350px]`}>
        {/* Imagem do Exercício */}
        <div className="bg-[#202020] h-[350px] relative rounded-[30px] shrink-0 w-full overflow-hidden">
          <AnimatedExerciseImage
            gifUrl={exerciseGifUrl || ""}
            alt={exerciseName}
            className="size-full"
            transitionSpeed={800}
          />
        </div>

        {/* Nome do Exercício e Séries */}
        <div className="content-stretch flex flex-col gap-[15px] items-start relative shrink-0 w-full">
          <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[16px] text-white w-full">
            {exerciseName}
          </p>

          {/* Gráfico de Progresso Semanal */}
          {exerciseHistory.length > 0 && (
            <WeeklyProgressBar
              history={exerciseHistory}
              currentSet={currentSeriesIndex + 1}
              totalSets={series.length}
              targetReps={currentReps}
            />
          )}

          {series.map((serie, index) => {
            // Log detalhado para debug
            console.log(`📋 Renderizando Série ${index + 1}:`, {
              status: serie.status,
              reps: serie.actualReps || serie.repetitions,
              weight: serie.actualWeight || serie.weight,
              restTime: serie.actualRestTime || serie.restTime
            });
            
            if (serie.status === "completed") {
              console.log(`✅ Série ${index + 1} está COMPLETED - deve aparecer verde`);
            }
            
            return (
              <SeriesCard
                key={`series-${index}-${serie.status}`}
                seriesNumber={index + 1}
                repetitions={serie.repetitions}
                weight={serie.weight}
                restTime={serie.restTime}
                status={serie.status}
              isExpanded={expandedSeriesIndex === index && serie.status !== "completed"}
              onToggleExpand={() => {
                // Não permitir expandir séries completadas ou se o exercício foi concluído
                if (serie.status !== "completed" && !exerciseCompleted) {
                  setExpandedSeriesIndex(expandedSeriesIndex === index ? null : index);
                }
              }}
              onStartRest={(reps, weight, restTime) => {
                // Não permitir iniciar timer para séries completadas ou se o exercício foi concluído
                if (serie.status !== "completed" && !exerciseCompleted) {
                  handleStartRest(index, reps, weight, restTime);
                }
              }}
              onRepetitionsChange={(value) => {
                // Não permitir alterar valores de séries completadas ou se o exercício foi concluído
                if (serie.status !== "completed" && !exerciseCompleted) {
                  handleRepetitionsChange(index, value);
                }
              }}
              onWeightChange={(value) => {
                // Não permitir alterar valores de séries completadas ou se o exercício foi concluído
                if (serie.status !== "completed" && !exerciseCompleted) {
                  handleWeightChange(index, value);
                }
              }}
              onRestTimeChange={(value) => {
                // Não permitir alterar valores de séries completadas ou se o exercício foi concluído
                if (serie.status !== "completed" && !exerciseCompleted) {
                  handleRestTimeChange(index, value);
                }
              }}
              onWeightChangeNumber={(value) => {
                // Não permitir alterar valores de séries completadas ou se o exercício foi concluído
                if (serie.status !== "completed" && !exerciseCompleted) {
                  const newSeries = [...series];
                  newSeries[index].actualWeight = value;
                  setSeries(newSeries);
                }
              }}
              onRestTimeChangeNumber={(value) => {
                // Não permitir alterar valores de séries completadas ou se o exercício foi concluído
                if (serie.status !== "completed" && !exerciseCompleted) {
                  const newSeries = [...series];
                  newSeries[index].actualRestTime = value;
                  setSeries(newSeries);
                }
              }}
              onRepsChange={(min, max) => {
                // Não permitir alterar valores de séries completadas ou se o exercício foi concluído
                if (serie.status !== "completed" && !exerciseCompleted) {
                  const newSeries = [...series];
                  newSeries[index].actualReps = max;
                  setSeries(newSeries);
                }
              }}
              />
            );
          })}
        </div>

        {/* Mensagem se o exercício já foi concluído */}
        {exerciseCompleted && (
          <div className="w-full mt-[15px] bg-[#6D9F28] rounded-full p-4 flex items-center justify-center">
            <p className="text-white font-['Alexandria:Medium',_sans-serif]">Exercício Concluído Hoje</p>
          </div>
        )}
      </div>
    </div>
  );
}