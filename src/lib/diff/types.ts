export type DiffOp =
  | { op: "eq"; a: string; b: string }
  | { op: "del"; a: string }
  | { op: "ins"; b: string }
  | { op: "sub"; a: string; b: string };

export interface DiffStats {
  substitutions: number;
  deletions: number;
  insertions: number;
  unchanged: number;
  totalTokens: number;
}

export interface DiffMetricsResult {
  similarityIndex: string;
  tokenDrift: string;
  editDistance: string;
  confidenceScore: string; 
}
