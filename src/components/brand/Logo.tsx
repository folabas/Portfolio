"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * THE MARK — "Aperture"
 * ─────────────────────
 * Three blades rotating around a core.
 *
 * The geometry is deliberately the same idea as the hero WebGL object: a
 * structure assembled from separate panels around a centre, rather than a
 * single solid shape. That is the whole thesis of the site — things built out
 * of parts — so the logo states it at 20px and the hero restates it at 600px.
 *
 * The three blades carry different opacities, which reads as depth rather than
 * decoration. It also makes rotation legible: a 120° turn lands on identical
 * geometry but permutes the shading, so the click easter egg actually shows.
 *
 * Drawn on a 24×24 grid with a 9.5 outer / 3.6 inner radius and 40° gaps —
 * wide enough that the counter stays open when the mark is scaled down to
 * favicon size.
 */

/** One annular sector, 80° wide, centred on the +x axis. */
const BLADE =
  "M14.758 9.685 L19.277 5.891 A9.5 9.5 0 0 1 19.277 18.109 L14.758 14.315 A3.6 3.6 0 0 0 14.758 9.685 Z";

const BLADES = [
  { rotate: 0, opacity: 1 },
  { rotate: 120, opacity: 0.68 },
  { rotate: 240, opacity: 0.42 },
];

export function Logo({
  size = 22,
  className = "",
  interactive = true,
}: {
  size?: number;
  className?: string;
  interactive?: boolean;
}) {
  const blades = useRef<SVGGElement>(null);
  const core = useRef<SVGCircleElement>(null);
  const reduced = useReducedMotion();

  /** Easter egg: one symmetry step. Same shape, redistributed depth. */
  const spin = () => {
    if (reduced || !interactive) return;
    gsap.to(blades.current, {
      rotate: "+=120",
      transformOrigin: "50% 50%",
      duration: 1.1,
      ease: "expo.inOut",
    });
    gsap.fromTo(
      core.current,
      { scale: 1, transformOrigin: "50% 50%" },
      { scale: 1.9, duration: 0.28, ease: "power2.out", yoyo: true, repeat: 1 }
    );
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      onClick={spin}
      className={`shrink-0 overflow-visible ${interactive ? "group/logo" : ""} ${className}`}
    >
      <g
        ref={blades}
        className={
          interactive && !reduced
            ? "origin-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[18deg]"
            : "origin-center"
        }
      >
        {BLADES.map((b) => (
          <path
            key={b.rotate}
            d={BLADE}
            fill="currentColor"
            opacity={b.opacity}
            transform={`rotate(${b.rotate} 12 12)`}
            // Softens the sector's sharp corners without needing a second path.
            strokeWidth="1.1"
            stroke="currentColor"
            strokeLinejoin="round"
          />
        ))}
      </g>

      <circle
        ref={core}
        cx="12"
        cy="12"
        r="1.85"
        fill="var(--color-accent)"
        className={
          interactive && !reduced
            ? "origin-center transition-transform duration-500 group-hover:scale-125"
            : ""
        }
      />
    </svg>
  );
}

/**
 * WORDMARK
 * Given name in paper, family name dropped back — the same contrast the rest of
 * the site uses between a headline and its metadata.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-display text-[13px] uppercase leading-none tracking-[0.02em] ${className}`}
    >
      <span className="text-paper">Basit</span>{" "}
      <span className="text-paper/55">Olajide</span>
    </span>
  );
}

/**
 * Full lockup. `spaced` puts the mark and wordmark on a baseline together.
 */
export function LogoLockup({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <span className={`group/logo inline-flex items-center gap-2.5 ${className}`}>
      <Logo size={size} className="text-paper" />
      <Wordmark />
    </span>
  );
}
