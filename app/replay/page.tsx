import { currentDay, canvasSizeForDay } from "@/lib/basepaint/constants";
import { fetchThemeForDay } from "@/lib/basepaint/theme";
import { fetchAllStrokesForDay } from "@/lib/basepaint/graphql";
import { ReplayScrubber } from "@/components/ReplayScrubber";

export default async function ReplayPage() {
  const day = Math.max(1, currentDay() - 1);
  const theme = await fetchThemeForDay(day);
  const size = canvasSizeForDay(day);
  const strokes = await fetchAllStrokesForDay(day);

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-white/50">
        Day {day} · {theme.theme}
      </p>
      <h1 className="mt-1 font-pixel text-3xl text-accent">Replay</h1>
      <div className="mt-4 max-w-xl">
        <ReplayScrubber size={size} palette={theme.palette} strokes={strokes} />
      </div>
    </div>
  );
}