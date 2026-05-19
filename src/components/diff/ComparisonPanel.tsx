import { forwardRef } from 'react';
import { TokenRenderer } from './TokenRenderer';
import type { DiffOp } from '../../lib/diff/types';
import { cn } from '../../lib/utils';

interface ComparisonPanelProps {
  title: string;
  latency: string;
  ops: DiffOp[];
  side: 'A' | 'B';
}

export const ComparisonPanel = forwardRef<HTMLDivElement, ComparisonPanelProps>(
  ({ title, latency, ops, side }, ref) => {
    return (
      <div className="flex h-full w-full flex-col rounded-xl border border-[#262626] bg-[#0A0A0A] overflow-hidden shadow-2xl relative">

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#262626] bg-[#121212]/95 px-5 py-3 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#EDEDED]/40 tracking-widest uppercase">
              Source {side}:
            </span>
            <span className="text-xs font-mono text-[#EDEDED] font-medium uppercase">
              {title}
            </span>
          </div>
          <div className="flex items-center rounded bg-[#262626]/50 px-2 py-1 border border-[#333]">
            <span className="text-[10px] font-mono text-[#EDEDED]/60 uppercase tracking-wider">
              Latency: {latency}
            </span>
          </div>
        </div>


        <div
          ref={ref}
          className={cn(
            "flex-1 overflow-y-auto p-6 custom-scrollbar scroll-smooth outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#6366F1]",

            side === 'A' ? "bg-linear-to-b from-red-500/2 to-transparent" : "bg-linear-to-b from-[#6366F1]/2 to-transparent"
          )}
          tabIndex={0}
          aria-label={`Diff Output for ${title}`}
        >
          <TokenRenderer ops={ops} side={side} />
        </div>
      </div>
    );
  }
);

ComparisonPanel.displayName = 'ComparisonPanel';
