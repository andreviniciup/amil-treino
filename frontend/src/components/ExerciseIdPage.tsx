import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { SeriesCard } from "./SeriesCard";
import { SlideToComplete } from "./SlideToComplete";
import { workoutApi } from "../services/api";

interface SeriesData {
  repetitions: string;
  weight: string;
  restTime: string;
  status: "active" | "pending" | "completed";
}

export function ExerciseIdPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
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
  
  const [series, setSeries] = useState<SeriesData[]>(initializeSeries());
  const [saving, setSaving] = useState(false);

  // Verifica se está retornando da página de descanso
  useEffect(() => {
    if (location.state?.fromRest) {
      const newSeries = [...series];
      newSeries[currentSeriesIndex].status = "completed";
      
      // Verifica se há próxima série
      if (currentSeriesIndex < series.length - 1) {
        newSeries[currentSeriesIndex + 1].status = "active";
        setCurrentSeriesIndex(currentSeriesIndex + 1);
      }
      
      setSeries(newSeries);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const handleStartSeries = (index: number) => {
    // Navega para a página de tempo de descanso
    setCurrentSeriesIndex(index);
    navigate("/treino-tempo-descanso", { state: { fromSeries: index } });
  };

  const handleCompleteSeries = (index: number) => {
    const newSeries = [...series];
    newSeries[index].status = "completed";
    
    // Verifica se há próxima série
    if (index < series.length - 1) {
      newSeries[index + 1].status = "active";
      setCurrentSeriesIndex(index + 1);
    }
    
    setSeries(newSeries);
  };

  const handleRepetitionsChange = (index: number, value: string) => {
    const newSeries = [...series];
    newSeries[index].repetitions = value;
    setSeries(newSeries);
  };

  const handleWeightChange = (index: number, value: string) => {
    const newSeries = [...series];
    newSeries[index].weight = value;
    setSeries(newSeries);
  };

  const handleRestTimeChange = (index: number, value: string) => {
    const newSeries = [...series];
    newSeries[index].restTime = value;
    setSeries(newSeries);
  };

  const handleCompleteExercise = async () => {
    try {
      setSaving(true);
      
      // Coletar dados das séries completadas
      const repsArray = series.map(s => {
        const reps = s.repetitions.split(' ')[0]; // Pega apenas o primeiro número
        return parseInt(reps) || 0;
      });
      
      const weightsArray = series.map(s => parseFloat(s.weight) || 0);
      
      // Criar log do treino (simplificado - workoutId seria obtido do contexto/props)
      const logData = {
        workoutId: '1', // Este ID deveria vir do workout atual
        duration: 0, // Pode ser calculado com timer
        exercises: [{
          exerciseId: '1', // Este ID deveria vir do exercício atual
          sets: series.length,
          reps: repsArray,
          weights: weightsArray,
          completed: true
        }]
      };
      
      // Salvar no backend
      await workoutApi.createLog(logData);
      
      // Navega de volta para a página de treino com informação de que o exercício foi concluído
      navigate("/treino", { 
        state: { 
          exerciseCompleted: true,
          exerciseName: exerciseName 
        } 
      });
    } catch (err) {
      console.error('Erro ao salvar progresso:', err);
      // Mesmo com erro, navegar de volta (pode melhorar isso depois)
      navigate("/treino", { 
        state: { 
          exerciseCompleted: true,
          exerciseName: exerciseName 
        } 
      });
    } finally {
      setSaving(false);
    }
  };

  const allSeriesCompleted = series.every((s) => s.status === "completed");

  return (
    <div className="bg-[#181818] relative size-full" data-name="treino-id">
      <div className="absolute content-stretch flex flex-col gap-[19px] items-start left-[20px] top-[56px] w-[350px]">
        {/* Imagem do Exercício */}
        <div className="bg-[#202020] h-[350px] relative rounded-[30px] shrink-0 w-full overflow-hidden">
          <ImageWithFallback
            src={exerciseGifUrl || "https://images.unsplash.com/photo-1590150392093-a552544eed09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjB3ZWlnaHQlMjB0cmFpbmluZ3xlbnwxfHx8fDE3NjA4ODY0NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"}
            alt="foto do exercicio"
            className="size-full object-cover"
          />
        </div>

        {/* Nome do Exercício e Séries */}
        <div className="content-stretch flex flex-col gap-[15px] items-start relative shrink-0 w-full">
          <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[16px] text-white w-full">
            {exerciseName}
          </p>

          {series.map((serie, index) => (
            <SeriesCard
              key={index}
              seriesNumber={index + 1}
              repetitions={serie.repetitions}
              weight={serie.weight}
              restTime={serie.restTime}
              status={serie.status}
              onStart={() => handleStartSeries(index)}
              onRepetitionsChange={(value) => handleRepetitionsChange(index, value)}
              onWeightChange={(value) => handleWeightChange(index, value)}
              onRestTimeChange={(value) => handleRestTimeChange(index, value)}
            />
          ))}
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