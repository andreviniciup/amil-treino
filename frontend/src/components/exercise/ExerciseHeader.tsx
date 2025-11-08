import React, { memo } from 'react';
import { AnimatedExerciseImage } from '../AnimatedExerciseImage';

interface ExerciseHeaderProps {
  exerciseName: string;
  gifUrl: string;
}

export const ExerciseHeader = memo(function ExerciseHeader({
  exerciseName,
  gifUrl
}: ExerciseHeaderProps) {
  return (
    <>
      {/* Imagem do Exercício */}
      <div className="bg-[#202020] h-[350px] relative rounded-[30px] shrink-0 w-full overflow-hidden">
        <AnimatedExerciseImage
          gifUrl={gifUrl || ""}
          alt={exerciseName}
          className="size-full"
          transitionSpeed={800}
        />
      </div>

      {/* Nome do Exercício */}
      <div className="content-stretch flex flex-col gap-[15px] items-start relative shrink-0 w-full">
        <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[16px] text-white w-full">
          {exerciseName}
        </p>
      </div>
    </>
  );
});

