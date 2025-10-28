import React from 'react';

function MaskGroup() {
  return (
    <div className="absolute w-full h-full left-0 top-0" data-name="Mask group">
      <svg className="block w-full h-full" fill="none" preserveAspectRatio="xMidYMid slice" viewBox="0 0 393 886">
        <g filter="url(#filter0_n_4_47)" id="Mask group">
          <mask height="886" id="mask0_4_47" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="393" x="0" y="0">
            <rect fill="var(--fill-0, #D9D9D9)" height="886" id="Rectangle 1" width="393" />
          </mask>
          <g mask="url(#mask0_4_47)">
            <g filter="url(#filter1_f_4_47)" id="Ellipse 2">
              <ellipse cx="334" cy="19.5" fill="var(--fill-0, #FDCB1A)" rx="220" ry="517.5" />
            </g>
            <g filter="url(#filter2_f_4_47)" id="Ellipse 3">
              <ellipse cx="248.329" cy="358.287" fill="var(--fill-0, #43690F)" rx="248.329" ry="358.287" transform="matrix(0.930149 -0.367183 0.0245675 0.999698 86.8383 487.951)" />
            </g>
            <g filter="url(#filter3_f_4_47)" id="Ellipse 4">
              <ellipse cx="62.6344" cy="902.407" fill="var(--fill-0, #CF9EE7)" rx="127.725" ry="511.911" />
            </g>
            <g filter="url(#filter4_f_4_47)" id="Ellipse 1">
              <ellipse cx="51" cy="170" fill="var(--fill-0, #28819F)" rx="206" ry="476" />
            </g>
          </g>
        </g>
        <defs>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="886" id="filter0_n_4_47" width="393" x="0" y="0">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feTurbulence baseFrequency="2 2" numOctaves="3" result="noise" seed="6795" stitchTiles="stitch" type="fractalNoise" />
            <feColorMatrix in="noise" result="alphaNoise" type="luminanceToAlpha" />
            <feComponentTransfer in="alphaNoise" result="coloredNoise1">
              <feFuncA tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 " type="discrete" />
            </feComponentTransfer>
            <feComposite in="coloredNoise1" in2="shape" operator="in" result="noise1Clipped" />
            <feFlood floodColor="rgba(0, 0, 0, 0.25)" result="color1Flood" />
            <feComposite in="color1Flood" in2="noise1Clipped" operator="in" result="color1" />
            <feMerge result="effect1_noise_4_47">
              <feMergeNode in="shape" />
              <feMergeNode in="color1" />
            </feMerge>
          </filter>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="1335" id="filter1_f_4_47" width="740" x="-36" y="-648">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feGaussianBlur result="effect1_foregroundBlur_4_47" stdDeviation="75" />
          </filter>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="1039.38" id="filter2_f_4_47" width="762.308" x="-54.5304" y="235.256">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feGaussianBlur result="effect1_foregroundBlur_4_47" stdDeviation="75" />
          </filter>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="1323.82" id="filter3_f_4_47" width="555.45" x="-215.091" y="240.496">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feGaussianBlur result="effect1_foregroundBlur_4_47" stdDeviation="75" />
          </filter>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="1252" id="filter4_f_4_47" width="712" x="-305" y="-456">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feGaussianBlur result="effect1_foregroundBlur_4_47" stdDeviation="75" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

interface Frame108Props {
  onClick: () => void;
}

function Frame108({ onClick }: Frame108Props) {
  const handleClick = () => {
    // Animação de expansão
    const button = document.getElementById('btn-entrar');
    if (button) {
      button.classList.add('animate-expand-exit');
      setTimeout(() => onClick(), 600);
    }
  };

  return (
    <button 
      id="btn-entrar"
      onClick={handleClick}
      className="absolute bg-[rgba(187,187,187,0.73)] hover:bg-[rgba(187,187,187,0.85)] 
                 box-border content-stretch flex gap-[10px] h-[50px] items-center justify-center 
                 left-1/2 -translate-x-1/2 px-[129px] py-[13px] rounded-[999px] bottom-[150px] w-[353px] max-w-[90vw]
                 cursor-pointer transition-colors"
    >
      <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[20px] text-nowrap text-white whitespace-pre">entrar</p>
    </button>
  );
}

interface Frame109Props {
  onClick: () => void;
}

function Frame109({ onClick }: Frame109Props) {
  const handleClick = () => {
    // Animação de expansão
    const button = document.getElementById('btn-criar');
    if (button) {
      button.classList.add('animate-expand-exit');
      setTimeout(() => onClick(), 600);
    }
  };

  return (
    <button 
      id="btn-criar"
      onClick={handleClick}
      className="absolute bg-[rgba(187,187,187,0.73)] hover:bg-[rgba(187,187,187,0.85)] 
                 box-border content-stretch flex gap-[10px] h-[50px] items-center justify-center 
                 left-1/2 -translate-x-1/2 px-[129px] py-[13px] rounded-[999px] bottom-[220px] w-[353px] max-w-[90vw]
                 cursor-pointer transition-colors"
    >
      <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[20px] text-nowrap text-white whitespace-pre">criar conta</p>
    </button>
  );
}

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
}

export function LandingPage({ onLogin, onRegister }: LandingPageProps) {
  return (
    <div className="bg-[#181818] relative w-full h-screen overflow-hidden flex items-center justify-center" data-name="ladingpage/inicio">
      <MaskGroup />
      
      {/* Adicionando CSS da animação inline */}
      <style>{`
        @keyframes expand-exit {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.5;
          }
          100% {
            transform: scale(10);
            opacity: 0;
          }
        }
        .animate-expand-exit {
          animation: expand-exit 0.6s ease-out forwards;
        }
      `}</style>
      
      {/* Container principal - ocupa toda a altura */}
      <div className="relative w-full max-w-[393px] h-full flex flex-col justify-between px-5 py-8 sm:py-12">
        
        {/* Espaçador superior */}
        <div className="flex-1" />
        
        {/* Texto central */}
        <div className="w-full mb-8 sm:mb-12">
          <p className="font-alexandria font-normal text-[14px] sm:text-[16px] text-left text-white leading-relaxed max-w-[280px]">
            Lorem ipsum is simply dummy text of the printing and typesetting industry.
          </p>
        </div>
        
        {/* Botões fixos na parte inferior */}
        <div className="w-full space-y-3 sm:space-y-4 pb-4 sm:pb-8">
          <button
            onClick={onRegister}
            className="bg-[#FDCB1A] hover:bg-[#e5b717] 
                       active:scale-95 box-border flex items-center justify-center 
                       h-[50px] sm:h-[56px] rounded-[999px] w-full
                       cursor-pointer transition-all"
          >
            <p className="font-alexandria font-medium text-[18px] sm:text-[20px] text-[#1c1c1c]">criar conta</p>
          </button>
          
          <button
            onClick={onLogin}
            className="bg-[#288B9F] hover:bg-[#237a8a] 
                       active:scale-95 box-border flex items-center justify-center 
                       h-[50px] sm:h-[56px] rounded-[999px] w-full
                       cursor-pointer transition-all"
          >
            <p className="font-alexandria font-medium text-[18px] sm:text-[20px] text-white">entrar</p>
          </button>
        </div>
      </div>
    </div>
  );
}

