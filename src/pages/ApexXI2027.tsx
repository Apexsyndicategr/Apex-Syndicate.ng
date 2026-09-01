import React from 'react';
import { Product, OwnerSettings } from '../types';
import { motion } from 'motion/react';
import {
  Trophy,
  Download,
  Flame,
  Shield,
  Zap,
  Activity,
  Monitor,
  Clock,
  Sparkles,
  ChevronRight,
  HardDrive,
  Cpu,
  Tv,
  Layers,
  Users,
  Gamepad,
  Compass,
  Award,
  CircleDot,
  CheckCircle2,
} from 'lucide-react';
import apexXi2027CoverImg from '../assets/images/apex_xi_2027_pc_cover_ronaldo_messi_1788293335110.jpg';
import messiShootingApexXI27Img from '../assets/images/messi_shooting_apex_xi_27_1788293301372.jpg';

interface ApexXI2027Props {
  product: Product | null;
  openDownloadModal: (product: Product) => void;
  settings?: OwnerSettings;
  setActiveTab?: (tab: string) => void;
}

export const ApexXI2027: React.FC<ApexXI2027Props> = ({
  product,
  openDownloadModal,
  settings,
  setActiveTab,
}) => {
  const isComingSoon = Boolean(product ? product.isComingSoon || !product.fileUrl : true);
  const launchDate = settings?.apexXILaunchDate || 'Coming Soon';
  const gameStatus = settings?.apexXIStatus || 'PC EXCLUSIVE • COMING SOON';

  const specs = settings?.apexXISpecs || {
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

  const keyPillars = [
    {
      icon: <Activity className="w-6 h-6 text-emerald-400" />,
      title: 'Tactical AI Pitch Engine',
      subtitle: '22-Player Neural Decision System',
      description:
        'Every player on the pitch makes cognitive tactical choices in real-time. Dynamic pressing lines, intelligent off-the-ball runs, and adaptive opponent defensive strategies.',
      color: 'from-emerald-600/20 to-teal-900/40',
      border: 'border-emerald-500/30',
      glow: 'shadow-[0_0_30px_rgba(16,185,129,0.15)]',
    },
    {
      icon: <Monitor className="w-6 h-6 text-cyan-400" />,
      title: 'PC Exclusive Architecture',
      subtitle: 'Uncapped FPS & 4K Ultrawide 21:9',
      description:
        'Engineered from the ground up for PC hardware. Supports 144Hz+ high refresh rates, ultra-low latency input pipelines, and native ultrawide widescreen monitor support.',
      color: 'from-cyan-600/20 to-blue-900/40',
      border: 'border-cyan-500/30',
      glow: 'shadow-[0_0_30px_rgba(6,182,212,0.15)]',
    },
    {
      icon: <Zap className="w-6 h-6 text-[#FF6321]" />,
      title: 'Hyper-Realistic Ball Kinematics',
      subtitle: 'True Aerodynamic & Surface Physics',
      description:
        'Unscripted physical simulation calculates air resistance, knuckleball turbulence, surface friction on wet grass, and authentic player foot-to-ball contact angles.',
      color: 'from-orange-600/20 to-amber-900/40',
      border: 'border-[#FF6321]/30',
      glow: 'shadow-[0_0_30px_rgba(255,99,33,0.15)]',
    },
    {
      icon: <Gamepad className="w-6 h-6 text-amber-400" />,
      title: 'Precision PC Controls',
      subtitle: 'Full Gamepad & Keyboard/Mouse Support',
      description:
        'Play your way with native plug-and-play support for Xbox, DualSense, and PC controllers, as well as ultra-responsive keyboard & mouse tactical mapping.',
      color: 'from-amber-600/20 to-orange-900/40',
      border: 'border-amber-500/30',
      glow: 'shadow-[0_0_30px_rgba(245,158,11,0.15)]',
    },
    {
      icon: <Trophy className="w-6 h-6 text-yellow-400" />,
      title: 'Deep Club & Career Mode',
      subtitle: 'Tactical Board & Scouting Systems',
      description:
        'Build a dynasty from the ground up. Take full control over training regimes, tactical playbooks, youth academies, global transfer markets, and matchday strategies.',
      color: 'from-yellow-600/20 to-amber-950/40',
      border: 'border-yellow-500/30',
      glow: 'shadow-[0_0_30px_rgba(234,179,8,0.15)]',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-purple-400" />,
      title: 'Volumetric Stadium Atmosphere',
      subtitle: 'Dynamic Floodlights & Living Crowds',
      description:
        'Experience electrifying match atmospheres featuring volumetric floodlights, dynamic night weather conditions, reactive crowd chants, and cinematic matchday presentations.',
      color: 'from-purple-600/20 to-indigo-900/40',
      border: 'border-purple-500/30',
      glow: 'shadow-[0_0_30px_rgba(168,85,247,0.15)]',
    },
  ];

  return (
    <div className="space-y-16 pb-24 overflow-hidden">
      {/* ==========================================
          HERO BANNER & GAME REVEAL
         ========================================== */}
      <section className="relative pt-12 pb-16 overflow-hidden border-b border-white/10">
        {/* Ambient Stadium Glow */}
        <div className="absolute top-0 right-1/4 w-[650px] h-[550px] bg-emerald-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[130px] pointer-events-none animate-float-slow" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-gradient-to-r from-emerald-600/25 via-cyan-600/20 to-emerald-600/25 border border-emerald-500/50 text-emerald-400 text-xs font-mono font-black uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-border-glow"
          >
            <Trophy className="w-4 h-4 text-emerald-400 animate-bounce" style={{ animationDuration: '2s' }} />
            <span>PC EXCLUSIVE FOOTBALL SIMULATION • COMING SOON</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </motion.div>

          {/* Title & Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white uppercase tracking-tight leading-none">
              APEX XI <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-[#FF6321] animate-shimmer-text drop-shadow-[0_0_35px_rgba(16,185,129,0.5)]">2027</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 font-light max-w-3xl leading-relaxed italic animate-cyber-glow">
              The next-generation football simulation experience engineered exclusively for PC. Tactical neural AI, hyper-realistic ball kinematics, and high refresh rate stadium simulation.
            </p>
          </motion.div>

          {/* Action Button Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4"
          >
            <div className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-cyan-950/40 to-black border border-emerald-500/50 backdrop-blur-xl text-emerald-300 font-extrabold text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(16,185,129,0.25)] flex items-center justify-center gap-3">
              <Clock className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>COMING SOON • PC EXCLUSIVE</span>
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/40 font-black">
                COMING SOON
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                const el = document.getElementById('apex-xi-specs');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider border border-white/15 transition-colors backdrop-blur-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Shield className="w-4 h-4 text-emerald-400 animate-pulse" /> SYSTEM REQUIREMENTS (ALL TBD)
            </motion.button>

            {setActiveTab && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  setActiveTab('products');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-4 rounded-2xl bg-[#FF6321]/10 hover:bg-[#FF6321]/20 text-[#FF6321] font-bold text-xs uppercase tracking-wider border border-[#FF6321]/30 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#FF6321]" /> VIEW IN PRODUCTS
              </motion.button>
            )}
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          GAME COVER ART & OFFICIAL SPOTLIGHT
         ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[28px] md:rounded-[36px] bg-gradient-to-br from-white/[0.04] to-black/80 backdrop-blur-2xl border border-emerald-500/40 p-6 md:p-10 shadow-[0_0_60px_rgba(16,185,129,0.2)] space-y-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Official Cover Art with Ronaldo & Messi */}
            <div className="lg:col-span-6 relative group">
              <div className="relative rounded-3xl overflow-hidden border border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.35)] bg-black">
                <img
                  src={apexXi2027CoverImg}
                  alt="Apex XI 2027 Official PC Game Cover featuring Cristiano Ronaldo and Lionel Messi"
                  className="w-full h-auto object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-emerald-500/60 text-emerald-400 font-mono text-[11px] font-black uppercase tracking-wider">
                  OFFICIAL PC GAME COVER
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-left space-y-1">
                  <div className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                    <span>LEGENDS UNITED • PC EXCLUSIVE</span>
                  </div>
                  <h4 className="text-lg font-black text-white uppercase tracking-wide">
                    CRISTIANO RONALDO & LIONEL MESSI
                  </h4>
                </div>
              </div>
            </div>

            {/* Right: Game Architecture & PC Philosophy */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
                  <Monitor className="w-3.5 h-3.5" />
                  <span>BUILT FOR PC PLAYERS</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
                  NEXT-GEN SIMULATION, <span className="text-emerald-400">UNCOMPROMISED PC POWER</span>
                </h2>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  Apex XI 2027 is tailored specifically for PC gaming systems. Unshackled from console constraints, Apex XI 2027 delivers hyper-responsive input polling, multi-threaded CPU tactical calculation, uncompressed high-fidelity pitch textures, and deep tactical strategy boards.
                </p>
              </div>

              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>PC EXCLUSIVE</span>
                  </div>
                  <p className="text-xs text-gray-400">Engineered from the ground up exclusively for PC gaming rigs and high-performance hardware.</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>UNCAPPED FRAMERATES</span>
                  </div>
                  <p className="text-xs text-gray-400">Engineered for 60FPS, 120FPS, and 144Hz+ high-refresh gaming displays.</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <div className="flex items-center gap-2 text-[#FF6321] font-mono text-xs font-bold uppercase">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6321]" />
                    <span>TACTICAL AI ENGINE</span>
                  </div>
                  <p className="text-xs text-gray-400">Real-time team intelligence, dynamic off-the-ball runs, and fluid pressing.</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <div className="flex items-center gap-2 text-yellow-400 font-mono text-xs font-bold uppercase">
                    <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                    <span>ALL HARDWARE SPECS TBD</span>
                  </div>
                  <p className="text-xs text-gray-400">System requirements are actively being tuned and will be revealed soon.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ==========================================
          GAME PILLARS & FEATURES
         ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
            <span>ENGINEERING BREAKTHROUGHS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            CORE GAMEPLAY <span className="text-emerald-400">PILLARS</span>
          </h2>
          <p className="text-gray-400 text-sm">
            Discover what sets Apex XI 2027 apart on PC: authentic simulation, unscripted kinematics, and next-generation stadium atmosphere.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {keyPillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className={`rounded-3xl bg-gradient-to-b ${pillar.color} border ${pillar.border} ${pillar.glow} p-6 space-y-4 backdrop-blur-xl transition-all hover:scale-[1.02]`}
            >
              <div className="p-3 rounded-2xl bg-black/40 border border-white/10 w-fit">
                {pillar.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white uppercase">{pillar.title}</h3>
                <div className="text-xs font-mono text-emerald-400 font-semibold">{pillar.subtitle}</div>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">{pillar.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==========================================
          STADIUM PITCH & VISUAL ENGINE SHOWCASE - MESSI #27 STRIKE
         ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.2)] bg-black">
          <img
            src={messiShootingApexXI27Img}
            alt="Lionel Messi shooting the ball wearing APEX XI kit number 27 in Apex XI 2027 dynamic stadium"
            className="w-full h-80 sm:h-96 lg:h-[520px] object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>GAMEPLAY ENGINE • LIONEL MESSI #27 (APEX XI)</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-white uppercase">
              NEXT-GEN BALL KINEMATICS & PLAYER PRECISION
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
              Witness authentic striking physics powered by Apex XI 2027 engine. Featuring Lionel Messi in the official APEX XI #27 match kit executing a precision top-corner strike beneath volumetric arena floodlights.
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================
          SYSTEM REQUIREMENTS (ALL SPECS TBD)
         ========================================== */}
      <section id="apex-xi-specs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>PC HARDWARE SPECS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            SYSTEM <span className="text-emerald-400">REQUIREMENTS</span>
          </h2>
          <p className="text-gray-400 text-sm">
            Apex XI 2027 is in active development. Official PC hardware specifications are To Be Determined (TBD) following upcoming alpha performance benchmarks.
          </p>
        </div>

        {/* TBD Hardware Specifications Notice Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-cyan-950/40 to-black border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)] flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-400 font-mono text-xs font-black uppercase tracking-wider">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>OFFICIAL HARDWARE SPECIFICATIONS NOTICE</span>
            </div>
            <p className="text-sm text-gray-200 font-medium">
              All minimum and recommended system requirements are currently marked as <strong className="text-emerald-400 font-mono">TBD</strong> by the Apex Syndicate development studio.
            </p>
          </div>
          <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono font-black text-xs uppercase tracking-widest border border-emerald-500/40 shrink-0">
            ALL SPECS: TBD
          </span>
        </div>

        {/* System Specs Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Minimum Requirements (TBD) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-wide">MINIMUM REQUIREMENTS</h3>
                  <span className="text-xs font-mono text-gray-500 uppercase">Target: 1080p 60FPS (PC)</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-lg bg-white/10 text-gray-300 font-mono font-bold text-xs">
                TBD
              </span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-gray-500 uppercase flex items-center gap-2">
                  <Tv className="w-3.5 h-3.5 text-emerald-400" /> OS:
                </span>
                <span className="text-emerald-400 font-bold">{specs.minOs || 'TBD'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-gray-500 uppercase flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" /> PROCESSOR (CPU):
                </span>
                <span className="text-emerald-400 font-bold">{specs.minProcessor || 'TBD'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-gray-500 uppercase flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" /> MEMORY (RAM):
                </span>
                <span className="text-emerald-400 font-bold">{specs.minMemory || 'TBD'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-gray-500 uppercase flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> GRAPHICS (GPU):
                </span>
                <span className="text-emerald-400 font-bold">{specs.minGraphics || 'TBD'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-gray-500 uppercase flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" /> DIRECTX / API:
                </span>
                <span className="text-emerald-400 font-bold">{specs.minDirectX || 'TBD'}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-500 uppercase flex items-center gap-2">
                  <HardDrive className="w-3.5 h-3.5 text-emerald-400" /> STORAGE:
                </span>
                <span className="text-emerald-400 font-bold">{specs.minStorage || 'TBD'}</span>
              </div>
            </div>
          </div>

          {/* Recommended Requirements (TBD) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-emerald-950/20 via-white/[0.02] to-black backdrop-blur-xl border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.15)] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-emerald-500/30">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-wide">RECOMMENDED SPECS</h3>
                  <span className="text-xs font-mono text-emerald-400 uppercase">Target: 4K 144FPS+ (PC Ultra)</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs border border-emerald-500/40">
                TBD
              </span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-gray-500 uppercase flex items-center gap-2">
                  <Tv className="w-3.5 h-3.5 text-emerald-400" /> OS:
                </span>
                <span className="text-emerald-400 font-bold">{specs.recOs || 'TBD'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-gray-500 uppercase flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" /> PROCESSOR (CPU):
                </span>
                <span className="text-emerald-400 font-bold">{specs.recProcessor || 'TBD'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-gray-500 uppercase flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" /> MEMORY (RAM):
                </span>
                <span className="text-emerald-400 font-bold">{specs.recMemory || 'TBD'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-gray-500 uppercase flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> GRAPHICS (GPU):
                </span>
                <span className="text-emerald-400 font-bold">{specs.recGraphics || 'TBD'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-gray-500 uppercase flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" /> DIRECTX / API:
                </span>
                <span className="text-emerald-400 font-bold">{specs.recDirectX || 'TBD'}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-500 uppercase flex items-center gap-2">
                  <HardDrive className="w-3.5 h-3.5 text-emerald-400" /> STORAGE:
                </span>
                <span className="text-emerald-400 font-bold">{specs.recStorage || 'TBD'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
