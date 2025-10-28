import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function OnboardingPersonalInfoPage() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [genero, setGenero] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');

  const handleNext = () => {
    if (nome && idade && genero && peso && altura) {
      localStorage.setItem('onboarding-personal', JSON.stringify({ nome, idade, genero, peso, altura }));
      navigate('/onboarding/goal');
    }
  };

  return (
    <div className="bg-[#4f6c25] relative w-full h-screen overflow-hidden flex items-center justify-center" data-name="onboarding - 01">
      <div className="relative w-full max-w-[393px] h-full flex flex-col justify-between px-5 py-8">
        
        {/* Espaçador superior */}
        <div className="flex-1" />
        
        {/* Conteúdo central */}
        <div className="w-full space-y-6">
          {/* Título */}
          <p className="font-alexandria font-medium text-[20px] text-white text-center">
            Antes de começar, me fale rapidinho algumas informações:
          </p>
          
          {/* Inputs */}
          <div className="w-full space-y-4">
            {/* Nome */}
            <div className="flex flex-col gap-[5px]">
              <label className="font-alexandria font-normal text-[16px] text-white">nome</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="bg-[rgba(0,0,0,0.2)] h-[45px] rounded-[999px] w-full px-[20px] text-white placeholder-white/60 outline-none focus:bg-[rgba(0,0,0,0.3)] transition-colors"
              />
            </div>
            
            {/* Idade e Gênero */}
            <div className="flex gap-3">
              <div className="flex flex-col gap-[5px] flex-1">
                <label className="font-alexandria font-normal text-[16px] text-white">idade</label>
                <input
                  type="number"
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                  className="bg-[rgba(0,0,0,0.2)] h-[45px] rounded-[999px] w-full px-[20px] text-white placeholder-white/60 outline-none focus:bg-[rgba(0,0,0,0.3)] transition-colors"
                />
              </div>
              
              <div className="flex flex-col gap-[5px] flex-1">
                <label className="font-alexandria font-normal text-[16px] text-white">gênero</label>
                <select
                  value={genero}
                  onChange={(e) => setGenero(e.target.value)}
                  className="bg-[rgba(0,0,0,0.2)] h-[45px] rounded-[999px] w-full px-[20px] text-white outline-none focus:bg-[rgba(0,0,0,0.3)] transition-colors appearance-none"
                >
                  <option value="">Selecione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                  <option value="Prefiro não informar">Prefiro não informar</option>
                </select>
              </div>
            </div>
            
            {/* Peso e Altura */}
            <div className="flex gap-3">
              <div className="flex flex-col gap-[5px] flex-1">
                <label className="font-alexandria font-normal text-[16px] text-white">peso (kg)</label>
                <input
                  type="number"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  className="bg-[rgba(0,0,0,0.2)] h-[45px] rounded-[999px] w-full px-[20px] text-white placeholder-white/60 outline-none focus:bg-[rgba(0,0,0,0.3)] transition-colors"
                />
              </div>
              
              <div className="flex flex-col gap-[5px] flex-1">
                <label className="font-alexandria font-normal text-[16px] text-white">altura (cm)</label>
                <input
                  type="number"
                  value={altura}
                  onChange={(e) => setAltura(e.target.value)}
                  className="bg-[rgba(0,0,0,0.2)] h-[45px] rounded-[999px] w-full px-[20px] text-white placeholder-white/60 outline-none focus:bg-[rgba(0,0,0,0.3)] transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Espaçador antes do botão */}
        <div className="h-8" />
        
        {/* Botão fixo na parte inferior */}
        <div className="w-full pb-4">
          <button
            onClick={handleNext}
            className="bg-[#1c1c1c] hover:bg-[#2c2c2c] active:scale-95 flex items-center justify-center h-[50px] rounded-[999px] w-full cursor-pointer transition-all"
          >
            <p className="font-alexandria font-medium text-[20px] text-white">Avançar</p>
          </button>
        </div>
      </div>
    </div>
  );
}
