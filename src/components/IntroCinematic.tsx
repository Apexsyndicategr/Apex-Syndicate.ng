import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Shield, Cpu, Zap, Lock } from 'lucide-react';

export const IntroCinematic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const [phase, setPhase] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFinish = () => {
    setIsPlaying(false);
  };

  useEffect(() => {
    if (!isPlaying) return;

    // Timeline control for cinematic intro phases
    const t1 = setTimeout(() => setPhase(1), 700);   // Ignition / Core Lock
    const t2 = setTimeout(() => setPhase(2), 1800);  // Title & URL Reveal
    const t3 = setTimeout(() => setPhase(3), 4800);  // Final Burst Transition
    const t4 = setTimeout(() => handleFinish(), 5500); // Complete & Fade Out

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isPlaying]);

  // HTML5 Canvas Cyber Background Animation (Shockwaves, Particle Grid, Scanning Laser)
  useEffect(() => {
    if (!isPlaying) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle system setup
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
    }> = [];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 2.5 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,
        color: Math.random() > 0.3 ? '#FF6321' : '#00E5FF',
      });
    }

    let scanY = 0;

    const render = () => {
      ctx.fillStyle = 'rgba(3, 3, 5, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // Render Cyber Grid Lines
      ctx.strokeStyle = 'rgba(255, 99, 33, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 60;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Render Floating Energy Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render Laser Scanning Beam Across Canvas
      scanY += 3;
      if (scanY > height) scanY = 0;

      const grad = ctx.createLinearGradient(0, scanY - 10, 0, scanY + 10);
      grad.addColorStop(0, 'rgba(255, 99, 33, 0)');
      grad.addColorStop(0.5, 'rgba(255, 99, 33, 0.3)');
      grad.addColorStop(1, 'rgba(255, 99, 33, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 10, width, 20);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  if (!isPlaying) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === 3 ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className="fixed inset-0 z-[999999] bg-[#020204] text-white flex flex-col items-center justify-center overflow-hidden font-sans select-none"
      >
        {/* Canvas Background Grid & Particles */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        {/* Ambient Radial Core Light Ray Flares */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,99,33,0.22)_0%,transparent_70%)] pointer-events-none animate-pulse" />

        {/* Top & Bottom Cyber Letterbox Borders */}
        <div className="absolute top-0 left-0 right-0 h-14 bg-black/90 border-b border-[#FF6321]/30 flex items-center justify-between px-8 text-[11px] font-mono text-gray-400 z-20">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#FF6321] animate-ping" />
            <span className="font-bold text-[#FF6321] tracking-widest uppercase">APEX SYNDICATE NETWORK</span>
            <span className="hidden sm:inline text-gray-600">// SYSTEM_CLASSIFIED_v3.8</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-gray-500 font-mono">ENCRYPTION: 4096-BIT RSA</span>
            <button
              onClick={handleFinish}
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-[#FF6321] text-gray-300 hover:text-black font-extrabold uppercase tracking-wider text-[10px] transition-all cursor-pointer border border-white/20"
            >
              SKIP INTRO [ESC]
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-12 bg-black/90 border-t border-[#FF6321]/30 flex items-center justify-between px-8 text-[10px] font-mono text-gray-500 z-20">
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-[#FF6321]" />
            <span>STATUS: CORE_SYSTEM_INITIALIZED</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400">OFFICIAL DISTRIBUTION PORTAL</span>
          </div>
        </div>

        {/* CENTER CINEMATIC STAGE */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl w-full">
          
          {/* PHASE 0: CROSSHAIR LOCK & BOOT TELEMETRY */}
          {phase === 0 && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-dashed border-[#FF6321] rounded-full animate-spin" style={{ animationDuration: '6s' }} />
                <div className="absolute inset-2 border border-[#00E5FF] rounded-full animate-ping" />
                <Zap className="w-10 h-10 text-[#FF6321] animate-bounce" />
              </div>
              <div className="font-mono text-xs font-bold tracking-[0.3em] text-[#FF6321] uppercase animate-pulse">
                [ INITIALIZING SYNDICATE INFRASTRUCTURE ]
              </div>
            </motion.div>
          )}

          {/* PHASE 1 & 2: LOGO EXPLOSION + TITLES + NON-INTERACTABLE URL HUD */}
          {phase >= 1 && (
            <div className="flex flex-col items-center gap-6">
              
              {/* Giant Glowing Apex Shield Delta Mark */}
              <motion.div
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 120, damping: 15 }}
                className="relative"
              >
                {/* Shockwave Rings */}
                <div className="absolute -inset-10 rounded-full bg-gradient-to-r from-[#FF6321] via-orange-500 to-[#00E5FF] opacity-30 blur-2xl animate-pulse" />
                
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-[#FF6321] to-[#9E3400] flex items-center justify-center p-0.5 shadow-[0_0_80px_rgba(255,99,33,0.7)] border-2 border-white/30 relative z-10">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-3/4 h-3/4 drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M50 12 L82 78 L66 78 L50 48 L34 78 L18 78 Z"
                      fill="#FFFFFF"
                    />
                    <polygon
                      points="50,26 62,56 38,56"
                      fill="#9E3400"
                    />
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
              </motion.div>

              {/* PHASE 2: BROUGHT TO YOU BY + APEX SYNDICATE + DISPLAY URL */}
              {phase >= 2 && (
                <div className="space-y-4 max-w-2xl">
                  {/* Eyebrow intro header */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#FF6321]" />
                    <span className="text-xs sm:text-sm font-extrabold tracking-[0.4em] text-[#FF6321] uppercase font-mono">
                      BROUGHT TO YOU BY
                    </span>
                    <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#FF6321]" />
                  </motion.div>

                  {/* High-Impact Main Brand Title */}
                  <motion.h1
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.25 }}
                    className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-wider font-sans text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-100 to-[#FF6321] drop-shadow-[0_10px_30px_rgba(255,99,33,0.5)]"
                  >
                    APEX <span className="text-[#FF6321] text-shadow-glow">SYNDICATE</span>
                  </motion.h1>

                  {/* NON-INTERACTABLE OFFICIAL URL HUD DISPLAY BOX */}
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.45 }}
                    className="pt-2 flex flex-col items-center justify-center gap-2"
                  >
                    <div className="relative inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-black/80 border-2 border-[#FF6321]/60 shadow-[0_0_35px_rgba(255,99,33,0.35)] backdrop-blur-2xl pointer-events-none select-none">
                      {/* Corner Accents */}
                      <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#FF6321]" />
                      <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#FF6321]" />
                      <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#FF6321]" />
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#FF6321]" />

                      <Shield className="w-4 h-4 text-[#FF6321] shrink-0" />

                      <div className="flex flex-col items-center">
                        <span className="text-[9px] font-mono font-bold tracking-[0.25em] text-gray-400 uppercase">
                          OFFICIAL WEB ADDRESS
                        </span>
                        <span className="text-base sm:text-xl font-black font-mono tracking-[0.15em] text-white underline decoration-[#FF6321]/60 decoration-2 underline-offset-4">
                          apexsyndicate.com.ng
                        </span>
                      </div>

                      <Sparkles className="w-4 h-4 text-[#FF6321] shrink-0 animate-spin" style={{ animationDuration: '5s' }} />
                    </div>

                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest pt-1">
                      [ AUTHORIZED DIGITAL PRODUCTS & SOFTWARE RELEASE HUB ]
                    </p>
                  </motion.div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
