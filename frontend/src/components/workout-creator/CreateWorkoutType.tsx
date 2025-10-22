import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Frame106 } from '../common/Frame106';
import { WorkoutOption } from '../common/WorkoutOption';
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
    <div className="bg-[#202020] relative size-full" data-name="criar-treino-tipo">
      <Frame106 onClick={handleNext} text="Avançar" />
      <p className="absolute font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] left-[36px] text-[24px] text-nowrap text-white top-[234px] whitespace-pre">Qual tipo de treino?</p>
      {workouts.map((workout) => (
        <WorkoutOption
          key={workout.label}
          label={workout.label}
          svgPath={workout.svgPath}
          isSelected={selectedWorkout === workout.label}
          onClick={() => toggleWorkout(workout.label)}
          top={workout.top}
        />
      ))}
    </div>
  );
}

