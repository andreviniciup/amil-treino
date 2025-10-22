import React from 'react';

interface SelectFormsOverboardingProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  top: string;
  left?: string;
  width?: string;
}

export function SelectFormsOverboarding({ 
  label, 
  value, 
  onChange, 
  options, 
  top, 
  left = "20px",
  width = "354px"
}: SelectFormsOverboardingProps) {
  return (
    <div 
      className="absolute content-stretch flex flex-col gap-[5px] items-start" 
      style={{ top, left, width }} 
      data-name="select-forms-overboarding"
    >
      <p className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[16px] text-white w-full">{label}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[rgba(61,61,61,0.5)] h-[40px] rounded-[999px] shrink-0 w-full px-[20px] text-white outline-none focus:bg-[rgba(61,61,61,0.7)] transition-colors appearance-none cursor-pointer"
      >
        <option value="" disabled className="bg-[#1c1c1c]">Selecione</option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#1c1c1c]">{option}</option>
        ))}
      </select>
    </div>
  );
}

