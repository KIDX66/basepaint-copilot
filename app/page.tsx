import { currentDay, canvasSizeForDay } from "@/lib/basepaint/constants";
import { fetchThemeForDay } from "@/lib/basepaint/theme";
import { fetchAllStrokesForDay } from "@/lib/basepaint/graphql";
import { decodeStrokes } from "@/lib/basepaint/strokeDecoder";
import { applyPixels, createEmptyCanvasState } from "@/lib/basepaint/canvasEngine";
import { CanvasView } from "@/components/CanvasView";
import { GhostPreview } from "@/components/GhostPreview";

export const revalidate = 30;

export default async function TodayPage() {
  const day = currentDay();
  const theme = await fetchThemeForDay(day);
  const size = canvasSizeForDay(day);

  const strokeItems = await fetchAllStrokesForDay(day);
  const pixels = decodeStrokes(strokeItems.map((s) => s.data));
  const state = applyPixels(createEmptyCanvasState(size, theme.palette), pixels);

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
      <section>
        <p className="font-mono text-xs uppercase tracking-widest text-white/50">
          Day {day} · {theme.theme}
        </p>
        <h1 className="mt-1 font-pixel text-3xl text-accent">{theme.theme}</h1>
        <div className="mt-4">
          <CanvasView state={state} />
        </div>
      </section>

      <aside>
        <GhostPreview state={state} brushPixelsRemaining={0} />
      </aside>
    </div>
  );
}