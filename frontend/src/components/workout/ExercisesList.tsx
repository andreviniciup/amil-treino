import { memo, useCallback } from 'react';
import { ExerciseCard } from '../ExerciseCard';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  completed: boolean;
  improvement?: {
    type: 'weight' | 'reps';
    value: string;
  };
}

interface ExercisesListProps {
  exercises: Exercise[];
  onExerciseClick: (exercise: Exercise) => void;
}

export const ExercisesList = memo(function ExercisesList({ 
  exercises, 
  onExerciseClick 
}: ExercisesListProps) {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      {exercises.map((exercise, index) => (
        <ExerciseCard 
          key={exercise.id}
          name={exercise.name}
          sets={exercise.sets}
          completed={exercise.completed}
          improvement={exercise.improvement}
          onExerciseClick={() => onExerciseClick(exercise)}
          defaultExpanded={index === 0}
        />
      ))}
    </div>
  );
}, (prevProps, nextProps) => {
  // Comparação customizada para evitar re-renderizações desnecessárias
  if (prevProps.exercises.length !== nextProps.exercises.length) {
    return false;
  }
  
  // Comparar cada exercício
  for (let i = 0; i < prevProps.exercises.length; i++) {
    const prevEx = prevProps.exercises[i];
    const nextEx = nextProps.exercises[i];
    
    if (
      prevEx.id !== nextEx.id ||
      prevEx.name !== nextEx.name ||
      prevEx.sets !== nextEx.sets ||
      prevEx.completed !== nextEx.completed ||
      JSON.stringify(prevEx.improvement) !== JSON.stringify(nextEx.improvement)
    ) {
      return false;
    }
  }
  
  return true;
});

