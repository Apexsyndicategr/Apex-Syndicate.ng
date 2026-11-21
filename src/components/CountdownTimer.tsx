import React, { useState, useEffect } from 'react';
import { LaunchPricingInfo } from '../types';

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
      <div className="p-6 rounded-2xl bg-[#111114] border border-white/[0.08] text-center">
        <div className="text-xs text-zinc-400 font-mono">Loading launch schedule...</div>
      </div>
    );
  }

  const days = Math.floor(secondsLeft / (24 * 3600));
  const hours = Math.floor((secondsLeft % (24 * 3600)) / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const isFree = pricing.activePhase === 'free';
  const isEarly = pricing.activePhase === 'early';

  return (
    <div className="rounded-2xl bg-[#111114] border border-white/[0.08] p-6 md:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
        <div>
          <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
            <span className="text-[#FF5500] font-semibold">Launch Phase</span>
            <span aria-hidden="true">·</span>
            <span>Day {pricing.currentDayNumber}</span>
            {pricing.isPaused && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-amber-400 font-medium">Paused</span>
              </>
            )}
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white mt-1">
            {pricing.isPaused
              ? 'Launch Timer Paused'
              : isFree
              ? 'Free Launch Window Ends In'
              : isEarly
              ? 'Early Access Pricing Ends In'
              : 'Standard Commercial Pricing Active'}
          </h3>
        </div>

        <div className="px-4 py-2 rounded-lg bg-[#FF5500] text-black font-bold font-mono text-base tabular-nums shrink-0 w-fit">
          {pricing.priceDisplay}
        </div>
      </div>

      {/* Countdown Digits */}
      {pricing.activePhase !== 'full' ? (
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Days', value: days },
            { label: 'Hours', value: hours },
            { label: 'Minutes', value: minutes },
            { label: 'Seconds', value: seconds, highlight: true },
          ].map((unit) => (
            <div
              key={unit.label}
              className="flex flex-col items-center justify-center py-4 px-2 rounded-xl bg-[#09090b] border border-white/[0.06]"
            >
              <span
                className={`text-2xl md:text-4xl font-bold font-mono tabular-nums ${
                  unit.highlight ? 'text-[#FF5500]' : 'text-white'
                }`}
              >
                {String(unit.value).padStart(2, '0')}
              </span>
              <span className="text-[11px] text-zinc-500 mt-1">{unit.label}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-5 rounded-xl bg-[#09090b] border border-white/[0.06] text-center space-y-1">
          <div className="text-base font-semibold text-white">Standard License Pricing Active</div>
          <p className="text-xs text-zinc-400">
            Apex Editor is available at the standard commercial rate of ₦17,000 for a lifetime license.
          </p>
        </div>
      )}

      {/* Progression Timeline */}
      <div className="pt-4 border-t border-white/[0.08] space-y-3">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="font-medium text-zinc-300">Release Pricing Schedule</span>
          <span className="font-mono text-zinc-500">14-day phases</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            className={`p-3.5 rounded-xl border transition-colors ${
              pricing.activePhase === 'free'
                ? 'bg-[#FF5500]/10 border-[#FF5500]/60 text-white'
                : 'bg-[#09090b] border-white/[0.06] text-zinc-400'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span>Days 1–14</span>
              {pricing.activePhase === 'free' && (
                <span className="text-[#FF5500] font-semibold">Current</span>
              )}
            </div>
            <div className="text-sm font-semibold text-white mt-1">Free Access</div>
            <div className="text-xs text-zinc-400">₦0 launch tier</div>
          </div>

          <div
            className={`p-3.5 rounded-xl border transition-colors ${
              pricing.activePhase === 'early'
                ? 'bg-[#FF5500]/10 border-[#FF5500]/60 text-white'
                : 'bg-[#09090b] border-white/[0.06] text-zinc-400'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span>Days 15–28</span>
              {pricing.activePhase === 'early' && (
                <span className="text-[#FF5500] font-semibold">Current</span>
              )}
            </div>
            <div className="text-sm font-semibold text-white mt-1">Early Access</div>
            <div className="text-xs text-zinc-400">₦5,000 license</div>
          </div>

          <div
            className={`p-3.5 rounded-xl border transition-colors ${
              pricing.activePhase === 'full'
                ? 'bg-[#FF5500]/10 border-[#FF5500]/60 text-white'
                : 'bg-[#09090b] border-white/[0.06] text-zinc-400'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span>Day 29+</span>
              {pricing.activePhase === 'full' && (
                <span className="text-[#FF5500] font-semibold">Current</span>
              )}
            </div>
            <div className="text-sm font-semibold text-white mt-1">Standard</div>
            <div className="text-xs text-zinc-400">₦17,000 license</div>
          </div>
        </div>
      </div>
    </div>
  );
};
