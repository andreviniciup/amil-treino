import React, { memo, useCallback } from 'react';
import { SeriesCard } from '../SeriesCard';
import { WeeklyProgressBar } from './WeeklyProgressBar';

interface SeriesData {
  repetitions: string;
  weight: string;
  restTime: string;
  status: "active" | "pending" | "completed";
  actualReps?: number;
  actualWeight?: number;
  actualRestTime?: number;
}

interface ExerciseSeriesListProps {
  series: SeriesData[];
  expandedSeriesIndex: number | null;
  exerciseCompleted: boolean;
  exerciseHistory: number[];
  currentSeriesIndex: number;
  currentReps: number;
  onToggleExpand: (index: number) => void;
  onStartRest: (index: number, reps: number, weight: number, restTime: number) => void;
  onRepetitionsChange: (index: number, value: string) => void;
  onWeightChange: (index: number, value: string) => void;
  onRestTimeChange: (index: number, value: string) => void;
  onWeightChangeNumber: (index: number, value: number) => void;
  onRestTimeChangeNumber: (index: number, value: number) => void;
  onRepsChange: (index: number, min: number, max: number) => void;
}

export const ExerciseSeriesList = memo(function ExerciseSeriesList({
  series,
  expandedSeriesIndex,
  exerciseCompleted,
  exerciseHistory,
  currentSeriesIndex,
  currentReps,
  onToggleExpand,
  onStartRest,
  onRepetitionsChange,
  onWeightChange,
  onRestTimeChange,
  onWeightChangeNumber,
  onRestTimeChangeNumber,
  onRepsChange
}: ExerciseSeriesListProps) {
  const handleToggleExpand = useCallback((index: number, serie: SeriesData) => {
    if (serie.status !== "completed" && !exerciseCompleted) {
      onToggleExpand(index);
    }
  }, [exerciseCompleted, onToggleExpand]);

  const handleStartRest = useCallback((index: number, serie: SeriesData, reps: number, weight: number, restTime: number) => {
    if (serie.status !== "completed" && !exerciseCompleted) {
      onStartRest(index, reps, weight, restTime);
    }
  }, [exerciseCompleted, onStartRest]);

  const handleRepetitionsChange = useCallback((index: number, serie: SeriesData, value: string) => {
    if (serie.status !== "completed" && !exerciseCompleted) {
      onRepetitionsChange(index, value);
    }
  }, [exerciseCompleted, onRepetitionsChange]);

  const handleWeightChange = useCallback((index: number, serie: SeriesData, value: string) => {
    if (serie.status !== "completed" && !exerciseCompleted) {
      onWeightChange(index, value);
    }
  }, [exerciseCompleted, onWeightChange]);

  const handleRestTimeChange = useCallback((index: number, serie: SeriesData, value: string) => {
    if (serie.status !== "completed" && !exerciseCompleted) {
      onRestTimeChange(index, value);
    }
  }, [exerciseCompleted, onRestTimeChange]);

  const handleWeightChangeNumber = useCallback((index: number, serie: SeriesData, value: number) => {
    if (serie.status !== "completed" && !exerciseCompleted) {
      onWeightChangeNumber(index, value);
    }
  }, [exerciseCompleted, onWeightChangeNumber]);

  const handleRestTimeChangeNumber = useCallback((index: number, serie: SeriesData, value: number) => {
    if (serie.status !== "completed" && !exerciseCompleted) {
      onRestTimeChangeNumber(index, value);
    }
  }, [exerciseCompleted, onRestTimeChangeNumber]);

  const handleRepsChange = useCallback((index: number, serie: SeriesData, min: number, max: number) => {
    if (serie.status !== "completed" && !exerciseCompleted) {
      onRepsChange(index, min, max);
    }
  }, [exerciseCompleted, onRepsChange]);

  return (
    <div className="content-stretch flex flex-col gap-[15px] items-start relative shrink-0 w-full">
      {/* Gráfico de Progresso Semanal */}
      {exerciseHistory.length > 0 && (
        <WeeklyProgressBar
          history={exerciseHistory}
          currentSet={currentSeriesIndex + 1}
          totalSets={series.length}
          targetReps={currentReps}
        />
      )}

      {series.map((serie, index) => (
        <SeriesCard
          key={`series-${index}-${serie.status}`}
          seriesNumber={index + 1}
          repetitions={serie.repetitions}
          weight={serie.weight}
          restTime={serie.restTime}
          status={serie.status}
          isExpanded={expandedSeriesIndex === index && serie.status !== "completed"}
          onToggleExpand={() => handleToggleExpand(index, serie)}
          onStartRest={(reps, weight, restTime) => handleStartRest(index, serie, reps, weight, restTime)}
          onRepetitionsChange={(value) => handleRepetitionsChange(index, serie, value)}
          onWeightChange={(value) => handleWeightChange(index, serie, value)}
          onRestTimeChange={(value) => handleRestTimeChange(index, serie, value)}
          onWeightChangeNumber={(value) => handleWeightChangeNumber(index, serie, value)}
          onRestTimeChangeNumber={(value) => handleRestTimeChangeNumber(index, serie, value)}
          onRepsChange={(min, max) => handleRepsChange(index, serie, min, max)}
        />
      ))}
    </div>
  );
}, (prevProps, nextProps) => {
  // Comparação customizada para evitar re-renderizações desnecessárias
  return (
    prevProps.series.length === nextProps.series.length &&
    prevProps.expandedSeriesIndex === nextProps.expandedSeriesIndex &&
    prevProps.exerciseCompleted === nextProps.exerciseCompleted &&
    prevProps.currentSeriesIndex === nextProps.currentSeriesIndex &&
    prevProps.currentReps === nextProps.currentReps &&
    prevProps.exerciseHistory.length === nextProps.exerciseHistory.length &&
    JSON.stringify(prevProps.series) === JSON.stringify(nextProps.series)
  );
});

