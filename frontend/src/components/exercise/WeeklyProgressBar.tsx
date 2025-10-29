import { useEffect, useState } from 'react';

interface WeeklyProgressBarProps {
  history: number[]; // Array com número de reps das últimas séries
  currentSet: number;
  totalSets: number;
  targetReps?: number;
}

export function WeeklyProgressBar({ 
  history, 
  currentSet, 
  totalSets,
  targetReps = 10 
}: WeeklyProgressBarProps) {
  const [displayHistory, setDisplayHistory] = useState<number[]>([]);

  useEffect(() => {
    // Preencher com até 12 barras (últimas 12 séries)
    const maxBars = 12;
    const paddedHistory = [...history];
    
    while (paddedHistory.length < maxBars) {
      paddedHistory.unshift(0);
    }
    
    setDisplayHistory(paddedHistory.slice(-maxBars));
  }, [history]);

  const getBarColor = (index: number, value: number) => {
    if (value === 0) return 'bg-[#2c2c2c]';
    
    const totalBars = displayHistory.length;
    const position = index / totalBars;
    
    // Barras antigas (esquerda) - verde
    if (position < 0.5) {
      return 'bg-gradient-to-t from-green-500 to-green-400';
    }
    // Barras recentes (direita) - azul
    else {
      return 'bg-gradient-to-t from-blue-500 to-blue-400';
    }
  };

  const getBarHeight = (value: number) => {
    if (value === 0) return '20%';
    const percentage = Math.min((value / targetReps) * 100, 100);
    return `${Math.max(percentage, 20)}%`;
  };

  const completedSetsThisWeek = history.filter(h => h > 0).length;

  return (
    <div className="w-full bg-[#202020] rounded-[20px] p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-['Alexandria:Medium',_sans-serif] text-white text-[14px]">
            Progresso Semanal
          </p>
          <p className="font-['Alexandria:Regular',_sans-serif] text-[rgba(255,255,255,0.5)] text-[11px] mt-1">
            {completedSetsThisWeek} de {totalSets} séries semanais
          </p>
        </div>
        <div className="bg-[#4f6c25] px-3 py-1 rounded-full">
          <p className="font-['Alexandria:Bold',_sans-serif] text-white text-[12px]">
            {currentSet}/{totalSets}
          </p>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="flex items-end justify-between gap-[4px] h-[60px]">
        {displayHistory.map((value, index) => (
          <div 
            key={index}
            className="flex-1 flex flex-col justify-end"
          >
            <div
              className={`w-full rounded-t-[4px] transition-all duration-300 ${getBarColor(index, value)}`}
              style={{ height: getBarHeight(value) }}
            />
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-t from-green-500 to-green-400" />
          <p className="font-['Alexandria:Regular',_sans-serif] text-[rgba(255,255,255,0.5)] text-[10px]">
            Antigas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-t from-blue-500 to-blue-400" />
          <p className="font-['Alexandria:Regular',_sans-serif] text-[rgba(255,255,255,0.5)] text-[10px]">
            Recentes
          </p>
        </div>
      </div>
    </div>
  );
}
