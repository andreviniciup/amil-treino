import React from 'react';

/**
 * Container responsivo geral
 * Use este componente para envolver QUALQUER conteúdo que precise ser centralizado
 */

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    xs: 'max-w-xs',     // 320px
    sm: 'max-w-sm',     // 384px
    md: 'max-w-md',     // 448px
    lg: 'max-w-lg',     // 512px
    xl: 'max-w-xl',     // 576px
    '2xl': 'max-w-2xl', // 672px
    '3xl': 'max-w-3xl', // 768px
    full: 'max-w-full'
  };

  return (
    <div className={`w-full ${sizeClasses[size]} mx-auto px-4 sm:px-6 ${className}`}>
      {children}
    </div>
  );
};

/**
 * Wrapper de página full-screen centralizado
 */
interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  center?: boolean;
  bgColor?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  className = '',
  center = false,
  bgColor = 'bg-gray-50'
}) => {
  const centerClass = center ? 'items-center justify-center' : 'items-start justify-start';
  
  return (
    <div className={`
      min-h-screen 
      w-full 
      flex 
      flex-col 
      ${centerClass}
      ${bgColor}
      ${className}
      overflow-x-hidden
    `}>
      {children}
    </div>
  );
};

/**
 * Grid responsivo para cards
 */
interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 2 | 3 | 4 | 5 | 6 | 8;
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  cols = { default: 1, sm: 2, lg: 3 },
  gap = 4,
  className = ''
}) => {
  const colClasses = `
    grid-cols-${cols.default || 1}
    ${cols.sm ? `sm:grid-cols-${cols.sm}` : ''}
    ${cols.md ? `md:grid-cols-${cols.md}` : ''}
    ${cols.lg ? `lg:grid-cols-${cols.lg}` : ''}
    ${cols.xl ? `xl:grid-cols-${cols.xl}` : ''}
  `;

  return (
    <div className={`
      grid 
      ${colClasses}
      gap-${gap}
      w-full
      ${className}
    `}>
      {children}
    </div>
  );
};

/**
 * Stack vertical com espaçamento responsivo
 */
interface StackProps {
  children: React.ReactNode;
  spacing?: 2 | 3 | 4 | 5 | 6 | 8;
  className?: string;
  align?: 'start' | 'center' | 'end' | 'stretch';
}

export const Stack: React.FC<StackProps> = ({
  children,
  spacing = 4,
  className = '',
  align = 'stretch'
}) => {
  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  return (
    <div className={`
      flex 
      flex-col 
      space-y-${spacing}
      ${alignClasses[align]}
      w-full
      ${className}
    `}>
      {children}
    </div>
  );
};

/**
 * Flexbox horizontal responsivo
 */
interface FlexProps {
  children: React.ReactNode;
  gap?: 2 | 3 | 4 | 5 | 6 | 8;
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  align?: 'start' | 'center' | 'end' | 'stretch';
  wrap?: boolean;
  className?: string;
}

export const Flex: React.FC<FlexProps> = ({
  children,
  gap = 4,
  justify = 'start',
  align = 'center',
  wrap = false,
  className = ''
}) => {
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  return (
    <div className={`
      flex 
      ${wrap ? 'flex-wrap' : 'flex-nowrap'}
      gap-${gap}
      ${justifyClasses[justify]}
      ${alignClasses[align]}
      w-full
      ${className}
    `}>
      {children}
    </div>
  );
};

/**
 * Spacer para adicionar espaço entre elementos
 */
interface SpacerProps {
  size?: 2 | 4 | 6 | 8 | 12 | 16 | 20;
  axis?: 'vertical' | 'horizontal' | 'both';
}

export const Spacer: React.FC<SpacerProps> = ({
  size = 4,
  axis = 'vertical'
}) => {
  if (axis === 'vertical') {
    return <div className={`h-${size} w-full`}></div>;
  }
  
  if (axis === 'horizontal') {
    return <div className={`w-${size} h-full`}></div>;
  }
  
  return <div className={`h-${size} w-${size}`}></div>;
};
