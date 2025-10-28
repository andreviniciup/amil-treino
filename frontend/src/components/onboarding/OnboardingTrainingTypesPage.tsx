import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function OnboardingTrainingTypesPage() {
  const navigate = useNavigate();
  const [selectedWorkouts, setSelectedWorkouts] = useState<string[]>([]);

  const workouts = [
    { label: 'Musculação', icon: '💪' },
    { label: 'Cardio', icon: '🏃' },
    { label: 'Mobilidade', icon: '🧘' },
    { label: 'Yoga', icon: '🕉️' },
  ];

  const toggleWorkout = (workout: string) => {
    setSelectedWorkouts((prev) =>
      prev.includes(workout)
        ? prev.filter((w) => w !== workout)
        : [...prev, workout]
    );
  };

  const handleNext = () => {
    if (selectedWorkouts.length > 0) {
      localStorage.setItem('onboarding-workouts', JSON.stringify(selectedWorkouts));
      navigate('/onboarding/split');
    }
  };

  return (
    <div className="bg-[#4f6c25] relative w-full h-screen overflow-hidden flex items-center justify-center" data-name="onboarding - 3">
      <div className="relative w-full max-w-[393px] h-full flex flex-col px-5 py-8">
        
        {/* Área que centraliza o conteúdo verticalmente */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full space-y-6">
            {/* Título */}
            <p className="font-alexandria font-normal text-[24px] text-white text-left">
              Quais seus tipos de treino?
            </p>
            
            {/* Lista de opções */}
            <div className="w-full space-y-3">
              {workouts.map((workout) => (
                <button
                  key={workout.label}
                  onClick={() => toggleWorkout(workout.label)}
                  className={`w-full h-[60px] rounded-[20px] flex items-center px-6 gap-4 transition-all ${
                    selectedWorkouts.includes(workout.label)
                      ? 'bg-[#1c1c1c] text-white'
                      : 'bg-[rgba(0,0,0,0.2)] text-white/70 hover:bg-[rgba(0,0,0,0.3)]'
                  }`}
                >
                  <span className="text-[24px]">{workout.icon}</span>
                  <p className="font-alexandria font-normal text-[18px]">{workout.label}</p>
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
