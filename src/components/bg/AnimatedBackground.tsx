"use client";

import { useEffect, useRef } from "react";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMouse } from "@/hooks/useMouse";

/**
 * BACKGROUND LAYERS
 * ─────────────────
 * Four fixed layers at different depths. Everything is transform-driven and
 * runs off one rAF, so the whole atmosphere costs a single composited frame.
 *
 *   1. radial light   — follows the pointer at 0.03 lerp (slowest layer)
 *   2. grid           — static, drifts fractionally with the light
 *   3. coordinate marks — technical detail, fixed
 *   4. grain          — CSS-animated SVG noise, no JS
 */
export function AnimatedBackground() {
  const { touch, ready } = useDeviceTier();
  const reduced = useReducedMotion();
  const mouse = useMouse(ready && !touch && !reduced);
  const light = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready || touch || reduced) return;
    let raf = 0;
    const cur = { x: 0, y: 0 };

    const loop = () => {
      const { nx, ny } = mouse.current;
      cur.x += (nx - cur.x) * 0.03;
      cur.y += (ny - cur.y) * 0.03;
      if (light.current) {
        light.current.style.transform = `translate3d(${(cur.x * 8).toFixed(2)}%, ${(cur.y * 8).toFixed(2)}%, 0)`;
      }
      if (grid.current) {
        grid.current.style.transform = `translate3d(${(cur.x * -1.2).toFixed(2)}%, ${(cur.y * -1.2).toFixed(2)}%, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [ready, touch, reduced, mouse]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* radial light */}
      <div
        ref={light}
        className="absolute -inset-[20%] will-change-transform"
        style={{
          background:
            "radial-gradient(58% 46% at 52% 28%, rgba(214,249,76,0.055) 0%, rgba(214,249,76,0.018) 38%, transparent 70%)",
        }}
      />
      {/* faint grid */}
      <div
        ref={grid}
        className="absolute -inset-[6%] opacity-[0.55] will-change-transform"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(237,237,231,0.028) 1px, transparent 1px), linear-gradient(to bottom, rgba(237,237,231,0.028) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, #000 30%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, #000 30%, transparent 78%)",
        }}
      />
      {/* coordinate marks — technical detail, desktop only */}
      <svg className="absolute inset-0 hidden h-full w-full lg:block" aria-hidden>
        {[0.25, 0.5, 0.75].map((p) => (
          <g key={p} stroke="rgba(237,237,231,0.07)">
            <line x1={`${p * 100}%`} y1="0" x2={`${p * 100}%`} y2="8" />
            <line x1={`${p * 100}%`} y1="100%" x2={`${p * 100}%`} y2="calc(100% - 8px)" />
            <line x1="0" y1={`${p * 100}%`} x2="8" y2={`${p * 100}%`} />
            <line x1="100%" y1={`${p * 100}%`} x2="calc(100% - 8px)" y2={`${p * 100}%`} />
          </g>
        ))}
      </svg>
      {/* grain */}
      <div
        className="absolute -inset-[50%] opacity-[0.16] mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)'/%3E%3C/svg%3E")`,
          animation: reduced ? "none" : "grain-shift 7s steps(6) infinite",
        }}
      />
      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(120% 90% at 50% 0%, transparent 55%, rgba(0,0,0,0.55) 100%)" }}
      />
    </div>
  );
}
