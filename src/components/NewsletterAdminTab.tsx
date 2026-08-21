import React, { useState, useEffect, useRef } from 'react';
import {
  Mail,
  Send,
  Sparkles,
  Users,
  Search,
  CheckCircle2,
  Lock,
  Key,
  Upload,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  Clock,
  Eye,
  Laptop,
  Smartphone,
  Check,
  AlertCircle,
  Wand2,
  FileText,
  Crown,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { NewsletterSubscriber, NewsletterBroadcast } from '../types';
import {
  getNewsletterSubscribersApi,
  getNewsletterBroadcastsApi,
  sendNewsletterBroadcastApi,
  generateAiNewsletterApi,
} from '../lib/api';

interface NewsletterAdminTabProps {
  token: string;
  showToast: (msg: string) => void;
}

export const NewsletterAdminTab: React.FC<NewsletterAdminTabProps> = ({ token, showToast }) => {
  // Subscribers and broadcast history
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [broadcasts, setBroadcasts] = useState<NewsletterBroadcast[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'gmail' | 'guests'>('all');

  // AI Helper Security Lock (password: apexsyndicate.com.ng)
  const [isAiUnlocked, setIsAiUnlocked] = useState(false);
  const [aiPasswordInput, setAiPasswordInput] = useState('');
  const [aiPasswordError, setAiPasswordError] = useState(false);

  // AI Campaign Generation state
  const [aiPrompt, setAiPrompt] = useState('');
  const [campaignTopic, setCampaignTopic] = useState('Apex Editor Update');
  const [campaignTone, setCampaignTone] = useState('Exciting & High-Tech');
  const [campaignImage, setCampaignImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Active Draft to send
  const [subject, setSubject] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [textContent, setTextContent] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  // Preview Mode
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [subsRes, bcastsRes] = await Promise.all([
        getNewsletterSubscribersApi(token).catch(() => ({ subscribers: [], count: 0 })),
        getNewsletterBroadcastsApi(token).catch(() => ({ broadcasts: [] })),
      ]);
      setSubscribers(subsRes.subscribers || []);
      setBroadcasts(bcastsRes.broadcasts || []);
    } catch (err: any) {
      console.warn('Failed to load newsletter data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUnlockAiHelper = (e: React.FormEvent) => {
    e.preventDefault();
    if (aiPasswordInput.trim() === 'apexsyndicate.com.ng') {
      setIsAiUnlocked(true);
      setAiPasswordError(false);
      setAiPasswordInput('');
      showToast('Apex AI Newsletter Helper unlocked!');
    } else {
      setAiPasswordError(true);
      showToast('Incorrect AI password! (apexsyndicate.com.ng)');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      showToast('Image size exceeds 4MB. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      setCampaignImage(res);
      setAttachedImage(res);
      showToast('Image attached to newsletter draft!');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateCampaign = async () => {
    if (!aiPrompt.trim()) {
      showToast('Please provide instructions for the AI on what to write in the email.');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await generateAiNewsletterApi({
        prompt: aiPrompt.trim(),
        topic: campaignTopic,
        tone: campaignTone,
        imageUrl: campaignImage || undefined,
        aiPassword: 'apexsyndicate.com.ng',
      });

      if (res.campaign) {
        setSubject(res.campaign.subject || 'Apex Syndicate Dev Update');
        setPreviewText(res.campaign.previewText || '');
        setHtmlContent(res.campaign.htmlContent || '');
        setTextContent(res.campaign.textContent || '');
        if (campaignImage) setAttachedImage(campaignImage);
        showToast('AI Newsletter Draft Generated Successfully!');
      }
    } catch (err: any) {
      showToast('AI generation failed: ' + (err.message || 'Error'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !htmlContent.trim()) {
      showToast('Please provide a subject line and email body before sending.');
      return;
    }

    if (subscribers.length === 0) {
      showToast('No active subscribers to dispatch to.');
      return;
    }

    const confirmSend = window.confirm(
      `Send this broadcast email to all ${subscribers.length} newsletter subscribers?`
    );
    if (!confirmSend) return;

    setIsSending(true);
    try {
      await sendNewsletterBroadcastApi(
        {
          subject: subject.trim(),
          previewText: previewText.trim() || undefined,
          htmlContent: htmlContent.trim(),
          textContent: textContent.trim() || undefined,
          imageUrl: attachedImage || undefined,
          author: 'Apex Syndicate Owner',
        },
        token
      );

      showToast(`⚡ Email campaign broadcasted to ${subscribers.length} subscribers!`);
      // Reset form
      setSubject('');
      setPreviewText('');
      setHtmlContent('');
      setTextContent('');
      setAttachedImage(null);
      setCampaignImage(null);
      setAiPrompt('');
      fetchData();
    } catch (err: any) {
      showToast('Failed to dispatch broadcast: ' + (err.message || 'Error'));
    } finally {
      setIsSending(false);
    }
  };

  const filteredSubscribers = subscribers.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      s.email.toLowerCase().includes(q) ||
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.device && s.device.toLowerCase().includes(q));

    if (!matchSearch) return false;
    if (filterType === 'gmail') return s.email.toLowerCase().includes('@gmail.com');
    if (filterType === 'guests') return !s.userId;
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-gradient-to-r from-[#FF6321]/15 via-black to-amber-950/20 border border-[#FF6321]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#FF6321] text-black font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 shadow">
              <Mail className="w-3.5 h-3.5" /> NEWSLETTER & DISPATCH HQ
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
              {subscribers.length} ACTIVE SUBSCRIBERS
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider">
            NEWSLETTER SUBSCRIBERS & APEX AI MAILER
          </h2>
          <p className="text-xs text-gray-300 max-w-2xl font-mono leading-relaxed">
            Manage your audience who opted in for updates. Use the dedicated <strong>Apex AI Mailer Assistant</strong> to draft, format, attach pictures, and broadcast emails directly to their inboxes.
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loadingData}
          className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider border border-white/10 flex items-center gap-2 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-black/60 border border-amber-500/30 space-y-1">
          <div className="text-[10px] text-amber-400 uppercase font-mono font-bold flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> TOTAL AUDIENCE OPT-INS
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {subscribers.length}
          </div>
          <div className="text-[10px] text-gray-500 font-mono">Subscribers receiving dev alerts</div>
        </div>

        <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-1">
          <div className="text-[10px] text-gray-400 uppercase font-mono font-bold flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#FF6321]" /> GMAIL SUBSCRIBERS
          </div>
          <div className="text-3xl font-black text-[#FF6321] font-mono">
            {subscribers.filter((s) => s.email.toLowerCase().includes('@gmail.com')).length}
          </div>
          <div className="text-[10px] text-gray-500 font-mono">Verified Google/Gmail addresses</div>
        </div>

        <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-1">
          <div className="text-[10px] text-gray-400 uppercase font-mono font-bold flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5 text-emerald-400" /> BROADCAST CAMPAIGNS SENT
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">
            {broadcasts.length}
          </div>
          <div className="text-[10px] text-gray-500 font-mono">Delivered via Apex AI Dispatcher</div>
        </div>
      </div>

      {/* ========================================================
          SECTION 1: APEX AI NEWSLETTER HELPER (PASSWORD PROTECTED)
         ======================================================== */}
      <div className="rounded-[32px] bg-white/[0.02] border border-[#FF6321]/30 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FF6321]/20 border border-[#FF6321]/40 text-[#FF6321] flex items-center justify-center shadow-[0_0_20px_rgba(255,99,33,0.3)] shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white uppercase tracking-wider">
                  APEX AI EMAIL BROADCAST HELPER
                </h3>
                {isAiUnlocked && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono font-bold">
                    UNLOCKED
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 font-mono">
                Smart Gemini AI email generator — creates persuasive newsletters with photos & formatting.
              </p>
            </div>
          </div>

          {isAiUnlocked && (
            <button
              onClick={() => {
                setIsAiUnlocked(false);
                showToast('AI Newsletter Helper locked.');
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-bold font-mono uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" /> Lock AI
            </button>
          )}
        </div>

        {/* LOCKED STATE */}
        {!isAiUnlocked ? (
          <div className="py-10 max-w-md mx-auto text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-white/[0.04] border border-white/15 text-[#FF6321] flex items-center justify-center mx-auto shadow-lg">
              <Lock className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h4 className="text-base font-black text-white uppercase tracking-wider">
                AI Helper Security Protected
              </h4>
              <p className="text-xs text-gray-400 font-mono mt-1">
                Enter your syndicate master password (<strong>apexsyndicate.com.ng</strong>) to authorize AI mail broadcasts.
              </p>
            </div>

            <form onSubmit={handleUnlockAiHelper} className="space-y-3">
              <input
                type="password"
                value={aiPasswordInput}
                onChange={(e) => setAiPasswordInput(e.target.value)}
                placeholder="Enter password (apexsyndicate.com.ng)..."
                className={`w-full bg-black/80 border ${
                  aiPasswordError ? 'border-rose-500' : 'border-white/15 focus:border-[#FF6321]'
                } rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none text-center font-mono`}
                autoFocus
              />
              {aiPasswordError && (
                <p className="text-[11px] text-rose-400 font-bold font-mono">
                  Incorrect password! Use apexsyndicate.com.ng
                </p>
              )}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#FF6321] hover:bg-[#FF8A50] text-black font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(255,99,33,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Key className="w-4 h-4" />
                <span>UNLOCK AI MAILER</span>
              </button>
            </form>
          </div>
        ) : (
          /* UNLOCKED AI MAILER INTERFACE */
          <div className="space-y-6">
            {/* Step 1: AI Prompt & Configuration */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1 font-mono">
                    Instructions for AI Newsletter Writer:
                  </label>
                  <textarea
                    rows={4}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Tell the AI what to write. E.g.: 'Write an exciting announcement to our subscribers that Apex Editor 2.0 beta is launching with 4K texture support, free 14-day access, and invite them to download the demo.'"
                    className="w-full p-4 rounded-2xl bg-black/70 border border-white/10 focus:border-[#FF6321] text-white text-xs leading-relaxed focus:outline-none placeholder:text-gray-600 font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1 font-mono">
                      Campaign Category:
                    </label>
                    <select
                      value={campaignTopic}
                      onChange={(e) => setCampaignTopic(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-mono focus:border-[#FF6321] focus:outline-none"
                    >
                      <option value="Apex Editor Update">Apex Editor Launch & Patches</option>
                      <option value="Gangster Revolution Dev Log">Gangster Revolution Dev Log</option>
                      <option value="Demo Drop & Beta Access">Demo Drop & Beta Access</option>
                      <option value="Special Discount & Perks">Special Discount & VIP Perks</option>
                      <option value="General Syndicate Intel">General Syndicate Intel</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1 font-mono">
                      Tone of Voice:
                    </label>
                    <select
                      value={campaignTone}
                      onChange={(e) => setCampaignTone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-mono focus:border-[#FF6321] focus:outline-none"
                    >
                      <option value="Exciting & High-Tech">Exciting & High-Tech</option>
                      <option value="Cyberpunk & Boss Syndicate">Cyberpunk & Boss Syndicate</option>
                      <option value="Professional & Clean">Professional & Clean</option>
                      <option value="Urgent Drop / Limited Time">Urgent Drop / Limited Time</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Picture Upload Area */}
              <div className="space-y-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-gray-300 uppercase font-mono flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#FF6321]" /> Attach Picture:
                    </label>
                    {campaignImage && (
                      <button
                        type="button"
                        onClick={() => {
                          setCampaignImage(null);
                          setAttachedImage(null);
                        }}
                        className="text-[10px] text-rose-400 hover:underline font-mono"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-400 font-mono leading-relaxed mb-3">
                    Upload a picture (game screenshot, software UI, or banner) to embed into the email.
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {campaignImage ? (
                    <div className="relative rounded-xl overflow-hidden border border-[#FF6321]/50 group">
                      <img
                        src={campaignImage}
                        alt="Newsletter Attachment"
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg bg-[#FF6321] text-black text-xs font-bold uppercase"
                        >
                          Change Picture
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-32 rounded-xl border-2 border-dashed border-white/15 hover:border-[#FF6321]/60 bg-black/40 hover:bg-[#FF6321]/5 transition-all flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-white cursor-pointer"
                    >
                      <Upload className="w-6 h-6 text-[#FF6321]" />
                      <span className="text-xs font-mono font-bold">Click to Upload Picture</span>
                      <span className="text-[10px] text-gray-500 font-mono">PNG, JPG, WebP up to 4MB</span>
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleGenerateCampaign}
                  disabled={isGenerating}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-[#FF6321] to-orange-600 text-black font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,99,33,0.4)] flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] disabled:opacity-50"
                >
                  <Wand2 className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>{isGenerating ? 'AI IS COMPOSING EMAIL...' : 'GENERATE AI CAMPAIGN'}</span>
                </button>
              </div>
            </div>

            {/* Step 2: Campaign Draft & Live Dispatch */}
            {(subject || htmlContent) && (
              <form onSubmit={handleSendBroadcast} className="p-6 rounded-2xl bg-black/80 border border-white/15 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#FF6321] text-black text-[10px] font-black uppercase">
                      DRAFT READY
                    </span>
                    <h4 className="text-sm font-black text-white uppercase tracking-wider">
                      Review & Dispatch Campaign
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewMode(previewMode === 'edit' ? 'preview' : 'edit')}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-gray-300 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#FF6321]" />
                      <span>{previewMode === 'edit' ? 'Live HTML Preview' : 'Edit Code / Text'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1 font-mono">
                      Email Subject Line:
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Subject line..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white text-xs font-mono focus:border-[#FF6321] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1 font-mono">
                      Inbox Preview Snippet:
                    </label>
                    <input
                      type="text"
                      value={previewText}
                      onChange={(e) => setPreviewText(e.target.value)}
                      placeholder="Short inbox preview snippet..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white text-xs font-mono focus:border-[#FF6321] focus:outline-none"
                    />
                  </div>
                </div>

                {previewMode === 'edit' ? (
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1 font-mono">
                      Email Body Content (HTML & Text):
                    </label>
                    <textarea
                      rows={6}
                      value={htmlContent}
                      onChange={(e) => setHtmlContent(e.target.value)}
                      placeholder="HTML / Text content..."
                      className="w-full p-4 rounded-xl bg-black border border-white/10 text-gray-200 text-xs font-mono focus:border-[#FF6321] focus:outline-none"
                    />
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-white text-gray-900 shadow-inner">
                    <div className="max-w-md mx-auto space-y-4">
                      {attachedImage && (
                        <img
                          src={attachedImage}
                          alt="Email Header"
                          className="w-full rounded-xl object-cover max-h-48 shadow"
                        />
                      )}
                      <div
                        className="prose prose-sm max-w-none text-xs"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-[11px] text-gray-400 font-mono">
                    Target: <strong className="text-white">{subscribers.length} Subscribers</strong>
                  </span>

                  <button
                    type="submit"
                    disabled={isSending || subscribers.length === 0}
                    className="px-6 py-3 rounded-xl bg-[#FF6321] hover:bg-[#FF8A50] text-black font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,99,33,0.4)] flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSending ? 'SENDING BROADCAST...' : `DISPATCH EMAIL TO ${subscribers.length} SUBSCRIBERS`}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {/* ========================================================
          SECTION 2: SUBSCRIBERS DIRECTORY & LIST
         ======================================================== */}
      <div className="rounded-[32px] bg-white/[0.02] border border-white/10 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/10 bg-black/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-[#FF6321]" /> SUBSCRIBER DIRECTORY ({subscribers.length})
            </h3>
            <p className="text-xs text-gray-400 font-mono">
              List of all users and site visitors who opted into newsletters and updates.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search email, name, device..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-mono focus:border-[#FF6321] focus:outline-none"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5">
              {[
                { id: 'all', label: 'ALL' },
                { id: 'gmail', label: 'GMAIL' },
                { id: 'guests', label: 'GUEST' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold font-mono uppercase transition-all cursor-pointer ${
                    filterType === tab.id
                      ? 'bg-[#FF6321] text-black font-black'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredSubscribers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Mail className="w-12 h-12 text-gray-600 mx-auto" />
            <p className="text-sm font-mono text-gray-400">No subscribers found matching query.</p>
            <p className="text-xs text-gray-600 font-mono">
              When users register on the site and check the newsletter box, they will populate here instantly.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-black/80 text-gray-500 uppercase font-mono text-[10px] border-b border-white/5">
                <tr>
                  <th className="p-4">Subscriber Identity</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Device & Platform</th>
                  <th className="p-4">Subscribed Date</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {filteredSubscribers.map((sub) => {
                  const isMobile = sub.device?.toLowerCase().includes('mobile') || sub.device?.toLowerCase().includes('iphone') || sub.device?.toLowerCase().includes('android');
                  return (
                    <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={sub.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + sub.email}
                            alt={sub.name || 'User'}
                            className="w-8 h-8 rounded-xl object-cover border border-white/10"
                          />
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{sub.name || sub.email.split('@')[0]}</span>
                              {sub.userId && (
                                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[8px]">
                                  ACCOUNT
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-gray-500">Source: {sub.source || 'Sign-Up Opt-in'}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="text-white font-semibold flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-amber-400" />
                          {sub.email}
                        </span>
                      </td>

                      <td className="p-4 text-gray-400">
                        <div className="flex items-center gap-1.5">
                          {isMobile ? <Smartphone className="w-3.5 h-3.5 text-blue-400" /> : <Laptop className="w-3.5 h-3.5 text-amber-400" />}
                          <span className="truncate max-w-[150px]">{sub.device || 'Web Browser'}</span>
                        </div>
                      </td>

                      <td className="p-4 text-gray-400">
                        {new Date(sub.subscribedAt).toLocaleDateString()}
                      </td>

                      <td className="p-4 text-right">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold uppercase">
                          ACTIVE OPT-IN
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================
          SECTION 3: BROADCAST HISTORY & ARCHIVES
         ======================================================== */}
      {broadcasts.length > 0 && (
        <div className="rounded-[32px] bg-white/[0.02] border border-white/10 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" /> BROADCAST HISTORY ARCHIVE ({broadcasts.length})
            </h3>
            <span className="text-[10px] text-gray-500 font-mono">Dispatched emails log</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {broadcasts.map((bcast) => (
              <div key={bcast.id} className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
                  <span>{new Date(bcast.sentAt).toLocaleString()}</span>
                  <span className="text-emerald-400 font-bold">{bcast.recipientsCount ?? bcast.recipientCount ?? bcast.recipientEmails?.length ?? 0} Recipients</span>
                </div>
                <h4 className="text-xs font-black text-white truncate">{bcast.subject}</h4>
                {bcast.previewText && (
                  <p className="text-[11px] text-gray-400 line-clamp-2 font-mono">{bcast.previewText}</p>
                )}
                {bcast.imageUrl && (
                  <img
                    src={bcast.imageUrl}
                    alt={bcast.subject}
                    className="w-full h-24 object-cover rounded-xl mt-2 border border-white/10"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
