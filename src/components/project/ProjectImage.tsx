"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Shot } from "@/data/types";

/**
 * PROJECT IMAGE
 * ─────────────
 * One component owns every project visual: the clip-path reveal, the 1.08 → 1
 * settle, optional scroll parallax, and the device frame it sits in.
 *
 * Swapping a placeholder SVG for a real PNG needs no change here — only the
 * `src` in src/data/projects.ts.
 */

const FRAME: Record<NonNullable<Shot["device"]>, string> = {
  phone: "rounded-[2.2rem] border border-line bg-ink-2 p-[6px] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]",
  browser: "rounded-xl border border-line bg-ink-2 p-[5px] shadow-[0_40px_120px_-45px_rgba(0,0,0,0.9)]",
  laptop: "rounded-lg border border-line bg-ink-2 p-[5px]",
  tablet: "rounded-[1.4rem] border border-line bg-ink-2 p-[6px]",
  flat: "rounded-lg border border-line bg-ink-2",
};

const RADIUS: Record<NonNullable<Shot["device"]>, string> = {
  phone: "rounded-[1.9rem]",
  browser: "rounded-lg",
  laptop: "rounded-md",
  tablet: "rounded-[1.1rem]",
  flat: "rounded-[7px]",
};

export function ProjectImage({
  shot,
  priority = false,
  parallax = 0,
  reveal = true,
  className = "",
  sizes = "(max-width: 768px) 100vw, 60vw",
  cursor = "EXPLORE",
}: {
  shot: Shot;
  priority?: boolean;
  /** px of counter-scroll drift. 0 disables the ScrollTrigger entirely. */
  parallax?: number;
  /**
   * Set false when a parent already animates this image in. Inside a sticky or
   * absolutely-positioned stage the reveal's own ScrollTrigger measures against
   * a scroll position that never matches where the image visually is, and the
   * image sticks at partial opacity.
   */
  reveal?: boolean;
  className?: string;
  sizes?: string;
  cursor?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const device = shot.device ?? "browser";
  const isPhone = device === "phone";

  useEffect(() => {
    if (reduced || !wrap.current || !inner.current) return;
    const el = wrap.current;
    const img = inner.current;

    const ctx = gsap.context(() => {
      if (reveal) {
        // Reveal: clip up + settle from 1.08.
        gsap.fromTo(
          el,
          { clipPath: "inset(14% 6% 14% 6% round 14px)", opacity: 0 },
          {
            clipPath: "inset(0% 0% 0% 0% round 14px)",
            opacity: 1,
            duration: 1.4,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
        gsap.fromTo(
          img,
          { scale: 1.08 },
          {
            scale: 1,
            duration: 1.6,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
      }

      if (parallax) {
        gsap.fromTo(
          img,
          { yPercent: -parallax / 2 },
          {
            yPercent: parallax / 2,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.8 },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, [reduced, parallax, reveal]);

  return (
    <div
      ref={wrap}
      data-cursor={cursor}
      className={`relative overflow-hidden ${FRAME[device]} ${className}`}
      style={reduced || !reveal ? undefined : { willChange: "clip-path, opacity" }}
    >
      <div ref={inner} className={`relative overflow-hidden ${RADIUS[device]} will-change-transform`}>
        <Image
          src={shot.src}
          alt={shot.alt}
          width={isPhone ? 760 : 1600}
          height={isPhone ? 1520 : 1000}
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className="h-auto w-full select-none"
        />
      </div>
      {shot.caption && (
        <p className="label absolute bottom-3 left-4 bg-ink/70 px-2 py-1 backdrop-blur-sm">{shot.caption}</p>
      )}
    </div>
  );
}
