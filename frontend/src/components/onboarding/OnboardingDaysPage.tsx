import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function OnboardingDaysPage() {
  const navigate = useNavigate();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const days = [
    { label: 'S', value: 'Segunda' },
    { label: 'T', value: 'Terça' },
    { label: 'Q', value: 'Quarta' },
    { label: 'Q', value: 'Quinta' },
    { label: 'S', value: 'Sexta' },
    { label: 'S', value: 'Sábado' },
    { label: 'D', value: 'Domingo' },
  ];

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  const handleNext = () => {
    if (selectedDays.length > 0) {
      localStorage.setItem('onboarding-days', JSON.stringify(selectedDays));
      navigate('/onboarding/final');
    }
  };

  return (
    <div className="bg-[#4f6c25] relative w-full h-screen overflow-hidden flex items-center justify-center" data-name="onboarding - 4">
      <div className="relative w-full max-w-[393px] h-full flex flex-col px-5 py-8">
        
        {/* Área que centraliza o conteúdo verticalmente */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full space-y-8">
            {/* Título */}
            <div className="text-center">
              <p className="font-alexandria font-normal text-[24px] text-white">
                Quais dias você
              </p>
              <p className="font-alexandria font-normal text-[24px] text-white">
                pretende treinar?
              </p>
            </div>
            
            {/* Grid de dias */}
            <div className="w-full flex justify-between gap-2">
              {days.map((day, index) => (
                <button
                  key={`${day.value}-${index}`}
                  onClick={() => toggleDay(day.value)}
                  className={`w-[45px] h-[45px] rounded-full flex items-center justify-center transition-all ${
                    selectedDays.includes(day.value)
                      ? 'bg-[#1c1c1c] text-white'
                      : 'bg-[rgba(0,0,0,0.2)] text-white/70 hover:bg-[rgba(0,0,0,0.3)]'
                  }`}
                >
                  <p className="font-alexandria font-medium text-[16px]">{day.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Botão fixo na parte inferior com margem */}
        <div className="w-full pt-6 pb-4">
          <button
            onClick={handleNext}
            className="bg-[#1c1c1c] hover:bg-[#2c2c2c] active:scale-95 flex items-center justify-center h-[50px] rounded-[999px] w-full cursor-pointer transition-all"
          >
            <p className="font-alexandria font-medium text-[20px] text-white">Avançar</p>
          </button>
        </div>
      </div>
    </div>
  );
}
