/** Word error rate: measures the transcript, never accent or phonetic quality. */
export interface WordResult {
  word: string;
  status: "correct" | "incorrect" | "missing";
}

export interface MatchResult {
  score: number;
  wordResults: WordResult[];
}

function tokenize(text: string): string[] {
  return text
    .normalize("NFC")
    .toLocaleLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^\p{L}\p{N}'\s]/gu, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

/** Word Error Rate: measures the transcript, never accent or phonetic quality. */
export function matchTranscript(target: string, spoken: string): number {
  const expected = tokenize(target),
    actual = tokenize(spoken);
  if (!expected.length || !actual.length) return 0;
  let previous = Array.from({ length: actual.length + 1 }, (_, i) => i);
  for (let i = 1; i <= expected.length; i++) {
    const current = [i];
    for (let j = 1; j <= actual.length; j++)
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + (expected[i - 1] === actual[j - 1] ? 0 : 1),
      );
    previous = current;
  }
  return Math.max(0, Math.round((1 - previous[actual.length] / expected.length) * 100));
}

/**
 * Matches spoken text against the target phrase, returning per-word status
 * (correct, incorrect, or missing) alongside the WER-based score.
 */
export function matchTranscriptDetailed(target: string, spoken: string): MatchResult {
  const expected = tokenize(target);
  const actual = tokenize(spoken);

  if (!expected.length) return { score: 0, wordResults: [] };
  if (!actual.length) {
    return {
      score: 0,
      wordResults: expected.map((w) => ({ word: w, status: "missing" })),
    };
  }

  // Build DP alignment matrix for per-word attribution
  const el = expected.length;
  const al = actual.length;
  const dp: number[][] = Array.from({ length: el + 1 }, () => Array(al + 1).fill(0));

  for (let i = 0; i <= el; i++) dp[i][0] = i;
  for (let j = 0; j <= al; j++) dp[0][j] = j;

  for (let i = 1; i <= el; i++) {
    for (let j = 1; j <= al; j++) {
      const match = expected[i - 1] === actual[j - 1];
      const subCost = match ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + subCost, // substitution/match
      );
    }
  }

  // Backtrack to assign statuses to each expected word
  const resultsMap = new Map<number, "correct" | "incorrect" | "missing">();
  let i = el;
  let j = al;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0) {
      const match = expected[i - 1] === actual[j - 1];
      const subCost = match ? 0 : 1;

      if (Math.abs(dp[i][j] - (dp[i - 1][j - 1] + subCost)) < 1e-6) {
        resultsMap.set(i - 1, match ? "correct" : "incorrect");
        i--;
        j--;
        continue;
      }
    }

    if (i > 0 && Math.abs(dp[i][j] - (dp[i - 1][j] + 1)) < 1e-6) {
      resultsMap.set(i - 1, "missing");
      i--;
      continue;
    }

    if (j > 0 && Math.abs(dp[i][j] - (dp[i][j - 1] + 1)) < 1e-6) {
      // Extra spoken word (insertion)
      j--;
      continue;
    }

    if (i > 0) {
      resultsMap.set(i - 1, "missing");
      i--;
    } else {
      j--;
    }
  }

  const wordResults: WordResult[] = expected.map((w, idx) => ({
    word: w,
    status: resultsMap.get(idx) ?? "missing",
  }));

  return { score: Math.max(0, Math.round((1 - dp[el][al] / el) * 100)), wordResults };
}
