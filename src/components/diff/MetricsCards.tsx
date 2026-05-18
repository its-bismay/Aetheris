import type { DiffMetricsResult } from '../../lib/diff/types';

interface MetricsCardsProps {
  metrics: DiffMetricsResult;
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const cards = [
    { label: 'SIMILARITY INDEX', value: metrics.similarityIndex, sub: 'Token overlap' },
    { label: 'TOKEN DRIFT', value: metrics.tokenDrift, sub: 'Significant structural change' },
    { label: 'EDIT DISTANCE', value: metrics.editDistance, sub: 'Levenshtein operations' },
    { label: 'CONFIDENCE', value: metrics.confidenceScore, sub: 'Diff engine precision' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
      {cards.map((card, i) => (
        <div key={i} className="rounded-xl border border-[#262626] bg-[#0A0A0A] p-6 relative overflow-hidden group">

          <div className="absolute inset-0 bg-linear-to-br from-[#6366F1]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <h4 className="text-[10px] font-mono tracking-widest text-[#EDEDED]/50 uppercase mb-3">
            {card.label}
          </h4>
          <div className="text-3xl font-bold text-[#EDEDED] mb-1">
            {card.value}
          </div>
          <div className="text-xs text-[#EDEDED]/40">
            {card.sub}
          </div>
          

          {(i === 0 || i === 3) && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#262626]">
              <div 
                className="h-full bg-[#6366F1] transition-all duration-1000 ease-out" 
                style={{ 
                  width: i === 0 ? metrics.similarityIndex : `${parseFloat(metrics.confidenceScore) * 100}%` 
                }} 
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
