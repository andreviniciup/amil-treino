import React from 'react';
import { useNavigate } from 'react-router-dom';

export function CreateWorkoutIntro() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/workout/create/type');
  };

  return (
    <div className="bg-[#202020] relative w-full h-screen overflow-hidden flex items-center justify-center" data-name="criar-treino-01">
      <div className="relative w-full max-w-[393px] h-full flex flex-col px-5 py-8">
        
        {/* Área que centraliza o conteúdo verticalmente */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full">
            <p className="font-alexandria font-medium text-[20px] text-white leading-normal">
              Vamos começar criar um treino!
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
    </div>
  );
}

