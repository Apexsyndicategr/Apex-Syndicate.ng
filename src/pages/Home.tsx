import React from 'react';
import { Product, LaunchPricingInfo } from '../types';
import { CountdownTimer } from '../components/CountdownTimer';
import { PortfolioVideoShowcase } from '../components/PortfolioVideoShowcase';
import {
  Terminal,
  Cpu,
  ShieldCheck,
  Download,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Globe,
  Flame,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface HomeProps {
  setActiveTab: (tab: string) => void;
  openDownloadModal: (product: Product) => void;
  launchPricing: LaunchPricingInfo | null;
  products: Product[];
}

export const Home: React.FC<HomeProps> = ({
  setActiveTab,
  openDownloadModal,
  launchPricing,
  products,
}) => {
  const apexEditor = products.find((p) => p.id === 'apex-editor') || products[0];

  return (
    <div className="space-y-24 pb-20">
      {/* ==========================================
          HERO SECTION
         ========================================== */}
      <section className="relative pt-12 md:pt-20 pb-16 overflow-hidden">
        {/* Ambient Glowing Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF6321] opacity-[0.08] blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] text-xs font-mono font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(255,99,33,0.2)] animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OFFICIAL COMMERCIAL SOFTWARE SUITE</span>
          </div>

          {/* Main Hero Headline */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight uppercase leading-none drop-shadow-2xl">
              APEX <span className="text-[#FF6321]">SYNDICATE</span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl font-light text-gray-200 font-sans tracking-wide max-w-3xl mx-auto leading-relaxed italic">
              "Software built to create, edit and innovate."
            </p>
          </div>

          <p className="max-w-2xl mx-auto text-sm md:text-base text-gray-400 leading-relaxed font-sans">
            Engineered for modern developers, creators, and power users. Explore our commercial software ecosystem or get instant launch access to our flagship editor.
          </p>

          {/* Hero Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => {
                setActiveTab('products');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#FF6321] hover:bg-[#FF8A50] text-black font-extrabold text-xs tracking-widest uppercase shadow-[0_10px_30px_rgba(255,99,33,0.35)] transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              EXPLORE PRODUCTS <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setActiveTab('apex-editor');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs tracking-widest uppercase border border-white/10 transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-2"
            >
              <Terminal className="w-4 h-4 text-[#FF6321]" /> GET APEX EDITOR
            </button>
          </div>

          {/* Live Trust Stats Bar */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-lg">
              <div className="text-2xl md:text-3xl font-black text-white font-mono">100%</div>
              <div className="text-[11px] text-gray-400 uppercase font-bold tracking-wider mt-1">
                Native Performance
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-lg">
              <div className="text-2xl md:text-3xl font-black text-[#FF6321] font-mono">60 FPS</div>
              <div className="text-[11px] text-gray-400 uppercase font-bold tracking-wider mt-1">
                GPU Canvas Rendering
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-lg">
              <div className="text-2xl md:text-3xl font-black text-white font-mono">256-bit</div>
              <div className="text-[11px] text-gray-400 uppercase font-bold tracking-wider mt-1">
                AES Shield Security
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-lg">
              <div className="text-2xl md:text-3xl font-black text-[#FF6321] font-mono">
                {launchPricing ? launchPricing.priceDisplay : 'FREE'}
              </div>
              <div className="text-[11px] text-gray-400 uppercase font-bold tracking-wider mt-1">
                Current Launch Access
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          PORTFOLIO CINEMATIC SHOWCASE TRAILER (35S)
         ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PortfolioVideoShowcase />
      </section>

      {/* ==========================================
          FLAGSHIP FEATURED PRODUCT: APEX EDITOR
         ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[28px] md:rounded-[32px] bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 md:p-12 shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] text-xs font-bold uppercase tracking-wider">
                <Flame className="w-4 h-4 fill-[#FF6321]" /> FLAGSHIP FEATURED PRODUCT
              </div>

              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                APEX <span className="text-[#FF6321]">EDITOR</span>
              </h2>

              <p className="text-lg text-gray-300 leading-relaxed font-light">
                {apexEditor ? apexEditor.description : 'Powerful editing. Built by Apex Syndicate.'}
              </p>

              {/* Key Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-300 pt-2">
                <div className="flex items-center gap-2 p-3.5 rounded-xl bg-black/40 border border-white/5 backdrop-blur-md">
                  <CheckCircle2 className="w-4 h-4 text-[#FF6321] shrink-0" />
                  <span>GPU-Accelerated 60FPS Canvas</span>
                </div>
                <div className="flex items-center gap-2 p-3.5 rounded-xl bg-black/40 border border-white/5 backdrop-blur-md">
                  <CheckCircle2 className="w-4 h-4 text-[#FF6321] shrink-0" />
                  <span>Rust Zero-Latency Engine</span>
                </div>
                <div className="flex items-center gap-2 p-3.5 rounded-xl bg-black/40 border border-white/5 backdrop-blur-md">
                  <CheckCircle2 className="w-4 h-4 text-[#FF6321] shrink-0" />
                  <span>Multi-Cursor Split Workspace</span>
                </div>
                <div className="flex items-center gap-2 p-3.5 rounded-xl bg-black/40 border border-white/5 backdrop-blur-md">
                  <CheckCircle2 className="w-4 h-4 text-[#FF6321] shrink-0" />
                  <span>Integrated Extensions Market</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                {apexEditor && (apexEditor.isComingSoon || !apexEditor.fileUrl) ? (
                  <div className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/[0.05] border border-amber-500/40 backdrop-blur-xl text-amber-300 font-extrabold text-xs tracking-widest uppercase shadow-[0_0_20px_rgba(245,158,11,0.15)] flex items-center justify-center gap-2.5">
                    <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                    <span>COMING SOON</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/40">
                      IN PROGRESS
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => apexEditor && openDownloadModal(apexEditor)}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-black hover:bg-[#FF6321] hover:text-white font-black text-xs tracking-widest uppercase transition-all duration-300 shadow-xl flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" /> DOWNLOAD APEX EDITOR ({launchPricing ? launchPricing.priceDisplay : 'FREE'})
                  </button>
                )}

                <button
                  onClick={() => {
                    setActiveTab('apex-editor');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-bold text-xs tracking-wider uppercase border border-white/10 transition-colors backdrop-blur-sm flex items-center justify-center gap-2"
                >
                  VIEW FULL SPECS <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Launch Pricing Timer Component */}
            <div className="lg:col-span-5">
              <CountdownTimer pricing={launchPricing} />
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          MARKETPLACE PRODUCTS PREVIEW
         ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="text-xs font-mono font-bold text-[#FF6321] uppercase tracking-widest">
              COMMERCIAL CATALOGUE
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mt-1">
              APEX SYNDICATE PRODUCTS
            </h2>
          </div>

          <button
            onClick={() => {
              setActiveTab('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-bold text-[#FF6321] hover:text-[#FF8A50] flex items-center gap-1 transition-colors uppercase tracking-wider"
          >
            VIEW ALL PRODUCTS <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.slice(0, 3).map((prod) => (
            <div
              key={prod.id}
              className="group relative rounded-[28px] bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-[#FF6321]/50 p-6 transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-[0_10px_30px_rgba(255,99,33,0.2)] flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] text-[10px] font-bold uppercase tracking-wider">
                      {prod.category}
                    </span>
                    {(prod.isComingSoon || prod.releaseDate === 'Coming Soon') && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FF6321] text-black text-[9px] font-black uppercase tracking-wider animate-pulse">
                        COMING SOON
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-gray-500">{prod.version}</span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-[#FF6321] transition-colors">
                  {prod.name}
                </h3>

                <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                  {prod.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {prod.features.slice(0, 3).map((feat, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/5 text-gray-300 text-[10px] font-medium"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-gray-500 uppercase font-mono">PRICE</div>
                  <div className="text-base font-black text-white">
                    {prod.pricingType === 'tbd' || (prod.pricingType === 'fixed' && !prod.fixedPrice)
                      ? 'TBD'
                      : prod.id === 'apex-editor' && launchPricing && prod.pricingType === 'launch'
                      ? launchPricing.priceDisplay
                      : prod.pricingType === 'free'
                      ? 'FREE'
                      : `₦${(prod.fixedPrice || 0).toLocaleString()}`}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {prod.externalUrl && (
                    <a
                      href={prod.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-[10px] tracking-wider uppercase transition-all flex items-center gap-1 shadow-md"
                      title="Open Web App"
                    >
                      <Globe className="w-3.5 h-3.5" /> LAUNCH
                    </a>
                  )}

                  {prod.isComingSoon || !prod.fileUrl ? (
                    <span className="px-3.5 py-2 rounded-xl bg-white/[0.04] border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 cursor-not-allowed">
                      <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" /> COMING SOON
                    </span>
                  ) : (
                    <button
                      onClick={() => openDownloadModal(prod)}
                      className="px-4 py-2.5 rounded-xl bg-[#FF6321]/20 hover:bg-[#FF6321] text-[#FF6321] hover:text-black border border-[#FF6321]/40 text-xs font-bold tracking-wider transition-all duration-300 flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> DOWNLOAD
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================
          ENGINEERING ETHOS & GUARANTEE
         ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 md:p-12 rounded-[28px] md:rounded-[32px] bg-white/[0.03] backdrop-blur-2xl border border-white/10 space-y-8 shadow-2xl">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-black text-white uppercase tracking-wider">
              BUILT FOR PERFORMANCE & INTEGRITY
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Every software binary distributed by Apex Syndicate undergoes rigorous code auditing, SHA-256 checksum signing, and performance testing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md space-y-3">
              <div className="p-3 rounded-xl bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] w-fit">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Zero-Bloat Architecture</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Native compiled binaries with minimal memory footprints, zero background telemetry strain, and instant startup times.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md space-y-3">
              <div className="p-3 rounded-xl bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] w-fit">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Protected Downloads</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Secure tokenized distribution channels ensure only verified customers receive authentic, tamper-proof packages.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md space-y-3">
              <div className="p-3 rounded-xl bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] w-fit">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Commercial Support</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Direct owner support and continuous feature updates for all registered software license holders.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
