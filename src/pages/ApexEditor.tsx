import React from 'react';
import { Product, LaunchPricingInfo } from '../types';
import { CountdownTimer } from '../components/CountdownTimer';
import { motion } from 'motion/react';
import {
  Terminal,
  Cpu,
  Layers,
  Zap,
  ShieldCheck,
  Download,
  Sparkles,
  Flame,
  CheckCircle2,
  Code2,
  Maximize2,
  RotateCw,
  Clock,
  ExternalLink,
} from 'lucide-react';

interface ApexEditorProps {
  product: Product | null;
  launchPricing: LaunchPricingInfo | null;
  openDownloadModal: (product: Product) => void;
  onRefreshPricing?: () => void;
}

export const ApexEditor: React.FC<ApexEditorProps> = ({
  product,
  launchPricing,
  openDownloadModal,
  onRefreshPricing,
}) => {
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-pulse text-[#FF6321] font-mono font-bold text-lg">
          Loading Apex Editor Flagship Specifications...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* Flagship Header Banner */}
      <section className="relative pt-12 pb-10 border-b border-white/10 overflow-hidden">
        {/* Glowing Orbs */}
        <div className="absolute top-10 left-1/3 w-[600px] h-[600px] bg-[#FF6321]/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center gap-2"
          >
            {(product.isComingSoon || product.releaseDate === 'Coming Soon') && (
              <span className="px-3.5 py-1.5 rounded-full bg-[#FF6321] text-black text-xs font-mono font-black uppercase tracking-widest flex items-center gap-1.5 animate-pulse shadow-[0_0_15px_rgba(255,99,33,0.5)]">
                COMING SOON
              </span>
            )}
            <span className="px-3.5 py-1.5 rounded-full bg-[#FF6321]/15 border border-[#FF6321]/40 text-[#FF6321] text-xs font-mono font-black uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,99,33,0.25)]">
              <Flame className="w-4 h-4 fill-[#FF6321] animate-bounce" style={{ animationDuration: '2s' }} />
              FLAGSHIP COMMERCIAL PRODUCT
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-gray-300 text-xs font-mono font-bold uppercase">
              VERSION {product.version}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white uppercase tracking-tight leading-none">
              APEX <span className="bg-gradient-to-r from-[#FF6321] via-amber-400 to-[#FF4500] bg-clip-text text-transparent animate-shimmer-text">EDITOR</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 font-light max-w-3xl leading-relaxed">
              High-performance, zero-latency desktop code and text editor engineered for supreme productivity, instant file opening, and custom plugin extensions.
            </p>
          </motion.div>

          {/* Quick Action CTA Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4"
          >
            {product.isComingSoon || !product.fileUrl ? (
              <div className="px-8 py-4 rounded-2xl bg-white/[0.05] border border-amber-500/40 backdrop-blur-xl text-amber-300 font-extrabold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.2)] flex items-center justify-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                <span>COMING SOON • IN DEVELOPMENT</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/40">
                  {launchPricing ? launchPricing.priceDisplay : 'FREE LAUNCH'}
                </span>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openDownloadModal(product)}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF6321] to-amber-500 hover:from-[#FF8A50] hover:to-amber-400 text-black font-black text-xs uppercase tracking-widest shadow-[0_10px_30px_rgba(255,99,33,0.4)] transition-all flex items-center justify-center gap-2.5 btn-shimmer-sweep"
              >
                <Download className="w-4 h-4 animate-bounce" style={{ animationDuration: '2s' }} />
                <span>DOWNLOAD APEX EDITOR ({launchPricing ? launchPricing.priceDisplay : 'FREE'})</span>
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                const el = document.getElementById('specs-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider border border-white/15 transition-all backdrop-blur-sm flex items-center justify-center gap-2"
            >
              <Terminal className="w-4 h-4 text-[#FF6321] animate-pulse" />
              <span>TECHNICAL SPECIFICATIONS</span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Live Launch Pricing Countdown Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CountdownTimer pricing={launchPricing} onRefresh={onRefreshPricing} />
      </section>

      {/* Interactive Mockup Preview Glass Frame with Motion & Syntax Glow */}
      <motion.section
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="rounded-[28px] md:rounded-[36px] bg-gradient-to-br from-white/[0.05] to-black/80 backdrop-blur-2xl border border-white/15 p-6 md:p-8 shadow-2xl space-y-4 hover:border-[#FF6321]/40 transition-all duration-500 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-48 h-[2px] bg-[#FF6321] animate-laser pointer-events-none" />

          {/* Mock Window Controls Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/90 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
              <span className="w-3 h-3 rounded-full bg-amber-500/90 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/90 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <span className="text-xs font-mono text-gray-300 ml-2 font-bold">
                ApexEditor_v1.0.0 — main.rs
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400 font-mono">
              <span className="text-[#FF6321] font-bold animate-pulse">● GPU CANVAS 60FPS</span>
              <span>UTF-8</span>
              <span>Rust Core</span>
            </div>
          </div>

          {/* Code IDE Visual Preview Box */}
          <div className="bg-[#050608]/90 rounded-2xl p-6 font-mono text-xs sm:text-sm text-gray-300 border border-white/10 overflow-x-auto space-y-2 leading-relaxed shadow-inner">
            <div className="text-gray-500 italic">// Apex Syndicate Core Native Editor Engine</div>
            <div>
              <span className="text-purple-400 font-bold">fn</span>{' '}
              <span className="text-blue-400 font-black">init_apex_kernel</span>() -{'>'}{' '}
              <span className="text-emerald-400">Result</span>&lt;(), EngineError&gt; &#123;
            </div>
            <div className="pl-4">
              <span className="text-purple-400 font-bold">let</span> canvas = GPUCanvas::new(
              <span className="text-amber-300">"Apex_Syndicate_Viewport"</span>);
            </div>
            <div className="pl-4">
              <span className="text-purple-400 font-bold">let</span> editor = ApexEditor::builder()
            </div>
            <div className="pl-8 text-gray-400">
              .enable_zero_latency_input(<span className="text-[#FF6321] font-bold">true</span>)
            </div>
            <div className="pl-8 text-gray-400">
              .enable_256bit_encryption(<span className="text-[#FF6321] font-bold">true</span>)
            </div>
            <div className="pl-8 text-gray-400">
              .set_fps_target(<span className="text-amber-300 font-bold">60</span>)
            </div>
            <div className="pl-8 text-gray-400">.build()?;</div>
            <div className="pl-4 mt-1">
              editor.<span className="text-blue-300 font-bold">spawn_workspace</span>()?;
            </div>
            <div className="pl-4">
              <span className="text-emerald-400 font-bold">Ok</span>(())
            </div>
            <div>&#125;</div>
          </div>
        </div>
      </motion.section>

      {/* Deep Capabilities Grid */}
      <section id="specs-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold text-[#FF6321] uppercase tracking-widest flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF6321] animate-ping" />
            ENGINEERING SPECS
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
            WHY CHOOSE APEX EDITOR?
          </h2>
          <p className="text-xs text-gray-400">
            Engineered from scratch to eliminate electron bloat and provide instant response times.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Instant Cold Start',
              desc: 'Launches under 80 milliseconds with zero delay. Perfect for rapid file edits, massive log analysis, and daily dev workflows.',
              icon: Zap,
            },
            {
              title: 'Multi-Cursor Matrix',
              desc: 'Seamlessly manipulate thousands of edit cursors simultaneously across gigabyte-sized files without lagging.',
              icon: Layers,
            },
            {
              title: 'Offline Vault Mode',
              desc: 'Your source code stays 100% local on your hardware. No cloud telemetry, no forced sign-ins, pure privacy.',
              icon: ShieldCheck,
            },
          ].map((spec, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -8, scale: 1.03 }}
              className="group p-6 rounded-[28px] bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl border border-white/10 hover:border-[#FF6321]/50 space-y-4 shadow-xl hover:shadow-[0_10px_30px_rgba(255,99,33,0.2)] transition-all duration-300 overflow-hidden relative"
            >
              <div className="p-3 rounded-2xl bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] w-fit group-hover:scale-110 group-hover:bg-[#FF6321]/20 transition-all">
                <spec.icon className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-[#FF6321] transition-colors">{spec.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                {spec.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* System Requirements Panel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          whileHover={{ y: -4 }}
          className="p-8 rounded-[28px] md:rounded-[36px] bg-white/[0.03] backdrop-blur-2xl border border-white/10 hover:border-[#FF6321]/40 space-y-6 shadow-2xl transition-colors duration-300"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-xl font-bold text-white uppercase tracking-wider">
              SYSTEM REQUIREMENTS
            </h3>
            <span className="text-xs font-mono text-[#FF6321] font-bold">
              CROSS-PLATFORM SUPPORT
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <div className="text-gray-500 font-mono">OPERATING SYSTEM</div>
              <div className="font-bold text-white">Windows 10/11, macOS 12+, Linux Ubuntu</div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <div className="text-gray-500 font-mono">MEMORY (RAM)</div>
              <div className="font-bold text-white">512 MB Minimum (2 GB Recommended)</div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <div className="text-gray-500 font-mono">PROCESSOR</div>
              <div className="font-bold text-white">64-bit Dual-Core x86 / ARM64</div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <div className="text-gray-500 font-mono">STORAGE SPACE</div>
              <div className="font-bold text-white">120 MB Free Storage Space</div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
