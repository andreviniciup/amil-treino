import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Frame106 } from '../common/Frame106';
import { useWorkoutCreator } from '../../contexts/WorkoutCreatorContext';
import { exerciseApi, ExerciseDB } from '../../services/api';
import { MuscleMappingUtil } from '../../utils/muscleMappingUtil';

export function CreateWorkoutExercises() {
  const navigate = useNavigate();
  const { workoutData, updateWorkoutData } = useWorkoutCreator();
  const [exercises, setExercises] = useState([] as ExerciseDB[]);
  const [allExercises, setAllExercises] = useState([] as ExerciseDB[]);
  const [selectedExercises, setSelectedExercises] = useState(workoutData.exercises || [] as ExerciseDB[]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null as string | null);
  const [searchQuery, setSearchQuery] = useState('');

  // Carregar exercícios da API baseado nos músculos selecionados
  useEffect(() => {
    const loadExercises = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let fetchedExercises: ExerciseDB[] = [];
        
        if (workoutData.musculos && workoutData.musculos.length > 0) {
          // Mapear músculos do português para inglês
          const englishMuscles = MuscleMappingUtil.mapArrayPortugueseToEnglish(workoutData.musculos);
          console.log('🔄 Mapeamento PT->EN:', workoutData.musculos, '->', englishMuscles);
          
          // Buscar exercícios por grupo muscular
          const exercisePromises = englishMuscles.map(muscle => 
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
        
        setExercises(fetchedExercises);
        setAllExercises(fetchedExercises);
      } catch (err) {
        console.error('Erro ao carregar exercícios:', err);
        setError('Erro ao carregar exercícios. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, [workoutData.musculos]);

  // Implementar busca com debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setExercises(allExercises);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      try {
        const searchResults = await exerciseApi.search(searchQuery);
        setExercises(searchResults);
      } catch (err) {
        console.error('Erro ao buscar exercícios:', err);
        // Fallback para busca local
        const filtered = allExercises.filter(ex => 
          ex.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setExercises(filtered);
      }
    }, 500);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery, allExercises]);

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
      navigate('/workout/create/config');
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
    <div className="bg-[#202020] relative size-full overflow-y-auto" data-name="criar-treino-exercises">
      <Frame106 onClick={handleNext} text="Avançar" />
      
      <p className="absolute font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] left-[20px] text-[24px] text-nowrap text-white top-[20px] whitespace-pre">
        Escolha os exercícios
      </p>

      {/* Barra de Busca */}
      <div className="absolute left-[20px] right-[20px] top-[60px]">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar exercícios..."
          className="w-full h-[40px] bg-[rgba(60,60,60,0.50)] rounded-[999px] border-none text-white text-[14px] font-['Alexandria:Regular',_sans-serif] pl-[20px] pr-[20px] outline-none placeholder-[#7c7c7c]"
        />
      </div>

      <div className="absolute left-[20px] right-[20px] top-[110px] pb-[100px]">
        {exercises.length === 0 ? (
          <p className="text-white text-center mt-10">
            Nenhum exercício encontrado para os grupos musculares selecionados.
          </p>
        ) : (
          exercises.map((exercise, index) => (
            <div
              key={exercise.id}
              onClick={() => toggleExercise(exercise)}
              className={`cursor-pointer mb-4 ${
                selectedExercises.some(e => e.id === exercise.id) ? 'ring-2 ring-[#f0d471]' : ''
              }`}
              style={{
                width: '100%',
                maxWidth: 320,
                height: 80,
                paddingLeft: 13,
                paddingRight: 13,
                paddingTop: 14,
                paddingBottom: 14,
                background: '#1D1D1D',
                borderRadius: 20,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '0 auto'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 9,
                width: '100%'
              }}>
                {exercise.gifUrl && (
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
                )}
                {!exercise.gifUrl && (
                  <div style={{
                    width: 50,
                    height: 50,
                    background: '#484848',
                    borderRadius: 8
                  }} />
                )}
                <div style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      color: 'white',
                      fontSize: 14,
                      fontFamily: 'Alexandria, sans-serif',
                      fontWeight: 400,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '180px'
                    }}>
                      {exercise.name}
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: 5,
                    flexWrap: 'wrap'
                  }}>
                    <div
                      style={{
                        paddingLeft: 6,
                        paddingRight: 6,
                        paddingTop: 2,
                        paddingBottom: 2,
                        background: '#CF9EE7',
                        borderRadius: 99,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{
                        color: '#361A38',
                        fontSize: 8,
                        fontFamily: 'Alexandria, sans-serif',
                        fontWeight: 500
                      }}>
                        {exercise.bodyPart}
                      </div>
                    </div>
                    {exercise.equipment && (
                      <div
                        style={{
                          paddingLeft: 6,
                          paddingRight: 6,
                          paddingTop: 2,
                          paddingBottom: 2,
                          background: '#AD9EE7',
                          borderRadius: 99,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <div style={{
                          color: '#261A38',
                          fontSize: 8,
                          fontFamily: 'Alexandria, sans-serif',
                          fontWeight: 500
                        }}>
                          {exercise.equipment}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
