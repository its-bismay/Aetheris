import type { DiffOp } from './types';

// Wagner-Fischer diff implementation exactly as described in wagner-fischer.md
export function wfDiff(A: string[], B: string[]): DiffOp[] {
  const m = A.length;
  const n = B.length;

  // --- build DP table ---
  // Use Int32Array rows for cache efficiency and lower memory footprint
  const dp: Int32Array[] = [];
  for (let i = 0; i <= m; i++) {
    dp[i] = new Int32Array(n + 1);
    dp[i][0] = i; // base case: delete i tokens
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j; // base case: insert j tokens
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (A[i - 1] === B[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]; // free match
      } else {
        dp[i][j] =
          1 +
          Math.min(
            dp[i - 1][j], // delete
            dp[i][j - 1], // insert
            dp[i - 1][j - 1] // substitute
          );
      }
    }
  }

  // --- traceback ---
  const ops: DiffOp[] = [];
  let i = m;
  let j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && A[i - 1] === B[j - 1]) {
      ops.push({ op: "eq", a: A[i - 1], b: B[j - 1] });
      i--;
      j--;
    } else if (
      j > 0 &&
      (i === 0 ||
        (dp[i][j - 1] <= dp[i - 1][j] && dp[i][j - 1] <= dp[i - 1][j - 1]))
    ) {
      ops.push({ op: "ins", b: B[j - 1] });
      j--;
    } else if (
      i > 0 &&
      (j === 0 ||
        (dp[i - 1][j] <= dp[i][j - 1] && dp[i - 1][j] <= dp[i - 1][j - 1]))
    ) {
      ops.push({ op: "del", a: A[i - 1] });
      i--;
    } else {
      ops.push({ op: "sub", a: A[i - 1], b: B[j - 1] });
      i--;
      j--;
    }
  }

  // Traceback runs from end to start, so we reverse it to get left-to-right ops
  ops.reverse();
  return ops;
}
