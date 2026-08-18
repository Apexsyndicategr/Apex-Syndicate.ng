import React, { useState } from 'react';
import { Product, OwnerSettings } from '../types';
import {
  Terminal,
  Play,
  ExternalLink,
  Sparkles,
  Zap,
  Code2,
  Cpu,
  Layers,
  CheckCircle2,
  AlertCircle,
  Shield,
  ArrowRight,
  Monitor,
  Laptop,
} from 'lucide-react';

interface ApexEditorDemoProps {
  product: Product | null;
  settings?: OwnerSettings;
  openDownloadModal?: (product: Product) => void;
}

export const ApexEditorDemo: React.FC<ApexEditorDemoProps> = ({
  product,
  settings,
  openDownloadModal,
}) => {
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);

  const demoUrl = (settings?.apexEditorDemoUrl || '').trim();
  const isDemoAvailable = Boolean(demoUrl);

  const handleUseDemo = () => {
    if (isDemoAvailable) {
      if (demoUrl.startsWith('http://') || demoUrl.startsWith('https://')) {
        window.open(demoUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.open(`https://${demoUrl}`, '_blank', 'noopener,noreferrer');
      }
    } else {
      setShowUnavailableModal(true);
    }
  };

  return (
    <div className="space-y-16 pb-24 animate-fadeIn">
      {/* ==========================================
          HERO BANNER & DEMO CALL-TO-ACTION
         ========================================== */}
      <section className="relative pt-12 pb-16 overflow-hidden border-b border-white/10">
        {/* Cinematic Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[500px] bg-[#FF6321]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-400 text-xs font-mono font-bold uppercase tracking-widest shadow-lg">
            <Play className="w-4 h-4 text-amber-400 fill-current animate-pulse" />
            <span>APEX EDITOR DEMO SANDBOX • {isDemoAvailable ? 'DEMO ENVIRONMENT READY' : 'DEMO UNAVAILABLE'}</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white uppercase tracking-tight leading-none">
              APEX EDITOR <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-[#FF6321] to-orange-500">DEMO</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 font-light max-w-3xl leading-relaxed">
              Experience the blazing speed, intelligent AST transformations, and zero-latency terminal workspaces of Apex Editor directly in your browser.
            </p>
          </div>

          {/* Action Button Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <button
              onClick={handleUseDemo}
              className="relative group px-10 py-5 rounded-2xl bg-gradient-to-r from-amber-500 via-[#FF6321] to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-black text-sm uppercase tracking-widest shadow-[0_10px_35px_rgba(255,99,33,0.4)] transition-all transform hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>USE DEMO</span>
              <ExternalLink className="w-4 h-4 opacity-75 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl">
              <span className="text-xs font-mono text-gray-400 uppercase">DEMO STATUS:</span>
              {isDemoAvailable ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  ONLINE & READY
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-mono font-bold border border-rose-500/40">
                  <AlertCircle className="w-3.5 h-3.5" />
                  DEMO UNAVAILABLE
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          INTERACTIVE DEMO PREVIEW CARD
         ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[28px] md:rounded-[32px] bg-black/60 backdrop-blur-2xl border border-amber-500/30 p-6 md:p-10 shadow-2xl space-y-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-widest">
                <Terminal className="w-4 h-4" />
                <span>INTERACTIVE WORKSPACE PREVIEW</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wide">
                Apex Code Engine & Live Terminal Sandbox
              </h2>
            </div>

            <button
              onClick={handleUseDemo}
              className="px-6 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>LAUNCH CLOUD DEMO</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* IDE Simulation Shell */}
          <div className="rounded-2xl bg-[#0d1117] border border-white/10 overflow-hidden shadow-2xl font-mono text-xs">
            {/* Window Title Bar */}
            <div className="px-4 py-3 bg-[#161b22] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="text-gray-400 text-[11px] ml-2">ApexEditorDemo — workspace.ts</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] border border-amber-500/40">
                  SANDBOX v1.0
                </span>
              </div>
            </div>

            {/* Code Body */}
            <div className="p-6 text-gray-300 space-y-2 leading-relaxed overflow-x-auto">
              <p className="text-gray-500">// Apex Editor Ultra-Fast Compilation & AST Engine</p>
              <p>
                <span className="text-purple-400">import</span> &#123; <span className="text-amber-300">ApexCompiler</span>, <span className="text-amber-300">FastAST</span> &#125; <span className="text-purple-400">from</span> <span className="text-emerald-300">'@apex/core'</span>;
              </p>
              <p>&nbsp;</p>
              <p>
                <span className="text-blue-400">export async function</span> <span className="text-yellow-300">initApexDemo</span>() &#123;
              </p>
              <p className="pl-4">
                <span className="text-blue-400">const</span> engine = <span className="text-purple-400">new</span> <span className="text-amber-300">ApexCompiler</span>(&#123; mode: <span className="text-emerald-300">'instant-hot-swap'</span>, threads: <span className="text-orange-400">16</span> &#125;);
              </p>
              <p className="pl-4">
                <span className="text-gray-500">// Zero-latency parse sequence</span>
              </p>
              <p className="pl-4">
                <span className="text-blue-400">const</span> ast = <span className="text-purple-400">await</span> engine.<span className="text-yellow-300">parseWorkspace</span>(&#123; telemetry: <span className="text-orange-400">true</span> &#125;);
              </p>
              <p className="pl-4">
                console.<span className="text-yellow-300">log</span>(<span className="text-emerald-300">`🚀 Apex Editor active with $&#123;ast.nodeCount&#125; AST nodes in 1.4ms!`</span>);
              </p>
              <p className="pl-4">
                <span className="text-purple-400">return</span> engine.<span className="text-yellow-300">launchInteractiveShell</span>();
              </p>
              <p>&#125;</p>
            </div>

            {/* Bottom Status Bar */}
            <div className="px-4 py-2 bg-[#161b22] border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  TypeScript 5.4.2
                </span>
                <span>UTF-8</span>
                <span>LF</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleUseDemo}
                  className="px-3 py-1 rounded bg-[#FF6321] text-black font-bold text-[10px] uppercase hover:bg-orange-400 transition-colors"
                >
                  USE DEMO LINK
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          DEMO FEATURES & CAPABILITIES
         ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-4 hover:border-amber-500/40 transition-colors">
            <div className="p-3 w-fit rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Sub-Millisecond Engine</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Experience typing and file indexing speeds designed to eliminate input lag completely.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-4 hover:border-orange-500/40 transition-colors">
            <div className="p-3 w-fit rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Zero Setup Sandbox</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              No local installation or terminal drivers needed. Launch instantly via the interactive link.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-4 hover:border-amber-500/40 transition-colors">
            <div className="p-3 w-fit rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Enterprise Sandbox</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Secure memory containment allowing you to test complex scripts and plugins without risk.
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================
          DEMO UNAVAILABLE MODAL
         ========================================== */}
      {showUnavailableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg p-8 rounded-3xl bg-[#0e0e10] border border-amber-500/40 shadow-[0_0_50px_rgba(255,99,33,0.3)] space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-wide">
                  DEMO UNAVAILABLE
                </h3>
                <span className="text-xs font-mono text-gray-400">APEX EDITOR SANDBOX NOTICE</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-sm text-gray-300 space-y-3 leading-relaxed">
              <p>
                The live interactive demo link is currently not configured or is undergoing maintenance.
              </p>
              <p className="text-xs font-mono text-amber-400">
                The platform owner can set and update the live demo URL anytime in the <span className="font-bold underline">Owners Portal</span>.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowUnavailableModal(false)}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
