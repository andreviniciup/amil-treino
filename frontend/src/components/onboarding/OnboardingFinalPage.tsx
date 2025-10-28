import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

      // NÃO limpar dados do onboarding - são necessários para criar treinos
      // Apenas marcar como completo
      localStorage.setItem('onboarding-complete', 'true');
      
      navigate('/home');
    } catch (err) {
      console.error('Erro ao salvar dados do onboarding:', err);
      setError('Erro ao salvar seus dados. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#4f6c25] relative w-full h-screen overflow-hidden flex items-center justify-center" data-name="onboarding - 5">
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          <div className="text-white text-[20px] font-alexandria font-normal mb-4">
            Salvando seus dados...
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center px-8">
          <div className="text-white text-[18px] font-alexandria font-normal mb-4 text-center">
            {error}
          </div>
          <button
            onClick={handleStart}
            className="bg-white px-8 py-4 rounded-full text-[#4f6c25] font-alexandria font-medium"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <div className="relative w-full max-w-[393px] h-full flex flex-col px-5 py-8">
          
          {/* Área que centraliza o conteúdo verticalmente */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full text-center space-y-2">
              <p className="font-alexandria font-normal text-[24px] text-white">
                Agora você já está pronto
              </p>
              <p className="font-alexandria font-normal text-[24px] text-white">
                para começar!
              </p>
            </div>
          </div>
          
          {/* Botão fixo na parte inferior com margem */}
          <div className="w-full pt-6 pb-4">
            <button
              onClick={handleStart}
              className="bg-[#1c1c1c] hover:bg-[#2c2c2c] active:scale-95 flex items-center justify-center h-[50px] rounded-[999px] w-full cursor-pointer transition-all"
            >
              <p className="font-alexandria font-medium text-[20px] text-white">Começar</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
