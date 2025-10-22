import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Frame106 } from '../common/Frame106';
import { useWorkoutCreator } from '../../contexts/WorkoutCreatorContext';
import { workoutApi, CreateWorkoutPlanDto } from '../../services/api';

export function CreateWorkoutReady() {
  const navigate = useNavigate();
  const { workoutData, resetWorkoutData } = useWorkoutCreator();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFinish = async () => {
    try {
      setLoading(true);
      setError(null);

      // Transformar dados do contexto para o formato da API
      const planData: CreateWorkoutPlanDto = {
        name: workoutData.nomeTreino || 'Meu Treino',
        description: `Treino de ${workoutData.tipoTreino || 'Personalizado'}`,
        frequency: 1, // Pode ser ajustado conforme necessidade
        trainingTypes: workoutData.tipoTreino ? [workoutData.tipoTreino] : [],
        workouts: [{
          dayOfWeek: 'Segunda', // Pode ser ajustado conforme necessidade
          trainingType: workoutData.tipoTreino || 'Geral',
          exercises: (workoutData.exercises || []).map((exercise, index) => ({
            exerciseId: exercise.id,
            exerciseName: exercise.name,
            sets: parseInt(workoutData.series || '3'),
            reps: workoutData.reps || '8-12',
            restTime: workoutData.restTime || 90,
            order: index + 1,
            gifUrl: exercise.gifUrl,
            bodyPart: exercise.bodyPart,
            equipment: exercise.equipment,
            target: exercise.target
          }))
        }]
      };

      // Salvar no backend
      await workoutApi.createPlan(planData);
      
      // Resetar dados e voltar para home
      resetWorkoutData();
      navigate('/home');
    } catch (err) {
      console.error('Erro ao salvar treino:', err);
      setError('Erro ao salvar treino. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#202020] relative size-full flex flex-col justify-center items-center" data-name="criar-treino-ready">
      {loading ? (
        <>
          <div className="text-white text-[24px] font-['Alexandria:Regular',_sans-serif] mb-4">
            Salvando treino...
          </div>
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
        </>
      ) : error ? (
        <>
          <div className="text-red-400 text-[20px] font-['Alexandria:Regular',_sans-serif] mb-4 text-center px-8">
            {error}
          </div>
          <button
            onClick={handleFinish}
            className="bg-[#d9d9d9] px-8 py-4 rounded-full text-[#202020] font-['Alexandria:Medium',_sans-serif]"
          >
            Tentar novamente
          </button>
        </>
      ) : (
        <>
          <div className="text-[80px] mb-[30px]">
            🎉
          </div>
          <div className="text-white text-[28px] font-['Alexandria:Bold',_sans-serif] font-bold text-center leading-[1.3] mb-[50px]">
            Treino pronto, já pode<br/>começar agora mesmo!!!
          </div>
          
          <Frame106 onClick={handleFinish} text="Salvar e Começar" />
        </>
      )}
    </div>
  );
}
