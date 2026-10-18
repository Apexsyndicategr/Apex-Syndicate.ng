import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  Play,
  Monitor,
  Smartphone,
  ExternalLink,
  X,
  Compass,
  Sparkles,
  Info,
  Copy,
  Check,
  ShieldAlert,
} from 'lucide-react';

interface NaijaLifeWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameUrl?: string;
}

// Mobile and Tablet device detector
function detectIsMobileOrTablet(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;

  const ua = (navigator.userAgent || navigator.vendor || (window as any).opera || '').toLowerCase();
  const mobileKeywords = [
    'android',
    'webos',
    'iphone',
    'ipad',
    'ipod',
    'blackberry',
    'iemobile',
    'opera mini',
    'mobile',
    'tablet',
    'silk',
    'kindle',
    'fennec',
    'windows phone',
    'samsungbrowser',
  ];

  const hasMobileUA = mobileKeywords.some((keyword) => ua.includes(keyword));
  const isIpadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  const isTouchDevice = navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
  const isSmallScreen = window.innerWidth < 1024;

  return hasMobileUA || isIpadOS || (isTouchDevice && isSmallScreen);
}

export const NaijaLifeWarningModal: React.FC<NaijaLifeWarningModalProps> = ({
  isOpen,
  onClose,
  gameUrl = 'https://naijalife.ai.studio/',
}) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    setIsMobile(detectIsMobileOrTablet());
  }, [isOpen]);

  // Lock body scroll and listen for ESC key
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.code === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleLaunch = () => {
    try {
      const newTab = window.open(gameUrl, '_blank', 'noopener,noreferrer');
      if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
        window.location.href = gameUrl;
      }
    } catch {
      window.location.href = gameUrl;
    }
    onClose();
  };

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(gameUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-xl transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            className="relative z-10 w-full max-w-2xl bg-[#090d0b] border-2 border-emerald-500/50 rounded-3xl shadow-[0_0_80px_rgba(16,185,129,0.35)] overflow-hidden my-auto"
          >
            {/* Top Glowing Ambient Accents */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-amber-400 to-teal-400" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-32 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Modal Header */}
            <div className="relative p-6 sm:p-8 pb-4 border-b border-white/10 flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>EARLY ACCESS ALPHA BUILD • IMPORTANT NOTICE</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
                  <span>PLAY NAIJA LIFE</span>
                  <span className="text-xs sm:text-sm font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    WEB BUILD
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-300">
                  Please review the early access build disclaimers below before launching the web game.
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-all cursor-pointer"
                title="Close Warning"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Warning List */}
            <div className="p-6 sm:p-8 space-y-4 max-h-[62vh] overflow-y-auto">
              {/* Dynamic Device Detection Highlight */}
              {isMobile ? (
                <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/50 flex items-start gap-3.5 shadow-lg">
                  <div className="p-2 rounded-xl bg-red-500/20 text-red-400 shrink-0 mt-0.5">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-red-300 uppercase tracking-wide font-mono">
                      Mobile Device Detected: Heavy Lag Expected!
                    </p>
                    <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                      You are currently browsing from a mobile or tablet device. The mobile version is still in active development and is <strong>not yet optimized</strong>. You will likely experience significant frame lag, slow asset loading, and touch control stutter. For a smooth experience, please launch on a <strong>PC or Laptop</strong>.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 flex items-start gap-3.5 shadow-lg">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-emerald-300 uppercase tracking-wide font-mono">
                      PC / Desktop Detected: Recommended Setup
                    </p>
                    <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                      You are on a desktop/laptop browser! The web build runs smoothly on PC with keyboard/mouse navigation and hardware acceleration.
                    </p>
                  </div>
                </div>
              )}

              {/* Warning Item 1: Incomplete Early Access */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="space-y-1 text-left">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                    1. Early Access & Incomplete Game State
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    This is an early preview build and the game is <strong>still incomplete</strong>. You may encounter gameplay bugs, placeholder textures, unvoiced dialogues, or missing state systems while our development team actively iterates.
                  </p>
                </div>
              </div>

              {/* Warning Item 2: Mobile vs PC Performance */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 shrink-0 mt-0.5">
                  <Monitor className="w-5 h-5" />
                </div>
                <div className="space-y-1 text-left">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                    2. Platform Performance: PC Works Well, Mobile Still in Work
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    The web engine is tuned for desktop browsers where <strong>it works well and performs smoothly</strong>. However, because the mobile version is still in active development, it <strong>will lag a lot if you play on mobile phones or tablets</strong>.
                  </p>
                </div>
              </div>

              {/* Warning Item 3: Upcoming Full Production Changes & Map Design Rework */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 shrink-0 mt-0.5">
                  <Compass className="w-5 h-5" />
                </div>
                <div className="space-y-1 text-left">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                    3. Major Changes Ahead: Map Design Rework Coming
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    Several core elements will change once the game is fully produced. Most notably, the <strong>map design is definitely getting a complete rework</strong> to encompass realistic regional scale, richer landmarks, and higher-density Nigerian urban grids.
                  </p>
                </div>
              </div>

              {/* Destination URL Display */}
              <div className="p-3.5 rounded-xl bg-black/60 border border-emerald-500/30 flex items-center justify-between gap-2 text-xs font-mono">
                <span className="text-gray-400 truncate">
                  Target Destination: <span className="text-emerald-400 font-bold">{gameUrl}</span>
                </span>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                  title="Copy direct link"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Modal Footer / Action Buttons */}
            <div className="p-6 sm:p-8 pt-4 border-t border-white/10 bg-black/40 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-mono text-xs uppercase tracking-wider transition-all cursor-pointer border border-white/10 text-center"
              >
                Go Back / Cancel
              </button>

              <button
                type="button"
                onClick={handleLaunch}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 hover:from-emerald-400 hover:to-amber-300 text-black font-black font-mono text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(16,185,129,0.6)] flex items-center justify-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer btn-shimmer-sweep"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>I Understand • Proceed to Play</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
