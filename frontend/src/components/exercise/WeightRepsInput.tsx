import { useState } from 'react';
import { Minus, Plus, Check } from 'lucide-react';

interface WeightRepsInputProps {
  currentWeight: number;
  currentReps: number;
  lastWeight?: number;
  lastReps?: number;
  onWeightChange: (weight: number) => void;
  onRepsChange: (reps: number) => void;
  onComplete: () => void;
  disabled?: boolean;
}

export function WeightRepsInput({
  currentWeight,
  currentReps,
  lastWeight,
  lastReps,
  onWeightChange,
  onRepsChange,
  onComplete,
  disabled = false
}: WeightRepsInputProps) {
  const [showComparison, setShowComparison] = useState(false);

  const handleWeightIncrease = () => {
    onWeightChange(currentWeight + 2.5);
  };

  const handleWeightDecrease = () => {
    if (currentWeight > 0) {
      onWeightChange(Math.max(0, currentWeight - 2.5));
    }
  };

  const handleRepsIncrease = () => {
    onRepsChange(currentReps + 1);
  };

  const handleRepsDecrease = () => {
    if (currentReps > 0) {
      onRepsChange(Math.max(0, currentReps - 1));
    }
  };

  const hasImprovement = lastWeight && lastReps && (
    currentWeight > lastWeight || 
    (currentWeight === lastWeight && currentReps > lastReps)
  );

  return (
    <div className="w-full bg-[#202020] rounded-[20px] p-5">
      {/* Header com comparação */}
      {lastWeight && lastReps && (
        <div className="mb-4">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="flex items-center justify-between w-full"
          >
            <p className="font-['Alexandria:Regular',_sans-serif] text-[rgba(255,255,255,0.5)] text-[12px]">
              Última vez: {lastWeight}kg × {lastReps} reps
            </p>
            {hasImprovement && (
              <div className="bg-green-500/20 px-2 py-1 rounded-full">
                <p className="font-['Alexandria:Bold',_sans-serif] text-green-400 text-[10px]">
                  ↑ MELHORIA
                </p>
              </div>
            )}
          </button>
        </div>
      )}

      {/* Inputs de Peso e Reps */}
      <div className="flex items-center gap-4">
        {/* Peso */}
        <div className="flex-1">
          <p className="font-['Alexandria:Regular',_sans-serif] text-[rgba(255,255,255,0.5)] text-[11px] mb-2">
            Peso (kg)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleWeightDecrease}
              disabled={disabled || currentWeight <= 0}
              className="w-[36px] h-[36px] bg-[#2c2c2c] hover:bg-[#3c3c3c] disabled:opacity-30 rounded-full flex items-center justify-center transition-colors active:scale-95"
            >
              <Minus className="w-4 h-4 text-white" />
            </button>
            
            <div className="flex-1 bg-[#2c2c2c] rounded-[12px] h-[48px] flex items-center justify-center">
              <p className="font-['Alexandria:Bold',_sans-serif] text-white text-[20px]">
                {currentWeight.toFixed(1)}
              </p>
            </div>
            
            <button
              onClick={handleWeightIncrease}
              disabled={disabled}
              className="w-[36px] h-[36px] bg-[#2c2c2c] hover:bg-[#3c3c3c] disabled:opacity-30 rounded-full flex items-center justify-center transition-colors active:scale-95"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Repetições */}
        <div className="flex-1">
          <p className="font-['Alexandria:Regular',_sans-serif] text-[rgba(255,255,255,0.5)] text-[11px] mb-2">
            Repetições
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRepsDecrease}
              disabled={disabled || currentReps <= 0}
              className="w-[36px] h-[36px] bg-[#2c2c2c] hover:bg-[#3c3c3c] disabled:opacity-30 rounded-full flex items-center justify-center transition-colors active:scale-95"
            >
              <Minus className="w-4 h-4 text-white" />
            </button>
            
            <div className="flex-1 bg-[#2c2c2c] rounded-[12px] h-[48px] flex items-center justify-center">
              <p className="font-['Alexandria:Bold',_sans-serif] text-white text-[20px]">
                {currentReps}
              </p>
            </div>
            
            <button
              onClick={handleRepsIncrease}
              disabled={disabled}
              className="w-[36px] h-[36px] bg-[#2c2c2c] hover:bg-[#3c3c3c] disabled:opacity-30 rounded-full flex items-center justify-center transition-colors active:scale-95"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Botão de Confirmar */}
      <button
        onClick={onComplete}
        disabled={disabled || currentWeight === 0 || currentReps === 0}
        className="w-full mt-4 bg-[#4f6c25] hover:bg-[#5f7c35] disabled:opacity-30 disabled:cursor-not-allowed rounded-full h-[48px] flex items-center justify-center gap-2 transition-all active:scale-95"
      >
        <Check className="w-5 h-5 text-white" />
        <p className="font-['Alexandria:Medium',_sans-serif] text-white text-[16px]">
          Confirmar Série
        </p>
      </button>
    </div>
  );
}
