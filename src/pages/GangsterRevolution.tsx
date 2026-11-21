import React from 'react';
import { Product, OwnerSettings } from '../types';
import {
  Download,
  Shield,
  Zap,
  Crosshair,
  Car,
  MapPin,
  Clock,
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
  const launchDate = settings?.gangsterRevolutionLaunchDate || 'TBD';
  const gameStatus = settings?.gangsterRevolutionStatus || 'PRE-ALPHA · IN DEVELOPMENT';
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
      {/* Hero Banner */}
      <section className="pt-12 pb-10 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-xs font-mono text-zinc-400 flex flex-wrap items-center gap-2">
            <span className="text-[#FF5500] font-semibold">Apex Games</span>
            <span aria-hidden="true">·</span>
            <span>{gameStatus}</span>
          </div>

          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.04]">
              GANGSTER <span className="text-[#FF5500]">REVOLUTION</span>
            </h1>
            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
              Open-world syndicate warfare, underground turf battles, high-speed vehicular combat, and multi-stage story heists across a living metropolis.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            {!product?.fileUrl ? (
              <div className="px-6 py-3.5 rounded-lg bg-[#111114] border border-white/[0.08] text-zinc-300 font-mono text-xs flex items-center justify-center gap-2.5">
                <Clock className="w-4 h-4 text-[#FF5500]" />
                <span>Release Date: {launchDate} · In Development</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => product && openDownloadModal(product)}
                className="px-7 py-3.5 rounded-lg bg-[#FF5500] hover:bg-[#FF6E26] text-black font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Gangster Revolution</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('game-specs');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 font-medium text-sm border border-white/[0.08] flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Shield className="w-4 h-4 text-[#FF5500]" />
              <span>System Requirements</span>
            </button>
          </div>
        </div>
      </section>

      {/* Launch Window & Roadmap Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#111114] border border-white/[0.08] p-6 sm:p-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <div className="space-y-1">
              <div className="text-xs font-mono text-[#FF5500] font-semibold uppercase tracking-wider">
                {gameStatus}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Release Launch Window: <span className="font-mono text-[#FF5500]">{launchDate}</span>
              </h2>
            </div>

            <div className="px-4 py-2 rounded-lg bg-[#09090b] border border-white/[0.08] font-mono text-sm font-bold text-white w-fit">
              Price: <span className="text-[#FF5500]">TBD</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['DAYS', 'HOURS', 'MINUTES', 'SECONDS'].map((label) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#09090b] border border-white/[0.06]"
              >
                <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-[#FF5500]">
                  TBD
                </span>
                <span className="text-[11px] font-mono tracking-wider text-zinc-500 mt-1">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-white/[0.08]">
            {[
              {
                phase: 'Phase 1 · Closed Alpha',
                desc: 'Internal stress testing for core physics, AI routing, and vehicle handling.',
                active: true,
              },
              {
                phase: 'Phase 2 · Community Beta',
                desc: 'Public stress test covering open city districts and syndicate lobbies.',
                active: false,
              },
              {
                phase: 'Phase 3 · Commercial Launch',
                desc: 'Full PC release through the official Apex Syndicate distribution hub.',
                active: false,
              },
            ].map((item) => (
              <div
                key={item.phase}
                className={`p-4 rounded-xl bg-[#09090b] border space-y-1.5 ${
                  item.active ? 'border-[#FF5500]/40' : 'border-white/[0.06]'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white font-semibold">{item.phase}</span>
                  <span className="text-[#FF5500]">TBD</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Gameplay Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="max-w-2xl space-y-2">
          <div className="text-xs font-mono text-[#FF5500] font-medium">
            Gameplay Architecture
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Core Systems &amp; Features
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Built for open-ended street progression, tactical coordination, and responsive physics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Open-World Metropolis',
              desc: 'Seamless interconnected downtown districts, cargo ports, residential rooftops, and underground alleys.',
              icon: MapPin,
            },
            {
              title: 'Vehicle Tuning & Physics',
              desc: 'Customize engines, armor plating, suspension geometry, and handling profiles for high-speed escapes.',
              icon: Car,
            },
            {
              title: 'Turf Wars & Story Heists',
              desc: 'Build your crew, secure contested city sectors, execute coordinated heists, and protect supply lines.',
              icon: Crosshair,
            },
            {
              title: 'Online Syndicate Co-Op',
              desc: 'Drop-in cooperative operations and competitive syndicate sessions.',
              icon: Users,
            },
            {
              title: 'Dynamic Weather & Destruction',
              desc: 'Day-night cycles, wet surface reflections, and destructible environmental cover.',
              icon: Layers,
            },
            {
              title: 'Underground Economy',
              desc: 'Trade blueprints, tuned vehicle parts, and defensive hardware through the in-game black market.',
              icon: Zap,
            },
          ].map((feat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#111114] border border-white/[0.08] space-y-3"
            >
              <div className="w-10 h-10 rounded-lg bg-[#FF5500]/10 border border-[#FF5500]/25 flex items-center justify-center text-[#FF5500]">
                <feat.icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">{feat.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* System Requirements */}
      <section id="game-specs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-2xl bg-[#111114] border border-white/[0.08] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
            <div>
              <div className="text-xs font-mono text-[#FF5500] font-medium">
                PC Hardware Targets
              </div>
              <h3 className="text-2xl font-bold text-white mt-0.5">System Requirements</h3>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              Target Platform · Windows 64-bit PC
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-[#09090b] border border-white/[0.06] space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06] text-xs font-mono font-semibold text-white uppercase">
                <Shield className="w-4 h-4 text-zinc-400" />
                <span>Minimum Specifications</span>
              </div>
              <div className="space-y-2.5 text-xs font-mono">
                {[
                  ['OS', specs.minOs],
                  ['Processor', specs.minProcessor],
                  ['Memory', specs.minMemory],
                  ['Graphics', specs.minGraphics],
                  ['DirectX', specs.minDirectX],
                  ['Storage', specs.minStorage],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between gap-4 border-b border-white/[0.04] pb-1.5 last:border-none last:pb-0">
                    <span className="text-zinc-500">{label}</span>
                    <span className="text-white font-semibold">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#09090b] border border-[#FF5500]/30 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06] text-xs font-mono font-semibold text-[#FF5500] uppercase">
                <Zap className="w-4 h-4 text-[#FF5500]" />
                <span>Recommended Specifications</span>
              </div>
              <div className="space-y-2.5 text-xs font-mono">
                {[
                  ['OS', specs.recOs],
                  ['Processor', specs.recProcessor],
                  ['Memory', specs.recMemory],
                  ['Graphics', specs.recGraphics],
                  ['DirectX', specs.recDirectX],
                  ['Storage', specs.recStorage],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between gap-4 border-b border-white/[0.04] pb-1.5 last:border-none last:pb-0">
                    <span className="text-zinc-500">{label}</span>
                    <span className="text-white font-semibold">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
