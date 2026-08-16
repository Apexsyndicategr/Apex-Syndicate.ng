import React, { useState, useEffect } from 'react';
import { DownloadRequest } from '../types';
import { verifyRequestApi } from '../lib/api';
import {
  Bell,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  RefreshCw,
  Search,
  Sparkles,
  Gamepad,
  Terminal,
} from 'lucide-react';

interface CustomerNotificationsProps {
  onClose?: () => void;
}

export const CustomerNotifications: React.FC<CustomerNotificationsProps> = () => {
  const [requests, setRequests] = useState<DownloadRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncQuery, setSyncQuery] = useState('');
  const [syncMessage, setSyncMessage] = useState('');
  const [syncError, setSyncError] = useState('');

  // Load saved request IDs or email from localStorage
  const getSavedRequestIds = (): string[] => {
    try {
      const saved = localStorage.getItem('apex_customer_requests');
      if (saved) return JSON.parse(saved);
    } catch (e: any) {
      console.error(e?.message || 'Error loading requests from localStorage');
    }
    return [];
  };

  const saveRequestId = (reqId: string) => {
    try {
      const current = getSavedRequestIds();
      if (!current.includes(reqId)) {
        const updated = [reqId, ...current];
        localStorage.setItem('apex_customer_requests', JSON.stringify(updated));
      }
    } catch (e: any) {
      console.error(e?.message || 'Error saving request ID');
    }
  };

  const fetchLatestRequests = async () => {
    const savedIds = getSavedRequestIds();
    const savedEmail = localStorage.getItem('apex_customer_email') || '';

    if (savedIds.length === 0 && !savedEmail) {
      setRequests([]);
      return;
    }

    setLoading(true);
    try {
      const allResults: DownloadRequest[] = [];
      for (const id of savedIds) {
        const found = await verifyRequestApi(id);
        if (found && found.length > 0) {
          allResults.push(...found);
        }
      }
      if (savedEmail) {
        const found = await verifyRequestApi(savedEmail);
        if (found && found.length > 0) {
          found.forEach((r) => {
            if (!allResults.some((x) => x.id === r.id)) {
              allResults.push(r);
            }
          });
        }
      }

      setRequests(allResults);
    } catch (err) {
      console.error('Failed to sync customer requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestRequests();
    // Poll every 10 seconds for live updates when owner accepts
    const interval = setInterval(fetchLatestRequests, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleManualSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!syncQuery.trim()) return;

    setLoading(true);
    setSyncError('');
    setSyncMessage('');

    try {
      const results = await verifyRequestApi(syncQuery.trim());
      if (!results || results.length === 0) {
        throw new Error('No request found matching that ID or email.');
      }

      const data = results[0];
      saveRequestId(data.requestId);
      if (data.customerEmail) {
        localStorage.setItem('apex_customer_email', data.customerEmail);
      }

      setSyncMessage(`Found request ${data.requestId} for ${data.productName}!`);
      setSyncQuery('');
      await fetchLatestRequests();
    } catch (err: any) {
      setSyncError(err.message || 'Lookup failed.');
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = requests.filter(
    (r) => r.status === 'AWAITING_APPROVAL' || r.status === 'PAYMENT_SUBMITTED'
  ).length;
  const approvedCount = requests.filter((r) => r.status === 'APPROVED').length;

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      {/* Header Banner */}
      <div className="rounded-[32px] bg-gradient-to-r from-[#FF6321]/20 via-black to-black border border-[#FF6321]/30 p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Bell className="w-48 h-48 text-[#FF6321]" />
        </div>

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] text-xs font-mono font-bold uppercase tracking-widest">
            <Bell className="w-3.5 h-3.5 animate-bounce" /> LIVE REQUEST NOTIFICATIONS
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            MY APPLICATION <span className="text-[#FF6321]">NOTIFICATIONS</span>
          </h1>
          <p className="text-sm text-gray-300 max-w-2xl font-light leading-relaxed">
            Track your pending requests for <strong>Apex Editor</strong> and <strong>Gangster Revolution</strong>. Once the owner accepts your request, your status updates instantly to <strong>APPROVAL ACCEPTED</strong> with a direct PC download button!
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono">
            <div className="px-4 py-2 rounded-xl bg-black/60 border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF6321] animate-ping" />
              <span className="text-gray-400">PENDING APPROVAL:</span>
              <strong className="text-[#FF6321]">{pendingCount}</strong>
            </div>
            <div className="px-4 py-2 rounded-xl bg-black/60 border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-gray-400">APPROVAL ACCEPTED:</span>
              <strong className="text-emerald-400">{approvedCount}</strong>
            </div>
            <button
              onClick={fetchLatestRequests}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 flex items-center gap-2 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#FF6321]' : ''}`} />
              RECHECK STATUS
            </button>
          </div>
        </div>
      </div>

      {/* Sync / Add Request Form */}
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Search className="w-4 h-4 text-[#FF6321]" /> SYNC EXISTING REQUEST OR EMAIL
        </h3>
        <p className="text-xs text-gray-400">
          Already submitted a request on another device? Enter your Request ID (e.g. <code>APEX-REQ-849201</code>) or Email address below to link your notifications.
        </p>

        <form onSubmit={handleManualSync} className="flex flex-col sm:flex-row gap-3 pt-1">
          <input
            type="text"
            value={syncQuery}
            onChange={(e) => setSyncQuery(e.target.value)}
            placeholder="Enter Request ID or Email..."
            className="flex-1 px-4 py-3 rounded-xl bg-black/60 border border-white/10 focus:border-[#FF6321] text-white text-xs focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-[#FF6321] hover:bg-[#FF8A50] text-black font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" /> SYNC REQUEST
          </button>
        </form>

        {syncMessage && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs">
            {syncMessage}
          </div>
        )}
        {syncError && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
            {syncError}
          </div>
        )}
      </div>

      {/* Requests Notification Cards List */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-white uppercase tracking-wider">
          ACTIVE REQUEST NOTIFICATIONS ({requests.length})
        </h2>

        {requests.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white/[0.02] border border-white/10 text-center space-y-4">
            <div className="p-4 rounded-full bg-white/5 inline-block text-gray-500">
              <Bell className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-white">No Application Requests Found</h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              You haven't requested access to <strong>Apex Editor</strong> or <strong>Gangster Revolution</strong> yet. Request access from the Products tab to see your pending status here!
            </p>
          </div>
        ) : (
          requests.map((req) => {
            const isApproved = req.status === 'APPROVED';
            const isRejected = req.status === 'REJECTED';
            const isPending = !isApproved && !isRejected;

            return (
              <div
                key={req.id}
                className={`p-6 rounded-3xl border transition-all duration-300 relative ${
                  isApproved
                    ? 'bg-gradient-to-r from-emerald-950/40 via-black to-black border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)]'
                    : isRejected
                    ? 'bg-rose-950/20 border-rose-500/30'
                    : 'bg-white/[0.03] border-white/10 hover:border-[#FF6321]/40 shadow-xl'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Info Header */}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321]">
                        {req.productId === 'gangster-revolution' ? (
                          <Gamepad className="w-6 h-6" />
                        ) : (
                          <Terminal className="w-6 h-6" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-gray-400 font-bold uppercase">
                            REQUEST ID: <span className="text-[#FF6321]">{req.requestId}</span>
                          </span>
                          <span className="text-[10px] text-gray-500 font-mono">
                            • {new Date(req.requestDate).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-xl font-black text-white">
                          {req.productName} <span className="text-xs font-mono text-gray-400 font-normal">({req.productVersion})</span>
                        </h3>
                      </div>
                    </div>

                    {/* Status Message Banner */}
                    {isPending && (
                      <div className="p-4 rounded-2xl bg-[#FF6321]/10 border border-[#FF6321]/30 text-xs text-[#FF6321] flex items-start gap-3">
                        <Clock className="w-5 h-5 shrink-0 text-[#FF6321] animate-spin mt-0.5" />
                        <div>
                          <div className="font-bold text-sm text-white">REQUEST PENDING OWNER APPROVAL</div>
                          <p className="text-gray-300 mt-0.5">
                            Your request for <strong>{req.productName}</strong> is still pending approval in the owner's tab. Once the owner accepts it, this notification will switch to <strong>APPROVAL ACCEPTED</strong> and your PC download button will appear right here!
                          </p>
                        </div>
                      </div>
                    )}

                    {isApproved && (
                      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-xs text-emerald-300 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
                        <div>
                          <div className="font-bold text-sm text-white flex items-center gap-2">
                            APPROVAL ACCEPTED! <Sparkles className="w-4 h-4 text-emerald-400" />
                          </div>
                          <p className="text-emerald-200 mt-0.5">
                            Great news! The owner has accepted your request for <strong>{req.productName}</strong>. You can now download the official release package directly to your PC.
                          </p>
                        </div>
                      </div>
                    )}

                    {isRejected && (
                      <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                        <div>
                          <div className="font-bold text-sm text-white">REQUEST REJECTED</div>
                          <p className="text-rose-200 mt-0.5">
                            Reason: {req.rejectionReason || 'Payment could not be verified by owner.'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Action Button Area */}
                  <div className="shrink-0 flex flex-col items-end justify-center">
                    {isApproved && req.downloadToken ? (
                      <a
                        href={`/api/download/file/${req.downloadToken}`}
                        download
                        className="w-full md:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-widest shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:scale-105 transition-all flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" /> DOWNLOAD NOW
                      </a>
                    ) : isPending ? (
                      <div className="px-5 py-3 rounded-2xl bg-black/60 border border-[#FF6321]/30 text-[#FF6321] text-xs font-mono font-bold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#FF6321] animate-ping" />
                        AWAITING ACCEPTANCE
                      </div>
                    ) : (
                      <div className="px-5 py-3 rounded-2xl bg-black/60 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold">
                        ACCESS REJECTED
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
