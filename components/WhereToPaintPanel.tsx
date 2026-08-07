"use client";

import { useMemo } from "react";
import { CanvasView } from "./CanvasView";
import {
  applyPixels,
  colorUsageHistogram,
  createEmptyCanvasState,
  suggestRegions,
} from "@/lib/basepaint/canvasEngine";
import { decodeStrokes } from "@/lib/basepaint/strokeDecoder";
import type { StrokeItem } from "@/lib/basepaint/graphql";

type Props = {
  size: number;
  palette: string[];
  strokes: StrokeItem[];
};

export function WhereToPaintPanel({ size, palette, strokes }: Props) {
  const state = useMemo(() => {
    const s = createEmptyCanvasState(size, palette);
    const pixels = decodeStrokes(strokes.map((st) => st.data));
    applyPixels(s, pixels);
    return s;
  }, [size, palette, strokes]);

  const regions = useMemo(() => suggestRegions(state, 8, 5), [state]);
  const colorUsage = useMemo(() => colorUsageHistogram(state), [state]);

  const leastUsedColors = useMemo(() => {
    return palette
      .map((hex, colorIndex) => ({
        colorIndex,
        hex,
        count: colorUsage.get(colorIndex) ?? 0,
      }))
      .sort((a, b) => a.count - b.count)
      .slice(0, 5);
  }, [palette, colorUsage]);

  return (
    <div className="flex flex-col gap-6">
      <div className="relative inline-block">
        <CanvasView state={state} />
        {/* Overlay suggested regions on top of the canvas */}
        <svg
          className="pointer-events-none absolute left-0 top-0 h-full w-full"
          viewBox={`0 0 ${size} ${size}`}
        >
          {regions.map((r, i) => (
            <rect
              key={`${r.regionX}-${r.regionY}`}
              x={r.regionX}
              y={r.regionY}
              width={8}
              height={8}
              fill="none"
              stroke="#fde047"
              strokeWidth={0.5}
              opacity={1 - i * 0.12}
            />
          ))}
        </svg>
      </div>

      <div>
        <h2 className="font-mono text-xs uppercase tracking-widest text-white/50">
          Suggested spots
        </h2>
        <ul className="mt-2 flex flex-col gap-1 font-mono text-sm text-white/80">
          {regions.map((r) => (
            <li key={`${r.regionX}-${r.regionY}`}>
              ({r.regionX}, {r.regionY}) — {Math.round(r.emptiness * 100)}% empty
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-mono text-xs uppercase tracking-widest text-white/50">
          Underused colors
        </h2>
        <div className="mt-2 flex gap-2">
          {leastUsedColors.map((c) => (
            <div key={c.colorIndex} className="flex flex-col items-center gap-1">
              <div
                className="h-6 w-6 rounded border border-white/20"
                style={{ backgroundColor: c.hex }}
              />
              <span className="font-mono text-[10px] text-white/50">{c.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}