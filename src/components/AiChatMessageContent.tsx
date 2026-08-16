import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { Copy, Check, Terminal } from 'lucide-react';

interface AiChatMessageContentProps {
  content: string;
}

export const AiChatMessageContent: React.FC<AiChatMessageContentProps> = ({ content }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="text-xs leading-relaxed space-y-2 prose-invert text-gray-200 max-w-none">
      <Markdown
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
          strong: ({ children }) => <strong className="font-black text-[#FF6321]">{children}</strong>,
          ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 my-2 text-gray-300">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 my-2 text-gray-300">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          h1: ({ children }) => <h1 className="text-base font-black text-white mt-3 mb-1">{children}</h1>,
          h2: ({ children }) => <h2 className="text-sm font-black text-white mt-2 mb-1">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xs font-black text-amber-300 mt-2 mb-1">{children}</h3>,
          code: ({ className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match && typeof children === 'string' && !children.includes('\n');
            const codeString = String(children).replace(/\n$/, '');

            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded bg-black/60 border border-white/10 font-mono text-[#FF6321] text-[11px]"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            const codeIndex = Math.floor(Math.random() * 100000);

            return (
              <div className="my-3 rounded-xl overflow-hidden border border-white/15 bg-[#0a0a0c] shadow-lg">
                <div className="flex items-center justify-between px-3 py-1.5 bg-black/80 border-b border-white/10 text-[10px] font-mono text-gray-400">
                  <div className="flex items-center gap-1.5 text-gray-300">
                    <Terminal className="w-3.5 h-3.5 text-[#FF6321]" />
                    <span className="uppercase font-bold tracking-wider">{match ? match[1] : 'CODE'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(codeString, codeIndex)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 hover:bg-[#FF6321]/20 hover:text-white transition-colors text-[10px]"
                  >
                    {copiedIndex === codeIndex ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-gray-300" />
                        <span>COPY CODE</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3 overflow-x-auto font-mono text-[11px] leading-5 text-emerald-300 bg-[#0d0d12]/90">
                  <pre className="m-0 whitespace-pre">{codeString}</pre>
                </div>
              </div>
            );
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  );
};
