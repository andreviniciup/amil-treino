import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Frame76() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0">
      <p className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[0px] text-[10px] text-center text-neutral-200 w-[200px]">
        <span>{`Criando uma conta, você concorda com todos os nossos `}</span>
        <span className="[text-underline-position:from-font] decoration-solid underline">termos e condições</span>.
      </p>
    </div>
  );
}

function Frame77() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[11px] items-center left-[calc(20%+16px)] top-[511px]">
      <Frame76 />
    </div>
  );
}

interface Frame107Props {
  onClick: () => void;
}

function Frame107({ onClick }: Frame107Props) {
  return (
    <button 
      onClick={onClick}
      className="absolute bg-[#1c1c1c] box-border content-stretch flex gap-[10px] h-[50px] items-center justify-center left-[17px] px-[129px] py-[13px] rounded-[999px] top-[763px] w-[353px] cursor-pointer hover:bg-[#2c2c2c] transition-colors"
    >
      <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[20px] text-nowrap text-white whitespace-pre">Criar</p>
    </button>
  );
}

interface InputFormsOverboardingProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  top: string;
}

function InputFormsOverboarding({ label, value, onChange, type = "text", top }: InputFormsOverboardingProps) {
  return (
    <div className={`absolute content-stretch flex flex-col gap-[5px] items-start left-[20px] w-[354px]`} style={{ top }} data-name="input-forms-overboarding">
      <p className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[16px] text-white w-full">{label}</p>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[rgba(61,61,61,0.5)] h-[40px] rounded-[999px] shrink-0 w-full px-[20px] text-white outline-none focus:bg-[rgba(61,61,61,0.7)] transition-colors"
      />
    </div>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (email && senha && confirmarSenha) {
      if (senha === confirmarSenha) {
        try {
          setError('');
          // O nome será coletado no onboarding
          await register(email, 'User', senha);
          navigate('/onboarding/personal-info');
        } catch (error: any) {
          setError(error.response?.data?.error || 'Erro ao criar conta');
        }
      } else {
        setError('As senhas não coincidem!');
      }
    }
  };

  return (
    <div className="bg-[#288b9f] relative size-full" data-name="registro">
      <p className="absolute font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] left-[calc(20%+113.5px)] text-[32px] text-center text-nowrap text-white top-[237px] translate-x-[-50%] whitespace-pre">Crie sua conta!</p>
      <Frame77 />
      <Frame107 onClick={handleSubmit} />
      <InputFormsOverboarding 
        label="email" 
        value={email}
        onChange={setEmail}
        type="email"
        top="286px"
      />
      <InputFormsOverboarding 
        label="senha" 
        value={senha}
        onChange={setSenha}
        type="password"
        top="361px"
      />
      <InputFormsOverboarding 
        label="confirmar senha" 
        value={confirmarSenha}
        onChange={setConfirmarSenha}
        type="password"
        top="436px"
      />
      {error && (
        <div className="absolute left-[20px] top-[550px] w-[354px]">
          <p className="font-['Alexandria:Regular',_sans-serif] text-[#ff6b6b] text-[12px]">{error}</p>
        </div>
      )}
    </div>
  );
}
