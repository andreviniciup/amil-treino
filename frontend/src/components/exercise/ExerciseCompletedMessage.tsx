import React, { memo } from 'react';

interface ExerciseCompletedMessageProps {
  exerciseCompleted: boolean;
}

export const ExerciseCompletedMessage = memo(function ExerciseCompletedMessage({
  exerciseCompleted
}: ExerciseCompletedMessageProps) {
  if (!exerciseCompleted) {
    return null;
  }

  return (
    <div className="w-full mt-[15px] bg-[#6D9F28] rounded-full p-4 flex items-center justify-center">
      <p className="text-white font-['Alexandria:Medium',_sans-serif]">Exercício Concluído Hoje</p>
    </div>
  );
});

