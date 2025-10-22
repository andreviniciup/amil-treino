import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Frame106 } from '../common/Frame106';
import { SelectOptionInteresse } from '../common/SelectOptionInteresse';

interface Frame52Props {
  interests: string[];
  selectedInterests: string[];
  onToggle: (interest: string) => void;
}

function Frame52({ interests, selectedInterests, onToggle }: Frame52Props) {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      {interests.map((interest) => (
        <SelectOptionInteresse
          key={interest}
          label={interest}
          isSelected={selectedInterests.includes(interest)}
          onClick={() => onToggle(interest)}
        />
      ))}
    </div>
  );
}

interface Frame55Props {
  selectedInterests: string[];
  onToggle: (interest: string) => void;
}

function Frame55({ selectedInterests, onToggle }: Frame55Props) {
  const row1 = ['Musica', 'Festas', 'Drinks', 'Dj'];
  const row2 = ['Relax', 'Comida', 'Ao vivo', 'Social'];

  return (
    <div className="absolute content-stretch flex flex-col gap-[10px] items-start left-[18px] top-[358px] w-[354px]">
      <Frame52 interests={row1} selectedInterests={selectedInterests} onToggle={onToggle} />
      <Frame52 interests={row2} selectedInterests={selectedInterests} onToggle={onToggle} />
    </div>
  );
}

export function OnboardingGoalPage() {
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleNext = () => {
    if (selectedInterests.length > 0) {
      localStorage.setItem('onboarding-interests', JSON.stringify(selectedInterests));
      navigate('/onboarding/training-types');
    }
  };

  return (
    <div className="bg-[#4f6c25] relative size-full" data-name="onboarding - 2">
      <Frame106 onClick={handleNext} text="Avançar" />
      <Frame55 selectedInterests={selectedInterests} onToggle={toggleInterest} />
      <p className="absolute font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] left-[calc(20%+20px)] text-[24px] text-nowrap text-white top-[292px] whitespace-pre">Qual o seu foco?</p>
    </div>
  );
}
