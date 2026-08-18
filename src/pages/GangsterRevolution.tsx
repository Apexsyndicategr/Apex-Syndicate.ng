import React from 'react';
import { Product, OwnerSettings } from '../types';
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
    <div className="space-y-16 pb-24">
      {/* ==========================================
          HERO BANNER & GAME REVEAL
         ========================================== */}
      <section className="relative pt-12 pb-16 overflow-hidden border-b border-white/10">
        {/* Cinematic Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[500px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-red-600/20 to-amber-600/20 border border-red-500/40 text-red-400 text-xs font-mono font-bold uppercase tracking-widest shadow-lg">
            <Gamepad2 className="w-4 h-4 text-red-400 animate-pulse" />
            <span>APEX GAMES FLAGSHIP TITLE • IN ACTIVE DEVELOPMENT</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white uppercase tracking-tight leading-none">
              GANGSTER <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-[#FF6321] to-amber-400">REVOLUTION</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 font-light max-w-3xl leading-relaxed">
              Next-generation open-world syndicate warfare, underground turf battles, high-octane vehicular combat, and cinematic story heists.
            </p>
          </div>

          {/* Action Button Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            {isComingSoon ? (
              <div className="px-8 py-4 rounded-2xl bg-white/[0.05] border border-amber-500/40 backdrop-blur-xl text-amber-300 font-extrabold text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(245,158,11,0.15)] flex items-center justify-center gap-3">
                <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                <span>COMING SOON • IN ACTIVE DEVELOPMENT</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/40">
                  TBD
                </span>
              </div>
            ) : (
              <button
                onClick={() => product && openDownloadModal(product)}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs uppercase tracking-widest shadow-[0_10px_30px_rgba(220,38,38,0.4)] transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> DOWNLOAD GANGSTER REVOLUTION
              </button>
            )}

            <button
              onClick={() => {
                const el = document.getElementById('game-specs');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition-colors backdrop-blur-sm flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4 text-red-400" /> SYSTEM REQUIREMENTS
            </button>
          </div>
        </div>
      </section>

      {/* ==========================================
          TBD COUNTDOWN & LAUNCH ESTIMATION WIDGET
         ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[28px] md:rounded-[32px] bg-white/[0.03] backdrop-blur-2xl border border-red-500/30 p-6 md:p-8 shadow-2xl space-y-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-400">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-widest text-red-400 font-bold font-mono">
                    GANGSTER REVOLUTION LAUNCH SEQUENCE
                  </span>
                  <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] uppercase font-mono font-extrabold border border-red-500/40">
                    {gameStatus}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white tracking-wide mt-1">
                  OFFICIAL RELEASE LAUNCH WINDOW: <span className="text-amber-400 font-mono">{launchDate}</span>
                </h3>
              </div>
            </div>

            {/* Current Active Price Badge */}
            <div className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-black text-xl tracking-wider shadow-[0_0_25px_rgba(220,38,38,0.4)] flex items-center gap-2">
              <Zap className="w-5 h-5 fill-white" />
              <span>PRICE: TBD</span>
            </div>
          </div>

          {/* TBD Digits Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-black/50 border border-red-500/20 backdrop-blur-md shadow-inner">
              <span className="text-3xl md:text-5xl font-black font-mono text-red-400 tracking-wider">
                TBD
              </span>
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mt-1">
                DAYS
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-black/50 border border-red-500/20 backdrop-blur-md shadow-inner">
              <span className="text-3xl md:text-5xl font-black font-mono text-red-400 tracking-wider">
                TBD
              </span>
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mt-1">
                HOURS
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-black/50 border border-red-500/20 backdrop-blur-md shadow-inner">
              <span className="text-3xl md:text-5xl font-black font-mono text-red-400 tracking-wider">
                TBD
              </span>
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mt-1">
                MINUTES
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-black/50 border border-amber-500/30 backdrop-blur-md shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 bg-red-600/10 animate-pulse pointer-events-none" />
              <span className="text-3xl md:text-5xl font-black font-mono text-amber-400 tracking-wider">
                TBD
              </span>
              <span className="text-[10px] font-bold tracking-widest text-amber-300 uppercase mt-1">
                SECONDS
              </span>
            </div>
          </div>

          {/* Development Status Notice */}
          <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              <span className="text-xs text-gray-300">
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
              <div className="p-4 rounded-xl border bg-black/40 border-red-500/30 text-white space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>PHASE 1: CLOSED ALPHA</span>
                  <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-mono">TBD</span>
                </div>
                <div className="text-xl font-black text-amber-400 font-mono">PRICE: TBD</div>
                <p className="text-[11px] text-gray-400">
                  Exclusive closed-group stress test for physics and vehicle telemetry.
                </p>
              </div>

              <div className="p-4 rounded-xl border bg-black/40 border-white/10 text-gray-300 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>PHASE 2: COMMUNITY BETA</span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-gray-400 text-[10px] font-mono">TBD</span>
                </div>
                <div className="text-xl font-black text-white font-mono">PRICE: TBD</div>
                <p className="text-[11px] text-gray-400">
                  Expanded open beta testing for city districts and multiplayer servers.
                </p>
              </div>

              <div className="p-4 rounded-xl border bg-black/40 border-white/10 text-gray-300 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>PHASE 3: GLOBAL COMMERCIAL LAUNCH</span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-gray-400 text-[10px] font-mono">TBD</span>
                </div>
                <div className="text-xl font-black text-white font-mono">PRICE: TBD</div>
                <p className="text-[11px] text-gray-400">
                  Official public release across Windows PC and Syndicate Launcher.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          CORE GAMEPLAY PILLARS & FEATURES
         ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold uppercase">
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
          <div className="p-8 rounded-[28px] bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-red-500/40 transition-all duration-300 space-y-4">
            <div className="p-3.5 w-fit rounded-2xl bg-red-600/10 border border-red-500/30 text-red-400">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white uppercase">Vast Open-World Metropolis</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Explore sprawling neon-lit downtown districts, underground cargo ports, high-end residential skyscrapers, and hostile syndicate back-alleys.
            </p>
          </div>

          <div className="p-8 rounded-[28px] bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-red-500/40 transition-all duration-300 space-y-4">
            <div className="p-3.5 w-fit rounded-2xl bg-red-600/10 border border-red-500/30 text-red-400">
              <Car className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white uppercase">High-Octane Vehicle Tuning</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Customize engines, nitro boosters, armor plating, and exterior aesthetics. Experience hyper-realistic drift physics and high-speed police chases.
            </p>
          </div>

          <div className="p-8 rounded-[28px] bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-red-500/40 transition-all duration-300 space-y-4">
            <div className="p-3.5 w-fit rounded-2xl bg-red-600/10 border border-red-500/30 text-red-400">
              <Crosshair className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white uppercase">Turf Wars & Story Heists</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Form your crew, claim enemy territories, execute high-stakes tactical bank heists, and defend contraband supply lines from rival syndicates.
            </p>
          </div>

          <div className="p-8 rounded-[28px] bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-red-500/40 transition-all duration-300 space-y-4">
            <div className="p-3.5 w-fit rounded-2xl bg-red-600/10 border border-red-500/30 text-red-400">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white uppercase">Online Syndicate Co-Op</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Team up with fellow syndicate operatives online in seamless drop-in/drop-out cooperative missions and competitive open-city multiplayer lobbies.
            </p>
          </div>

          <div className="p-8 rounded-[28px] bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-red-500/40 transition-all duration-300 space-y-4">
            <div className="p-3.5 w-fit rounded-2xl bg-red-600/10 border border-red-500/30 text-red-400">
              <Tv className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white uppercase">GPU Ray-Tracing & DLSS</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Native ray-traced reflections, volumetric fog, dynamic global illumination, and AI frame generation delivering breathtaking cinematic visuals.
            </p>
          </div>

          <div className="p-8 rounded-[28px] bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-red-500/40 transition-all duration-300 space-y-4">
            <div className="p-3.5 w-fit rounded-2xl bg-red-600/10 border border-red-500/30 text-red-400">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white uppercase">Zero-Lag Rust Netcode</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Engineered with custom authoritative client-side prediction and low-latency synchronization for razor-sharp combat responsiveness.
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================
          SYSTEM REQUIREMENTS (ID: game-specs)
         ========================================== */}
      <section id="game-specs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 md:p-12 rounded-[28px] md:rounded-[32px] bg-white/[0.03] backdrop-blur-2xl border border-white/10 space-y-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">
                TARGET HARDWARE BENCHMARKS
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase mt-1">
                SYSTEM REQUIREMENTS
              </h2>
            </div>
            <div className="px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-gray-400">
              PLATFORM: WINDOWS 10 / 11 64-BIT
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Minimum Specs */}
            <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-4">
              <div className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                MINIMUM REQUIREMENTS (1080p 60FPS LOW-MED)
              </div>
              <div className="space-y-3 text-xs text-gray-300 font-mono">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500">OS:</span>
                  <span className="text-white font-bold">{specs.minOs || 'TBD'}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500">Processor:</span>
                  <span className="text-white font-bold">{specs.minProcessor || 'TBD'}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500">Memory:</span>
                  <span className="text-white font-bold">{specs.minMemory || 'TBD'}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500">Graphics:</span>
                  <span className="text-white font-bold">{specs.minGraphics || 'TBD'}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500">DirectX:</span>
                  <span className="text-white font-bold">{specs.minDirectX || 'TBD'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Storage:</span>
                  <span className="text-white font-bold">{specs.minStorage || 'TBD'}</span>
                </div>
              </div>
            </div>

            {/* Recommended Specs */}
            <div className="p-6 rounded-2xl bg-black/40 border border-red-500/30 space-y-4 shadow-[0_0_20px_rgba(220,38,38,0.15)]">
              <div className="text-sm font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                RECOMMENDED SPECS (1440p / 4K ULTRA 60FPS)
              </div>
              <div className="space-y-3 text-xs text-gray-300 font-mono">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500">OS:</span>
                  <span className="text-white font-bold">{specs.recOs || 'TBD'}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500">Processor:</span>
                  <span className="text-white font-bold">{specs.recProcessor || 'TBD'}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500">Memory:</span>
                  <span className="text-white font-bold">{specs.recMemory || 'TBD'}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500">Graphics:</span>
                  <span className="text-white font-bold">{specs.recGraphics || 'TBD'}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500">DirectX:</span>
                  <span className="text-white font-bold">{specs.recDirectX || 'TBD'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Storage:</span>
                  <span className="text-white font-bold">{specs.recStorage || 'TBD'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
