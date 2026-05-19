import { useState, useEffect, useRef } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { DiffToolbar } from '../components/diff/DiffToolbar';
import { ComparisonPanel } from '../components/diff/ComparisonPanel';
import { AlgorithmAccordion } from '../components/diff/AlgorithmAccordion';
import { MetricsCards } from '../components/diff/MetricsCards';
import { tokenize } from '../lib/diff/tokenizer';
import { wfDiff } from '../lib/diff/wagner-fischer';
import { calculateStats, calculateMetrics } from '../lib/diff/metrics';
import type { DiffOp, DiffMetricsResult } from '../lib/diff/types';
import { useStream } from '../hooks/useStream';

export default function DiffView() {
  const [prompt, setPrompt] = useState('Explain what React is in two simple paragraphs.');
  const [modelA, setModelA] = useState('gemini-3.1-flash-lite');
  const [modelB, setModelB] = useState('gemini-2.5-flash');
  const [lockScroll, setLockScroll] = useState(true);
  
  const streamA = useStream();
  const streamB = useStream();

  const [ops, setOps] = useState<DiffOp[]>([]);
  const [metrics, setMetrics] = useState<DiffMetricsResult>({
    similarityIndex: "0%", tokenDrift: "+0/-0", editDistance: "0", confidenceScore: "0.00"
  });

  const panelARef = useRef<HTMLDivElement>(null);
  const panelBRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const elA = panelARef.current;
    const elB = panelBRef.current;
    if (!elA || !elB || !lockScroll) return;

    let isSyncingA = false;
    let isSyncingB = false;

    const onScrollA = () => {
      if (!isSyncingA) {
        isSyncingB = true;
        elB.scrollTop = elA.scrollTop;
      }
      isSyncingA = false;
    };

    const onScrollB = () => {
      if (!isSyncingB) {
        isSyncingA = true;
        elA.scrollTop = elB.scrollTop;
      }
      isSyncingB = false;
    };

    elA.addEventListener('scroll', onScrollA);
    elB.addEventListener('scroll', onScrollB);

    return () => {
      elA.removeEventListener('scroll', onScrollA);
      elB.removeEventListener('scroll', onScrollB);
    };
  }, [lockScroll, ops]);

 
  useEffect(() => {

    if (!streamA.state.output && !streamB.state.output) {
      setOps([]);
      return;
    }
    

    const tokensA = tokenize(streamA.state.output);
    const tokensB = tokenize(streamB.state.output);

    const diffOps = wfDiff(tokensA, tokensB);
    const stats = calculateStats(diffOps);
    const computedMetrics = calculateMetrics(stats);

    setOps(diffOps);
    setMetrics(computedMetrics);
  }, [streamA.state.output, streamB.state.output]);

  const handleRunDiff = () => {
    if (!prompt.trim()) return;
    streamA.startStream(prompt, modelA);
    streamB.startStream(prompt, modelB);
  };

  const handleSwap = () => {
    setModelA(modelB);
    setModelB(modelA);
    

  };

  const isStreaming = streamA.state.status === 'streaming' || streamB.state.status === 'streaming';

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-[#050505] overflow-y-auto">
      <div className="max-w-[1600px] mx-auto px-6 py-12 space-y-8">
        

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#EDEDED] mb-3">Model Comparison</h1>
            <p className="text-[#EDEDED]/60 text-sm max-w-2xl leading-relaxed">
              Compare token outputs between models in real-time. Highlights indicate semantic drifts, syntactic differences, and structural changes.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#0A0A0A] border border-[#262626] rounded-md p-1.5 self-start shrink-0">

            <div className="flex items-center gap-3 px-3 border-r border-[#262626]" aria-label="Diff Legend">
              <span className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-[#EDEDED]/70 uppercase">
                <span className="w-2.5 h-2.5 rounded-full bg-[#818CF8]" aria-hidden="true" /> 
                <span className="sr-only">Token </span>Added
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-[#EDEDED]/70 uppercase">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" aria-hidden="true" /> 
                <span className="sr-only">Token </span>Removed
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-[#EDEDED]/70 uppercase">
                <span className="w-2.5 h-1 bg-amber-500/50 block rounded-sm border-b border-amber-500 border-dotted" aria-hidden="true" /> 
                <span className="sr-only">Token </span>Modified
              </span>
            </div>
            

            <button
              onClick={() => setLockScroll(!lockScroll)}
              aria-pressed={lockScroll}
              className="flex items-center gap-2 px-3 py-1.5 rounded text-[10px] font-mono tracking-widest uppercase transition-colors hover:bg-[#1A1A1A] text-[#EDEDED]/70 outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
            >
              {lockScroll ? <Lock className="w-3.5 h-3.5" aria-hidden="true" /> : <Unlock className="w-3.5 h-3.5" aria-hidden="true" />}
              {lockScroll ? 'Lock Scroll' : 'Unlock Scroll'}
            </button>
          </div>
        </div>


        <DiffToolbar
          prompt={prompt}
          setPrompt={setPrompt}
          modelA={modelA}
          setModelA={setModelA}
          modelB={modelB}
          setModelB={setModelB}
          onSwap={handleSwap}
          onRunDiff={handleRunDiff}
          isStreaming={isStreaming}
        />


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
          <ComparisonPanel 
            ref={panelARef}
            title={modelA} 
            latency={`${streamA.state.metrics.latency}MS`} 
            ops={ops} 
            side="A" 
          />
          <ComparisonPanel 
            ref={panelBRef}
            title={modelB} 
            latency={`${streamB.state.metrics.latency}MS`} 
            ops={ops} 
            side="B" 
          />
        </div>


        <MetricsCards metrics={metrics} />
        <AlgorithmAccordion />

      </div>
    </div>
  );
}
