import { useState, useRef, useEffect, memo, useCallback } from 'react';
import svgPaths from '../../imports/svg-9cga2voabl';

interface ExerciseCompleteBarProps {
  workoutTime?: string;
  allSeriesCompleted: boolean;
  exerciseCompleted: boolean;
  onComplete: () => void;
}

export const ExerciseCompleteBar = memo(function ExerciseCompleteBar({ 
  workoutTime = '00:00',
  allSeriesCompleted,
  exerciseCompleted,
  onComplete
}: ExerciseCompleteBarProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const completedRef = useRef(false); // Flag para evitar múltiplas chamadas de onComplete

  const handleStart = (clientX: number) => {
    if (isCompleted || exerciseCompleted || !allSeriesCompleted) return;
    setIsDragging(true);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || !containerRef.current || isCompleted || exerciseCompleted || !allSeriesCompleted) return;

    const rect = containerRef.current.getBoundingClientRect();
    const buttonWidth = 30; // largura da bola
    const maxPosition = rect.width - buttonWidth - 12; // 12 = padding total (6px cada lado)
    
    let newPosition = clientX - rect.left - buttonWidth / 2 - 6; // 6 = padding left
    newPosition = Math.max(0, Math.min(newPosition, maxPosition));
    
    setPosition(newPosition);
  };

  const handleEnd = () => {
    if (!isDragging || isCompleted || exerciseCompleted || !allSeriesCompleted) return;
    
    // Verificar se já foi completado antes (proteção adicional)
    if (completedRef.current) {
      console.log('⚠️ ExerciseCompleteBar: já foi completado, ignorando');
      return;
    }
    
    setIsDragging(false);

    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const buttonWidth = 30;
    const maxPosition = rect.width - buttonWidth - 12;
    const threshold = maxPosition * 0.85; // 85% do caminho

    if (position >= threshold) {
      // Completo!
      console.log('✅ ExerciseCompleteBar: completando exercício');
      completedRef.current = true; // Marcar como completado
      setPosition(maxPosition);
      setIsCompleted(true);
      setTimeout(() => {
        onComplete();
      }, 300);
    } else {
      // Volta para o início
      setPosition(0);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
    const handleMouseUp = () => handleEnd();
    const handleTouchEnd = () => handleEnd();

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging]); // Removido 'position' das dependências

  // Calcular a porcentagem para o degradê
  const maxWidth = containerRef.current 
    ? containerRef.current.offsetWidth - 42 // 30 (bola) + 12 (padding)
    : 320;
  const progressPercentage = (position / maxWidth) * 100;

  // Se o exercício já foi concluído, mostrar estado final
  if (exerciseCompleted || isCompleted) {
    return (
      <div className="w-[320px] h-[40px] bg-[#222222] rounded-[99px] flex flex-col items-start justify-start gap-[10px]">
        <div className="flex items-center justify-start">
          <div 
            className="h-[40px] px-[67px] py-[11px] rounded-tl-[99px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[99px] flex items-center justify-end gap-[10px]"
            style={{
              width: '262px',
              background: 'linear-gradient(90deg, #25C7D9 0%, #9725D9 25%, #D92588 50%, #D9B225 75%, #F0D471 100%)'
            }}
          >
            <div className="text-white text-[14px] font-['Alexandria:Medium',_sans-serif] font-medium" style={{ textShadow: '0px 0px 6px rgba(255, 255, 255, 0.34)' }}>
              concluido
            </div>
          </div>
          <div className="w-[30px] h-[30px] px-[13px] py-[16px] bg-[#F0D471] rounded-[999px] flex flex-col items-center justify-center gap-[10px]">
            <div className="w-[14px] h-[8px] outline-2 outline-[#775F09] outline-offset-[-1px]" />
          </div>
        </div>
      </div>
    );
  }

  // Se todas as séries estão completas, mostrar slide-to-complete
  if (allSeriesCompleted) {
    return (
      <div className="w-[320px] px-[6px] py-[5px] bg-[#222222] rounded-[99px] flex flex-col items-start justify-start gap-[10px]">
        <div className="flex items-center justify-start gap-[42px] relative w-full">
          {/* Bola arrastável */}
          <div 
            className="absolute shrink-0 w-[30px] h-[30px] px-[13px] py-[16px] bg-[#F0D471] rounded-[999px] flex flex-col items-center justify-center gap-[10px] cursor-grab active:cursor-grabbing transition-transform duration-100 ease-out z-10"
            style={{ 
              transform: `translateX(${position}px)`,
              left: 0,
            }}
            onMouseDown={(e) => handleStart(e.clientX)}
            onTouchStart={(e) => handleStart(e.touches[0].clientX)}
          >
            <div className="w-[14px] h-[8px] outline-2 outline-[#775F09] outline-offset-[-1px]" />
          </div>
          
          {/* Barra de progresso */}
          {position > 0 && (
            <div 
              className="absolute left-0 top-0 h-[40px] rounded-tl-[99px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[99px] transition-all duration-100 ease-out"
              style={{
                width: `${position + 30}px`,
                background: position >= maxWidth * 0.85 
                  ? 'linear-gradient(90deg, #D9B225 0%, #F0D471 100%)'
                  : 'linear-gradient(90deg, #D9B225 0%, #F0D471 100%)',
              }}
            />
          )}
          
          {/* Texto */}
          <p 
            className="text-[#484848] text-[14px] font-['Alexandria:Regular',_sans-serif] font-normal ml-auto select-none pointer-events-none"
            style={{
              color: progressPercentage > 50 ? '#484848' : '#484848',
              transition: 'color 0.2s ease-out'
            }}
          >
            {position > maxWidth * 0.5 ? 'omo concluido' : 'marcar como concluido'}
          </p>
        </div>
      </div>
    );
  }

  // Se não todas as séries estão completas, mostrar apenas timer
  return (
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
  );
});

