import React, { useState } from 'react';
import { Product, LaunchPricingInfo } from '../types';
import {
  Search,
  Download,
  ExternalLink,
  X,
  Play,
  Gamepad,
} from 'lucide-react';
import { NaijaLifeWarningModal } from '../components/NaijaLifeWarningModal';

interface ProductsProps {
  products: Product[];
  openDownloadModal: (product: Product) => void;
  launchPricing: LaunchPricingInfo | null;
  setActiveTab?: (tab: string) => void;
}

export const Products: React.FC<ProductsProps> = ({
  products,
  openDownloadModal,
  launchPricing,
  setActiveTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [showNaijaLifeWarning, setShowNaijaLifeWarning] = useState<boolean>(false);

  const categories = ['ALL', 'Editor', 'Tools', 'Utilities', 'Plugins', 'Games'];

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'ALL' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12 pb-24">
      {/* Header */}
      <section className="pt-12 pb-8 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="text-xs font-mono text-[#FF5500] font-medium">
            Apex Syndicate · Catalogue
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Software & Game Catalogue
          </h1>
          <p className="text-base text-zinc-400 max-w-2xl">
            Commercial creative applications, developer utilities, and studio games.
          </p>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-2 rounded-xl bg-[#111114] border border-white/[0.08]">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#FF5500] text-black font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {cat === 'ALL' ? 'All' : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#09090b] border border-white/[0.08] focus:border-[#FF5500] text-white text-xs focus:outline-none transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-4 rounded-2xl bg-[#111114] border border-white/[0.08]">
            <h3 className="text-lg font-semibold text-white">No matching products</h3>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              Try clearing your search term or selecting another category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-lg bg-[#FF5500] hover:bg-[#FF6E26] text-black font-semibold text-xs cursor-pointer transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => {
              let priceDisplay = 'FREE';
              if (prod.pricingType === 'tbd' || (prod.pricingType === 'fixed' && !prod.fixedPrice)) {
                priceDisplay = 'TBD';
              } else if (prod.id === 'apex-editor' && launchPricing && prod.pricingType === 'launch') {
                priceDisplay = launchPricing.priceDisplay;
              } else if (prod.pricingType === 'free') {
                priceDisplay = 'FREE';
              } else if (prod.pricingType === 'fixed') {
                priceDisplay = `₦${(prod.fixedPrice || 0).toLocaleString()}`;
              }

              const statusText =
                prod.releaseDate === 'TBD' || prod.id === 'gangster-revolution'
                  ? 'TBD'
                  : prod.isComingSoon || prod.releaseDate === 'Coming Soon'
                  ? 'Coming Soon'
                  : 'Available';

              return (
                <div
                  key={prod.id}
                  className="rounded-2xl bg-[#111114] border border-white/[0.08] hover:border-[#FF5500]/45 p-6 flex flex-col justify-between transition-colors"
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

                    <div>
                      <h3
                        onClick={() => setSelectedProductDetails(prod)}
                        className="text-xl font-bold text-white hover:text-[#FF5500] transition-colors cursor-pointer"
                      >
                        {prod.name}
                      </h3>
                      <div className="text-xs text-zinc-500 mt-1 font-mono">
                        Release: {prod.releaseDate}
                      </div>
                    </div>

                    <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3">
                      {prod.description}
                    </p>

                    <ul className="space-y-1.5 pt-2 border-t border-white/[0.06] text-xs text-zinc-400">
                      {prod.features.slice(0, 3).map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#FF5500] mt-0.5">·</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-5 mt-6 border-t border-white/[0.08] flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[11px] text-zinc-500 font-mono">Access</div>
                      <div className="text-base font-bold font-mono tabular-nums text-white">
                        {priceDisplay}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      {prod.externalUrl && prod.id !== 'naija-life' && (
                        <a
                          href={prod.externalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-2 rounded-lg bg-[#FF5500] hover:bg-[#FF6E26] text-black font-semibold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <span>Open App</span>
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedProductDetails(prod)}
                        className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.08] transition-colors cursor-pointer"
                        title="View Specifications"
                        aria-label="View Specifications"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>

                      {prod.id === 'apex-editor' && setActiveTab && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('apex-editor-demo');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
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

                          {setActiveTab && (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab('naija-life');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="px-3.5 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200 text-xs font-medium border border-white/[0.08] transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <Gamepad className="w-3.5 h-3.5 text-[#FF5500]" />
                              <span>Game Hub</span>
                            </button>
                          )}
                        </>
                      )}

                      {prod.id === 'gangster-revolution' && setActiveTab && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('gangster-revolution');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="px-3.5 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200 text-xs font-medium border border-white/[0.08] transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Gamepad className="w-3.5 h-3.5 text-[#FF5500]" />
                          <span>Game Hub</span>
                        </button>
                      )}

                      {prod.id !== 'naija-life' &&
                        prod.id !== 'gangster-revolution' &&
                        !(prod.isComingSoon || !prod.fileUrl) && (
                          <button
                            type="button"
                            onClick={() => openDownloadModal(prod)}
                            className="px-3.5 py-2 rounded-lg bg-[#FF5500] hover:bg-[#FF6E26] text-black font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Product Specifications Modal */}
      {selectedProductDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#111114] border border-white/[0.12] p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              type="button"
              onClick={() => setSelectedProductDetails(null)}
              className="absolute top-6 right-6 p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 pr-10">
              <div className="text-xs font-mono text-[#FF5500]">
                {selectedProductDetails.category} · {selectedProductDetails.version}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {selectedProductDetails.name}
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {selectedProductDetails.fullDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-white/[0.08]">
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Key Capabilities
                </h4>
                <ul className="space-y-2 text-sm text-zinc-300">
                  {selectedProductDetails.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#FF5500] mt-0.5">·</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  System Requirements
                </h4>
                <div className="rounded-xl bg-[#09090b] border border-white/[0.06] divide-y divide-white/[0.06] text-xs font-mono">
                  <div className="flex justify-between gap-4 px-4 py-2.5">
                    <span className="text-zinc-500">Platform</span>
                    <span className="text-zinc-200 text-right">
                      {selectedProductDetails.systemRequirements?.os || 'TBD'}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 px-4 py-2.5">
                    <span className="text-zinc-500">Processor</span>
                    <span className="text-zinc-200 text-right">
                      {selectedProductDetails.systemRequirements?.processor || 'TBD'}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 px-4 py-2.5">
                    <span className="text-zinc-500">Memory</span>
                    <span className="text-zinc-200 text-right">
                      {selectedProductDetails.systemRequirements?.memory || 'TBD'}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 px-4 py-2.5">
                    <span className="text-zinc-500">Storage</span>
                    <span className="text-zinc-200 text-right">
                      {selectedProductDetails.systemRequirements?.storage || 'TBD'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {selectedProductDetails.screenshots && selectedProductDetails.screenshots.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Preview Gallery
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedProductDetails.screenshots.map((img, i) => (
                    <div
                      key={i}
                      className="aspect-video rounded-xl overflow-hidden border border-white/[0.08] bg-[#09090b]"
                    >
                      <img
                        src={img}
                        alt={`${selectedProductDetails.name} preview ${i + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-zinc-500">Access</span>
                <div className="text-xl font-bold font-mono text-white">
                  {selectedProductDetails.pricingType === 'tbd'
                    ? 'TBD'
                    : selectedProductDetails.id === 'apex-editor' && launchPricing
                    ? launchPricing.priceDisplay
                    : selectedProductDetails.pricingType === 'free'
                    ? 'FREE'
                    : `₦${(selectedProductDetails.fixedPrice || 0).toLocaleString()}`}
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {selectedProductDetails.id === 'apex-editor' && setActiveTab && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProductDetails(null);
                      setActiveTab('apex-editor-demo');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-5 py-2.5 rounded-lg bg-[#FF5500] hover:bg-[#FF6E26] text-black font-semibold text-xs flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" />
                    <span>Try Demo</span>
                  </button>
                )}

                {selectedProductDetails.id === 'naija-life' && (
                  <button
                    type="button"
                    onClick={() => setShowNaijaLifeWarning(true)}
                    className="px-5 py-2.5 rounded-lg bg-[#FF5500] hover:bg-[#FF6E26] text-black font-semibold text-xs flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" />
                    <span>Play Demo</span>
                  </button>
                )}

                {selectedProductDetails.id === 'naija-life' && setActiveTab && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProductDetails(null);
                      setActiveTab('naija-life');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-5 py-2.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-white font-medium text-xs border border-white/[0.08] cursor-pointer transition-colors"
                  >
                    Game Hub
                  </button>
                )}

                {selectedProductDetails.id === 'gangster-revolution' && setActiveTab && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProductDetails(null);
                      setActiveTab('gangster-revolution');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-5 py-2.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-white font-medium text-xs border border-white/[0.08] cursor-pointer transition-colors"
                  >
                    Game Hub
                  </button>
                )}

                {selectedProductDetails.id !== 'naija-life' &&
                  selectedProductDetails.id !== 'gangster-revolution' &&
                  selectedProductDetails.fileUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        const prod = selectedProductDetails;
                        setSelectedProductDetails(null);
                        openDownloadModal(prod);
                      }}
                      className="px-6 py-2.5 rounded-lg bg-[#FF5500] hover:bg-[#FF6E26] text-black font-semibold text-xs cursor-pointer transition-colors"
                    >
                      Download Now
                    </button>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}

      <NaijaLifeWarningModal
        isOpen={showNaijaLifeWarning}
        onClose={() => setShowNaijaLifeWarning(false)}
      />
    </div>
  );
};
