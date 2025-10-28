import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import svgPaths from '../../imports/svg-ws2buulh19';

export function CreateWorkoutType() {
  const navigate = useNavigate();
  const [selectedWorkout, setSelectedWorkout] = useState<string>('');

  const workouts = [
    { label: 'Musculação', svgPath: svgPaths.p154ef700, top: '280px' },
    { label: 'Cardio', svgPath: svgPaths.p38fa7800, top: '355px' },
    { label: 'Mobilidade', svgPath: svgPaths.pd5ec0c0, top: '430px' },
    { label: 'Yoga', svgPath: svgPaths.p15911000, top: '505px' },
  ];

  const toggleWorkout = (workout: string) => {
    setSelectedWorkout(workout);
  };

  const handleNext = () => {
    if (selectedWorkout) {
      localStorage.setItem('workout-type', selectedWorkout);
      navigate('/workout/create/name');
    }
  };

  return (
    <div className="bg-[#202020] relative w-full h-screen overflow-hidden flex items-center justify-center" data-name="criar-treino-tipo">
      <div className="relative w-full max-w-[393px] h-full flex flex-col px-5 py-8">
        
        {/* Área que centraliza o conteúdo verticalmente */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full space-y-6">
            {/* Título */}
            <p className="font-alexandria font-normal text-[24px] text-white text-left">
              Qual tipo de treino?
            </p>
            
            {/* Lista de opções */}
            <div className="w-full space-y-3">
              {workouts.map((workout) => (
                <button
                  key={workout.label}
                  onClick={() => toggleWorkout(workout.label)}
                  className={`w-full h-[60px] rounded-[20px] flex items-center px-6 gap-4 transition-all ${
                    selectedWorkout === workout.label
                      ? 'bg-[#1c1c1c] text-white'
                      : 'bg-[rgba(61,61,61,0.5)] text-white/70 hover:bg-[rgba(61,61,61,0.7)]'
                  }`}
                >
                  <svg className="w-[24px] h-[24px]">
                    <path d={workout.svgPath} fill="currentColor" />
                  </svg>
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

