import React, { useState, useEffect } from 'react';
import { workoutApi } from '../services/api';

interface WorkoutLog {
  id: string;
  completedAt: string;
  duration?: number;
  notes?: string;
  workout?: {
    trainingType: string;
  };
}

interface DayData {
  day: number;
  hasWorkout: boolean;
  workoutData?: WorkoutLog;
}

interface MonthData {
  month: number;
  year: number;
  name: string;
  days: { [key: number]: boolean };
}

export function DynamicStreak() {
  const [workoutDays, setWorkoutDays] = useState<{ [key: string]: Set<number> }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  // Carregar logs de treinos do backend
  useEffect(() => {
    const loadWorkoutLogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const logs = await workoutApi.getUserLogs(100, 0);
        
        // Processar logs por mês/ano
        const workoutDaysByMonth: { [key: string]: Set<number> } = {};
        
        logs.forEach((log: WorkoutLog) => {
          const logDate = new Date(log.completedAt);
          const month = logDate.getMonth();
          const year = logDate.getFullYear();
          const day = logDate.getDate();
          
          const monthKey = `${year}-${month}`;
          if (!workoutDaysByMonth[monthKey]) {
            workoutDaysByMonth[monthKey] = new Set();
          }
          workoutDaysByMonth[monthKey].add(day);
        });
        
        setWorkoutDays(workoutDaysByMonth);
      } catch (err) {
        console.error('Erro ao carregar histórico:', err);
        setError('Erro ao carregar histórico de treinos.');
      } finally {
        setLoading(false);
      }
    };

    loadWorkoutLogs();
  }, []);

  // Scroll automático para o mês atual
  useEffect(() => {
    if (!loading && currentMonth !== null) {
      // Aguardar um pouco para garantir que o DOM foi renderizado
      setTimeout(() => {
        const currentMonthElement = document.querySelector(`[data-month="${currentMonth}"]`);
        if (currentMonthElement) {
          currentMonthElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 100);
    }
  }, [loading, currentMonth]);

  // Nomes dos meses
  const monthNames = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];

  // Função para verificar se um dia tem treino
  const hasWorkoutOnDay = (day: number, month: number, year: number): boolean => {
    const monthKey = `${year}-${month}`;
    return workoutDays[monthKey]?.has(day) || false;
  };

  // Função para obter a classe CSS baseada no status do dia
  const getDayClass = (day: number, month: number, year: number): string => {
    if (hasWorkoutOnDay(day, month, year)) {
      return "bg-[#288b9f] box-border content-stretch flex flex-col gap-[10px] items-start p-[6px] relative rounded-[10px] shrink-0 size-[50px] cursor-pointer hover:bg-[#3a9fb3] transition-colors";
    }
    return "bg-[#2c2c2c] box-border content-stretch flex flex-col gap-[10px] items-start p-[6px] relative rounded-[10px] shrink-0 size-[50px]";
  };

  // Função para gerar dias do mês
  const generateMonthDays = (month: number, year: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const days = [];

    // Dias vazios do início do mês
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  // Função para gerar todos os meses do ano atual
  const generateAllMonths = () => {
    const currentYear = new Date().getFullYear();
    const months = [];
    
    for (let month = 0; month < 12; month++) {
      months.push({
        month,
        year: currentYear,
        name: monthNames[month]
      });
    }
    
    return months;
  };

  if (loading) {
    return (
      <div className="bg-[#181818] relative size-full flex items-center justify-center">
        <p className="text-white text-[18px] font-['Alexandria:Regular',_sans-serif]">
          Carregando calendário...
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

  const allMonths = generateAllMonths();

  return (
    <div className="bg-[#181818] relative h-full w-full overflow-y-auto" data-name="streak">
      <div className="content-stretch flex flex-col gap-[10px] items-center left-[19px] top-[50px] w-[353px] pb-[100px]">
        <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[14px] text-center text-white w-full">calendario</p>
        
        {/* Todos os meses do ano */}
        <div className="space-y-8">
          {allMonths.map((monthData, monthIndex) => {
            const monthDays = generateMonthDays(monthData.month, monthData.year);
            const weeks = [];
            
            // Dividir dias em semanas
            for (let i = 0; i < monthDays.length; i += 7) {
              weeks.push(monthDays.slice(i, i + 7));
            }

            return (
              <div key={monthIndex} data-month={monthData.month} className="content-stretch flex flex-col gap-[16px] items-end justify-center relative shrink-0 w-full">
                <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[16px] text-right text-white w-full">{monthData.name}</p>
                
                {/* Dias da semana */}
                <div className="content-stretch flex items-center relative shrink-0 w-full">
                  <div className="content-stretch flex flex-col gap-[10px] h-[25px] items-center justify-center relative shrink-0 w-[50px]">
                    <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">d</p>
                  </div>
                  <div className="content-stretch flex flex-col gap-[10px] h-[25px] items-center justify-center relative shrink-0 w-[50px]">
                    <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">s</p>
                  </div>
                  <div className="content-stretch flex flex-col gap-[10px] h-[25px] items-center justify-center relative shrink-0 w-[50px]">
                    <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">t</p>
                  </div>
                  <div className="content-stretch flex flex-col gap-[10px] h-[25px] items-center justify-center relative shrink-0 w-[50px]">
                    <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">q</p>
                  </div>
                  <div className="content-stretch flex flex-col gap-[10px] h-[25px] items-center justify-center relative shrink-0 w-[50px]">
                    <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">q</p>
                  </div>
                  <div className="content-stretch flex flex-col gap-[10px] h-[25px] items-center justify-center relative shrink-0 w-[50px]">
                    <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">s</p>
                  </div>
                  <div className="content-stretch flex flex-col gap-[10px] h-[25px] items-center justify-center relative shrink-0 w-[50px]">
                    <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">s</p>
                  </div>
                </div>

                {/* Calendário do mês */}
                <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-full">
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="content-stretch flex items-center relative shrink-0 w-full">
                      {week.map((day, dayIndex) => (
                        <div key={dayIndex} className="w-[50px] h-[50px] flex items-center justify-center">
                          {day ? (
                            <div className={getDayClass(day, monthData.month, monthData.year)} data-day={day}>
                              <div className="content-stretch flex flex-col gap-[10px] items-center justify-center relative shrink-0 w-full">
                                <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#e9e9e9] text-[10px] w-full">{day}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-[#181818] rounded-[10px] shrink-0 size-[50px]" />
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
