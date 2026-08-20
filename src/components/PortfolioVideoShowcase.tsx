import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  Maximize2,
  RotateCcw,
  Volume2,
  VolumeX,
  Film,
  Gamepad2,
  Globe,
  User,
  Zap,
  Cpu,
  Video,
  ArrowUp,
  MessageSquare,
  MousePointer,
  Sparkles,
  Flame,
  Radio,
  Crosshair,
  Target,
  Truck,
  Plane,
  Clock,
  ExternalLink,
  Shield,
  Download,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  Layers,
  Sparkle,
} from 'lucide-react';
import { fetchPublicSettings } from '../lib/api';
import { exportPortfolioVideo } from '../lib/videoExporter';
import { DevUpdatePicture } from '../types';

export interface PortfolioVideoShowcaseProps {
  setActiveTab?: (tab: string) => void;
}

interface DevUpdateItem {
  id: string;
  type: 'announcement' | 'video' | 'picture';
  tag: string;
  badge: string;
  title: string;
  subtitle: string;
  date: string;
  picUrl?: string;
}

export const PortfolioVideoShowcase: React.FC<PortfolioVideoShowcaseProps> = ({ setActiveTab }) => {
  const TOTAL_DURATION = 18; // 18-second hyper-fast kinetic edit
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // PAUSED on site enter
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true); // UNMUTED by default
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeHero, setActiveHero] = useState<'marcus' | 'laura' | 'john'>('marcus');

  // Video Mode: 'default' (kinetic reel) | 'custom' (uploaded video) | 'blank' (Portfolio Coming Soon)
  const [videoMode, setVideoMode] = useState<'default' | 'custom' | 'blank'>('default');
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);

  // Active Dev Update Slide Index: 0 = Dev Update 1 (Apex Editor Demo Out Now), 1 = Dev Update 2 (Video Reel / Custom Video), etc.
  const [currentUpdateIndex, setCurrentUpdateIndex] = useState<number>(0);

  // Dev Updates Pictures State (from custom uploaded photos/screenshots by owner)
  const [devPictures, setDevPictures] = useState<DevUpdatePicture[]>([]);

  // Video Export Progress state
  const [isExportingVideo, setIsExportingVideo] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatusText, setExportStatusText] = useState('');

  const containerRef = useRef<HTMLDivElement | null>(null);
  const customVideoRef = useRef<HTMLVideoElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastStepRef = useRef<number>(-1);

  // Unified list of Dev Updates: Currently only Dev Update 1 (additional updates can be added on request)
  const updatesList: DevUpdateItem[] = [
    {
      id: 'update-1-demo-live',
      type: 'announcement',
      tag: 'DEV UPDATE 1',
      badge: 'OFFICIAL MILESTONE 01',
      title: 'THE APEX EDITOR DEMO IS OUT NOW!',
      subtitle:
        'Official milestone release! Experience the full interactive Apex Editor in your browser right now — featuring real-time AI media generation, 60FPS canvas timeline, Topaz neural engine, and zero-latency Rust core.',
      date: 'Live Now',
    },
  ];

  const totalUpdates = updatesList.length;
  const activeUpdate = updatesList[currentUpdateIndex % totalUpdates] || updatesList[0];

  const handleNextUpdate = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isPlaying) handlePause();
    setCurrentUpdateIndex((prev) => (prev + 1) % totalUpdates);
  };

  const handlePrevUpdate = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isPlaying) handlePause();
    setCurrentUpdateIndex((prev) => (prev - 1 + totalUpdates) % totalUpdates);
  };

  const handleDownloadVideo = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const customVid = customVideoUrl || localStorage.getItem('apex_custom_portfolio_video');
    if (videoMode === 'custom' && customVid) {
      try {
        const response = await fetch(customVid);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Apex_Syndicate_Dev_Updates_Video.mp4';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        const a = document.createElement('a');
        a.href = customVid;
        a.download = 'Apex_Syndicate_Dev_Updates_Video.mp4';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      return;
    }

    try {
      setIsExportingVideo(true);
      setExportProgress(0);
      setExportStatusText('Initializing high-definition video encoder for CapCut...');

      const mp4Blob = await exportPortfolioVideo((progress, status) => {
        setExportProgress(progress);
        setExportStatusText(status);
      });

      const url = URL.createObjectURL(mp4Blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Apex_Syndicate_Dev_Updates_Reel.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Video export error:', err);
    } finally {
      setIsExportingVideo(false);
    }
  };

  // Load video configuration & Dev pictures from settings
  const loadVideoConfig = async () => {
    try {
      const settings = await fetchPublicSettings();

      if (settings.devUpdatePictures && settings.devUpdatePictures.length > 0) {
        setDevPictures(settings.devUpdatePictures);
      }

      if (settings.portfolioVideoMode === 'blank') {
        setVideoMode('blank');
        setCustomVideoUrl(null);
        localStorage.setItem('apex_portfolio_video_mode', 'blank');
        localStorage.removeItem('apex_custom_portfolio_video');
        return;
      }

      if (settings.portfolioVideoMode === 'custom' && settings.portfolioVideoUrl) {
        setVideoMode('custom');
        setCustomVideoUrl(settings.portfolioVideoUrl);
        localStorage.setItem('apex_portfolio_video_mode', 'custom');
        localStorage.setItem('apex_custom_portfolio_video', settings.portfolioVideoUrl);
        return;
      }

      if (settings.portfolioVideoMode === 'default' || !settings.portfolioVideoUrl) {
        setVideoMode('default');
        setCustomVideoUrl(null);
        localStorage.setItem('apex_portfolio_video_mode', 'default');
        localStorage.removeItem('apex_custom_portfolio_video');
        return;
      }
    } catch (e) {
      console.warn('Could not fetch server video settings, using client fallback', e);
    }

    const localMode = localStorage.getItem('apex_portfolio_video_mode');
    const localUrl = localStorage.getItem('apex_custom_portfolio_video');

    if (localMode === 'blank') {
      setVideoMode('blank');
      setCustomVideoUrl(null);
    } else if (localMode === 'custom' && localUrl && !localUrl.startsWith('blob:')) {
      setVideoMode('custom');
      setCustomVideoUrl(localUrl);
    } else {
      setVideoMode('default');
      setCustomVideoUrl(null);
    }
  };

  useEffect(() => {
    loadVideoConfig();

    const handleVideoUpdate = () => {
      loadVideoConfig();
    };

    const interval = setInterval(loadVideoConfig, 4000);
    window.addEventListener('apex_video_updated', handleVideoUpdate);
    window.addEventListener('storage', handleVideoUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('apex_video_updated', handleVideoUpdate);
      window.removeEventListener('storage', handleVideoUpdate);
    };
  }, []);

  // Web Audio Beat Synthesizer
  const playSoundtrackStep = (step: number) => {
    if (!isAudioEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const beatInBar = step % 8;

      if (beatInBar === 0 || beatInBar === 4 || beatInBar === 6) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(36, now + 0.12);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.14);
      }

      if (beatInBar === 2 || beatInBar === 6) {
        const bufferSize = ctx.sampleRate * 0.08;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        noise.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now);
      }

      const chordFrequencies = [220, 261.63, 329.63, 392.0];
      if (beatInBar === 0 || beatInBar === 3 || beatInBar === 6) {
        chordFrequencies.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.22);
        });
      }
    } catch (err) {
      // Audio fallback
    }
  };

  useEffect(() => {
    if (!isPlaying || videoMode !== 'default') return;
    const heroes: ('marcus' | 'laura' | 'john')[] = ['marcus', 'laura', 'john'];
    const interval = setInterval(() => {
      setActiveHero((prev) => {
        const idx = heroes.indexOf(prev);
        return heroes[(idx + 1) % heroes.length];
      });
    }, 1800);
    return () => clearInterval(interval);
  }, [isPlaying, videoMode]);

  useEffect(() => {
    let animFrame: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      if (isPlaying && videoMode === 'default') {
        const delta = (now - lastTime) / 1000;
        setCurrentTime((prev) => {
          const next = prev + delta;
          if (next >= TOTAL_DURATION) {
            return 0;
          }
          return next;
        });
      }
      lastTime = now;
      animFrame = requestAnimationFrame(tick);
    };

    animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
  }, [isPlaying, videoMode]);

  const getStage = () => {
    if (currentTime < 3.2) return 1;
    if (currentTime < 8.5) return 2;
    if (currentTime < 14.0) return 3;
    return 4;
  };

  const stage = getStage();

  useEffect(() => {
    if (!isPlaying || videoMode !== 'default') return;
    const step = Math.floor(currentTime * 8);
    if (step !== lastStepRef.current) {
      lastStepRef.current = step;
      playSoundtrackStep(step);
    }
  }, [currentTime, isPlaying, isAudioEnabled, stage, videoMode]);

  const handleStartPlay = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    } catch (e) {}

    setIsPlaying(true);
    if (videoMode === 'custom' && customVideoRef.current) {
      customVideoRef.current.play().catch(() => {});
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (videoMode === 'custom' && customVideoRef.current) {
      customVideoRef.current.pause();
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const isDarkMode = stage === 3;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 animate-fadeIn">
      {/* =========================================================================
          DEV UPDATES SHOWCASE CONTAINER (UNIFIED MULTI-UPDATE SLIDER)
          ========================================================================= */}
      <div className="space-y-3">
        {/* TOP BAR: SHOWCASE TITLE & SLIDE NAVIGATION */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#FF6321]/20 to-amber-500/15 border border-[#FF6321]/40 text-[#FF6321] text-xs font-mono font-black uppercase tracking-widest shadow-[0_0_20px_rgba(255,99,33,0.3)] animate-border-glow">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-400" />
              <span>APEX SYNDICATE // DEV UPDATES</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1.5 flex items-center gap-2.5">
              <span>{activeUpdate.tag}:</span>
              <span className="bg-gradient-to-r from-[#FF6321] via-amber-400 to-[#FF4500] bg-clip-text text-transparent animate-shimmer-text">
                {activeUpdate.title}
              </span>
            </h2>
          </div>

          {/* Right Side: Prev / Next Arrow Switcher (shown when multi-updates exist) or Milestone Badge + Founder Tag */}
          <div className="flex items-center gap-2">
            {totalUpdates > 1 ? (
              <div className="flex items-center p-1 rounded-2xl bg-black/80 border border-white/15 backdrop-blur-xl">
                <button
                  type="button"
                  onClick={handlePrevUpdate}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono font-black uppercase tracking-wider flex items-center gap-1 text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                  title="Previous Dev Update"
                >
                  <ChevronLeft className="w-4 h-4 text-[#FF6321]" />
                  <span className="hidden sm:inline">PREV</span>
                </button>

                <div className="px-3 py-1 text-xs font-mono font-black text-white bg-white/5 rounded-lg border border-white/10 mx-1">
                  <span className="text-[#FF6321]">{currentUpdateIndex + 1}</span> / {totalUpdates}
                </div>

                <button
                  type="button"
                  onClick={handleNextUpdate}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono font-black uppercase tracking-wider flex items-center gap-1 text-black bg-[#FF6321] hover:bg-[#FF8A50] transition-all cursor-pointer shadow-[0_0_15px_rgba(255,99,33,0.4)]"
                  title="Next Dev Update"
                >
                  <span className="hidden sm:inline">NEXT</span>
                  <ChevronRight className="w-4 h-4 text-black" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-black/80 border border-[#FF6321]/40 text-[#FF6321] text-xs font-mono font-bold backdrop-blur-xl">
                <span className="w-2 h-2 rounded-full bg-[#FF6321] animate-ping" />
                <span>DEV UPDATE #1 LIVE</span>
              </div>
            )}

            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-gray-300 bg-black/60 border border-white/15 px-3.5 py-2 rounded-2xl backdrop-blur-xl">
              <User className="w-3.5 h-3.5 text-[#FF6321]" />
              <span>FOUNDER: <strong className="text-white font-black uppercase">OKERE CHIEMEKA</strong></span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            MAIN DEV UPDATE DISPLAY FRAME
            ========================================================================= */}
        <div
          ref={containerRef}
          id="portfolio-dev-update-frame"
          className={`relative w-full aspect-video min-h-[380px] sm:min-h-[460px] rounded-3xl transition-all duration-300 border-2 overflow-hidden flex flex-col justify-between select-none shadow-[0_25px_80px_rgba(0,0,0,0.8)] ${
            activeUpdate.type === 'announcement'
              ? 'bg-gradient-to-br from-[#0e0907] via-[#08080c] to-[#040508] border-[#FF6321] shadow-[0_0_80px_rgba(255,99,33,0.35)]'
              : isDarkMode
              ? 'bg-[#030306] border-[#FF6321]/60 text-white shadow-[0_25px_70px_rgba(255,99,33,0.35)]'
              : 'bg-[#0a0a0f] border-[#FF6321]/40 text-white shadow-[0_20px_60px_rgba(0,0,0,0.4)]'
          } ${isFullscreen ? 'rounded-none border-none shadow-none' : ''}`}
        >
          {/* Animated Background Cyber Matrix & Neon Light Orbs */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#FF6321_1px,transparent_1px)] [background-size:28px_28px] animate-grid-drift" />
          <div className="absolute -top-32 left-1/4 w-96 h-96 bg-[#FF6321]/25 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
          <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-[#00F0FF]/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

          {/* Floating Prev & Next Side Arrows (shown only when multi-updates exist) */}
          {totalUpdates > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevUpdate}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/85 hover:bg-[#FF6321] text-white hover:text-black border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-2xl active:scale-90 z-30 group"
                title="Previous Dev Update"
              >
                <ChevronLeft className="w-6 h-6 transform group-hover:-translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={handleNextUpdate}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/85 hover:bg-[#FF6321] text-white hover:text-black border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-2xl active:scale-90 z-30 group"
                title="Next Dev Update"
              >
                <ChevronRight className="w-6 h-6 transform group-hover:translate-x-0.5 transition-transform" />
              </button>
            </>
          )}

          {/* SLIDE 1: DEV UPDATE 1 — VIBRANT GIANT TEXT COVERING SCREEN */}
          {activeUpdate.type === 'announcement' && (
            <div className="relative z-10 flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 text-center items-center">
              {/* Top Milestone Badge */}
              <div className="w-full flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF6321]/20 border border-[#FF6321]/60 text-[#FF6321] shadow-[0_0_20px_rgba(255,99,33,0.4)] animate-pulse">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span className="font-black text-[11px] sm:text-xs uppercase tracking-widest">
                    DEV UPDATE 1 // OFFICIAL MILESTONE RELEASE
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-black/70 border border-[#00F0FF]/40 text-[#00F0FF] text-[11px] font-mono font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>IN-BROWSER WORKSTATION READY</span>
                </div>
              </div>

              {/* CENTER MASSIVE VIBRANT TEXT HEADLINE COVERING MOST OF SCREEN */}
              <div className="my-auto space-y-4 sm:space-y-6 max-w-4xl px-4">
                <motion.div
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-3"
                >
                  <h3 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[1.05] bg-gradient-to-r from-[#FF6321] via-amber-300 via-yellow-200 to-[#00F0FF] bg-clip-text text-transparent drop-shadow-[0_0_45px_rgba(255,99,33,0.9)] animate-shimmer-text">
                    THE APEX EDITOR DEMO IS OUT NOW!
                  </h3>

                  <p className="text-sm sm:text-base md:text-lg text-gray-200 font-light max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                    Experience our flagship video creation suite live in your browser right now — featuring real-time AI media generation, 60FPS canvas timeline, Topaz neural upscaler, and zero-latency Rust core.
                  </p>
                </motion.div>

                {/* Feature highlights pill strip */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-1">
                  <span className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] border border-white/15 text-gray-200 text-xs font-mono font-semibold flex items-center gap-1.5 backdrop-blur-md">
                    <Zap className="w-3.5 h-3.5 text-[#FF6321]" /> 60FPS Canvas Timeline
                  </span>
                  <span className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] border border-white/15 text-gray-200 text-xs font-mono font-semibold flex items-center gap-1.5 backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Topaz Neural Upscaler
                  </span>
                  <span className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] border border-white/15 text-gray-200 text-xs font-mono font-semibold flex items-center gap-1.5 backdrop-blur-md">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Rust AST Kernel
                  </span>
                </div>

                {/* PROMINENT INTERACTIVE LAUNCH ACTION BUTTONS */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (setActiveTab) {
                        setActiveTab('apex-editor-demo');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else {
                        window.open('https://apex-editor-demo.vercel.app/', '_blank');
                      }
                    }}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF6321] via-amber-400 to-[#FF4500] hover:from-[#FF8A50] hover:to-amber-300 text-black font-black text-sm sm:text-base font-mono uppercase tracking-wider flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(255,99,33,0.8)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <Zap className="w-5 h-5 fill-black animate-bounce" />
                    <span>TRY APEX EDITOR DEMO NOW</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (setActiveTab) {
                        setActiveTab('apex-editor');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-black/80 hover:bg-white/10 text-white font-mono font-black text-xs sm:text-sm uppercase tracking-wider border border-white/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Layers className="w-4 h-4 text-[#FF6321]" />
                    <span>VIEW PRODUCT SPECS</span>
                  </button>
                </div>
              </div>

              {/* Bottom Status Bar */}
              <div className="w-full pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-gray-400">
                <div className="flex items-center gap-4">
                  <span>Instagram: <strong className="text-white font-bold">@apexsyndicateng</strong></span>
                  <span>TikTok: <strong className="text-white font-bold">@apex.syndicateng</strong></span>
                </div>
                <div className="text-[11px] text-[#FF6321] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Interactive Cloud Workstation Active</span>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 2: DEV UPDATE 2 — KINETIC VIDEO REEL OR CUSTOM DEVLOG */}
          {activeUpdate.type === 'video' && (
            <>
              {videoMode === 'custom' && customVideoUrl ? (
                <div
                  className="relative flex-1 min-h-0 w-full flex items-center justify-center bg-black cursor-pointer overflow-hidden"
                  onClick={() => {
                    if (isPlaying) handlePause();
                    else handleStartPlay();
                  }}
                >
                  <video
                    ref={customVideoRef}
                    src={customVideoUrl}
                    className="w-full h-full object-contain"
                    playsInline
                    loop
                    muted={!isAudioEnabled}
                    onEnded={() => setIsPlaying(false)}
                  />

                  {!isPlaying && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FF6321] text-black flex items-center justify-center shadow-[0_0_40px_rgba(255,99,33,0.8)] animate-pulse">
                        <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
                      </div>
                      <span className="text-white font-mono font-black text-xs uppercase tracking-widest bg-black/80 px-4 py-1.5 rounded-full border border-white/20">
                        CLICK TO WATCH DEV VIDEO
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                /* Kinetic Dynamic Showcase Reel */
                <div
                  className="relative flex-1 min-h-0 w-full flex items-center justify-center cursor-pointer overflow-hidden p-6 text-center"
                  onClick={() => {
                    if (isPlaying) handlePause();
                    else handleStartPlay();
                  }}
                >
                  <AnimatePresence mode="wait">
                    {stage === 1 && (
                      <motion.div
                        key="stage1"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.1, opacity: 0 }}
                        className="space-y-4 max-w-xl"
                      >
                        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#FF6321]/20 text-[#FF6321] text-xs font-mono font-black border border-[#FF6321]/40">
                          <Zap className="w-4 h-4 animate-bounce" /> APEX SYNDICATE ARCHITECTURE
                        </div>
                        <h3 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight">
                          ENGINEERED TO <span className="text-[#FF6321]">INNOVATE</span>
                        </h3>
                        <p className="text-gray-300 text-sm font-light">
                          Commercial software tools, zero-latency editors, and next-gen gaming universes.
                        </p>
                      </motion.div>
                    )}

                    {stage === 2 && (
                      <motion.div
                        key="stage2"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.1, opacity: 0 }}
                        className="space-y-4 max-w-xl"
                      >
                        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-mono font-black border border-cyan-500/40">
                          <Cpu className="w-4 h-4 animate-spin" /> FLAGSHIP CODE CREATION
                        </div>
                        <h3 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight">
                          APEX <span className="text-cyan-400">EDITOR</span>
                        </h3>
                        <p className="text-gray-300 text-sm font-light">
                          GPU-Accelerated 60FPS Canvas • Rust Kernel AST Parser • Instant Token Verification
                        </p>
                      </motion.div>
                    )}

                    {stage === 3 && (
                      <motion.div
                        key="stage3"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.1, opacity: 0 }}
                        className="space-y-4 max-w-xl"
                      >
                        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-mono font-black border border-red-500/40">
                          <Gamepad2 className="w-4 h-4 animate-pulse" /> OPEN-WORLD GAMING
                        </div>
                        <h3 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight">
                          GANGSTER <span className="text-red-500">REVOLUTION</span>
                        </h3>
                        <p className="text-gray-300 text-sm font-light">
                          Next-Gen Syndicate Warfare • Ray-Traced Downtown Turf • High-Octane Vehicles
                        </p>
                      </motion.div>
                    )}

                    {stage === 4 && (
                      <motion.div
                        key="stage4"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.1, opacity: 0 }}
                        className="space-y-4 max-w-xl"
                      >
                        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#FF6321]/20 text-[#FF6321] text-xs font-mono font-black border border-[#FF6321]/40">
                          <Globe className="w-4 h-4 animate-bounce" /> OFFICIAL SYNDICATE HUB
                        </div>
                        <h3 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tight">
                          APEXSYNDICATE.<span className="text-[#FF6321]">COM.NG</span>
                        </h3>
                        <p className="text-gray-300 text-sm font-mono">
                          DM US ON INSTAGRAM: @APEXSYNDICATENG
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!isPlaying && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FF6321] text-black flex items-center justify-center shadow-[0_0_40px_rgba(255,99,33,0.8)] animate-pulse">
                        <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
                      </div>
                      <span className="text-white font-mono font-black text-xs uppercase tracking-widest bg-black/80 px-4 py-1.5 rounded-full border border-white/20">
                        CLICK TO PLAY DEV SHOWCASE REEL
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Video Timeline Controls */}
              <div className="relative z-20 px-5 py-2.5 bg-black/85 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-black/20 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF6321] via-amber-400 to-[#FF4500] transition-all duration-75"
                    style={{ width: `${(currentTime / TOTAL_DURATION) * 100}%` }}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isPlaying) handlePause();
                      else handleStartPlay();
                    }}
                    className={`px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer ${
                      isPlaying
                        ? 'bg-[#FF6321] hover:bg-[#FF8A50] text-black shadow-[0_0_15px_rgba(255,99,33,0.4)]'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-pulse'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 fill-current" />
                        <span>PAUSE</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                        <span>PLAY REEL</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentTime(0);
                      handleStartPlay();
                    }}
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title="Restart Reel"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <span className="font-extrabold text-[11px] text-gray-300 hidden sm:inline">
                    {isPlaying ? '▶ REEL ACTIVE (CLICK TO PAUSE)' : '⏸ PAUSED'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadVideo}
                    className="px-2.5 py-1.5 rounded-xl bg-[#FF6321]/20 hover:bg-[#FF6321] text-[#FF6321] hover:text-black font-extrabold flex items-center gap-1.5 transition-all text-[11px] border border-[#FF6321]/40 cursor-pointer"
                    title="Download MP4 Video"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">DOWNLOAD MP4</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFullscreen();
                    }}
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title="Fullscreen Reel"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* SLIDE 3+: CUSTOM UPLOADED DEV UPDATE PICTURE (IF ANY) */}
          {activeUpdate.type === 'picture' && activeUpdate.picUrl && (
            <div className="relative flex-1 min-h-0 w-full flex flex-col justify-between bg-black overflow-hidden p-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={activeUpdate.picUrl}
                  alt={activeUpdate.title}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/40 pointer-events-none" />
              </div>

              {/* Top badge */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-3.5 py-1 rounded-xl bg-[#FF6321] text-black font-mono font-black text-xs uppercase">
                  {activeUpdate.tag}
                </span>
                <span className="px-3 py-1 rounded-xl bg-black/80 border border-white/20 text-gray-300 text-xs font-mono">
                  {activeUpdate.date}
                </span>
              </div>

              {/* Bottom title */}
              <div className="relative z-10 space-y-1 max-w-2xl bg-black/80 p-4 rounded-2xl border border-white/15 backdrop-blur-md">
                <h4 className="text-xl sm:text-2xl font-black text-white uppercase">
                  {activeUpdate.title}
                </h4>
                <p className="text-xs sm:text-sm text-gray-300">
                  {activeUpdate.subtitle}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM DOTS INDICATOR & QUICK JUMP STRIP (shown only when multi-updates exist) */}
        {totalUpdates > 1 && (
          <div className="flex items-center justify-center gap-2 pt-1">
            {updatesList.map((update, idx) => (
              <button
                key={update.id}
                type="button"
                onClick={() => {
                  if (isPlaying) handlePause();
                  setCurrentUpdateIndex(idx);
                }}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentUpdateIndex
                    ? 'w-8 h-2.5 bg-gradient-to-r from-[#FF6321] to-amber-400 shadow-[0_0_12px_rgba(255,99,33,0.8)]'
                    : 'w-2.5 h-2.5 bg-white/20 hover:bg-white/50'
                }`}
                title={`Go to ${update.tag}: ${update.title}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* MP4 Export Progress Modal */}
      {isExportingVideo && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b0c10] border-2 border-[#FF6321] rounded-3xl p-8 max-w-lg w-full text-center space-y-6 shadow-[0_0_60px_rgba(255,99,33,0.4)] animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-[#FF6321]/20 border border-[#FF6321]/40 flex items-center justify-center mx-auto text-[#FF6321]">
              <Film className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white uppercase tracking-wider">
                GENERATING CAPCUT-READY MP4
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                Rendering 18-second kinetic video with H.264 video track and soundtrack audio. 100% compatible with CapCut, Premiere, & mobile editors.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-gray-300 truncate max-w-[280px]">{exportStatusText || 'Rendering frames...'}</span>
                <span className="text-[#FF6321]">{exportProgress}%</span>
              </div>
              <div className="w-full h-3 bg-black/80 rounded-full border border-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FF6321] via-amber-400 to-[#FF6321] transition-all duration-150 rounded-full"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>

            <div className="text-[11px] font-mono text-gray-500">
              Please do not close this tab until the MP4 video download triggers automatically.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

