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
  
  // Buscar dias do onboarding (se existirem)
  const onboardingDays = JSON.parse(localStorage.getItem('onboarding-days') || '[]');
  const onboardingSplit = JSON.parse(localStorage.getItem('onboarding-split') || '{}');
  
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
  const defaultDays = onboardingDays.map((day: string) => dayMapping[day] || day).filter(Boolean);
  
  const [selectedDays, setSelectedDays] = useState<string[]>(
    workoutData.trainingDays || defaultDays || []
  );
  
  // Informação sobre a divisão de treino (se houver)
  const splitInfo = onboardingSplit.days ? `Divisão ${onboardingSplit.name} (${onboardingSplit.days} dias)` : null;

  const handleDayToggle = (dayKey: string) => {
    setSelectedDays(prev => {
      if (prev.includes(dayKey)) {
        return prev.filter(day => day !== dayKey);
      } else {
        return [...prev, dayKey];
      }
    });
  };

  const handleNext = () => {
    if (selectedDays.length > 0) {
      updateWorkoutData({ 
        trainingDays: selectedDays 
      });
      navigate('/workout/create/ready');
    }
  };

  const handleBack = () => {
    navigate('/workout/create/config');
  };

  return (
    <div className="bg-[#202020] relative w-full h-screen overflow-hidden flex items-center justify-center">
      <div className="relative w-full max-w-[393px] h-full flex flex-col px-5 py-8">
        
        {/* Título fixo */}
        <div className="w-full mb-6">
          <p className="font-alexandria font-normal text-[24px] text-white text-left mb-2">
            Quando você quer treinar?
          </p>
          <p className="font-alexandria font-normal text-[14px] text-white/70 text-left">
            Selecione os dias da semana
          </p>
          {splitInfo && (
            <div className="mt-3 px-3 py-2 bg-[#CF9EE7]/20 rounded-lg">
              <p className="font-alexandria font-normal text-[12px] text-[#CF9EE7]">
                {splitInfo}
              </p>
            </div>
          )}
        </div>
        
        {/* Lista de dias com scroll */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 -mr-2">
          <div className="space-y-3 pb-4">
            {DAYS_OF_WEEK.map((day) => {
              const isSelected = selectedDays.includes(day.key);
              return (
                <button
                  key={day.key}
                  onClick={() => handleDayToggle(day.key)}
                  className={`w-full h-[60px] rounded-[15px] flex items-center justify-between px-5 transition-all ${
                    isSelected
                      ? 'bg-[#288b9f] border-2 border-[#3a9fb3]'
                      : 'bg-[#2c2c2c] border-2 border-transparent hover:bg-[#3c3c3c]'
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span className="text-white text-[16px] font-alexandria font-medium">
                      {day.label}
                    </span>
                    <span className={`text-[12px] font-alexandria font-normal ${
                      isSelected ? 'text-white/80' : 'text-gray-400'
                    }`}>
                      {day.short}
                    </span>
                  </div>
                  
                  {isSelected && (
                    <div className="w-[24px] h-[24px] bg-white rounded-full flex items-center justify-center">
                      <div className="w-[12px] h-[12px] bg-[#288b9f] rounded-full"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Contador de dias - fixo acima do botão */}
        <div className="w-full py-3">
          <div className="bg-[#2c2c2c] rounded-[15px] p-4 text-center">
            <span className="text-white text-[14px] font-alexandria font-medium">
              {selectedDays.length} dia{selectedDays.length !== 1 ? 's' : ''} selecionado{selectedDays.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        
        {/* Botão fixo na parte inferior com margem */}
        <div className="w-full pb-4">
          <button
            onClick={handleNext}
            disabled={selectedDays.length === 0}
            className="bg-[#1c1c1c] hover:bg-[#2c2c2c] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center h-[50px] rounded-[999px] w-full cursor-pointer transition-all"
          >
            <p className="font-alexandria font-medium text-[20px] text-white">Finalizar</p>
          </button>
        </div>
      </div>
    </div>
  );
}

