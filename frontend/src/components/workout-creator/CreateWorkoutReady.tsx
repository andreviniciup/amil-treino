import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

      console.log('=== DEBUG: Salvando treino ===');
      console.log('workoutData.exercises:', workoutData.exercises);
      
      if (workoutData.exercises && workoutData.exercises.length > 0) {
        workoutData.exercises.forEach((ex, idx) => {
          console.log(`Exercício ${idx + 1}:`, {
            name: ex.name,
            sets: ex.sets,
            series: (ex as any).series
          });
        });
      }

      // Criar um workout para cada dia selecionado
      const workouts = (workoutData.trainingDays || ['monday']).map(dayKey => {
        const dayMap: { [key: string]: string } = {
          'monday': 'Segunda',
          'tuesday': 'Terça', 
          'wednesday': 'Quarta',
          'thursday': 'Quinta',
          'friday': 'Sexta',
          'saturday': 'Sábado',
          'sunday': 'Domingo'
        };

        const dayName = dayMap[dayKey] || 'Segunda';

        return {
          name: workoutData.nomeTreino || 'Treino',
          dayOfWeek: dayName,
          trainingType: workoutData.tipoTreino || 'Geral',
          exercises: (workoutData.exercises || []).map((exercise, index) => ({
            exerciseId: exercise.id,
            exerciseName: exercise.name,
            sets: exercise.sets || 3, // Usa o sets individual de cada exercício
            reps: workoutData.reps || '8-12',
            restTime: workoutData.restTime || 90,
            order: index + 1,
            gifUrl: exercise.gifUrl,
            bodyPart: exercise.bodyPart,
            equipment: exercise.equipment,
            target: exercise.target
          }))
        };
      });

      // Transformar dados do contexto para o formato da API
      const planData: CreateWorkoutPlanDto = {
        name: workoutData.nomeTreino || 'Meu Treino',
        description: `Treino de ${workoutData.tipoTreino || 'Personalizado'}`,
        frequency: workouts.length,
        trainingTypes: workoutData.tipoTreino ? [workoutData.tipoTreino] : [],
        workouts: workouts
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
    <div className="bg-[#202020] fixed inset-0 overflow-hidden flex items-center justify-center" data-name="criar-treino-ready">
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          <div className="text-white text-[20px] font-alexandria font-normal mb-4">
            Salvando treino...
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center px-8">
          <div className="text-white text-[18px] font-alexandria font-normal mb-4 text-center">
            {error}
          </div>
          <button
            onClick={handleFinish}
            className="bg-white px-8 py-4 rounded-full text-[#202020] font-alexandria font-medium"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <div className="relative w-full max-w-[393px] h-full flex flex-col px-5 py-6">
          
          {/* Área que centraliza o conteúdo verticalmente */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full text-center">
              <div className="text-[60px] sm:text-[80px] mb-[20px] sm:mb-[30px]">
                🎉
              </div>
              <p className="font-alexandria font-bold text-[24px] sm:text-[28px] text-white leading-[1.3]">
                Treino pronto, já pode<br/>começar agora mesmo!!!
              </p>
            </div>
          </div>
          
          {/* Botão fixo na parte inferior com margem */}
          <div className="w-full pt-5 pb-3">
            <button
              onClick={handleFinish}
              className="bg-[#1c1c1c] hover:bg-[#2c2c2c] active:scale-95 flex items-center justify-center h-[48px] sm:h-[50px] rounded-[999px] w-full cursor-pointer transition-all"
            >
              <p className="font-alexandria font-medium text-[18px] sm:text-[20px] text-white">Salvar e Começar</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
