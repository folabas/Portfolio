"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * CUSTOM CURSOR
 * ─────────────
 * A small dot that trails the pointer, and a ring that expands into a labelled
 * indicator over interactive elements. Any element can drive it with
 * `data-cursor="VIEW PROJECT"`.
 *
 * Never mounts on touch devices, and never mounts under reduced motion — the
 * native cursor is restored by removing the body flag that hides it.
 */

const LERP = 0.18;

export function CustomCursor() {
  const { touch, tier, ready } = useDeviceTier();
  const reduced = useReducedMotion();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  const active = ready && !touch && tier === "desktop" && !reduced;

  useEffect(() => {
    if (!active) return;

    document.body.dataset.cursor = "on";

    const pos = { x: innerWidth / 2, y: innerHeight / 2 };
    const ringPos = { ...pos };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
    };

    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * LERP;
      ringPos.y += (pos.y - ringPos.y) * LERP;
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      if (ring.current) ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Delegated hover detection — no listener per element, works for nodes that
    // mount later (filtered archive items, route changes).
    const onOver = (e: PointerEvent) => {
      const el = (e.target as HTMLElement)?.closest?.(
        "[data-cursor], a, button, [role='button'], input, textarea"
      ) as HTMLElement | null;

      if (!el) {
        setState(null);
        return;
      }
      const text = el.dataset.cursor;
      setState(text ?? "");
    };

    const setState = (text: string | null) => {
      if (!ring.current || !label.current || !dot.current) return;
      const hasLabel = !!text;
      const isHover = text !== null;

      gsap.to(ring.current, {
        width: hasLabel ? 84 : isHover ? 46 : 30,
        height: hasLabel ? 84 : isHover ? 46 : 30,
        borderColor: isHover ? "rgba(214,249,76,0.9)" : "rgba(237,237,231,0.35)",
        backgroundColor: hasLabel ? "rgba(214,249,76,0.10)" : "rgba(0,0,0,0)",
        duration: 0.42,
        ease: "expo.out",
      });
      gsap.to(dot.current, { scale: isHover ? 0 : 1, duration: 0.3, ease: "expo.out" });
      label.current.textContent = text ?? "";
      gsap.to(label.current, { opacity: hasLabel ? 1 : 0, duration: 0.24 });
    };

    const onLeave = () => {
      gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.2 });
    };
    const onEnter = () => {
      gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.2 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      delete document.body.dataset.cursor;
    };
  }, [active]);

  if (!active) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999] hidden lg:block">
      <div
        ref={ring}
        className="absolute left-0 top-0 grid h-[30px] w-[30px] place-items-center rounded-full border will-change-transform"
        style={{ borderColor: "rgba(237,237,231,0.35)" }}
      >
        <span
          ref={label}
          className="whitespace-nowrap font-mono text-[8.5px] uppercase tracking-[0.16em] text-accent opacity-0"
        />
      </div>
      <div ref={dot} className="absolute left-0 top-0 h-[5px] w-[5px] rounded-full bg-paper will-change-transform" />
    </div>
  );
}
