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
} from 'lucide-react';
import { fetchPublicSettings } from '../lib/api';
import { exportPortfolioVideo } from '../lib/videoExporter';

export const PortfolioVideoShowcase: React.FC = () => {
  const TOTAL_DURATION = 18; // 18-second hyper-fast kinetic edit
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // PAUSED on site enter
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true); // UNMUTED by default
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeHero, setActiveHero] = useState<'marcus' | 'laura' | 'john'>('marcus');

  // Video Mode: 'default' (kinetic reel) | 'custom' (uploaded video) | 'blank' (Portfolio Coming Soon)
  const [videoMode, setVideoMode] = useState<'default' | 'custom' | 'blank'>('default');
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);

  // Video Export Progress state
  const [isExportingVideo, setIsExportingVideo] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatusText, setExportStatusText] = useState('');

  const containerRef = useRef<HTMLDivElement | null>(null);
  const customVideoRef = useRef<HTMLVideoElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastStepRef = useRef<number>(-1);

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

  // Load video configuration from settings / localStorage (Server authoritative)
  const loadVideoConfig = async () => {
    try {
      // 1. Fetch public server settings (authoritative for all visitors across all devices)
      const settings = await fetchPublicSettings();
      
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

    // 2. Client fallback (e.g. offline dev or instant update)
    const localMode = localStorage.getItem('apex_portfolio_video_mode');
    const localUrl = localStorage.getItem('apex_custom_portfolio_video');

    if (localMode === 'blank') {
      setVideoMode('blank');
      setCustomVideoUrl(null);
    } else if (localMode === 'custom' && localUrl && !localUrl.startsWith('blob:')) {
      setVideoMode('custom');
      setCustomVideoUrl(localUrl);
    } else if (localMode === 'default' || !localUrl) {
      setVideoMode('default');
      setCustomVideoUrl(null);
    } else if (localUrl && !localUrl.startsWith('blob:')) {
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

    // Real-time synchronization across devices and tabs
    const interval = setInterval(loadVideoConfig, 4000);
    window.addEventListener('apex_video_updated', handleVideoUpdate);
    window.addEventListener('storage', handleVideoUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('apex_video_updated', handleVideoUpdate);
      window.removeEventListener('storage', handleVideoUpdate);
    };
  }, []);

  // Web Audio Kinetic Beat Synthesizer (Fast electronic beat & chord stabs - No Voiceover)
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

      // 1. Kick Drum on beats 0, 4 and syncopated 6
      if (beatInBar === 0 || beatInBar === 4 || beatInBar === 6) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(36, now + 0.09);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
      }

      // 2. Crisp Hi-Hat on every other sub-beat
      if (beatInBar % 2 === 1) {
        const bufferSize = ctx.sampleRate * 0.03;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(7000, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now);
      }

      // 3. Cyber Bass / Synth Chord Stabs on scene transitions
      if (step % 16 === 0) {
        const chordFreqs = stage === 3 ? [65.41, 130.81, 196.0] : [110.0, 220.0, 277.18];
        chordFreqs.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.12, now);
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

  // Auto-cycle protagonist cards in Stage 3 for high kinetic animation
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

  // High 60FPS Ticker for ultra-fast motion
  useEffect(() => {
    let animFrame: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      if (isPlaying && videoMode === 'default') {
        const delta = (now - lastTime) / 1000;
        setCurrentTime((prev) => {
          const next = prev + delta;
          if (next >= TOTAL_DURATION) {
            return 0; // Seamless fast loop
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

  // Kinetic Stage Timeline Mapping (0.0s to 18.0s)
  const getStage = () => {
    if (currentTime < 3.2) return 1;  // Intro Kinetic Text & Founder Reveal
    if (currentTime < 8.5) return 2;  // iOS Notification & Apex Editor
    if (currentTime < 14.0) return 3; // Dark Mode Snap & Gangster Revolution
    return 4;                         // Bio Link CTA & DM ME
  };

  const stage = getStage();

  // Sync beats on kinetic frame shifts
  useEffect(() => {
    if (!isPlaying || videoMode !== 'default') return;

    const step = Math.floor(currentTime * 8);
    if (step !== lastStepRef.current) {
      lastStepRef.current = step;
      playSoundtrackStep(step);
    }
  }, [currentTime, isPlaying, isAudioEnabled, stage, videoMode]);

  const handleStartPlay = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    setIsPlaying(true);
    if (customVideoRef.current) {
      customVideoRef.current.play().catch(() => {});
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (customVideoRef.current) {
      customVideoRef.current.pause();
    }
  };

  const toggleAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    setIsAudioEnabled(!isAudioEnabled);
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

  const isDarkMode = stage === 3; // Dark mode switch in scene 3

  // =========================================================================
  // IF VIDEO IS REMOVED / SET TO BLANK: DISPLAY "DEV UPDATES COMING SOON"
  // =========================================================================
  if (videoMode === 'blank') {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-4">
        {/* HEADER LABEL */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] text-xs font-mono font-bold uppercase tracking-widest">
              <Clock className="w-3.5 h-3.5 animate-pulse" /> CREATOR DEVLOG & UPDATES
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-wider mt-1.5">
              DEV UPDATES // <span className="text-[#FF6321]">COMING SOON</span>
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-gray-400 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl">
            <User className="w-3.5 h-3.5 text-[#FF6321]" />
            <span>FOUNDER: <strong className="text-white font-extrabold uppercase">OKERE CHIEMEKA</strong></span>
          </div>
        </div>

        {/* COMING SOON CYBER CARD */}
        <div
          id="portfolio-coming-soon-card"
          className="relative w-full aspect-video rounded-3xl bg-gradient-to-b from-[#0e0e14] via-[#07070a] to-[#040406] border-2 border-white/10 p-6 sm:p-12 overflow-hidden flex flex-col justify-between items-center text-center shadow-[0_25px_80px_rgba(0,0,0,0.8)] select-none"
        >
          {/* Animated Background Grid & Radar Sweep */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#FF6321_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FF6321]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Status Indicators */}
          <div className="relative z-10 w-full flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="font-bold text-[11px] uppercase tracking-wider text-amber-400">
                IN PRODUCTION • DEVLOG RENDERING
              </span>
            </div>

            <div className="text-[11px] text-gray-400 font-mono hidden sm:block">
              Apex Syndicate Creation Logs
            </div>
          </div>

          {/* Center Main Coming Soon Messaging */}
          <div className="relative z-10 my-auto space-y-4 max-w-2xl">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#FF6321]/10 border-2 border-[#FF6321]/40 text-[#FF6321] shadow-[0_0_40px_rgba(255,99,33,0.3)] mb-2"
            >
              <Film className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse" />
            </motion.div>

            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight font-sans drop-shadow-lg"
            >
              DEV UPDATES <span className="text-[#FF6321]">COMING SOON</span>
            </motion.h3>

            <p className="text-sm sm:text-base text-gray-300 font-light max-w-xl mx-auto leading-relaxed">
              Video updates showing in-progress development, sneak peeks, and behind-the-scenes progress on everything being created at Apex Syndicate are coming soon!
            </p>

            {/* Project Feature Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-w-xl mx-auto pt-2 text-left font-mono text-xs">
              <div className="p-3 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <Cpu className="w-3.5 h-3.5" /> Apex Editor
                </div>
                <div className="text-[10px] text-gray-400">Flagship code creator devlogs</div>
              </div>

              <div className="p-3 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 text-[#FF6321] font-bold">
                  <Gamepad2 className="w-3.5 h-3.5" /> Gangster Rev.
                </div>
                <div className="text-[10px] text-gray-400">Open-world action gameplay logs</div>
              </div>

              <div className="p-3 rounded-2xl bg-black/60 border border-white/10 space-y-1 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Globe className="w-3.5 h-3.5" /> Project Logs
                </div>
                <div className="text-[10px] text-gray-400">Updates & bio links on IG</div>
              </div>
            </div>
          </div>

          {/* Bottom Social Handles & Footer */}
          <div className="relative z-10 w-full pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-gray-400">
            <div className="flex items-center gap-4">
              <span>Instagram: <strong className="text-white font-bold">@apexsyndicateng</strong></span>
              <span>TikTok: <strong className="text-white font-bold">@apex.syndicateng</strong></span>
            </div>

            <div className="text-[11px] text-[#FF6321] font-bold uppercase tracking-wider">
              Website URL In Bio
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ACTIVE VIDEO SHOWCASE (DEFAULT KINETIC REEL OR CUSTOM UPLOADED VIDEO)
  // =========================================================================
  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      {/* HEADER LABEL */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] text-xs font-mono font-bold uppercase tracking-widest">
            <Film className="w-3.5 h-3.5 animate-pulse" />
            {videoMode === 'custom' ? 'CUSTOM CREATOR DEVLOG' : 'PROJECT UPDATES & DEVLOG REEL'}
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-wider mt-1.5">
            APEX SYNDICATE // <span className="text-[#FF6321]">DEV UPDATES & CREATION LOGS</span>
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-gray-400 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl">
          <User className="w-3.5 h-3.5 text-[#FF6321]" />
          <span>FOUNDER: <strong className="text-white font-extrabold uppercase">OKERE CHIEMEKA</strong></span>
        </div>
      </div>

      {/* VIDEO CONTAINER FRAME (PAUSED & WAITING ON SITE ENTER) */}
      <div
        ref={containerRef}
        id="portfolio-video-frame"
        className={`relative w-full aspect-video rounded-3xl transition-colors duration-300 border-2 overflow-hidden flex flex-col justify-between group select-none shadow-2xl ${
          isDarkMode
            ? 'bg-[#030306] border-[#FF6321]/60 text-white shadow-[0_25px_70px_rgba(255,99,33,0.35)]'
            : 'bg-[#f4f4f7] border-gray-300 text-slate-900 shadow-[0_20px_60px_rgba(0,0,0,0.18)]'
        } ${isFullscreen ? 'rounded-none border-none shadow-none' : ''}`}
      >
        {/* Soft Vignette Overlay */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
            isDarkMode
              ? 'bg-[radial-gradient(circle_at_center,rgba(255,99,33,0.2)_0%,rgba(3,3,6,0.98)_80%)]'
              : 'bg-[radial-gradient(circle_at_center,rgba(255,255,255,1)_30%,rgba(210,210,225,0.9)_100%)]'
          }`}
        />

        {/* CUSTOM UPLOADED MP4 VIDEO PLAYER (IF OWNER UPLOADED NEW VIDEO) */}
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
              loop
              playsInline
              preload="auto"
              muted={!isAudioEnabled}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={() => {
                if (customVideoRef.current) {
                  setCurrentTime(customVideoRef.current.currentTime);
                }
              }}
              onError={() => {
                console.warn('Custom portfolio video failed to load or file missing, reverting to default kinetic reel');
                setVideoMode('default');
                setCustomVideoUrl(null);
                localStorage.setItem('apex_portfolio_video_mode', 'default');
              }}
            />
            
            {/* Quick Pause overlay on hover when playing */}
            {isPlaying && (
              <div className="absolute top-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePause();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-black/80 hover:bg-[#FF6321] text-white hover:text-black border border-white/20 font-mono font-bold text-xs flex items-center gap-1.5 shadow-lg backdrop-blur-sm transition-all"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>PAUSE VIDEO</span>
                </button>
              </div>
            )}

            {!isPlaying && (
              <button
                id="btn-play-custom-video"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartPlay();
                }}
                className="absolute inset-0 z-40 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center gap-3 text-white cursor-pointer"
              >
                <div className="w-20 h-20 rounded-full bg-[#FF6321] text-black flex items-center justify-center shadow-2xl animate-pulse hover:scale-110 transition-transform">
                  <Play className="w-10 h-10 fill-current ml-1" />
                </div>
                <span className="font-extrabold font-mono text-sm uppercase tracking-widest bg-black/70 px-4 py-1.5 rounded-full border border-white/10">
                  VIDEO PAUSED • CLICK TO PLAY
                </span>
              </button>
            )}
          </div>
        ) : (
          <>
            {/* PAUSED OVERLAY ON SITE ENTER / PAUSED STATE (CLICK TO PLAY SHOWCASE) */}
            {!isPlaying && (
              <div
                id="portfolio-click-to-play-overlay"
                onClick={handleStartPlay}
                className="absolute inset-0 z-40 bg-slate-950/75 backdrop-blur-md flex flex-col items-center justify-center gap-4 text-white cursor-pointer group/overlay transition-all"
              >
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#FF6321] text-black flex items-center justify-center shadow-[0_0_50px_rgba(255,99,33,0.8)] border-4 border-white group-hover/overlay:scale-110 transition-transform"
                >
                  <Play className="w-10 h-10 sm:w-12 sm:h-12 fill-current ml-1.5" />
                </motion.div>

                <div className="text-center space-y-1">
                  <div className="text-lg sm:text-2xl font-black font-sans uppercase tracking-wider text-white">
                    {currentTime > 0 ? 'REEL PAUSED • CLICK TO RESUME' : 'CLICK TO PLAY DEV UPDATES & CREATION REEL'}
                  </div>
                  <p className="text-xs font-mono text-[#FF6321] font-bold">
                    {currentTime > 0 ? `PAUSED AT ${currentTime.toFixed(1)}s / ${TOTAL_DURATION}.0s` : 'SOUND UNMUTED • 18-SECOND ULTRA-FAST KINETIC AD'}
                  </p>
                </div>
              </div>
            )}

            {/* Quick Floating Pause Button on Hover when Playing */}
            {isPlaying && (
              <div className="absolute top-14 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  id="btn-quick-pause-hover"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePause();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-black/80 hover:bg-[#FF6321] text-white hover:text-black border border-white/20 hover:border-[#FF6321] font-mono font-black text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
                  title="Pause Reel"
                >
                  <Pause className="w-4 h-4 fill-current" />
                  <span>PAUSE REEL</span>
                </button>
              </div>
            )}

            {/* TOP STATUS BAR */}
            <div
              className={`relative z-20 px-5 py-2.5 flex items-center justify-between text-xs font-mono border-b ${
                isDarkMode
                  ? 'bg-black/70 border-white/10 text-gray-300'
                  : 'bg-white/70 border-black/5 text-gray-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF6321] animate-ping" />
                <span className="font-extrabold text-[#FF6321] tracking-widest text-[11px] uppercase">
                  FAST KINETIC MOTION // OKERE CHIEMEKA
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-toggle-portfolio-sound"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAudio();
                  }}
                  className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 text-[10px] font-black uppercase transition-all ${
                    isAudioEnabled
                      ? 'bg-emerald-500 text-black border-emerald-400 shadow-md animate-pulse'
                      : 'bg-white/10 text-gray-500 border-white/10'
                  }`}
                >
                  {isAudioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{isAudioEnabled ? 'SOUND UNMUTED 🎵' : 'MUTED'}</span>
                </button>

                <span className="px-2 py-0.5 rounded bg-black/10 text-current text-[10px] font-black font-mono">
                  {currentTime.toFixed(1)}s / {TOTAL_DURATION}.0s
                </span>
              </div>
            </div>

            {/* CENTER HYPER-KINETIC TYPOGRAPHY & ANIMATION STAGE */}
            <div
              onClick={() => {
                if (isPlaying) handlePause();
                else handleStartPlay();
              }}
              className="relative z-20 flex-1 flex items-center justify-center p-4 sm:p-6 text-center overflow-hidden cursor-pointer"
            >
              <AnimatePresence mode="wait">
                
                {/* =========================================================
                    STAGE 1: INTRO KINETIC TEXT & FOUNDER (0.0s - 3.2s)
                   ========================================================= */}
                {stage === 1 && (
                  <motion.div key="stage1" className="w-full max-w-xl space-y-3">
                    {/* 0.0s - 0.8s: Rapid "Hi." with elastic pop */}
                    {currentTime < 0.8 && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0, rotate: -15 }}
                        animate={{ scale: 1.2, opacity: 1, rotate: 0 }}
                        exit={{ scale: 2, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                        className="text-7xl sm:text-9xl font-black text-slate-900 font-sans tracking-tight"
                      >
                        Hi<span className="text-[#FF6321]">.</span>
                      </motion.div>
                    )}

                    {/* 0.8s - 1.8s: iMessage input pill typing: "I'm Okere Chiemeka" */}
                    {currentTime >= 0.8 && currentTime < 1.8 && (
                      <motion.div
                        initial={{ scale: 0.7, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 1.1, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                        className="w-full bg-white rounded-full border-2 border-slate-300 shadow-2xl p-2 px-6 flex items-center justify-between gap-3 text-slate-900 text-xl sm:text-3xl font-extrabold font-sans mx-auto"
                      >
                        <span className="truncate">I'm Okere Chiemeka</span>
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 0.4 }}
                          className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-lg"
                        >
                          <ArrowUp className="w-6 h-6" />
                        </motion.div>
                      </motion.div>
                    )}

                    {/* 1.8s - 3.2s: Rapid Snapping Roles */}
                    {currentTime >= 1.8 && (
                      <motion.div className="space-y-1">
                        {currentTime >= 1.8 && currentTime < 2.5 && (
                          <motion.h1
                            initial={{ y: 40, opacity: 0, rotateX: 90 }}
                            animate={{ y: 0, opacity: 1, rotateX: 0 }}
                            className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight font-sans"
                          >
                            Founder of <span className="text-[#FF6321]">Apex Syndicate</span>
                          </motion.h1>
                        )}

                        {currentTime >= 2.5 && (
                          <motion.h1
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-4xl sm:text-6xl font-black text-blue-600 tracking-tight font-sans uppercase"
                          >
                            Game Dev & Motion Designer
                          </motion.h1>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* =========================================================
                    STAGE 2: iOS NOTIFICATION, LOW BATTERY & APEX EDITOR (3.2s - 8.5s)
                   ========================================================= */}
                {stage === 2 && (
                  <motion.div key="stage2" className="w-full max-w-2xl space-y-3">
                    {/* 3.2s - 5.2s: iOS iMessage Banner & Low Battery Popup */}
                    {currentTime >= 3.2 && currentTime < 5.2 && (
                      <div className="space-y-3 relative">
                        {/* iMessage Notification */}
                        <motion.div
                          initial={{ y: -100, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                          className="bg-white/95 backdrop-blur-2xl border-2 border-white/90 rounded-2xl p-3.5 shadow-2xl flex items-center gap-3 text-left max-w-lg mx-auto"
                        >
                          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                            <MessageSquare className="w-6 h-6 fill-current" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between text-xs font-black text-slate-900">
                              <span>Apex Syndicate</span>
                              <span className="text-gray-400 font-normal">now</span>
                            </div>
                            <p className="text-sm font-extrabold text-slate-900 truncate">
                              Looking for Apex Editor or Gangster Revolution?
                            </p>
                          </div>
                        </motion.div>

                        {/* Low Battery Alert Box */}
                        {currentTime >= 4.0 && (
                          <motion.div
                            initial={{ scale: 0.3, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-slate-900/95 text-white border-2 border-white/20 backdrop-blur-2xl rounded-2xl p-4 max-w-md mx-auto shadow-2xl space-y-2 font-sans text-center"
                          >
                            <div className="text-base font-black">System Alert</div>
                            <div className="text-xs text-gray-300 font-bold">20% Development Remaining</div>
                            <div className="p-2 rounded-xl bg-[#FF6321] text-black font-black text-xs uppercase tracking-wider">
                              YOU JUST FOUND THEM!
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* 5.2s - 8.5s: Progress Bar Exporting Video -> APEX EDITOR reveal */}
                    {currentTime >= 5.2 && (
                      <motion.div
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="space-y-2.5"
                      >
                        <div className="bg-white p-3.5 rounded-2xl border-2 border-slate-300 shadow-xl space-y-1.5 text-slate-900 text-left font-mono">
                          <div className="flex items-center justify-between text-xs font-black">
                            <span className="flex items-center gap-2">
                              <Video className="w-4 h-4 text-[#FF6321]" /> Exporting Apex Editor...
                            </span>
                            <span className="text-[#FF6321]">99%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-[#FF6321] rounded-full w-[99%] animate-pulse" />
                          </div>
                        </div>

                        {/* Spinning kinetic letters: C-O-M-I-N-G  S-O-O-N */}
                        <motion.div
                          animate={{ rotate: [0, 2, -2, 0] }}
                          transition={{ repeat: Infinity, duration: 0.3 }}
                          className="text-3xl sm:text-5xl font-black text-slate-900 uppercase tracking-[0.2em] font-sans"
                        >
                          C O M I N G &nbsp; S O O N
                        </motion.div>

                        {/* Apex Editor Mock UI Card */}
                        <div className="bg-slate-950 p-2.5 rounded-2xl border-2 border-cyan-400 text-left space-y-1.5 shadow-2xl font-mono">
                          <div className="flex items-center justify-between text-[10px] text-cyan-300 border-b border-cyan-500/30 pb-1">
                            <span className="font-black">APEX EDITOR v3.8 MASTER</span>
                            <span>TOPAZ AI ACCELERATED</span>
                          </div>
                          <div className="grid grid-cols-12 gap-2 h-16 text-[9px] text-gray-300">
                            <div className="col-span-4 bg-black/60 p-1 rounded border border-white/10">
                              <span className="text-cyan-400 font-bold">+ Media Bin</span>
                              <div className="truncate text-white mt-0.5">SCENE_A01.mp4</div>
                            </div>
                            <div className="col-span-8 bg-black p-1 rounded border border-cyan-500/50 flex items-center justify-center text-center">
                              <div className="text-cyan-400 font-black text-[10px] uppercase">
                                APEX PREVIEW CANVAS [SKELETON TRACKING]
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-2 rounded-xl bg-[#FF6321] text-black font-black text-xs uppercase tracking-widest font-mono">
                          🚨 APEX EDITOR IS NOT OUT YET — COMING SOON!
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* =========================================================
                    STAGE 3: DARK MODE SNAP & GANGSTER REVOLUTION GAME (ULTRA-ANIMATED) (8.5s - 14.0s)
                   ========================================================= */}
                {stage === 3 && (
                  <motion.div
                    key="stage3"
                    initial={{ opacity: 0, scale: 1.3 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.2 }}
                    className="w-full max-w-3xl space-y-3 relative"
                  >
                    {/* RADAR SWEEP ANIMATED BACKGROUND */}
                    <div className="absolute -inset-10 pointer-events-none flex items-center justify-center opacity-30 overflow-hidden">
                      <div className="w-80 h-80 rounded-full border border-emerald-500/30 flex items-center justify-center relative">
                        <div className="w-56 h-56 rounded-full border border-emerald-500/20 flex items-center justify-center">
                          <div className="w-32 h-32 rounded-full border border-emerald-500/10" />
                        </div>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-emerald-500/10 to-transparent animate-spin duration-3000" />
                      </div>
                    </div>

                    {/* 8.5s - 10.2s: Pitch Black Kinetic Snap Title */}
                    {currentTime < 10.2 ? (
                      <motion.div className="space-y-2 relative z-10">
                        <motion.div
                          initial={{ scale: 0.4, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-4xl sm:text-7xl font-black text-white uppercase tracking-tight font-sans drop-shadow-[0_0_25px_rgba(255,99,33,0.8)]"
                        >
                          I CREATE <span className="text-[#FF6321]">NEXT-GEN GAMES</span>
                        </motion.div>

                        <div className="flex items-center justify-center gap-2 text-xs font-mono text-amber-400 font-extrabold">
                          <Flame className="w-4 h-4 animate-bounce text-[#FF6321]" />
                          <span>DEVELOPED BY APEX SYNDICATE</span>
                          <Flame className="w-4 h-4 animate-bounce text-[#FF6321]" />
                        </div>
                      </motion.div>
                    ) : (
                      /* 10.2s - 14.0s: Gangster Revolution Game Showcase (Ultra-Animated) */
                      <motion.div
                        initial={{ y: 60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="space-y-2.5 relative z-10"
                      >
                        {/* GTA STYLE WANTED LEVEL & GAME TITLE BANNER */}
                        <div className="flex flex-col sm:flex-row items-center justify-between bg-black/90 p-3 rounded-2xl border-2 border-[#FF6321] shadow-[0_0_40px_rgba(255,99,33,0.7)] gap-2">
                          <div className="flex items-center gap-2 font-black text-[#FF6321] text-sm sm:text-base font-mono uppercase tracking-wider">
                            <Gamepad2 className="w-6 h-6 animate-pulse" />
                            <span>GANGSTER REVOLUTION</span>
                          </div>

                          {/* Flashing Wanted Level Stars */}
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-mono text-gray-400 font-bold mr-1">WANTED:</span>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <motion.span
                                key={star}
                                animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
                                transition={{ repeat: Infinity, duration: 0.6, delay: star * 0.1 }}
                                className="text-amber-400 text-sm font-black"
                              >
                                ★
                              </motion.span>
                            ))}
                          </div>
                        </div>

                        {/* Interactive Hero Selector Tabs */}
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'marcus', name: '1. MARCUS', flag: '🇳🇬', color: 'emerald', loc: 'Lagos Turf' },
                            { id: 'laura', name: '2. LAURA', flag: '🇨🇦', color: 'red', loc: 'Snow Open-World' },
                            { id: 'john', name: '3. JOHN', flag: '🇺🇸', color: 'blue', loc: 'New York City' },
                          ].map((h) => (
                            <button
                              key={h.id}
                              onClick={() => setActiveHero(h.id as any)}
                              className={`p-2 rounded-xl border text-left font-mono text-[10px] font-black transition-all ${
                                activeHero === h.id
                                  ? 'bg-[#FF6321] border-[#FF6321] text-black shadow-lg scale-105'
                                  : 'bg-black/80 border-white/10 text-gray-300 hover:border-white/30'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{h.name}</span>
                                <span>{h.flag}</span>
                              </div>
                              <div className="text-[9px] opacity-80 mt-0.5 truncate">{h.loc}</div>
                            </button>
                          ))}
                        </div>

                        {/* Active Character Tactical HUD Card */}
                        <AnimatePresence mode="wait">
                          {activeHero === 'marcus' && (
                            <motion.div
                              key="marcus-card"
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.9, opacity: 0 }}
                              className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-black to-slate-950 border-2 border-emerald-500/80 text-left space-y-2 font-mono shadow-2xl"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-emerald-400 uppercase flex items-center gap-2">
                                  <Crosshair className="w-4 h-4" /> PROTAGONIST #1: MARCUS (NIGERIA)
                                </span>
                                <span className="text-[10px] text-emerald-300 font-extrabold bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40">
                                  STARTING HERO
                                </span>
                              </div>
                              <p className="text-xs text-gray-200">
                                Starts in Nigeria. Unlocks Laura & John as the international crime syndicate expands across continents!
                              </p>

                              {/* Stats Bars */}
                              <div className="grid grid-cols-2 gap-2 text-[10px]">
                                <div>
                                  <div className="flex justify-between text-emerald-400 font-bold mb-0.5">
                                    <span>STEALTH RATING</span>
                                    <span>95%</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-400 w-[95%]" />
                                  </div>
                                </div>
                                <div>
                                  <div className="flex justify-between text-emerald-400 font-bold mb-0.5">
                                    <span>LAGOS CREW CASH</span>
                                    <span>$2,850,000</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-400 w-[88%]" />
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {activeHero === 'laura' && (
                            <motion.div
                              key="laura-card"
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.9, opacity: 0 }}
                              className="p-3.5 rounded-2xl bg-gradient-to-r from-red-950/90 via-black to-slate-950 border-2 border-red-500/80 text-left space-y-2 font-mono shadow-2xl"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-red-400 uppercase flex items-center gap-2">
                                  <Target className="w-4 h-4" /> PROTAGONIST #2: LAURA (CANADA)
                                </span>
                                <span className="text-[10px] text-red-300 font-extrabold bg-red-500/20 px-2 py-0.5 rounded border border-red-500/40">
                                  UNLOCKED SECOND
                                </span>
                              </div>
                              <p className="text-xs text-gray-200">
                                Canadian open-world snow regions. Tactical sniper missions, snowmobiles, & armored bank vault raids.
                              </p>

                              <div className="grid grid-cols-2 gap-2 text-[10px]">
                                <div>
                                  <div className="flex justify-between text-red-400 font-bold mb-0.5">
                                    <span>SNIPER ACCURACY</span>
                                    <span>98%</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
                                    <div className="h-full bg-red-400 w-[98%]" />
                                  </div>
                                </div>
                                <div>
                                  <div className="flex justify-between text-red-400 font-bold mb-0.5">
                                    <span>SNOW MOBILITY</span>
                                    <span>92%</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
                                    <div className="h-full bg-red-400 w-[92%]" />
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {activeHero === 'john' && (
                            <motion.div
                              key="john-card"
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.9, opacity: 0 }}
                              className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/90 via-black to-slate-950 border-2 border-blue-500/80 text-left space-y-2 font-mono shadow-2xl"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-blue-400 uppercase flex items-center gap-2">
                                  <Radio className="w-4 h-4" /> PROTAGONIST #3: JOHN (NEW YORK)
                                </span>
                                <span className="text-[10px] text-blue-300 font-extrabold bg-blue-500/20 px-2 py-0.5 rounded border border-blue-500/40">
                                  NEW YORK HQ
                                </span>
                              </div>
                              <p className="text-xs text-gray-200">
                                Unlocked last. Primary home location in New York City with penthouse safehouses & syndicate warfare.
                              </p>

                              <div className="grid grid-cols-2 gap-2 text-[10px]">
                                <div>
                                  <div className="flex justify-between text-blue-400 font-bold mb-0.5">
                                    <span>CREW LEADERSHIP</span>
                                    <span>100%</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-400 w-[100%]" />
                                  </div>
                                </div>
                                <div>
                                  <div className="flex justify-between text-blue-400 font-bold mb-0.5">
                                    <span>NYC PENTHOUSE HQ</span>
                                    <span>ACTIVE</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-400 w-[96%]" />
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Animated Feature Badges */}
                        <div className="p-2 rounded-xl bg-black/90 border border-white/20 text-[10px] font-mono text-gray-200 flex flex-wrap justify-around gap-2 shadow-xl">
                          <span className="flex items-center gap-1 text-emerald-400 font-bold">
                            <Plane className="w-3 h-3" /> Flight Booking & Airports
                          </span>
                          <span className="flex items-center gap-1 text-amber-400 font-bold">
                            <Truck className="w-3 h-3" /> Realistic Fuel System
                          </span>
                          <span className="flex items-center gap-1 text-cyan-400 font-bold">
                            <Crosshair className="w-3 h-3" /> Crew Territory
                          </span>
                          <span className="flex items-center gap-1 text-purple-400 font-bold">
                            🔒 Encrypted Profiles (.grprofile)
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-[#FF6321] text-black font-black text-xs uppercase tracking-widest font-mono shadow-[0_0_20px_rgba(255,99,33,0.5)]">
                          🔥 GANGSTER REVOLUTION IS COMING SOON!
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* =========================================================
                    STAGE 4: PROFILE CARD, BIO LINK CTA & DM ME! (14.0s - 18.0s)
                   ========================================================= */}
                {stage === 4 && (
                  <motion.div
                    key="stage4"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-lg space-y-3 font-sans"
                  >
                    {/* Profile Card with Hand Cursor Click */}
                    <motion.div
                      initial={{ y: 20 }}
                      animate={{ y: 0 }}
                      className="bg-white rounded-3xl p-4 border-2 border-slate-300 shadow-2xl space-y-2 text-slate-900 relative"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-[#FF6321] text-black font-black text-lg flex items-center justify-center shadow-md">
                            AS
                          </div>
                          <div className="text-left">
                            <div className="font-extrabold text-base">apex.syndicateng</div>
                            <div className="text-xs text-gray-500 font-medium">Official Syndicate Page</div>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-[#FF6321] text-black text-xs font-black uppercase">
                          Follow
                        </span>
                      </div>

                      {/* Animated Cursor Hand */}
                      <motion.div
                        animate={{ scale: [1, 1.3, 1], x: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="absolute -bottom-2 right-8 text-[#FF6321]"
                      >
                        <MousePointer className="w-7 h-7 fill-current" />
                      </motion.div>
                    </motion.div>

                    {/* Big Kinetic CTA */}
                    <motion.div className="space-y-1.5">
                      <div className="p-2.5 rounded-2xl bg-blue-600 text-white font-black text-xs sm:text-sm uppercase tracking-wider font-mono shadow-xl">
                        🌐 WEBSITE LINK POSTED IN OUR IG & TIKTOK BIO!
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs font-mono font-black text-slate-800">
                        <div className="p-2 rounded-xl bg-white border border-slate-300 shadow">
                          IG: @apexsyndicateng
                        </div>
                        <div className="p-2 rounded-xl bg-white border border-slate-300 shadow">
                          TikTok: @apex.syndicateng
                        </div>
                      </div>
                    </motion.div>

                    <div className="text-3xl sm:text-4xl font-black text-slate-900 font-sans uppercase tracking-tight">
                      dm me! <span className="text-[#FF6321]">apexsyndicate.com.ng</span>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </>
        )}

        {/* BOTTOM TIMELINE CONTROLS */}
        <div
          className={`relative z-20 px-5 py-2.5 border-t flex items-center justify-between text-xs font-mono ${
            isDarkMode
              ? 'bg-black/80 border-white/10 text-gray-300'
              : 'bg-white/80 border-black/5 text-gray-800'
          }`}
        >
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-black/10 overflow-hidden">
            <div
              className="h-full bg-[#FF6321] transition-all duration-75"
              style={{ width: `${(currentTime / TOTAL_DURATION) * 100}%` }}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-play-pause-portfolio"
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
              title={isPlaying ? 'Pause Video' : 'Play Video'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>PAUSE</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>PLAY</span>
                </>
              )}
            </button>

            <button
              id="btn-restart-portfolio"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentTime(0);
                handleStartPlay();
              }}
              className="p-1.5 rounded-xl bg-black/10 hover:bg-black/20 text-current transition-colors cursor-pointer"
              title="Restart Reel"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <span className="font-extrabold text-[11px] hidden sm:inline">
              {isPlaying ? '▶ REEL PLAYING (CLICK ANYWHERE TO PAUSE)' : '⏸ PAUSED'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-download-portfolio-reel"
              onClick={handleDownloadVideo}
              className="px-2.5 py-1.5 rounded-xl bg-[#FF6321]/15 hover:bg-[#FF6321] text-[#FF6321] hover:text-black font-extrabold flex items-center gap-1.5 transition-all text-[11px] border border-[#FF6321]/30"
              title="Download MP4 (CapCut Ready)"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">DOWNLOAD MP4</span>
            </button>

            <button
              id="btn-fullscreen-portfolio"
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
              className="p-1.5 rounded-xl bg-black/10 hover:bg-black/20 text-current transition-colors"
              title="Fullscreen Reel"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* CAPCUT-READY MP4 VIDEO EXPORT PROGRESS MODAL */}
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
