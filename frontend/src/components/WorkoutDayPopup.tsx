import { X, Clock, Dumbbell } from 'lucide-react';

interface WorkoutInfo {
  workoutName: string;
  duration: string; // Formato MM:SS
  completedAt: string; // Hora de conclusão
}

interface WorkoutDayPopupProps {
  day: number;
  date: string;
  workouts: WorkoutInfo[]; // Array de treinos
  onClose: () => void;
}

export function WorkoutDayPopup({ 
  day, 
  date, 
  workouts,
  onClose 
}: WorkoutDayPopupProps) {
  // Calcular tempo total
  const totalSeconds = workouts.reduce((sum, workout) => {
    const [min, sec] = workout.duration.split(':').map(Number);
    return sum + (min * 60) + sec;
  }, 0);
  
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalSecs = totalSeconds % 60;
  const totalDuration = `${totalMinutes}:${totalSecs.toString().padStart(2, '0')}`;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] px-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#202020] border border-[#2c2c2c] rounded-[30px] w-full max-w-[350px] p-6 relative shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-[30px] h-[30px] rounded-full bg-[#2c2c2c] hover:bg-[#3c3c3c] flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        <div className="flex flex-col gap-4">
          {/* Header com data e tempo total */}
          <div className="flex items-center gap-3">
            <div className="bg-[#288b9f] rounded-[15px] w-[50px] h-[50px] flex items-center justify-center shrink-0">
              <p className="font-['Alexandria:Medium',_sans-serif] text-white text-[18px]">{day}</p>
            </div>
            <div className="flex-1">
              <p className="font-['Alexandria:Medium',_sans-serif] text-white text-[16px]">{date}</p>
              <div className="flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3 text-[#6d9f28]" />
                <p className="font-['Alexandria:Regular',_sans-serif] text-[#6d9f28] text-[12px]">
                  {totalDuration} min total
                </p>
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-[#2c2c2c]" />

          {/* Lista de treinos */}
          <div>
            <p className="font-['Alexandria:Regular',_sans-serif] text-[#888] text-[12px] mb-3">
              {workouts.length === 1 ? 'Treino realizado' : `${workouts.length} treinos realizados`}
            </p>
            <div className="flex flex-col gap-3">
              {workouts.map((workout, index) => (
                <div 
                  key={index}
                  className="bg-[#252525] rounded-[15px] p-3 flex items-center gap-3"
                >
                  <div className="w-[36px] h-[36px] rounded-full bg-[#2c2c2c] flex items-center justify-center shrink-0">
                    <Dumbbell className="w-4 h-4 text-[#288b9f]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-['Alexandria:Medium',_sans-serif] text-white text-[14px] truncate">
                      {workout.workoutName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="font-['Alexandria:Regular',_sans-serif] text-[#888] text-[11px]">
                        {workout.completedAt}
                      </p>
                      <span className="text-[#444]">•</span>
                      <p className="font-['Alexandria:Regular',_sans-serif] text-[#6d9f28] text-[11px]">
                        {workout.duration} min
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
