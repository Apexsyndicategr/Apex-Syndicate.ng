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
} from 'lucide-react';

interface NaijaLifeWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameUrl?: string;
}

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
  gameUrl = 'https://naijalife-rpg.vercel.app',
}) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    setIsMobile(detectIsMobileOrTablet());
  }, [isOpen]);

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

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-xl bg-[#111114] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden my-auto"
          >
            {/* Header */}
            <div className="p-6 pb-5 border-b border-white/[0.08] flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="text-xs font-mono text-[#FF5500] font-medium">
                  Early Access Notice · Web Alpha Build
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Play Naija Life
                </h3>
                <p className="text-sm text-zinc-400">
                  Review these early-access notes before opening the game.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close Warning"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 max-h-[62vh] overflow-y-auto">
              {/* Device Detection Callout */}
              {isMobile ? (
                <div className="p-4 rounded-xl bg-red-950/35 border border-red-500/40 flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-red-300">
                      Mobile Device Detected — Heavy Lag Expected
                    </p>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      The mobile version is still in active development and is not yet optimized. Playing on a phone or tablet will lag heavily. Switch to a PC or laptop browser for smooth performance.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-start gap-3">
                  <Monitor className="w-5 h-5 text-[#FF5500] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">
                      Desktop Browser Detected — Recommended Setup
                    </p>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      The web build is tuned for desktop browsers and runs well on PC with keyboard and mouse.
                    </p>
                  </div>
                </div>
              )}

              <div className="divide-y divide-white/[0.06] border border-white/[0.08] rounded-xl bg-[#09090b]">
                <div className="p-4 flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-[#FF5500] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-white">
                      1. Incomplete Early Access Build
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      This is an early preview and the game is still incomplete. Expect missing areas, placeholder assets, and bugs as development continues.
                    </p>
                  </div>
                </div>

                <div className="p-4 flex items-start gap-3">
                  <Monitor className="w-4 h-4 text-[#FF5500] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-white">
                      2. PC Works Well · Mobile Still In Progress
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Performance is solid on PC browsers, while mobile optimization is still underway and will lag significantly on phones.
                    </p>
                  </div>
                </div>

                <div className="p-4 flex items-start gap-3">
                  <Compass className="w-4 h-4 text-[#FF5500] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-white">
                      3. Full Production Map Rework Planned
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Core systems will evolve for full release—most notably, the map design is getting a complete rework with richer Nigerian districts and regional scale.
                    </p>
                  </div>
                </div>
              </div>

              {/* Destination URL */}
              <div className="px-4 py-3 rounded-xl bg-[#09090b] border border-white/[0.06] flex items-center justify-between gap-2 text-xs font-mono">
                <span className="text-zinc-400 truncate">
                  Destination: <span className="text-[#FF5500] font-medium">{gameUrl}</span>
                </span>
                <span className="text-zinc-500 shrink-0">Web Launch</span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 pt-4 border-t border-white/[0.08] bg-[#0c0c0f] flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleLaunch}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#FF5500] hover:bg-[#FF6E26] text-black font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>Continue to Game</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
