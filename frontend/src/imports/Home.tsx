import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { workoutApi } from '../services/api';

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

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const data = await workoutApi.getUserPlans();
        setWorkouts(data || []);
      } catch (err) {
        console.error('Erro ao carregar treinos:', err);
      } finally {
        setLoading(false);
      }
    };

    loadWorkouts();
  }, []);

  const getTodayWorkouts = () => {
    const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long' });
    const dayMap: { [key: string]: string } = {
      'segunda-feira': 'monday',
      'terça-feira': 'tuesday',
      'quarta-feira': 'wednesday',
      'quinta-feira': 'thursday',
      'sexta-feira': 'friday',
      'sábado': 'saturday',
      'domingo': 'sunday'
    };
    
    const todayKey = dayMap[today.toLowerCase()];
    if (!todayKey) return [];

    return workouts.filter(workout => 
      workout.workouts?.some(w => w.dayOfWeek.toLowerCase() === todayKey)
    );
  };

  const todayWorkouts = getTodayWorkouts();

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

  return (
    <div className="bg-[#181818] relative w-full min-h-screen flex items-center justify-center overflow-y-auto" data-name="home">
      {/* Container centralizado */}
      <div className="w-[393px] max-w-[90vw] py-8 px-5">
        {/* Header */}
        <div className="w-full flex flex-col gap-[6px] mb-8">
          <div className="text-white text-[24px] font-['Alexandria:Medium',_sans-serif] font-medium">
            Hey, {user?.name || 'Usuário'}!
          </div>
          <div className="text-[#2C2C2C] text-[20px] font-['Alexandria:Medium',_sans-serif] font-medium">
            hoje você tem {todayWorkouts.length} treino{todayWorkouts.length !== 1 ? 's' : ''} planejado{todayWorkouts.length !== 1 ? 's' : ''}!
          </div>
        </div>

        {/* Seção Hoje */}
        <div className="text-[#C1C1C1] text-[16px] font-['Alexandria:Medium',_sans-serif] font-medium mb-4">
          hoje
        </div>

        {/* Cards de Treinos */}
        <div className="w-full space-y-[10px]">
          {todayWorkouts.slice(0, 2).map((workout, index) => {
            const bodyParts = getBodyPartTags(workout);
            const duration = getWorkoutDuration(workout);
            const trainingType = workout.workouts?.[0]?.trainingType || 'treino';
            
            return (
              <div
                key={workout.id}
                onClick={() => navigate('/treino-id', { state: { workout } })}
                className="w-full h-[80px] p-[9px_13px] bg-[#2C2C2C] rounded-[20px] flex flex-col justify-center items-center cursor-pointer hover:bg-[#3C3C3C] transition-colors"
              >
                <div className="w-full flex flex-col gap-[32px]">
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
    </div>
  );
}