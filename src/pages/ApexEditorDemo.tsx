import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Product, OwnerSettings } from '../types';
import {
  Terminal,
  Play,
  ExternalLink,
  Zap,
  Code2,
  Shield,
  ArrowRight,
  Laptop,
  Smartphone,
  Copy,
  Check,
  X,
  ChevronRight,
  Maximize2,
  AlertCircle,
} from 'lucide-react';

interface ApexEditorDemoProps {
  product: Product | null;
  settings?: OwnerSettings;
  openDownloadModal?: (product: Product) => void;
}

function checkIsMobileOrTablet(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  const ua = (navigator.userAgent || navigator.vendor || (window as any).opera || '').toLowerCase();
  const mobileKeywords = [
    'android',
    'webos',
    'iphone',
    'ipad',
    'ipod',
    'blackberry',
    'iemobile',
    'opera mini',
    'mobile',
    'tablet',
    'silk',
    'kindle',
    'fennec',
    'windows phone',
    'samsungbrowser',
  ];
  const hasMobileUA = mobileKeywords.some((keyword) => ua.includes(keyword));
  const isIpadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  const isTouchDevice = navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
  const isSmallScreen = window.innerWidth < 1024;
  return hasMobileUA || isIpadOS || (isTouchDevice && isSmallScreen);
}

export const ApexEditorDemo: React.FC<ApexEditorDemoProps> = ({ settings }) => {
  const [showPausedWarningModal, setShowPausedWarningModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const [showDeviceUnsupportedModal, setShowDeviceUnsupportedModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const demoUrl =
    (settings?.apexEditorDemoUrl || 'https://apex-editor-demo.vercel.app/').trim() ||
    'https://apex-editor-demo.vercel.app/';
  const formattedUrl =
    demoUrl.startsWith('http://') || demoUrl.startsWith('https://') ? demoUrl : `https://${demoUrl}`;
  const isDemoAvailable = Boolean(formattedUrl);

  useEffect(() => {
    if (showPausedWarningModal || showConfirmModal || showUnavailableModal || showDeviceUnsupportedModal) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' || e.code === 'Escape' || e.keyCode === 27) {
          setShowPausedWarningModal(false);
          setShowConfirmModal(false);
          setShowUnavailableModal(false);
          setShowDeviceUnsupportedModal(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [showPausedWarningModal, showConfirmModal, showUnavailableModal, showDeviceUnsupportedModal]);

  const handleOpenDemoPrompt = () => {
    setShowPausedWarningModal(true);
  };

  const handleProceedFromWarning = () => {
    setShowPausedWarningModal(false);
    setShowConfirmModal(true);
  };

  const handleProceedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (checkIsMobileOrTablet()) {
      setShowConfirmModal(false);
      setShowDeviceUnsupportedModal(true);
      return;
    }

    setShowConfirmModal(false);
    const fullscreenDemoUrl = `${window.location.origin}/?demo=fullscreen`;
    try {
      const newTab = window.open(fullscreenDemoUrl, '_blank', 'noopener,noreferrer');
      if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
        window.location.href = fullscreenDemoUrl;
      }
    } catch {
      window.location.href = fullscreenDemoUrl;
    }
  };

  const handleCopyDemoLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(formattedUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="space-y-16 pb-24">
      {/* Header */}
      <section className="pt-12 pb-10 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-xs font-mono text-zinc-400 flex flex-wrap items-center gap-2">
            <span className="text-[#FF5500] font-semibold">Apex Editor Sandbox</span>
            <span aria-hidden="true">·</span>
            <span>{isDemoAvailable ? 'Online & Ready' : 'Unavailable'}</span>
          </div>

          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.04]">
              APEX EDITOR <span className="text-[#FF5500]">DEMO</span>
            </h1>
            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
              Test the responsive canvas timeline, AST editing engine, and interactive workspace of Apex Editor directly in your desktop browser.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleOpenDemoPrompt}
              className="px-8 py-3.5 rounded-lg bg-[#FF5500] hover:bg-[#FF6E26] text-black font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Launch Web Demo</span>
              <ExternalLink className="w-4 h-4" />
            </button>

            <div className="px-5 py-3.5 rounded-lg bg-[#111114] border border-white/[0.08] font-mono text-xs text-zinc-300 flex items-center justify-center gap-2">
              <span className="text-zinc-500">Status:</span>
              <span className={isDemoAvailable ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                {isDemoAvailable ? 'Online (PC / Laptop Recommended)' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Preview Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#111114] border border-white/[0.08] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-[#FF5500] font-semibold">
                <Terminal className="w-4 h-4" />
                <span>Interactive Workspace Preview</span>
              </div>
              <h2 className="text-2xl font-bold text-white">
                Apex Engine &amp; Live Terminal Sandbox
              </h2>
            </div>

            <button
              type="button"
              onClick={handleOpenDemoPrompt}
              className="px-5 py-2.5 rounded-lg bg-[#FF5500] hover:bg-[#FF6E26] text-black font-semibold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer w-fit"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Open Sandbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="rounded-xl bg-[#09090b] border border-white/[0.08] overflow-hidden font-mono text-xs">
            <div className="px-4 py-3 bg-[#141418] border-b border-white/[0.08] flex items-center justify-between text-zinc-400">
              <span>ApexEditorDemo — workspace.ts</span>
              <span className="text-[#FF5500]">Sandbox v1.0</span>
            </div>

            <pre className="p-6 text-zinc-300 overflow-x-auto leading-relaxed">
{`// Apex Editor Compilation & AST Engine
import { ApexCompiler, FastAST } from '@apex/core';

export async function initApexDemo() {
  const engine = new ApexCompiler({ mode: 'instant-hot-swap', threads: 16 });
  const ast = await engine.parseWorkspace({ telemetry: false });
  console.log(\`Apex Editor active with \${ast.nodeCount} AST nodes in 1.4ms\`);
  return engine.launchInteractiveShell();
}`}
            </pre>

            <div className="px-4 py-2.5 bg-[#141418] border-t border-white/[0.08] flex items-center justify-between text-[11px] text-zinc-400">
              <span>TypeScript · UTF-8 · LF</span>
              <button
                type="button"
                onClick={handleOpenDemoPrompt}
                className="text-[#FF5500] hover:underline font-semibold cursor-pointer"
              >
                Open Interactive Link
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#111114] border border-white/[0.08] space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#FF5500]/10 border border-[#FF5500]/25 text-[#FF5500] flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Sub-Millisecond Engine</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Typing and file indexing tuned to eliminate input latency across large workspaces.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111114] border border-white/[0.08] space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#FF5500]/10 border border-[#FF5500]/25 text-[#FF5500] flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Zero Setup Sandbox</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              No local installers required. Evaluate the editor interface directly in your browser.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111114] border border-white/[0.08] space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#FF5500]/10 border border-[#FF5500]/25 text-[#FF5500] flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Contained Execution</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Safe browser memory containment to explore project layouts and timeline controls.
            </p>
          </div>
        </div>
      </section>

      {/* Step 1: Production Paused Warning Modal */}
      {showPausedWarningModal &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowPausedWarningModal(false);
            }}
          >
            <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-[#111114] border border-white/[0.12] shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
              <button
                type="button"
                onClick={() => setShowPausedWarningModal(false)}
                className="absolute top-5 right-5 p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 pr-8">
                <div className="w-10 h-10 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/30 text-[#FF5500] flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Production Paused</h3>
                  <span className="text-xs font-mono text-[#FF5500]">Official Apex Editor Notice</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#09090b] border border-[#FF5500]/30 space-y-2">
                <p className="text-sm font-semibold text-white">
                  Production of Apex Editor has been paused by the Apex Editor team.
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Active updates and desktop builds are currently on pause, while the interactive web demo remains online for preview and testing.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShowPausedWarningModal(false)}
                  className="py-3 px-4 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200 font-medium text-xs border border-white/[0.08] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleProceedFromWarning}
                  className="py-3 px-4 rounded-lg bg-[#FF5500] hover:bg-[#FF6E26] text-black font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Step 2: Confirm Fullscreen Launch */}
      {showConfirmModal &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowConfirmModal(false);
            }}
          >
            <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-[#111114] border border-white/[0.12] shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="absolute top-5 right-5 p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 pr-8">
                <div className="w-10 h-10 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/30 text-[#FF5500] flex items-center justify-center shrink-0">
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Launch Web Demo?</h3>
                  <span className="text-xs font-mono text-zinc-400">Fullscreen Preview Mode</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#09090b] border border-white/[0.08] space-y-2 text-xs text-zinc-300 leading-relaxed">
                <div className="flex items-center gap-2 text-[#FF5500] font-mono font-semibold">
                  <Maximize2 className="w-4 h-4" />
                  <span>Automatic Fullscreen Display</span>
                </div>
                <p>
                  The demo opens in fullscreen mode so the canvas, timeline tracks, and toolbars fit cleanly. Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">ESC</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">F11</kbd> anytime to exit.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="py-3 px-4 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200 font-medium text-xs border border-white/[0.08] transition-colors cursor-pointer"
                >
                  No, Cancel
                </button>
                <button
                  type="button"
                  onClick={handleProceedClick}
                  className="py-3 px-4 rounded-lg bg-[#FF5500] hover:bg-[#FF6E26] text-black font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Yes, Launch</span>
                </button>
              </div>

              <div className="pt-2 border-t border-white/[0.06] text-center text-[11px] text-zinc-500 font-mono">
                Direct Link:{' '}
                <a
                  href={formattedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (checkIsMobileOrTablet()) {
                      e.preventDefault();
                      setShowConfirmModal(false);
                      setShowDeviceUnsupportedModal(true);
                    } else {
                      setShowConfirmModal(false);
                    }
                  }}
                  className="text-[#FF5500] hover:underline inline-flex items-center gap-1"
                >
                  <span>{formattedUrl}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Device Unsupported Modal */}
      {showDeviceUnsupportedModal &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowDeviceUnsupportedModal(false);
            }}
          >
            <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-[#111114] border border-white/[0.12] shadow-2xl space-y-5">
              <button
                type="button"
                onClick={() => setShowDeviceUnsupportedModal(false)}
                className="absolute top-5 right-5 p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 pr-8">
                <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Desktop Required</h3>
                  <span className="text-xs font-mono text-rose-400">PC / Laptop Recommended</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#09090b] border border-white/[0.08] space-y-2 text-xs text-zinc-300 leading-relaxed">
                <p className="font-semibold text-white">
                  Apex Editor Demo requires a laptop or desktop screen.
                </p>
                <p className="text-zinc-400">
                  Multi-panel workspaces and timeline shortcuts are built specifically for desktop browsers.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-[#09090b] border border-rose-500/30 space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile &amp; Tablet</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">Not supported</p>
                </div>
                <div className="p-3 rounded-lg bg-[#09090b] border border-emerald-500/30 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <Laptop className="w-3.5 h-3.5" />
                    <span>Laptop &amp; PC</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">Full demo supported</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleCopyDemoLink}
                  className="w-full py-3 px-4 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-white font-medium text-xs border border-white/[0.08] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">Link Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-zinc-400" />
                      <span>Copy Demo Link for PC</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowDeviceUnsupportedModal(false)}
                  className="w-full py-3 px-4 rounded-lg bg-[#FF5500] hover:bg-[#FF6E26] text-black font-semibold text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Unavailable Modal */}
      {showUnavailableModal &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowUnavailableModal(false);
            }}
          >
            <div className="relative w-full max-w-md p-6 rounded-2xl bg-[#111114] border border-white/[0.12] space-y-4">
              <h3 className="text-lg font-bold text-white">Demo Unavailable</h3>
              <p className="text-sm text-zinc-400">
                The live demo environment is currently undergoing maintenance.
              </p>
              <button
                type="button"
                onClick={() => setShowUnavailableModal(false)}
                className="w-full py-2.5 rounded-lg bg-[#FF5500] text-black font-semibold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
