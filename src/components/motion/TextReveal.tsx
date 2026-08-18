"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * MASKED LINE REVEAL
 * ──────────────────
 * Each line sits inside its own overflow-hidden box and slides up from 105%.
 * Lines are authored as an array rather than split at runtime, so the reveal is
 * deterministic and there is no layout thrash from measuring text.
 *
 * Under reduced motion the lines render in place — the content is never hidden
 * behind an animation that will not run.
 */
export function TextReveal({
  lines,
  as = "h2",
  className = "",
  lineClassName = "",
  accentLines = [] as readonly number[],
  stagger = 0.09,
  delay = 0,
  start = "top 82%",
  trigger = true,
}: {
  lines: readonly string[];
  as?: "h1" | "h2" | "h3" | "p" | "div";
  className?: string;
  lineClassName?: string;
  accentLines?: readonly number[];
  stagger?: number;
  delay?: number;
  start?: string;
  /** false = play on mount (hero), true = play when scrolled into view */
  trigger?: boolean;
}) {
  const root = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !root.current) return;
    const el = root.current;
    const targets = el.querySelectorAll<HTMLElement>(".reveal-line");

    const tween = gsap.to(targets, {
      y: "0%",
      duration: 1.15,
      ease: "expo.out",
      stagger,
      delay,
      ...(trigger
        ? { scrollTrigger: { trigger: el, start, once: true } }
        : {}),
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reduced, stagger, delay, start, trigger]);

  const content = lines.map((line, i) => (
    <span key={i} className="reveal-mask">
      <span
        className={`reveal-line ${lineClassName} ${accentLines.includes(i) ? "text-accent" : ""}`}
        style={reduced ? { transform: "none" } : undefined}
      >
        {line}
      </span>
    </span>
  ));

  // Explicit branches rather than a polymorphic <Tag>: a generic ElementType
  // collapses the ref prop to `never` under TypeScript, and casting around that
  // loses the element type the ref actually needs.
  const props = { ref: root, className };
  switch (as) {
    case "h1":
      return <h1 {...props}>{content}</h1>;
    case "h3":
      return <h3 {...props}>{content}</h3>;
    case "p":
      return <p {...props}>{content}</p>;
    case "div":
      return <div {...props}>{content}</div>;
    default:
      return <h2 {...props}>{content}</h2>;
  }
}

/**
 * CHARACTER STAGGER
 * Reserved for short strings — section eyebrows and the loader. Splitting a
 * paragraph into spans is a DOM-node tax with no payoff.
 */
export function SplitText({
  text,
  className = "",
  delay = 0,
  trigger = true,
}: {
  text: string;
  className?: string;
  delay?: number;
  trigger?: boolean;
}) {
  const root = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !root.current) return;
    const chars = root.current.querySelectorAll<HTMLElement>("[data-char]");
    const tween = gsap.fromTo(
      chars,
      { yPercent: 120, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.7,
        ease: "expo.out",
        stagger: 0.022,
        delay,
        ...(trigger ? { scrollTrigger: { trigger: root.current, start: "top 88%", once: true } } : {}),
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reduced, delay, trigger]);

  if (reduced) return <span className={className}>{text}</span>;

  return (
    <span ref={root} className={`inline-flex overflow-hidden ${className}`} aria-label={text}>
      {[...text].map((c, i) => (
        <span key={i} data-char aria-hidden className="inline-block will-change-transform">
          {c === " " ? " " : c}
        </span>
      ))}
    </span>
  );
}

/**
 * GENERIC ENTRANCE
 * translateY + blur + fade. Used for metadata and paragraphs where a masked
 * line reveal would be too loud.
 */
export function Reveal({
  children,
  className = "",
  y = 26,
  delay = 0,
  blur = true,
  start = "top 86%",
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  blur?: boolean;
  start?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    const el = ref.current;
    const tween = gsap.fromTo(
      el,
      { y, opacity: 0, filter: blur ? "blur(8px)" : "none" },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.05,
        ease: "expo.out",
        delay,
        scrollTrigger: { trigger: el, start, once: true },
        onComplete: () => {
          // Drop the filter entirely — a lingering blur(0) keeps a layer alive.
          el.style.filter = "";
          el.style.willChange = "auto";
        },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reduced, y, delay, blur, start]);

  return (
    <div ref={ref} className={className} style={reduced ? undefined : { willChange: "transform, opacity" }}>
      {children}
    </div>
  );
}

export { ScrollTrigger };
