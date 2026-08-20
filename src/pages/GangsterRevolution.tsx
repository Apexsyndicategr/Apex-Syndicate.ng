import React from 'react';
import { Product, OwnerSettings } from '../types';
import { motion } from 'motion/react';
import {
  Gamepad2,
  Download,
  Flame,
  Shield,
  Zap,
  Crosshair,
  Car,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  HardDrive,
  Cpu,
  Tv,
  Layers,
  Users,
} from 'lucide-react';

interface GangsterRevolutionProps {
  product: Product | null;
  openDownloadModal: (product: Product) => void;
  settings?: OwnerSettings;
}

export const GangsterRevolution: React.FC<GangsterRevolutionProps> = ({
  product,
  openDownloadModal,
  settings,
}) => {
  const isComingSoon = Boolean(product ? product.isComingSoon || !product.fileUrl : true);
  const launchDate = settings?.gangsterRevolutionLaunchDate || 'TBD';
  const gameStatus = settings?.gangsterRevolutionStatus || 'PRE-ALPHA BUILD • IN DEVELOPMENT';
  const specs = settings?.gangsterSpecs || {
    minOs: 'TBD',
    minProcessor: 'TBD',
    minMemory: 'TBD',
    minGraphics: 'TBD',
    minDirectX: 'TBD',
    minStorage: 'TBD',
    recOs: 'TBD',
    recProcessor: 'TBD',
    recMemory: 'TBD',
    recGraphics: 'TBD',
    recDirectX: 'TBD',
    recStorage: 'TBD',
  };

  return (
    <div className="space-y-16 pb-24 overflow-hidden">
      {/* ==========================================
          HERO BANNER & GAME REVEAL (ANIMATED)
         ========================================== */}
      <section className="relative pt-12 pb-16 overflow-hidden border-b border-white/10">
        {/* Cinematic Ambient Red Glow */}
        <div className="absolute top-0 right-1/4 w-[650px] h-[550px] bg-red-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-[130px] pointer-events-none animate-float-slow" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-gradient-to-r from-red-600/25 via-amber-600/20 to-red-600/25 border border-red-500/50 text-red-400 text-xs font-mono font-black uppercase tracking-widest shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-border-glow"
          >
            <Gamepad2 className="w-4 h-4 text-red-400 animate-bounce" style={{ animationDuration: '2s' }} />
            <span>APEX GAMES FLAGSHIP TITLE • IN ACTIVE DEVELOPMENT</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white uppercase tracking-tight leading-none">
              GANGSTER <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-[#FF6321] to-amber-400 animate-shimmer-text drop-shadow-[0_0_35px_rgba(239,68,68,0.5)]">REVOLUTION</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 font-light max-w-3xl leading-relaxed italic animate-cyber-glow">
              Next-generation open-world syndicate warfare, underground turf battles, high-octane vehicular combat, and cinematic story heists.
            </p>
          </motion.div>

          {/* Action Button Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4"
          >
            {!product?.fileUrl ? (
              <div className="px-8 py-4 rounded-2xl bg-white/[0.05] border border-red-500/40 backdrop-blur-xl text-red-300 font-extrabold text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(239,68,68,0.2)] flex items-center justify-center gap-3">
                <Clock className="w-4 h-4 text-red-400 animate-spin" />
                <span>RELEASE DATE: TBD • IN ACTIVE DEVELOPMENT</span>
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-mono border border-red-500/40">
                  TBD
                </span>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => product && openDownloadModal(product)}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs uppercase tracking-widest shadow-[0_10px_30px_rgba(220,38,38,0.5)] transition-all flex items-center justify-center gap-2 btn-shimmer-sweep"
              >
                <Download className="w-4 h-4 animate-bounce" /> DOWNLOAD GANGSTER REVOLUTION
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                const el = document.getElementById('game-specs');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider border border-white/15 transition-colors backdrop-blur-sm flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4 text-red-400 animate-pulse" /> SYSTEM REQUIREMENTS
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          TBD COUNTDOWN & LAUNCH ESTIMATION WIDGET
         ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[28px] md:rounded-[36px] bg-gradient-to-br from-white/[0.04] to-black/70 backdrop-blur-2xl border border-red-500/40 p-6 md:p-8 shadow-2xl space-y-6 animate-border-glow"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-3.5 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                <Flame className="w-6 h-6 animate-bounce" style={{ animationDuration: '2s' }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-widest text-red-400 font-bold font-mono">
                    GANGSTER REVOLUTION LAUNCH SEQUENCE
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] uppercase font-mono font-extrabold border border-red-500/40">
                    {gameStatus}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white tracking-wide mt-1">
                  OFFICIAL RELEASE LAUNCH WINDOW: <span className="text-amber-400 font-mono">{launchDate}</span>
                </h3>
              </div>
            </div>

            {/* Current Active Price Badge */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-black text-xl tracking-wider shadow-[0_0_25px_rgba(220,38,38,0.5)] flex items-center gap-2 btn-shimmer-sweep"
            >
              <Zap className="w-5 h-5 fill-white animate-pulse" />
              <span>PRICE: TBD</span>
            </motion.div>
          </div>

          {/* TBD Digits Grid with Motion Hover */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['DAYS', 'HOURS', 'MINUTES', 'SECONDS'].map((label, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4, scale: 1.03 }}
                className="flex flex-col items-center justify-center p-5 rounded-2xl bg-black/60 border border-red-500/30 backdrop-blur-md shadow-inner group hover:border-red-500 transition-all"
              >
                <span className="text-3xl md:text-5xl font-black font-mono text-red-400 group-hover:text-amber-400 tracking-wider transition-colors">
                  TBD
                </span>
                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mt-1">
                  {label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Development Status Notice */}
          <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/40 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 animate-spin" style={{ animationDuration: '8s' }} />
              <span className="text-xs text-gray-300 leading-relaxed">
                <strong>Apex Syndicate Game Studio Update:</strong> Gangster Revolution is currently in deep active engineering. Core rendering pipelines, physics calculations, and multiplayer networking are being finalized. Official release dates and pricing tiers are To Be Determined (TBD).
              </span>
            </div>
            <span className="text-[11px] font-mono text-red-400 font-bold uppercase">
              STATUS: PRE-ALPHA BUILD
            </span>
          </div>

          {/* Pricing Progression Timeline (All TBD) */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="text-xs font-semibold text-gray-400 flex items-center justify-between">
              <span className="text-red-400 tracking-wider uppercase font-mono">RELEASE ROADMAP & PRICING PHASES</span>
              <span className="text-amber-400 font-mono text-[11px]">ALL FIGURES TBD</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  phase: 'PHASE 1: CLOSED ALPHA',
                  desc: 'Exclusive closed-group stress test for physics and vehicle telemetry.',
                  highlight: true,
                },
                {
                  phase: 'PHASE 2: COMMUNITY BETA',
                  desc: 'Expanded open beta testing for city districts and multiplayer servers.',
                  highlight: false,
                },
                {
                  phase: 'PHASE 3: GLOBAL COMMERCIAL LAUNCH',
                  desc: 'Official public release across Windows PC and Syndicate Launcher.',
                  highlight: false,
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -3 }}
                  className={`p-4 rounded-xl border bg-black/50 ${
                    item.highlight ? 'border-red-500/40 text-white shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-white/10 text-gray-300'
                  } space-y-1`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>{item.phase}</span>
                    <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-mono">TBD</span>
                  </div>
                  <div className="text-xl font-black text-amber-400 font-mono">PRICE: TBD</div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ==========================================
          CORE GAMEPLAY PILLARS & FEATURES (ANIMATED)
         ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold uppercase">
            GAME ENGINE ARCHITECTURE
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            NEXT-GEN SYNDICATE WARFARE
          </h2>
          <p className="text-base text-gray-400 leading-relaxed font-light">
            Engineered using high-fidelity rendering, real-time destruction physics, and intelligent squad AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Vast Open-World Metropolis',
              desc: 'Explore sprawling neon-lit downtown districts, underground cargo ports, high-end residential skyscrapers, and hostile syndicate back-alleys.',
              icon: MapPin,
            },
            {
              title: 'High-Octane Vehicle Tuning',
              desc: 'Customize engines, nitro boosters, armor plating, and exterior aesthetics. Experience hyper-realistic drift physics and high-speed police chases.',
              icon: Car,
            },
            {
              title: 'Turf Wars & Story Heists',
              desc: 'Form your crew, claim enemy territories, execute high-stakes tactical bank heists, and defend contraband supply lines from rival syndicates.',
              icon: Crosshair,
            },
            {
              title: 'Online Syndicate Co-Op',
              desc: 'Team up with fellow syndicate operatives online in seamless drop-in/drop-out cooperative missions and competitive open-city multiplayer lobbies.',
              icon: Users,
            },
            {
              title: 'Dynamic Weather & Physics',
              desc: 'Unreal ray-traced reflections across wet neon pavement, destructible environmental props, and simulated day/night bullet ballistics.',
              icon: Layers,
            },
            {
              title: 'Underground Black Market',
              desc: 'Trade rare weapon blueprints, tuned supercar engines, encrypted radios, and territory defense turrets on the decentralized Syndicate Network.',
              icon: Zap,
            },
          ].map((feat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6, scale: 1.02 }}
              className="p-8 rounded-[28px] bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl border border-white/10 hover:border-red-500/50 transition-all duration-300 space-y-4 shadow-xl hover:shadow-[0_10px_30px_rgba(239,68,68,0.2)]"
            >
              <div className="p-3.5 w-fit rounded-2xl bg-red-600/15 border border-red-500/30 text-red-400">
                <feat.icon className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-white uppercase">{feat.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-light">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==========================================
          SYSTEM REQUIREMENTS (ID: game-specs)
         ========================================== */}
      <section id="game-specs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          whileHover={{ y: -4 }}
          className="p-8 md:p-12 rounded-[28px] md:rounded-[36px] bg-white/[0.03] backdrop-blur-2xl border border-white/10 hover:border-red-500/40 space-y-8 shadow-2xl transition-colors duration-300"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">
                PC HARDWARE TARGETS
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mt-1">
                SYSTEM REQUIREMENTS
              </h3>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-300 text-xs font-mono font-bold">
              TARGET PLATFORM: WINDOWS 64-BIT PC
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Minimum Specs */}
            <div className="p-6 rounded-2xl bg-black/50 border border-white/10 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <Shield className="w-5 h-5 text-amber-400" />
                <span className="font-mono font-bold text-white text-sm uppercase">
                  MINIMUM SPECIFICATIONS
                </span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500 font-mono">OS:</span>
                  <span className="text-white font-bold">{specs.minOs}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500 font-mono">PROCESSOR:</span>
                  <span className="text-white font-bold">{specs.minProcessor}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500 font-mono">MEMORY (RAM):</span>
                  <span className="text-white font-bold">{specs.minMemory}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500 font-mono">GRAPHICS (GPU):</span>
                  <span className="text-white font-bold">{specs.minGraphics}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500 font-mono">DIRECTX:</span>
                  <span className="text-white font-bold">{specs.minDirectX}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-mono">STORAGE:</span>
                  <span className="text-white font-bold">{specs.minStorage}</span>
                </div>
              </div>
            </div>

            {/* Recommended Specs */}
            <div className="p-6 rounded-2xl bg-black/50 border border-red-500/30 space-y-4 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <Zap className="w-5 h-5 text-red-400" />
                <span className="font-mono font-bold text-white text-sm uppercase">
                  RECOMMENDED SPECIFICATIONS
                </span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500 font-mono">OS:</span>
                  <span className="text-white font-bold">{specs.recOs}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500 font-mono">PROCESSOR:</span>
                  <span className="text-white font-bold">{specs.recProcessor}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500 font-mono">MEMORY (RAM):</span>
                  <span className="text-white font-bold">{specs.recMemory}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500 font-mono">GRAPHICS (GPU):</span>
                  <span className="text-white font-bold">{specs.recGraphics}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500 font-mono">DIRECTX:</span>
                  <span className="text-white font-bold">{specs.recDirectX}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-mono">STORAGE:</span>
                  <span className="text-white font-bold">{specs.recStorage}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
