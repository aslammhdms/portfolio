/**
 * A small, hand-written fuzzy scorer for the command palette (no library). The query's
 * characters must appear in the text in order; the score rewards a contiguous run, a
 * start of a word and an early match, and charges for gaps. It returns the matched
 * character positions too, so the palette can highlight them.
 */
export interface FuzzyMatch {
  score: number;
  indices: number[];
}

const isBoundary = (text: string, i: number) => i === 0 || /[\s\-_./·:~]/.test(text[i - 1]);

function scoreFrom(q: string, t: string, text: string, start: number): FuzzyMatch | null {
  const indices: number[] = [];
  let score = 0;
  let prev = -2;
  let pos = start;
  for (let qi = 0; qi < q.length; qi++) {
    const found = t.indexOf(q[qi], pos);
    if (found === -1) return null;
    indices.push(found);
    score += 10;
    if (found === prev + 1) score += 8; // contiguous with the previous character
    else if (qi > 0) score -= Math.min(found - prev - 1, 6); // a gap
    if (isBoundary(text, found)) score += 6;
    prev = found;
    pos = found + 1;
  }
  score -= Math.min(indices[0], 8) * 0.5; // earlier is better
  return { score, indices };
}

export function fuzzy(query: string, text: string): FuzzyMatch | null {
  const q = query.trim().toLowerCase();
  if (!q) return { score: 0, indices: [] };
  const t = text.toLowerCase();

  // A plain substring is the best kind of match.
  const at = t.indexOf(q);
  if (at !== -1) {
    const indices = Array.from({ length: q.length }, (_, i) => at + i);
    return { score: 100 + q.length * 10 + (isBoundary(text, at) ? 20 : 0) - at * 0.5, indices };
  }

  // Otherwise the best subsequence over every possible first character.
  let best: FuzzyMatch | null = null;
  for (let i = t.indexOf(q[0]); i !== -1; i = t.indexOf(q[0], i + 1)) {
    const m = scoreFrom(q, t, text, i);
    if (!m) continue;
    // Reject matches smeared across the text ('barr' in 'Retail mobile apps'): the characters
    // must sit reasonably close together.
    const span = m.indices[m.indices.length - 1] - m.indices[0] + 1;
    if (span > q.length * 2 + 2) continue;
    if (!best || m.score > best.score) best = m;
  }
  return best;
}

/** Levenshtein distance, for "did you mean" (terminal commands are short). */
export function editDistance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diag = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const up = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = up;
    }
  }
  return row[b.length];
}
