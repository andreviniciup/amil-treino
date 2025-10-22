import { X, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface WorkoutDayPopupProps {
  day: number;
  date: string;
  workoutName: string;
  duration: string;
  improvement?: {
    type: 'weight' | 'reps' | 'none';
    value: string;
    direction: 'up' | 'down' | 'same';
  };
  onClose: () => void;
}

export function WorkoutDayPopup({ 
  day, 
  date, 
  workoutName, 
  duration, 
  improvement,
  onClose 
}: WorkoutDayPopupProps) {
  const getImprovementIcon = () => {
    if (!improvement || improvement.direction === 'same') {
      return <Minus className="w-4 h-4" />;
    }
    return improvement.direction === 'up' 
      ? <TrendingUp className="w-4 h-4" />
      : <TrendingDown className="w-4 h-4" />;
  };

  const getImprovementColor = () => {
    if (!improvement || improvement.direction === 'same') return 'text-gray-400';
    return improvement.direction === 'up' ? 'text-[#6d9f28]' : 'text-[#a91717]';
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] px-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#202020] border border-[#2c2c2c] rounded-[30px] w-full max-w-[350px] p-6 relative shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-[30px] h-[30px] rounded-full bg-[#2c2c2c] hover:bg-[#3c3c3c] flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#288b9f] rounded-[15px] w-[50px] h-[50px] flex items-center justify-center">
              <p className="font-['Alexandria:Medium',_sans-serif] text-white text-[18px]">{day}</p>
            </div>
            <div>
              <p className="font-['Alexandria:Medium',_sans-serif] text-white text-[16px]">{date}</p>
              <p className="font-['Alexandria:Regular',_sans-serif] text-[#6d9f28] text-[12px]">{duration}</p>
            </div>
          </div>

          <div className="h-[1px] bg-[#2c2c2c]" />

          <div>
            <p className="font-['Alexandria:Regular',_sans-serif] text-[#888] text-[12px] mb-1">Treino realizado</p>
            <p className="font-['Alexandria:Medium',_sans-serif] text-white text-[14px]">{workoutName}</p>
          </div>

          {improvement && improvement.direction !== 'same' && (
            <>
              <div className="h-[1px] bg-[#2c2c2c]" />
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 ${getImprovementColor()}`}>
                  {getImprovementIcon()}
                  <p className="font-['Alexandria:Medium',_sans-serif] text-[14px]">
                    {improvement.type === 'weight' ? 'Peso' : 'Repetições'}
                  </p>
                </div>
                <p className={`font-['Alexandria:Regular',_sans-serif] text-[14px] ${getImprovementColor()}`}>
                  {improvement.direction === 'up' ? '+' : ''}{improvement.value}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
