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

export const PortfolioVideoShowcase: React.FC = () => {
  const TOTAL_DURATION = 18; // 18-second hyper-fast kinetic edit
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // PAUSED on site enter
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true); // UNMUTED by default
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeHero, setActiveHero] = useState<'marcus' | 'laura' | 'john'>('marcus');

  // Video Mode: 'default' (kinetic reel) | 'custom' (uploaded video) | 'blank' (Portfolio Coming Soon)
  const [videoMode, setVideoMode] = useState<'default' | 'custom' | 'blank'>('blank');
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);

  // Dev Updates Pictures State (Only custom uploaded photos/screenshots by owner)
  const [devPictures, setDevPictures] = useState<DevUpdatePicture[]>([]);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number>(0);
  const [lightboxImage, setLightboxImage] = useState<DevUpdatePicture | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  // Video Export Progress state
  const [isExportingVideo, setIsExportingVideo] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatusText, setExportStatusText] = useState('');

  const containerRef = useRef<HTMLDivElement | null>(null);
  const customVideoRef = useRef<HTMLVideoElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastStepRef = useRef<number>(-1);

  const displayPictures = devPictures;
  const filteredPictures = activeFilter === 'ALL'
    ? displayPictures
    : displayPictures.filter((p) => (p.category || 'General').toUpperCase() === activeFilter.toUpperCase());

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

  // Display view within the single Dev Updates box: 'video' | 'picture'
  const [activeMediaTab, setActiveMediaTab] = useState<'video' | 'picture'>('video');
  const [currentPicIndex, setCurrentPicIndex] = useState<number>(0);

  const activePicture = devPictures.length > 0 ? devPictures[currentPicIndex % devPictures.length] : null;

  const handleNextPicture = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (devPictures.length > 0) {
      setCurrentPicIndex((prev) => (prev + 1) % devPictures.length);
    }
  };

  const handlePrevPicture = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (devPictures.length > 0) {
      setCurrentPicIndex((prev) => (prev - 1 + devPictures.length) % devPictures.length);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fadeIn">
      {/* =========================================================================
          DEV UPDATES CONTAINER BOX (UNIFIED VIDEO & PICTURE LOGS)
          ========================================================================= */}
      <div className="space-y-4">
        {/* HEADER & MEDIA TAB SELECTOR */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#FF6321]/20 to-amber-500/15 border border-[#FF6321]/40 text-[#FF6321] text-xs font-mono font-black uppercase tracking-widest shadow-[0_0_20px_rgba(255,99,33,0.3)] animate-border-glow">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-400" />
              <span>DEV UPDATES SHOWCASE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight mt-2 flex items-center gap-3">
              APEX SYNDICATE // <span className="bg-gradient-to-r from-[#FF6321] via-amber-400 to-[#FF4500] bg-clip-text text-transparent animate-shimmer-text">DEV UPDATES</span>
            </h2>
          </div>

          {/* Right Side: Media Switcher (Inside Same Box) + Founder Tag */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Mode Switcher in the same box */}
            <div className="flex p-1 rounded-2xl bg-black/80 border border-white/15 backdrop-blur-xl">
              <button
                type="button"
                onClick={() => {
                  setActiveMediaTab('video');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeMediaTab === 'video'
                    ? 'bg-[#FF6321] text-black shadow-[0_0_15px_rgba(255,99,33,0.4)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>VIDEO REEL</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveMediaTab('picture');
                  if (isPlaying) handlePause();
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeMediaTab === 'picture'
                    ? 'bg-[#FF6321] text-black shadow-[0_0_15px_rgba(255,99,33,0.4)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>PICTURES {devPictures.length > 0 ? `(${devPictures.length})` : ''}</span>
              </button>
            </div>

            <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-gray-300 bg-black/60 border border-white/15 px-3.5 py-2 rounded-2xl backdrop-blur-xl">
              <User className="w-3.5 h-3.5 text-[#FF6321]" />
              <span>FOUNDER: <strong className="text-white font-black uppercase">OKERE CHIEMEKA</strong></span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            PICTURE MODE (RENDERED INSIDE THIS EXACT SAME DEV UPDATES BOX)
            ========================================================================= */}
        {activeMediaTab === 'picture' ? (
          devPictures.length === 0 ? (
            <div
              id="portfolio-pictures-coming-soon-card"
              className="relative w-full aspect-video rounded-3xl bg-gradient-to-b from-[#0e0e14] via-[#07070a] to-[#040406] border-2 border-white/10 p-6 sm:p-12 overflow-hidden flex flex-col justify-between items-center text-center shadow-[0_25px_80px_rgba(0,0,0,0.8)] select-none"
            >
              <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#FF6321_1px,transparent_1px)] [background-size:24px_24px] animate-grid-drift" />
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FF6321]/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

              <div className="relative z-10 w-full flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF6321] animate-ping" />
                  <span className="font-bold text-[11px] uppercase tracking-wider text-[#FF6321]">
                    DEV PICTURES RENDERING IN PROGRESS
                  </span>
                </div>
                <div className="text-[11px] text-gray-400 font-mono hidden sm:block">
                  Apex Syndicate Dev Updates
                </div>
              </div>

              <div className="relative z-10 my-auto space-y-4 max-w-2xl">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#FF6321]/15 border-2 border-[#FF6321]/50 text-[#FF6321] shadow-[0_0_45px_rgba(255,99,33,0.4)] mb-2 animate-bounce"
                  style={{ animationDuration: '3s' }}
                >
                  <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse" />
                </motion.div>

                <h3 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight font-sans drop-shadow-2xl">
                  DEV PICTURES <span className="bg-gradient-to-r from-[#FF6321] to-amber-400 bg-clip-text text-transparent animate-shimmer-text">COMING SOON</span>
                </h3>

                <p className="text-sm sm:text-base text-gray-300 font-light max-w-xl mx-auto leading-relaxed">
                  Work-in-progress snapshots, UI designs, 3D asset renders, and concept art milestone pictures from the owner are coming soon!
                </p>
              </div>

              <div className="relative z-10 w-full pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-gray-400">
                <div className="flex items-center gap-4">
                  <span>Instagram: <strong className="text-white font-bold">@apexsyndicateng</strong></span>
                  <span>TikTok: <strong className="text-white font-bold">@apex.syndicateng</strong></span>
                </div>
                <div className="text-[11px] text-[#FF6321] font-bold uppercase tracking-wider">
                  Official Creator Showcase
                </div>
              </div>
            </div>
          ) : (
            <div
              id="portfolio-picture-frame"
              className="relative w-full aspect-video rounded-3xl transition-colors duration-300 border-2 border-[#FF6321]/60 bg-[#06070a] overflow-hidden flex flex-col justify-between group select-none shadow-[0_25px_70px_rgba(255,99,33,0.25)]"
            >
              {activePicture && (
                <>
                  {/* Picture Canvas Area */}
                  <div
                    className="relative flex-1 min-h-0 w-full flex items-center justify-center bg-black overflow-hidden cursor-pointer"
                    onClick={() => setLightboxImage(activePicture)}
                  >
                    <img
                      src={activePicture.url}
                      alt={activePicture.title}
                      className="w-full h-full object-contain transform-gpu transition-all duration-300 group-hover:scale-102"
                      referrerPolicy="no-referrer"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />

                    {/* Top Overlay Badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-lg bg-black/80 border border-[#FF6321]/50 text-[#FF6321] text-xs font-mono font-black uppercase tracking-wider backdrop-blur-md">
                        {activePicture.category || 'DEV UPDATE'}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/15 text-gray-300 text-[11px] font-mono">
                        {currentPicIndex + 1} / {devPictures.length}
                      </span>
                    </div>

                    {/* Expand Zoom Button */}
                    <div className="absolute top-4 right-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLightboxImage(activePicture);
                        }}
                        className="p-2 rounded-xl bg-black/70 hover:bg-[#FF6321] text-white hover:text-black border border-white/20 transition-all cursor-pointer"
                        title="Expand Image"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Prev / Next Floating Arrows */}
                    {devPictures.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={handlePrevPicture}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-[#FF6321] text-white hover:text-black border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
                          title="Previous Picture"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>

                        <button
                          type="button"
                          onClick={handleNextPicture}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-[#FF6321] text-white hover:text-black border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
                          title="Next Picture"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {/* Bottom Caption Overlay */}
                    <div className="absolute bottom-3 left-4 right-4 pointer-events-none">
                      <h4 className="text-base sm:text-lg font-black text-white drop-shadow-md">
                        {activePicture.title}
                      </h4>
                      {activePicture.caption && (
                        <p className="text-xs text-gray-300 line-clamp-2 max-w-2xl font-light drop-shadow">
                          {activePicture.caption}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Picture Controls Bar */}
                  <div className="relative z-20 px-5 py-2.5 bg-black/85 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePrevPicture}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>PREV</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleNextPicture}
                        className="px-3 py-1.5 rounded-xl bg-[#FF6321] hover:bg-[#FF8A50] text-black font-bold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <span>NEXT</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <span className="text-gray-400 text-[11px] ml-2 hidden sm:inline">
                        Click image to expand in full-screen
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveMediaTab('video')}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Film className="w-3.5 h-3.5 text-[#FF6321]" />
                        <span>SWITCH TO VIDEO</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )
        ) : (
          /* =========================================================================
              VIDEO MODE (ACTIVE DEV VIDEO SHOWCASE IN THIS SAME BOX)
              ========================================================================= */
          videoMode === 'blank' ? (
            <div
              id="portfolio-coming-soon-card"
              className="relative w-full aspect-video rounded-3xl bg-gradient-to-b from-[#0e0e14] via-[#07070a] to-[#040406] border-2 border-white/10 p-6 sm:p-12 overflow-hidden flex flex-col justify-between items-center text-center shadow-[0_25px_80px_rgba(0,0,0,0.8)] select-none"
            >
              <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#FF6321_1px,transparent_1px)] [background-size:24px_24px] animate-grid-drift" />
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FF6321]/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

              <div className="relative z-10 w-full flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                  <span className="font-bold text-[11px] uppercase tracking-wider text-amber-400">
                    DEVLOG RENDERING IN PROGRESS
                  </span>
                </div>
                <div className="text-[11px] text-gray-400 font-mono hidden sm:block">
                  Apex Syndicate Dev Updates
                </div>
              </div>

              <div className="relative z-10 my-auto space-y-4 max-w-2xl">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#FF6321]/15 border-2 border-[#FF6321]/50 text-[#FF6321] shadow-[0_0_45px_rgba(255,99,33,0.4)] mb-2 animate-bounce"
                  style={{ animationDuration: '3s' }}
                >
                  <Film className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse" />
                </motion.div>

                <h3 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight font-sans drop-shadow-2xl">
                  DEV UPDATES <span className="bg-gradient-to-r from-[#FF6321] to-amber-400 bg-clip-text text-transparent animate-shimmer-text">COMING SOON</span>
                </h3>

                <p className="text-sm sm:text-base text-gray-300 font-light max-w-xl mx-auto leading-relaxed">
                  Video updates showcasing our live developer milestones, code optimizations, and gameplay mechanics at Apex Syndicate are coming soon!
                </p>
              </div>

              <div className="relative z-10 w-full pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-gray-400">
                <div className="flex items-center gap-4">
                  <span>Instagram: <strong className="text-white font-bold">@apexsyndicateng</strong></span>
                  <span>TikTok: <strong className="text-white font-bold">@apex.syndicateng</strong></span>
                </div>
                <div className="text-[11px] text-[#FF6321] font-bold uppercase tracking-wider">
                  Official Creator Showcase
                </div>
              </div>
            </div>
          ) : (
            <div
              ref={containerRef}
              id="portfolio-video-frame"
              className={`relative w-full aspect-video rounded-3xl transition-colors duration-300 border-2 overflow-hidden flex flex-col justify-between group select-none shadow-2xl ${
                isDarkMode
                  ? 'bg-[#030306] border-[#FF6321]/60 text-white shadow-[0_25px_70px_rgba(255,99,33,0.35)]'
                  : 'bg-[#0a0a0f] border-[#FF6321]/40 text-white shadow-[0_20px_60px_rgba(0,0,0,0.4)]'
              } ${isFullscreen ? 'rounded-none border-none shadow-none' : ''}`}
            >
              {/* Custom Video Player */}
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

              {/* Bottom Timeline Controls */}
              <div className="relative z-20 px-5 py-2.5 bg-black/80 border-t border-white/10 flex items-center justify-between text-xs font-mono">
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
                        <span>PLAY</span>
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
            </div>
          )
        )}
      </div>

      {/* =========================================================================
          LIGHTBOX MODAL FOR EXPANDING DEV UPDATE PICTURES
          ========================================================================= */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
          onClick={() => setLightboxImage(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-w-5xl w-full bg-[#0b0c10] border-2 border-[#FF6321] rounded-3xl overflow-hidden shadow-[0_0_70px_rgba(255,99,33,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="p-4 bg-black/80 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-lg bg-[#FF6321]/20 border border-[#FF6321]/40 text-[#FF6321] text-xs font-mono font-bold uppercase">
                  {lightboxImage.category || 'Dev Update'}
                </span>
                <h3 className="text-base sm:text-lg font-black text-white truncate max-w-md">
                  {lightboxImage.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Image */}
            <div className="max-h-[65vh] w-full flex items-center justify-center bg-black overflow-hidden">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                className="max-h-[65vh] w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Bottom Caption */}
            {lightboxImage.caption && (
              <div className="p-5 bg-black/80 border-t border-white/10 space-y-1">
                <div className="text-xs text-gray-300 leading-relaxed font-sans">
                  {lightboxImage.caption}
                </div>
                <div className="text-[10px] font-mono text-gray-500">
                  Apex Syndicate Official Dev Artifact • Published {lightboxImage.createdAt || 'Live'}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

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
