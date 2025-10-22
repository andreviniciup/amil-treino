import React, { useState } from 'react';
import { Check } from 'lucide-react';
import svgPaths from "../imports/svg-c71qf4vhvy";

interface ExerciseCardProps {
  name: string;
  sets: number;
  completed?: boolean;
  improvement?: {
    type: 'weight' | 'reps';
    value: string;
  };
  series?: Array<{
    reps: string;
    weight: string;
  }>;
  onExerciseClick?: () => void;
  defaultExpanded?: boolean;
}

export function ExerciseCard({ 
  name, 
  sets, 
  completed = false,
  improvement,
  series = [
    { reps: '6 a 8 repetições', weight: '12kg' },
    { reps: '6 a 8 repetições', weight: '12kg' },
    { reps: '6 a 8 repetições', weight: '12kg' }
  ],
  onExerciseClick,
  defaultExpanded = false
}: ExerciseCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-[#202020] border border-[#252525] relative rounded-[35px] w-full overflow-hidden">
      {/* Header clickable */}
      <button
        onClick={handleToggle}
        className="h-[50px] relative rounded-[35px] w-full hover:bg-[#252525] transition-colors"
      >
        <div className="flex flex-row items-center size-full px-[13px]">
          <div className="flex items-center justify-between w-full">
            <div className="content-stretch flex gap-[20px] items-center relative shrink-0">
              <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">{name}</p>
              {completed && improvement && (
                <div className="content-stretch flex gap-[5px] items-center relative shrink-0">
                  <div className="relative shrink-0 size-[20px]" data-name="Subtract">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                      <path d={svgPaths.p13286100} fill="var(--fill-0, #6D9F28)" id="Subtract" />
                    </svg>
                  </div>
                  <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#6d9f28] text-[14px] text-nowrap whitespace-pre">{improvement.value}</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-[10px]">
              <p className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[#484848] text-[14px] text-nowrap whitespace-pre">{sets} series</p>
              {completed && <Check className="w-3 h-3 text-[#6D9F28]" />}
            </div>
          </div>
        </div>
      </button>

      {/* Body (collapsible) */}
      {isExpanded && (
        <div className="px-[13px] pb-[13px] pt-[10px]">
          <div className="content-stretch flex flex-col gap-[10px] items-start w-full">
            {series.map((serie, index) => (
              <div key={index} className="bg-[#252525] h-[35px] relative rounded-[28px] shrink-0 w-full">
                <div className="flex flex-row items-center size-full px-[24px]">
                  <div className="flex items-center justify-between w-full">
                    <div className="content-stretch flex gap-[21px] items-center relative shrink-0">
                      <div className="content-stretch flex items-center justify-between relative shrink-0 w-[16px]">
                        <p className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">{index + 1}</p>
                        <div className="flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ ["--transform-inner-width" as any]: "24", ["--transform-inner-height" as any]: "0" }}>
                          <div className="flex-none rotate-[90deg]">
                            <div className="h-0 relative w-[24px]">
                              <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
                                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 1">
                                  <line id="Line 1" stroke="var(--stroke-0, #484848)" strokeLinecap="round" x1="0.5" x2="23.5" y1="0.5" y2="0.5" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-[rgba(187,187,187,0.73)] text-nowrap whitespace-pre">{serie.reps}</p>
                    </div>
                    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
                      <div className="h-[10px] relative shrink-0 w-[17px]" data-name="Vector">
                        <div className="absolute inset-[-7.5%_-4.41%]">
                          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 12">
                            <path d={svgPaths.p1aa92980} id="Vector" stroke="var(--stroke-0, #484848)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                          </svg>
                        </div>
                      </div>
                      <p className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-[rgba(187,187,187,0.73)] text-nowrap whitespace-pre">{serie.weight}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onExerciseClick?.();
              }}
              className="bg-[rgba(109,159,40,0.6)] hover:bg-[rgba(109,159,40,0.8)] transition-colors box-border content-stretch flex gap-[10px] h-[40px] items-center justify-center px-[111px] py-[11px] relative rounded-[28px] shrink-0 w-full mt-[11px]"
            >
              <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">fazer exercicio</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
