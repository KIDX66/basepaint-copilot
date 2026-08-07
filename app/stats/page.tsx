"use client";

import { useState } from "react";
import { basepaintClient, CONTRIBUTIONS_FOR_ACCOUNT, BRUSH_FOR_ACCOUNT } from "@/lib/basepaint/graphql";

type Contribution = { id: string; canvasId: number; pixelsCount: number };
type Brush = { ownerId: string; strength: number; streak: number; mintedTimestamp: number };
export default function StatsPage() {
  const [address, setAddress] = useState("");
  const [contributions, setContributions] = useState<Contribution[] | null>(null);
  const [brushes, setBrushes] = useState<Brush[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function lookUp() {
    setLoading(true);
    setError(null);
    try {
      const [contribResult, brushResult]: [any, any] = await Promise.all([
        basepaintClient.request(CONTRIBUTIONS_FOR_ACCOUNT, { address, limit: 30 }),
        basepaintClient.request(BRUSH_FOR_ACCOUNT, { address }),
      ]);
      setContributions(contribResult.contributions.items);
     setBrushes(brushResult.brushs.items);
    } catch (e: any) {
      setError(e.message ?? "Something went wrong looking that up.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="font-pixel text-3xl text-accent">Brush stats</h1>
      <p className="mt-1 text-sm text-white/60">
        Paste a wallet address to see its brushes and recent contributions.
      </p>

      <div className="mt-4 flex gap-2">
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="0x..."
          className="flex-1 rounded border border-white/20 bg-white/5 px-3 py-2 font-mono text-sm text-white placeholder:text-white/30"
        />
        <button
          onClick={lookUp}
          disabled={!address || loading}
          className="rounded bg-accent px-4 py-2 font-mono text-sm text-background disabled:opacity-40"
        >
          {loading ? "Looking up…" : "Look up"}
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded border border-red-400/40 bg-red-400/10 p-3 font-mono text-xs text-red-300">
          {error}
        </p>
      )}

      {brushes && (
        <div className="mt-6">
          <h2 className="font-mono text-sm text-white/70">Brushes ({brushes.length})</h2>
          <ul className="mt-2 flex flex-col gap-1 font-mono text-xs text-white/60">
            {brushes.map((b) => (
  <li key={b.ownerId}>
    Strength {b.strength} — streak {b.streak} days
  </li>
))}
          </ul>
        </div>
      )}

      {contributions && (
        <div className="mt-6">
          <h2 className="font-mono text-sm text-white/70">Recent contributions</h2>
          <ul className="mt-2 flex flex-col gap-1 font-mono text-xs text-white/60">
           {contributions.map((c) => (
  <li key={c.id}>
    Day {c.canvasId} — {c.pixelsCount} px
  </li>
))}
          </ul>
        </div>
      )}
    </div>
  );
}