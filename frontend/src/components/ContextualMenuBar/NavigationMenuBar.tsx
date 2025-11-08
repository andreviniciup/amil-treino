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
    <div className="w-[360px] h-[56px] px-[90px] bg-[#222222] rounded-[99px] flex items-center justify-center gap-[35px]">
      <button
        onClick={() => onNavigate('home')}
        className="p-[12px] flex items-center justify-center"
        aria-label="Home"
      >
        <Home className={`w-[22px] h-[22px] ${isActive('home') ? 'text-[#AD9EE7]' : 'text-[#464646]'}`} />
      </button>

      <button
        onClick={() => onNavigate('streak')}
        className="p-[12px] flex items-center justify-center"
        aria-label="Streak"
      >
        <Calendar className={`w-[20px] h-[22px] ${isActive('streak') ? 'text-[#AD9EE7]' : 'text-[#464646]'}`} />
      </button>

      <button
        onClick={() => onNavigate('treino')}
        className="w-[50px] p-[12px] flex items-center justify-center"
        aria-label="Treino"
      >
        <Dumbbell className={`w-[28px] h-[18px] ${isActive('treino') ? 'text-[#AD9EE7]' : 'text-[#464646]'}`} />
      </button>

      <button
        onClick={logout}
        className="p-[12px] flex items-center justify-center"
        aria-label="Sair"
        title={`Sair (${user?.name})`}
      >
        <User className="w-[22px] h-[22px] text-[#464646]" />
      </button>
    </div>
  );
}

