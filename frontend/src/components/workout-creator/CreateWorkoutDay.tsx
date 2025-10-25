import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Frame106 } from '../common/Frame106';
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
  const [selectedDays, setSelectedDays] = useState<string[]>(workoutData.trainingDays || []);

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
      navigate('/workout/create/config');
    }
  };

  const handleBack = () => {
    navigate('/workout/create/exercises');
  };

  return (
    <div className="bg-[#202020] relative size-full" data-name="criar-treino-dia">
      <Frame106 onClick={handleNext} text="Avançar" />
      
      {/* Botão Voltar */}
      <button
        onClick={handleBack}
        className="absolute left-[20px] top-[50px] text-white text-[16px] font-['Alexandria:Medium',_sans-serif]"
      >
        ← Voltar
      </button>
      
      <div className="absolute font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] left-[20px] text-[24px] text-white top-[120px]">
        Quando você quer treinar?
      </div>

      <div className="absolute font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] left-[20px] text-[16px] text-gray-400 top-[160px]">
        Selecione os dias da semana
      </div>

      {/* Lista de Dias */}
      <div className="absolute left-[20px] top-[200px] right-[20px] space-y-[12px]">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day.key}
            onClick={() => handleDayToggle(day.key)}
            className={`w-full h-[60px] rounded-[15px] flex items-center justify-between px-[20px] cursor-pointer transition-colors ${
              selectedDays.includes(day.key)
                ? 'bg-[#288b9f] border-2 border-[#3a9fb3]'
                : 'bg-[#2c2c2c] border-2 border-transparent hover:bg-[#3c3c3c]'
            }`}
          >
            <div className="flex flex-col">
              <span className="text-white text-[16px] font-['Alexandria:Medium',_sans-serif]">
                {day.label}
              </span>
              <span className="text-gray-400 text-[12px] font-['Alexandria:Regular',_sans-serif]">
                {day.short}
              </span>
            </div>
            
            {selectedDays.includes(day.key) && (
              <div className="w-[24px] h-[24px] bg-white rounded-full flex items-center justify-center">
                <div className="w-[12px] h-[12px] bg-[#288b9f] rounded-full"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contador de Dias Selecionados */}
      <div className="absolute left-[20px] bottom-[120px] right-[20px]">
        <div className="bg-[#2c2c2c] rounded-[15px] p-[16px] text-center">
          <span className="text-white text-[14px] font-['Alexandria:Medium',_sans-serif]">
            {selectedDays.length} dia{selectedDays.length !== 1 ? 's' : ''} selecionado{selectedDays.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
