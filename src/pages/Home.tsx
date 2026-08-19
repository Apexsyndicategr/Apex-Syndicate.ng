import React from 'react';
import { Product, LaunchPricingInfo } from '../types';
import { CountdownTimer } from '../components/CountdownTimer';
import { PortfolioVideoShowcase } from '../components/PortfolioVideoShowcase';
import { motion } from 'motion/react';
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
  Zap,
  Layers,
  Code2,
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* ==========================================
          HERO SECTION (HEAVILY ANIMATED)
         ========================================== */}
      <section className="relative pt-10 md:pt-16 pb-12 overflow-hidden">
        {/* Animated Cyber Holographic Ring Backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-radial from-[#FF6321]/15 via-transparent to-transparent rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8"
        >
          {/* Eyebrow Badge */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-gradient-to-r from-[#FF6321]/20 via-amber-500/15 to-[#FF6321]/20 border border-[#FF6321]/40 text-[#FF6321] text-xs font-mono font-black uppercase tracking-widest shadow-[0_0_25px_rgba(255,99,33,0.35)] animate-border-glow">
              <Sparkles className="w-4 h-4 animate-spin text-amber-400" style={{ animationDuration: '6s' }} />
              <span className="bg-gradient-to-r from-white via-[#FF6321] to-amber-300 bg-clip-text text-transparent animate-shimmer-text">
                OFFICIAL COMMERCIAL SOFTWARE SUITE
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6321] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6321]"></span>
              </span>
            </div>
          </motion.div>

          {/* Main Hero Headline with Kinetic Glow & Text Shimmer */}
          <motion.div variants={itemVariants} className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight uppercase leading-none drop-shadow-2xl">
              <span className="inline-block hover:scale-105 transition-transform duration-300 cursor-default">APEX</span>{' '}
              <span className="bg-gradient-to-r from-[#FF6321] via-amber-400 to-[#FF4500] bg-clip-text text-transparent animate-shimmer-text drop-shadow-[0_0_35px_rgba(255,99,33,0.6)] inline-block hover:scale-105 transition-transform duration-300">
                SYNDICATE
              </span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl font-light text-gray-200 font-sans tracking-wide max-w-3xl mx-auto leading-relaxed italic animate-cyber-glow">
              "Software built to create, edit and innovate."
            </p>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="max-w-2xl mx-auto text-sm md:text-base text-gray-300 leading-relaxed font-sans"
          >
            Engineered for modern developers, creators, and power users. Explore our commercial software ecosystem or get instant launch access to our flagship editor.
          </motion.p>

          {/* Hero Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setActiveTab('products');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-gradient-to-r from-[#FF6321] to-amber-500 hover:from-[#FF8A50] hover:to-amber-400 text-black font-black text-xs tracking-widest uppercase shadow-[0_0_30px_rgba(255,99,33,0.5)] transition-all duration-300 flex items-center justify-center gap-2.5 btn-shimmer-sweep"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>EXPLORE PRODUCTS</span>
              <ArrowRight className="w-4 h-4 animate-bounce" style={{ animationDuration: '1.5s' }} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setActiveTab('apex-editor');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-black/60 hover:bg-white/10 text-white font-bold text-xs tracking-widest uppercase border border-[#FF6321]/40 hover:border-[#FF6321] transition-all duration-300 backdrop-blur-xl shadow-[0_0_20px_rgba(0,0,0,0.8)] flex items-center justify-center gap-2.5"
            >
              <Terminal className="w-4 h-4 text-[#FF6321] animate-pulse" />
              <span>GET APEX EDITOR</span>
              <span className="px-1.5 py-0.5 rounded bg-[#FF6321]/20 text-[#FF6321] text-[10px] font-mono border border-[#FF6321]/40">
                {launchPricing ? launchPricing.priceDisplay : 'FREE'}
              </span>
            </motion.button>
          </motion.div>

          {/* Live Trust Stats Bar (Animated Staggered Cards) */}
          <motion.div
            variants={itemVariants}
            className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {[
              { val: '100%', label: 'Native Performance', color: 'text-white', icon: Cpu },
              { val: '60 FPS', label: 'GPU Canvas Engine', color: 'text-[#FF6321]', icon: Zap },
              { val: '256-bit', label: 'AES Shield Security', color: 'text-white', icon: ShieldCheck },
              {
                val: launchPricing ? launchPricing.priceDisplay : 'FREE',
                label: 'Current Launch Access',
                color: 'text-[#FF6321]',
                icon: Flame,
              },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6, scale: 1.04 }}
                className="group relative p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl border border-white/10 hover:border-[#FF6321]/50 shadow-lg hover:shadow-[0_0_25px_rgba(255,99,33,0.25)] transition-all duration-300 flex flex-col items-center justify-center text-center overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#FF6321]/10 rounded-full blur-xl group-hover:scale-150 transition-transform pointer-events-none" />
                <stat.icon className="w-4 h-4 text-[#FF6321] mb-1 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                <div className={`text-2xl md:text-3xl font-black ${stat.color} font-mono tracking-wide`}>
                  {stat.val}
                </div>
                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mt-1 group-hover:text-gray-200 transition-colors">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ==========================================
          PORTFOLIO CINEMATIC SHOWCASE TRAILER
         ========================================== */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <PortfolioVideoShowcase />
      </motion.section>

      {/* ==========================================
          FLAGSHIP FEATURED PRODUCT: APEX EDITOR
         ========================================== */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="relative rounded-[28px] md:rounded-[36px] bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-black/60 backdrop-blur-2xl border border-white/15 p-8 md:p-12 shadow-2xl overflow-hidden hover:border-[#FF6321]/40 transition-colors duration-500">
          {/* Laser scanning beam */}
          <div className="absolute top-0 left-0 w-40 h-[2px] bg-gradient-to-r from-transparent via-[#FF6321] to-transparent animate-laser pointer-events-none" />

          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF6321]/15 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF6321]/10 border border-[#FF6321]/40 text-[#FF6321] text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,99,33,0.25)]">
                <Flame className="w-4 h-4 fill-[#FF6321] animate-bounce" style={{ animationDuration: '2s' }} />
                <span>FLAGSHIP FEATURED PRODUCT</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-tight">
                APEX <span className="bg-gradient-to-r from-[#FF6321] to-amber-400 bg-clip-text text-transparent animate-shimmer-text">EDITOR</span>
              </h2>

              <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-light">
                {apexEditor ? apexEditor.description : 'Powerful editing. Built by Apex Syndicate.'}
              </p>

              {/* Key Highlights Grid with Hover Animations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-300 pt-2">
                {[
                  { text: 'GPU-Accelerated 60FPS Canvas', icon: Zap },
                  { text: 'Rust Zero-Latency Engine', icon: Cpu },
                  { text: 'Multi-Cursor Split Workspace', icon: Layers },
                  { text: 'Integrated Extensions Market', icon: Code2 },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ x: 4, scale: 1.02 }}
                    className="flex items-center gap-2.5 p-3.5 rounded-xl bg-black/50 border border-white/10 hover:border-[#FF6321]/40 backdrop-blur-md transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#FF6321] shrink-0 animate-pulse" />
                    <span className="font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                {apexEditor && (apexEditor.isComingSoon || !apexEditor.fileUrl) ? (
                  <div className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/[0.05] border border-amber-500/40 backdrop-blur-xl text-amber-300 font-extrabold text-xs tracking-widest uppercase shadow-[0_0_20px_rgba(245,158,11,0.2)] flex items-center justify-center gap-2.5">
                    <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                    <span>COMING SOON</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/40">
                      IN PROGRESS
                    </span>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => apexEditor && openDownloadModal(apexEditor)}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-black hover:bg-[#FF6321] hover:text-white font-black text-xs tracking-widest uppercase transition-all duration-300 shadow-2xl flex items-center justify-center gap-2.5 btn-shimmer-sweep"
                  >
                    <Download className="w-4 h-4 animate-bounce" style={{ animationDuration: '2s' }} />
                    <span>DOWNLOAD APEX EDITOR ({launchPricing ? launchPricing.priceDisplay : 'FREE'})</span>
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.04, x: 2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setActiveTab('apex-editor');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white font-bold text-xs tracking-wider uppercase border border-white/15 hover:border-white/30 transition-all backdrop-blur-sm flex items-center justify-center gap-2"
                >
                  <span>VIEW FULL SPECS</span>
                  <ChevronRight className="w-4 h-4 text-[#FF6321]" />
                </motion.button>
              </div>
            </div>

            {/* Right Launch Pricing Timer Component */}
            <div className="lg:col-span-5">
              <CountdownTimer pricing={launchPricing} />
            </div>
          </div>
        </div>
      </motion.section>

      {/* ==========================================
          MARKETPLACE PRODUCTS PREVIEW
         ========================================== */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="text-xs font-mono font-bold text-[#FF6321] uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF6321] animate-ping inline-block" />
              COMMERCIAL CATALOGUE
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mt-1">
              APEX SYNDICATE PRODUCTS
            </h2>
          </div>

          <motion.button
            whileHover={{ x: 4 }}
            onClick={() => {
              setActiveTab('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-bold text-[#FF6321] hover:text-[#FF8A50] flex items-center gap-1.5 transition-colors uppercase tracking-wider group"
          >
            <span>VIEW ALL PRODUCTS</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        {/* Product Cards Grid with Staggered Entrance and 3D Hover Lift */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.slice(0, 3).map((prod, idx) => (
            <motion.div
              key={prod.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group relative rounded-[28px] bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl border border-white/10 hover:border-[#FF6321]/50 p-6 transition-all duration-300 shadow-xl hover:shadow-[0_15px_35px_rgba(255,99,33,0.25)] flex flex-col justify-between overflow-hidden"
            >
              {/* Corner Glow */}
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#FF6321]/15 rounded-full blur-2xl group-hover:scale-150 transition-transform pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] text-[10px] font-bold uppercase tracking-wider">
                      {prod.category}
                    </span>
                    {(prod.isComingSoon || prod.releaseDate === 'Coming Soon') && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FF6321] text-black text-[9px] font-black uppercase tracking-wider animate-pulse shadow-[0_0_10px_rgba(255,99,33,0.5)]">
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
                  {prod.features.slice(0, 3).map((feat, fidx) => (
                    <span
                      key={fidx}
                      className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/5 text-gray-300 text-[10px] font-medium group-hover:border-[#FF6321]/20 transition-colors"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between relative z-10">
                <div>
                  <div className="text-[10px] text-gray-500 uppercase font-mono">PRICE</div>
                  <div className="text-base font-black text-white group-hover:text-[#FF6321] transition-colors">
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
                    <motion.a
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      href={prod.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-[10px] tracking-wider uppercase transition-all flex items-center gap-1 shadow-md"
                      title="Open Web App"
                    >
                      <Globe className="w-3.5 h-3.5" /> LAUNCH
                    </motion.a>
                  )}

                  {prod.isComingSoon || !prod.fileUrl ? (
                    <span className="px-3.5 py-2 rounded-xl bg-white/[0.04] border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 cursor-not-allowed">
                      <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" /> COMING SOON
                    </span>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openDownloadModal(prod)}
                      className="px-4 py-2.5 rounded-xl bg-[#FF6321]/20 hover:bg-[#FF6321] text-[#FF6321] hover:text-black border border-[#FF6321]/40 text-xs font-bold tracking-wider transition-all duration-300 flex items-center gap-1.5 shadow-md"
                    >
                      <Download className="w-3.5 h-3.5" /> DOWNLOAD
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ==========================================
          ENGINEERING ETHOS & GUARANTEE (ANIMATED)
         ========================================== */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="p-8 md:p-12 rounded-[28px] md:rounded-[36px] bg-white/[0.03] backdrop-blur-2xl border border-white/10 space-y-8 shadow-2xl relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-black text-white uppercase tracking-wider bg-gradient-to-r from-white via-[#FF6321] to-white bg-clip-text text-transparent animate-shimmer-text">
              BUILT FOR PERFORMANCE & INTEGRITY
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Every software binary distributed by Apex Syndicate undergoes rigorous code auditing, SHA-256 checksum signing, and performance testing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {[
              {
                title: 'Zero-Bloat Architecture',
                desc: 'Native compiled binaries with minimal memory footprints, zero background telemetry strain, and instant startup times.',
                icon: Cpu,
              },
              {
                title: 'Protected Downloads',
                desc: 'Secure tokenized distribution channels ensure only verified customers receive authentic, tamper-proof packages.',
                icon: ShieldCheck,
              },
              {
                title: 'Commercial Support',
                desc: 'Direct owner support and continuous feature updates for all registered software license holders.',
                icon: Globe,
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6, scale: 1.03 }}
                className="group p-6 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/5 hover:border-[#FF6321]/40 backdrop-blur-md space-y-3 transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(255,99,33,0.2)]"
              >
                <div className="p-3 rounded-xl bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] w-fit group-hover:scale-110 group-hover:bg-[#FF6321]/20 transition-all">
                  <item.icon className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-[#FF6321] transition-colors">{item.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};
