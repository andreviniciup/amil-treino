import React from 'react';
import { Stack } from '../common/ResponsiveHelpers';

// Background gradiente com blur
function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Gradiente base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#28819F] via-[#181818] to-[#181818]" />
      
      {/* Ellipses com blur */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#FDCB1A] rounded-full blur-[150px] opacity-40 animate-pulse" />
      <div className="absolute top-[30%] left-[-15%] w-[600px] h-[600px] bg-[#43690F] rounded-full blur-[150px] opacity-30" />
      <div className="absolute bottom-[-20%] left-[10%] w-[400px] h-[800px] bg-[#CF9EE7] rounded-full blur-[150px] opacity-35 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-[10%] left-[-20%] w-[500px] h-[900px] bg-[#28819F] rounded-full blur-[150px] opacity-40" />
      
      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" 
           style={{ 
             backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'2\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
             backgroundRepeat: 'repeat'
           }} 
      />
    </div>
  );
}

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
}

export function LandingPage({ onLogin, onRegister }: LandingPageProps) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background animado */}
      <AnimatedBackground />
      
      {/* Conteúdo centralizado */}
      <div className="relative z-10 w-full max-w-md px-6 sm:px-8">
        <Stack spacing={6} align="center">
          {/* Texto descritivo */}
          <div className="text-center space-y-3">
            <p className="text-white text-base sm:text-lg font-medium leading-relaxed px-4">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            </p>
          </div>
          
          {/* Botões */}
          <div className="w-full space-y-4 px-4">
            <button
              onClick={onRegister}
              className="w-full bg-white/20 backdrop-blur-md hover:bg-white/30 active:scale-[0.98] 
                         text-white font-semibold text-lg sm:text-xl
                         py-3.5 sm:py-4 px-6 rounded-full
                         transition-all duration-200 shadow-lg hover:shadow-xl
                         border border-white/20"
            >
              criar conta
            </button>
            
            <button
              onClick={onLogin}
              className="w-full bg-white/20 backdrop-blur-md hover:bg-white/30 active:scale-[0.98]
                         text-white font-semibold text-lg sm:text-xl
                         py-3.5 sm:py-4 px-6 rounded-full
                         transition-all duration-200 shadow-lg hover:shadow-xl
                         border border-white/20"
            >
              entrar
            </button>
          </div>
        </Stack>
      </div>
    </div>
  );
}

