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
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Official Apex Syndicate Vibrant Orange Shield Icon */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        {/* Soft Ambient Glow Ring */}
        <div className="absolute inset-0 bg-[#FF6321] rounded-2xl blur-lg opacity-40 animate-pulse" />
        
        <div className="relative w-full h-full bg-gradient-to-br from-[#FF6321] to-[#D14D00] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,99,33,0.35)] border border-white/20">
          <svg
            viewBox="0 0 100 100"
            className="w-3/5 h-3/5 drop-shadow-md"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Apex Geometric 'A' Delta Mark */}
            <path
              d="M50 12 L82 78 L66 78 L50 48 L34 78 L18 78 Z"
              fill="#FFFFFF"
            />
            {/* Inner Core Cyber Cut */}
            <polygon
              points="50,26 62,56 38,56"
              fill="#D14D00"
            />
            {/* Syndicate Bar */}
            <rect
              x="28"
              y="66"
              width="44"
              height="6"
              rx="3"
              fill="#FFFFFF"
            />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className={`font-black tracking-tight uppercase font-sans text-white ${textSizes[size]}`}>
            APEX <span className="text-[#FF6321]">SYNDICATE</span>
          </div>
          <span className="text-[9px] tracking-[0.25em] text-[#FF6321]/80 uppercase font-bold mt-1 font-mono">
            apexsyndicate.com.ng
          </span>
        </div>
      )}
    </div>
  );
};
