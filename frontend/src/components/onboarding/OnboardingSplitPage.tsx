import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Frame106 } from '../common/Frame106';

interface SplitOption {
  id: string;
  name: string;
  days: number;
  description: string;
  splits: string[];
}

const splitOptions: SplitOption[] = [
  {
    id: 'fullbody',
    name: 'Full Body',
    days: 3,
    description: 'Corpo todo em cada treino',
    splits: ['A', 'B', 'C']
  },
  {
    id: 'upper-lower',
    name: 'Superior/Inferior',
    days: 4,
    description: 'Alterna membros superiores e inferiores',
    splits: ['A - Superior', 'B - Inferior', 'A - Superior', 'B - Inferior']
  },
  {
    id: 'abc',
    name: 'ABC',
    days: 3,
    description: 'Divisão clássica em 3 dias',
    splits: ['A - Peito/Tríceps', 'B - Costas/Bíceps', 'C - Pernas/Ombros']
  },
  {
    id: 'abcd',
    name: 'ABCD',
    days: 4,
    description: 'Divisão em 4 dias',
    splits: ['A - Peito/Tríceps', 'B - Costas/Bíceps', 'C - Pernas', 'D - Ombros/Abdômen']
  },
  {
    id: 'abcde',
    name: 'ABCDE',
    days: 5,
    description: 'Divisão em 5 dias',
    splits: ['A - Peito', 'B - Costas', 'C - Pernas', 'D - Ombros', 'E - Braços']
  },
  {
    id: 'abcdef',
    name: 'ABCDEF',
    days: 6,
    description: 'Divisão em 6 dias (Push/Pull/Legs 2x)',
    splits: ['A - Push', 'B - Pull', 'C - Legs', 'D - Push', 'E - Pull', 'F - Legs']
  }
];

export function OnboardingSplitPage() {
  const navigate = useNavigate();
  const [selectedSplit, setSelectedSplit] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedSplit) {
      const split = splitOptions.find(s => s.id === selectedSplit);
      if (split) {
        localStorage.setItem('onboarding-split', JSON.stringify({
          id: split.id,
          name: split.name,
          days: split.days,
          splits: split.splits
        }));
        navigate('/onboarding/days');
      }
    }
  };

  return (
    <div className="bg-[#4f6c25] relative size-full overflow-y-auto" data-name="onboarding-split">
      <Frame106 onClick={handleNext} text="Avançar" />
      
      <div className="absolute left-[25px] right-[25px] top-[180px] pb-[120px]">
        <p className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] text-[24px] text-white mb-[30px]">
          Escolha sua divisão de treino
        </p>
        
        <p className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] text-[14px] text-white/80 mb-[25px]">
          Baseado nos seus dias disponíveis, qual divisão prefere?
        </p>

        <div className="flex flex-col gap-[12px]">
          {splitOptions.map((split) => (
            <button
              key={split.id}
              onClick={() => setSelectedSplit(split.id)}
              className={`
                w-full p-[20px] rounded-[20px] text-left transition-all
                ${selectedSplit === split.id 
                  ? 'bg-[#d9d9d9] border-2 border-[#d9d9d9]' 
                  : 'bg-[#ffffff15] border-2 border-transparent hover:border-[#ffffff30]'
                }
              `}
            >
              <div className="flex justify-between items-start mb-[8px]">
                <div>
                  <p className={`
                    font-['Alexandria:Medium',_sans-serif] font-medium text-[16px] mb-[4px]
                    ${selectedSplit === split.id ? 'text-[#202020]' : 'text-white'}
                  `}>
                    {split.name}
                  </p>
                  <p className={`
                    font-['Alexandria:Regular',_sans-serif] text-[12px]
                    ${selectedSplit === split.id ? 'text-[#202020]/70' : 'text-white/70'}
                  `}>
                    {split.description}
                  </p>
                </div>
                <div className={`
                  px-[12px] py-[6px] rounded-[99px]
                  ${selectedSplit === split.id ? 'bg-[#4f6c25]' : 'bg-[#ffffff20]'}
                `}>
                  <p className={`
                    font-['Alexandria:Medium',_sans-serif] text-[12px]
                    ${selectedSplit === split.id ? 'text-white' : 'text-white/90'}
                  `}>
                    {split.days} dias
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-[6px] mt-[12px]">
                {split.splits.map((day, index) => (
                  <div 
                    key={index}
                    className={`
                      px-[10px] py-[4px] rounded-[8px] text-[10px]
                      font-['Alexandria:Regular',_sans-serif]
                      ${selectedSplit === split.id 
                        ? 'bg-[#4f6c25]/20 text-[#202020]' 
                        : 'bg-[#ffffff10] text-white/80'
                      }
                    `}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
