import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Frame106 } from '../common/Frame106';
import { SelectOptionInteresse } from '../common/SelectOptionInteresse';
import { useWorkoutCreator } from '../../contexts/WorkoutCreatorContext';

// Mapeamento de grupos musculares para bodyParts do banco de dados
// Cada grupo pode mapear para múltiplos bodyParts
const MUSCLE_GROUP_MAPPING: Record<string, string[]> = {
  'Peito': ['Peito'],
  'Costas': ['Costas'],
  'Ombros': ['Ombros'],
  'Braços': ['Bíceps/Tríceps', 'Antebraços'],
  'Pernas': ['Coxas', 'Panturrilhas'],
  'Glúteos': ['Coxas'], // Glúteos são trabalhados em exercícios de coxas
  'Core': ['Abdômen'],
  'Cardio': ['Cardio']
};

interface Frame52Props {
  muscles: string[];
  selectedMuscles: string[];
  onToggle: (muscle: string) => void;
}

function Frame52({ muscles, selectedMuscles, onToggle }: Frame52Props) {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      {muscles.map((muscle) => (
        <SelectOptionInteresse
          key={muscle}
          label={muscle}
          isSelected={selectedMuscles.includes(muscle)}
          onClick={() => onToggle(muscle)}
        />
      ))}
    </div>
  );
}

interface Frame55Props {
  selectedMuscles: string[];
  onToggle: (muscle: string) => void;
}

function Frame55({ selectedMuscles, onToggle }: Frame55Props) {
  // Usar grupos amigáveis ao usuário
  const row1 = ['Peito', 'Costas', 'Ombros', 'Braços'];
  const row2 = ['Pernas', 'Glúteos', 'Core', 'Cardio'];

  return (
    <div className="absolute content-stretch flex flex-col gap-[10px] items-start left-[18px] top-[373px] w-[354px]">
      <Frame52 muscles={row1} selectedMuscles={selectedMuscles} onToggle={onToggle} />
      <Frame52 muscles={row2} selectedMuscles={selectedMuscles} onToggle={onToggle} />
    </div>
  );
}

export function CreateWorkoutMuscles() {
  const navigate = useNavigate();
  const { workoutData, updateWorkoutData } = useWorkoutCreator();
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>(workoutData.musculos || []);

  const toggleMuscle = (muscle: string) => {
    setSelectedMuscles((prev) =>
      prev.includes(muscle)
        ? prev.filter((m) => m !== muscle)
        : [...prev, muscle]
    );
  };

  const handleNext = () => {
    if (selectedMuscles.length > 0) {
      // Converter grupos musculares selecionados para bodyParts do banco
      const bodyParts = selectedMuscles.flatMap(muscle => MUSCLE_GROUP_MAPPING[muscle] || [muscle]);
      // Remover duplicatas
      const uniqueBodyParts = Array.from(new Set(bodyParts));
      
      console.log('🎯 Grupos selecionados:', selectedMuscles);
      console.log('🗂️ BodyParts mapeados:', uniqueBodyParts);
      
      updateWorkoutData({ musculos: uniqueBodyParts });
      navigate('/workout/create/exercises');
    }
  };

  return (
    <div className="bg-[#202020] relative size-full" data-name="criar-treino-03">
      <Frame106 onClick={handleNext} text="Avançar" />
      <Frame55 selectedMuscles={selectedMuscles} onToggle={toggleMuscle} />
      <div className="absolute font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] left-[191.5px] text-[24px] text-center text-white top-[291px] translate-x-[-50%]">
        <p className="mb-0">{`qual músculos serão `}</p>
        <p>{`trabalhados? `}</p>
      </div>
    </div>
  );
}

