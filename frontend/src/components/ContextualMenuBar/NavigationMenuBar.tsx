import { Home, Calendar, Dumbbell, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavigationMenuBarProps {
  currentPage: string;
  onNavigate: (page: 'home' | 'streak' | 'treino') => void;
}

export function NavigationMenuBar({ currentPage, onNavigate }: NavigationMenuBarProps) {
  const { user, logout } = useAuth();
  
  const isActive = (page: string) => {
    if (page === 'home') return currentPage === 'home';
    if (page === 'streak') return currentPage === 'streak';
    if (page === 'treino') return currentPage.includes('treino');
    return false;
  };

  return (
    <div className="w-[320px] h-[40px] px-[86px] bg-[#222222] rounded-[99px] flex items-center justify-center gap-[30px]">
      <button
        onClick={() => onNavigate('home')}
        className="p-[10px] flex items-center justify-center"
        aria-label="Home"
      >
        <Home className={`w-[18px] h-[18px] ${isActive('home') ? 'text-[#AD9EE7]' : 'text-[#464646]'}`} />
      </button>

      <button
        onClick={() => onNavigate('streak')}
        className="p-[10px] flex items-center justify-center"
        aria-label="Streak"
      >
        <Calendar className={`w-[16px] h-[18px] ${isActive('streak') ? 'text-[#AD9EE7]' : 'text-[#464646]'}`} />
      </button>

      <button
        onClick={() => onNavigate('treino')}
        className="w-[43px] p-[10px] flex items-center justify-center"
        aria-label="Treino"
      >
        <Dumbbell className={`w-[23px] h-[14px] ${isActive('treino') ? 'text-[#AD9EE7]' : 'text-[#464646]'}`} />
      </button>

      <button
        onClick={logout}
        className="p-[10px] flex items-center justify-center"
        aria-label="Sair"
        title={`Sair (${user?.name})`}
      >
        <User className="w-[18px] h-[18px] text-[#464646]" />
      </button>
    </div>
  );
}

