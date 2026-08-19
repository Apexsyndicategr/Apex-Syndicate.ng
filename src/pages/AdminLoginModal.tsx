import React, { useState, useEffect, useRef } from 'react';
import { Lock, X, Key, ArrowRight } from 'lucide-react';
import { loginAdmin } from '../lib/api';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Always clear password state and focus input when modal is opened or closed
  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setErrorMsg('');
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.value = '';
          inputRef.current.focus();
        }
      }, 50);
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
      setPassword(''); // Clear password from memory immediately
      onLoginSuccess(data.token);
      handleClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#08080a] border border-white/10 rounded-[32px] p-8 shadow-[0_0_60px_rgba(255,99,33,0.3)] space-y-6">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(255,99,33,0.3)]">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-wider">
            OWNER ADMIN PORTAL
          </h2>
          <p className="text-xs text-gray-400 font-mono">
            Private authenticated access for Apex Syndicate owner.
          </p>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
              Admin Password
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
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/60 border border-white/10 focus:border-[#FF6321] text-white text-sm focus:outline-none"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !password.trim()}
            className="w-full py-3.5 rounded-xl bg-[#FF6321] hover:bg-[#FF8A50] text-black font-extrabold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(255,99,33,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              'Authenticating...'
            ) : (
              <>
                AUTHENTICATE & ENTER <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-[10px] text-gray-500 font-mono border-t border-white/5">
          Protected route • Secured by Apex Syndicate Auth
        </div>
      </div>
    </div>
  );
};
