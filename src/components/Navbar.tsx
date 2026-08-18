import React, { useState } from 'react';
import { ApexLogo } from './ApexLogo';
import { CustomTab } from '../types';
import { motion } from 'motion/react';
import {
  Menu,
  X,
  Terminal,
  Bell,
  Sparkles,
  Gamepad2,
  Play,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAdminModal: () => void;
  isAdminLoggedIn: boolean;
  customTabs?: CustomTab[];
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openAdminModal,
  isAdminLoggedIn,
  customTabs = [],
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
            className="flex items-center gap-2 group focus:outline-none"
          >
            <ApexLogo size="md" />
          </motion.button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              if (item.highlight) {
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleNavClick(item.id)}
                    className={`relative px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 flex items-center gap-2 ${
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
                    className={`relative px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 flex items-center gap-2 ${
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
                    className={`relative px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 flex items-center gap-2 ${
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
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
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
                  className={`relative px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all duration-200 ${
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

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden backdrop-blur-xl bg-black/90 border-b border-white/10 px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold tracking-wider flex items-center justify-between transition-all ${
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
