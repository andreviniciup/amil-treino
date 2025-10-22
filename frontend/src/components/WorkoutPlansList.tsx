import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutApi, WorkoutPlan } from '../services/api';

export function WorkoutPlansList() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    loadPlans();
  }, []);

  if (loading) {
    return (
      <div className="w-full p-4">
        <p className="text-white text-center">Carregando planos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4">
        <p className="text-red-400 text-center">{error}</p>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="w-full p-4">
        <p className="text-[#2c2c2c] text-center font-['Alexandria:Regular',_sans-serif]">
          Você ainda não tem planos de treino. Crie seu primeiro!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 pb-4 space-y-3">
      {plans.map((plan) => (
        <div
          key={plan.id}
          onClick={() => navigate('/treino')}
          className="bg-[#202020] rounded-[20px] p-4 cursor-pointer hover:bg-[#2a2a2a] transition-colors"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-white font-['Alexandria:Medium',_sans-serif] text-[16px]">
              {plan.name}
            </h3>
            <span className="text-[#9c9c9c] font-['Alexandria:Regular',_sans-serif] text-[12px]">
              {plan.frequency}x/semana
            </span>
          </div>
          {plan.description && (
            <p className="text-[#7c7c7c] font-['Alexandria:Regular',_sans-serif] text-[12px] mb-2">
              {plan.description}
            </p>
          )}
          <div className="flex gap-2 flex-wrap">
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
        </div>
      ))}
    </div>
  );
}


