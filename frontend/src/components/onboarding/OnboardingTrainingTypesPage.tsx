import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Frame106 } from '../common/Frame106';
import { WorkoutOption } from '../common/WorkoutOption';
import svgPaths from '../../imports/svg-ws2buulh19';

export function OnboardingTrainingTypesPage() {
  const navigate = useNavigate();
  const [selectedWorkouts, setSelectedWorkouts] = useState<string[]>([]);

  const workouts = [
    { label: 'Musculação', svgPath: svgPaths.p154ef700, top: '280px' },
    { label: 'Cardio', svgPath: svgPaths.p38fa7800, top: '355px' },
    { label: 'Mobilidade', svgPath: svgPaths.pd5ec0c0, top: '430px' },
    { label: 'Yoga', svgPath: svgPaths.p15911000, top: '505px' },
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
      navigate('/onboarding/days');
    }
  };

  return (
    <div className="bg-[#4f6c25] relative size-full" data-name="onboarding - 3">
      <Frame106 onClick={handleNext} text="Avançar" />
      <p className="absolute font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] left-[36px] text-[24px] text-nowrap text-white top-[234px] whitespace-pre">Quais seus tipos de treino?</p>
      {workouts.map((workout) => (
        <WorkoutOption
          key={workout.label}
          label={workout.label}
          svgPath={workout.svgPath}
          isSelected={selectedWorkouts.includes(workout.label)}
          onClick={() => toggleWorkout(workout.label)}
          top={workout.top}
        />
      ))}
    </div>
  );
}
