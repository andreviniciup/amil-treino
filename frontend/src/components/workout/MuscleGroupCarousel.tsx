import { memo, useMemo } from 'react';

interface Muscle {
  name: string;
  imageUrl: string;
}

interface MuscleGroupCarouselProps {
  muscles: Muscle[];
}

const MuscleGroup = memo(function MuscleGroup({ label, imageUrl }: { label: string; imageUrl: string }) {
  return (
    <div className="bg-[#202020] border border-[#252525] box-border content-stretch flex flex-col gap-[10px] items-center justify-center px-[20px] py-[20px] relative rounded-[20px] shrink-0 w-[120px] h-[120px] min-w-[120px]">
      <img 
        src={imageUrl} 
        alt={label}
        className="w-[60px] h-[60px] object-contain"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
      <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[10px] text-white w-[80px] text-center">{label}</p>
    </div>
  );
});

export const MuscleGroupCarousel = memo(function MuscleGroupCarousel({ muscles }: MuscleGroupCarouselProps) {
  const muscleElements = useMemo(() => {
    if (muscles.length === 0) {
      return (
        <p className="text-[#2c2c2c] text-[14px] font-['Alexandria:Regular',_sans-serif]">
          Nenhum músculo identificado
        </p>
      );
    }

    return muscles.map((muscle, index) => (
      <MuscleGroup 
        key={`${muscle.name}-${index}`}
        label={muscle.name} 
        imageUrl={muscle.imageUrl}
      />
    ));
  }, [muscles]);

  return (
    <div className="relative w-full">
      <div 
        className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full overflow-x-auto scrollbar-hide touch-pan-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {muscleElements}
      </div>
      
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
});

