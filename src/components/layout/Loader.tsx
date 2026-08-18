"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { markSessionFlag, useSessionFlag } from "@/hooks/useSessionFlag";

/**
 * LOADER
 * ──────
 * Roughly 1.1s on a first visit, then never again for the session. A preloader
 * that replays on every route change is a tax, not an experience.
 *
 * The curtain is `position: fixed` over the page rather than gating render, so
 * the content is in the DOM (and indexable) the whole time.
 */

const FLAG = "intro-seen";

export function Loader() {
  const seen = useSessionFlag(FLAG);
  const reduced = useReducedMotion();
  const [finished, setFinished] = useState(false);

  const root = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  const shouldPlay = !seen && !reduced && !finished;

  useEffect(() => {
    if (!shouldPlay || !root.current) {
      // Already seen, or motion is off — record it and never show the curtain.
      if (!seen) markSessionFlag(FLAG);
      return;
    }

    document.documentElement.style.overflow = "hidden";
    const counter = { v: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        markSessionFlag(FLAG);
        document.documentElement.style.overflow = "";
        setFinished(true);
      },
    });

    tl.to(counter, {
      v: 100,
      duration: 0.95,
      ease: "power2.inOut",
      onUpdate: () => {
        if (countRef.current) countRef.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
      },
    })
      .to(".loader-line", { scaleX: 1, duration: 0.95, ease: "power2.inOut" }, 0)
      .to(".loader-label", { yPercent: -110, duration: 0.5, ease: "expo.in" }, "-=0.12")
      .to(root.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.75, ease: "power4.inOut" }, "-=0.18");

    return () => {
      tl.kill();
      document.documentElement.style.overflow = "";
    };
  }, [shouldPlay, seen]);

  if (!shouldPlay) return null;

  return (
    <div
      ref={root}
      aria-hidden
      className="fixed inset-0 z-[10000] flex flex-col justify-between bg-ink px-6 py-6 md:px-10 md:py-8"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <div className="flex items-start justify-between">
        <span className="label loader-label block">Initialising</span>
        <span className="label loader-label block">2026</span>
      </div>

      <div className="flex items-end justify-between">
        <span ref={countRef} className="display block text-[18vw] leading-[0.8] text-paper md:text-[13vw]">
          000
        </span>
        <span className="label loader-label mb-3 hidden md:block">Basit Olajide</span>
      </div>

      <div className="loader-line mt-6 h-px w-full origin-left scale-x-0 bg-accent" />
    </div>
  );
}
