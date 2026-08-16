import React, { useState } from 'react';
import { submitContactApi } from '../lib/api';
import {
  Mail,
  Send,
  Building2,
  Globe,
  Clock,
  CheckCircle2,
  Sparkles,
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
    <div className="space-y-16 pb-20">
      {/* Header Banner */}
      <section className="relative pt-12 pb-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] text-xs font-mono font-bold uppercase tracking-widest">
            DIRECT OWNER COMMUNICATIONS
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight">
            CONTACT <span className="text-[#FF6321]">APEX SYNDICATE</span>
          </h1>
          <p className="text-base text-gray-400 max-w-2xl font-light">
            Have questions about software licenses, corporate bulk seats, or technical support? Reach out to our syndicate team.
          </p>
        </div>
      </section>

      {/* Main Glass Form & Info Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Panel */}
          <div className="lg:col-span-7 rounded-[28px] bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 shadow-2xl space-y-6">
            <h2 className="text-2xl font-bold text-white uppercase tracking-wide">
              SEND A TRANSMISSION
            </h2>

            {isSent ? (
              <div className="p-8 rounded-2xl bg-[#FF6321]/10 border border-[#FF6321]/30 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#FF6321] mx-auto animate-bounce" />
                <h3 className="text-xl font-bold text-white">Transmission Sent Successfully!</h3>
                <p className="text-xs text-gray-300">
                  Your message details have been dispatched to <strong className="text-[#FF6321]">apexsyndicategr@gmail.com</strong>. The owner team will review your message and reply directly to <strong className="text-white">{email}</strong>.
                </p>
                <button
                  onClick={() => setIsSent(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#FF6321] text-black font-bold text-xs uppercase mt-2"
                >
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-[#FF6321] text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. alex@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-[#FF6321] text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                    Subject / Inquiry Type *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Software License Verification inquiry"
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-[#FF6321] text-white text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your request or technical inquiry in detail..."
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-[#FF6321] text-white text-xs focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-[#FF6321] hover:bg-[#FF8A50] text-black font-extrabold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(255,99,33,0.35)] transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> TRANSMIT MESSAGE
                </button>
              </form>
            )}
          </div>

          {/* Contact Details Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-[28px] bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 shadow-2xl space-y-6">
              <h3 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#FF6321]" /> SYNDICATE CONTACT
              </h3>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                  <div className="text-gray-500 font-mono flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#FF6321]" /> OFFICIAL EMAIL
                  </div>
                  <div className="font-bold text-white text-sm">apexsyndicategr@gmail.com</div>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                  <div className="text-gray-500 font-mono flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#FF6321]" /> OFFICIAL DOMAIN
                  </div>
                  <div className="font-mono font-bold text-[#FF6321] text-sm">apexsyndicate.com.ng</div>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                  <div className="text-gray-500 font-mono flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#FF6321]" /> SUPPORT HOURS
                  </div>
                  <div className="font-bold text-white">Monday – Saturday: 08:00 – 18:00 WAT</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
