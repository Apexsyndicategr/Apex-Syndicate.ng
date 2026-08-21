import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, X, Key, ArrowRight, ShieldCheck, Crown, Sparkles, Terminal } from 'lucide-react';
import { loginAdmin } from '../lib/api';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string) => void;
  currentUserEmail?: string | null;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentUserEmail,
}) => {
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isOwnerEmail = currentUserEmail?.toLowerCase().trim() === 'apexsyndicategr@gmail.com';

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setErrorMsg('');
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.value = '';
          inputRef.current.focus();
        }
      }, 80);
      return () => clearTimeout(timer);
    } else {
      setPassword('');
      setErrorMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setPassword('');
    setErrorMsg('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const data = await loginAdmin(password);
      sessionStorage.setItem('apex_admin_token', data.token);
      setPassword('');
      onLoginSuccess(data.token);
      handleClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check master password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutoOwnerUnlock = async () => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const defaultOwnerPass = 'xxander4325king';
      const data = await loginAdmin(defaultOwnerPass);
      sessionStorage.setItem('apex_admin_token', data.token);
      onLoginSuccess(data.token);
      handleClose();
    } catch (err: any) {
      // If password was customized, prompt user to type it
      setErrorMsg('Please enter your custom owner password.');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      {/* Background Animated Glows */}
      <div className="absolute w-[450px] h-[450px] bg-[#FF6321]/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] bg-amber-500/15 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative w-full max-w-md bg-[#08080c] border border-white/15 rounded-[32px] p-8 shadow-[0_0_60px_rgba(255,99,33,0.35)] overflow-hidden space-y-6"
      >
        {/* Laser scanner beam effect */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF6321] to-transparent opacity-90 animate-pulse" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Visual */}
        <div className="text-center space-y-2 pt-1">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF6321]/25 via-amber-500/10 to-transparent border border-[#FF6321]/40 text-[#FF6321] flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(255,99,33,0.3)]">
            <Crown className="w-8 h-8 text-amber-400 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-wider">
            OWNER COMMAND PORTAL
          </h2>
          <p className="text-xs text-gray-400 font-mono">
            High-clearance administration & real-time telemetry console.
          </p>
        </div>

        {/* Quick Owner Verified Banner if user is signed in with apexsyndicategr@gmail.com */}
        {isOwnerEmail && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <div className="text-left">
                <p className="text-xs font-bold text-amber-300 font-mono">Owner Identity Verified</p>
                <p className="text-[10px] text-gray-400 font-mono">apexsyndicategr@gmail.com</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAutoOwnerUnlock}
              disabled={isSubmitting}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-[10px] uppercase font-mono shadow-md cursor-pointer transition-transform hover:scale-105"
            >
              1-CLICK UNLOCK
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase mb-1 font-mono flex items-center justify-between">
              <span>Master Owner Password</span>
              <span className="text-gray-500 font-normal text-[10px]">Encrypted Stream</span>
            </label>
            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                ref={inputRef}
                type="password"
                required
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter owner password..."
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-black/60 border border-white/10 focus:border-[#FF6321] text-white text-sm focus:outline-none placeholder:text-gray-600 transition-colors shadow-inner"
              />
            </div>
          </div>

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/50 text-rose-300 text-xs font-mono"
            >
              {errorMsg}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !password.trim()}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF6321] to-amber-500 hover:from-[#FF8A50] hover:to-amber-400 text-black font-extrabold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(255,99,33,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.01]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Terminal className="w-4 h-4 animate-spin" /> AUTHENTICATING...
              </span>
            ) : (
              <>
                AUTHENTICATE & ENTER <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-[10px] text-gray-500 font-mono border-t border-white/5 pt-2">
          Apex Command Kernel • Secure Access Terminal
        </div>
      </motion.div>
    </div>
  );
};
