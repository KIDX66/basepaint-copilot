"use client";

import { useMemo, useState } from "react";
import { CanvasView } from "./CanvasView";
import { applyPixels, createEmptyCanvasState } from "@/lib/basepaint/canvasEngine";
import { decodeStroke } from "@/lib/basepaint/strokeDecoder";
import type { StrokeItem } from "@/lib/basepaint/graphql";

type Props = {
  size: number;
  palette: string[];
  strokes: StrokeItem[];
};

export function ReplayScrubber({ size, palette, strokes }: Props) {
  const [cursor, setCursor] = useState(strokes.length);
  const [spotlightAddress, setSpotlightAddress] = useState<string | null>(null);

  const artists = useMemo(() => {
    const set = new Set(strokes.map((s) => s.account.id));
    return Array.from(set);
  }, [strokes]);

  const state = useMemo(() => {
    const s = createEmptyCanvasState(size, palette);
    const upTo = strokes.slice(0, cursor);
    for (const stroke of upTo) {
      const isSpotlit = !spotlightAddress || stroke.account.id === spotlightAddress;
      if (!isSpotlit) continue;
      applyPixels(s, decodeStroke(stroke.data));
    }
    return s;
  }, [strokes, cursor, size, palette, spotlightAddress]);

  return (
    <div className="flex flex-col gap-3">
      <CanvasView state={state} />
      <input
        type="range"
        min={0}
        max={strokes.length}
        value={cursor}
        onChange={(e) => setCursor(Number(e.target.value))}
        className="w-full accent-accent"
      />
      <div className="flex items-center justify-between font-mono text-xs text-white/60">
        <span>
          Stroke {cursor} / {strokes.length}
        </span>
        <select
          value={spotlightAddress ?? ""}
          onChange={(e) => setSpotlightAddress(e.target.value || null)}
          className="rounded border border-white/20 bg-background px-2 py-1 text-white/80"
        >
          <option value="">All artists</option>
          {artists.map((a) => (
            <option key={a} value={a}>
              {a.slice(0, 6)}…{a.slice(-4)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}