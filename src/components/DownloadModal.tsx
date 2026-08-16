import React, { useState } from 'react';
import { Product, DownloadRequest, LaunchPricingInfo } from '../types';
import { submitDownloadRequest, verifyRequestApi } from '../lib/api';
import {
  X,
  Download,
  CheckCircle2,
  Clock,
  Building2,
  Copy,
  Check,
  Search,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Globe,
} from 'lucide-react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  launchPricing?: LaunchPricingInfo | null;
  paymentSettings?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    bankInstructions: string;
  } | null;
  onRequestSubmitted?: (req: DownloadRequest) => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  product,
  launchPricing,
  paymentSettings,
  onRequestSubmitted,
}) => {
  const [activeTab, setActiveTab] = useState<'request' | 'lookup'>('request');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentProofRef, setPaymentProofRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedRequest, setSubmittedRequest] = useState<DownloadRequest | null>(null);

  // Lookup state
  const [searchQuery, setSearchQuery] = useState('');
  const [lookupRequest, setLookupRequest] = useState<DownloadRequest | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [lookupError, setLookupError] = useState('');

  // Copy state
  const [copiedBank, setCopiedBank] = useState(false);

  if (!isOpen || !product) return null;

  // Calculate current price for this product
  let currentPrice = 0;
  let priceDisplay = 'FREE';
  let isFree = false;

  if (product.pricingType === 'tbd' || (product.pricingType === 'fixed' && !product.fixedPrice)) {
    currentPrice = 0;
    priceDisplay = 'TBD';
    isFree = true;
  } else if (product.id === 'apex-editor' && launchPricing && product.pricingType === 'launch') {
    currentPrice = launchPricing.currentPrice;
    priceDisplay = launchPricing.priceDisplay;
    isFree = launchPricing.activePhase === 'free';
  } else if (product.pricingType === 'free') {
    currentPrice = 0;
    priceDisplay = 'FREE';
    isFree = true;
  } else if (product.pricingType === 'fixed') {
    currentPrice = product.fixedPrice || 0;
    priceDisplay = currentPrice === 0 ? 'FREE' : `₦${(currentPrice || 0).toLocaleString()}`;
    isFree = currentPrice === 0;
  }

  const handleCopyAccount = () => {
    if (paymentSettings) {
      navigator.clipboard.writeText(paymentSettings.accountNumber);
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2000);
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail) {
      setErrorMsg('Please enter your full name and email address.');
      return;
    }

    if (!isFree && !paymentProofRef) {
      setErrorMsg('Please provide your Payment Reference or Bank Transaction ID.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await submitDownloadRequest({
        customerName,
        customerEmail,
        productId: product.id,
        paymentProofRef: paymentProofRef || 'FREE ACCESS REQUEST',
      });

      const data = res.request;

      // Store in localStorage for Customer Notifications Tab
      try {
        const saved = localStorage.getItem('apex_customer_requests');
        const list: string[] = saved ? JSON.parse(saved) : [];
        if (!list.includes(data.requestId)) {
          localStorage.setItem('apex_customer_requests', JSON.stringify([data.requestId, ...list]));
        }
        localStorage.setItem('apex_customer_email', customerEmail);
      } catch (e) {
        console.error('Failed to update localStorage', e);
      }

      setSubmittedRequest(data);
      if (onRequestSubmitted) onRequestSubmitted(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearchRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setLookupError('');
    setLookupRequest(null);

    try {
      const results = await verifyRequestApi(searchQuery.trim());
      if (!results || results.length === 0) {
        throw new Error('Request ID or email not found');
      }
      setLookupRequest(results[0]);
    } catch (err: any) {
      setLookupError(err.message || 'Request not found.');
    } finally {
      setIsSearching(false);
    }
  };

  const renderStatusProgress = (req: DownloadRequest) => {
    const isApproved = req.status === 'APPROVED';
    const isRejected = req.status === 'REJECTED';

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-center">
          <div className="text-xs text-gray-400 uppercase tracking-widest font-mono">
            REQUEST ID: <span className="text-[#FF6321] font-bold">{req.requestId}</span>
          </div>
          <h3 className="text-xl font-black text-white mt-1">{req.productName} ({req.productVersion})</h3>
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border">
            {isApproved ? (
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-full flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> APPROVED — DOWNLOAD UNLOCKED
              </span>
            ) : isRejected ? (
              <span className="bg-rose-500/20 text-rose-400 border border-rose-500/40 px-3 py-1 rounded-full flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> REJECTED — PAYMENT UNVERIFIED
              </span>
            ) : (
              <span className="bg-[#FF6321]/20 text-[#FF6321] border border-[#FF6321]/40 px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                <Clock className="w-4 h-4" /> AWAITING OWNER APPROVAL
              </span>
            )}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-4">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            CUSTOMER ACCESS WORKFLOW:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-black/50 border border-emerald-500/40 text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <div>
                <div className="font-bold">1. Created</div>
                <div className="text-[10px] text-gray-400">Verified</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/50 border border-emerald-500/40 text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <div>
                <div className="font-bold">2. Submitted</div>
                <div className="text-[10px] text-gray-400">Proof attached</div>
              </div>
            </div>

            <div
              className={`p-3 rounded-xl border flex items-center gap-2 ${
                isApproved
                  ? 'bg-black/50 border-emerald-500/40 text-emerald-400'
                  : isRejected
                  ? 'bg-black/50 border-rose-500/40 text-rose-400'
                  : 'bg-[#FF6321]/20 border-[#FF6321]/60 text-[#FF6321] animate-pulse'
              }`}
            >
              {isApproved ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : isRejected ? (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              ) : (
                <Clock className="w-4 h-4 shrink-0 text-[#FF6321] animate-spin" />
              )}
              <div>
                <div className="font-bold">3. Owner Review</div>
                <div className="text-[10px] text-gray-300">
                  {isApproved ? 'Approved' : isRejected ? 'Rejected' : 'In Review'}
                </div>
              </div>
            </div>

            <div
              className={`p-3 rounded-xl border flex items-center gap-2 ${
                isApproved
                  ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-black/30 border-white/5 text-gray-500'
              }`}
            >
              <Download className="w-4 h-4 shrink-0" />
              <div>
                <div className="font-bold">4. Download File</div>
                <div className="text-[10px]">{isApproved ? 'Ready!' : 'Locked'}</div>
              </div>
            </div>
          </div>
        </div>

        {isApproved && req.downloadToken && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-teal-950/60 border border-emerald-500/50 text-center space-y-3">
            <h4 className="text-lg font-bold text-white">Your Download Is Ready</h4>
            <p className="text-xs text-gray-300">
              Click below to download your official software package ({req.productName} {req.productVersion}).
            </p>
            <a
              href={`/api/download/file/${req.downloadToken}`}
              download
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-500 text-black font-extrabold text-xs tracking-wider shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:scale-105 transition-all"
            >
              <Download className="w-4 h-4" /> DOWNLOAD NOW
            </a>
          </div>
        )}

        {isRejected && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
            <strong>Owner Rejection Note:</strong> {req.rejectionReason || 'Payment could not be confirmed.'}
          </div>
        )}

        {!isApproved && !isRejected && (
          <div className="p-4 rounded-xl bg-[#FF6321]/10 border border-[#FF6321]/30 text-xs text-[#FF6321] leading-relaxed">
            💡 <strong>Note for Customer:</strong> The owner verifies incoming transfers in the admin portal. Once approved, refresh this page or re-enter your Request ID (<strong>{req.requestId}</strong>) to download!
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#08080a] border border-white/10 rounded-[32px] p-6 md:p-8 shadow-[0_0_60px_rgba(255,99,33,0.25)] max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321]">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-wider">
                GET {product.name}
              </h2>
              <div className="text-xs text-gray-400 mt-0.5">
                Version {product.version} • Official Apex Syndicate Access Portal
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-6 p-1 bg-black/60 rounded-xl border border-white/10">
            <button
              onClick={() => {
                setActiveTab('request');
                setSubmittedRequest(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'request'
                  ? 'bg-[#FF6321] text-black shadow-[0_0_12px_rgba(255,99,33,0.4)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              NEW DOWNLOAD REQUEST
            </button>
            <button
              onClick={() => setActiveTab('lookup')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'lookup'
                  ? 'bg-[#FF6321] text-black shadow-[0_0_12px_rgba(255,99,33,0.4)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              CHECK REQUEST STATUS
            </button>
          </div>

          {/* Optional Web App Direct Launcher */}
          {product.externalUrl && (
            <div className="mt-4 p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="text-xs font-bold text-cyan-400 uppercase font-mono flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-cyan-400" /> LIVE WEB APPLICATION AVAILABLE
                </div>
                <p className="text-[11px] text-gray-300 font-mono mt-0.5">{product.externalUrl}</p>
              </div>
              <a
                href={product.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md"
              >
                <Globe className="w-3.5 h-3.5" /> LAUNCH NOW
              </a>
            </div>
          )}
        </div>

        {activeTab === 'request' && (
          <>
            {submittedRequest ? (
              renderStatusProgress(submittedRequest)
            ) : (
              <form onSubmit={handleSubmitRequest} className="space-y-6">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-400 uppercase font-mono font-bold">CURRENT PRICING TIER</div>
                    <div className="text-xl font-black text-white mt-0.5">{priceDisplay}</div>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-xl bg-[#FF6321]/20 border border-[#FF6321]/40 text-[#FF6321] text-xs font-bold uppercase">
                    {isFree ? 'FREE LAUNCH ACCESS' : 'COMMERCIAL LICENSE'}
                  </div>
                </div>

                {isFree ? (
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>
                        <strong>{product.name.toUpperCase()} IS CURRENTLY FREE!</strong> Complete the request form below or download directly.
                      </span>
                    </div>

                    {product.fileUrl && (
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/50 to-teal-950/50 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                        <div className="space-y-0.5">
                          <div className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                            <Download className="w-4 h-4 text-emerald-400" />
                            INSTANT FILE DOWNLOAD
                          </div>
                          <p className="text-[11px] text-gray-300">
                            Download the official package file directly to your system right now.
                          </p>
                        </div>
                        <a
                          href={`/api/download/direct/${product.id}`}
                          download
                          className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center gap-1.5 shrink-0"
                        >
                          <Download className="w-4 h-4" /> DOWNLOAD FILE NOW
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3 p-4 rounded-2xl bg-black/60 border border-white/10">
                    <div className="text-xs font-bold text-[#FF6321] uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 className="w-4 h-4" /> OWNER DIRECT PAYMENT DETAILS:
                    </div>

                    {paymentSettings ? (
                      <div className="space-y-2 text-xs text-gray-300">
                        <div className="flex justify-between border-b border-white/5 pb-1">
                          <span className="text-gray-500">Bank Name:</span>
                          <span className="font-bold text-white">{paymentSettings.bankName}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1">
                          <span className="text-gray-500">Account Name:</span>
                          <span className="font-bold text-white">{paymentSettings.accountName}</span>
                        </div>
                        <div className="flex justify-between items-center bg-[#FF6321]/10 p-2 rounded-lg border border-[#FF6321]/30">
                          <span className="text-gray-400">Account Number:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-[#FF6321]">
                              {paymentSettings.accountNumber}
                            </span>
                            <button
                              type="button"
                              onClick={handleCopyAccount}
                              className="p-1 rounded bg-[#FF6321]/20 hover:bg-[#FF6321]/30 text-[#FF6321] transition-colors"
                              title="Copy Account Number"
                            >
                              {copiedBank ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                        <p className="text-[11px] text-gray-400 italic pt-1">{paymentSettings.bankInstructions}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400">Payment details will be provided upon submission.</p>
                    )}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. John Okafor"
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 focus:border-[#FF6321] text-white text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="e.g. john@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 focus:border-[#FF6321] text-white text-sm focus:outline-none"
                    />
                  </div>

                  {!isFree && (
                    <div>
                      <label className="block text-xs font-bold text-[#FF6321] uppercase mb-1">
                        Bank Payment Reference / Transaction ID *
                      </label>
                      <input
                        type="text"
                        required={!isFree}
                        value={paymentProofRef}
                        onChange={(e) => setPaymentProofRef(e.target.value)}
                        placeholder="e.g. TXN-99820148 or Zenith Transfer Ref"
                        className="w-full px-4 py-3 rounded-xl bg-black/60 border border-[#FF6321]/40 focus:border-[#FF6321] text-white text-sm focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-[#FF6321] hover:bg-[#FF8A50] text-black font-extrabold text-xs tracking-widest uppercase shadow-[0_0_25px_rgba(255,99,33,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Submitting Download Request...'
                  ) : (
                    <>
                      SUBMIT DOWNLOAD REQUEST <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </>
        )}

        {activeTab === 'lookup' && (
          <div className="space-y-6">
            <form onSubmit={handleSearchRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                  Enter Request ID or Customer Email
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. APEX-REQ-849201 or john@example.com"
                    className="flex-1 px-4 py-3 rounded-xl bg-black/60 border border-white/10 focus:border-[#FF6321] text-white text-sm focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="px-6 py-3 rounded-xl bg-[#FF6321] text-black font-bold text-xs uppercase flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" /> {isSearching ? 'Searching...' : 'CHECK'}
                  </button>
                </div>
              </div>
            </form>

            {lookupError && (
              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs">
                {lookupError}
              </div>
            )}

            {lookupRequest && renderStatusProgress(lookupRequest)}
          </div>
        )}
      </div>
    </div>
  );
};
