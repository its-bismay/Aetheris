import React, { useEffect, useRef } from 'react';
import type { StreamState } from '../../lib/types';
import { AlertCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StreamingOutputProps {
  state: StreamState;
}

export function StreamingOutput({ state }: StreamingOutputProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { status, output, metrics, error } = state;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [output, status]);

  const renderFormattedOutput = (text: string) => {
    if (!text) return null;
    
    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const lang = lines[0]?.trim().match(/^[a-z0-9]+$/i) ? lines[0] : '';
        const code = lang ? lines.slice(1).join('\n') : lines.join('\n');

        return (
          <div key={index} className="my-4 overflow-hidden rounded-md border border-[#262626] bg-[#050505] shadow-lg">
            {lang && (
              <div className="flex items-center bg-[#121212] px-4 py-1.5 border-b border-[#262626]">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#EDEDED]/50">{lang}</span>
              </div>
            )}
            <pre className="p-4 overflow-x-auto text-sm text-[#EDEDED]/80 font-mono leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        );
      }
      
      return (
        <span key={index}>
          {part.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < part.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </span>
      );
    });
  };

  return (
    <div className="flex h-full flex-col bg-[#050505]" aria-label="Streaming Output Panel">
      

      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#262626] bg-[#0A0A0A]/90 px-6 py-3 backdrop-blur-md">
        <div className="flex gap-8">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] tracking-widest text-[#EDEDED]/40 uppercase">Tokens</span>
            <span className="font-mono text-sm font-medium text-[#EDEDED]">{metrics.tokenCount.toLocaleString()}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] tracking-widest text-[#EDEDED]/40 uppercase">Speed</span>
            <span className="font-mono text-sm font-medium text-[#EDEDED]">{metrics.tps} TPS</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] tracking-widest text-[#EDEDED]/40 uppercase">Latency</span>
            <span className="font-mono text-sm font-medium text-[#EDEDED]">{metrics.latency}ms</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            {status === 'streaming' && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6366F1] opacity-75"></span>
            )}
            <span className={cn(
              "relative inline-flex h-2 w-2 rounded-full",
              status === 'streaming' ? "bg-[#6366F1]" : 
              status === 'completed' ? "bg-emerald-500" :
              status === 'error' ? "bg-red-500" :
              status === 'interrupted' ? "bg-amber-500" :
              "bg-[#262626]"
            )}></span>
          </div>
          <span className="font-mono text-xs uppercase tracking-wider text-[#EDEDED]/70">
            {status}
          </span>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 custom-scrollbar"
        aria-live="polite"
        aria-atomic="false"
      >
        <div className="font-mono text-sm leading-relaxed text-[#EDEDED]/90 max-w-4xl">
          {output ? renderFormattedOutput(output) : (
             <span className="text-[#EDEDED]/30 italic">Waiting for input...</span>
          )}
          

          {status === 'streaming' && (
            <span className="inline-block h-4 w-2 bg-[#6366F1] animate-pulse align-middle ml-1" aria-hidden="true" />
          )}
        </div>

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-red-400" role="alert" aria-live="assertive">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="flex flex-col">
              <span className="font-semibold text-sm">Connection Interrupted</span>
              <span className="text-sm opacity-80">{error}</span>
              <span className="text-xs opacity-60 mt-1">Partial output preserved. Use the retry button to continue.</span>
            </div>
          </div>
        )}

        {status === 'interrupted' && !error && (
          <div className="mt-6 border-l-2 border-amber-500 pl-4 py-1 text-sm text-amber-500/80 font-mono italic">
            [Stream aborted by user]
          </div>
        )}
      </div>

    </div>
  );
}
