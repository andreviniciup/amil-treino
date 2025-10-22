import React from 'react';

interface DayButtonProps {
  day: string;
  isSelected: boolean;
  onClick: () => void;
}

export function DayButton({ day, isSelected, onClick }: DayButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${
        isSelected 
          ? 'bg-[#f0d471]' 
          : 'bg-white'
      } box-border content-stretch flex flex-col gap-[10px] items-center justify-center px-[12px] py-[6px] rounded-[999px] shrink-0 size-[40px] cursor-pointer hover:opacity-80 transition-all`}
    >
      <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#202020] text-[16px] text-nowrap whitespace-pre">{day}</p>
    </button>
  );
}

