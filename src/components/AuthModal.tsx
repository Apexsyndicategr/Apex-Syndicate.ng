import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Shield,
  Upload,
  Check,
  CheckCircle2,
  Crown,
  LogOut,
  Camera,
  BellRing,
} from 'lucide-react';
import { UserAccount, SecurityAlert } from '../types';
import { registerUserApi, loginUserApi, googleSimLoginApi, updateUserProfileApi } from '../lib/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onAuthSuccess: (user: UserAccount, token: string, securityAlert?: SecurityAlert) => void;
  onLogout: () => void;
  onOpenAdminPortal?: () => void;
  onContinueAsGuest?: () => void;
  initialTab?: 'signin' | 'signup' | 'profile';
  isEntryPrompt?: boolean;
}

const PRESET_AVATARS = [
  { id: 'pfp-1', name: 'Syndicate Boss', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=apex-owner&backgroundColor=ff6321' },
  { id: 'pfp-2', name: 'Cyber Hacker', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=cyber-hacker&backgroundColor=0284c7' },
  { id: 'pfp-3', name: 'Neon Operative', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=neon-agent&backgroundColor=7c3aed' },
  { id: 'pfp-4', name: 'Neural AI', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=neural-core&backgroundColor=059669' },
  { id: 'pfp-5', name: 'Game Master', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=game-master&backgroundColor=dc2626' },
  { id: 'pfp-6', name: 'Diamond VIP', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=apex-vip&backgroundColor=f59e0b' },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess,
  onLogout,
  onOpenAdminPortal,
  onContinueAsGuest,
  initialTab,
  isEntryPrompt = false,
}) => {
  const [tab, setTab] = useState<'signin' | 'signup' | 'profile'>(
    currentUser ? 'profile' : initialTab || 'signin'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(PRESET_AVATARS[0].url);
  const [customAvatarPreview, setCustomAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isOwnerEmail = email.toLowerCase().trim() === 'apexsyndicategr@gmail.com';

  // Sync state when opened or user changes
  React.useEffect(() => {
    if (currentUser) {
      setTab('profile');
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setSelectedAvatar(currentUser.avatar || PRESET_AVATARS[0].url);
      setCustomAvatarPreview(currentUser.avatar?.startsWith('data:') ? currentUser.avatar : null);
    } else {
      setTab(initialTab || 'signin');
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [currentUser, isOpen, initialTab]);

  if (!isOpen) return null;

  const effectiveAvatar = customAvatarPreview || selectedAvatar;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 3MB. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setCustomAvatarPreview(result);
      setSelectedAvatar(result);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await loginUserApi({
        email: email.trim(),
        password: password || undefined,
      });

      onAuthSuccess(res.user, res.token, (res as any).securityAlert);
      setSuccessMsg(
        res.user.role === 'owner'
          ? '👑 Welcome back Chief! Identity recognized.'
          : `⚡ Welcome back, ${res.user.name}!`
      );
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please provide a valid email or Gmail address.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await registerUserApi({
        email: email.trim(),
        password,
        name: name.trim() || undefined,
        avatar: effectiveAvatar,
        newsletterSubscribed: isOwnerEmail ? false : newsletterSubscribed,
      });

      onAuthSuccess(res.user, res.token, (res as any).securityAlert);
      setSuccessMsg(
        res.user.role === 'owner'
          ? '👑 Account registered & authenticated!'
          : '⚡ Syndicate Account created successfully!'
      );
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleQuickAuth = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    const targetEmail = email.trim() || 'apexsyndicategr@gmail.com';
    const isOwner = targetEmail.toLowerCase().trim() === 'apexsyndicategr@gmail.com';

    try {
      const res = await googleSimLoginApi({
        email: targetEmail,
        name: name.trim() || (isOwner ? 'Apex Syndicate Owner' : targetEmail.split('@')[0]),
        avatar: effectiveAvatar,
        newsletterSubscribed: isOwner ? false : newsletterSubscribed,
      });

      onAuthSuccess(res.user, res.token, (res as any).securityAlert);
      setSuccessMsg(
        res.user.role === 'owner'
          ? '👑 Google Auth Verified: Owner profile recognized.'
          : `⚡ Google Auth Verified: Signed in as ${res.user.email}!`
      );
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Google authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await updateUserProfileApi({
        userId: currentUser.id,
        name: name.trim(),
        avatar: effectiveAvatar,
      });

      onAuthSuccess(res.user, 'session-maintained');
      setSuccessMsg('✅ Profile and PFP updated successfully!');
      setTimeout(() => {
        setSuccessMsg(null);
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Background Glows */}
      <div className="absolute w-[450px] h-[450px] bg-[#FF6321]/15 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative w-full max-w-md bg-[#0a0a0e] border border-white/15 rounded-3xl p-5 sm:p-6 shadow-[0_0_50px_rgba(255,99,33,0.2)] overflow-hidden space-y-4"
      >
        {/* Top glowing laser line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF6321] to-transparent opacity-90" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF6321]/20 via-amber-500/10 to-transparent border border-[#FF6321]/40 text-[#FF6321] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(255,99,33,0.3)]">
            {currentUser?.role === 'owner' ? (
              <Crown className="w-6 h-6 text-amber-400 animate-pulse" />
            ) : (
              <Shield className="w-6 h-6 text-[#FF6321]" />
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
            {currentUser
              ? 'SYNDICATE PROFILE'
              : isEntryPrompt
              ? 'WELCOME TO APEX SYNDICATE'
              : tab === 'signin'
              ? 'ACCOUNT SIGN IN'
              : 'CREATE ACCOUNT'}
          </h2>
          <p className="text-[11px] text-gray-400 font-mono">
            {currentUser
              ? currentUser.role === 'owner'
                ? '👑 Chief Owner & Syndicate Architect'
                : 'Authenticated Syndicate Member'
              : isEntryPrompt
              ? 'Sign in, register for updates, or explore as a guest.'
              : 'Sign in with your Gmail to sync your account.'}
          </p>
        </div>

        {/* Tabs switcher (if not signed in) */}
        {!currentUser && (
          <div className="grid grid-cols-2 p-1 rounded-xl bg-white/[0.04] border border-white/10">
            <button
              type="button"
              onClick={() => {
                setTab('signin');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                tab === 'signin'
                  ? 'bg-[#FF6321] text-black font-black shadow-[0_0_12px_rgba(255,99,33,0.35)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('signup');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                tab === 'signup'
                  ? 'bg-[#FF6321] text-black font-black shadow-[0_0_12px_rgba(255,99,33,0.35)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Messages */}
        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-500/50 text-rose-300 text-xs font-mono">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ========================================================
            TAB 1: SIGN IN
           ======================================================== */}
        {tab === 'signin' && !currentUser && (
          <form onSubmit={handleSignIn} className="space-y-3">
            {/* Quick Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleQuickAuth}
              disabled={isLoading}
              className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider border border-white/15 transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.8 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                />
              </svg>
              <span>Continue with Google / Gmail</span>
            </button>

            <div className="flex items-center gap-2 my-1">
              <div className="h-[1px] flex-1 bg-white/10" />
              <span className="text-[9px] text-gray-500 font-mono uppercase">OR WITH EMAIL</span>
              <div className="h-[1px] flex-1 bg-white/10" />
            </div>

            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email or Gmail address..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-[#FF6321] text-white text-xs focus:outline-none placeholder:text-gray-600"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (Optional for Google accounts)..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-[#FF6321] text-white text-xs focus:outline-none placeholder:text-gray-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-[#FF6321] hover:bg-[#FF8A50] text-black font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(255,99,33,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Continue as Guest Button (Instantly visible without scrolling) */}
            <button
              type="button"
              onClick={() => {
                if (onContinueAsGuest) onContinueAsGuest();
                onClose();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-gray-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-[#FF6321]" />
              <span>Continue as Guest</span>
            </button>
          </form>
        )}

        {/* ========================================================
            TAB 2: SIGN UP / REGISTER
           ======================================================== */}
        {tab === 'signup' && !currentUser && (
          <form onSubmit={handleSignUp} className="space-y-3">
            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name or Handle (e.g. Alex Dev)..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-[#FF6321] text-white text-xs focus:outline-none placeholder:text-gray-600"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email or Gmail address..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-[#FF6321] text-white text-xs focus:outline-none placeholder:text-gray-600"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-[#FF6321] text-white text-xs focus:outline-none placeholder:text-gray-600"
                />
              </div>
            </div>

            {/* Profile Avatar Selection Mini Row */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-gray-400">Choose Profile Avatar:</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[#FF6321] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3 h-3" /> Upload Photo
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <div className="grid grid-cols-6 gap-1.5 pt-0.5">
                {PRESET_AVATARS.map((av) => {
                  const isSelected = selectedAvatar === av.url && !customAvatarPreview;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => {
                        setSelectedAvatar(av.url);
                        setCustomAvatarPreview(null);
                      }}
                      className={`relative p-0.5 rounded-lg border transition-all aspect-square flex items-center justify-center cursor-pointer ${
                        isSelected
                          ? 'border-[#FF6321] bg-[#FF6321]/20 shadow-[0_0_8px_rgba(255,99,33,0.5)]'
                          : 'border-white/10 bg-white/5 hover:border-white/30'
                      }`}
                    >
                      <img src={av.url} alt={av.name} className="w-7 h-7 rounded-md object-cover" />
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#FF6321] text-black flex items-center justify-center">
                          <Check className="w-2 h-2 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Newsletter & Updates Opt-In Checkbox (Hidden completely for Owner email) */}
            {!isOwnerEmail && (
              <label className="flex items-start gap-2.5 p-2 rounded-xl bg-white/[0.02] border border-white/10 hover:border-[#FF6321]/40 transition-colors cursor-pointer group">
                <input
                  type="checkbox"
                  checked={newsletterSubscribed}
                  onChange={(e) => setNewsletterSubscribed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-600 text-[#FF6321] focus:ring-0 focus:ring-offset-0 bg-black/60 accent-[#FF6321] cursor-pointer"
                />
                <div className="text-[11px] leading-snug">
                  <span className="text-gray-200 font-semibold group-hover:text-white flex items-center gap-1">
                    <BellRing className="w-3 h-3 text-[#FF6321]" /> Subscribe to Newsletters & Dev Updates
                  </span>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                    Receive Apex Editor launch alerts, game patches, and intel directly to your email.
                  </p>
                </div>
              </label>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-[#FF6321] hover:bg-[#FF8A50] text-black font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(255,99,33,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'CREATING ACCOUNT...' : 'JOIN & REGISTER'}
              <Sparkles className="w-3.5 h-3.5" />
            </button>

            {/* Continue as Guest Button (Instantly visible without scrolling) */}
            <button
              type="button"
              onClick={() => {
                if (onContinueAsGuest) onContinueAsGuest();
                onClose();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-gray-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-[#FF6321]" />
              <span>Continue as Guest</span>
            </button>
          </form>
        )}

        {/* ========================================================
            TAB 3: USER PROFILE & PFP EDITOR (SIGNED IN)
           ======================================================== */}
        {currentUser && (
          <div className="space-y-4">
            {/* Active User Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-white/[0.04] to-white/[0.02] border border-white/10 flex items-center gap-3.5">
              <div className="relative shrink-0">
                <img
                  src={effectiveAvatar}
                  alt={currentUser.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-[#FF6321] shadow-[0_0_15px_rgba(255,99,33,0.4)]"
                />
                {currentUser.role === 'owner' && (
                  <div className="absolute -top-1.5 -right-1.5 p-1 rounded-md bg-amber-500 text-black shadow">
                    <Crown className="w-3 h-3" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-white truncate">{currentUser.name}</h3>
                  {currentUser.role === 'owner' ? (
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[8px] font-mono font-bold uppercase">
                      OWNER
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[8px] font-mono font-bold uppercase">
                      MEMBER
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 font-mono truncate">{currentUser.email}</p>
                <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                  Joined: {new Date(currentUser.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Quick Actions if Owner */}
            {currentUser.role === 'owner' && onOpenAdminPortal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAdminPortal();
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-[#FF6321] to-orange-600 text-black font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,99,33,0.4)] flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] transition-transform"
              >
                <Crown className="w-4 h-4" />
                <span>ENTER OWNERS PORTAL</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {/* Edit Profile Form */}
            <form onSubmit={handleUpdateProfile} className="space-y-3 border-t border-white/10 pt-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1 font-mono">
                  Update Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 focus:border-[#FF6321] text-white text-xs focus:outline-none"
                />
              </div>

              {/* PFP Change */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-gray-400">Change Avatar / Photo</span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[#FF6321] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Camera className="w-3 h-3" /> Upload Photo
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                <div className="grid grid-cols-6 gap-1.5">
                  {PRESET_AVATARS.map((av) => {
                    const isSelected = selectedAvatar === av.url && !customAvatarPreview;
                    return (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => {
                          setSelectedAvatar(av.url);
                          setCustomAvatarPreview(null);
                        }}
                        className={`p-0.5 rounded-lg border transition-all aspect-square flex items-center justify-center cursor-pointer ${
                          isSelected
                            ? 'border-[#FF6321] bg-[#FF6321]/20 shadow-[0_0_8px_rgba(255,99,33,0.5)]'
                            : 'border-white/10 bg-white/5'
                        }`}
                      >
                        <img src={av.url} alt={av.name} className="w-7 h-7 rounded-md object-cover" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-xl bg-[#FF6321] hover:bg-[#FF8A50] text-black font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isLoading ? 'SAVING...' : 'SAVE CHANGES'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-rose-950/40 hover:text-rose-300 text-gray-400 font-bold text-xs uppercase tracking-wider border border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>SIGN OUT</span>
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="text-center text-[9px] text-gray-500 font-mono border-t border-white/5 pt-1.5">
          Apex Syndicate Identity Network • End-to-End Secure
        </div>
      </motion.div>
    </div>
  );
};

