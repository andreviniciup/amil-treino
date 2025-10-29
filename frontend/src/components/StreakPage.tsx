import { useState, useEffect } from 'react';
import { DynamicStreak } from './DynamicStreak';
import { WorkoutDayPopup } from './WorkoutDayPopup';
import { workoutApi } from '../services/api';

interface WorkoutInfo {
  workoutName: string;
  duration: string;
  completedAt: string;
}

interface WorkoutDayData {
  date: string;
  workouts: WorkoutInfo[];
}

export function StreakPage() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [workoutDays, setWorkoutDays] = useState<Record<number, WorkoutDayData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar logs de treinos
  useEffect(() => {
    const loadWorkoutLogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const logs = await workoutApi.getUserLogs(50, 0);
        
        // Agrupar logs por dia
        const groupedByDay: Record<number, WorkoutDayData> = {};
        
        logs.forEach((log: any) => {
          const logDate = new Date(log.completedAt);
          const day = logDate.getDate();
          
          // Formatar duração
          const durationMinutes = log.duration ? Math.floor(log.duration / 60) : 0;
          const durationSeconds = log.duration ? log.duration % 60 : 0;
          const formattedDuration = `${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;
          
          // Formatar hora de conclusão
          const completedAtTime = logDate.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          });
          
          const workoutInfo: WorkoutInfo = {
            workoutName: log.workout?.trainingType || 'Treino',
            duration: formattedDuration,
            completedAt: completedAtTime
          };
          
          if (!groupedByDay[day]) {
            groupedByDay[day] = {
              date: logDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' }),
              workouts: []
            };
          }
          
          groupedByDay[day].workouts.push(workoutInfo);
        });
        
        setWorkoutDays(groupedByDay);
      } catch (err) {
        console.error('Erro ao carregar histórico:', err);
        setError('Erro ao carregar histórico de treinos.');
      } finally {
        setLoading(false);
      }
    };

    loadWorkoutLogs();
  }, []);

  const handleDayClick = (day: number) => {
    if (workoutDays[day]) {
      setSelectedDay(day);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#181818] relative size-full flex items-center justify-center">
        <p className="text-white text-[18px] font-['Alexandria:Regular',_sans-serif]">
          Carregando histórico...
        </p>
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

  return (
    <>
      <div className="bg-[#181818] relative size-full" onClick={(e) => {
        const target = e.target as HTMLElement;
        const dayElement = target.closest('[data-day]');
        if (dayElement) {
          const day = parseInt(dayElement.getAttribute('data-day') || '0');
          handleDayClick(day);
        }
      }}>
        <DynamicStreak />
      </div>

      {selectedDay !== null && workoutDays[selectedDay] && (
        <WorkoutDayPopup
          day={selectedDay}
          date={workoutDays[selectedDay].date}
          workouts={workoutDays[selectedDay].workouts}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </>
  );
}
