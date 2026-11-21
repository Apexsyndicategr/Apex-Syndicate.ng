import React from 'react';
import { PortfolioVideoShowcase } from '../components/PortfolioVideoShowcase';
import {
  ShieldCheck,
  Building2,
  Zap,
  Award,
  ExternalLink,
  Youtube,
  Instagram,
} from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="space-y-20 pb-24">
      {/* Header Banner */}
      <section className="pt-12 pb-10 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="text-xs font-mono text-[#FF5500] font-medium">
            Studio Profile
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            ABOUT <span className="text-[#FF5500]">APEX SYNDICATE</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
            An independent software and game engineering studio delivering native tools, web experiences, and open-world games.
          </p>
        </div>
      </section>

      {/* Engineering Mission + Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-5">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Our Engineering Mission
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Founded with an uncompromising focus on responsiveness, clean architecture, and user privacy, Apex Syndicate builds creative software tools and games engineered to run cleanly without unnecessary overhead.
            </p>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Operating through our official portal{' '}
              <code className="text-[#FF5500] font-mono font-semibold">apexsyndicate.com.ng</code>, we oversee every release from binary integrity checks to direct customer support.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#111114] border border-white/[0.08]">
                <div className="text-lg font-bold font-mono text-[#FF5500]">Official</div>
                <div className="text-xs text-zinc-400 mt-0.5">Independent Software Studio</div>
              </div>
              <div className="p-4 rounded-xl bg-[#111114] border border-white/[0.08]">
                <div className="text-lg font-bold font-mono text-white">Direct</div>
                <div className="text-xs text-zinc-400 mt-0.5">Owner-Managed Verification</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 sm:p-7 rounded-2xl bg-[#111114] border border-white/[0.08] space-y-5">
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/[0.08] pb-3">
              <Building2 className="w-4 h-4 text-[#FF5500]" />
              <span>Syndicate Directory</span>
            </h3>

            <div className="space-y-3 text-xs font-mono">
              {[
                ['Brand Name', 'Apex Syndicate', false],
                ['Founder & Architect', 'Okere Chiemeka', true],
                ['Official Portal', 'apexsyndicate.com.ng', true],
                ['Flagship Utility', 'Apex Editor', false],
                ['Playable Game Demo', 'Naija Life (Early Access)', false],
                ['Support Email', 'apexsyndicategr@gmail.com', false],
              ].map(([label, value, accent]) => (
                <div
                  key={String(label)}
                  className="flex justify-between gap-4 border-b border-white/[0.05] pb-2.5 last:border-none last:pb-0"
                >
                  <span className="text-zinc-500">{label}</span>
                  <span className={accent ? 'font-semibold text-[#FF5500]' : 'font-semibold text-white'}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Studio Updates Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PortfolioVideoShowcase />
      </section>

      {/* Official Social Channels */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div className="space-y-1">
            <div className="text-xs font-mono text-[#FF5500] font-medium">
              Community Channels
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Connect With Apex Syndicate
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md">
            Follow our official channels for development previews, demo drops, and announcements.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <a
            href="https://www.tiktok.com/@apex.syndicateng"
            target="_blank"
            rel="noreferrer"
            className="group p-5 rounded-xl bg-[#111114] border border-white/[0.08] hover:border-[#FF5500]/50 transition-colors flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-[#FF5500]/10 border border-[#FF5500]/25 text-[#FF5500] flex items-center justify-center">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64c.29 0 .56.04.82.11V9.33a6.33 6.33 0 00-1-.08 6.34 6.34 0 106.34 6.34V8.33a8.28 8.28 0 004.95 1.81V6.69z" />
                </svg>
              </div>
              <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-zinc-500 uppercase">TikTok</div>
              <div className="text-sm font-mono font-bold text-white group-hover:text-[#FF5500] transition-colors mt-0.5">
                @apex.syndicateng
              </div>
            </div>
          </a>

          <a
            href="https://www.snapchat.com/add/apexsyndicategr"
            target="_blank"
            rel="noreferrer"
            className="group p-5 rounded-xl bg-[#111114] border border-white/[0.08] hover:border-[#FF5500]/50 transition-colors flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-[#FF5500]/10 border border-[#FF5500]/25 text-[#FF5500] flex items-center justify-center">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.04 2c-3.42 0-5.68 2.35-5.68 5.21 0 1.22.42 2.38 1.1 3.25-.15.42-.58 1.56-1.68 1.8-.25.05-.39.24-.37.47.03.26.25.45.56.45 1.28 0 2.12-.48 2.53-.9.78.42 1.7.65 2.66.65.96 0 1.88-.23 2.66-.65.41.42 1.25.9 2.53.9.31 0 .53-.19.56-.45.02-.23-.12-.42-.37-.47-1.1-.24-1.53-1.38-1.68-1.8.68-.87 1.1-2.03 1.1-3.25 0-2.86-2.26-5.21-5.68-5.21z" />
                </svg>
              </div>
              <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-zinc-500 uppercase">Snapchat</div>
              <div className="text-sm font-mono font-bold text-white group-hover:text-[#FF5500] transition-colors mt-0.5">
                apexsyndicategr
              </div>
            </div>
          </a>

          <a
            href="https://www.youtube.com/@ApexSyndicategr"
            target="_blank"
            rel="noreferrer"
            className="group p-5 rounded-xl bg-[#111114] border border-white/[0.08] hover:border-[#FF5500]/50 transition-colors flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-[#FF5500]/10 border border-[#FF5500]/25 text-[#FF5500] flex items-center justify-center">
                <Youtube className="w-4 h-4" />
              </div>
              <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-zinc-500 uppercase">YouTube</div>
              <div className="text-sm font-mono font-bold text-white group-hover:text-[#FF5500] transition-colors mt-0.5">
                @ApexSyndicategr
              </div>
            </div>
          </a>

          <a
            href="https://www.instagram.com/apexsyndicateng"
            target="_blank"
            rel="noreferrer"
            className="group p-5 rounded-xl bg-[#111114] border border-white/[0.08] hover:border-[#FF5500]/50 transition-colors flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-[#FF5500]/10 border border-[#FF5500]/25 text-[#FF5500] flex items-center justify-center">
                <Instagram className="w-4 h-4" />
              </div>
              <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-zinc-500 uppercase">Instagram</div>
              <div className="text-sm font-mono font-bold text-white group-hover:text-[#FF5500] transition-colors mt-0.5">
                @apexsyndicateng
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.08] pt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              num: '01.',
              title: 'Uncompromising Speed',
              desc: 'We reject bloatware and heavy runtime wrappers. Every system is tuned for low memory overhead and fast response.',
              icon: Zap,
            },
            {
              num: '02.',
              title: 'Verified Security',
              desc: 'Release packages are built from clean repositories and distributed with checksum verification and tokenized access.',
              icon: ShieldCheck,
            },
            {
              num: '03.',
              title: 'Customer-First Access',
              desc: 'Transparent bank transfer verification and license support handled directly by the Apex Syndicate team.',
              icon: Award,
            },
          ].map((val) => (
            <div key={val.num} className="space-y-2.5">
              <div className="text-xs font-mono text-[#FF5500] font-semibold">{val.num}</div>
              <h3 className="text-base font-bold text-white">{val.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
