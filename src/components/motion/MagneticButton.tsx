"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * MAGNETIC BUTTON
 * ───────────────
 * Within a radius the button drifts toward the pointer and the arrow leads it
 * slightly, so the two move at different rates. Spring settle on exit.
 *
 * Pull is deliberately small (max ~9px). Big magnets feel like a demo; small
 * ones feel like the button is made of something.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  external = false,
  variant = "solid",
  className = "",
  cursor,
  ariaLabel,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  external?: boolean;
  variant?: "solid" | "ghost";
  className?: string;
  cursor?: string;
  ariaLabel?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLSpanElement>(null);
  const arrow = useRef<HTMLSpanElement>(null);
  const { touch, tier } = useDeviceTier();
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = wrap.current;
    // Capture now — reading .current inside the cleanup closure would see a
    // possibly-different node by the time it runs.
    const innerEl = inner.current;
    const arrowEl = arrow.current;
    if (!el || touch || reduced || tier === "mobile") return;

    const RADIUS = 90;
    const PULL = 0.28;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > RADIUS + Math.max(r.width, r.height) / 2) return;

      gsap.to(el, { x: dx * PULL, y: dy * PULL, duration: 0.5, ease: "power3.out" });
      gsap.to(innerEl, { x: dx * PULL * 0.35, y: dy * PULL * 0.35, duration: 0.5, ease: "power3.out" });
      gsap.to(arrowEl, { x: dx * PULL * 0.7, duration: 0.5, ease: "power3.out" });
    };

    const reset = () => {
      gsap.to([el, innerEl, arrowEl], {
        x: 0,
        y: 0,
        duration: 0.9,
        ease: "elastic.out(1, 0.55)",
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
      gsap.killTweensOf([el, innerEl, arrowEl]);
    };
  }, [touch, reduced, tier]);

  const base =
    "group relative inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-[13px] font-medium tracking-[-0.01em] transition-colors duration-500";
  const skin =
    variant === "solid"
      ? "bg-accent text-ink hover:bg-paper"
      : "border border-line text-paper hover:border-accent hover:text-accent";

  const body = (
    <>
      <span ref={inner} className="relative z-10 inline-block">
        {children}
      </span>
      <span ref={arrow} aria-hidden className="relative z-10 inline-block text-[15px] leading-none">
        →
      </span>
    </>
  );

  const props = {
    className: `${base} ${skin} ${className}`,
    "data-cursor": cursor ?? "",
    "aria-label": ariaLabel,
  };

  return (
    <div ref={wrap} className="inline-block will-change-transform">
      {href ? (
        external ? (
          <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
            {body}
          </a>
        ) : (
          <Link href={href} {...props}>
            {body}
          </Link>
        )
      ) : (
        <button type="button" onClick={onClick} {...props}>
          {body}
        </button>
      )}
    </div>
  );
}
