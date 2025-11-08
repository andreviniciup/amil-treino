import { memo } from 'react';

interface RestTimerBarProps {
  workoutTime: string;
}

export const RestTimerBar = memo(function RestTimerBar({ workoutTime }: RestTimerBarProps) {
  return (
    <div className="fixed bottom-[20px] left-1/2 -translate-x-1/2 z-50">
      <div className="w-[320px] h-[40px] px-[32px] py-[11px] bg-[#222222] rounded-[99px] flex flex-col items-start justify-start gap-[10px]">
        <div className="w-full flex items-center justify-end">
          <div className="flex items-center justify-center gap-[10px]">
            <div className="flex items-end justify-center">
              <div className="text-[#FDCB1A] text-[14px] font-['Alexandria:Medium',_sans-serif] font-medium">
                {workoutTime}
              </div>
              <div className="text-center text-[#484848] text-[12px] font-['Alexandria:Regular',_sans-serif] font-normal">
                min
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

