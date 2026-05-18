import { BarChart2 } from 'lucide-react';

interface AccordionItem {
  id: string;
  title: string;
  subtitle: string;
  content: React.ReactNode;
}

const INSIGHTS: AccordionItem[] = [
  {
    id: "time",
    title: "TIME COMPLEXITY",
    subtitle: "Wagner-Fischer Algorithm Analysis",
    content: (
      <div className="space-y-4 text-sm text-[#EDEDED]/70 leading-relaxed">
        <p>
          The current implementation utilizes a highly optimized dynamic programming matrix (Wagner-Fischer) 
          with a time complexity of <code className="bg-[#6366F1]/20 text-[#818CF8] px-1.5 py-0.5 rounded text-xs">O(M × N)</code>.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>M, N:</strong> Length of the token sequences.</li>
          <li>Every cell in the matrix is computed exactly once taking O(1) operations.</li>
          <li>Traceback runs in O(M + N) time to reconstruct the optimal edit path.</li>
        </ul>
      </div>
    )
  },
  {
    id: "space",
    title: "SPACE COMPLEXITY",
    subtitle: "Memory Footprint",
    content: (
      <div className="space-y-4 text-sm text-[#EDEDED]/70 leading-relaxed">
        <p>
          Space complexity is exactly <code className="bg-[#6366F1]/20 text-[#818CF8] px-1.5 py-0.5 rounded text-xs">O(M × N)</code>.
        </p>
        <p>
          We allocate an array of <code>Int32Array</code> structures to store the DP table. While space could be optimized to O(min(M,N)) if we only needed the distance, we must retain the entire matrix to perform the traceback step which recovers the exact insertions, deletions, and substitutions for rendering.
        </p>
      </div>
    )
  },
  {
    id: "heuristic",
    title: "HEURISTIC SCORING",
    subtitle: "Semantic Drift Evaluation",
    content: (
      <div className="space-y-4 text-sm text-[#EDEDED]/70 leading-relaxed">
        <p>
          Instead of just calculating pure Levenshtein distance, we analyze the structural changes.
        </p>
        <p>
          Substitutions heavily penalize the <strong>Confidence Score</strong> because they typically represent semantic drift (hallucinations or model variation), whereas pure insertions represent expansions of thought.
        </p>
      </div>
    )
  }
];

export function AlgorithmAccordion() {
  return (
    <div className="w-full space-y-6 mt-12">
      <div className="flex items-center gap-2 text-xl font-semibold text-[#EDEDED]">
        <BarChart2 className="h-6 w-6 text-[#6366F1]" />
        <h2>Algorithm Insights</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {INSIGHTS.map((item) => (
          <div 
            key={item.id}
            className="rounded-xl border border-[#262626] bg-[#0A0A0A] overflow-hidden shadow-md shadow-[#6366F1]/5"
          >
            <div className="p-5 border-b border-[#262626]/50">
              <h3 className="text-xs font-mono tracking-widest uppercase text-[#EDEDED] font-bold mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-[#EDEDED]/50">
                {item.subtitle}
              </p>
            </div>
            <div className="p-5 pt-4">
              {item.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
