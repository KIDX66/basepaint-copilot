import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { ENDPOINTS } from "@/lib/basepaint/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: "Copilot for BasePaint",
  description:
    "A confirm-first painting co-pilot for BasePaint artists: live canvas view, region suggestions, and brush economics.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background font-mono text-foreground">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>

        {/* ai.txt: "drop this 1x1 tracking pixel into your pages" — ref
            label identifies this app so BasePaint can see it's live. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ENDPOINTS.beacon("basepaint-copilot")}
          width={1}
          height={1}
          alt=""
          style={{ position: "absolute", width: 1, height: 1, opacity: 0 }}
        />
      </body>
    </html>
  );
}
