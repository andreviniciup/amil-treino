import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  onClick?: () => void;
  className?: string;
}

export function BackButton({ onClick, className = '' }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`absolute top-[20px] left-[20px] z-50 w-[40px] h-[40px] rounded-full bg-[#202020] flex items-center justify-center hover:bg-[#2a2a2a] transition-colors ${className}`}
      aria-label="Voltar"
    >
      <ArrowLeft className="w-5 h-5 text-white" />
    </button>
  );
}

