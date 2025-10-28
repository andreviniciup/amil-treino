import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkoutCreator } from '../../contexts/WorkoutCreatorContext';

export function CreateWorkoutConfig() {
  const navigate = useNavigate();
  const { workoutData, updateWorkoutData } = useWorkoutCreator();
  
  const [workoutName] = useState(workoutData.name || 'nome do treino');
  const [exercises, setExercises] = useState(() => {
    return (workoutData.exercises || []).map((ex, index) => ({
      ...ex,
      series: 3
    }));
  });
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [dragOverItem, setDragOverItem] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  // Handlers para desktop
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem !== null && draggedItem !== index) {
      setDragOverItem(index);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === dropIndex) return;

    const newExercises = [...exercises];
    const [removed] = newExercises.splice(draggedItem, 1);
    newExercises.splice(dropIndex, 0, removed);
    setExercises(newExercises);
    setDragOverItem(null);
  };

  // Handlers para mobile (touch)
  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    // Verificar se o toque foi no input
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT') {
      return; // Não iniciar drag se tocou no input
    }
    
    setDraggedItem(index);
    setTouchStartY(e.touches[0].clientY);
    e.currentTarget.style.opacity = '0.6';
  };

  const handleTouchMove = (e: React.TouchEvent, currentIndex: number) => {
    if (draggedItem === null || touchStartY === null) return;
    
    const touchY = e.touches[0].clientY;
    const cardHeight = 93; // altura do card + margin
    const diff = touchY - touchStartY;
    const steps = Math.round(diff / cardHeight);
    
    const newIndex = draggedItem + steps;
    if (newIndex >= 0 && newIndex < exercises.length && newIndex !== dragOverItem) {
      setDragOverItem(newIndex);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.currentTarget.style.opacity = '1';
    
    if (draggedItem !== null && dragOverItem !== null && draggedItem !== dragOverItem) {
      const newExercises = [...exercises];
      const [removed] = newExercises.splice(draggedItem, 1);
      newExercises.splice(dragOverItem, 0, removed);
      setExercises(newExercises);
    }
    
    setDraggedItem(null);
    setDragOverItem(null);
    setTouchStartY(null);
  };

  const updateSeries = (index: number, value: string) => {
    const newExercises = [...exercises];
    const numValue = parseInt(value) || 3;
    newExercises[index].series = Math.max(1, numValue);
    setExercises(newExercises);
  };

  const handleFinalize = () => {
    updateWorkoutData({ 
      exercises: exercises.map((ex, index) => ({
        ...ex,
        order: index,
        sets: ex.series
      }))
    });
    navigate('/workout/create/day');
  };

  const handleAddExercise = () => {
    navigate('/workout/create/exercises');
  };

  return (
    <div className="bg-[#202020] fixed inset-0 overflow-hidden flex items-center justify-center">
      <div className="relative w-full max-w-[393px] h-full flex flex-col px-5 py-6">
        
        {/* Título fixo */}
        <div className="w-full mb-3 flex-shrink-0">
          <p className="font-alexandria font-medium text-[18px] sm:text-[20px] text-white text-left">
            {workoutName}
          </p>
          <p className="font-alexandria font-normal text-[13px] sm:text-[14px] text-white/70 text-left mt-1">
            Arraste para reordenar
          </p>
        </div>
        
        {/* Lista de exercícios com scroll */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 -mr-2 min-h-0">
          <div className="space-y-3 pb-4">
            {exercises.map((exercise, index) => (
              <div
                key={`${exercise.id}-${index}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onTouchStart={(e) => handleTouchStart(e, index)}
                onTouchMove={(e) => handleTouchMove(e, index)}
                onTouchEnd={handleTouchEnd}
                className={`w-full p-3 rounded-[15px] transition-all touch-none ${
                  draggedItem === index 
                    ? 'bg-[#2A2A2A] opacity-60 scale-105 rotate-[-2deg] shadow-xl' 
                    : dragOverItem === index
                    ? 'bg-[#1D1D1D] -translate-y-1 border-2 border-dashed border-[#CF9EE7]'
                    : 'bg-[#1D1D1D]'
                }`}
                style={{
                  cursor: draggedItem === index ? 'grabbing' : 'grab',
                  zIndex: draggedItem === index ? 1000 : 1
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Número da ordem */}
                  <div className="text-white text-[20px] font-alexandria font-normal flex-shrink-0">
                    {index + 1}.
                  </div>

                  {/* Informações do exercício */}
                  <div className="flex-1 min-w-0">
                    {/* Nome e Séries */}
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-white text-[14px] font-alexandria font-normal flex-1 min-w-0 mr-2 line-clamp-1">
                        {exercise.name}
                      </p>

                      {/* Input de séries */}
                      <div className="flex-shrink-0 px-3 py-1 bg-[#252525] rounded-full flex items-center gap-1.5">
                        <input
                          type="number"
                          value={exercise.series}
                          onChange={(e) => updateSeries(index, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          onTouchStart={(e) => e.stopPropagation()}
                          className="w-5 text-[#888] text-[10px] font-alexandria bg-transparent border-none outline-none text-center"
                          min="1"
                        />
                        <span className="text-[#888] text-[10px] font-alexandria whitespace-nowrap">
                          séries
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 bg-[#CF9EE7] rounded-full text-[#361A38] text-[10px] font-alexandria font-medium whitespace-nowrap">
                        {exercise.bodyPart}
                      </span>
                      {exercise.equipment && (
                        <span className="px-2 py-0.5 bg-[#AD9EE7] rounded-full text-[#261A38] text-[10px] font-alexandria font-medium whitespace-nowrap">
                          {exercise.equipment}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Botão Adicionar Exercício */}
            <button
              onClick={handleAddExercise}
              className="w-full h-[80px] bg-[rgba(29,29,29,0.55)] rounded-[15px] flex items-center justify-center hover:bg-[rgba(29,29,29,0.75)] transition-colors"
            >
              <p className="text-[#4C4C4C] text-[13px] font-alexandria font-medium">
                adicionar exercício
              </p>
            </button>
          </div>
        </div>
        
        {/* Botão fixo na parte inferior com margem */}
        <div className="w-full pt-4 pb-3 flex-shrink-0">
          <button
            onClick={handleFinalize}
            className="bg-[#1c1c1c] hover:bg-[#2c2c2c] active:scale-95 flex items-center justify-center h-[48px] sm:h-[50px] rounded-[999px] w-full cursor-pointer transition-all"
          >
            <p className="font-alexandria font-medium text-[18px] sm:text-[20px] text-white">Avançar</p>
          </button>
        </div>
      </div>
    </div>
  );
}



