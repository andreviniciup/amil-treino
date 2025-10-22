import React from 'react';

interface WorkoutOptionProps {
  label: string;
  svgPath: string;
  isSelected: boolean;
  onClick: () => void;
  top: string;
}

export function WorkoutOption({ label, svgPath, isSelected, onClick, top }: WorkoutOptionProps) {
  const iconColor = isSelected ? '#1C1C1C' : 'white';
  
  return (
    <button
      onClick={onClick}
      className={`absolute ${
        isSelected 
          ? 'bg-[#f0d471]' 
          : 'bg-[rgba(61,61,61,0.5)]'
      } box-border content-stretch flex gap-[10px] h-[58px] items-center justify-center left-[37px] px-[82px] py-[18px] rounded-[15px] w-[317px] cursor-pointer hover:opacity-80 transition-all`}
      style={{ top }}
    >
      <div className="content-stretch flex gap-[15px] items-center relative shrink-0">
        <div className="relative shrink-0">
          <svg className="block" fill="none" viewBox="0 0 22 20" width="22" height="20">
            <path d={svgPath} stroke={iconColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
        <p className={`font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[16px] text-nowrap whitespace-pre ${
          isSelected ? 'text-[#1c1c1c]' : 'text-white'
        }`}>{label}</p>
      </div>
    </button>
  );
}

