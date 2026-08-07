import { Pixel } from "./strokeDecoder";

export type CanvasState = {
  size: number;
  palette: string[]; // hex colors, index-aligned with strokes' colorIndex
  // grid[y * size + x] = colorIndex, or -1 if unpainted
  grid: Int16Array;
};

export function createEmptyCanvasState(size: number, palette: string[]): CanvasState {
  const grid = new Int16Array(size * size).fill(-1);
  return { size, palette, grid };
}

/** Applies pixels in order (later pixels at the same coordinate overwrite
 * earlier ones — this matches how repainting works on-chain). */
export function applyPixels(state: CanvasState, pixels: Pixel[]): CanvasState {
  const grid = state.grid; // mutate in place for perf on large replays
  for (const p of pixels) {
    if (p.x < 0 || p.x >= state.size || p.y < 0 || p.y >= state.size) continue;
    grid[p.y * state.size + p.x] = p.colorIndex;
  }
  return state;
}

/** Renders current state onto a canvas 2D context at an integer pixel scale
 * (no anti-aliasing — pixel art should stay crisp). */
export function renderToCanvas(ctx: CanvasRenderingContext2D, state: CanvasState, scale = 4) {
  ctx.imageSmoothingEnabled = false;
  const { size, palette, grid } = state;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = grid[y * size + x];
      if (idx < 0) continue;
      ctx.fillStyle = palette[idx] ?? "#000000";
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
}

// ---------------------------------------------------------------------
// Ghost-preview suggestion heuristic
// ---------------------------------------------------------------------
//
// Goal: help an artist decide where their remaining pixel budget would add
// the most to the composition, without pretending to be a real aesthetic
// judge. Two simple, explainable signals:
//
//   1. Color scarcity — palette colors that are underused relative to
//      their neighbors get a boost, since a canvas dominated by 2-3 colors
//      out of the day's full palette usually reads as less finished.
//   2. Spatial sparsity — a coarse grid of "how empty is this region",
//      so suggestions steer artists away from the already-crowded center
//      that tends to attract first strokes.
//
// This is deliberately not ML — it's a transparent heuristic an artist can
// understand and override, which matters more than a model that ends up
// forcing everyone into the same style.

export type RegionSuggestion = {
  regionX: number; // top-left of an 8x8-ish block, in canvas coords
  regionY: number;
  emptiness: number; // 0..1, fraction of unpainted pixels in region
  score: number; // combined suggestion score, higher = more worth painting
};

export function colorUsageHistogram(state: CanvasState): Map<number, number> {
  const counts = new Map<number, number>();
  for (const idx of state.grid) {
    if (idx < 0) continue;
    counts.set(idx, (counts.get(idx) ?? 0) + 1);
  }
  return counts;
}

export function suggestRegions(state: CanvasState, blockSize = 8, topN = 5): RegionSuggestion[] {
  const { size, grid } = state;
  const regions: RegionSuggestion[] = [];

  for (let by = 0; by < size; by += blockSize) {
    for (let bx = 0; bx < size; bx += blockSize) {
      let empty = 0;
      let total = 0;
      for (let y = by; y < Math.min(by + blockSize, size); y++) {
        for (let x = bx; x < Math.min(bx + blockSize, size); x++) {
          total++;
          if (grid[y * size + x] < 0) empty++;
        }
      }
      const emptiness = total > 0 ? empty / total : 0;
      // Favor regions that are mostly-but-not-entirely empty: fully empty
      // regions are often outside the intended composition (e.g. sky/void
      // the group hasn't reached yet), while partially-empty regions are
      // usually where the active composition is still being filled in.
      const score = emptiness > 0.15 && emptiness < 0.9 ? emptiness : emptiness * 0.3;
      regions.push({ regionX: bx, regionY: by, emptiness, score });
    }
  }

  return regions.sort((a, b) => b.score - a.score).slice(0, topN);
}
