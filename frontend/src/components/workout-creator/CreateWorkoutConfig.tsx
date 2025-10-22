import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Frame106 } from '../common/Frame106';
import { useWorkoutCreator } from '../../contexts/WorkoutCreatorContext';

export function CreateWorkoutConfig() {
  const navigate = useNavigate();
  const { workoutData, updateWorkoutData } = useWorkoutCreator();
  const [series, setSeries] = useState(workoutData.series || '');
  const [hasWarmup, setHasWarmup] = useState<boolean | null>(workoutData.hasWarmup ?? null);
  const [reps, setReps] = useState(workoutData.reps || '');

  const handleNext = () => {
    if (series && reps && hasWarmup !== null) {
      updateWorkoutData({ 
        series, 
        hasWarmup, 
        reps 
      });
      navigate('/workout/create/ready');
    }
  };

  return (
    <div className="bg-[#202020] relative size-full" data-name="criar-treino-config">
      <Frame106 onClick={handleNext} text="Avançar" />
      
      <div className="absolute font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] left-[20px] text-[24px] text-white top-[199px]">
        quanta series?
      </div>

      <div className="absolute w-[204px] left-[18px] top-[246px]">
        <input
          type="text"
          value={series}
          onChange={(e) => setSeries(e.target.value)}
          className="w-full h-[40px] bg-[rgba(60,60,60,0.50)] rounded-[999px] border-none text-white text-[16px] font-['Alexandria:Regular',_sans-serif] pl-[20px] pr-[20px] outline-none"
          placeholder="Ex: 3"
        />
      </div>

      <div className="absolute font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] left-[20px] text-[24px] text-white top-[304px]">
        terá serie de aquecimento?
      </div>

      <div className="absolute flex gap-[26px] left-[18px] top-[351px]">
        <div
          onClick={() => setHasWarmup(true)}
          className={`w-[150px] h-[40px] rounded-[999px] flex justify-center items-center cursor-pointer ${
            hasWarmup === true 
              ? 'bg-[rgba(80,80,80,0.50)]' 
              : 'bg-[rgba(60,60,60,0.50)]'
          }`}
        >
          <div className="text-white text-[16px] font-['Alexandria:Regular',_sans-serif]">
            sim
          </div>
        </div>

        <div
          onClick={() => setHasWarmup(false)}
          className={`w-[150px] h-[40px] rounded-[999px] flex justify-center items-center cursor-pointer ${
            hasWarmup === false 
              ? 'bg-[rgba(80,80,80,0.50)]' 
              : 'bg-[rgba(60,60,60,0.50)]'
          }`}
        >
          <div className="text-white text-[16px] font-['Alexandria:Regular',_sans-serif]">
            não
          </div>
        </div>
      </div>

      <div className="absolute font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] left-[20px] text-[24px] text-white top-[409px]">
        quantas?
      </div>

      <div className="absolute w-[204px] left-[20px] top-[456px]">
        <input
          type="text"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          className="w-full h-[40px] bg-[rgba(60,60,60,0.50)] rounded-[999px] border-none text-white text-[16px] font-['Alexandria:Regular',_sans-serif] pl-[20px] pr-[20px] outline-none"
          placeholder="Ex: 12"
        />
      </div>
    </div>
  );
}

