import { memo } from 'react';

interface WorkoutHeaderProps {
  workoutName: string;
}

export const WorkoutHeader = memo(function WorkoutHeader({ workoutName }: WorkoutHeaderProps) {
  return (
    <div className="content-stretch flex font-['Alexandria:Regular',_sans-serif] font-normal items-center justify-between leading-[normal] relative shrink-0 text-[20px] text-nowrap w-full whitespace-pre">
      <p className="relative shrink-0 text-white">Hoje</p>
      <p className="relative shrink-0 text-[#2c2c2c]">{workoutName}</p>
    </div>
  );
});

