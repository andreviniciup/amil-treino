import { Home, Calendar, Dumbbell, X, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface MenuBarProps {
  currentPage: string;
  onNavigate: (page: 'home' | 'streak' | 'treino') => void;
  isWorkoutActive?: boolean;
  workoutTime?: string;
  workoutName?: string;
  onStopWorkout?: () => void;
}

export function MenuBar({ 
  currentPage, 
  onNavigate, 
  isWorkoutActive = false,
  workoutTime = "00:00",
  workoutName = "Treino",
  onStopWorkout
}: MenuBarProps) {
  const { user, logout } = useAuth();
  
  const isActive = (page: string) => {
    if (page === 'home') return currentPage === 'home';
    if (page === 'streak') return currentPage === 'streak';
    if (page === 'treino') return currentPage.includes('treino');
    return false;
  };

  return (
    <>
      {/* Barra de Treino Ativo - No topo */}
      {isWorkoutActive && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#202020] to-[#2a2a2a] border-b border-[rgba(255,255,255,0.1)] shadow-lg">
          <div className="max-w-[393px] mx-auto px-5 py-3 flex items-center justify-between">
            {/* Info do Treino */}
            <div className="flex items-center gap-3">
              <div className="w-[36px] h-[36px] rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center animate-pulse">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <p className="font-['Alexandria:Medium',_sans-serif] text-white text-[13px] leading-tight">
                  {workoutName}
                </p>
                <p className="font-['Alexandria:Regular',_sans-serif] text-[rgba(255,255,255,0.6)] text-[11px]">
                  Em andamento
                </p>
              </div>
            </div>
            
            {/* Timer e Botão */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <p className="font-['Alexandria:Bold',_sans-serif] text-white text-[18px] leading-tight">
                  {workoutTime}
                </p>
                <p className="font-['Alexandria:Regular',_sans-serif] text-[rgba(255,255,255,0.5)] text-[10px]">
                  min
                </p>
              </div>
              
              {onStopWorkout && (
                <button
                  onClick={onStopWorkout}
                  className="w-[32px] h-[32px] rounded-full bg-[rgba(169,23,23,0.8)] hover:bg-[rgba(169,23,23,1)] flex items-center justify-center transition-colors"
                  aria-label="Stop workout"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MenuBar normal na parte inferior */}
      <div className="fixed bottom-[20px] left-1/2 -translate-x-1/2 w-[320px] max-w-[90vw] z-50">
        <div className="bg-[rgba(36,36,36,0.7)] backdrop-blur-2xl border border-[rgba(255,255,255,0.08)] h-[50px] rounded-[999px] flex items-center justify-around px-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <button
            onClick={() => onNavigate('home')}
            className={`flex items-center justify-center w-[40px] h-[40px] rounded-full transition-colors ${
              isActive('home') ? 'bg-[#d9d9d9]' : 'hover:bg-[#2c2c2c]'
            }`}
            aria-label="Home"
          >
            <Home className={`w-5 h-5 ${isActive('home') ? 'text-[#202020]' : 'text-gray-400'}`} />
          </button>

          <button
            onClick={() => onNavigate('streak')}
            className={`flex items-center justify-center w-[40px] h-[40px] rounded-full transition-colors ${
              isActive('streak') ? 'bg-[#d9d9d9]' : 'hover:bg-[#2c2c2c]'
            }`}
            aria-label="Streak"
          >
            <Calendar className={`w-5 h-5 ${isActive('streak') ? 'text-[#202020]' : 'text-gray-400'}`} />
          </button>

          <button
            onClick={() => onNavigate('treino')}
            className={`flex items-center justify-center w-[40px] h-[40px] rounded-full transition-colors ${
              isActive('treino') ? 'bg-[#d9d9d9]' : 'hover:bg-[#2c2c2c]'
            }`}
            aria-label="Treino"
          >
            <Dumbbell className={`w-5 h-5 ${isActive('treino') ? 'text-[#202020]' : 'text-gray-400'}`} />
          </button>
          
          {/* Logout button */}
          <button
            onClick={logout}
            className="flex items-center justify-center w-[40px] h-[40px] rounded-full transition-colors hover:bg-[#2c2c2c]"
            aria-label="Sair"
            title={`Sair (${user?.name})`}
          >
            <LogOut className="w-5 h-5 text-gray-400 hover:text-red-400" />
          </button>
        </div>
      </div>
    </>
  );
}
