import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Frame106 } from '../common/Frame106';

export function CreateWorkoutIntro() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/workout/create/type');
  };

  return (
    <div className="bg-[#202020] relative size-full" data-name="criar-treino-01">
      <Frame106 onClick={handleStart} text="Começar" />
      <div className="absolute font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] left-[29px] text-[20px] text-white top-[448px]">
        <p className="mb-0">{`Vamos começar `}</p>
        <p>criar um treino!</p>
      </div>
    </div>
  );
}

