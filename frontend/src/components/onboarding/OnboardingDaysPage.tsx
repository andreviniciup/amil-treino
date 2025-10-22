import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Frame106 } from '../common/Frame106';
import { DayButton } from '../common/DayButton';

interface Frame469Props {
  selectedDays: string[];
  onToggle: (day: string) => void;
}

function Frame469({ selectedDays, onToggle }: Frame469Props) {
  const days = [
    { label: 'S', value: 'Segunda' },
    { label: 'T', value: 'Terça' },
    { label: 'Q', value: 'Quarta' },
    { label: 'Q', value: 'Quinta' },
    { label: 'S', value: 'Sexta' },
    { label: 'S', value: 'Sábado' },
    { label: 'D', value: 'Domingo' },
  ];

  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      {days.map((day, index) => (
        <DayButton
          key={`${day.value}-${index}`}
          day={day.label}
          isSelected={selectedDays.includes(day.value)}
          onClick={() => onToggle(day.value)}
        />
      ))}
    </div>
  );
}

function Frame470({ selectedDays, onToggle }: Frame469Props) {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] items-start left-[25px] top-[395px]">
      <Frame469 selectedDays={selectedDays} onToggle={onToggle} />
    </div>
  );
}

export function OnboardingDaysPage() {
  const navigate = useNavigate();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  const handleNext = () => {
    if (selectedDays.length > 0) {
      localStorage.setItem('onboarding-days', JSON.stringify(selectedDays));
      navigate('/onboarding/final');
    }
  };

  return (
    <div className="bg-[#4f6c25] relative size-full" data-name="onboarding - 4">
      <Frame106 onClick={handleNext} text="Avançar" />
      <Frame470 selectedDays={selectedDays} onToggle={toggleDay} />
      <div className="absolute font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] left-[calc(20%+110px)] text-[24px] text-center text-nowrap text-white top-[313px] translate-x-[-50%] whitespace-pre">
        <p className="mb-0">Quais dias você</p>
        <p>{`pretente treinar? `}</p>
      </div>
    </div>
  );
}
