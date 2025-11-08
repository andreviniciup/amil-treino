import { memo, useCallback } from 'react';
import svgPaths from "../../imports/svg-c71qf4vhvy";

interface WorkoutActionButtonProps {
  workoutCompleted: boolean;
  onStartWorkout: () => void;
}

export const WorkoutActionButton = memo(function WorkoutActionButton({ 
  workoutCompleted, 
  onStartWorkout 
}: WorkoutActionButtonProps) {
  const handleClick = useCallback(() => {
    if (!workoutCompleted) {
      onStartWorkout();
    }
  }, [workoutCompleted, onStartWorkout]);

  if (workoutCompleted) {
    return (
      <div className="flex-shrink-0 px-5 py-4 bg-[#181818]">
        <div className="bg-[#6D9F28] box-border content-stretch flex flex-col gap-[10px] h-[50px] items-center justify-center px-[106px] py-[14px] relative rounded-[999px] shrink-0 w-full max-w-[393px] mx-auto">
          <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-white text-[16px] text-nowrap whitespace-pre">
            Treino Concluído Hoje
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 px-5 py-4 bg-[#181818]">
      <button
        onClick={handleClick}
        className="bg-white hover:bg-gray-100 transition-colors box-border content-stretch flex flex-col gap-[10px] h-[50px] items-center justify-center px-[106px] py-[14px] relative rounded-[999px] shrink-0 w-full max-w-[393px] mx-auto"
      >
        <div className="content-stretch flex gap-[20px] items-center relative shrink-0">
          <div className="h-[18px] relative shrink-0 w-[15px]" data-name="Vector">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 18">
              <path d={svgPaths.p26ee6680} fill="var(--fill-0, #202020)" id="Vector" />
            </svg>
          </div>
          <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#202020] text-[16px] text-nowrap whitespace-pre">
            iniciar treino
          </p>
        </div>
      </button>
    </div>
  );
});

