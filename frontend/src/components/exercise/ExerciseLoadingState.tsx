import React, { memo } from 'react';

export const ExerciseLoadingState = memo(function ExerciseLoadingState() {
  return (
    <div className="bg-[#181818] relative size-full flex items-center justify-center">
      <div className="text-white text-[18px] font-['Alexandria:Regular',_sans-serif]">
        Carregando exercício...
      </div>
    </div>
  );
});

