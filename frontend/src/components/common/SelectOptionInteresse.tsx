import React from 'react';

interface SelectOptionInteresseProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export function SelectOptionInteresse({ label, isSelected, onClick }: SelectOptionInteresseProps) {
  return (
    <button
      onClick={onClick}
      className={`${
        isSelected 
          ? 'bg-[#f0d471] text-[#1c1c1c]' 
          : 'bg-[rgba(61,61,61,0.5)] text-white'
      } box-border content-stretch flex gap-[5px] items-center justify-center px-[18px] py-[5px] rounded-[20px] shrink-0 cursor-pointer hover:opacity-80 transition-all`}
      data-name="select-option-interesse"
    >
      <p className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-nowrap whitespace-pre">{label}</p>
    </button>
  );
}

