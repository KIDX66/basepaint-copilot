# Copilot for BasePaint

A confirm-first painting co-pilot for BasePaint (https://basepaint.xyz), built so
the same engine can grow into a full delegated painting agent.

## What this is, tier 1

- Live/historical canvas reconstruction directly from on-chain `Stroke` data
  (not the pre-rendered PNG) — `lib/basepaint/strokeDecoder.ts` +
  `canvasEngine.ts`.
- A scrubbable replay of any day, with per-artist spotlight —
  `components/ReplayScrubber.tsx`.
- A "ghost preview" panel that suggests where an artist's remaining pixel
  budget would add the most to the composition, using a transparent
  emptiness/scarcity heuristic (not a black-box model) —
  `components/GhostPreview.tsx` + `suggestRegions()` in `canvasEngine.ts`.
- Brand system matched exactly to `basepaint.xyz/ai.txt`'s design section
  (colors, fonts, stable header linking back to basepaint.xyz).
- The `beacon.gif` tracking pixel and referral-routing constants from
  ai.txt are wired in (`app/layout.tsx`, `lib/basepaint/constants.ts`).

## What's verified vs. draft

Everything under `lib/basepaint/constants.ts` (contract addresses, day math,
REST endpoints, brand tokens) is copied directly from `basepaint.xyz/ai.txt`
and should be reliable.

Two things are **explicitly flagged as draft** in the code and need to be
checked against the live sources before this touches real transactions or
ships past a demo:

1. **GraphQL field names** (`lib/basepaint/graphql.ts`) — ai.txt describes
   the entities (`Canvas`, `Stroke`, `Contribution`, `Account`, `Brush`,
   `Withdrawal`) but not exact field names. Run introspection against
   `https://graphql.basepaint.xyz` (or `npm run codegen` once
   `codegen.ts` is filled in) and correct any mismatched fields.
2. **Contract ABIs** (`lib/basepaint/contracts.ts`) — addresses are
   verified, but ai.txt doesn't publish ABIs. The `paint()`/`strength()`/
   `mintLatest()` signatures are best-guess shapes based on documented
   behavior. Pull the real ABI from
   `https://github.com/BasePaint/basepaint-contracts` before wiring any
   write transaction.

I built this without live network access, so none of the above has been run
against the actual endpoints yet — treat this as a structurally-complete
scaffold that needs one pass of "does this compile against reality" before
a demo.

## Roadmap to tier 2: delegated agent

The scoring logic in `suggestRegions()` and the canvas-state engine are
written so the delegation tier is an additive change, not a rewrite:

1. **Standing instructions** — a small settings object per wallet
   (preferred quadrant, color bias, "complement sparse areas" toggle) that
   adjusts the weighting in `suggestRegions()`.
2. **Auto-submit** — once a suggestion is accepted by policy instead of by
   a click, call `paint()` (via `contracts.ts`) with the brush owner's
   remaining `strength()` budget for the day.
3. **Trust tiers** — start every wallet on "suggest only" (current
   behavior), let them opt into "confirm via one tap," then "fully
   autonomous within these rules" once they trust the suggestions.
4. **Daily nudge** — a scheduled job (cron/Farcaster frame/Telegram bot)
   that runs the same suggestion engine and either prompts the artist or,
   for delegated wallets, submits automatically before the 24h window
   closes.

## Local setup (not yet run in this environment — no network access here)

```bash
npm install
npm run dev
```

You'll need to:
- Add `MEKSans.otf` / `MEKMono.otf` to `public/fonts/` (linked from
  basepaint.xyz/brand, not redistributed here).
- Fill in `codegen.ts` and run introspection to correct `graphql.ts`.
- Replace the draft ABIs in `contracts.ts` with the real ones before any
  write call.
