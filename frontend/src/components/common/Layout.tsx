import React from 'react';

interface CenteredLayoutProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
  noPadding?: boolean;
  bgColor?: string;
}

/**
 * Layout centralizado para todas as páginas
 * Garante que o conteúdo sempre fique no centro e 100% responsivo
 */
export const CenteredLayout: React.FC<CenteredLayoutProps> = ({ 
  children, 
  maxWidth = 'md',
  className = '',
  noPadding = false,
  bgColor = ''
}) => {
  const maxWidthClasses = {
    xs: 'max-w-xs',   // 320px - muito pequeno, ideal para modais
    sm: 'max-w-sm',   // 384px - mobile pequeno
    md: 'max-w-md',   // 448px - mobile padrão
    lg: 'max-w-lg',   // 512px - mobile grande/tablet pequeno
    xl: 'max-w-xl',   // 576px - tablet
    '2xl': 'max-w-2xl', // 672px - tablet grande
    full: 'max-w-full'
  };

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-start ${bgColor} ${className}`}>
      <div className={`
        w-full 
        ${maxWidthClasses[maxWidth]} 
        ${!noPadding ? 'px-4 sm:px-6 py-4 sm:py-6' : ''} 
        flex flex-col items-center
      `}>
        {children}
      </div>
    </div>
  );
};

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  bgColor?: string;
  centerContent?: boolean;
}

/**
 * Container de página com título e subtítulo
 * SEMPRE centralizado e responsivo
 */
export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  title,
  subtitle,
  maxWidth = 'md',
  className = '',
  showBackButton = false,
  onBack,
  bgColor = 'bg-gray-50',
  centerContent = false
}) => {
  return (
    <CenteredLayout maxWidth={maxWidth} className={className} bgColor={bgColor}>
      <div className="w-full">
        {(title || showBackButton) && (
          <div className="mb-6 w-full">
            {showBackButton && (
              <button
                onClick={onBack}
                className="mb-4 flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
              >
                <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Voltar
              </button>
            )}
            
            {title && (
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-center px-2">
                {title}
              </h1>
            )}
            
            {subtitle && (
              <p className="text-sm sm:text-base text-gray-600 text-center px-4">
                {subtitle}
              </p>
            )}
          </div>
        )}
        
        <div className={`w-full ${centerContent ? 'flex flex-col items-center' : ''}`}>
          {children}
        </div>
      </div>
    </CenteredLayout>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

/**
 * Card padronizado para conteúdo
 * 100% responsivo com padding adaptativo
 */
export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  onClick,
  hover = false
}) => {
  const hoverClass = hover ? 'hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer' : '';
  
  return (
    <div 
      className={`
        bg-white 
        rounded-xl sm:rounded-2xl 
        shadow-md 
        p-4 sm:p-5 md:p-6 
        w-full
        ${hoverClass} 
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface SectionProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

/**
 * Seção de conteúdo com título opcional
 */
export const Section: React.FC<SectionProps> = ({ 
  children, 
  title,
  className = '' 
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      {title && (
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * Botão padronizado
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = '',
  type = 'button'
}) => {
  const baseClasses = 'font-semibold rounded-xl transition-all duration-200 flex items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-md',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-md'
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClass} ${className}`}
    >
      {children}
    </button>
  );
};
