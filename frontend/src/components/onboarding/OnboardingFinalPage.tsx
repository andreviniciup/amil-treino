import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Frame106 } from '../common/Frame106';
import { authApi } from '../../services/api';

export function OnboardingFinalPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    try {
      setLoading(true);
      setError(null);

      // Ler dados do localStorage
      const personalData = JSON.parse(localStorage.getItem('onboarding-personal') || '{}');
      const interests = JSON.parse(localStorage.getItem('onboarding-interests') || '[]');
      const days = JSON.parse(localStorage.getItem('onboarding-days') || '[]');

      // Preparar dados para envio
      const profileData = {
        name: personalData.nome,
        age: personalData.idade ? parseInt(personalData.idade) : undefined,
        gender: personalData.genero,
        weight: personalData.peso ? parseFloat(personalData.peso) : undefined,
        height: personalData.altura ? parseFloat(personalData.altura) : undefined,
        fitnessGoal: interests.join(', '),
        trainingDays: days
      };

      // Salvar no backend
      await authApi.updateProfile(profileData);

      // Limpar dados do localStorage
      localStorage.removeItem('onboarding-personal');
      localStorage.removeItem('onboarding-interests');
      localStorage.removeItem('onboarding-days');
      
      // Marcar onboarding como completo
      localStorage.setItem('onboarding-complete', 'true');
      
      navigate('/home');
    } catch (err) {
      console.error('Erro ao salvar dados do onboarding:', err);
      setError('Erro ao salvar seus dados. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#4f6c25] relative size-full" data-name="onboarding - 5">
      {loading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-white text-[20px] font-['Alexandria:Regular',_sans-serif] mb-4">
            Salvando seus dados...
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      ) : error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
          <div className="text-white text-[18px] font-['Alexandria:Regular',_sans-serif] mb-4 text-center">
            {error}
          </div>
          <button
            onClick={handleStart}
            className="bg-white px-8 py-4 rounded-full text-[#4f6c25] font-['Alexandria:Medium',_sans-serif]"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <>
          <Frame106 onClick={handleStart} text="Começar" />
          <div className="absolute font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] left-[195px] text-[24px] text-center text-nowrap text-white top-[393px] translate-x-[-50%] whitespace-pre">
            <p className="mb-0">Agora você ja está pronto</p>
            <p>{` para começar!`}</p>
          </div>
        </>
      )}
    </div>
  );
}
