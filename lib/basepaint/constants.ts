// Source of truth: https://basepaint.xyz/ai.txt
// Re-check this file periodically — BasePaint may update contracts/endpoints.

export const CONTRACTS = {
  // Tracks artwork and earnings
  BasePaint: "0xBa5e05cb26b78eDa3A2f8e3b3814726305dcAc83",
  // NFT required to participate; holds each artist's pixel rate limit
  BasePaintBrush: "0xD68fe5b53e7E1AbeB5A4d0A6660667791f39263a",
  // Each contribution can be minted separately
  BasePaintWIP: "0xE6249eAfdC9C8a809fE28a5213120B1860f9a75f",
  // Referral program
  BasePaintRewards: "0xaff1A9E200000061fC3283455d8B0C7e3e728161",
  // Aux indexing contract for brushes
  BasePaintBrushEvents: "0xb152f48F207d9D1C30Ff60d46E8cb8c1a5d00dEC",
  // Timelapse animation NFT, minted by burning canvases
  BasePaintAnimation: "0xC59F475122e914aFCf31C0a9E0A2274666135e4E",
  // Theme names + palettes
  BasePaintMetadataRegistry: "0x5104482a2Ef3a03b6270D3e931eac890b86FaD01",
  // Canvas futures
  BasePaintSubscription: "0x75CF063a65d361527180805b244bC51c1deAb075",
} as const;

export const ENDPOINTS = {
  graphql: "https://graphql.basepaint.xyz",
  themeForDay: (day: number) => `https://basepaint.xyz/api/theme/${day}`,
  finalImage: (day: number) => `https://basepaint.net/v3/${String(day).padStart(4, "0")}.png`,
  animation: (day: number) => `https://basepaint.net/animations/${String(day).padStart(4, "0")}.mp4`,
  liveCanvasImage: (scale = 1) => `https://basepaint.xyz/api/art/image?day=painting&scale=${scale}`,
  beacon: (ref: string) => `https://basepaint.xyz/api/beacon.gif?ref=${encodeURIComponent(ref)}`,
  webmention: "https://basepaint.xyz/api/webmention",
} as const;

// Day 1 epoch and day length, per ai.txt.
export const DAY_ONE_EPOCH_SECONDS = 1691599315;
export const DAY_LENGTH_SECONDS = 86400;

/** currentDay = floor((now_seconds - epoch) / 86400) + 1 */
export function currentDay(nowSeconds: number = Date.now() / 1000): number {
  return Math.floor((nowSeconds - DAY_ONE_EPOCH_SECONDS) / DAY_LENGTH_SECONDS) + 1;
}

/** Seconds remaining in the current 24h phase (painting or sale). */
export function secondsIntoCurrentDay(nowSeconds: number = Date.now() / 1000): number {
  return (nowSeconds - DAY_ONE_EPOCH_SECONDS) % DAY_LENGTH_SECONDS;
}

export function isPaintingWindowOpen(nowSeconds: number = Date.now() / 1000): boolean {
  // Per ai.txt: canvas is painted for 24h, then flips to a 24h sale window.
  // The flip happens once per day at ~16:42 UTC; treat the painting window
  // as the 24h block starting at day rollover until the app can read the
  // authoritative on-chain "closed" flag for the day (see canvasEngine.ts TODO).
  return true; // placeholder — replace with a real on-chain read, see TODO below
}

/** Canvas is 144x144 for days 1-365, 256x256 from day 366 on. */
export function canvasSizeForDay(day: number): 144 | 256 {
  return day <= 365 ? 144 : 256;
}

// Design system, verbatim from basepaint.xyz/ai.txt — do not deviate.
export const BRAND = {
  colors: {
    background: "#1E2735",
    foreground: "#ffffff",
    accent: "#fde047",
    header: "#073eb1",
  },
  fonts: {
    mono: "'Roboto Mono', monospace",
    display: "'MEK Sans', sans-serif",
    pixel: "'MEK Mono', monospace",
  },
} as const;
