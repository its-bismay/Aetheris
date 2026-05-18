import type { DiffOp, DiffStats, DiffMetricsResult } from './types';

export function calculateStats(ops: DiffOp[]): DiffStats {
  let substitutions = 0;
  let deletions = 0;
  let insertions = 0;
  let unchanged = 0;
  let totalTokens = 0;

  for (const op of ops) {
    if (op.op === "sub") substitutions++;
    else if (op.op === "del") deletions++;
    else if (op.op === "ins") insertions++;
    else if (op.op === "eq") unchanged++;

    if (op.op === "sub") totalTokens += 2; 
    else totalTokens += 1;
  }

  return { substitutions, deletions, insertions, unchanged, totalTokens };
}

export function calculateMetrics(stats: DiffStats): DiffMetricsResult {

  const totalOps = stats.unchanged + stats.substitutions + stats.insertions + stats.deletions;
  const similarityScore = totalOps === 0 ? 100 : (stats.unchanged / totalOps) * 100;
  const similarityIndex = `${similarityScore.toFixed(1)}%`;


  const added = stats.insertions + stats.substitutions;
  const removed = stats.deletions + stats.substitutions;
  const tokenDrift = `+${added}/-${removed}`;


  const editDistanceVal = stats.substitutions + stats.insertions + stats.deletions;
  const editDistance = editDistanceVal.toString();


  const substitutionPenalty = totalOps > 0 ? (stats.substitutions / totalOps) * 0.5 : 0;
  const confidence = Math.max(0, Math.min(1, (similarityScore / 100) - substitutionPenalty));
  const confidenceScore = confidence.toFixed(2);

  return { similarityIndex, tokenDrift, editDistance, confidenceScore };
}
