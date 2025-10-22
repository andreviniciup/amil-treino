import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Frame106 } from '../common/Frame106';
import { InputFormsOverboarding } from '../common/InputFormsOverboarding';
import { SelectFormsOverboarding } from '../common/SelectFormsOverboarding';

function Frame133() {
  return (
    <div className="absolute box-border content-stretch flex gap-[10px] items-center justify-center left-[11px] p-[10px] top-[216px] w-[370px]">
      <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[20px] text-white w-[350px]">Antes de começar, me fale rapidinho algumas informações:</p>
    </div>
  );
}

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
    <div className="bg-[#4f6c25] relative size-full" data-name="onboarding - 01">
      <Frame106 onClick={handleNext} text="Avançar" />
      <Frame133 />
      <InputFormsOverboarding 
        label="nome" 
        value={nome}
        onChange={setNome}
        top="286px"
        left="19px"
        width="354px"
      />
      <InputFormsOverboarding 
        label="idade" 
        value={idade}
        onChange={setIdade}
        type="number"
        top="365px"
        left="19px"
        width="165px"
      />
      <SelectFormsOverboarding 
        label="gênero" 
        value={genero}
        onChange={setGenero}
        options={['Masculino', 'Feminino', 'Outro', 'Prefiro não informar']}
        top="365px"
        left="calc(60% - 12px)"
        width="147px"
      />
      <InputFormsOverboarding 
        label="peso" 
        value={peso}
        onChange={setPeso}
        type="number"
        top="444px"
        left="20px"
        width="165px"
      />
      <InputFormsOverboarding 
        label="altura" 
        value={altura}
        onChange={setAltura}
        type="number"
        top="444px"
        left="calc(60% - 12px)"
        width="147px"
      />
    </div>
  );
}
