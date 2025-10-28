import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkoutCreator } from '../../contexts/WorkoutCreatorContext';
import { exerciseApi, ExerciseDB } from '../../services/api';
import { getMuscleImage } from '../../utils/muscleMapping';

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
      navigate('/workout/create/config');
    }
  };

  if (loading) {
    return (
      <div className="bg-[#202020] relative w-full h-screen overflow-hidden flex items-center justify-center" data-name="criar-treino-exercises">
        <p className="text-white text-[18px] font-alexandria font-normal">
          Carregando exercícios...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#202020] relative w-full h-screen overflow-hidden flex flex-col items-center justify-center gap-4" data-name="criar-treino-exercises">
        <p className="text-red-400 text-[18px] font-alexandria font-normal">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#d9d9d9] px-6 py-3 rounded-full text-[#202020] font-alexandria font-medium"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#202020] relative w-full h-screen overflow-hidden flex items-center justify-center" data-name="criar-treino-exercises">
      <div className="relative w-full max-w-[393px] h-full flex flex-col px-5 py-8">
        
        {/* Título fixo */}
        <div className="w-full mb-4">
          <p className="font-alexandria font-normal text-[20px] text-white text-left">
            Escolha os exercícios
          </p>
          <p className="font-alexandria font-normal text-[14px] text-white/70 text-left mt-1">
            {selectedExercises.length} selecionado{selectedExercises.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        {/* Lista de exercícios com scroll */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 -mr-2">
          {exercises.length === 0 ? (
            <p className="text-white text-center mt-10 font-alexandria">
              Nenhum exercício encontrado para os grupos musculares selecionados.
            </p>
          ) : (
            <div className="space-y-3 pb-4">
              {exercises.map((exercise) => {
                const isSelected = selectedExercises.some(e => e.id === exercise.id);
                return (
                  <button
                    key={exercise.id}
                    onClick={() => toggleExercise(exercise)}
                    className={`w-full p-3 rounded-[20px] transition-all ${
                      isSelected ? 'bg-[#1D1D1D]' : 'bg-[#2E2E2E] hover:bg-[#3E3E3E]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Imagem do exercício */}
                      <div className="w-[50px] h-[50px] bg-[#484848] rounded-lg flex-shrink-0 overflow-hidden">
                        {exercise.gifUrl ? (
                          <img
                            src={exercise.gifUrl}
                            alt={exercise.name}
                            className="w-full h-full object-cover"
                            onError={(e: any) => {
                              e.target.src = getMuscleImage(exercise.bodyPart);
                            }}
                          />
                        ) : (
                          <img
                            src={getMuscleImage(exercise.bodyPart)}
                            alt={exercise.bodyPart}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      
                      {/* Informações do exercício */}
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-white text-[14px] font-alexandria font-normal mb-2 line-clamp-1">
                          {exercise.name}
                        </p>
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
                  </button>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Botão fixo na parte inferior com margem */}
        <div className="w-full pt-4 pb-4">
          <button
            onClick={handleNext}
            disabled={selectedExercises.length === 0}
            className="bg-[#1c1c1c] hover:bg-[#2c2c2c] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center h-[50px] rounded-[999px] w-full cursor-pointer transition-all"
          >
            <p className="font-alexandria font-medium text-[20px] text-white">Avançar</p>
          </button>
        </div>
      </div>
    </div>
  );
}
