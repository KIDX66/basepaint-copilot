"use client";

import { useState } from "react";
import Link from "next/link";

const links = [
  { href: "/", label: "Today" },
  { href: "/replay", label: "Replay" },
  { href: "/stats", label: "Brush stats" },
  { href: "/where-to-paint", label: "Where to paint" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-header font-mono">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <span className="font-pixel text-lg tracking-wide text-accent">
            Copilot <span className="text-sm text-muted">for BasePaint</span>
          </span>
          <nav className="hidden gap-4 text-sm text-muted sm:flex">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-accent">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <a href="https://basepaint.xyz/" target="_blank" rel="noopener noreferrer" className="hidden text-sm text-muted underline decoration-white/20 underline-offset-4 hover:text-accent sm:inline">basepaint.xyz -&gt;</a>

          <button onClick={() => setOpen((v) => !v)} aria-label="Toggle menu" aria-expanded={open} className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 sm:hidden">
            <span className={`h-0.5 w-5 bg-foreground transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-5 bg-foreground transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-5 bg-foreground transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-border bg-header px-4 py-3 text-sm text-muted sm:hidden">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded px-2 py-2 transition-colors hover:bg-card hover:text-accent">
              {link.label}
            </Link>
          ))}
          <a href="https://basepaint.xyz/" target="_blank" rel="noopener noreferrer" className="mt-1 rounded px-2 py-2 text-muted underline decoration-white/20 underline-offset-4">basepaint.xyz -&gt;</a>
        </nav>
      )}
    </header>
  );
}