import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutApi, WorkoutPlan } from '../services/api';

export function MyWorkoutsPage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const userPlans = await workoutApi.getUserPlans();
      setPlans(userPlans);
    } catch (err) {
      console.error('Erro ao carregar planos:', err);
      setError('Erro ao carregar seus planos de treino.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (planId: string) => {
    if (!window.confirm('Tem certeza que deseja deletar este plano de treino?')) {
      return;
    }

    try {
      setDeletingId(planId);
      await workoutApi.deletePlan(planId);
      setPlans(plans.filter(p => p.id !== planId));
    } catch (err) {
      console.error('Erro ao deletar plano:', err);
      alert('Erro ao deletar plano. Tente novamente.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#181818] relative size-full flex items-center justify-center">
        <p className="text-white text-[18px] font-['Alexandria:Regular',_sans-serif]">
          Carregando planos...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#181818] relative size-full flex flex-col items-center justify-center gap-4">
        <p className="text-red-400 text-[18px] font-['Alexandria:Regular',_sans-serif]">
          {error}
        </p>
        <button
          onClick={loadPlans}
          className="bg-[#d9d9d9] px-6 py-3 rounded-full text-[#202020] font-['Alexandria:Medium',_sans-serif]"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#181818] relative w-full min-h-screen overflow-y-auto" data-name="my-workouts">
      {/* Container centralizado horizontalmente */}
      <div className="w-[393px] max-w-[90vw] mx-auto">
        {/* Header */}
        <div className="sticky top-0 p-5 bg-[#181818] z-10 border-b border-[#2c2c2c]">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => navigate('/home')}
              className="text-white text-[24px] shrink-0"
            >
              ←
            </button>
            <h1 className="text-white font-['Alexandria:Medium',_sans-serif] text-[20px] flex-1 text-center">
              Meus Treinos
            </h1>
            <div className="w-[24px] shrink-0"></div>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 py-5">
          {plans.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <p className="text-[#7c7c7c] text-center font-['Alexandria:Regular',_sans-serif] mb-6">
                Você ainda não tem planos de treino.
              </p>
              <button
                onClick={() => navigate('/workout/create/intro')}
                className="bg-[#d9d9d9] px-8 py-4 rounded-full text-[#202020] font-['Alexandria:Medium',_sans-serif]"
              >
                Criar Primeiro Treino
              </button>
            </div>
          ) : (
            <div className="space-y-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="bg-[#202020] rounded-[20px] p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-white font-['Alexandria:Medium',_sans-serif] text-[18px] mb-1">
                      {plan.name}
                    </h3>
                    {plan.description && (
                      <p className="text-[#7c7c7c] font-['Alexandria:Regular',_sans-serif] text-[12px] mb-2">
                        {plan.description}
                      </p>
                    )}
                  </div>
                  <span className="text-[#9c9c9c] font-['Alexandria:Regular',_sans-serif] text-[12px] ml-2">
                    {plan.frequency}x/sem
                  </span>
                </div>

                {/* Training Types */}
                <div className="flex gap-2 flex-wrap mb-3">
                  {(() => {
                    try {
                      const trainingTypes = typeof plan.trainingTypes === 'string' 
                        ? JSON.parse(plan.trainingTypes) 
                        : plan.trainingTypes;
                      return Array.isArray(trainingTypes) ? trainingTypes : [];
                    } catch (error) {
                      console.error('Erro ao parsear trainingTypes:', error);
                      return [];
                    }
                  })().map((type, index) => (
                    <span
                      key={index}
                      className="bg-[#3c3c3c] text-white text-[10px] font-['Alexandria:Medium',_sans-serif] px-3 py-1 rounded-full"
                    >
                      {type}
                    </span>
                  ))}
                </div>

                {/* Workouts Count */}
                <p className="text-[#9c9c9c] font-['Alexandria:Regular',_sans-serif] text-[12px] mb-3">
                  {plan.workouts.length} treino{plan.workouts.length !== 1 ? 's' : ''} configurado{plan.workouts.length !== 1 ? 's' : ''}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate('/treino')}
                    className="flex-1 bg-[#d9d9d9] hover:bg-[#e9e9e9] transition-colors px-4 py-2 rounded-full text-[#202020] font-['Alexandria:Medium',_sans-serif] text-[14px]"
                  >
                    Iniciar
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    disabled={deletingId === plan.id}
                    className="px-4 py-2 rounded-full border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors font-['Alexandria:Medium',_sans-serif] text-[14px] disabled:opacity-50"
                  >
                    {deletingId === plan.id ? 'Deletando...' : 'Deletar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}


