import React, { useState } from 'react';
import { Product, ProductCategory, LaunchPricingInfo } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  Download,
  Terminal,
  Cpu,
  Shield,
  Zap,
  Gamepad,
  X,
  Calendar,
  Sparkles,
  ExternalLink,
  Globe,
  Clock,
} from 'lucide-react';

interface ProductsProps {
  products: Product[];
  openDownloadModal: (product: Product) => void;
  launchPricing: LaunchPricingInfo | null;
}

export const Products: React.FC<ProductsProps> = ({
  products,
  openDownloadModal,
  launchPricing,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);

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

  const getCategoryIcon = (category: ProductCategory) => {
    switch (category) {
      case 'Editor':
        return <Terminal className="w-4 h-4 text-[#FF6321] animate-pulse" />;
      case 'Tools':
        return <Cpu className="w-4 h-4 text-[#FF6321] animate-pulse" />;
      case 'Utilities':
        return <Shield className="w-4 h-4 text-[#FF6321] animate-pulse" />;
      case 'Plugins':
        return <Zap className="w-4 h-4 text-[#FF6321] animate-pulse" />;
      case 'Games':
        return <Gamepad className="w-4 h-4 text-[#FF6321] animate-pulse" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#FF6321] animate-pulse" />;
    }
  };

  return (
    <div className="space-y-12 pb-20 overflow-hidden">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative pt-10 pb-6 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] text-xs font-mono font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(255,99,33,0.2)] animate-pulse">
            OFFICIAL COMMERCIAL MARKETPLACE
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight">
            SOFTWARE <span className="bg-gradient-to-r from-[#FF6321] via-amber-400 to-[#FF6321] bg-clip-text text-transparent animate-shimmer-text">CATALOGUE</span>
          </h1>
          <p className="text-base text-gray-400 max-w-2xl font-light">
            Commercial applications, developer tools, and system utilities engineered by Apex Syndicate.
          </p>
        </div>
      </motion.div>

      {/* Filter & Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-lg">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-[#FF6321] to-amber-500 text-black shadow-[0_0_20px_rgba(255,99,33,0.4)] font-black'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Apex products..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 focus:border-[#FF6321] text-white text-xs focus:outline-none transition-colors shadow-inner"
            />
          </div>
        </div>
      </motion.div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-20 text-center space-y-4 rounded-[28px] bg-white/[0.03] backdrop-blur-xl border border-white/10"
          >
            <Filter className="w-10 h-10 text-gray-500 mx-auto animate-bounce" />
            <h3 className="text-xl font-bold text-white uppercase">NO PRODUCTS FOUND</h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              No Apex Syndicate software matched your search criteria. Try selecting another category or clear your search query.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 rounded-xl bg-[#FF6321] text-black font-bold text-xs uppercase shadow-md hover:scale-105 transition-all"
            >
              RESET FILTERS
            </button>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredProducts.map((prod, index) => {
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

                return (
                  <motion.div
                    layout
                    key={prod.id}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.06 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="group relative rounded-[28px] bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl border border-white/10 hover:border-[#FF6321]/50 p-6 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-[0_15px_35px_rgba(255,99,33,0.25)] overflow-hidden"
                  >
                    {/* Laser highlight line on hover */}
                    <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FF6321] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="space-y-4 relative z-10">
                      {/* Header Badge */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] text-[11px] font-bold uppercase tracking-wider">
                            {getCategoryIcon(prod.category)}
                            <span>{prod.category}</span>
                          </div>
                          {(prod.isComingSoon || prod.releaseDate === 'Coming Soon') && (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#FF6321] text-black text-[10px] font-black uppercase tracking-wider animate-pulse shadow-[0_0_10px_rgba(255,99,33,0.5)]">
                              COMING SOON
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono text-gray-500 font-semibold">{prod.version}</span>
                      </div>

                      {/* Title */}
                      <div>
                        <h3
                          onClick={() => setSelectedProductDetails(prod)}
                          className="text-2xl font-bold text-white group-hover:text-[#FF6321] transition-colors cursor-pointer"
                        >
                          {prod.name}
                        </h3>
                        <div className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-1 font-mono">
                          <Calendar className="w-3 h-3 text-[#FF6321]" />
                          <span>Released: {prod.releaseDate}</span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                        {prod.description}
                      </p>

                      {/* Features Tags */}
                      <div className="space-y-1 pt-1">
                        <div className="text-[10px] text-gray-500 font-mono uppercase font-bold">
                          KEY FEATURES:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {prod.features.slice(0, 3).map((feat, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/5 text-gray-300 text-[10px] group-hover:border-[#FF6321]/20 transition-colors"
                            >
                              {feat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Pricing & Download Footer */}
                    <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between relative z-10">
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase font-mono font-bold">
                          ACCESS PRICE
                        </div>
                        <div className="text-lg font-black text-white group-hover:text-[#FF6321] transition-colors">{priceDisplay}</div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {prod.externalUrl && (
                          <motion.a
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            href={prod.externalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-[11px] tracking-wider uppercase shadow-md transition-all flex items-center gap-1.5"
                            title="Open Live Web Application"
                          >
                            <Globe className="w-3.5 h-3.5" /> LAUNCH
                          </motion.a>
                        )}

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setSelectedProductDetails(prod)}
                          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors"
                          title="View Product Details"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </motion.button>

                        {prod.isComingSoon || !prod.fileUrl ? (
                          <span className="px-3.5 py-2 rounded-xl bg-white/[0.04] border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 cursor-not-allowed">
                            <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" /> COMING SOON
                          </span>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.06 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openDownloadModal(prod)}
                            className="px-4 py-2.5 rounded-xl bg-[#FF6321] hover:bg-[#FF8A50] text-black font-extrabold text-xs tracking-wider uppercase shadow-[0_0_15px_rgba(255,99,33,0.4)] transition-all flex items-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5" /> DOWNLOAD
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Product Details Full Modal with Animations */}
      <AnimatePresence>
        {selectedProductDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-3xl bg-[#08080a] border border-white/15 rounded-[32px] p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6"
            >
              <button
                onClick={() => setSelectedProductDetails(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-3.5 rounded-2xl bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] shadow-[0_0_15px_rgba(255,99,33,0.3)]">
                  {getCategoryIcon(selectedProductDetails.category)}
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#FF6321] uppercase font-bold tracking-wider">
                    {selectedProductDetails.category} • VERSION {selectedProductDetails.version}
                  </span>
                  <h2 className="text-3xl font-black text-white">{selectedProductDetails.name}</h2>
                </div>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed font-light">
                {selectedProductDetails.fullDescription || selectedProductDetails.description}
              </p>

              {/* Screenshots Gallery if available */}
              {selectedProductDetails.screenshots.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-gray-400 uppercase font-mono">
                    SOFTWARE SCREENSHOTS & INTERFACE:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedProductDetails.screenshots.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Screenshot ${idx + 1}`}
                        className="rounded-2xl border border-white/10 object-cover h-40 w-full hover:border-[#FF6321]/50 transition-colors"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Features List */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-[#FF6321] uppercase font-mono">
                  FULL CAPABILITIES & FEATURES:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                  {selectedProductDetails.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6321] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Requirements if available */}
              {selectedProductDetails.systemRequirements && (
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs">
                  <div className="font-bold text-gray-300 uppercase font-mono">SYSTEM REQUIREMENTS:</div>
                  <div className="grid grid-cols-2 gap-2 text-gray-400">
                    <div>OS: {selectedProductDetails.systemRequirements.os}</div>
                    <div>RAM: {selectedProductDetails.systemRequirements.memory}</div>
                    <div>CPU: {selectedProductDetails.systemRequirements.processor}</div>
                    <div>Storage: {selectedProductDetails.systemRequirements.storage}</div>
                  </div>
                </div>
              )}

              {/* Optional Web Application Link Banner */}
              {selectedProductDetails.externalUrl && (
                <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between flex-wrap gap-4 shadow-lg">
                  <div className="space-y-1">
                    <div className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      <Globe className="w-4 h-4 text-cyan-400" />
                      LIVE WEB APPLICATION URL ATTACHED
                    </div>
                    <p className="text-[11px] text-gray-300 font-mono break-all">
                      {selectedProductDetails.externalUrl}
                    </p>
                  </div>

                  <a
                    href={selectedProductDetails.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-1.5"
                  >
                    <Globe className="w-4 h-4" /> LAUNCH WEB APP NOW
                  </a>
                </div>
              )}

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-gray-500 uppercase">ACCESS REQUIREMENT</span>
                  <div className="text-xl font-black text-white">
                    {selectedProductDetails.id === 'apex-editor' && launchPricing
                      ? launchPricing.priceDisplay
                      : selectedProductDetails.pricingType === 'free'
                      ? 'FREE'
                      : `₦${(selectedProductDetails.fixedPrice || 0).toLocaleString()}`}
                  </div>
                </div>

                {selectedProductDetails.isComingSoon || !selectedProductDetails.fileUrl ? (
                  <div className="px-6 py-3.5 rounded-xl bg-white/[0.05] border border-amber-500/30 text-amber-300 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 cursor-not-allowed">
                    <Clock className="w-4 h-4 text-amber-400 animate-spin" /> COMING SOON • IN DEVELOPMENT
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      const prod = selectedProductDetails;
                      setSelectedProductDetails(null);
                      openDownloadModal(prod);
                    }}
                    className="px-8 py-3.5 rounded-xl bg-[#FF6321] hover:bg-[#FF8A50] text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,99,33,0.35)]"
                  >
                    DOWNLOAD NOW
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
