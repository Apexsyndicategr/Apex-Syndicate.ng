import React, { useState, useEffect } from 'react';
import { LaunchPricingInfo } from '../types';
import { motion } from 'motion/react';
import { Flame, Zap, Shield, Sparkles } from 'lucide-react';

interface CountdownTimerProps {
  pricing: LaunchPricingInfo | null;
  onRefresh?: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ pricing, onRefresh }) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  useEffect(() => {
    if (pricing) {
      setSecondsLeft(pricing.secondsRemaining);
    }
  }, [pricing]);

  useEffect(() => {
    if (secondsLeft <= 0 || pricing?.isPaused) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onRefresh) onRefresh();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onRefresh, pricing?.isPaused]);

  if (!pricing) {
    return (
      <div className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 animate-pulse text-center">
        <div className="text-xs text-[#FF6321] font-mono font-bold">Calculating Apex Launch Pricing...</div>
      </div>
    );
  }

  // Convert secondsLeft to Days, Hours, Minutes, Seconds
  const days = Math.floor(secondsLeft / (24 * 3600));
  const hours = Math.floor((secondsLeft % (24 * 3600)) / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const isFree = pricing.activePhase === 'free';
  const isEarly = pricing.activePhase === 'early';

  return (
    <div className="relative overflow-hidden rounded-[28px] md:rounded-[32px] bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-6 md:p-8 shadow-2xl animate-border-glow">
      {/* Top laser scanline sweep */}
      <div className="absolute top-0 left-0 w-32 h-[2px] bg-[#FF6321] shadow-[0_0_12px_#FF6321] animate-laser pointer-events-none" />

      {/* Background glowing ambient light */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#FF6321]/15 rounded-full blur-[90px] pointer-events-none animate-pulse-glow" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] shadow-[0_0_15px_rgba(255,99,33,0.3)]">
            <Flame className="w-6 h-6 animate-bounce" style={{ animationDuration: '2s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-[#FF6321] font-bold font-mono">
                APEX EDITOR LAUNCH PHASE • DAY {pricing.currentDayNumber}
              </span>
              {pricing.isPaused && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-black text-[10px] uppercase font-black tracking-wider animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                  TIMER PAUSED
                </span>
              )}
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white tracking-wide mt-0.5">
              {pricing.isPaused
                ? 'LAUNCH TIMER PAUSED BY OWNER'
                : isFree
                ? 'FREE LAUNCH ACCESS ENDS IN:'
                : isEarly
                ? 'EARLY ACCESS ₦5,000 ENDS IN:'
                : 'FULL PRICE PERIOD ACTIVE'}
            </h3>
          </div>
        </div>

        {/* Current Active Price Badge */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF6321] to-amber-500 text-black font-black text-xl tracking-wider shadow-[0_0_25px_rgba(255,99,33,0.5)] flex items-center gap-2 btn-shimmer-sweep"
        >
          <Zap className="w-5 h-5 fill-black animate-pulse" />
          <span>{pricing.priceDisplay}</span>
        </motion.div>
      </div>

      {/* Countdown Digits Grid */}
      {pricing.activePhase !== 'full' ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6 relative z-10">
          <motion.div
            whileHover={{ y: -3, scale: 1.02 }}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md shadow-inner group hover:border-[#FF6321]/40 transition-colors"
          >
            <span className="text-3xl md:text-5xl font-black font-mono text-white tracking-wider group-hover:text-[#FF6321] transition-colors">
              {String(days).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-bold tracking-widest text-[#FF6321] uppercase mt-1">
              DAYS
            </span>
          </motion.div>

          <motion.div
            whileHover={{ y: -3, scale: 1.02 }}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md shadow-inner group hover:border-[#FF6321]/40 transition-colors"
          >
            <span className="text-3xl md:text-5xl font-black font-mono text-white tracking-wider group-hover:text-[#FF6321] transition-colors">
              {String(hours).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-bold tracking-widest text-[#FF6321] uppercase mt-1">
              HOURS
            </span>
          </motion.div>

          <motion.div
            whileHover={{ y: -3, scale: 1.02 }}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md shadow-inner group hover:border-[#FF6321]/40 transition-colors"
          >
            <span className="text-3xl md:text-5xl font-black font-mono text-white tracking-wider group-hover:text-[#FF6321] transition-colors">
              {String(minutes).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-bold tracking-widest text-[#FF6321] uppercase mt-1">
              MINUTES
            </span>
          </motion.div>

          <motion.div
            whileHover={{ y: -3, scale: 1.02 }}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-black/50 border border-[#FF6321]/30 backdrop-blur-md shadow-[0_0_20px_rgba(255,99,33,0.15)] relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#FF6321]/15 to-transparent animate-pulse pointer-events-none" />
            <span className="text-3xl md:text-5xl font-black font-mono text-[#FF6321] tracking-wider relative z-10">
              {String(seconds).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-bold tracking-widest text-amber-300 uppercase mt-1 relative z-10">
              SECONDS
            </span>
          </motion.div>
        </div>
      ) : (
        <div className="my-6 p-6 rounded-2xl bg-black/40 border border-white/5 text-center">
          <div className="text-lg font-bold text-white">Official Standard Pricing Active</div>
          <p className="text-xs text-gray-400 mt-1">
            Apex Editor is now available at the standard commercial price of ₦17,000 for a lifetime digital license.
          </p>
        </div>
      )}

      {/* Pricing Progression Timeline */}
      <div className="pt-4 border-t border-white/10">
        <div className="text-xs font-semibold text-gray-400 mb-3 flex items-center justify-between">
          <span className="text-[#FF6321] tracking-wider uppercase font-mono">AUTOMATIC LAUNCH TIMELINE</span>
          <span className="text-gray-500 font-mono text-[11px]">14-DAY FREE CYCLE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Phase 1 */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              pricing.activePhase === 'free'
                ? 'bg-[#FF6321]/20 border-[#FF6321] text-white shadow-[0_0_15px_rgba(255,99,33,0.3)]'
                : pricing.currentDayNumber > 14
                ? 'bg-black/30 border-white/5 text-gray-500 opacity-60'
                : 'bg-black/30 border-white/5 text-gray-400'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span>DAYS 1–14</span>
              {pricing.activePhase === 'free' && (
                <span className="px-2 py-0.5 rounded bg-[#FF6321] text-black text-[10px] uppercase font-extrabold">
                  ACTIVE NOW
                </span>
              )}
            </div>
            <div className="text-sm font-black text-[#FF6321] mt-1">FREE ACCESS</div>
            <div className="text-[10px] text-gray-400">₦0 Launch Promotion</div>
          </div>

          {/* Phase 2 */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              pricing.activePhase === 'early'
                ? 'bg-[#FF6321]/20 border-[#FF6321] text-white shadow-[0_0_15px_rgba(255,99,33,0.3)]'
                : pricing.currentDayNumber > 28
                ? 'bg-black/30 border-white/5 text-gray-500 opacity-60'
                : 'bg-black/30 border-white/5 text-gray-400'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span>DAYS 15–28</span>
              {pricing.activePhase === 'early' && (
                <span className="px-2 py-0.5 rounded bg-[#FF6321] text-black text-[10px] uppercase font-extrabold">
                  ACTIVE NOW
                </span>
              )}
            </div>
            <div className="text-sm font-black text-[#FF6321] mt-1">EARLY ACCESS</div>
            <div className="text-[10px] text-gray-400">₦5,000 License Fee</div>
          </div>

          {/* Phase 3 */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              pricing.activePhase === 'full'
                ? 'bg-[#FF6321]/20 border-[#FF6321] text-white shadow-[0_0_15px_rgba(255,99,33,0.3)]'
                : 'bg-black/30 border-white/5 text-gray-400'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span>AFTER DAY 28</span>
              {pricing.activePhase === 'full' && (
                <span className="px-2 py-0.5 rounded bg-[#FF6321] text-black text-[10px] uppercase font-extrabold">
                  ACTIVE NOW
                </span>
              )}
            </div>
            <div className="text-sm font-black text-[#FF6321] mt-1">FULL PRICE</div>
            <div className="text-[10px] text-gray-400">₦17,000 Standard Commercial Fee</div>
          </div>
        </div>
      </div>
    </div>
  );
};
