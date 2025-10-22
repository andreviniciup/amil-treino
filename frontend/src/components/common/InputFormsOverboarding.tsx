import React from 'react';

interface InputFormsOverboardingProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  top: string;
  left?: string;
  width?: string;
}

export function InputFormsOverboarding({ 
  label, 
  value, 
  onChange, 
  type = "text", 
  top, 
  left = "20px",
  width = "354px"
}: InputFormsOverboardingProps) {
  return (
    <div 
      className="absolute content-stretch flex flex-col gap-[5px] items-start" 
      style={{ top, left, width }} 
      data-name="input-forms-overboarding"
    >
      <p className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[16px] text-white w-full">{label}</p>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[rgba(61,61,61,0.5)] h-[40px] rounded-[999px] shrink-0 w-full px-[20px] text-white outline-none focus:bg-[rgba(61,61,61,0.7)] transition-colors"
      />
    </div>
  );
}

