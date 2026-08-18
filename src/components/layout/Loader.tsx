"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/**
 * LOADER
 * ──────
 * Counts 000 → 100 over ~0.95s, then clips away. Plays once per session.
 *
 * WHY THIS IS SHAPED THE WAY IT IS
 * The curtain is server-rendered, so a first visit never flashes raw page
 * content before React arrives. But the server cannot know whether the intro
 * already played — that lives in sessionStorage. Deciding it in React means the
 * curtain paints and is then torn down on hydration, which is a visible flash of
 * "000" on every repeat visit.
 *
 * So the decision is made twice, in the right order:
 *   1. An inline script in layout.tsx stamps `.intro-seen` on <html> before
 *      first paint, and CSS hides `#intro-curtain` outright. Zero flash.
 *   2. This component reads the same signal on mount and either runs the
 *      timeline or unmounts itself.
 *
 * Reduced motion is handled in CSS for the same reason — waiting for a React
 * media-query hook would reintroduce the flash it is meant to prevent.
 */

const FLAG = "intro-seen";

/** Reads the pre-paint decision rather than re-deriving it. */
function alreadyHandled() {
  if (typeof document === "undefined") return false;
  return (
    document.documentElement.classList.contains("intro-seen") ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function Loader() {
  const [done, setDone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Repeat visit or reduced motion. CSS has already hidden the curtain before
    // paint, so there is nothing to undo visually — just record the flag.
    //
    // Deliberately NOT calling setDone() here: a synchronous setState in an
    // effect body costs an extra render pass, and the node it would remove is
    // already `display: none` and `aria-hidden`. It paints nothing, measures
    // nothing, and is absent from the accessibility tree. Leaving it is cheaper
    // than re-rendering to delete it.
    if (alreadyHandled()) {
      try {
        sessionStorage.setItem(FLAG, "1");
      } catch {
        /* private mode — the intro simply replays, which is harmless */
      }
      return;
    }

    if (!root.current) return;

    document.documentElement.style.overflow = "hidden";
    const counter = { v: 0 };

    /**
     * Single exit path, guarded so it runs exactly once.
     *
     * This curtain locks page scroll, so "the animation never finished" is not a
     * cosmetic failure — it locks the visitor out of the site. GSAP is driven by
     * requestAnimationFrame, which a browser suspends entirely in a background
     * tab, and any thrown error inside the timeline would strand the lock too.
     * So the exit is callable from both the timeline and a failsafe timer.
     */
    let exited = false;
    const finish = () => {
      if (exited) return;
      exited = true;
      try {
        sessionStorage.setItem(FLAG, "1");
      } catch {
        /* private mode — the intro replays next load, which is harmless */
      }
      document.documentElement.classList.add("intro-seen");
      document.documentElement.style.overflow = "";
      setDone(true);
    };

    // Timeline runs ~1.5s. If it has not exited by 3s, something stopped the
    // ticker and the page matters more than the intro.
    const failsafe = window.setTimeout(finish, 3000);

    const tl = gsap.timeline({ onComplete: finish });

    tl.to(counter, {
      v: 100,
      duration: 0.95,
      ease: "power2.inOut",
      onUpdate: () => {
        if (countRef.current) {
          countRef.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
        }
      },
    })
      .to(".loader-line", { scaleX: 1, duration: 0.95, ease: "power2.inOut" }, 0)
      .to(".loader-label", { yPercent: -110, duration: 0.5, ease: "expo.in" }, "-=0.12")
      .to(root.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.75, ease: "power4.inOut" }, "-=0.18");

    return () => {
      window.clearTimeout(failsafe);
      tl.kill();
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div
      id="intro-curtain"
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
