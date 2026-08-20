import React from 'react';
import { ApexLogo } from './ApexLogo';
import { motion } from 'motion/react';
import { Shield, Globe, Lock, Sparkles } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  openAdminModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, openAdminModal }) => {
  return (
    <footer className="relative bg-[#050505] border-t border-white/10 text-gray-400 pt-16 pb-12 overflow-hidden">
      {/* Background glow orb & laser sweep */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF6321] to-transparent animate-laser" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#FF6321]/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/5">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <ApexLogo size="md" />
            <p className="text-sm text-gray-300 font-medium leading-relaxed italic animate-cyber-glow">
              "Software built to create, edit and innovate."
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Commercial software suite and marketplace engineered for high-performance creative and technical workflows.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] text-xs font-mono shadow-[0_0_12px_rgba(255,99,33,0.25)]">
              <Globe className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
              <span>apexsyndicate.com.ng</span>
            </div>
          </div>

          {/* Quick Products Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FF6321] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6321] animate-ping" />
              Software Products
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('apex-editor');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#FF6321] hover:translate-x-1 transition-all flex items-center gap-1.5 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6321] group-hover:scale-125 transition-transform"></span>
                  <span>Apex Editor</span>
                  <span className="text-[10px] text-[#FF6321] font-mono">(Coming Soon)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('gangster-revolution');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#FF6321] hover:translate-x-1 transition-all flex items-center gap-1.5 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 group-hover:scale-125 transition-transform"></span>
                  <span>Gangster Revolution</span>
                  <span className="text-[10px] text-red-400 font-mono">(TBD)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('products');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#FF6321] hover:translate-x-1 transition-all flex items-center gap-1.5 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-125 transition-transform"></span>
                  <span>Commercial Catalogue</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FF6321] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6321] animate-ping" />
              Navigation & Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#FF6321] hover:translate-x-1 transition-all"
                >
                  About Apex Syndicate
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#FF6321] hover:translate-x-1 transition-all"
                >
                  Contact & Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('notifications');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#FF6321] hover:translate-x-1 transition-all"
                >
                  My Notifications & Requests
                </button>
              </li>
            </ul>
          </div>

          {/* Security & Verification */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FF6321] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#FF6321]" />
              Distribution & Security
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Official commercial software packages are code-signed and distributed securely through tokenized sessions verified by Apex Syndicate.
            </p>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-3.5 rounded-xl bg-black/50 border border-white/10 text-[11px] text-gray-300 flex items-start gap-2 backdrop-blur-md shadow-inner hover:border-[#FF6321]/40 transition-colors"
            >
              <Shield className="w-4 h-4 text-[#FF6321] shrink-0 mt-0.5 animate-pulse" />
              <span>Verified SHA-256 Checksums & Malware-Free Software Guarantee</span>
            </motion.div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            © 2026 <span className="text-gray-300 font-semibold">Apex Syndicate</span>. All rights reserved.
          </div>

          <div className="flex items-center space-x-6">
            <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-gray-400 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="text-[#FF6321] font-mono font-bold">apexsyndicate.com.ng</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
