import { useState, useEffect } from 'react';

interface TreinoTempoDescansoPageProps {
  onFinish: () => void;
}

function Frame498({ seconds }: { seconds: number }) {
  return (
    <div className="content-stretch flex items-center justify-between leading-[normal] relative shrink-0 text-[#f4f4f4] text-nowrap w-full whitespace-pre">
      <p className="font-['Alexandria:Medium',_sans-serif] font-medium relative shrink-0 text-[31px]">{seconds}</p>
      <p className="font-['Alexandria:Regular',_sans-serif] font-normal relative shrink-0 text-[14px]">segundos</p>
    </div>
  );
}

function Frame488() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="bg-[#fdcb1a] rounded-[8px] shrink-0 size-[30px]" />
      ))}
    </div>
  );
}

function PartialRow({ filled }: { filled: number }) {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      {[...Array(10)].map((_, i) => (
        <div 
          key={i} 
          className={`rounded-[8px] shrink-0 size-[30px] ${
            i < filled ? 'bg-[#fdcb1a]' : 'bg-[#484848]'
          }`} 
        />
      ))}
    </div>
  );
}

function Frame490() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="bg-[#484848] rounded-[8px] shrink-0 size-[30px]" />
      ))}
    </div>
  );
}

function Frame497({ elapsedSeconds }: { elapsedSeconds: number }) {
  const totalSquares = 90; // 9 rows of 10
  const filledSquares = Math.min(elapsedSeconds, totalSquares);
  
  const fullRows = Math.floor(filledSquares / 10);
  const partialRow = filledSquares % 10;
  const emptyRows = 9 - fullRows - (partialRow > 0 ? 1 : 0);

  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      {[...Array(fullRows)].map((_, i) => (
        <Frame488 key={`full-${i}`} />
      ))}
      {partialRow > 0 && <PartialRow filled={partialRow} />}
      {[...Array(emptyRows)].map((_, i) => (
        <Frame490 key={`empty-${i}`} />
      ))}
    </div>
  );
}

function Frame354({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-[#a91717] hover:bg-[#c91919] transition-colors box-border content-stretch flex gap-[10px] items-center justify-center px-[35px] py-[5px] relative rounded-[10px] shrink-0"
    >
      <p className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[#f4f4f4] text-[18px] text-nowrap whitespace-pre">Parar</p>
    </button>
  );
}

function Frame499({ seconds, elapsedSeconds, onStop }: { seconds: number; elapsedSeconds: number; onStop: () => void }) {
  return (
    <div className="absolute content-stretch flex flex-col gap-[19px] items-center left-[45px] top-[242px] w-[300px]">
      <Frame498 seconds={seconds} />
      <Frame497 elapsedSeconds={elapsedSeconds} />
      <Frame354 onClick={onStop} />
    </div>
  );
}

export function TreinoTempoDescansoPage({ onFinish }: TreinoTempoDescansoPageProps) {
  const TOTAL_TIME = 90; // 90 segundos
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      if (timeLeft <= 0) {
        onFinish();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, onFinish]);

  const handleStop = () => {
    setIsRunning(false);
    onFinish();
  };

  const elapsedSeconds = TOTAL_TIME - timeLeft;

  return (
    <div className="bg-[#181818] relative size-full" data-name="treino-tempo-descanso">
      <Frame499 seconds={timeLeft} elapsedSeconds={elapsedSeconds} onStop={handleStop} />
      <p className="absolute font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] left-[calc(60%+36px)] text-[10px] text-nowrap text-white top-[44px] whitespace-pre">tempo de descanso</p>
    </div>
  );
}
