import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function OnboardingGoalPage() {
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const goals = [
    'Hipertrofia', 'Força', 'Resistência', 'Definição',
    'Perda de Peso', 'Condicionamento', 'Reabilitação', 'Performance'
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleNext = () => {
    if (selectedInterests.length > 0) {
      localStorage.setItem('onboarding-interests', JSON.stringify(selectedInterests));
      navigate('/onboarding/training-types');
    }
  };

  return (
    <div className="bg-[#4f6c25] relative w-full h-screen overflow-hidden flex items-center justify-center" data-name="onboarding - 2">
      <div className="relative w-full max-w-[393px] h-full flex flex-col px-5 py-8">
        
        {/* Área que centraliza o conteúdo verticalmente */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full space-y-8">
            {/* Título */}
            <p className="font-alexandria font-normal text-[24px] text-white text-center">
              Qual o seu foco?
            </p>
            
            {/* Grid de opções */}
            <div className="w-full grid grid-cols-2 gap-3">
              {goals.map((goal) => (
                <button
                  key={goal}
                  onClick={() => toggleInterest(goal)}
                  className={`h-[50px] rounded-[999px] flex items-center justify-center transition-all ${
                    selectedInterests.includes(goal)
                      ? 'bg-[#1c1c1c] text-white'
                      : 'bg-[rgba(0,0,0,0.2)] text-white/70 hover:bg-[rgba(0,0,0,0.3)]'
                  }`}
                >
                  <p className="font-alexandria font-normal text-[14px]">{goal}</p>
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
