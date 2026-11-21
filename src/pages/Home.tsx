import React, { useState } from 'react';
import { Product, LaunchPricingInfo } from '../types';
import { CountdownTimer } from '../components/CountdownTimer';
import { PortfolioVideoShowcase } from '../components/PortfolioVideoShowcase';
import { NaijaLifeWarningModal } from '../components/NaijaLifeWarningModal';
import {
  ArrowRight,
  Download,
  ChevronRight,
  Play,
  Terminal,
  Check,
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
  const [showNaijaLifeWarning, setShowNaijaLifeWarning] = useState<boolean>(false);
  const apexEditor = products.find((p) => p.id === 'apex-editor') || products[0];

  const navigate = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="pt-14 md:pt-20 pb-8 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-6">
            <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
              <span className="text-[#FF5500] font-semibold">Apex Syndicate</span>
              <span aria-hidden="true">·</span>
              <span>Software & Game Studio</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.05] text-balance">
              Software built to <span className="text-[#FF5500]">create, edit,</span> and innovate.
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl">
              High-speed creative tools, developer utilities, and open-world games built by Apex Syndicate—from the native Apex Editor to Naija Life and Gangster Revolution.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('products')}
                className="px-6 py-3.5 rounded-lg bg-[#FF5500] hover:bg-[#FF6E26] text-black font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => navigate('apex-editor')}
                className="px-6 py-3.5 rounded-lg bg-[#111114] hover:bg-[#18181d] text-white font-medium text-sm border border-white/[0.1] hover:border-white/20 flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
              >
                <Terminal className="w-4 h-4 text-[#FF5500]" />
                <span>Apex Editor</span>
                <span className="text-xs font-mono text-[#FF5500]">
                  {launchPricing ? launchPricing.priceDisplay : 'FREE'}
                </span>
              </button>
            </div>
          </div>

          {/* Studio Metrics Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-white/[0.08] pt-8 gap-6 lg:gap-0 lg:divide-x lg:divide-white/[0.08]">
            <div className="lg:pr-8 space-y-1">
              <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white">
                100%
              </div>
              <div className="text-xs text-zinc-400">Native Desktop Performance</div>
            </div>
            <div className="lg:px-8 space-y-1">
              <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-[#FF5500]">
                60 FPS
              </div>
              <div className="text-xs text-zinc-400">Hardware-Accelerated Canvas</div>
            </div>
            <div className="lg:px-8 space-y-1">
              <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white">
                SHA-256
              </div>
              <div className="text-xs text-zinc-400">Checksum Verified Builds</div>
            </div>
            <div className="lg:pl-8 space-y-1">
              <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-[#FF5500]">
                {launchPricing ? launchPricing.priceDisplay : 'FREE'}
              </div>
              <div className="text-xs text-zinc-400">Current Apex Editor Tier</div>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Updates & Media Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PortfolioVideoShowcase setActiveTab={setActiveTab} />
      </section>

      {/* Flagship Product Spotlight: Apex Editor */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#111114] border border-white/[0.08] p-7 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="text-xs font-mono text-[#FF5500] font-medium">
                Flagship Software · {apexEditor?.version || 'v2.4.0'}
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Apex Editor
              </h2>

              <p className="text-base text-zinc-400 leading-relaxed max-w-xl">
                {apexEditor
                  ? apexEditor.description
                  : 'Powerful editing built for high-performance software development, creative media, and advanced scripting.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {[
                  'GPU-accelerated 60FPS canvas',
                  'Zero-latency Rust core',
                  'Multi-cursor split workspace',
                  'Custom extension support',
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-2.5 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-[#FF5500] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
                {apexEditor && (apexEditor.isComingSoon || !apexEditor.fileUrl) ? (
                  <button
                    type="button"
                    onClick={() => navigate('apex-editor-demo')}
                    className="px-6 py-3 rounded-lg bg-[#FF5500] hover:bg-[#FF6E26] text-black font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    <span>Try Web Demo</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => apexEditor && openDownloadModal(apexEditor)}
                    className="px-6 py-3 rounded-lg bg-[#FF5500] hover:bg-[#FF6E26] text-black font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download ({launchPricing ? launchPricing.priceDisplay : 'FREE'})</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => navigate('apex-editor')}
                  className="px-5 py-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 hover:text-white font-medium text-sm border border-white/[0.08] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Specifications</span>
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <CountdownTimer pricing={launchPricing} />
            </div>
          </div>
        </div>
      </section>

      {/* Products Catalogue Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-white/[0.08]">
          <div className="space-y-1">
            <div className="text-xs font-mono text-[#FF5500] font-medium">
              Catalogue
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Studio Releases & Titles
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigate('products')}
            className="text-sm font-medium text-[#FF5500] hover:text-[#FF7A33] flex items-center gap-1.5 transition-colors cursor-pointer w-fit"
          >
            <span>View all products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.slice(0, 3).map((prod) => {
            const statusText =
              prod.releaseDate === 'TBD' || prod.id === 'gangster-revolution'
                ? 'TBD'
                : prod.isComingSoon || prod.releaseDate === 'Coming Soon'
                ? 'Coming Soon'
                : 'Available';

            const priceLabel =
              prod.pricingType === 'tbd' || (prod.pricingType === 'fixed' && !prod.fixedPrice)
                ? 'TBD'
                : prod.id === 'apex-editor' && launchPricing && prod.pricingType === 'launch'
                ? launchPricing.priceDisplay
                : prod.pricingType === 'free'
                ? 'FREE'
                : `₦${(prod.fixedPrice || 0).toLocaleString()}`;

            return (
              <div
                key={prod.id}
                className="rounded-2xl bg-[#111114] border border-white/[0.08] hover:border-[#FF5500]/40 p-6 flex flex-col justify-between transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2 text-xs font-mono text-zinc-400">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[#FF5500] font-medium">{prod.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{statusText}</span>
                    </div>
                    <span className="text-zinc-500 shrink-0">{prod.version}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {prod.name}
                  </h3>

                  <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3">
                    {prod.description}
                  </p>

                  <ul className="space-y-1.5 pt-2 border-t border-white/[0.06] text-xs text-zinc-400">
                    {prod.features.slice(0, 3).map((feat, fidx) => (
                      <li key={fidx} className="flex items-start gap-2">
                        <span className="text-[#FF5500] mt-0.5">·</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-5 mt-6 border-t border-white/[0.08] flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-mono text-zinc-500">Access</div>
                    <div className="text-base font-bold font-mono tabular-nums text-white">
                      {priceLabel}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    {prod.id === 'apex-editor' && (
                      <button
                        type="button"
                        onClick={() => navigate('apex-editor-demo')}
                        className="px-3.5 py-2 rounded-lg bg-[#FF5500] hover:bg-[#FF6E26] text-black font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-black" />
                        <span>Try Demo</span>
                      </button>
                    )}

                    {prod.id === 'naija-life' && (
                      <>
                        <button
                          type="button"
                          onClick={() => setShowNaijaLifeWarning(true)}
                          className="px-3.5 py-2 rounded-lg bg-[#FF5500] hover:bg-[#FF6E26] text-black font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-black" />
                          <span>Play Demo</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate('naija-life')}
                          className="px-3.5 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200 text-xs font-medium border border-white/[0.08] transition-colors cursor-pointer"
                        >
                          Game Hub
                        </button>
                      </>
                    )}

                    {prod.id === 'gangster-revolution' && (
                      <button
                        type="button"
                        onClick={() => navigate('gangster-revolution')}
                        className="px-3.5 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200 text-xs font-medium border border-white/[0.08] transition-colors cursor-pointer"
                      >
                        Game Hub
                      </button>
                    )}

                    {prod.id !== 'naija-life' &&
                      prod.id !== 'apex-editor' &&
                      prod.id !== 'gangster-revolution' &&
                      (prod.fileUrl ? (
                        <button
                          type="button"
                          onClick={() => openDownloadModal(prod)}
                          className="px-3.5 py-2 rounded-lg bg-[#FF5500] hover:bg-[#FF6E26] text-black font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => navigate('products')}
                          className="px-3.5 py-2 rounded-lg bg-white/[0.05] text-zinc-400 text-xs font-medium border border-white/[0.08] cursor-pointer"
                        >
                          Details
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Studio Engineering Standards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-white/[0.08] pt-12 space-y-10">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Built for reliability and low overhead
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Every build released by Apex Syndicate is audited, checksum-signed, and supported directly by the studio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="text-xs font-mono text-[#FF5500] font-semibold">01.</div>
              <h3 className="text-base font-semibold text-white">Zero-Bloat Architecture</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Compiled native binaries with minimal memory footprint, no background telemetry strain, and fast cold starts.
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-mono text-[#FF5500] font-semibold">02.</div>
              <h3 className="text-base font-semibold text-white">Verified Distribution</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Tokenized release channels and SHA-256 checksums ensure every customer receives an untampered package.
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-mono text-[#FF5500] font-semibold">03.</div>
              <h3 className="text-base font-semibold text-white">Direct Studio Support</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Fast verification and ongoing updates directly from the engineering team behind every product.
              </p>
            </div>
          </div>
        </div>
      </section>

      <NaijaLifeWarningModal
        isOpen={showNaijaLifeWarning}
        onClose={() => setShowNaijaLifeWarning(false)}
      />
    </div>
  );
};
