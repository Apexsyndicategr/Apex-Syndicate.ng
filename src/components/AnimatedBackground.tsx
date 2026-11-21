import React from 'react';

export const AnimatedBackground: React.FC = () => {
  return (
    <div
      id="apex-animated-background-wrapper"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Subtle top-edge warm studio glow */}
      <div
        className="absolute -top-48 left-1/2 -translate-x-1/2 w-[1100px] h-[520px] rounded-full opacity-40"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(255, 85, 0, 0.14) 0%, rgba(255, 85, 0, 0.03) 45%, transparent 72%)',
        }}
      />
      {/* Faint architectural dot matrix */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  );
};
