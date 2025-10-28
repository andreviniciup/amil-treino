import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    id: 'abc',
    name: 'ABC',
    days: 3,
    description: 'Divisão clássica em 3 dias',
    splits: ['A - Peito/Tríceps', 'B - Costas/Bíceps', 'C - Pernas/Ombros']
  },
  {
    id: 'upper-lower',
    name: 'Superior/Inferior',
    days: 4,
    description: 'Alterna membros superiores e inferiores',
    splits: ['A - Superior', 'B - Inferior', 'A - Superior', 'B - Inferior']
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

const daysOptions = [
  { value: 3, label: '3 dias' },
  { value: 4, label: '4 dias' },
  { value: 5, label: '5 dias' },
  { value: 6, label: '6 dias' }
];

export function OnboardingSplitPage() {
  const navigate = useNavigate();
  const [selectedDays, setSelectedDays] = useState<number | null>(null);
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

  const handleBack = () => {
    setSelectedDays(null);
    setSelectedSplit(null);
  };

  // Filtrar divisões baseado nos dias selecionados
  const filteredSplits = selectedDays 
    ? splitOptions.filter(split => split.days === selectedDays)
    : [];

  return (
    <div className="bg-[#4f6c25] relative w-full h-screen overflow-hidden flex items-center justify-center" data-name="onboarding-split">
      <div className="relative w-full max-w-[393px] h-full flex flex-col px-5 py-8">
        
        {!selectedDays ? (
          // PASSO 1: Escolher quantidade de dias
          <>
            <div className="flex-1 flex flex-col justify-center">
              <div className="w-full mb-8 text-center">
                <p className="font-alexandria font-normal text-[24px] text-white mb-3">
                  Quantos dias por semana você quer treinar?
                </p>
                
                <p className="font-alexandria font-normal text-[14px] text-white/80">
                  Escolha a frequência que melhor se encaixa na sua rotina
                </p>
              </div>

              <div className="grid grid-cols-2 gap-[16px] px-4">
                {daysOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedDays(option.value)}
                    className="bg-[#ffffff15] hover:bg-[#ffffff25] active:scale-95 border-2 border-transparent hover:border-[#ffffff30] p-[24px] rounded-[20px] transition-all flex flex-col items-center justify-center min-h-[100px]"
                  >
                    <p className="font-alexandria font-medium text-[32px] text-white mb-[4px]">
                      {option.value}
                    </p>
                    <p className="font-alexandria font-normal text-[14px] text-white/70">
                      dias
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          // PASSO 2: Escolher divisão
          <>
            <div className="w-full mb-6">
              <button
                onClick={handleBack}
                className="mb-4 flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                <span className="font-alexandria font-normal text-[14px]">← Voltar</span>
              </button>
              
              <p className="font-alexandria font-normal text-[24px] text-white mb-3">
                Escolha sua divisão de treino
              </p>
              
              <p className="font-alexandria font-normal text-[14px] text-white/80">
                Baseado em {selectedDays} dias por semana, qual divisão prefere?
              </p>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
              <div className="flex flex-col gap-[12px] pb-4">
                {filteredSplits.map((split) => (
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
                          font-alexandria font-medium text-[16px] mb-[4px]
                          ${selectedSplit === split.id ? 'text-[#202020]' : 'text-white'}
                        `}>
                          {split.name}
                        </p>
                        <p className={`
                          font-alexandria font-normal text-[12px]
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
                          font-alexandria font-medium text-[12px]
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
                            font-alexandria font-normal
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
            
            <div className="w-full pt-4">
              <button
                onClick={handleNext}
                disabled={!selectedSplit}
                className="bg-[#1c1c1c] hover:bg-[#2c2c2c] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center h-[50px] rounded-[999px] w-full cursor-pointer transition-all"
              >
                <p className="font-alexandria font-medium text-[20px] text-white">Avançar</p>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
