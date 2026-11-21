import React from 'react';
import { ApexLogo } from './ApexLogo';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  openAdminModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const navigate = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#09090b] border-t border-white/[0.08] text-zinc-400 pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/[0.06]">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <ApexLogo size="sm" />
            <p className="text-sm text-zinc-300 leading-relaxed">
              Software built to create, edit, and innovate.
            </p>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Independent software and game studio building creative tools and open-world experiences.
            </p>
            <div className="text-xs font-mono text-[#FF5500]">
              apexsyndicate.com.ng
            </div>
          </div>

          {/* Software & Games */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Software & Games
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('apex-editor')}
                  className="hover:text-[#FF5500] transition-colors cursor-pointer"
                >
                  Apex Editor
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('naija-life')}
                  className="hover:text-[#FF5500] transition-colors cursor-pointer"
                >
                  Naija Life
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('gangster-revolution')}
                  className="hover:text-[#FF5500] transition-colors cursor-pointer"
                >
                  Gangster Revolution
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('products')}
                  className="hover:text-[#FF5500] transition-colors cursor-pointer"
                >
                  All Products
                </button>
              </li>
            </ul>
          </div>

          {/* Studio & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Studio
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('about')}
                  className="hover:text-[#FF5500] transition-colors cursor-pointer"
                >
                  About Apex Syndicate
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('contact')}
                  className="hover:text-[#FF5500] transition-colors cursor-pointer"
                >
                  Contact & Support
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('notifications')}
                  className="hover:text-[#FF5500] transition-colors cursor-pointer"
                >
                  Notifications & Requests
                </button>
              </li>
            </ul>
          </div>

          {/* Distribution */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Distribution
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every package distributed through Apex Syndicate is verified by SHA-256 checksums and protected with tokenized release access.
            </p>
            <p className="text-xs text-zinc-500">
              Support: apexsyndicategr@gmail.com
            </p>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            © {new Date().getFullYear()} Apex Syndicate. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span aria-hidden="true">·</span>
            <span>Terms of Service</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#FF5500] font-mono">apexsyndicate.com.ng</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
