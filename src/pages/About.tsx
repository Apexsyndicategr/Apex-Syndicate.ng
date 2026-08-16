import React from 'react';
import { PortfolioVideoShowcase } from '../components/PortfolioVideoShowcase';
import {
  ShieldCheck,
  Building2,
  Globe,
  Terminal,
  Cpu,
  Zap,
  Award,
  Sparkles,
  ExternalLink,
  Youtube,
  Instagram,
} from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* Header Banner */}
      <section className="relative pt-12 pb-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] text-xs font-mono font-bold uppercase tracking-widest">
            COMPANY PROFILE & SYNDICATE ETHOS
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight">
            ABOUT <span className="text-[#FF6321]">APEX SYNDICATE</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl font-light leading-relaxed">
            A specialized software engineering venture dedicated to delivering high-performance, commercial digital solutions and developer tools.
          </p>
        </div>
      </section>

      {/* Main Narrative Glass Panel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[28px] md:rounded-[32px] bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 md:p-12 shadow-2xl space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-white uppercase tracking-wider">
                OUR ENGINEERING MISSION
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Founded with a uncompromising vision for raw speed, clean architectural craft, and privacy-respecting software, Apex Syndicate builds software tools that empower modern software engineers and digital innovators.
              </p>
              <p className="text-sm text-gray-300 leading-relaxed">
                Operating under the official commercial domain <code className="text-[#FF6321] font-bold">apexsyndicate.com.ng</code>, we maintain high standards across software design, binary security, and customer support.
              </p>

              <div className="pt-2 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                  <div className="text-xl font-black text-[#FF6321]">OFFICIAL</div>
                  <div className="text-xs text-gray-400">Software Syndicate</div>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                  <div className="text-xl font-black text-white">DIRECT</div>
                  <div className="text-xs text-gray-400">Owner Managed Access</div>
                </div>
              </div>
            </div>

            {/* Corporate Specifications Box */}
            <div className="p-8 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md space-y-6">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
                <Building2 className="w-5 h-5 text-[#FF6321]" /> SYNDICATE DIRECTORY
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500">Legal Brand Name:</span>
                  <span className="font-bold text-white">Apex Syndicate</span>
                </div>

                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500">Founder & Architect:</span>
                  <span className="font-bold text-[#FF6321] uppercase">Okere Chiemeka</span>
                </div>

                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500">Official Portal:</span>
                  <span className="font-mono text-[#FF6321] font-bold">apexsyndicate.com.ng</span>
                </div>

                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500">Flagship Product:</span>
                  <span className="font-bold text-white">Apex Editor (v1.0.0)</span>
                </div>

                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500">License Verification:</span>
                  <span className="font-bold text-emerald-400">Cryptographic Checksum</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Support Email:</span>
                  <span className="font-mono text-gray-300">support@apexsyndicate.com.ng</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 35-SECOND PORTFOLIO CINEMATIC SHOWCASE TRAILER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PortfolioVideoShowcase />
      </section>

      {/* Official Social Media Handles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[28px] md:rounded-[32px] bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 md:p-10 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#FF6321] uppercase tracking-widest mb-1">
                <Sparkles className="w-3.5 h-3.5" /> OFFICIAL SOCIAL CHANNELS
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider">
                CONNECT WITH <span className="text-[#FF6321]">APEX SYNDICATE</span>
              </h2>
            </div>
            <p className="text-xs text-gray-400 max-w-md leading-relaxed">
              Stay connected with our official social media handles for software announcements, product demos, and community updates.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. TikTok */}
            <a
              href="https://www.tiktok.com/@apex.syndicateng"
              target="_blank"
              rel="noreferrer"
              className="group relative p-6 rounded-2xl bg-black/50 border border-white/10 hover:border-[#FE2C55]/60 hover:bg-[#FE2C55]/5 transition-all duration-300 shadow-lg flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-black border border-[#FE2C55]/40 text-[#FE2C55] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64c.29 0 .56.04.82.11V9.33a6.33 6.33 0 00-1-.08 6.34 6.34 0 106.34 6.34V8.33a8.28 8.28 0 004.95 1.81V6.69z" />
                  </svg>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
              </div>

              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold">
                  TIKTOK
                </div>
                <div className="text-base font-extrabold text-white group-hover:text-[#FE2C55] transition-colors font-mono mt-0.5">
                  apex.syndicateng
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-bold text-gray-400 group-hover:text-white">
                <span>Follow on TikTok</span>
                <span className="text-[#FE2C55]">→</span>
              </div>
            </a>

            {/* 2. Snapchat */}
            <a
              href="https://www.snapchat.com/add/apexsyndicategr"
              target="_blank"
              rel="noreferrer"
              className="group relative p-6 rounded-2xl bg-black/50 border border-white/10 hover:border-[#FFFC00]/60 hover:bg-[#FFFC00]/5 transition-all duration-300 shadow-lg flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-black border border-[#FFFC00]/40 text-[#FFFC00] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.04 2c-3.42 0-5.68 2.35-5.68 5.21 0 1.22.42 2.38 1.1 3.25-.15.42-.58 1.56-1.68 1.8-.25.05-.39.24-.37.47.03.26.25.45.56.45 1.28 0 2.12-.48 2.53-.9.78.42 1.7.65 2.66.65.96 0 1.88-.23 2.66-.65.41.42 1.25.9 2.53.9.31 0 .53-.19.56-.45.02-.23-.12-.42-.37-.47-1.1-.24-1.53-1.38-1.68-1.8.68-.87 1.1-2.03 1.1-3.25 0-2.86-2.26-5.21-5.68-5.21z" />
                  </svg>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
              </div>

              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold">
                  SNAPCHAT
                </div>
                <div className="text-base font-extrabold text-white group-hover:text-[#FFFC00] transition-colors font-mono mt-0.5">
                  apexsyndicategr
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-bold text-gray-400 group-hover:text-white">
                <span>Add on Snapchat</span>
                <span className="text-[#FFFC00]">→</span>
              </div>
            </a>

            {/* 3. YouTube */}
            <a
              href="https://www.youtube.com/@ApexSyndicategr"
              target="_blank"
              rel="noreferrer"
              className="group relative p-6 rounded-2xl bg-black/50 border border-white/10 hover:border-red-500/60 hover:bg-red-500/5 transition-all duration-300 shadow-lg flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-black border border-red-500/40 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Youtube className="w-5 h-5" />
                </div>
                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
              </div>

              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold">
                  YOUTUBE
                </div>
                <div className="text-base font-extrabold text-white group-hover:text-red-400 transition-colors mt-0.5">
                  Apex Syndicate
                </div>
                <div className="text-xs font-mono text-gray-400 font-semibold mt-0.5">
                  @ApexSyndicategr
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-bold text-gray-400 group-hover:text-white">
                <span>Subscribe on YouTube</span>
                <span className="text-red-500">→</span>
              </div>
            </a>

            {/* 4. Instagram */}
            <a
              href="https://www.instagram.com/apexsyndicateng"
              target="_blank"
              rel="noreferrer"
              className="group relative p-6 rounded-2xl bg-black/50 border border-white/10 hover:border-pink-500/60 hover:bg-pink-500/5 transition-all duration-300 shadow-lg flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-black border border-pink-500/40 text-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Instagram className="w-5 h-5" />
                </div>
                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
              </div>

              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold">
                  INSTAGRAM
                </div>
                <div className="text-base font-extrabold text-white group-hover:text-pink-400 transition-colors font-mono mt-0.5">
                  apexsyndicateng
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-bold text-gray-400 group-hover:text-white">
                <span>Follow on Instagram</span>
                <span className="text-pink-500">→</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Core Values Triad */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-[28px] bg-white/[0.03] backdrop-blur-xl border border-white/10 space-y-3">
            <div className="p-3 rounded-xl bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] w-fit">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Uncompromising Speed</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              We reject bloatware and unnecessary sub-systems. Every line of code is optimized for minimal CPU cycles and maximum memory efficiency.
            </p>
          </div>

          <div className="p-6 rounded-[28px] bg-white/[0.03] backdrop-blur-xl border border-white/10 space-y-3">
            <div className="p-3 rounded-xl bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Authentic Security</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              All software binaries are built directly from pristine repositories and distributed with encrypted license tokens.
            </p>
          </div>

          <div className="p-6 rounded-[28px] bg-white/[0.03] backdrop-blur-xl border border-white/10 space-y-3">
            <div className="p-3 rounded-xl bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] w-fit">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Customer-First Access</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Transparent Nigerian bank transfer payment verification handled directly by the Apex Syndicate owner.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

