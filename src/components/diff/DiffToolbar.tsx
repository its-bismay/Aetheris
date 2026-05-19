import { ArrowRightLeft, Sparkles, MessageSquare, Loader2 } from 'lucide-react';

interface DiffToolbarProps {
  prompt: string;
  setPrompt: (v: string) => void;
  modelA: string;
  setModelA: (v: string) => void;
  modelB: string;
  setModelB: (v: string) => void;
  onSwap: () => void;
  onRunDiff: () => void;
  isStreaming?: boolean;
}

const MODELS = ['gemini-3.1-flash-lite', 'gemini-3-flash-preview', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'];

export function DiffToolbar({
  prompt, setPrompt, modelA, setModelA, modelB, setModelB, onSwap, onRunDiff, isStreaming
}: DiffToolbarProps) {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-4 w-full rounded-xl border border-[#262626] bg-[#0A0A0A] p-4 shadow-lg relative overflow-hidden">

      <div className="flex-1 w-full relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#EDEDED]/40 group-focus-within:text-[#6366F1] transition-colors">
          <MessageSquare className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter prompt to generate comparison..."
          className="w-full bg-[#121212] border border-[#262626] rounded-md py-2.5 pl-10 pr-4 text-sm text-[#EDEDED] placeholder-[#EDEDED]/30 outline-none focus:border-[#464554] focus:ring-1 focus:ring-[#464554] transition-all"
          aria-label="Comparison prompt"
        />
      </div>


      <div className="flex items-center gap-3 w-full lg:w-auto">
        <select
          value={modelA}
          onChange={(e) => setModelA(e.target.value)}
          className="bg-[#121212] border border-[#262626] rounded-md py-2.5 px-3 text-sm font-mono text-[#EDEDED] outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] transition-colors flex-1 lg:w-40 appearance-none cursor-pointer"
          aria-label="Select Model A"
        >
          {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        <button
          onClick={onSwap}
          className="p-2 rounded-md border border-[#262626] bg-[#121212] text-[#EDEDED]/60 hover:text-[#EDEDED] hover:bg-[#1A1A1A] transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
          title="Swap Models"
        >
          <ArrowRightLeft className="h-4 w-4" />
        </button>

        <select
          value={modelB}
          onChange={(e) => setModelB(e.target.value)}
          className="bg-[#121212] border border-[#262626] rounded-md py-2.5 px-3 text-sm font-mono text-[#EDEDED] outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] transition-colors flex-1 lg:w-40 appearance-none cursor-pointer"
          aria-label="Select Model B"
        >
          {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>


      <button
        onClick={onRunDiff}
        disabled={isStreaming}
        className="w-full lg:w-auto flex items-center justify-center gap-2 rounded-md bg-[#6366F1]/20 border border-[#6366F1]/50 px-6 py-2.5 text-sm font-semibold text-[#818CF8] transition-all hover:bg-[#6366F1]/30 outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        {isStreaming ? 'Streaming...' : 'Run Diff'}
      </button>
    </div>
  );
}
