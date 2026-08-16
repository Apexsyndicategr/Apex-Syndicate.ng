import React from 'react';
import { Product, LaunchPricingInfo } from '../types';
import { CountdownTimer } from '../components/CountdownTimer';
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
        <div className="animate-pulse text-[#FF6321] font-mono font-bold">
          Loading Apex Editor Flagship Specifications...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-20 pb-20">
      {/* Flagship Header Banner */}
      <section className="relative pt-12 pb-10 border-b border-white/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            {(product.isComingSoon || product.releaseDate === 'Coming Soon') && (
              <span className="px-3.5 py-1.5 rounded-full bg-[#FF6321] text-black text-xs font-mono font-black uppercase tracking-widest flex items-center gap-1.5 animate-pulse shadow-[0_0_15px_rgba(255,99,33,0.5)]">
                COMING SOON
              </span>
            )}
            <span className="px-3.5 py-1.5 rounded-full bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Flame className="w-4 h-4 fill-[#FF6321]" /> FLAGSHIP COMMERCIAL PRODUCT
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-mono font-bold uppercase">
              VERSION {product.version}
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl sm:text-7xl font-black text-white uppercase tracking-tight">
              APEX <span className="text-[#FF6321]">EDITOR</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 font-light max-w-3xl leading-relaxed">
              High-performance, zero-latency desktop code and text editor engineered for supreme productivity, instant file opening, and custom plugin extensions.
            </p>
          </div>

          {/* Quick Action CTA Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <button
              onClick={() => openDownloadModal(product)}
              className="px-8 py-4 rounded-xl bg-[#FF6321] hover:bg-[#FF8A50] text-black font-extrabold text-xs uppercase tracking-widest shadow-[0_10px_30px_rgba(255,99,33,0.35)] transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> REQUEST ACCESS NOW (
              {launchPricing ? launchPricing.priceDisplay : 'FREE'})
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('specs-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition-colors backdrop-blur-sm flex items-center justify-center gap-2"
            >
              <Terminal className="w-4 h-4 text-[#FF6321]" /> TECHNICAL SPECIFICATIONS
            </button>
          </div>
        </div>
      </section>

      {/* Live Launch Pricing Countdown Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CountdownTimer pricing={launchPricing} onRefresh={onRefreshPricing} />
      </section>

      {/* Interactive Mockup Preview Glass Frame */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[28px] md:rounded-[32px] bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-6 md:p-8 shadow-2xl space-y-4">
          {/* Mock Window Controls Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-gray-400 ml-2">
                ApexEditor_v1.0.0 — main.rs
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
              <span className="text-[#FF6321]">● GPU CANVAS 60FPS</span>
              <span>UTF-8</span>
              <span>Rust Core</span>
            </div>
          </div>

          {/* Code IDE Visual Preview Box */}
          <div className="bg-[#050608] rounded-2xl p-6 font-mono text-xs sm:text-sm text-gray-300 border border-white/5 overflow-x-auto space-y-2 leading-relaxed">
            <div className="text-gray-500">// Apex Syndicate Core Native Editor Engine</div>
            <div>
              <span className="text-purple-400">fn</span>{' '}
              <span className="text-blue-400 font-bold">init_apex_kernel</span>() -{'>'}{' '}
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
              .enable_zero_latency_input(<span className="text-[#FF6321]">true</span>)
            </div>
            <div className="pl-8 text-gray-400">
              .enable_256bit_encryption(<span className="text-[#FF6321]">true</span>)
            </div>
            <div className="pl-8 text-gray-400">
              .set_fps_target(<span className="text-amber-300">60</span>)
            </div>
            <div className="pl-8 text-gray-400">.build()?;</div>
            <div className="pl-4 mt-1">
              editor.<span className="text-blue-300">spawn_workspace</span>()?;
            </div>
            <div className="pl-4">
              <span className="text-emerald-400">Ok</span>(())
            </div>
            <div>&#125;</div>
          </div>
        </div>
      </section>

      {/* Deep Capabilities Grid */}
      <section id="specs-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold text-[#FF6321] uppercase tracking-widest">
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
          <div className="p-6 rounded-[28px] bg-white/[0.03] backdrop-blur-xl border border-white/10 space-y-4">
            <div className="p-3 rounded-2xl bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] w-fit">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Instant Cold Start</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Launches under 80 milliseconds with zero delay. Perfect for rapid file edits, massive log analysis, and daily dev workflows.
            </p>
          </div>

          <div className="p-6 rounded-[28px] bg-white/[0.03] backdrop-blur-xl border border-white/10 space-y-4">
            <div className="p-3 rounded-2xl bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] w-fit">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Multi-Cursor Matrix</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Seamlessly manipulate thousands of edit cursors simultaneously across gigabyte-sized files without lagging.
            </p>
          </div>

          <div className="p-6 rounded-[28px] bg-white/[0.03] backdrop-blur-xl border border-white/10 space-y-4">
            <div className="p-3 rounded-2xl bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Offline Vault Mode</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Your source code stays 100% local on your hardware. No cloud telemetry, no forced sign-ins, pure privacy.
            </p>
          </div>
        </div>
      </section>

      {/* System Requirements Panel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-[28px] bg-white/[0.03] backdrop-blur-2xl border border-white/10 space-y-6 shadow-2xl">
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
        </div>
      </section>
    </div>
  );
};
