import type { DiffOp } from '../../lib/diff/types';
import { cn } from '../../lib/utils';

interface TokenRendererProps {
  ops: DiffOp[];
  side: 'A' | 'B';
}

export function TokenRenderer({ ops, side }: TokenRendererProps) {
  return (
    <div className="font-mono text-[13px] leading-relaxed text-[#EDEDED] whitespace-pre-wrap word-break-all">
      {ops.map((op, index) => {

        if (side === 'A' && op.op === 'ins') return null;
        if (side === 'B' && op.op === 'del') return null;

        let content = '';
        let className = '';

        if (op.op === 'eq') {
          content = side === 'A' ? op.a : op.b;
          className = 'text-[#EDEDED]/80';
        } else if (op.op === 'del' && side === 'A') {
          content = op.a;
          className = 'bg-red-500/20 text-red-400 decoration-red-500/50 line-through decoration-1';
        } else if (op.op === 'ins' && side === 'B') {
          content = op.b;
          className = 'bg-[#6366F1]/20 text-[#818CF8] font-medium border-b border-[#6366F1]/50';
        } else if (op.op === 'sub') {
          if (side === 'A') {
            content = op.a;
            className = 'bg-red-500/10 text-red-400 decoration-red-500/30 line-through decoration-1';
          } else {
            content = op.b;
     
            className = 'bg-amber-500/20 text-amber-300 font-medium border-b border-amber-500/50 underline decoration-amber-500 decoration-dotted underline-offset-4';
          }
        }


        if (content === '\n') {
          return <br key={index} />;
        }

        return (
          <span key={index} className={cn("inline transition-colors rounded-sm px-px", className)}>
            {content}
          </span>
        );
      })}
    </div>
  );
}
