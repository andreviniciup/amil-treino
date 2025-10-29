import { useState } from 'react';
import { Minus, Plus, Check } from 'lucide-react';
import svgPaths from "../imports/svg-t2f7wjh7pn";
import svgPathsCompleted from "../imports/svg-k8lz78timb";

interface SeriesCardProps {
  seriesNumber: number;
  repetitions: string;
  weight: string;
  restTime?: string;
  status: "active" | "pending" | "completed";
  onStart?: () => void;
  onRepetitionsChange?: (value: string) => void;
  onWeightChange?: (value: string) => void;
  onRestTimeChange?: (value: string) => void;
  onComplete?: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export function SeriesCard({
  seriesNumber,
  repetitions,
  weight,
  restTime = "90",
  status,
  onStart,
  onRepetitionsChange,
  onWeightChange,
  onRestTimeChange,
  onComplete,
  isExpanded = false,
  onToggleExpand,
}: SeriesCardProps) {
  const [localWeight, setLocalWeight] = useState(parseFloat(weight) || 12);
  const [localReps, setLocalReps] = useState(parseInt(repetitions) || 8);
  const [showInlineEditor, setShowInlineEditor] = useState(false);

  const handleWeightIncrease = () => {
    const newWeight = localWeight + 2.5;
    setLocalWeight(newWeight);
    onWeightChange?.(newWeight.toString());
  };

  const handleWeightDecrease = () => {
    if (localWeight > 0) {
      const newWeight = Math.max(0, localWeight - 2.5);
      setLocalWeight(newWeight);
      onWeightChange?.(newWeight.toString());
    }
  };

  const handleRepsIncrease = () => {
    const newReps = localReps + 1;
    setLocalReps(newReps);
    onRepetitionsChange?.(newReps.toString());
  };

  const handleRepsDecrease = () => {
    if (localReps > 0) {
      const newReps = Math.max(0, localReps - 1);
      setLocalReps(newReps);
      onRepetitionsChange?.(newReps.toString());
    }
  };

  const handleConfirm = () => {
    onComplete?.();
    onToggleExpand?.();
  };

  // Estados completados (verde)
  if (status === "completed") {
    return (
      <div className="bg-[#6d9f28] h-[35px] relative rounded-[28px] shrink-0 w-full">
        <div className="flex flex-col items-center justify-center size-full">
          <div className="box-border content-stretch flex flex-col gap-[10px] h-[35px] items-center justify-center px-[13px] py-[5px] relative w-full">
            <div className="content-stretch flex gap-[51px] items-center relative shrink-0">
              <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
                <p className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[#345408] text-[14px] w-[10px]">
                  {seriesNumber}
                </p>
                <div
                  className="flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]"
                  style={
                    {
                      "--transform-inner-width": "24",
                      "--transform-inner-height": "0",
                    } as React.CSSProperties
                  }
                >
                  <div className="flex-none rotate-[90deg]">
                    <div className="h-0 relative w-[24px]">
                      <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
                        <svg
                          className="block size-full"
                          fill="none"
                          preserveAspectRatio="none"
                          viewBox="0 0 24 1"
                        >
                          <line
                            id="Line 4"
                            stroke="#43690F"
                            strokeLinecap="round"
                            x1="0.5"
                            x2="23.5"
                            y1="0.5"
                            y2="0.5"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-[rgba(255,255,255,0.73)] w-[101px]">
                  {repetitions} repetições
                </p>
              </div>
              <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
                <div className="h-[10px] relative shrink-0 w-[17px]" data-name="Vector">
                  <div className="absolute inset-[-7.5%_-4.41%]">
                    <svg
                      className="block size-full"
                      fill="none"
                      preserveAspectRatio="none"
                      viewBox="0 0 19 12"
                    >
                      <path
                        d={svgPathsCompleted.p1aa92980}
                        id="Vector"
                        stroke="#43690F"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                </div>
                <p className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-[rgba(255,255,255,0.73)] w-[29px]">
                  {weight}kg
                </p>
              </div>
              <div className="relative shrink-0 size-[20px]">
                <svg
                  className="block size-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    d={svgPathsCompleted.p2a2a4900}
                    fill="#43690F"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Estados pendentes (cinza simples) - Popup inline ao clicar em peso/reps
  if (status === "pending") {
    return (
      <div className="relative w-full">
        {/* Card minimizado */}
        <div className="bg-[#202020] h-[35px] relative rounded-[28px] shrink-0 w-full">
          <div className="size-full">
            <div className="box-border content-stretch flex flex-col gap-[10px] h-[35px] items-start px-[26px] py-[5px] relative w-full">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                <div className="content-stretch flex gap-[23px] items-center relative shrink-0">
                  <div className="content-stretch flex items-center justify-between relative shrink-0 w-[17px]">
                    <p className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-white w-[10px]">
                      {seriesNumber}
                    </p>
                    <div
                      className="flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]"
                      style={
                        {
                          "--transform-inner-width": "24",
                          "--transform-inner-height": "0",
                        } as React.CSSProperties
                      }
                    >
                      <div className="flex-none rotate-[90deg]">
                        <div className="h-0 relative w-[24px]">
                          <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
                            <svg
                              className="block size-full"
                              fill="none"
                              preserveAspectRatio="none"
                              viewBox="0 0 24 1"
                            >
                              <line
                                id="Line 4"
                                stroke="#484848"
                                strokeLinecap="round"
                                x1="0.5"
                                x2="23.5"
                                y1="0.5"
                                y2="0.5"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Área clicável de repetições */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowInlineEditor(!showInlineEditor);
                    }}
                    className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-[rgba(187,187,187,0.73)] hover:text-white transition-colors"
                  >
                    {repetitions} repetições
                  </button>
                </div>
                
                {/* Área clicável de peso */}
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
                  <div className="h-[10px] relative shrink-0 w-[17px]" data-name="Vector">
                    <div className="absolute inset-[-7.5%_-4.41%]">
                      <svg
                        className="block size-full"
                        fill="none"
                        preserveAspectRatio="none"
                        viewBox="0 0 19 12"
                      >
                        <path
                          d={svgPaths.p1aa92980}
                          id="Vector"
                          stroke="#484848"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowInlineEditor(!showInlineEditor);
                    }}
                    className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-[rgba(187,187,187,0.73)] hover:text-white transition-colors"
                  >
                    {weight}kg
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Popup inline de edição (igual ao da imagem azul) */}
        {showInlineEditor && (
          <div className="absolute top-[-10px] left-0 right-0 z-50 bg-[#1c1c1c] border-2 border-blue-500 rounded-[20px] p-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <p className="font-['Alexandria:Medium',_sans-serif] text-white text-[12px] text-[rgba(255,255,255,0.5)]">
                Peso (kg)
              </p>
              <p className="font-['Alexandria:Medium',_sans-serif] text-white text-[12px] text-[rgba(255,255,255,0.5)]">
                Repetições
              </p>
            </div>

            {/* Controles de Peso e Reps */}
            <div className="flex items-center gap-4 mb-4">
              {/* Peso */}
              <div className="flex-1 flex items-center gap-2">
                <button
                  onClick={handleWeightDecrease}
                  disabled={localWeight <= 0}
                  className="w-[32px] h-[32px] bg-[#2c2c2c] hover:bg-[#3c3c3c] disabled:opacity-30 rounded-full flex items-center justify-center transition-colors active:scale-95"
                >
                  <Minus className="w-4 h-4 text-white" />
                </button>
                
                <div className="flex-1 bg-[#2c2c2c] rounded-[12px] h-[40px] flex items-center justify-center">
                  <p className="font-['Alexandria:Bold',_sans-serif] text-white text-[18px]">
                    {localWeight.toFixed(1)}
                  </p>
                </div>
                
                <button
                  onClick={handleWeightIncrease}
                  className="w-[32px] h-[32px] bg-[#2c2c2c] hover:bg-[#3c3c3c] rounded-full flex items-center justify-center transition-colors active:scale-95"
                >
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Repetições */}
              <div className="flex-1 flex items-center gap-2">
                <button
                  onClick={handleRepsDecrease}
                  disabled={localReps <= 0}
                  className="w-[32px] h-[32px] bg-[#2c2c2c] hover:bg-[#3c3c3c] disabled:opacity-30 rounded-full flex items-center justify-center transition-colors active:scale-95"
                >
                  <Minus className="w-4 h-4 text-white" />
                </button>
                
                <div className="flex-1 bg-[#2c2c2c] rounded-[12px] h-[40px] flex items-center justify-center">
                  <p className="font-['Alexandria:Bold',_sans-serif] text-white text-[18px]">
                    {localReps}
                  </p>
                </div>
                
                <button
                  onClick={handleRepsIncrease}
                  className="w-[32px] h-[32px] bg-[#2c2c2c] hover:bg-[#3c3c3c] rounded-full flex items-center justify-center transition-colors active:scale-95"
                >
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Botão Confirmar */}
            <button
              onClick={() => {
                handleConfirm();
                setShowInlineEditor(false);
              }}
              disabled={localWeight === 0 || localReps === 0}
              className="w-full bg-[#6d9f28] hover:bg-[#7db030] disabled:opacity-30 disabled:cursor-not-allowed rounded-full h-[44px] flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Check className="w-4 h-4 text-white" />
              <p className="font-['Alexandria:Medium',_sans-serif] text-white text-[15px]">
                Confirmar Série
              </p>
            </button>

            {/* Card da série 1 minimizado embaixo (mostra preview) */}
            <div className="mt-3 flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <p className="font-['Alexandria:Regular',_sans-serif] text-[rgba(255,255,255,0.5)] text-[11px]">
                  {seriesNumber}
                </p>
                <p className="font-['Alexandria:Regular',_sans-serif] text-[rgba(255,255,255,0.5)] text-[11px]">
                  {repetitions} repetições
                </p>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 19 12">
                  <path
                    d={svgPaths.p1aa92980}
                    stroke="#484848"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
                <p className="font-['Alexandria:Regular',_sans-serif] text-[rgba(255,255,255,0.5)] text-[11px]">
                  {weight}kg
                </p>
              </div>
            </div>

            {/* Botão Iniciar (se for a primeira série ativa) */}
            {onStart && (
              <button
                onClick={() => {
                  onStart();
                  setShowInlineEditor(false);
                }}
                className="w-full mt-2 bg-[#d9d9d9] hover:bg-[#e5e5e5] rounded-full h-[32px] flex items-center justify-center gap-2 transition-colors active:scale-95"
              >
                <div className="w-3 h-3">
                  <svg fill="none" viewBox="0 0 10 12">
                    <path d={svgPaths.p3b7e4cf0} fill="black" />
                  </svg>
                </div>
                <p className="font-['Alexandria:Medium',_sans-serif] text-black text-[13px]">
                  iniciar
                </p>
              </button>
            )}

            {/* Timer */}
            <div className="mt-2 flex items-center justify-center gap-2">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                <path
                  d={svgPaths.p2eb65600}
                  stroke="#484848"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
              <p className="font-['Alexandria:Regular',_sans-serif] text-[#484848] text-[10px]">
                {restTime} segundos
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Estado ativo (primeira série com botão "iniciar")
  return (
    <div className="bg-[#202020] h-[80px] relative rounded-[28px] shrink-0 w-full">
      <div className="flex flex-col items-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[13px] h-[80px] items-center p-[9px] relative w-full">
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-[296px]">
            <div className="content-stretch flex gap-[23px] items-center relative shrink-0">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-[17px]">
                <p className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-white w-[6px]">
                  {seriesNumber}
                </p>
                <div
                  className="flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]"
                  style={
                    {
                      "--transform-inner-width": "24",
                      "--transform-inner-height": "0",
                    } as React.CSSProperties
                  }
                >
                  <div className="flex-none rotate-[90deg]">
                    <div className="h-0 relative w-[24px]">
                      <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
                        <svg
                          className="block size-full"
                          fill="none"
                          preserveAspectRatio="none"
                          viewBox="0 0 24 1"
                        >
                          <line
                            id="Line 4"
                            stroke="#484848"
                            strokeLinecap="round"
                            x1="0.5"
                            x2="23.5"
                            y1="0.5"
                            y2="0.5"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <input 
                type="text" 
                value={`${repetitions} repetições`}
                onChange={(e) => {
                  const val = e.target.value.replace(' repetições', '');
                  onRepetitionsChange?.(val);
                }}
                className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-[rgba(187,187,187,0.73)] w-[101px] bg-transparent border-none outline-none p-0"
              />
            </div>
            <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
              <div className="h-[10px] relative shrink-0 w-[17px]" data-name="Vector">
                <div className="absolute inset-[-7.5%_-4.41%]">
                  <svg
                    className="block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 19 12"
                  >
                    <path
                      d={svgPaths.p1aa92980}
                      id="Vector"
                      stroke="#484848"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </div>
              <input 
                type="text" 
                value={`${weight}kg`}
                onChange={(e) => {
                  const val = e.target.value.replace('kg', '');
                  onWeightChange?.(val);
                }}
                className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-[rgba(187,187,187,0.73)] w-[29px] bg-transparent border-none outline-none p-0"
              />
            </div>
          </div>
          <div className="content-stretch flex gap-[20px] items-center relative shrink-0">
            <button
              onClick={onStart}
              className="bg-[#d9d9d9] box-border content-stretch flex flex-col gap-[10px] h-[24px] items-start px-[63px] py-[4px] relative rounded-[999px] shrink-0 w-[180px] cursor-pointer hover:bg-[#e5e5e5] transition-colors"
            >
              <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
                <p className="[grid-area:1_/_1] font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] ml-[15px] mt-0 relative text-[12px] text-black text-nowrap whitespace-pre">
                  iniciar
                </p>
                <div className="[grid-area:1_/_1] aspect-[15.0005/18.0006] ml-0 mt-[2px] relative w-[10px]" data-name="Vector">
                  <svg
                    className="block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 10 12"
                  >
                    <path d={svgPaths.p3b7e4cf0} fill="black" id="Vector" />
                  </svg>
                </div>
              </div>
            </button>
            <div className="bg-[#252525] box-border content-stretch flex flex-col gap-[10px] h-[24px] items-start px-[20px] py-[6px] relative rounded-[999px] shrink-0 w-[119px]">
              <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
                <input 
                  type="text" 
                  value={`${restTime} segundos`}
                  onChange={(e) => {
                    const val = e.target.value.replace(' segundos', '');
                    onRestTimeChange?.(val);
                  }}
                  className="[grid-area:1_/_1] font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] ml-[15px] mt-0 relative text-[#484848] text-[10px] text-nowrap whitespace-pre bg-transparent border-none outline-none p-0"
                />
                <div className="[grid-area:1_/_1] aspect-[18/18] ml-0 mt-px relative w-[10px]" data-name="Vector">
                  <div className="absolute inset-[-7.5%]">
                    <svg
                      className="block size-full"
                      fill="none"
                      preserveAspectRatio="none"
                      viewBox="0 0 12 12"
                    >
                      <path
                        d={svgPaths.p2eb65600}
                        id="Vector"
                        stroke="#484848"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
