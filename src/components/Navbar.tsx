import React, { useState } from 'react';
import { ApexLogo } from './ApexLogo';
import { CustomTab, UserAccount } from '../types';
import { motion } from 'motion/react';
import {
  Menu,
  X,
  Terminal,
  Bell,
  Sparkles,
  Gamepad2,
  Play,
  User,
  Crown,
  Shield,
  LogIn,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAdminModal: () => void;
  isAdminLoggedIn: boolean;
  customTabs?: CustomTab[];
  currentUser?: UserAccount | null;
  onOpenAuthModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openAdminModal,
  isAdminLoggedIn,
  customTabs = [],
  currentUser = null,
  onOpenAuthModal = () => {},
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeCustomTabs = customTabs.filter((t) => t.isActive);

  interface NavItem {
    id: string;
    label: string;
    highlight?: boolean;
    isDemo?: boolean;
    isGame?: boolean;
    isNotif?: boolean;
    isCustom?: boolean;
  }

  const baseNavItems: NavItem[] = [
    { id: 'home', label: 'HOME' },
    { id: 'products', label: 'PRODUCTS' },
    { id: 'apex-editor', label: 'APEX EDITOR', highlight: true },
    { id: 'apex-editor-demo', label: 'APEX EDITOR DEMO', isDemo: true },
    { id: 'gangster-revolution', label: 'GANGSTER REVOLUTION', isGame: true },
    { id: 'about', label: 'ABOUT' },
    { id: 'contact', label: 'CONTACT' },
    { id: 'notifications', label: 'NOTIFICATIONS', isNotif: true },
  ];

  const customNavItems: NavItem[] = activeCustomTabs.map((ct) => ({
    id: `custom-${ct.id}`,
    label: ct.label.toUpperCase(),
    isCustom: true,
  }));

  const navItems: NavItem[] = [...baseNavItems, ...customNavItems];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isOwner = currentUser?.role === 'owner' || currentUser?.email?.toLowerCase() === 'apexsyndicategr@gmail.com';

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10 shadow-2xl transition-all duration-300">
      {/* Top glowing laser line */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FF6321] to-transparent opacity-80 animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo with gentle hover motion */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 group focus:outline-none cursor-pointer"
          >
            <ApexLogo size="md" />
          </motion.button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              if (item.highlight) {
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleNavClick(item.id)}
                    className={`relative px-3.5 py-2 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-[#FF6321] text-black shadow-[0_0_25px_rgba(255,99,33,0.6)] font-black'
                        : 'bg-[#FF6321]/10 text-[#FF6321] hover:bg-[#FF6321]/20 border border-[#FF6321]/30 hover:shadow-[0_0_15px_rgba(255,99,33,0.25)]'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    {item.label}
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6321] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6321]"></span>
                    </span>
                  </motion.button>
                );
              }

              if (item.isDemo) {
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleNavClick(item.id)}
                    className={`relative px-3 py-2 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-[0_0_25px_rgba(245,158,11,0.6)] font-black'
                        : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current animate-pulse" />
                    {item.label}
                    <span className="px-1.5 py-0.5 text-[9px] bg-amber-500/20 text-amber-300 font-extrabold rounded border border-amber-500/40">
                      LIVE
                    </span>
                  </motion.button>
                );
              }

              if (item.isGame) {
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleNavClick(item.id)}
                    className={`relative px-3 py-2 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-[0_0_25px_rgba(220,38,38,0.6)] border border-red-500/50'
                        : 'bg-red-950/20 text-red-400 hover:bg-red-950/40 hover:text-red-300 border border-red-500/20'
                    }`}
                  >
                    <Gamepad2 className="w-3.5 h-3.5 text-red-400" />
                    {item.label}
                    <span className="px-1.5 py-0.5 text-[9px] bg-red-500/20 text-red-300 font-extrabold rounded border border-red-500/40">
                      TBD
                    </span>
                  </motion.button>
                );
              }

              if (item.isNotif) {
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'text-white bg-[#FF6321]/20 border border-[#FF6321]/50 shadow-[0_0_15px_rgba(255,99,33,0.3)]'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Bell className="w-3.5 h-3.5 text-[#FF6321]" />
                    {item.label}
                  </motion.button>
                );
              }

              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3 py-2 rounded-xl text-xs font-bold tracking-wider transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-white bg-white/10 border border-white/15 shadow-[0_0_15px_rgba(255,255,255,0.08)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </motion.button>
              );
            })}
          </nav>

          {/* Right Action Hub: User Profile, Owner Portal & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Owner Portal Quick Link if Owner or Admin Logged In */}
            {(isOwner || isAdminLoggedIn) && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openAdminModal}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 via-[#FF6321]/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold font-mono tracking-wider cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.2)]"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>OWNER'S TAB</span>
              </motion.button>
            )}

            {/* User Account / Gmail Sign-in Button with PFP */}
            {currentUser ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenAuthModal}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 transition-all cursor-pointer group"
                title="Manage Syndicate Account & Profile"
              >
                <div className="relative">
                  <img
                    src={currentUser.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-xl object-cover border border-[#FF6321] group-hover:shadow-[0_0_12px_rgba(255,99,33,0.5)]"
                  />
                  {isOwner && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-md">
                      <Crown className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
                <div className="text-left hidden sm:block pr-1">
                  <p className="text-[11px] font-bold text-white leading-tight truncate max-w-[110px]">
                    {currentUser.name}
                  </p>
                  <p className="text-[9px] text-[#FF6321] font-mono leading-none">
                    {isOwner ? '👑 OWNER' : 'MEMBER'}
                  </p>
                </div>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onOpenAuthModal}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FF6321] to-amber-500 hover:from-[#FF8A50] hover:to-amber-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,99,33,0.35)] transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>LOG IN / SIGN UP</span>
              </motion.button>
            )}

            {/* Mobile Hamburger Toggle */}
            <div className="flex xl:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10 focus:outline-none cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden backdrop-blur-xl bg-black/95 border-b border-white/10 px-4 pt-3 pb-6 space-y-2 animate-fadeIn max-h-[80vh] overflow-y-auto">
          {/* User Auth Item at top of Mobile Menu */}
          <div className="pb-2 mb-1 border-b border-white/10">
            {currentUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal();
                }}
                className="w-full text-left px-4 py-3 rounded-xl text-xs font-bold tracking-wider flex items-center justify-between bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={currentUser.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-lg object-cover border border-[#FF6321]"
                  />
                  <div className="truncate">
                    <span className="block font-bold">{currentUser.name}</span>
                    <span className="text-[10px] text-gray-400 font-mono">{currentUser.email}</span>
                  </div>
                </div>
                <span className="text-[10px] text-[#FF6321] font-mono font-bold uppercase">
                  {isOwner ? '👑 OWNER' : 'MANAGE'}
                </span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal();
                }}
                className="w-full text-left px-4 py-3 rounded-xl text-xs font-bold tracking-wider flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF6321] to-amber-500 text-black font-extrabold shadow-[0_0_15px_rgba(255,99,33,0.4)] uppercase cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>LOG IN / SIGN UP</span>
              </button>
            )}
          </div>
          {/* Owner Quick Entry in Mobile */}
          {(isOwner || isAdminLoggedIn) && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openAdminModal();
              }}
              className="w-full text-left px-4 py-3 rounded-xl text-xs font-bold tracking-wider flex items-center justify-between bg-amber-500/20 border border-amber-500/40 text-amber-300 mb-2 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>ENTER OWNER'S DASHBOARD</span>
              </div>
              <span className="text-[10px] bg-amber-400 text-black px-1.5 py-0.5 rounded font-black">
                MASTER
              </span>
            </button>
          )}

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                activeTab === item.id
                  ? 'bg-[#FF6321] text-black shadow-[0_0_15px_rgba(255,99,33,0.4)]'
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <span>{item.label}</span>
              {item.highlight && (
                <span className="px-2 py-0.5 text-[10px] bg-black text-[#FF6321] font-extrabold rounded-md uppercase">
                  FLAGSHIP
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

