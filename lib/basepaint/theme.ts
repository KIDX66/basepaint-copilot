import { ENDPOINTS } from "./constants";

export type DayTheme = {
  theme: string;
  proposer: string;
  size: number;
  palette: string[]; // hex colors, index-aligned with stroke colorIndex
};

export async function fetchThemeForDay(day: number): Promise<DayTheme> {
  const res = await fetch(ENDPOINTS.themeForDay(day), { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch theme for day ${day}: ${res.status}`);
  }
  return res.json();
}
