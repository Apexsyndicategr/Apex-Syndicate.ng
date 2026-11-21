import React from 'react';

interface ApexLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const ApexLogo: React.FC<ApexLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div
        className={`relative flex items-center justify-center shrink-0 rounded-lg bg-[#FF5500] ${iconSizes[size]}`}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-3/5 h-3/5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M50 12 L82 78 L66 78 L50 48 L34 78 L18 78 Z" fill="#FFFFFF" />
          <polygon points="50,26 62,56 38,56" fill="#09090B" />
          <rect x="28" y="66" width="44" height="6" rx="2" fill="#FFFFFF" />
        </svg>
      </div>

      {showText && (
        <span
          className={`font-display font-bold tracking-tight text-white whitespace-nowrap ${textSizes[size]}`}
        >
          Apex <span className="text-[#FF5500]">Syndicate</span>
        </span>
      )}
    </div>
  );
};
