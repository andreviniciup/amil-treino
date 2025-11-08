import { Play } from 'lucide-react';

interface WorkoutActionBarProps {
  workoutName?: string;
  workoutTime?: string;
  isWorkoutActive: boolean;
  onStartWorkout?: () => void;
}

export function WorkoutActionBar({ 
  workoutName = 'Treino',
  workoutTime = '00:00',
  isWorkoutActive,
  onStartWorkout
}: WorkoutActionBarProps) {
  // Se o treino não foi iniciado, mostrar botão "iniciar treino"
  if (!isWorkoutActive) {
    return (
      <div 
        className="w-[320px] h-[40px] px-[88px] py-[10px] bg-[#222222] rounded-[99px] flex flex-col items-center justify-center gap-[10px] cursor-pointer hover:bg-[#2a2a2a] transition-colors"
        onClick={onStartWorkout}
      >
        <div className="flex items-center gap-[20px]">
          <div className="w-[15px] h-[18px] bg-white" />
          <div className="text-white text-[14px] font-['Alexandria:Medium',_sans-serif] font-medium">
            iniciar treino
          </div>
        </div>
      </div>
    );
  }

  // Se o treino está ativo, mostrar nome do treino + timer
  return (
    <div className="w-[320px] h-[40px] px-[32px] py-[11px] bg-[#222222] rounded-[99px] flex flex-col items-start justify-start gap-[10px]">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-end gap-[10px]">
          <div className="text-center text-white text-[14px] font-['Alexandria:Regular',_sans-serif] font-normal">
            {workoutName}
          </div>
        </div>
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
  );
}

