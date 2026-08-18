"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { setLenis } from "@/lib/lenis";

/**
 * LENIS ↔ SCROLLTRIGGER BRIDGE
 * ────────────────────────────
 * Two rules make this work instead of fighting itself:
 *  1. Lenis is driven by GSAP's ticker, not its own rAF, so there is exactly one
 *     animation loop on the page and ScrollTrigger never reads a stale position.
 *  2. ScrollTrigger.update runs on Lenis's scroll event, so pinned sections and
 *     scrubs track the smoothed position rather than the native one.
 *
 * Duration is kept at 1.05s with a fast-settling ease — inertia you can feel,
 * not a scroll you have to wait for.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      // Native scroll. ScrollTrigger still works; nothing is smoothed.
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (x) => 1 - Math.pow(1 - x, 4),
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      // Touch devices keep native momentum — it is better than anything we'd fake.
      syncTouch: false,
    });

    // Shared handle so overlays can freeze the page — see src/lib/lenis.ts
    setLenis(lenis);

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Anchors: let Lenis own the animation so it does not race native smooth scroll.
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement)?.closest?.('a[href*="#"]') as HTMLAnchorElement | null;
      if (!link) return;
      const url = new URL(link.href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;
      const target = document.querySelector(url.hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -8, duration: 1.2 });
      history.pushState(null, "", url.hash);
    };
    document.addEventListener("click", onClick);

    // Late-loading images change document height; refresh once things settle.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const id = window.setTimeout(refresh, 600);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("load", refresh);
      window.clearTimeout(id);
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, [reduced]);

  return <>{children}</>;
}
