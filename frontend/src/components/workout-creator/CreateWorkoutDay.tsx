import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkoutCreator } from '../../contexts/WorkoutCreatorContext';

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Segunda-feira', short: 'Seg' },
  { key: 'tuesday', label: 'Terça-feira', short: 'Ter' },
  { key: 'wednesday', label: 'Quarta-feira', short: 'Qua' },
  { key: 'thursday', label: 'Quinta-feira', short: 'Qui' },
  { key: 'friday', label: 'Sexta-feira', short: 'Sex' },
  { key: 'saturday', label: 'Sábado', short: 'Sáb' },
  { key: 'sunday', label: 'Domingo', short: 'Dom' }
];

export function CreateWorkoutDay() {
  const navigate = useNavigate();
  const { workoutData, updateWorkoutData } = useWorkoutCreator();
  
  // Buscar dados do onboarding
  const onboardingDays = JSON.parse(localStorage.getItem('onboarding-days') || '[]');
  const onboardingSplit = JSON.parse(localStorage.getItem('onboarding-split') || '{}');
  
  // Buscar treinos já criados do localStorage
  const existingWorkouts = JSON.parse(localStorage.getItem('created-workouts') || '[]');
  
  // Mapear dias em português para keys em inglês
  const dayMapping: { [key: string]: string } = {
    'Segunda': 'monday',
    'Terça': 'tuesday',
    'Quarta': 'wednesday',
    'Quinta': 'thursday',
    'Sexta': 'friday',
    'Sábado': 'saturday',
    'Domingo': 'sunday'
  };
  
  // Converter dias do onboarding para o formato correto
  const recommendedDays = onboardingDays.map((day: string) => dayMapping[day] || day).filter(Boolean);
  
  // Selecionar apenas 1 dia
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  
  // Informação sobre a divisão de treino
  const splitInfo = onboardingSplit.days ? `Divisão ${onboardingSplit.name} (${onboardingSplit.days} dias)` : null;

  // Função para verificar se um dia já tem treino com os mesmos músculos
  const isDayBlocked = (dayKey: string): boolean => {
    const currentMuscles = workoutData.musculos || [];
    
    // Verificar se já existe treino neste dia com músculos em comum
    const workoutOnDay = existingWorkouts.find((w: any) => 
      w.trainingDays && w.trainingDays.includes(dayKey)
    );
    
    if (!workoutOnDay) return false;
    
    // Verificar se há músculos em comum
    const workoutMuscles = workoutOnDay.musculos || [];
    const hasCommonMuscles = currentMuscles.some((muscle: string) => 
      workoutMuscles.includes(muscle)
    );
    
    return hasCommonMuscles;
  };

  const handleDaySelect = (dayKey: string) => {
    // Se o dia está bloqueado, não permite selecionar
    if (isDayBlocked(dayKey)) {
      return;
    }
    
    // Toggle: se já está selecionado, deseleciona; senão, seleciona
    if (selectedDay === dayKey) {
      setSelectedDay(null);
    } else {
      setSelectedDay(dayKey);
    }
  };

  const handleNext = () => {
    if (selectedDay) {
      // Salvar o dia selecionado
      updateWorkoutData({ 
        trainingDays: [selectedDay] // Apenas 1 dia
      });
      
      // Salvar o treino atual no localStorage para validação futura
      const workoutToSave = {
        ...workoutData,
        trainingDays: [selectedDay],
        createdAt: new Date().toISOString()
      };
      
      const updatedWorkouts = [...existingWorkouts, workoutToSave];
      localStorage.setItem('created-workouts', JSON.stringify(updatedWorkouts));
      
      navigate('/workout/create/ready');
    }
  };

  const handleBack = () => {
    navigate('/workout/create/config');
  };

  return (
    <div className="bg-[#202020] fixed inset-0 overflow-hidden flex items-center justify-center">
      <div className="relative w-full max-w-[393px] h-full flex flex-col px-5 py-6">
        
        {/* Título fixo */}
        <div className="w-full mb-4 flex-shrink-0">
          <p className="font-alexandria font-normal text-[20px] sm:text-[24px] text-white text-left mb-2">
            Em qual dia será esse treino?
          </p>
          <p className="font-alexandria font-normal text-[13px] sm:text-[14px] text-white/70 text-left">
            Selecione apenas 1 dia
          </p>
          {splitInfo && (
            <div className="mt-2 px-3 py-1.5 bg-[#CF9EE7]/20 rounded-lg">
              <p className="font-alexandria font-normal text-[11px] sm:text-[12px] text-[#CF9EE7]">
                {splitInfo}
              </p>
            </div>
          )}
        </div>
        
        {/* Lista de dias com scroll */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 -mr-2 min-h-0">
          <div className="space-y-2.5 pb-4">
            {DAYS_OF_WEEK.map((day) => {
              const isSelected = selectedDay === day.key;
              const isRecommended = recommendedDays.includes(day.key);
              const isBlocked = isDayBlocked(day.key);
              
              return (
                <button
                  key={day.key}
                  onClick={() => handleDaySelect(day.key)}
                  disabled={isBlocked}
                  className={`w-full h-[55px] sm:h-[60px] rounded-[15px] flex items-center justify-between px-4 sm:px-5 transition-all ${
                    isBlocked
                      ? 'bg-[#1a1a1a] border-2 border-[#3a3a3a] opacity-50 cursor-not-allowed'
                      : isSelected
                      ? 'bg-[#288b9f] border-2 border-[#3a9fb3]'
                      : isRecommended
                      ? 'bg-[#2c2c2c] border-2 border-[#CF9EE7] hover:bg-[#3c3c3c]'
                      : 'bg-[#2c2c2c] border-2 border-transparent hover:bg-[#3c3c3c]'
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2">
                      <span className={`text-[15px] sm:text-[16px] font-alexandria font-medium ${
                        isBlocked ? 'text-gray-500' : 'text-white'
                      }`}>
                        {day.label}
                      </span>
                      {isRecommended && !isBlocked && (
                        <span className="px-2 py-0.5 bg-[#CF9EE7]/30 rounded-full text-[#CF9EE7] text-[9px] font-alexandria font-medium">
                          Recomendado
                        </span>
                      )}
                      {isBlocked && (
                        <span className="px-2 py-0.5 bg-red-500/20 rounded-full text-red-400 text-[9px] font-alexandria font-medium">
                          Bloqueado
                        </span>
                      )}
                    </div>
                    <span className={`text-[11px] sm:text-[12px] font-alexandria font-normal ${
                      isSelected ? 'text-white/80' : isBlocked ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {day.short}
                    </span>
                  </div>
                  
                  {isSelected && (
                    <div className="w-[22px] h-[22px] sm:w-[24px] sm:h-[24px] bg-white rounded-full flex items-center justify-center">
                      <div className="w-[11px] h-[11px] sm:w-[12px] sm:h-[12px] bg-[#288b9f] rounded-full"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Info sobre dia selecionado */}
        <div className="w-full py-2.5 flex-shrink-0">
          <div className="bg-[#2c2c2c] rounded-[15px] p-3 text-center">
            <span className="text-white text-[13px] sm:text-[14px] font-alexandria font-medium">
              {selectedDay ? (
                <>Dia selecionado: {DAYS_OF_WEEK.find(d => d.key === selectedDay)?.label}</>
              ) : (
                'Nenhum dia selecionado'
              )}
            </span>
          </div>
        </div>
        
        {/* Botão fixo na parte inferior com margem */}
        <div className="w-full pb-3 flex-shrink-0">
          <button
            onClick={handleNext}
            disabled={!selectedDay}
            className="bg-[#1c1c1c] hover:bg-[#2c2c2c] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center h-[48px] sm:h-[50px] rounded-[999px] w-full cursor-pointer transition-all"
          >
            <p className="font-alexandria font-medium text-[18px] sm:text-[20px] text-white">Finalizar</p>
          </button>
        </div>
      </div>
    </div>
  );
}

