import { memo, useCallback, useMemo } from 'react';
import { Home, Calendar, Dumbbell, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavigationMenuBarProps {
  currentPage: string;
  onNavigate: (page: 'home' | 'streak' | 'treino') => void;
}

export const NavigationMenuBar = memo(function NavigationMenuBar({ currentPage, onNavigate }: NavigationMenuBarProps) {
  const { user, logout } = useAuth();
  
  const isActive = useCallback((page: string) => {
    if (page === 'home') return currentPage === 'home';
    if (page === 'streak') return currentPage === 'streak';
    if (page === 'treino') return currentPage.includes('treino');
    return false;
  }, [currentPage]);
  
  const homeActive = useMemo(() => isActive('home'), [isActive]);
  const streakActive = useMemo(() => isActive('streak'), [isActive]);
  const treinoActive = useMemo(() => isActive('treino'), [isActive]);
  
  const handleHomeClick = useCallback(() => onNavigate('home'), [onNavigate]);
  const handleStreakClick = useCallback(() => onNavigate('streak'), [onNavigate]);
  const handleTreinoClick = useCallback(() => onNavigate('treino'), [onNavigate]);

  return (
    <div className="w-[360px] h-[56px] px-[90px] bg-[#222222] rounded-[99px] flex items-center justify-center gap-[35px]">
      <button
        onClick={handleHomeClick}
        className="p-[12px] flex items-center justify-center"
        aria-label="Home"
      >
        <Home className={`w-[22px] h-[22px] ${homeActive ? 'text-[#AD9EE7]' : 'text-[#464646]'}`} />
      </button>

      <button
        onClick={handleStreakClick}
        className="p-[12px] flex items-center justify-center"
        aria-label="Streak"
      >
        <Calendar className={`w-[20px] h-[22px] ${streakActive ? 'text-[#AD9EE7]' : 'text-[#464646]'}`} />
      </button>

      <button
        onClick={handleTreinoClick}
        className="w-[50px] p-[12px] flex items-center justify-center"
        aria-label="Treino"
      >
        <Dumbbell className={`w-[28px] h-[18px] ${treinoActive ? 'text-[#AD9EE7]' : 'text-[#464646]'}`} />
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
});

