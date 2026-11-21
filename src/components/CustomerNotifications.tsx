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

      setSyncMessage(`Found request ${data.requestId} for ${data.productName}.`);
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
    <div className="space-y-8 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
      {/* Header */}
      <div className="rounded-2xl bg-[#111114] border border-white/[0.08] p-6 sm:p-8 space-y-5">
        <div className="space-y-2">
          <div className="text-xs font-mono text-[#FF5500] font-medium">
            Request Notifications
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            MY APPLICATION <span className="text-[#FF5500]">NOTIFICATIONS</span>
          </h1>
          <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Track pending requests for <strong>Apex Editor</strong> and <strong>Gangster Revolution</strong>. Once approved, your direct download button unlocks right here.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono">
          <div className="px-3.5 py-2 rounded-lg bg-[#09090b] border border-white/[0.08] text-zinc-400">
            Pending: <strong className="text-[#FF5500]">{pendingCount}</strong>
          </div>
          <div className="px-3.5 py-2 rounded-lg bg-[#09090b] border border-white/[0.08] text-zinc-400">
            Approved: <strong className="text-emerald-400">{approvedCount}</strong>
          </div>
          <button
            type="button"
            onClick={fetchLatestRequests}
            disabled={loading}
            className="px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 border border-white/[0.08] flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#FF5500]' : ''}`} />
            <span>Recheck Status</span>
          </button>
        </div>
      </div>

      {/* Sync Request Form */}
      <div className="p-6 rounded-2xl bg-[#111114] border border-white/[0.08] space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Search className="w-4 h-4 text-[#FF5500]" />
          <span>Sync Existing Request or Email</span>
        </h3>
        <p className="text-xs text-zinc-400">
          Submitted a request from another browser? Enter your Request ID (e.g. <code>APEX-REQ-849201</code>) or email address below.
        </p>

        <form onSubmit={handleManualSync} className="flex flex-col sm:flex-row gap-3 pt-1">
          <input
            type="text"
            value={syncQuery}
            onChange={(e) => setSyncQuery(e.target.value)}
            placeholder="Enter Request ID or Email..."
            className="flex-1 px-4 py-3 rounded-lg bg-[#09090b] border border-white/[0.1] focus:border-[#FF5500] text-white text-xs focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-[#FF5500] hover:bg-[#FF6E26] text-black font-semibold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Sync Request</span>
          </button>
        </form>

        {syncMessage && (
          <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs">
            {syncMessage}
          </div>
        )}
        {syncError && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
            {syncError}
          </div>
        )}
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-bold text-zinc-300 uppercase tracking-wider">
          Active Requests ({requests.length})
        </h2>

        {requests.length === 0 ? (
          <div className="p-12 rounded-2xl bg-[#111114] border border-white/[0.08] text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-white/[0.04] inline-flex items-center justify-center text-zinc-500">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">No Application Requests Found</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Request access to a product from the Products catalogue to track its verification status here.
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
                className={`p-6 rounded-2xl border transition-colors ${
                  isApproved
                    ? 'bg-[#111114] border-emerald-500/40'
                    : isRejected
                    ? 'bg-[#111114] border-rose-500/30'
                    : 'bg-[#111114] border-white/[0.08]'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/25 text-[#FF5500]">
                        {req.productId === 'gangster-revolution' ? (
                          <Gamepad className="w-5 h-5" />
                        ) : (
                          <Terminal className="w-5 h-5" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                          <span>
                            ID: <strong className="text-[#FF5500]">{req.requestId}</strong>
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{new Date(req.requestDate).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-lg font-bold text-white">
                          {req.productName}{' '}
                          <span className="text-xs font-mono text-zinc-400 font-normal">
                            ({req.productVersion})
                          </span>
                        </h3>
                      </div>
                    </div>

                    {isPending && (
                      <div className="p-4 rounded-xl bg-[#09090b] border border-[#FF5500]/25 text-xs text-zinc-300 flex items-start gap-3">
                        <Clock className="w-4 h-4 shrink-0 text-[#FF5500] mt-0.5" />
                        <div>
                          <div className="font-semibold text-white">Pending Owner Approval</div>
                          <p className="text-zinc-400 mt-0.5">
                            Your request for <strong>{req.productName}</strong> is awaiting verification. Once accepted, your download link appears here.
                          </p>
                        </div>
                      </div>
                    )}

                    {isApproved && (
                      <div className="p-4 rounded-xl bg-emerald-950/25 border border-emerald-500/30 text-xs text-emerald-200 flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                        <div>
                          <div className="font-semibold text-white">Approval Accepted</div>
                          <p className="text-emerald-200/80 mt-0.5">
                            Your request for <strong>{req.productName}</strong> is approved and ready to download.
                          </p>
                        </div>
                      </div>
                    )}

                    {isRejected && (
                      <div className="p-4 rounded-xl bg-rose-950/25 border border-rose-500/30 text-xs text-rose-200 flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                        <div>
                          <div className="font-semibold text-white">Request Rejected</div>
                          <p className="text-rose-200/80 mt-0.5">
                            Reason: {req.rejectionReason || 'Payment could not be verified.'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="shrink-0">
                    {isApproved && req.downloadToken ? (
                      <a
                        href={`/api/download/file/${req.downloadToken}`}
                        download
                        className="px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Now</span>
                      </a>
                    ) : isPending ? (
                      <div className="px-4 py-2.5 rounded-lg bg-[#09090b] border border-white/[0.08] text-[#FF5500] text-xs font-mono font-semibold">
                        Awaiting Acceptance
                      </div>
                    ) : (
                      <div className="px-4 py-2.5 rounded-lg bg-[#09090b] border border-rose-500/30 text-rose-400 text-xs font-mono font-semibold">
                        Access Rejected
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
