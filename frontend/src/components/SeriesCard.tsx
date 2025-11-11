import { useState } from 'react';
import { Minus, Plus, Check, Clock, Play } from 'lucide-react';

interface SeriesCardProps {
  seriesNumber: number;
  repetitions: string;
  weight: string;
  restTime?: string;
  status: "active" | "pending" | "completed";
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onStartRest?: (reps: number, weight: number, restTime: number) => void;
  onRepetitionsChange?: (value: string) => void;
  onWeightChange?: (value: string) => void;
  onRestTimeChange?: (value: string) => void;
}

export function SeriesCard({
  seriesNumber,
  repetitions,
  weight,
  restTime = "90",
  status,
  isExpanded = false,
  onToggleExpand,
  onStartRest,
  onRepetitionsChange,
  onWeightChange,
  onRestTimeChange,
}: SeriesCardProps) {
  const [currentReps, setCurrentReps] = useState(parseInt(repetitions) || 8);
  const [currentWeight, setCurrentWeight] = useState(parseFloat(weight) || 12);
  const [currentRestTime, setCurrentRestTime] = useState(parseInt(restTime) || 90);

  const handleRepsIncrease = () => {
    const newReps = currentReps + 1;
    setCurrentReps(newReps);
    onRepetitionsChange?.(newReps.toString());
  };

  const handleRepsDecrease = () => {
    if (currentReps > 1) {
      const newReps = currentReps - 1;
      setCurrentReps(newReps);
      onRepetitionsChange?.(newReps.toString());
    }
  };

  const handleWeightIncrease = () => {
    const newWeight = currentWeight + 2.5;
    setCurrentWeight(newWeight);
    onWeightChange?.(newWeight.toString());
  };

  const handleWeightDecrease = () => {
    if (currentWeight > 0) {
      const newWeight = Math.max(0, currentWeight - 2.5);
      setCurrentWeight(newWeight);
      onWeightChange?.(newWeight.toString());
    }
  };

  const handleRestTimeIncrease = () => {
    const newTime = currentRestTime + 30;
    setCurrentRestTime(newTime);
    onRestTimeChange?.(newTime.toString());
  };

  const handleRestTimeDecrease = () => {
    if (currentRestTime > 30) {
      const newTime = currentRestTime - 30;
      setCurrentRestTime(newTime);
      onRestTimeChange?.(newTime.toString());
    }
  };

  const handleStartRestClick = () => {
    onStartRest?.(currentReps, currentWeight, currentRestTime);
  };

  if (status === "completed") {
    return (
      <div className="bg-[#4f6c25] h-[50px] relative rounded-[20px] shrink-0 w-full px-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 rounded-full bg-[#3f5c15] flex items-center justify-center">
            <span className="font-['Alexandria:Medium',_sans-serif] text-white text-[14px]">
              {seriesNumber}
            </span>
          </div>
          <span className="font-['Alexandria:Regular',_sans-serif] text-white text-[14px]">
            {currentReps} repetições
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-white/70">💪</span>
            <span className="font-['Alexandria:Regular',_sans-serif] text-white text-[14px]">
              {currentWeight}kg
            </span>
          </div>
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
            <Check className="w-4 h-4 text-[#4f6c25]" />
          </div>
        </div>
      </div>
    );
  }

  if (status === "active" && isExpanded) {
    return (
      <div className="bg-[#2c2c2c] border-2 border-[#FFC700] relative rounded-[20px] shrink-0 w-full p-5 animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1c1c1c] flex items-center justify-center">
              <span className="font-['Alexandria:Medium',_sans-serif] text-white text-[16px]">
                {seriesNumber}
              </span>
            </div>
            <span className="font-['Alexandria:Medium',_sans-serif] text-white text-[16px]">
              Série {seriesNumber}
            </span>
          </div>
          <button
            onClick={onToggleExpand}
            className="text-white/70 hover:text-white text-[12px] font-['Alexandria:Regular',_sans-serif] transition-colors"
          >
            Minimizar
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <p className="font-['Alexandria:Regular',_sans-serif] text-[11px] text-white/50 text-center">
            Repetições
          </p>
          <p className="font-['Alexandria:Regular',_sans-serif] text-[11px] text-white/50 text-center">
            Peso (kg)
          </p>
          <p className="font-['Alexandria:Regular',_sans-serif] text-[11px] text-white/50 text-center">
            Descanso (seg)
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="flex items-center justify-center gap-2">
            <button onClick={handleRepsDecrease} className="w-9 h-9 rounded-[10px] bg-[#FFC700] hover:bg-[#FFD700] active:scale-95 flex items-center justify-center transition-all">
              <Minus className="w-4 h-4 text-black" />
            </button>
            <div className="flex-1 bg-[#1c1c1c] rounded-[10px] h-10 flex items-center justify-center">
              <span className="font-['Alexandria:Bold',_sans-serif] text-white text-[18px]">{currentReps}</span>
            </div>
            <button onClick={handleRepsIncrease} className="w-9 h-9 rounded-[10px] bg-[#FFC700] hover:bg-[#FFD700] active:scale-95 flex items-center justify-center transition-all">
              <Plus className="w-4 h-4 text-black" />
            </button>
          </div>
          <div className="flex items-center justify-center gap-2">
            <button onClick={handleWeightDecrease} className="w-9 h-9 rounded-[10px] bg-[#FFC700] hover:bg-[#FFD700] active:scale-95 flex items-center justify-center transition-all">
              <Minus className="w-4 h-4 text-black" />
            </button>
            <div className="flex-1 bg-[#1c1c1c] rounded-[10px] h-10 flex items-center justify-center">
              <span className="font-['Alexandria:Bold',_sans-serif] text-white text-[18px]">{currentWeight.toFixed(1)}</span>
            </div>
            <button onClick={handleWeightIncrease} className="w-9 h-9 rounded-[10px] bg-[#FFC700] hover:bg-[#FFD700] active:scale-95 flex items-center justify-center transition-all">
              <Plus className="w-4 h-4 text-black" />
            </button>
          </div>
          <div className="flex items-center justify-center gap-2">
            <button onClick={handleRestTimeDecrease} className="w-9 h-9 rounded-[10px] bg-[#FFC700] hover:bg-[#FFD700] active:scale-95 flex items-center justify-center transition-all">
              <Minus className="w-4 h-4 text-black" />
            </button>
            <div className="flex-1 bg-[#1c1c1c] rounded-[10px] h-10 flex items-center justify-center">
              <span className="font-['Alexandria:Bold',_sans-serif] text-white text-[18px]">{currentRestTime}</span>
            </div>
            <button onClick={handleRestTimeIncrease} className="w-9 h-9 rounded-[10px] bg-[#FFC700] hover:bg-[#FFD700] active:scale-95 flex items-center justify-center transition-all">
              <Plus className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>
        <button onClick={handleStartRestClick} className="w-full bg-[#FFC700] hover:bg-[#FFD700] active:scale-95 h-12 rounded-full flex items-center justify-center gap-2 transition-all">
          <Clock className="w-5 h-5 text-black" />
          <span className="font-['Alexandria:Medium',_sans-serif] text-black text-[16px]">Iniciar Descanso</span>
        </button>
      </div>
    );
  }

  if (status === "active") {
    return (
      <div className="bg-[#2c2c2c] relative rounded-[20px] shrink-0 w-full px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-8 h-8 rounded-full bg-[#1c1c1c] flex items-center justify-center">
              <span className="font-['Alexandria:Medium',_sans-serif] text-white text-[16px]">{seriesNumber}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-['Alexandria:Regular',_sans-serif] text-white/70 text-[14px]">{repetitions} repetições</span>
              <div className="flex items-center gap-2">
                <span className="text-white/50">💪</span>
                <span className="font-['Alexandria:Regular',_sans-serif] text-white/70 text-[14px]">{weight}kg</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onToggleExpand} className="bg-white hover:bg-gray-100 active:scale-95 px-6 py-2 rounded-full transition-all flex items-center gap-2">
              <Play className="w-4 h-4 text-black fill-black" />
              <span className="font-['Alexandria:Medium',_sans-serif] text-black text-[14px]">iniciar</span>
            </button>
            <div className="flex items-center gap-1 text-white/50">
              <Clock className="w-4 h-4" />
              <span className="font-['Alexandria:Regular',_sans-serif] text-[12px]">{restTime} segundos</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#2c2c2c] relative rounded-[20px] shrink-0 w-full px-5 py-3 flex items-center justify-between opacity-60">
      <div className="flex items-center gap-4">
        <div className="w-6 h-6 rounded-full bg-[#1c1c1c] flex items-center justify-center">
          <span className="font-['Alexandria:Medium',_sans-serif] text-white text-[14px]">{seriesNumber}</span>
        </div>
        <span className="font-['Alexandria:Regular',_sans-serif] text-white/70 text-[14px]">{repetitions} repetições</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-white/50">💪</span>
        <span className="font-['Alexandria:Regular',_sans-serif] text-white/70 text-[14px]">{weight}kg</span>
      </div>
    </div>
  );
}
