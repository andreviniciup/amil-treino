import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { AnimatedExerciseImage } from "./AnimatedExerciseImage";
import { SeriesCard } from "./SeriesCard";
import { SlideToComplete } from "./SlideToComplete";
import { WeeklyProgressBar } from "./exercise/WeeklyProgressBar";
import { workoutApi, exerciseApi } from "../services/api";
import { useWorkoutTimer } from "../contexts/WorkoutTimerContext";
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
  const { stopTimer, elapsedTime, isRunning } = useWorkoutTimer();
  
  // Obter dados do exercício ou treino do estado
  const exercise = location.state?.exercise;
  const workout = location.state?.workout;
  const currentExerciseIndex = location.state?.currentExerciseIndex || 0;
  const fromWorkout = location.state?.fromWorkout;
  
  console.log('Exercise data:', exercise);
  console.log('Workout data:', workout);
  console.log('Current exercise index:', currentExerciseIndex);
  console.log('From workout:', fromWorkout);
  
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
      console.log('📦 Restaurando séries preservadas:', location.state.preservedSeries);
      return location.state.preservedSeries;
    }
    return initializeSeries();
  });
  const [saving, setSaving] = useState(false);
  const [exerciseHistory, setExerciseHistory] = useState<number[]>([]);
  const [lastWeight, setLastWeight] = useState(0);
  const [expandedSeriesIndex, setExpandedSeriesIndex] = useState<number | null>(null);
  const [lastReps, setLastReps] = useState(0);
  const [currentWeight, setCurrentWeight] = useState(12);
  const [currentReps, setCurrentReps] = useState(8);

  // Carregar histórico do exercício
  useEffect(() => {
    const loadHistory = async () => {
      try {
        if (currentExercise?.exerciseId) {
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
      }
    };

    loadHistory();
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

  const handleStartRest = (index: number, reps: number, weight: number, restTime: number) => {
    // Navega para a página de tempo de descanso com os valores ajustados
    // Preservar dados do workout/exercise E as séries completadas
    setCurrentSeriesIndex(index);
    navigate("/treino-tempo-descanso", { 
      state: { 
        seriesIndex: index,
        reps,
        weight,
        restTime,
        // Preservar dados do contexto
        workout,
        exercise,
        currentExerciseIndex,
        fromWorkout,
        // Preservar estado das séries para não perder séries completadas
        preservedSeries: series
      } 
    });
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

  const handleCompleteExercise = async () => {
    try {
      setSaving(true);
      
      // Verificar se é o último exercício do treino
      const isLastExercise = fromWorkout && 
        workout?.workouts?.[0]?.exercises && 
        currentExerciseIndex === workout.workouts[0].exercises.length - 1;
      
      // Se for o último exercício, parar o timer
      if (isLastExercise) {
        stopTimer();
        console.log(`Treino finalizado! Tempo total: ${elapsedTime} segundos`);
      }
      
      // Coletar dados das séries completadas (usar valores reais)
      const repsArray = series.map((s, idx) => {
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
      const weightsArray = series.map((s, idx) => {
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
        series: series.map(s => ({
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
        duration: elapsedTime,
        exercises: [{
          exerciseId: currentExercise?.exerciseId || currentExercise?.id || '1',
          sets: series.length,
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
        navigate("/workout-completion", {
          state: {
            workoutData: {
              name: workout?.name || 'Treino',
              exercises: workout?.workouts?.[0]?.exercises || []
            },
            duration: elapsedTime
          }
        });
      } else {
        // Navega de volta para a página de treino com informação de que o exercício foi concluído
        // Só marca como concluído se todas as séries foram completadas
        const allSeriesCompleted = series.every((s) => s.status === "completed");
        navigate("/treino", { 
          state: { 
            exerciseCompleted: allSeriesCompleted,
            exerciseName: exerciseName,
            exerciseId: currentExercise?.id || currentExercise?.exerciseId,
            allSeriesCompleted: allSeriesCompleted
          } 
        });
      }
    } catch (err) {
      console.error('Erro ao salvar progresso:', err);
      // Não marcar como concluído em caso de erro
      navigate("/treino", { 
        state: { 
          exerciseCompleted: false,
          exerciseName: exerciseName,
          exerciseId: currentExercise?.id || currentExercise?.exerciseId
        } 
      });
    } finally {
      setSaving(false);
    }
  };

  const allSeriesCompleted = series.every((s) => s.status === "completed");
  
  // Ajustar top baseado se o treino está ativo
  const topPosition = isRunning ? 'top-[90px]' : 'top-[56px]';

  return (
    <div className="bg-[#181818] relative size-full" data-name="treino-id">
      <BackButton onClick={() => navigate("/treino")} />
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
                // Não permitir expandir séries completadas
                if (serie.status !== "completed") {
                  setExpandedSeriesIndex(expandedSeriesIndex === index ? null : index);
                }
              }}
              onStartRest={(reps, weight, restTime) => {
                // Não permitir iniciar timer para séries completadas
                if (serie.status !== "completed") {
                  handleStartRest(index, reps, weight, restTime);
                }
              }}
              onRepetitionsChange={(value) => {
                // Não permitir alterar valores de séries completadas
                if (serie.status !== "completed") {
                  handleRepetitionsChange(index, value);
                }
              }}
              onWeightChange={(value) => {
                // Não permitir alterar valores de séries completadas
                if (serie.status !== "completed") {
                  handleWeightChange(index, value);
                }
              }}
              onRestTimeChange={(value) => {
                // Não permitir alterar valores de séries completadas
                if (serie.status !== "completed") {
                  handleRestTimeChange(index, value);
                }
              }}
              onWeightChangeNumber={(value) => {
                // Não permitir alterar valores de séries completadas
                if (serie.status !== "completed") {
                  const newSeries = [...series];
                  newSeries[index].actualWeight = value;
                  setSeries(newSeries);
                }
              }}
              onRestTimeChangeNumber={(value) => {
                // Não permitir alterar valores de séries completadas
                if (serie.status !== "completed") {
                  const newSeries = [...series];
                  newSeries[index].actualRestTime = value;
                  setSeries(newSeries);
                }
              }}
              onRepsChange={(min, max) => {
                // Não permitir alterar valores de séries completadas
                if (serie.status !== "completed") {
                  const newSeries = [...series];
                  newSeries[index].actualReps = max;
                  setSeries(newSeries);
                }
              }}
              />
            );
          })}
        </div>

        {/* Slide to Complete - Só aparece quando todas as séries estiverem completas */}
        {allSeriesCompleted && (
          <div className="w-full mt-[15px]">
            {saving ? (
              <div className="w-full bg-[#202020] rounded-full p-4 flex items-center justify-center">
                <p className="text-white font-['Alexandria:Medium',_sans-serif]">Salvando...</p>
              </div>
            ) : (
              <SlideToComplete onComplete={handleCompleteExercise} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}