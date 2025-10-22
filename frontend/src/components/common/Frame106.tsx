import React from 'react';

interface Frame106Props {
  onClick: () => void;
  text?: string;
}

export function Frame106({ onClick, text = "Avançar" }: Frame106Props) {
  return (
    <button 
      onClick={onClick}
      className="absolute bg-[#1c1c1c] box-border content-stretch flex gap-[10px] h-[50px] items-center justify-center left-[20px] px-[129px] py-[13px] rounded-[999px] top-[765px] w-[353px] cursor-pointer hover:bg-[#2c2c2c] transition-colors"
    >
      <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[20px] text-nowrap text-white whitespace-pre">{text}</p>
    </button>
  );
}

