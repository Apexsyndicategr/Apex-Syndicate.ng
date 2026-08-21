import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Laptop, Smartphone, Globe, Clock, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { SecurityAlert } from '../types';
import { terminateOtherSessionsApi, dismissSecurityAlertApi } from '../lib/api';

interface SecurityAlertModalProps {
  alert: SecurityAlert | null;
  onClose: () => void;
  onActionComplete?: () => void;
}

export const SecurityAlertModal: React.FC<SecurityAlertModalProps> = ({
  alert,
  onClose,
  onActionComplete,
}) => {
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  if (!alert) return null;

  const handleDismiss = async () => {
    try {
      await dismissSecurityAlertApi(alert.id);
    } catch (e) {
      console.warn(e);
    }
    onClose();
    if (onActionComplete) onActionComplete();
  };

  const handleTerminateOtherSessions = async () => {
    setLoading(true);
    try {
      const res = await terminateOtherSessionsApi({
        email: alert.email || alert.userEmail,
        userId: alert.userId,
      });
      setStatusMsg(`🛡️ Successfully terminated ${res.terminatedCount || 1} other active sessions. Your account is secured!`);
      setTimeout(() => {
        onClose();
        if (onActionComplete) onActionComplete();
      }, 2000);
    } catch (err: any) {
      setStatusMsg(`Error: ${err.message || 'Failed to terminate other sessions'}`);
    } finally {
      setLoading(false);
    }
  };

  const deviceText = alert.deviceInfo || alert.newDevice?.device || 'Unknown Device';
  const alertEmail = alert.email || alert.userEmail || 'Account';
  const isMobile = deviceText.toLowerCase().includes('mobile') || deviceText.toLowerCase().includes('iphone') || deviceText.toLowerCase().includes('android');

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-md bg-[#0d0d12] border border-amber-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(245,158,11,0.25)] space-y-4"
      >
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon & Heading */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white uppercase tracking-wider">
                Security Alert
              </h3>
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-mono font-bold">
                NEW DEVICE
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono">
              New sign-in detected on {alertEmail}
            </p>
          </div>
        </div>

        {/* Alert Details Box */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5 text-xs font-mono">
          <div className="flex items-center justify-between text-gray-300">
            <span className="text-gray-500 flex items-center gap-1.5">
              {isMobile ? <Smartphone className="w-3.5 h-3.5 text-amber-400" /> : <Laptop className="w-3.5 h-3.5 text-amber-400" />}
              Device:
            </span>
            <span className="font-bold text-white truncate max-w-[200px]">
              {deviceText}
            </span>
          </div>

          <div className="flex items-center justify-between text-gray-300">
            <span className="text-gray-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400" /> Time:
            </span>
            <span className="text-gray-300">
              {new Date(alert.timestamp).toLocaleTimeString()} ({new Date(alert.timestamp).toLocaleDateString()})
            </span>
          </div>

          <div className="flex items-center justify-between text-gray-300">
            <span className="text-gray-500 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-gray-400" /> Status:
            </span>
            <span className="text-amber-400 font-bold">
              Active concurrent session
            </span>
          </div>
        </div>

        <p className="text-[11px] text-gray-400 leading-relaxed">
          Google-style automated security email dispatched to <strong className="text-gray-200">{alertEmail}</strong>. If this wasn't you, terminate all other sessions immediately to secure your account.
        </p>

        {statusMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={handleTerminateOtherSessions}
            disabled={loading}
            className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(225,29,72,0.4)] disabled:opacity-50"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Secure & Terminate</span>
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            disabled={loading}
            className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 font-bold text-[11px] uppercase tracking-wider border border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Yes, It Was Me</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
