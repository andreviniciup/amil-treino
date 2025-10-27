import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkoutCreator } from '../../contexts/WorkoutCreatorContext';
import { exerciseApi, ExerciseDB } from '../../services/api';
import { MuscleMappingUtil } from '../../utils/muscleMappingUtil';

export function CreateWorkoutExercises() {
  const navigate = useNavigate();
  const { workoutData, updateWorkoutData } = useWorkoutCreator();
  const [exercises, setExercises] = useState([] as ExerciseDB[]);
  const [selectedExercises, setSelectedExercises] = useState(workoutData.exercises || [] as ExerciseDB[]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null as string | null);

  // Carregar exercícios da API baseado nos músculos selecionados
  useEffect(() => {
    const loadExercises = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let fetchedExercises: ExerciseDB[] = [];
        
        if (workoutData.musculos && workoutData.musculos.length > 0) {
          // Backend agora retorna dados em português, buscar diretamente
          console.log('� Buscando exercícios para:', workoutData.musculos);
          
          // Buscar exercícios por grupo muscular (agora em português)
          const exercisePromises = workoutData.musculos.map(muscle => 
            exerciseApi.getByBodyPart(muscle)
          );
          const results = await Promise.all(exercisePromises);
          // Combinar e remover duplicatas
          fetchedExercises = results.flat().filter((exercise, index, self) =>
            index === self.findIndex((e) => e.id === exercise.id)
          );
        } else {
          // Se não houver músculos selecionados, buscar todos
          fetchedExercises = await exerciseApi.getAll();
        }
        
        // Exercícios já vêm traduzidos do backend
        setExercises(fetchedExercises);
        
        console.log('✅ Exercícios carregados:', fetchedExercises.length);
        console.log('🖼️ Primeiro exercício:', fetchedExercises[0]);
      } catch (err) {
        console.error('Erro ao carregar exercícios:', err);
        setError('Erro ao carregar exercícios. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, [workoutData.musculos]);

  const toggleExercise = (exercise: ExerciseDB) => {
    setSelectedExercises(prev => {
      const isSelected = prev.some(e => e.id === exercise.id);
      if (isSelected) {
        return prev.filter(e => e.id !== exercise.id);
      } else {
        return [...prev, exercise];
      }
    });
  };

  const handleNext = () => {
    if (selectedExercises.length > 0) {
      updateWorkoutData({ exercises: selectedExercises });
      navigate('/workout/create/day');
    }
  };

  if (loading) {
    return (
      <div className="bg-[#202020] relative size-full flex items-center justify-center" data-name="criar-treino-exercises">
        <p className="text-white text-[18px] font-['Alexandria:Regular',_sans-serif]">
          Carregando exercícios...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#202020] relative size-full flex flex-col items-center justify-center gap-4" data-name="criar-treino-exercises">
        <p className="text-red-400 text-[18px] font-['Alexandria:Regular',_sans-serif]">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#d9d9d9] px-6 py-3 rounded-full text-[#202020] font-['Alexandria:Medium',_sans-serif]"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div style={{width: 390, height: 844, position: 'relative', background: '#202020', overflow: 'hidden'}} data-name="criar-treino-exercises">
      {/* Botão Avançar - Fixo */}
      <div 
        onClick={handleNext}
        style={{
          width: 353, 
          height: 50, 
          paddingLeft: 129, 
          paddingRight: 129, 
          paddingTop: 13, 
          paddingBottom: 13, 
          left: 20, 
          top: 765, 
          position: 'absolute', 
          background: '#1C1C1C', 
          borderRadius: 999, 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: 10, 
          display: 'inline-flex',
          cursor: 'pointer'
        }}
      >
        <div style={{color: 'white', fontSize: 20, fontFamily: 'Alexandria', fontWeight: '500', wordWrap: 'break-word'}}>
          Avançar
        </div>
      </div>

      {/* Área de scroll apenas dos exercícios */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 57,
        width: 390,
        height: 690,
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingLeft: 35,
        paddingRight: 35
      }}>
        {exercises.length === 0 ? (
          <p style={{color: 'white', textAlign: 'center', marginTop: 40, fontFamily: 'Alexandria'}}>
            Nenhum exercício encontrado para os grupos musculares selecionados.
          </p>
        ) : (
          exercises.map((exercise, index) => {
            const isSelected = selectedExercises.some(e => e.id === exercise.id);
            return (
              <div
                key={exercise.id}
                onClick={() => toggleExercise(exercise)}
                style={{
                  width: 320,
                  height: 80,
                  paddingLeft: 13,
                  paddingRight: 13,
                  paddingTop: 14,
                  paddingBottom: 14,
                  marginBottom: 10,
                  background: isSelected ? '#1D1D1D' : '#2E2E2E',
                  borderRadius: 20,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 10,
                  display: 'inline-flex',
                  cursor: 'pointer'
                }}
              >
                <div style={{justifyContent: 'center', alignItems: 'center', gap: 9, display: 'inline-flex'}}>
                  {exercise.gifUrl ? (
                    <img
                      src={exercise.gifUrl}
                      alt={exercise.name}
                      style={{
                        width: 50,
                        height: 50,
                        background: '#484848',
                        borderRadius: 8,
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div style={{width: 50, height: 50, background: '#484848', borderRadius: 8}} />
                  )}
                  <div style={{width: 235, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 17, display: 'inline-flex'}}>
                    <div style={{alignSelf: 'stretch', justifyContent: 'space-between', alignItems: 'flex-end', display: 'inline-flex'}}>
                      <div style={{color: 'white', fontSize: 14, fontFamily: 'Alexandria', fontWeight: '400', wordWrap: 'break-word'}}>
                        {exercise.name}
                      </div>
                    </div>
                    <div style={{justifyContent: 'flex-start', alignItems: 'center', gap: 5, display: 'inline-flex'}}>
                      <div style={{paddingLeft: 6, paddingRight: 6, paddingTop: 2, paddingBottom: 2, background: '#CF9EE7', borderRadius: 99, justifyContent: 'center', alignItems: 'center', gap: 10, display: 'flex'}}>
                        <div style={{color: '#361A38', fontSize: 8, fontFamily: 'Alexandria', fontWeight: '500', wordWrap: 'break-word'}}>
                          {exercise.bodyPart}
                        </div>
                      </div>
                      {exercise.equipment && (
                        <div style={{paddingLeft: 6, paddingRight: 6, paddingTop: 2, paddingBottom: 2, background: '#AD9EE7', borderRadius: 99, justifyContent: 'center', alignItems: 'center', gap: 10, display: 'flex'}}>
                          <div style={{color: '#261A38', fontSize: 8, fontFamily: 'Alexandria', fontWeight: '500', wordWrap: 'break-word'}}>
                            {exercise.equipment}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
