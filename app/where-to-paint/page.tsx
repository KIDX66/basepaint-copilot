import { currentDay, canvasSizeForDay } from "@/lib/basepaint/constants";
import { fetchThemeForDay } from "@/lib/basepaint/theme";
import { fetchAllStrokesForDay } from "@/lib/basepaint/graphql";
import { WhereToPaintPanel } from "@/components/WhereToPaintPanel";

export default async function WhereToPaintPage() {
  const day = currentDay();
  const theme = await fetchThemeForDay(day);
  const size = canvasSizeForDay(day);
  const strokes = await fetchAllStrokesForDay(day);

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-white/50">
        Day {day} · {theme.theme}
      </p>
      <h1 className="mt-1 font-pixel text-3xl text-accent">Where to Paint</h1>
      <div className="mt-4 max-w-xl">
        <WhereToPaintPanel size={size} palette={theme.palette} strokes={strokes} />
      </div>
    </div>
  );
}