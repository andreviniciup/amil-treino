import { useEffect, useMemo, useState } from 'react';
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
  repsMin?: number;
  repsMax?: number;
  onRepsChange?: (min: number, max: number) => void;
  onWeightChangeNumber?: (value: number) => void;
  onRestTimeChangeNumber?: (value: number) => void;
  onComplete?: (reps: number, weight: number) => void;
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
  repsMin = 1,
  repsMax,
  onRepsChange,
  onWeightChangeNumber,
  onRestTimeChangeNumber,
  onComplete,
}: SeriesCardProps) {
  const initialReps = useMemo(() => {
    if (typeof repsMax === "number") {
      return repsMax;
    }
    const parsed = parseInt(repetitions, 10);
    return Number.isFinite(parsed) ? parsed : 8;
  }, [repetitions, repsMax]);

  const initialWeight = useMemo(() => {
    const parsed = parseFloat(weight);
    return Number.isFinite(parsed) ? parsed : 12;
  }, [weight]);

  const initialRestTime = useMemo(() => {
    const parsed = parseInt(restTime, 10);
    return Number.isFinite(parsed) ? parsed : 90;
  }, [restTime]);

  const [currentReps, setCurrentReps] = useState(initialReps);
  const [currentWeight, setCurrentWeight] = useState(initialWeight);
  const [currentRestTime, setCurrentRestTime] = useState(initialRestTime);
  const [finalReps, setFinalReps] = useState(initialReps);
  const [finalWeight, setFinalWeight] = useState(initialWeight);
  const [hasEmittedCompletion, setHasEmittedCompletion] = useState(false);
  const [activeField, setActiveField] = useState<'reps' | 'weight' | 'rest'>('reps');

  const formatWeight = (value: number) => (Number.isInteger(value) ? value.toString() : value.toFixed(1));
  const repetitionsRangeLabel = typeof repsMax === "number" ? `${repsMin} a ${repsMax} repetições` : repetitions.includes("repet") ? repetitions : `${repetitions} repetições`;
  const currentRepetitionsLabel = `${currentReps} repetições`;
  const restTimeLabel = `${currentRestTime} segundos`;
  const activeFieldLabel = {
    reps: "repetições",
    weight: "peso (kg)",
    rest: "descanso (seg)",
  }[activeField];

  useEffect(() => {
    setCurrentReps(initialReps);
    if (status !== "completed") {
      setFinalReps(initialReps);
    }
  }, [initialReps, status]);

  useEffect(() => {
    setCurrentWeight(initialWeight);
    if (status !== "completed") {
      setFinalWeight(initialWeight);
    }
  }, [initialWeight, status]);

  useEffect(() => {
    setCurrentRestTime(initialRestTime);
  }, [initialRestTime]);

  useEffect(() => {
    if (!isExpanded) {
      setActiveField('reps');
    }
  }, [isExpanded]);

  const handleOpenField = (field: 'reps' | 'weight' | 'rest') => {
    setActiveField(field);
    onToggleExpand?.();
  };

  const updateReps = (newMax: number) => {
    const clamped = Math.max(repsMin, newMax);
    setCurrentReps(clamped);
    setFinalReps(clamped);
    onRepetitionsChange?.(clamped.toString());
    onRepsChange?.(repsMin, clamped);
  };

  const handleRepsIncrease = () => {
    updateReps(currentReps + 1);
  };

  const handleRepsDecrease = () => {
    updateReps(currentReps - 1);
  };

  const handleWeightIncrease = () => {
    const newWeight = currentWeight + 1;
    setCurrentWeight(newWeight);
    setFinalWeight(newWeight);
    onWeightChange?.(newWeight.toString());
    onWeightChangeNumber?.(newWeight);
  };

  const handleWeightDecrease = () => {
    const newWeight = Math.max(0, currentWeight - 1);
    setCurrentWeight(newWeight);
    setFinalWeight(newWeight);
    onWeightChange?.(newWeight.toString());
    onWeightChangeNumber?.(newWeight);
  };

  const handleRestTimeIncrease = () => {
    const newTime = currentRestTime + 5;
    setCurrentRestTime(newTime);
    onRestTimeChange?.(newTime.toString());
    onRestTimeChangeNumber?.(newTime);
  };

  const handleRestTimeDecrease = () => {
    const newTime = Math.max(0, currentRestTime - 5);
    setCurrentRestTime(newTime);
    onRestTimeChange?.(newTime.toString());
    onRestTimeChangeNumber?.(newTime);
  };

  const handleStartRestClick = () => {
    setFinalReps(currentReps);
    setFinalWeight(currentWeight);
    onStartRest?.(currentReps, currentWeight, currentRestTime);
  };

  useEffect(() => {
    if (status === "completed") {
      if (!hasEmittedCompletion) {
        setHasEmittedCompletion(true);
        onComplete?.(finalReps, finalWeight);
      }
    } else {
      setHasEmittedCompletion(false);
    }
  }, [status, hasEmittedCompletion, finalReps, finalWeight, onComplete]);

  if (status === "completed") {
    return (
      <div className="w-full max-w-[350px] rounded-[28px] bg-[#6D9F28] px-[13px] py-[5px] flex items-center justify-between gap-[20px]">
        <div className="flex items-center gap-[10px]">
          <span className="text-[14px] font-['Alexandria:Regular',_sans-serif] text-[#345408]">{seriesNumber}</span>
          <div className="w-px h-6 bg-[#43690F]" />
          <span className="text-[12px] font-['Alexandria:Regular',_sans-serif] text-white/70">{finalReps} repetições</span>
        </div>
        <div className="flex items-center gap-[12px]">
          <div className="w-[17px] h-[10px] rounded-[2px] border border-[#43690F]" />
          <span className="text-[12px] font-['Alexandria:Regular',_sans-serif] text-white/70">{formatWeight(finalWeight)}kg</span>
        </div>
        <div className="w-5 h-5 rounded-full bg-[#43690F] flex items-center justify-center">
          <Check className="w-3.5 h-3.5 text-white" />
        </div>
      </div>
    );
  }

  if (status === "active" && isExpanded) {
    const decreaseHandler = activeField === 'reps' ? () => updateReps(currentReps - 1) : activeField === 'weight' ? handleWeightDecrease : handleRestTimeDecrease;
    const increaseHandler = activeField === 'reps' ? () => updateReps(currentReps + 1) : activeField === 'weight' ? handleWeightIncrease : handleRestTimeIncrease;
    const expandedValue = activeField === 'reps' ? currentReps.toString() : activeField === 'weight' ? formatWeight(currentWeight) : currentRestTime.toString();

    return (
      <div className="w-full max-w-[350px] rounded-[28px] bg-[#202020] flex flex-col">
        <div className="flex justify-end px-5 pt-[6px]">
          <button type="button" onClick={onToggleExpand} className="text-[10px] font-['Alexandria:Regular',_sans-serif] text-[#4C4C4C]">{activeFieldLabel}</button>
        </div>
        <div className="flex flex-col items-center gap-[3px] pb-[12px]">
          <div className="flex items-center gap-[13px]">
            <button
              type="button"
              onClick={decreaseHandler}
              className="w-[30px] h-[30px] rounded-[8px] bg-[#FDCB1A] flex items-center justify-center transition-transform active:scale-95"
            >
              <Minus className="w-4 h-4 text-black" />
            </button>
            <div className="w-[90px] h-[40px] rounded-[5px] bg-[#262626] flex items-center justify-center">
              <span className="text-white text-[32px] font-['Alexandria:Regular',_sans-serif] leading-none">{expandedValue}</span>
            </div>
            <button
              type="button"
              onClick={increaseHandler}
              className="w-[30px] h-[30px] rounded-[8px] bg-[#FDCB1A] flex items-center justify-center transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4 text-black" />
            </button>
          </div>
          {activeField === 'rest' && (
            <button
              type="button"
              onClick={handleStartRestClick}
              className="mt-3 flex items-center gap-2 rounded-full bg-[#FDCB1A] px-[26px] py-[6px] text-[#262626] text-[12px] font-['Alexandria:Medium',_sans-serif] transition-transform active:scale-95"
            >
              <Clock className="w-3.5 h-3.5 text-[#262626]" />
              iniciar descanso
            </button>
          )}
        </div>
      </div>
    );
  }

  if (status === "active") {
    return (
      <div className="w-full max-w-[350px] rounded-[28px] bg-[#202020] px-[18px] py-[9px] flex flex-col gap-[13px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[23px]">
            <div className="flex items-center gap-[6px]">
              <span className="text-[14px] font-['Alexandria:Regular',_sans-serif] text-white">{seriesNumber}</span>
              <div className="w-px h-6 bg-[#484848]" />
            </div>
            <span className="text-[12px] font-['Alexandria:Regular',_sans-serif] text-white/70">{repetitionsRangeLabel}</span>
          </div>
          <button
            type="button"
            onClick={() => handleOpenField('weight')}
            className="flex items-center gap-[12px] text-white/70 bg-transparent"
          >
            <div className="w-[17px] h-[10px] rounded-[2px] border border-[#484848]" />
            <span className="text-[12px] font-['Alexandria:Regular',_sans-serif]">{formatWeight(currentWeight)}kg</span>
          </button>
        </div>
        <div className="flex items-center justify-between gap-[20px]">
          <button
            type="button"
            onClick={() => handleOpenField('reps')}
            className="flex items-center gap-2 rounded-full bg-[#D9D9D9] px-[30px] py-[6px] text-black transition-transform active:scale-95"
          >
            <Play className="w-3.5 h-3.5 text-black fill-black" />
            <span className="text-[12px] font-['Alexandria:Medium',_sans-serif]">iniciar</span>
          </button>
          <button
            type="button"
            onClick={() => handleOpenField('rest')}
            className="flex items-center gap-2 rounded-full bg-[#252525] px-[20px] py-[6px] text-[#484848] text-[10px] font-['Alexandria:Regular',_sans-serif] transition-transform active:scale-95"
          >
            <Clock className="w-3.5 h-3.5 text-[#484848]" />
            {restTimeLabel}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[350px] rounded-[28px] bg-[#202020] px-[18px] py-[12px] flex items-center justify-between opacity-60">
      <div className="flex items-center gap-[23px]">
        <div className="flex items-center gap-[6px]">
          <span className="text-[14px] font-['Alexandria:Regular',_sans-serif] text-white">{seriesNumber}</span>
          <div className="w-px h-6 bg-[#484848]" />
        </div>
        <span className="text-[12px] font-['Alexandria:Regular',_sans-serif] text-white/70">{currentRepetitionsLabel}</span>
      </div>
      <div className="flex items-center gap-[12px]">
        <div className="w-[17px] h-[10px] rounded-[2px] border border-[#484848]" />
        <span className="text-[12px] font-['Alexandria:Regular',_sans-serif] text-white/70">{formatWeight(currentWeight)}kg</span>
      </div>
    </div>
  );
}
