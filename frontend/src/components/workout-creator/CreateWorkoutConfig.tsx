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
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
  };

  const handleDragEnd = (e) => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    if (draggedItem !== null && draggedItem !== index) {
      setDragOverItem(index);
    }
  };

  const handleDragLeave = (e) => {
    setDragOverItem(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === dropIndex) return;

    const newExercises = [...exercises];
    const [removed] = newExercises.splice(draggedItem, 1);
    newExercises.splice(dropIndex, 0, removed);
    setExercises(newExercises);
    setDragOverItem(null);
  };

  const updateSeries = (index, value) => {
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
    navigate('/workout/create/ready');
  };

  const handleBack = () => {
    navigate('/workout/create/day');
  };

  const handleAddExercise = () => {
    navigate('/workout/create/exercises');
  };

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




