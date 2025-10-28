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
    <div className="bg-[#202020] relative w-full h-screen overflow-hidden flex items-center justify-center">
      <div className="relative w-full max-w-[393px] h-full flex flex-col px-5 py-8">
        
        {/* Título fixo */}
        <div className="w-full mb-4">
          <p className="font-alexandria font-medium text-[20px] text-white text-left">
            {workoutName}
          </p>
          <p className="font-alexandria font-normal text-[14px] text-white/70 text-left mt-1">
            Arraste para reordenar
          </p>
        </div>
        
        {/* Lista de exercícios com scroll */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 -mr-2">
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
        <div className="w-full pt-4 pb-4">
          <button
            onClick={handleFinalize}
            className="bg-[#1c1c1c] hover:bg-[#2c2c2c] active:scale-95 flex items-center justify-center h-[50px] rounded-[999px] w-full cursor-pointer transition-all"
          >
            <p className="font-alexandria font-medium text-[20px] text-white">Avançar</p>
          </button>
        </div>
      </div>
    </div>
  );
}

  return (
    <div style={{
      width: '100%',
      minHeight: '844px',
      position: 'relative',
      background: '#202020',
      overflow: 'hidden'
    }}>
      {/* Título */}
      <div style={{
        left: '25px',
        top: '60px',
        position: 'absolute',
        color: 'white',
        fontSize: '20px',
        fontFamily: 'Alexandria, sans-serif',
        fontWeight: '500'
      }}>
        {workoutName}
      </div>

      {/* Lista de Exercícios */}
      {exercises.map((exercise, index) => (
        <div
          key={exercise.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragEnter={(e) => handleDragEnter(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
          style={{
            width: '340px',
            height: '80px',
            paddingLeft: '13px',
            paddingRight: '13px',
            paddingTop: '16px',
            paddingBottom: '16px',
            left: '25px',
            top: `${119 + (index * 93)}px`,
            position: 'absolute',
            background: draggedItem === index ? '#2A2A2A' : '#1D1D1D',
            borderRadius: '15px',
            cursor: 'grab',
            opacity: draggedItem === index ? 0.6 : 1,
            transform: draggedItem === index 
              ? 'rotate(-2deg) scale(1.05)' 
              : dragOverItem === index 
              ? 'translateY(-5px)' 
              : 'rotate(0deg) scale(1)',
            transition: draggedItem === index ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: draggedItem === index 
              ? '0 10px 30px rgba(0,0,0,0.5)' 
              : '0 2px 8px rgba(0,0,0,0.1)',
            border: dragOverItem === index ? '2px dashed #CF9EE7' : '2px solid transparent',
            zIndex: draggedItem === index ? 1000 : 1
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.cursor = 'grabbing';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.cursor = 'grab';
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '13px'
          }}>
            <div style={{
              color: 'white',
              fontSize: '24px',
              fontFamily: 'Alexandria, sans-serif',
              fontWeight: '400'
            }}>
              {index + 1}.
            </div>

            <div style={{
              width: '278px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {/* Nome e Séries */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end'
              }}>
                <div style={{
                  color: 'white',
                  fontSize: '14px',
                  fontFamily: 'Alexandria, sans-serif',
                  fontWeight: '400'
                }}>
                  {exercise.name}
                </div>

                <div style={{
                  paddingLeft: '15px',
                  paddingRight: '15px',
                  paddingTop: '3px',
                  paddingBottom: '3px',
                  background: '#252525',
                  borderRadius: '999px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <input
                    type="number"
                    value={exercise.series}
                    onChange={(e) => updateSeries(index, e.target.value)}
                    style={{
                      width: '12px',
                      color: '#484848',
                      fontSize: '10px',
                      fontFamily: 'Alexandria, sans-serif',
                      fontWeight: '400',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none'
                    }}
                    min="1"
                  />
                  <span style={{
                    color: '#484848',
                    fontSize: '10px',
                    fontFamily: 'Alexandria, sans-serif',
                    fontWeight: '400'
                  }}>
                    series
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div style={{
                display: 'flex',
                gap: '5px'
              }}>
                <div style={{
                  paddingLeft: '6px',
                  paddingRight: '6px',
                  paddingTop: '2px',
                  paddingBottom: '2px',
                  background: '#CF9EE7',
                  borderRadius: '99px'
                }}>
                  <div style={{
                    color: '#361A38',
                    fontSize: '8px',
                    fontFamily: 'Alexandria, sans-serif',
                    fontWeight: '500'
                  }}>
                    {exercise.bodyPart}
                  </div>
                </div>
                <div style={{
                  paddingLeft: '6px',
                  paddingRight: '6px',
                  paddingTop: '2px',
                  paddingBottom: '2px',
                  background: '#AD9EE7',
                  borderRadius: '99px'
                }}>
                  <div style={{
                    color: '#261A38',
                    fontSize: '8px',
                    fontFamily: 'Alexandria, sans-serif',
                    fontWeight: '500'
                  }}>
                    {exercise.equipment}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Botão Adicionar Exercício */}
      <div 
        onClick={handleAddExercise}
        style={{
          width: '340px',
          height: '80px',
          paddingLeft: '13px',
          paddingRight: '13px',
          paddingTop: '16px',
          paddingBottom: '16px',
          left: '25px',
          top: `${119 + (exercises.length * 93)}px`,
          position: 'absolute',
          background: 'rgba(29, 29, 29, 0.55)',
          borderRadius: '15px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer'
        }}
      >
        <div style={{
          color: '#4C4C4C',
          fontSize: '13px',
          fontFamily: 'Alexandria, sans-serif',
          fontWeight: '500'
        }}>
          adicionar exercício
        </div>
      </div>

      {/* Botão Finalizar */}
      <div 
        onClick={handleFinalize}
        style={{
          width: '353px',
          height: '50px',
          paddingLeft: '129px',
          paddingRight: '129px',
          paddingTop: '13px',
          paddingBottom: '13px',
          left: '20px',
          top: '765px',
          position: 'absolute',
          background: '#1C1C1C',
          borderRadius: '999px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer'
        }}
      >
        <div style={{
          color: 'white',
          fontSize: '20px',
          fontFamily: 'Alexandria, sans-serif',
          fontWeight: '500'
        }}>
          Finalizar
        </div>
      </div>
    </div>
  );
}




