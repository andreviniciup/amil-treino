import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutApi } from '../services/api';
import { Play, Plus, Clock, Dumbbell } from 'lucide-react';

interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  frequency: string;
  trainingTypes: string;
  workouts: Array<{
    id: string;
    dayOfWeek: string;
    trainingType: string;
    exercises: Array<{
      id: string;
      exerciseName: string;
      sets: number;
      reps: number;
      weight?: number;
      gifUrl?: string;
      bodyPart?: string;
      equipment?: string;
    }>;
  }>;
  createdAt: string;
}

export function WorkoutList() {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await workoutApi.getUserPlans();
        console.log('Workouts data received:', data);
        console.log('Workouts type:', typeof data);
        console.log('Workouts length:', data?.length);
        setWorkouts(data || []);
      } catch (err) {
        console.error('Erro ao carregar treinos:', err);
        setError('Erro ao carregar treinos');
      } finally {
        setLoading(false);
      }
    };

    loadWorkouts();
  }, []);

  const handleStartWorkout = (workout: WorkoutPlan) => {
    navigate('/treino-id', { 
      state: { 
        workout
      } 
    });
  };

  const handleCreateWorkout = () => {
    navigate('/workout/create/intro');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getTotalExercises = (workout: WorkoutPlan) => {
    return workout.workouts?.reduce((total, w) => total + (w.exercises?.length || 0), 0) || 0;
  };

  const getTotalSets = (workout: WorkoutPlan) => {
    return workout.workouts?.reduce((total, w) => 
      total + (w.exercises?.reduce((exerciseTotal, exercise) => exerciseTotal + exercise.sets, 0) || 0), 0
    ) || 0;
  };

  if (loading) {
    return (
      <div className="bg-[#181818] relative size-full flex items-center justify-center">
        <div className="text-white text-[18px] font-['Alexandria:Regular',_sans-serif]">
          Carregando treinos...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#181818] relative size-full flex flex-col items-center justify-center gap-4">
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

  const getBodyPartTags = (workout: WorkoutPlan) => {
    const bodyParts = new Set<string>();
    workout.workouts?.forEach(w => {
      w.exercises?.forEach(ex => {
        if (ex.bodyPart) bodyParts.add(ex.bodyPart);
      });
    });
    return Array.from(bodyParts);
  };

  const getWorkoutDuration = (workout: WorkoutPlan) => {
    const totalSets = workout.workouts?.reduce((total, w) => 
      total + (w.exercises?.reduce((exerciseTotal, exercise) => exerciseTotal + exercise.sets, 0) || 0), 0
    ) || 0;
    return Math.max(30, totalSets * 2); // Estimativa: 2 min por série
  };

  const getDayName = (dayOfWeek: string) => {
    const dayMap: { [key: string]: string } = {
      'monday': 'segunda',
      'tuesday': 'terça',
      'wednesday': 'quarta',
      'thursday': 'quinta',
      'friday': 'sexta',
      'saturday': 'sábado',
      'sunday': 'domingo'
    };
    return dayMap[dayOfWeek.toLowerCase()] || dayOfWeek;
  };

  const groupWorkoutsByDay = () => {
    const grouped: { [key: string]: WorkoutPlan[] } = {};
    
    // Filtrar apenas treinos que têm exercícios
    const workoutsWithExercises = workouts.filter(workout => {
      return workout.workouts?.some(w => w.exercises && w.exercises.length > 0);
    });
    
    workoutsWithExercises.forEach(workout => {
      workout.workouts?.forEach(w => {
        // Só incluir se tiver exercícios
        if (w.exercises && w.exercises.length > 0) {
          const dayName = getDayName(w.dayOfWeek);
          if (!grouped[dayName]) {
            grouped[dayName] = [];
          }
          grouped[dayName].push(workout);
        }
      });
    });

    return grouped;
  };

  const groupedWorkouts = groupWorkoutsByDay();

  return (
    <div className="bg-[#181818] relative size-full overflow-y-auto">
      {/* Header */}
      <div className="absolute left-[20px] top-[68px] text-white text-[24px] font-['Alexandria:Medium',_sans-serif] font-medium">
        meus treinos
      </div>

      {/* Botão Criar Treino */}
      <button
        onClick={handleCreateWorkout}
        className="absolute left-[272px] top-[70px] px-[15px] py-[5px] bg-[#D0FD1A] rounded-[10px] flex justify-center items-center"
      >
        <div className="text-[#202020] text-[12px] font-['Alexandria:Medium',_sans-serif] font-medium">
          Criar treino
        </div>
      </button>

      {/* Lista de Treinos por Dia */}
      <div className="absolute left-[20px] top-[117px] w-[350px] space-y-[20px]">
        {Object.keys(groupedWorkouts).length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <Dumbbell className="w-16 h-16 text-gray-400" />
            <p className="text-gray-400 text-[16px] font-['Alexandria:Regular',_sans-serif] text-center">
              Nenhum treino criado ainda
            </p>
            <p className="text-gray-500 text-[14px] font-['Alexandria:Regular',_sans-serif] text-center">
              Crie seu primeiro treino para começar
            </p>
          </div>
        ) : (
          Object.entries(groupedWorkouts).map(([dayName, dayWorkouts]) => (
            <div key={dayName} className="space-y-[10px]">
              {/* Nome do Dia */}
              <div className="text-[#C1C1C1] text-[20px] font-['Alexandria:Medium',_sans-serif] font-medium">
                {dayName}
              </div>

              {/* Cards do Dia */}
              <div className="space-y-[10px]">
                {dayWorkouts.map((workout) => {
                  const bodyParts = getBodyPartTags(workout);
                  const duration = getWorkoutDuration(workout);
                  const trainingType = workout.workouts?.[0]?.trainingType || 'treino';
                  
                  return (
                    <div
                      key={workout.id}
                      onClick={() => handleStartWorkout(workout)}
                      className="w-[350px] h-[80px] p-[9px_13px] bg-[#2C2C2C] rounded-[20px] flex flex-col justify-center items-center cursor-pointer hover:bg-[#3C3C3C] transition-colors"
                    >
                      <div className="w-[322px] flex flex-col gap-[32px]">
                        <div className="flex justify-between items-center">
                          <div className="text-white text-[12px] font-['Alexandria:Medium',_sans-serif] font-medium">
                            {workout.name}
                          </div>
                          <div className="text-[#646464] text-[12px] font-['Alexandria:Regular',_sans-serif] font-normal">
                            {trainingType}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-[5px] items-center">
                            {bodyParts.slice(0, 2).map((bodyPart, tagIndex) => {
                              const colors = [
                                { bg: '#9EDBE7', text: '#1A3835' },
                                { bg: '#9EE7A4', text: '#1A3821' },
                                { bg: '#E7D69E', text: '#38301A' }
                              ];
                              const color = colors[tagIndex % colors.length];
                              
                              return (
                                <div
                                  key={tagIndex}
                                  className="px-[6px] py-[2px] rounded-[99px] flex justify-center items-center"
                                  style={{ backgroundColor: color.bg }}
                                >
                                  <div
                                    className="text-[8px] font-['Alexandria:Medium',_sans-serif] font-medium"
                                    style={{ color: color.text }}
                                  >
                                    {bodyPart}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="text-[#CBCBCB] text-[10px] font-['Alexandria:Regular',_sans-serif] font-normal">
                            {duration} min
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
