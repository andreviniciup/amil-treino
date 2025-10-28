import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function CreateWorkoutName() {
  const navigate = useNavigate();
  const [nomeTreino, setNomeTreino] = useState('');

  const handleNext = () => {
    if (nomeTreino.trim()) {
      localStorage.setItem('workout-name', nomeTreino);
      navigate('/workout/create/muscles');
    }
  };

  return (
    <div className="bg-[#202020] fixed inset-0 overflow-hidden flex items-center justify-center" data-name="criar-treino-02">
      <div className="relative w-full max-w-[393px] h-full flex flex-col px-5 py-6">
        
        {/* Área que centraliza o conteúdo verticalmente */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full space-y-6">
            {/* Título */}
            <p className="font-alexandria font-normal text-[24px] text-white text-left">
              nome do treino
            </p>
            
            {/* Input */}
            <input
              type="text"
              value={nomeTreino}
              onChange={(e) => setNomeTreino(e.target.value)}
              placeholder="Digite o nome do treino"
              className="bg-[rgba(61,61,61,0.5)] h-[45px] rounded-[999px] w-full px-[20px] text-white outline-none focus:bg-[rgba(61,61,61,0.7)] transition-colors placeholder:text-gray-400"
            />
          </div>
        </div>
        
        {/* Botão fixo na parte inferior com margem */}
        <div className="w-full pt-5 pb-3">
          <button
            onClick={handleNext}
            className="bg-[#1c1c1c] hover:bg-[#2c2c2c] active:scale-95 flex items-center justify-center h-[48px] sm:h-[50px] rounded-[999px] w-full cursor-pointer transition-all"
          >
            <p className="font-alexandria font-medium text-[18px] sm:text-[20px] text-white">Avançar</p>
          </button>
        </div>
      </div>
    </div>
  );
}

