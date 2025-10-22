import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Frame106 } from '../common/Frame106';

function InputFormsOverboarding({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="absolute content-stretch flex flex-col gap-[5px] items-start left-[18px] top-[382px] w-[354px]" data-name="input-forms-overboarding">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Digite o nome do treino"
        className="bg-[rgba(61,61,61,0.5)] h-[40px] rounded-[999px] shrink-0 w-full px-[20px] text-white outline-none focus:bg-[rgba(61,61,61,0.7)] transition-colors placeholder:text-gray-400"
      />
    </div>
  );
}

export function CreateWorkoutName() {
  const navigate = useNavigate();
  const [nomeTreino, setNomeTreino] = useState('');

  const handleNext = () => {
    if (nomeTreino.trim()) {
      localStorage.setItem('workout-name', nomeTreino);
      navigate('/workout/create/muscles');
    }
  };

  return (
    <div className="bg-[#202020] relative size-full" data-name="criar-treino-02">
      <Frame106 onClick={handleNext} text="Avançar" />
      <InputFormsOverboarding value={nomeTreino} onChange={setNomeTreino} />
      <p className="absolute font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] left-[calc(20%+24px)] text-[24px] text-nowrap text-white top-[342px] whitespace-pre">nome do treino</p>
    </div>
  );
}

