import React, { useState } from 'react';
import { submitContactApi } from '../lib/api';
import {
  Mail,
  Send,
  Building2,
  Globe,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await submitContactApi({
        name,
        email,
        category: (subject as any) || 'General Question',
        message,
      });
      setIsSent(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error transmitting message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 pb-24">
      {/* Header Banner */}
      <section className="pt-12 pb-10 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="text-xs font-mono text-[#FF5500] font-medium">
            Direct Communications
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            CONTACT <span className="text-[#FF5500]">APEX SYNDICATE</span>
          </h1>
          <p className="text-base text-zinc-400 max-w-2xl leading-relaxed">
            Questions about software licenses, bulk team seats, or technical support? Send a direct message to our studio team.
          </p>
        </div>
      </section>

      {/* Form & Contact Details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 rounded-2xl bg-[#111114] border border-white/[0.08] p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">Send a Message</h2>

            {isSent ? (
              <div className="p-8 rounded-xl bg-[#09090b] border border-[#FF5500]/30 text-center space-y-4">
                <CheckCircle2 className="w-10 h-10 text-[#FF5500] mx-auto" />
                <h3 className="text-lg font-bold text-white">Message Sent</h3>
                <p className="text-sm text-zinc-400 max-w-md mx-auto">
                  Your message has been routed to{' '}
                  <strong className="text-[#FF5500]">apexsyndicategr@gmail.com</strong>. Our team will reply directly to{' '}
                  <strong className="text-white">{email}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSent(false)}
                  className="px-5 py-2.5 rounded-lg bg-[#FF5500] hover:bg-[#FF6E26] text-black font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono text-zinc-400 uppercase">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full px-4 py-3 rounded-lg bg-[#09090b] border border-white/[0.1] focus:border-[#FF5500] text-white text-sm focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono text-zinc-400 uppercase">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. alex@example.com"
                      className="w-full px-4 py-3 rounded-lg bg-[#09090b] border border-white/[0.1] focus:border-[#FF5500] text-white text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-zinc-400 uppercase">
                    Subject / Inquiry Type *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Software License Verification"
                    className="w-full px-4 py-3 rounded-lg bg-[#09090b] border border-white/[0.1] focus:border-[#FF5500] text-white text-sm focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-zinc-400 uppercase">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your request or technical inquiry..."
                    className="w-full px-4 py-3 rounded-lg bg-[#09090b] border border-white/[0.1] focus:border-[#FF5500] text-white text-sm focus:outline-none"
                  />
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-lg bg-[#FF5500] hover:bg-[#FF6E26] text-black font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-[#111114] border border-white/[0.08] p-6 sm:p-8 space-y-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/[0.08] pb-3">
                <Building2 className="w-4 h-4 text-[#FF5500]" />
                <span>Studio Contact</span>
              </h3>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-[#09090b] border border-white/[0.06] space-y-1">
                  <div className="text-zinc-500 font-mono flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#FF5500]" />
                    <span>Official Email</span>
                  </div>
                  <div className="font-semibold text-white text-sm">
                    apexsyndicategr@gmail.com
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#09090b] border border-white/[0.06] space-y-1">
                  <div className="text-zinc-500 font-mono flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#FF5500]" />
                    <span>Official Domain</span>
                  </div>
                  <div className="font-mono font-semibold text-[#FF5500] text-sm">
                    apexsyndicate.com.ng
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#09090b] border border-white/[0.06] space-y-1">
                  <div className="text-zinc-500 font-mono flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#FF5500]" />
                    <span>Support Hours</span>
                  </div>
                  <div className="font-semibold text-white text-sm">
                    Monday – Saturday · 08:00 – 18:00 WAT
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
