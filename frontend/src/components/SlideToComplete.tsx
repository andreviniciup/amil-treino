import { useState, useRef, useEffect } from "react";
import svgPaths from "../imports/svg-9cga2voabl";

interface SlideToCompleteProps {
  onComplete: () => void;
}

export function SlideToComplete({ onComplete }: SlideToCompleteProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleStart = (clientX: number) => {
    if (isCompleted) return;
    setIsDragging(true);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || !containerRef.current || isCompleted) return;

    const rect = containerRef.current.getBoundingClientRect();
    const buttonWidth = 40; // largura da bola
    const maxPosition = rect.width - buttonWidth - 16; // 16 = padding total (8px cada lado)
    
    let newPosition = clientX - rect.left - buttonWidth / 2 - 8; // 8 = padding left
    newPosition = Math.max(0, Math.min(newPosition, maxPosition));
    
    setPosition(newPosition);
  };

  const handleEnd = () => {
    if (!isDragging || isCompleted) return;
    setIsDragging(false);

    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const buttonWidth = 40;
    const maxPosition = rect.width - buttonWidth - 16;
    const threshold = maxPosition * 0.85; // 85% do caminho

    if (position >= threshold) {
      // Completo!
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
  }, [isDragging, position]);

  // Calcular a porcentagem para o degradê
  const maxWidth = containerRef.current 
    ? containerRef.current.offsetWidth - 56 // 40 (bola) + 16 (padding)
    : 350;
  const progressPercentage = (position / maxWidth) * 100;

  return (
    <div 
      ref={containerRef}
      className="bg-[#2c2c2c] relative rounded-[999px] h-[50px] w-full overflow-hidden"
    >
      {/* Degradê verde que segue a bola */}
      <div 
        className="absolute inset-0 rounded-[999px] transition-all duration-100 ease-out"
        style={{
          background: `linear-gradient(to right, #4a6b1a ${progressPercentage}%, transparent ${progressPercentage}%)`,
        }}
      />
      
      <div className="size-full relative z-10">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-start px-[8px] py-[5px] relative size-full">
          <div className="content-stretch flex gap-[49px] items-center relative shrink-0 w-full">
            {/* Bola arrastável */}
            <div 
              className="absolute shrink-0 size-[40px] cursor-grab active:cursor-grabbing transition-transform duration-100 ease-out"
              style={{ 
                transform: `translateX(${position}px)`,
                left: 0,
              }}
              onMouseDown={(e) => handleStart(e.clientX)}
              onTouchStart={(e) => handleStart(e.touches[0].clientX)}
            >
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
                <g id="Frame 485">
                  <rect fill="#F0D471" height="40" rx="20" width="40" />
                  <path 
                    d={svgPaths.p37f10928} 
                    id="Vector" 
                    stroke="#775F09" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                  />
                </g>
              </svg>
            </div>
            
            {/* Texto */}
            <p 
              className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] text-[#484848] text-[14px] text-nowrap whitespace-pre ml-auto mr-4 select-none pointer-events-none"
              style={{
                color: progressPercentage > 50 ? '#a8c97f' : '#484848',
                transition: 'color 0.2s ease-out'
              }}
            >
              marcar como concluido
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

