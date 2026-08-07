"use client";

import { useMemo } from "react";
import { CanvasState, RegionSuggestion, suggestRegions } from "@/lib/basepaint/canvasEngine";

type Props = {
  state: CanvasState;
  brushPixelsRemaining: number;
  onSelectRegion?: (region: RegionSuggestion) => void;
};

/**
 * This is intentionally a *suggestion* surface, not an auto-painter. It
 * shows its reasoning (emptiness %) so an artist can accept, ignore, or use
 * it as a starting point. The delegation tier reuses this exact scoring —
 * the only difference is who clicks "confirm."
 */
export function GhostPreview({ state, brushPixelsRemaining, onSelectRegion }: Props) {
  const regions = useMemo(() => suggestRegions(state), [state]);

  return (
    <div className="rounded border border-white/10 bg-white/5 p-4 font-mono text-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-accent">Where to paint</h3>
        <span className="text-white/60">{brushPixelsRemaining} px left today</span>
      </div>
      <ul className="flex flex-col gap-2">
        {regions.map((r) => (
          <li key={`${r.regionX},${r.regionY}`}>
            <button
              onClick={() => onSelectRegion?.(r)}
              className="flex w-full items-center justify-between rounded border border-white/10 px-3 py-2 text-left hover:border-accent hover:text-accent"
            >
              <span>
                ({r.regionX}, {r.regionY})
              </span>
              <span className="text-white/50">{Math.round(r.emptiness * 100)}% open</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-white/40">
        Suggestions favor partially-filled regions over the crowded center or fully-empty edges.
        This is a heuristic, not a verdict — pick whatever actually fits what you're painting.
      </p>
    </div>
  );
}
