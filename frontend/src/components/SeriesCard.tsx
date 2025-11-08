import { useEffect, useMemo, useState, memo, useCallback } from 'react';
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

export const SeriesCard = memo(function SeriesCard({
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
    // Tenta extrair número de strings como "6 a 8" ou "8 repetições" ou apenas "8"
    const match = repetitions.match(/(\d+)/);
    if (match) {
      const parsed = parseInt(match[1], 10);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
    return 8;
  }, [repetitions, repsMax]);

  const initialWeight = useMemo(() => {
    const parsed = parseFloat(weight);
    return Number.isFinite(parsed) ? parsed : 12;
  }, [weight]);

  const initialRestTime = useMemo(() => {
    const parsed = parseInt(restTime, 10);
    return Number.isFinite(parsed) ? parsed : 90;
  }, [restTime]);

  // Inicializar valores baseados nas props, mas preservar valores finais se já existirem
  const [currentReps, setCurrentReps] = useState(initialReps);
  const [currentWeight, setCurrentWeight] = useState(initialWeight);
  const [currentRestTime, setCurrentRestTime] = useState(initialRestTime);
  // Inicializar valores finais - se o status é "completed", usar valores das props (que já foram atualizados)
  const [finalReps, setFinalReps] = useState(() => {
    // Se está completed, usar o valor das props (que já foi atualizado)
    if (status === "completed") {
      return initialReps;
    }
    return initialReps;
  });
  const [finalWeight, setFinalWeight] = useState(() => {
    if (status === "completed") {
      return initialWeight;
    }
    return initialWeight;
  });
  const [finalRestTime, setFinalRestTime] = useState(() => {
    if (status === "completed") {
      return initialRestTime;
    }
    return initialRestTime;
  });
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

  // Sincronizar valores finais quando as props mudam (especialmente quando status muda para "completed")
  useEffect(() => {
    if (status === "completed") {
      // Quando está completed, sincronizar valores finais com as props (que já foram atualizadas)
      setFinalReps(initialReps);
      setCurrentReps(initialReps);
    }
  }, [status, initialReps]);

  useEffect(() => {
    if (status === "completed") {
      setFinalWeight(initialWeight);
      setCurrentWeight(initialWeight);
    }
  }, [status, initialWeight]);

  useEffect(() => {
    if (status === "completed") {
      setFinalRestTime(initialRestTime);
      setCurrentRestTime(initialRestTime);
    }
  }, [status, initialRestTime]);

  // Sincronizar valores iniciais apenas quando necessário, preservando valores confirmados
  useEffect(() => {
    // Se o status é "completed", não resetar valores - mantém os valores finais
    if (status === "completed") {
      return;
    }
    
    // Só atualiza se os valores finais ainda não foram modificados
    // Isso evita resetar valores que já foram confirmados pelo usuário
    if (finalReps === initialReps && (!isExpanded || status === "pending")) {
      setCurrentReps(initialReps);
    }
  }, [initialReps, status, isExpanded, finalReps]);

  useEffect(() => {
    if (status === "completed") {
      return;
    }
    
    if (finalWeight === initialWeight) {
      setCurrentWeight(initialWeight);
    }
  }, [initialWeight, status, finalWeight]);

  useEffect(() => {
    if (status === "completed") {
      return;
    }
    
    if (finalRestTime === initialRestTime) {
      setCurrentRestTime(initialRestTime);
    }
  }, [initialRestTime, status, finalRestTime]);

  useEffect(() => {
    if (!isExpanded) {
      setActiveField('reps');
    } else {
      // Quando expandir, garante que o valor atual está sincronizado
      if (activeField === 'reps' && currentReps !== initialReps && status === "active") {
        // Mantém o valor atual se já foi modificado
      }
    }
  }, [isExpanded, activeField, currentReps, initialReps, status]);

  const handleOpenField = useCallback((field: 'reps' | 'weight' | 'rest') => {
    // Não permitir abrir campos de séries completadas
    if (status === "completed") {
      return;
    }
    
    setActiveField(field);
    // Garante que o valor está sincronizado quando abre o campo
    if (field === 'reps' && currentReps === initialReps) {
      // Se o valor ainda não foi modificado, usa o valor inicial
      setCurrentReps(initialReps);
    } else if (field === 'weight' && currentWeight === initialWeight) {
      setCurrentWeight(initialWeight);
    } else if (field === 'rest' && currentRestTime === initialRestTime) {
      setCurrentRestTime(initialRestTime);
    }
    onToggleExpand?.();
  }, [status, currentReps, initialReps, currentWeight, initialWeight, currentRestTime, initialRestTime, onToggleExpand]);

  const updateReps = useCallback((newMax: number) => {
    const clamped = Math.max(repsMin, newMax);
    setCurrentReps(clamped);
    setFinalReps(clamped);
    onRepetitionsChange?.(clamped.toString());
    onRepsChange?.(repsMin, clamped);
  }, [repsMin, onRepetitionsChange, onRepsChange]);

  const handleRepsIncrease = useCallback(() => {
    updateReps(currentReps + 1);
  }, [currentReps, updateReps]);

  const handleRepsDecrease = useCallback(() => {
    updateReps(currentReps - 1);
  }, [currentReps, updateReps]);

  const handleWeightIncrease = useCallback(() => {
    const newWeight = currentWeight + 1;
    setCurrentWeight(newWeight);
    setFinalWeight(newWeight);
    onWeightChange?.(newWeight.toString());
    onWeightChangeNumber?.(newWeight);
  }, [currentWeight, onWeightChange, onWeightChangeNumber]);

  const handleWeightDecrease = useCallback(() => {
    const newWeight = Math.max(0, currentWeight - 1);
      setCurrentWeight(newWeight);
    setFinalWeight(newWeight);
      onWeightChange?.(newWeight.toString());
    onWeightChangeNumber?.(newWeight);
  }, [currentWeight, onWeightChange, onWeightChangeNumber]);

  const handleRestTimeIncrease = useCallback(() => {
    const newTime = currentRestTime + 5;
    setCurrentRestTime(newTime);
    onRestTimeChange?.(newTime.toString());
    onRestTimeChangeNumber?.(newTime);
  }, [currentRestTime, onRestTimeChange, onRestTimeChangeNumber]);

  const handleRestTimeDecrease = useCallback(() => {
    const newTime = Math.max(0, currentRestTime - 5);
      setCurrentRestTime(newTime);
      onRestTimeChange?.(newTime.toString());
    onRestTimeChangeNumber?.(newTime);
  }, [currentRestTime, onRestTimeChange, onRestTimeChangeNumber]);

  const handleStartRestClick = useCallback(() => {
    // Não permitir iniciar timer para séries completadas
    if (status === "completed") {
      return;
    }
    
    setFinalReps(currentReps);
    setFinalWeight(currentWeight);
    onStartRest?.(currentReps, currentWeight, currentRestTime);
  }, [status, currentReps, currentWeight, currentRestTime, onStartRest]);

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
    console.log(`🟢 SeriesCard ${seriesNumber} renderizando como COMPLETED (verde) - finalReps: ${finalReps}, finalWeight: ${finalWeight}`);
    return (
      <div className="w-full max-w-[350px] rounded-[28px] bg-[#6D9F28] px-[13px] py-[5px] flex items-center justify-between gap-[20px]">
        <div className="flex items-center gap-[10px]">
          <span className="text-[14px] font-['Alexandria:Regular',_sans-serif] text-[#345408]">{seriesNumber}</span>
          <div className="w-px h-6 bg-[#43690F]" />
          <span className="text-[12px] font-['Alexandria:Regular',_sans-serif] text-white/70">{finalReps} repetições</span>
          </div>
        <div className="flex items-center gap-[12px]">
          <svg width="17" height="10" viewBox="0 0 19 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 6H1.85M4.4 2.66667H2.7C2.47457 2.66667 2.25837 2.75446 2.09896 2.91074C1.93955 3.06702 1.85 3.27899 1.85 3.5V8.5C1.85 8.72101 1.93955 8.93297 2.09896 9.08926C2.25837 9.24554 2.47457 9.33333 2.7 9.33333H4.4M6.95 6H12.05M14.6 2.66667H16.3C16.5254 2.66667 16.7416 2.75446 16.901 2.91074C17.0604 3.06702 17.15 3.27899 17.15 3.5V8.5C17.15 8.72101 17.0604 8.93297 16.901 9.08926C16.7416 9.24554 16.5254 9.33333 16.3 9.33333H14.6M18 6H17.15M4.4 1.83333V10.1667C4.4 10.3877 4.48955 10.5996 4.64896 10.7559C4.80837 10.9122 5.02457 11 5.25 11H6.1C6.32543 11 6.54163 10.9122 6.70104 10.7559C6.86045 10.5996 6.95 10.3877 6.95 10.1667V1.83333C6.95 1.61232 6.86045 1.40036 6.70104 1.24408C6.54163 1.0878 6.32543 1 6.1 1H5.25C5.02457 1 4.80837 1.0878 4.64896 1.24408C4.48955 1.40036 4.4 1.61232 4.4 1.83333ZM12.05 1.83333V10.1667C12.05 10.3877 12.1396 10.5996 12.299 10.7559C12.4584 10.9122 12.6746 11 12.9 11H13.75C13.9754 11 14.1916 10.9122 14.351 10.7559C14.5104 10.5996 14.6 10.3877 14.6 10.1667V1.83333C14.6 1.61232 14.5104 1.40036 14.351 1.24408C14.1916 1.0878 13.9754 1 13.75 1H12.9C12.6746 1 12.4584 1.0878 12.299 1.24408C12.1396 1.40036 12.05 1.61232 12.05 1.83333Z" stroke="#43690F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[12px] font-['Alexandria:Regular',_sans-serif] text-white/70">{formatWeight(finalWeight)}kg</span>
        </div>
        <div className="w-5 h-5 rounded-full bg-[#43690F] flex items-center justify-center">
          <Check className="w-3.5 h-3.5 text-white" />
        </div>
      </div>
    );
  }

  const handleConfirm = useCallback(() => {
    // Garantir que os valores finais estão salvos antes de fechar
    setFinalReps(currentReps);
    setFinalWeight(currentWeight);
    setFinalRestTime(currentRestTime);
    
    // Notificar mudanças finais
    onRepetitionsChange?.(currentReps.toString());
    onWeightChange?.(currentWeight.toString());
    onRestTimeChange?.(currentRestTime.toString());
    onRepsChange?.(repsMin, currentReps);
    onWeightChangeNumber?.(currentWeight);
    onRestTimeChangeNumber?.(currentRestTime);
    
    onToggleExpand?.();
  }, [currentReps, currentWeight, currentRestTime, repsMin, onRepetitionsChange, onWeightChange, onRestTimeChange, onRepsChange, onWeightChangeNumber, onRestTimeChangeNumber, onToggleExpand]);

  if (status === "active" && isExpanded) {
    const decreaseHandler = activeField === 'reps' ? handleRepsDecrease : activeField === 'weight' ? handleWeightDecrease : handleRestTimeDecrease;
    const increaseHandler = activeField === 'reps' ? handleRepsIncrease : activeField === 'weight' ? handleWeightIncrease : handleRestTimeIncrease;
    const expandedValue = activeField === 'reps' ? currentReps.toString() : activeField === 'weight' ? formatWeight(currentWeight) : currentRestTime.toString();

    return (
      <div className="w-full max-w-[350px] flex flex-col items-center">
        <div className="w-full h-[80px] rounded-[28px] bg-[#202020] flex flex-col">
          <div className="flex justify-end px-5 pt-[6px]">
            <button type="button" onClick={onToggleExpand} className="text-[10px] font-['Alexandria:Regular',_sans-serif] text-[#4C4C4C]">{activeFieldLabel}</button>
          </div>
          <div className="flex items-center justify-center gap-[15px] flex-1">
          <button
              type="button"
              onClick={decreaseHandler}
              className="w-[30px] h-[30px] rounded-[8px] bg-[#70C0D1] flex items-center justify-center transition-transform active:scale-95"
            >
              <Minus className="w-4 h-4 text-[#202020]" />
            </button>
            <div className="w-[90px] h-[40px] rounded-[8px] bg-[#262626] flex items-center justify-center">
              <span className="text-white text-[32px] font-['Alexandria:Regular',_sans-serif] leading-none">{expandedValue}</span>
            </div>
            <button
              type="button"
              onClick={increaseHandler}
              className="w-[30px] h-[30px] rounded-[8px] bg-[#70C0D1] flex items-center justify-center transition-transform active:scale-95"
            >
              <div className="w-[10px] h-[10px] border-2 border-[#202020]" />
            </button>
          </div>
        </div>
        <div className="w-[296px] h-[24px] px-[10px] py-[3px] bg-[#484848] rounded-b-[14px] flex items-center justify-between">
          <span className="text-white text-[10px] font-['Alexandria:Regular',_sans-serif]">What is Lorem Ipsum?</span>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-[10px] py-[2px] bg-[#70C0D1] rounded-[10px] text-[#202020] text-[10px] font-['Alexandria:Regular',_sans-serif] transition-transform active:scale-95"
          >
            confirmar
        </button>
        </div>
      </div>
    );
  }

  if (status === "active") {
    // Usar valores finais se disponíveis, senão usar valores atuais
    const displayReps = finalReps !== initialReps ? `${finalReps} repetições` : repetitionsRangeLabel;
    const displayWeight = finalWeight !== initialWeight ? formatWeight(finalWeight) : formatWeight(currentWeight);
    const displayRestTime = finalRestTime !== initialRestTime ? finalRestTime : currentRestTime;
    
    return (
      <div className="w-full max-w-[350px] rounded-[28px] bg-[#202020] px-[18px] py-[9px] flex flex-col gap-[13px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[23px]">
            <div className="flex items-center gap-[6px]">
              <span className="text-[14px] font-['Alexandria:Regular',_sans-serif] text-white">{seriesNumber}</span>
              <div className="w-px h-6 bg-[#484848]" />
            </div>
            <button
              type="button"
              onClick={() => handleOpenField('reps')}
              className="text-[12px] font-['Alexandria:Regular',_sans-serif] text-white/70 bg-transparent hover:text-white transition-colors"
            >
              {displayReps}
            </button>
          </div>
          <button
            type="button"
            onClick={() => handleOpenField('weight')}
            className="flex items-center gap-[12px] text-white/70 bg-transparent hover:text-white transition-colors"
          >
            <svg width="17" height="10" viewBox="0 0 19 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 6H1.85M4.4 2.66667H2.7C2.47457 2.66667 2.25837 2.75446 2.09896 2.91074C1.93955 3.06702 1.85 3.27899 1.85 3.5V8.5C1.85 8.72101 1.93955 8.93297 2.09896 9.08926C2.25837 9.24554 2.47457 9.33333 2.7 9.33333H4.4M6.95 6H12.05M14.6 2.66667H16.3C16.5254 2.66667 16.7416 2.75446 16.901 2.91074C17.0604 3.06702 17.15 3.27899 17.15 3.5V8.5C17.15 8.72101 17.0604 8.93297 16.901 9.08926C16.7416 9.24554 16.5254 9.33333 16.3 9.33333H14.6M18 6H17.15M4.4 1.83333V10.1667C4.4 10.3877 4.48955 10.5996 4.64896 10.7559C4.80837 10.9122 5.02457 11 5.25 11H6.1C6.32543 11 6.54163 10.9122 6.70104 10.7559C6.86045 10.5996 6.95 10.3877 6.95 10.1667V1.83333C6.95 1.61232 6.86045 1.40036 6.70104 1.24408C6.54163 1.0878 6.32543 1 6.1 1H5.25C5.02457 1 4.80837 1.0878 4.64896 1.24408C4.48955 1.40036 4.4 1.61232 4.4 1.83333ZM12.05 1.83333V10.1667C12.05 10.3877 12.1396 10.5996 12.299 10.7559C12.4584 10.9122 12.6746 11 12.9 11H13.75C13.9754 11 14.1916 10.9122 14.351 10.7559C14.5104 10.5996 14.6 10.3877 14.6 10.1667V1.83333C14.6 1.61232 14.5104 1.40036 14.351 1.24408C14.1916 1.0878 13.9754 1 13.75 1H12.9C12.6746 1 12.4584 1.0878 12.299 1.24408C12.1396 1.40036 12.05 1.61232 12.05 1.83333Z" stroke="#484848" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[12px] font-['Alexandria:Regular',_sans-serif]">{displayWeight}kg</span>
          </button>
        </div>
        <div className="flex items-center justify-between gap-[20px]">
          <button
            type="button"
            onClick={handleStartRestClick}
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
            {displayRestTime} segundos
          </button>
        </div>
      </div>
    );
  }

  // Estado pending - usar valores finais se disponíveis
  const displayRepsPending = finalReps !== initialReps ? `${finalReps} repetições` : currentRepetitionsLabel;
  const displayWeightPending = finalWeight !== initialWeight ? formatWeight(finalWeight) : formatWeight(currentWeight);

  return (
    <div className="w-full max-w-[350px] rounded-[28px] bg-[#202020] px-[18px] py-[12px] flex items-center justify-between opacity-60">
      <div className="flex items-center gap-[23px]">
        <div className="flex items-center gap-[6px]">
          <span className="text-[14px] font-['Alexandria:Regular',_sans-serif] text-white">{seriesNumber}</span>
          <div className="w-px h-6 bg-[#484848]" />
        </div>
        <span className="text-[12px] font-['Alexandria:Regular',_sans-serif] text-white/70">{displayRepsPending}</span>
      </div>
      <div className="flex items-center gap-[12px]">
        <svg width="17" height="10" viewBox="0 0 19 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 6H1.85M4.4 2.66667H2.7C2.47457 2.66667 2.25837 2.75446 2.09896 2.91074C1.93955 3.06702 1.85 3.27899 1.85 3.5V8.5C1.85 8.72101 1.93955 8.93297 2.09896 9.08926C2.25837 9.24554 2.47457 9.33333 2.7 9.33333H4.4M6.95 6H12.05M14.6 2.66667H16.3C16.5254 2.66667 16.7416 2.75446 16.901 2.91074C17.0604 3.06702 17.15 3.27899 17.15 3.5V8.5C17.15 8.72101 17.0604 8.93297 16.901 9.08926C16.7416 9.24554 16.5254 9.33333 16.3 9.33333H14.6M18 6H17.15M4.4 1.83333V10.1667C4.4 10.3877 4.48955 10.5996 4.64896 10.7559C4.80837 10.9122 5.02457 11 5.25 11H6.1C6.32543 11 6.54163 10.9122 6.70104 10.7559C6.86045 10.5996 6.95 10.3877 6.95 10.1667V1.83333C6.95 1.61232 6.86045 1.40036 6.70104 1.24408C6.54163 1.0878 6.32543 1 6.1 1H5.25C5.02457 1 4.80837 1.0878 4.64896 1.24408C4.48955 1.40036 4.4 1.61232 4.4 1.83333ZM12.05 1.83333V10.1667C12.05 10.3877 12.1396 10.5996 12.299 10.7559C12.4584 10.9122 12.6746 11 12.9 11H13.75C13.9754 11 14.1916 10.9122 14.351 10.7559C14.5104 10.5996 14.6 10.3877 14.6 10.1667V1.83333C14.6 1.61232 14.5104 1.40036 14.351 1.24408C14.1916 1.0878 13.9754 1 13.75 1H12.9C12.6746 1 12.4584 1.0878 12.299 1.24408C12.1396 1.40036 12.05 1.61232 12.05 1.83333Z" stroke="#484848" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-[12px] font-['Alexandria:Regular',_sans-serif] text-white/70">{displayWeightPending}kg</span>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Comparação customizada para otimizar re-renderizações
  return (
    prevProps.seriesNumber === nextProps.seriesNumber &&
    prevProps.repetitions === nextProps.repetitions &&
    prevProps.weight === nextProps.weight &&
    prevProps.restTime === nextProps.restTime &&
    prevProps.status === nextProps.status &&
    prevProps.isExpanded === nextProps.isExpanded &&
    prevProps.repsMin === nextProps.repsMin &&
    prevProps.repsMax === nextProps.repsMax
  );
});
