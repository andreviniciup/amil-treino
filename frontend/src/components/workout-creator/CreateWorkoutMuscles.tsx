import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkoutCreator } from '../../contexts/WorkoutCreatorContext';

// Mapeamento de grupos musculares para bodyParts do banco de dados
// Deve corresponder exatamente aos nomes em português do banco
const MUSCLE_GROUP_MAPPING: Record<string, string[]> = {
  'Peito': ['Peito'],
  'Costas': ['Costas', 'Lombar'], // Inclui lombar (parte inferior das costas)
  'Ombros': ['Ombros', 'Trapézio'], // Trapézio trabalha junto com ombros
  'Braços': ['Bíceps', 'Tríceps', 'Antebraços'],
  'Pernas': ['Quadríceps', 'Posteriores de Coxa', 'Panturrilhas', 'Adutores', 'Abdutores'],
  'Glúteos': ['Glúteos', 'Posteriores de Coxa'], // Glúteos são trabalhados com posteriores
  'Core': ['Abdômen'],
  'Cardio': ['Cardio'] // Manter para compatibilidade futura
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
    <div className="bg-[#202020] relative w-full h-screen overflow-hidden flex items-center justify-center" data-name="criar-treino-03">
      <div className="relative w-full max-w-[393px] h-full flex flex-col px-5 py-8">
        
        {/* Área que centraliza o conteúdo verticalmente */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full space-y-8">
            {/* Título */}
            <div className="text-center">
              <p className="font-alexandria font-normal text-[24px] text-white">
                qual músculos serão trabalhados?
              </p>
            </div>
            
            {/* Grid de músculos - 2 linhas */}
            <div className="w-full space-y-3">
              {/* Linha 1 */}
              <div className="grid grid-cols-4 gap-2">
                {['Peito', 'Costas', 'Ombros', 'Braços'].map((muscle) => (
                  <button
                    key={muscle}
                    onClick={() => toggleMuscle(muscle)}
                    className={`h-[50px] rounded-[999px] flex items-center justify-center transition-all ${
                      selectedMuscles.includes(muscle)
                        ? 'bg-[#1c1c1c] text-white'
                        : 'bg-[rgba(61,61,61,0.5)] text-white/70 hover:bg-[rgba(61,61,61,0.7)]'
                    }`}
                  >
                    <p className="font-alexandria font-normal text-[12px]">{muscle}</p>
                  </button>
                ))}
              </div>
              
              {/* Linha 2 */}
              <div className="grid grid-cols-4 gap-2">
                {['Pernas', 'Glúteos', 'Core', 'Cardio'].map((muscle) => (
                  <button
                    key={muscle}
                    onClick={() => toggleMuscle(muscle)}
                    className={`h-[50px] rounded-[999px] flex items-center justify-center transition-all ${
                      selectedMuscles.includes(muscle)
                        ? 'bg-[#1c1c1c] text-white'
                        : 'bg-[rgba(61,61,61,0.5)] text-white/70 hover:bg-[rgba(61,61,61,0.7)]'
                    }`}
                  >
                    <p className="font-alexandria font-normal text-[12px]">{muscle}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Botão fixo na parte inferior com margem */}
        <div className="w-full pt-6 pb-4">
          <button
            onClick={handleNext}
            className="bg-[#1c1c1c] hover:bg-[#2c2c2c] active:scale-95 flex items-center justify-center h-[50px] rounded-[999px] w-full cursor-pointer transition-all"
          >
            <p className="font-alexandria font-medium text-[20px] text-white">Avançar</p>
          </button>
        </div>
      </div>
    </div>
  );
}

