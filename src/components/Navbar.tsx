import React, { useState } from 'react';
import { ApexLogo } from './ApexLogo';
import { CustomTab } from '../types';
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
    <header className="sticky top-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/5 shadow-2xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 group focus:outline-none"
          >
            <ApexLogo size="md" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              if (item.highlight) {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`relative px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 flex items-center gap-2 ${
                      isActive
                        ? 'bg-[#FF6321] text-black shadow-[0_0_20px_rgba(255,99,33,0.5)]'
                        : 'bg-[#FF6321]/10 text-[#FF6321] hover:bg-[#FF6321]/20 border border-[#FF6321]/30'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    {item.label}
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6321] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6321]"></span>
                    </span>
                  </button>
                );
              }

              if (item.isDemo) {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`relative px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 flex items-center gap-2 ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.5)] font-black'
                        : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    {item.label}
                    <span className="px-1.5 py-0.5 text-[9px] bg-amber-500/20 text-amber-300 font-extrabold rounded border border-amber-500/40">
                      LIVE
                    </span>
                  </button>
                );
              }

              if (item.isGame) {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`relative px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 flex items-center gap-2 ${
                      isActive
                        ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)] border border-red-500/50'
                        : 'bg-red-950/20 text-red-400 hover:bg-red-950/40 hover:text-red-300 border border-red-500/20'
                    }`}
                  >
                    <Gamepad2 className="w-3.5 h-3.5 text-red-400" />
                    {item.label}
                    <span className="px-1.5 py-0.5 text-[9px] bg-red-500/20 text-red-300 font-extrabold rounded border border-red-500/40">
                      TBD
                    </span>
                  </button>
                );
              }

              if (item.isNotif) {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
                      isActive
                        ? 'text-white bg-[#FF6321]/20 border border-[#FF6321]/50 shadow-sm'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Bell className="w-3.5 h-3.5 text-[#FF6321]" />
                    {item.label}
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-white/10 border border-white/10 shadow-sm'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
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
                  ? 'bg-[#FF6321] text-black'
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
