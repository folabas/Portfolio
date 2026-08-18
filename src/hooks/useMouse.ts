"use client";

import { useEffect, useRef } from "react";

export interface Pointer { x: number; y: number; nx: number; ny: number }

/**
 * Pointer position in a ref, never in state — a mousemove that triggers a React
 * render sixty times a second is the fastest way to make a site feel cheap.
 * Consumers read `ref.current` from inside their own rAF or GSAP tick.
 */
export function useMouse(enabled = true) {
  const ref = useRef<Pointer>({ x: 0, y: 0, nx: 0, ny: 0 });

  useEffect(() => {
    if (!enabled) return;
    const on = (e: PointerEvent) => {
      ref.current.x = e.clientX;
      ref.current.y = e.clientY;
      ref.current.nx = (e.clientX / window.innerWidth) * 2 - 1;
      ref.current.ny = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", on, { passive: true });
    return () => window.removeEventListener("pointermove", on);
  }, [enabled]);

  return ref;
}
