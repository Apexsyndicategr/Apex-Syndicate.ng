import React, { useState } from 'react';
import { ApexLogo } from './ApexLogo';
import { CustomTab } from '../types';
import { Menu, X, Bell } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAdminModal?: () => void;
  isAdminLoggedIn?: boolean;
  customTabs?: CustomTab[];
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  customTabs = [],
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeCustomTabs = customTabs.filter((t) => t.isActive);

  interface NavItem {
    id: string;
    label: string;
  }

  const primaryNavItems: NavItem[] = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
    { id: 'naija-life', label: 'Naija Life' },
    { id: 'apex-editor', label: 'Apex Editor' },
    { id: 'gangster-revolution', label: 'Gangster Revolution' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  const customNavItems: NavItem[] = activeCustomTabs.map((ct) => ({
    id: `custom-${ct.id}`,
    label: ct.label,
  }));

  const desktopLinks = [...primaryNavItems, ...customNavItems];
  const allMobileItems = [
    ...desktopLinks,
    { id: 'apex-editor-demo', label: 'Apex Editor Demo' },
    { id: 'notifications', label: 'Notifications' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#09090b]/90 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Clean Single-Line Brand Wordmark */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="flex items-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5500] rounded-lg cursor-pointer"
          >
            <ApexLogo size="sm" />
          </button>

          {/* Zone 2: Clean Single-Line Text Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6">
            {desktopLinks.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`relative py-1.5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-[#FF5500] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Mobile Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleNavClick('notifications')}
              className={`hidden xl:inline-flex items-center justify-center w-9 h-9 rounded-lg border transition-colors cursor-pointer ${
                activeTab === 'notifications'
                  ? 'bg-[#FF5500]/15 border-[#FF5500]/50 text-[#FF5500]'
                  : 'bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/20'
              }`}
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('apex-editor-demo')}
              className={`hidden sm:inline-flex items-center px-4 py-2 rounded-lg text-xs font-semibold tracking-wide whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeTab === 'apex-editor-demo'
                  ? 'bg-white text-black'
                  : 'bg-[#FF5500] hover:bg-[#FF6E26] text-black'
              }`}
            >
              Editor Demo
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg bg-white/[0.04] text-zinc-300 hover:text-white border border-white/[0.08] cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0e0e11] border-b border-white/[0.08] px-4 py-3 space-y-1 animate-fadeIn max-h-[80vh] overflow-y-auto">
          {allMobileItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#FF5500] text-black font-semibold'
                    : 'text-zinc-300 hover:bg-white/[0.05] hover:text-white'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
