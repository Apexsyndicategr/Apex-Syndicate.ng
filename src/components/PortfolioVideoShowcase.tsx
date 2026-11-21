import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Maximize2,
  RotateCcw,
  Film,
  Zap,
  Download,
  ChevronLeft,
  ChevronRight,
  Layers,
  AlertCircle,
} from 'lucide-react';
import { fetchPublicSettings } from '../lib/api';
import { exportPortfolioVideo } from '../lib/videoExporter';
import { DevUpdatePicture } from '../types';
import { NaijaLifeWarningModal } from './NaijaLifeWarningModal';
import gangsterRevImg from '../assets/images/gangster_revolution_art_1788292147475.jpg';
import apexEditorImg from '../assets/images/apex_editor_demo_official_1787236453861.jpg';

export interface PortfolioVideoShowcaseProps {
  setActiveTab?: (tab: string) => void;
}

interface DevUpdateItem {
  id: string;
  type: 'announcement' | 'game-reveal' | 'video' | 'picture' | 'status-pause';
  tag: string;
  badge: string;
  title: string;
  subtitle: string;
  date: string;
  picUrl?: string;
  highlights?: string[];
  primaryActionLabel?: string;
  primaryActionTarget?: string;
  secondaryActionLabel?: string;
  secondaryActionTarget?: string;
}

export const PortfolioVideoShowcase: React.FC<PortfolioVideoShowcaseProps> = ({ setActiveTab }) => {
  const TOTAL_DURATION = 18;
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAudioEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const [videoMode, setVideoMode] = useState<'default' | 'custom' | 'blank'>('default');
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);
  const [currentUpdateIndex, setCurrentUpdateIndex] = useState<number>(0);
  const [, setDevPictures] = useState<DevUpdatePicture[]>([]);
  const [showNaijaLifeWarning, setShowNaijaLifeWarning] = useState<boolean>(false);
  const [naijaLifeGameUrl, setNaijaLifeGameUrl] = useState<string>('https://naijalife-rpg.vercel.app');

  const [isExportingVideo, setIsExportingVideo] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatusText, setExportStatusText] = useState('');

  const containerRef = useRef<HTMLDivElement | null>(null);
  const customVideoRef = useRef<HTMLVideoElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastStepRef = useRef<number>(-1);

  const updatesList: DevUpdateItem[] = [
    {
      id: 'update-1-naija-life',
      type: 'game-reveal',
      tag: 'Update 01',
      badge: 'Early Access Demo Out Now',
      title: 'Naija Life: Early Access Demo',
      subtitle:
        'Play the early access alpha build of Naija Life directly in your browser. Explore all 36 Nigerian states plus international travel ("Japa"). Mobile optimization is still in work and may lag heavily, while PC runs smoothly. Map design is scheduled for a full-production rework.',
      date: 'Playable Web Alpha',
      picUrl: '/images/naija_life_hero.jpg',
      highlights: [
        'Playable Web Alpha',
        'PC Recommended · Mobile In Work',
        '36 States + Japa Hub',
        'Map Rework Incoming',
      ],
      primaryActionLabel: 'Play Early Access Demo',
      primaryActionTarget: 'naija-life-warning',
      secondaryActionLabel: 'Explore Naija Life Hub',
      secondaryActionTarget: 'naija-life',
    },
    {
      id: 'update-2-apex-editor-demo',
      type: 'announcement',
      tag: 'Update 02',
      badge: 'Milestone Release',
      title: 'Apex Editor Web Demo',
      subtitle:
        'Experience the interactive Apex Editor sandbox directly in your browser—featuring a 60FPS canvas timeline, fast media workflows, and zero-latency architecture.',
      date: 'Live Demo Available',
      picUrl: apexEditorImg,
      highlights: [
        '60FPS Canvas Timeline',
        'Neural Upscaling',
        'Rust AST Core',
        'Browser Sandbox',
      ],
      primaryActionLabel: 'Try Apex Editor Demo',
      primaryActionTarget: 'apex-editor-demo',
      secondaryActionLabel: 'View Specifications',
      secondaryActionTarget: 'apex-editor',
    },
    {
      id: 'update-3-gangster-revolution',
      type: 'game-reveal',
      tag: 'Update 03',
      badge: 'In Development',
      title: 'Gangster Revolution',
      subtitle:
        'Open-world syndicate warfare, vehicular tuning, and story-driven heists set across interconnected city districts.',
      date: 'Pre-Alpha · TBD',
      picUrl: gangsterRevImg,
      highlights: [
        'Open-World Metropolis',
        'Syndicate Turf Wars',
        'High-Speed Driving',
        'Tactical Heists',
      ],
      primaryActionLabel: 'View Game Hub',
      primaryActionTarget: 'gangster-revolution',
      secondaryActionLabel: 'All Products',
      secondaryActionTarget: 'products',
    },
    {
      id: 'update-4-development-paused',
      type: 'status-pause',
      tag: 'Update 04',
      badge: 'Studio Notice · Dev Paused',
      title: 'Development Temporarily Paused',
      subtitle:
        'Active production on Apex Editor and Gangster Revolution is currently paused. The interactive Apex Editor Web Demo remains online and free to explore in your browser.',
      date: 'Production Paused',
      picUrl: apexEditorImg,
      highlights: [
        'Apex Editor Paused',
        'Gangster Revolution Paused',
        'Web Demo Still Online',
        'Naija Life Alpha Live',
      ],
      primaryActionLabel: 'Try Apex Editor Demo',
      primaryActionTarget: 'apex-editor-demo',
      secondaryActionLabel: 'View All Products',
      secondaryActionTarget: 'products',
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
      } catch {
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
      setExportStatusText('Initializing video encoder...');

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
    } catch (err) {
      console.error('Video export error:', err);
    } finally {
      setIsExportingVideo(false);
    }
  };

  const loadVideoConfig = async () => {
    try {
      const settings = await fetchPublicSettings();

      if (settings.naijaLifeGameUrl) {
        setNaijaLifeGameUrl(settings.naijaLifeGameUrl);
      }

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
    const handleVideoUpdate = () => loadVideoConfig();
    const interval = setInterval(loadVideoConfig, 4000);
    window.addEventListener('apex_video_updated', handleVideoUpdate);
    window.addEventListener('storage', handleVideoUpdate);
    return () => {
      clearInterval(interval);
      window.removeEventListener('apex_video_updated', handleVideoUpdate);
      window.removeEventListener('storage', handleVideoUpdate);
    };
  }, []);

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
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.14);
      }
    } catch {
      // Ignore WebAudio restriction
    }
  };

  useEffect(() => {
    let animFrame: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      if (isPlaying && videoMode === 'default') {
        const delta = (now - lastTime) / 1000;
        setCurrentTime((prev) => {
          const next = prev + delta;
          return next >= TOTAL_DURATION ? 0 : next;
        });
      }
      lastTime = now;
      animFrame = requestAnimationFrame(tick);
    };

    animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
  }, [isPlaying, videoMode]);

  const stage =
    currentTime < 4.5 ? 1 : currentTime < 9.0 ? 2 : currentTime < 13.5 ? 3 : 4;

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
    } catch {}
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

  const handlePrimaryAction = () => {
    if (activeUpdate.primaryActionTarget === 'naija-life-warning') {
      setShowNaijaLifeWarning(true);
    } else if (setActiveTab && activeUpdate.primaryActionTarget) {
      setActiveTab(activeUpdate.primaryActionTarget);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSecondaryAction = () => {
    if (setActiveTab && activeUpdate.secondaryActionTarget) {
      setActiveTab(activeUpdate.secondaryActionTarget);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full space-y-5">
      {/* Section Top Header & Slide Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div className="space-y-1">
          <div className="text-xs font-mono text-[#FF5500] font-medium flex items-center gap-2">
            <span>Studio Updates</span>
            <span aria-hidden="true">·</span>
            <span>{activeUpdate.tag}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {activeUpdate.title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-xs font-mono text-zinc-500">
            Founder: Okere Chiemeka
          </span>

          {totalUpdates > 1 && (
            <div className="flex items-center p-1 rounded-lg bg-[#111114] border border-white/[0.08]">
              <button
                type="button"
                onClick={handlePrevUpdate}
                className="px-2.5 py-1.5 rounded-md text-xs font-mono font-medium text-zinc-300 hover:text-white hover:bg-white/[0.06] flex items-center gap-1 transition-colors cursor-pointer"
                title="Previous Dev Update"
              >
                <ChevronLeft className="w-4 h-4 text-[#FF5500]" />
                <span className="hidden sm:inline">Prev</span>
              </button>

              <span className="px-2.5 text-xs font-mono tabular-nums text-zinc-300">
                <strong className="text-[#FF5500]">{currentUpdateIndex + 1}</strong> / {totalUpdates}
              </span>

              <button
                type="button"
                onClick={handleNextUpdate}
                className="px-2.5 py-1.5 rounded-md text-xs font-mono font-semibold text-black bg-[#FF5500] hover:bg-[#FF6E26] flex items-center gap-1 transition-colors cursor-pointer"
                title="Next Dev Update"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Showcase Display Card */}
      <div
        ref={containerRef}
        id="portfolio-dev-update-frame"
        className={`relative w-full min-h-[380px] sm:min-h-[460px] rounded-2xl bg-[#111114] border border-white/[0.08] overflow-hidden flex flex-col justify-between ${
          isFullscreen ? 'rounded-none border-none' : ''
        }`}
      >
        {/* Background Media Layer (Image Updates / Pause / Announcement) */}
        {activeUpdate.type !== 'video' && activeUpdate.picUrl && (
          <div className="absolute inset-0 z-0">
            <img
              src={activeUpdate.picUrl}
              alt={activeUpdate.title}
              className={`w-full h-full object-cover object-center ${
                activeUpdate.type === 'status-pause' ? 'opacity-25 grayscale' : 'opacity-45'
              }`}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-[#09090b]/45" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/95 via-[#09090b]/70 to-transparent" />
          </div>
        )}

        {/* Slide Content for Game Reveal / Announcement / Status Pause */}
        {activeUpdate.type !== 'video' && (
          <div className="relative z-10 flex-1 flex flex-col justify-between p-6 sm:p-10">
            {/* Top Unboxed Metadata Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-[#FF5500] font-semibold">
                {activeUpdate.type === 'status-pause' && <AlertCircle className="w-3.5 h-3.5" />}
                <span>{activeUpdate.badge}</span>
              </div>
              <span className="text-zinc-400">{activeUpdate.date}</span>
            </div>

            {/* Middle Headline & Copy */}
            <div className="my-auto py-8 max-w-2xl space-y-4">
              <h3 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.06]">
                {activeUpdate.title}
              </h3>

              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                {activeUpdate.subtitle}
              </p>

              {activeUpdate.highlights && activeUpdate.highlights.length > 0 && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-xs font-mono text-zinc-400">
                  {activeUpdate.highlights.map((h, i) => (
                    <span key={i} className="flex items-center gap-1.5">
                      <span className="text-[#FF5500]">·</span>
                      <span>{h}</span>
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrimaryAction}
                  className="px-6 py-3 rounded-lg bg-[#FF5500] hover:bg-[#FF6E26] text-black font-semibold text-sm flex items-center gap-2 transition-colors cursor-pointer"
                >
                  {activeUpdate.id === 'update-1-naija-life' ? (
                    <Play className="w-4 h-4 fill-black" />
                  ) : (
                    <Zap className="w-4 h-4 fill-black" />
                  )}
                  <span>{activeUpdate.primaryActionLabel || 'Explore'}</span>
                </button>

                {activeUpdate.secondaryActionTarget && (
                  <button
                    type="button"
                    onClick={handleSecondaryAction}
                    className="px-5 py-3 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-zinc-200 font-medium text-sm border border-white/[0.1] flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Layers className="w-4 h-4 text-[#FF5500]" />
                    <span>{activeUpdate.secondaryActionLabel || 'Learn More'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Clean Bottom Attribution */}
            <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-zinc-500">
              <span>Apex Syndicate Studios</span>
              <span>@apexsyndicateng · apexsyndicate.com.ng</span>
            </div>
          </div>
        )}

        {/* Video Reel Slide Type (Preserved) */}
        {activeUpdate.type === 'video' && (
          <>
            {videoMode === 'custom' && customVideoUrl ? (
              <div
                className="relative flex-1 min-h-0 w-full flex items-center justify-center bg-black cursor-pointer overflow-hidden"
                onClick={() => (isPlaying ? handlePause() : handleStartPlay())}
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
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-[#FF5500] text-black flex items-center justify-center">
                      <Play className="w-7 h-7 fill-current ml-0.5" />
                    </div>
                    <span className="text-white font-mono font-semibold text-xs uppercase tracking-wider">
                      Play Dev Video
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div
                className="relative flex-1 min-h-0 w-full flex items-center justify-center cursor-pointer p-6 text-center"
                onClick={() => (isPlaying ? handlePause() : handleStartPlay())}
              >
                <div className="space-y-3 max-w-xl">
                  <div className="text-xs font-mono text-[#FF5500] font-semibold uppercase tracking-wider">
                    Apex Syndicate Showcase · Stage {stage}
                  </div>
                  <h3 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                    {stage === 1 && 'Engineered to Innovate'}
                    {stage === 2 && 'Apex Editor'}
                    {stage === 3 && 'Gangster Revolution'}
                    {stage === 4 && 'apexsyndicate.com.ng'}
                  </h3>
                </div>
                {!isPlaying && (
                  <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-[#FF5500] text-black flex items-center justify-center">
                      <Play className="w-7 h-7 fill-current ml-0.5" />
                    </div>
                    <span className="text-white font-mono text-xs uppercase tracking-wider">
                      Click to Play Reel
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="relative z-20 px-5 py-3 bg-[#09090b] border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    isPlaying ? handlePause() : handleStartPlay();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#FF5500] text-black font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentTime(0);
                    handleStartPlay();
                  }}
                  className="p-1.5 rounded-lg bg-white/[0.06] text-white cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadVideo}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-zinc-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#FF5500]" />
                  <span>Export MP4</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFullscreen();
                  }}
                  className="p-1.5 rounded-lg bg-white/[0.06] text-white cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Slide Dots */}
      {totalUpdates > 1 && (
        <div className="flex items-center justify-center gap-2">
          {updatesList.map((update, idx) => (
            <button
              key={update.id}
              type="button"
              onClick={() => {
                if (isPlaying) handlePause();
                setCurrentUpdateIndex(idx);
              }}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentUpdateIndex
                  ? 'w-7 bg-[#FF5500]'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              title={`${update.tag}: ${update.title}`}
            />
          ))}
        </div>
      )}

      {/* MP4 Export Progress Modal */}
      {isExportingVideo && (
        <div className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4">
          <div className="bg-[#111114] border border-white/[0.12] rounded-2xl p-7 max-w-md w-full text-center space-y-5">
            <div className="w-12 h-12 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center mx-auto text-[#FF5500]">
              <Film className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white">Exporting MP4 Video</h3>
              <p className="text-xs text-zinc-400 font-mono">
                {exportStatusText || 'Rendering frames...'} ({exportProgress}%)
              </p>
            </div>
            <div className="w-full h-2 bg-black rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FF5500] transition-all duration-150"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Naija Life Early Access Warning Modal */}
      <NaijaLifeWarningModal
        isOpen={showNaijaLifeWarning}
        onClose={() => setShowNaijaLifeWarning(false)}
        gameUrl={naijaLifeGameUrl}
      />
    </div>
  );
};
