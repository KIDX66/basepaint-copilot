import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0A0E17",
        card: "#131A29",
        border: "#1F2937",
        foreground: "#F5F7FA",
        muted: "#8A93A5",
        accent: "#2D7FF9",
        header: "#0D1420",
      },
      fontFamily: {
        mono: ["'Roboto Mono'", "monospace"],
        display: ["'MEK Sans'", "sans-serif"],
        pixel: ["'MEK Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;