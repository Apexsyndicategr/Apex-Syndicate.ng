import React from 'react';
import { Product, LaunchPricingInfo } from '../types';
import { CountdownTimer } from '../components/CountdownTimer';
import {
  Terminal,
  Layers,
  Zap,
  ShieldCheck,
  Download,
  Play,
  Clock,
} from 'lucide-react';

interface ApexEditorProps {
  product: Product | null;
  launchPricing: LaunchPricingInfo | null;
  openDownloadModal: (product: Product) => void;
  onRefreshPricing?: () => void;
  setActiveTab?: (tab: string) => void;
}

export const ApexEditor: React.FC<ApexEditorProps> = ({
  product,
  launchPricing,
  openDownloadModal,
  onRefreshPricing,
  setActiveTab,
}) => {
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-zinc-400 font-mono text-sm">
        Loading Apex Editor specifications...
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-24">
      {/* Header Banner */}
      <section className="pt-12 pb-10 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-xs font-mono text-zinc-400 flex flex-wrap items-center gap-2">
            <span className="text-[#FF5500] font-semibold">Flagship Software</span>
            <span aria-hidden="true">·</span>
            <span>Version {product.version}</span>
            {(product.isComingSoon || product.releaseDate === 'Coming Soon') && (
              <>
                <span aria-hidden="true">·</span>
                <span>Coming Soon</span>
              </>
            )}
          </div>

          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.04]">
              APEX <span className="text-[#FF5500]">EDITOR</span>
            </h1>
            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
              High-performance, zero-latency desktop code and media editor engineered for instant file loading, smooth timeline playback, and custom plugin extensions.
            </p>
          </div>

          {/* Action CTA Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            {setActiveTab && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('apex-editor-demo');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-7 py-3.5 rounded-lg bg-[#FF5500] hover:bg-[#FF6E26] text-black font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Try Web Demo</span>
              </button>
            )}

            {product.isComingSoon || !product.fileUrl ? (
              <div className="px-6 py-3.5 rounded-lg bg-[#111114] border border-white/[0.08] text-zinc-300 font-mono text-xs flex items-center justify-center gap-2.5">
                <Clock className="w-4 h-4 text-[#FF5500]" />
                <span>Desktop Release: Coming Soon</span>
                <span className="text-[#FF5500] font-semibold">
                  ({launchPricing ? launchPricing.priceDisplay : 'FREE LAUNCH'})
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openDownloadModal(product)}
                className="px-6 py-3.5 rounded-lg bg-[#111114] hover:bg-[#17171c] text-white font-semibold text-sm border border-[#FF5500]/50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#FF5500]" />
                <span>Download ({launchPricing ? launchPricing.priceDisplay : 'FREE'})</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('specs-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 font-medium text-sm border border-white/[0.08] flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-[#FF5500]" />
              <span>Technical Specifications</span>
            </button>
          </div>
        </div>
      </section>

      {/* Launch Pricing Countdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CountdownTimer pricing={launchPricing} onRefresh={onRefreshPricing} />
      </section>

      {/* Native Kernel Preview Frame */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#111114] border border-white/[0.08] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-white/[0.08] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-zinc-300">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
              <span className="ml-2 font-semibold">ApexEditor — main.rs</span>
            </div>
            <div className="flex items-center gap-4 text-zinc-500">
              <span className="text-[#FF5500] font-semibold">GPU Canvas 60FPS</span>
              <span>UTF-8</span>
              <span>Rust Core</span>
            </div>
          </div>

          <pre className="p-6 bg-[#09090b] font-mono text-xs sm:text-sm text-zinc-300 overflow-x-auto leading-relaxed">
{`// Apex Syndicate Native Editor Engine
fn init_apex_kernel() -> Result<(), EngineError> {
    let canvas = GPUCanvas::new("Apex_Syndicate_Viewport");
    let editor = ApexEditor::builder()
        .enable_zero_latency_input(true)
        .enable_256bit_encryption(true)
        .set_fps_target(60)
        .build()?;

    editor.spawn_workspace()?;
    Ok(())
}`}
          </pre>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section id="specs-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="max-w-2xl space-y-2">
          <div className="text-xs font-mono text-[#FF5500] font-medium">Engineering Specs</div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Why Choose Apex Editor
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Built natively from the ground up to eliminate Electron overhead and deliver predictable speed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Instant Cold Start',
              desc: 'Launches under 80 milliseconds with minimal memory usage for rapid file edits and log inspection.',
              icon: Zap,
            },
            {
              title: 'Multi-Cursor Matrix',
              desc: 'Edit across large multi-gigabyte projects smoothly with hardware-accelerated rendering.',
              icon: Layers,
            },
            {
              title: 'Offline Vault Mode',
              desc: 'Your workspace stays 100% local on your machine. No background telemetry or forced sign-ins.',
              icon: ShieldCheck,
            },
          ].map((spec, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#111114] border border-white/[0.08] space-y-3"
            >
              <div className="w-10 h-10 rounded-lg bg-[#FF5500]/10 border border-[#FF5500]/25 flex items-center justify-center text-[#FF5500]">
                <spec.icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">{spec.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{spec.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* System Requirements */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-2xl bg-[#111114] border border-white/[0.08] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
            <h3 className="text-lg font-bold text-white">System Requirements</h3>
            <span className="text-xs font-mono text-[#FF5500]">Cross-Platform Desktop</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#09090b] border border-white/[0.06] space-y-1">
              <div className="text-zinc-500 font-mono">Operating System</div>
              <div className="font-semibold text-white">Windows 10/11, macOS 12+, Ubuntu</div>
            </div>
            <div className="p-4 rounded-xl bg-[#09090b] border border-white/[0.06] space-y-1">
              <div className="text-zinc-500 font-mono">Memory (RAM)</div>
              <div className="font-semibold text-white">TBD</div>
            </div>
            <div className="p-4 rounded-xl bg-[#09090b] border border-white/[0.06] space-y-1">
              <div className="text-zinc-500 font-mono">Processor</div>
              <div className="font-semibold text-white">TBD</div>
            </div>
            <div className="p-4 rounded-xl bg-[#09090b] border border-white/[0.06] space-y-1">
              <div className="text-zinc-500 font-mono">Storage Space</div>
              <div className="font-semibold text-white">TBD</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
