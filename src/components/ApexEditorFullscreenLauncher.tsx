import React, { useState, useEffect, useRef } from 'react';
import {
  Maximize2,
  Minimize2,
  ExternalLink,
  AlertTriangle,
  ArrowLeft,
  Play,
  Sparkles,
  Laptop,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

interface ApexEditorFullscreenLauncherProps {
  demoUrl?: string;
  onExit?: () => void;
}

export const ApexEditorFullscreenLauncher: React.FC<ApexEditorFullscreenLauncherProps> = ({
  demoUrl = 'https://apex-editor-demo.vercel.app/',
  onExit,
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showExitHint, setShowExitHint] = useState<boolean>(true);
  const [showAutoPromptOverlay, setShowAutoPromptOverlay] = useState<boolean>(true);
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const formattedUrl =
    demoUrl.startsWith('http://') || demoUrl.startsWith('https://')
      ? demoUrl
      : `https://${demoUrl}`;

  // Check and update fullscreen state
  const checkFullscreen = () => {
    const isFs = Boolean(
      document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
    );
    setIsFullscreen(isFs);
    if (isFs) {
      setShowAutoPromptOverlay(false);
      // Show exit hint for 5 seconds when entering fullscreen
      setShowExitHint(true);
      const timer = setTimeout(() => {
        setShowExitHint(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  };

  const requestFullscreenMode = async () => {
    try {
      const target = document.documentElement;
      if (target.requestFullscreen) {
        await target.requestFullscreen();
      } else if ((target as any).webkitRequestFullscreen) {
        await (target as any).webkitRequestFullscreen();
      } else if ((target as any).msRequestFullscreen) {
        await (target as any).msRequestFullscreen();
      }
      setIsFullscreen(true);
      setShowAutoPromptOverlay(false);
    } catch (err) {
      console.warn('Fullscreen request could not be completed automatically:', err);
      // The browser requires direct user interaction on this document
      setShowAutoPromptOverlay(true);
    }
  };

  const exitFullscreenMode = async () => {
    try {
      if (
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement
      ) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Exit fullscreen error:', err);
    }
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreenMode();
    } else {
      requestFullscreenMode();
    }
  };

  // Attempt auto-fullscreen on initial mount and attach listeners
  useEffect(() => {
    checkFullscreen();

    // Try automatic fullscreen request on load
    requestFullscreenMode();

    const handleFullscreenChange = () => {
      checkFullscreen();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // If user presses Enter or Space while prompt is visible, launch fullscreen
      if (showAutoPromptOverlay && (e.key === 'Enter' || e.key === ' ' || e.code === 'Space')) {
        e.preventDefault();
        requestFullscreenMode();
      }
      // F11 key toggle handler
      if (e.key === 'F11') {
        // Let native browser handle F11, state listener will catch change
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showAutoPromptOverlay]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[999999] w-screen h-screen bg-[#050508] text-white flex flex-col overflow-hidden select-none"
    >
      {/* ========================================================
          FLOATING TOP HUD (VISIBLE IN FULLSCREEN ON HOVER OR INITIAL ENTRY)
         ======================================================== */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 pointer-events-none flex justify-center p-3 ${
          showExitHint || !isFullscreen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 hover:opacity-100 hover:translate-y-0'
        }`}
      >
        <div className="pointer-events-auto flex items-center gap-3 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-black/85 border border-amber-500/50 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-xl font-mono text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">APEX EDITOR DEMO</span>
          </div>

          <div className="h-4 w-px bg-white/20" />

          {isFullscreen ? (
            <div className="flex items-center gap-2 text-gray-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                Fullscreen Active • <strong className="text-amber-300">Press & hold ESC or press F11 to exit</strong>
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-300">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>
                Not in Fullscreen (UI may be cut off) •{' '}
                <button
                  onClick={requestFullscreenMode}
                  className="underline font-bold text-white hover:text-amber-300 cursor-pointer ml-1"
                >
                  Click to Enter Fullscreen
                </button>
              </span>
            </div>
          )}

          <div className="h-4 w-px bg-white/20" />

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => {
                if (onExit) {
                  onExit();
                } else if (window.opener) {
                  window.close();
                } else {
                  window.location.href = '/';
                }
              }}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-rose-500/30 hover:text-rose-300 text-gray-300 transition-colors cursor-pointer"
              title="Close Demo"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          FULLSCREEN WORKSPACE IFRAME CONTAINER
         ======================================================== */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-black">
        {/* Loading Spinner */}
        {!iframeLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050508] z-10 space-y-4">
            <div className="w-12 h-12 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
            <div className="text-center font-mono">
              <p className="text-sm font-bold text-white uppercase tracking-wider">
                INITIALIZING APEX EDITOR CLOUD WORKSPACE...
              </p>
              <p className="text-xs text-amber-400 mt-1">
                Optimizing GPU timeline & sub-millisecond AST parser
              </p>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={formattedUrl}
          title="Apex Editor Web Demo"
          className="w-full h-full border-0 block"
          allow="fullscreen; clipboard-read; clipboard-write; display-capture; camera; microphone; autoplay; encrypted-media"
          onLoad={() => setIframeLoaded(true)}
        />
      </div>

      {/* ========================================================
          INITIAL / NON-FULLSCREEN OVERLAY PROMPT
          (Appears if browser required direct user click to enter Fullscreen)
         ======================================================== */}
      {showAutoPromptOverlay && !isFullscreen && (
        <div
          onClick={requestFullscreenMode}
          className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl p-6 sm:p-10 rounded-3xl bg-[#0b0b10] border-2 border-amber-500/70 shadow-[0_0_80px_rgba(245,158,11,0.4)] text-center space-y-6"
          >
            {/* Header Icon */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
              <Maximize2 className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-500/40 uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>FULLSCREEN DISPLAY REQUIRED</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
                LAUNCH APEX EDITOR DEMO
              </h2>
              <p className="text-sm sm:text-base text-gray-300 font-light max-w-md mx-auto leading-relaxed">
                To ensure the video canvas, timeline tracks, and toolbar controls are not cut off by browser headers, Apex Editor runs in <strong className="text-amber-400 font-semibold">Fullscreen Mode</strong>.
              </p>
            </div>

            {/* KEYBOARD SHORTCUT INSTRUCTION CALLOUT */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-left font-mono space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Laptop className="w-4 h-4" />
                <span>HOW TO EXIT FULLSCREEN ANYTIME:</span>
              </div>
              <p className="text-xs text-gray-200 leading-relaxed">
                • Press and hold <kbd className="px-2 py-0.5 rounded bg-white/20 text-white font-bold text-[11px] border border-white/30">ESC</kbd> key
                <br />
                • Or press <kbd className="px-2 py-0.5 rounded bg-white/20 text-white font-bold text-[11px] border border-white/30">F11</kbd> to toggle full display
              </p>
            </div>

            {/* BIG ACTION BUTTON */}
            <button
              type="button"
              onClick={requestFullscreenMode}
              className="w-full py-5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-[#FF6321] to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-base sm:text-lg uppercase tracking-wider shadow-[0_0_40px_rgba(255,99,33,0.5)] transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-3"
            >
              <Play className="w-6 h-6 fill-black" />
              <span>CLICK TO ENTER FULLSCREEN & LAUNCH</span>
            </button>

            {/* Direct Link Alternative */}
            <div className="pt-2 flex items-center justify-between text-xs font-mono text-gray-400 border-t border-white/10">
              <a
                href={formattedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 underline inline-flex items-center gap-1"
              >
                <span>Open direct link without fullscreen</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                type="button"
                onClick={() => {
                  if (onExit) {
                    onExit();
                  } else if (window.opener) {
                    window.close();
                  } else {
                    window.location.href = '/';
                  }
                }}
                className="hover:text-white"
              >
                Exit / Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
