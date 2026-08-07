"use client";

import { useEffect, useRef } from "react";
import { CanvasState, renderToCanvas } from "@/lib/basepaint/canvasEngine";

type Props = {
  state: CanvasState;
  scale?: number;
  className?: string;
};

export function CanvasView({ state, scale = 4, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderToCanvas(ctx, state, scale);
  }, [state, scale]);

  return (
    <canvas
      ref={canvasRef}
      width={state.size * scale}
      height={state.size * scale}
      className={`pixelated rounded border border-white/10 max-w-full h-auto ${className ?? ""}`}
    />
  );
}