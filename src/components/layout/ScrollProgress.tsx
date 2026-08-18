"use client";

import { useEffect, useRef, useState } from "react";
import { chapters } from "@/data/site";

/**
 * CHAPTER INDICATOR + PROGRESS
 * ────────────────────────────
 * Fixed in the left margin: current chapter number, a hairline that fills with
 * page progress, and the chapter label. Driven by one IntersectionObserver over
 * the section elements plus a passive scroll listener writing a CSS variable —
 * no per-frame React state.
 */
export function ScrollProgress() {
  const [active, setActive] = useState(0);
  const line = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const sections = chapters
      .map((c) => document.getElementById(c.id))
      .filter(Boolean) as HTMLElement[];

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const i = sections.indexOf(visible.target as HTMLElement);
        if (i >= 0) setActive(i);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5] }
    );
    sections.forEach((s) => io.observe(s));

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (line.current) line.current.style.transform = `scaleY(${Math.min(1, Math.max(0, p))})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <aside
      aria-hidden
      className="pointer-events-none fixed left-5 top-1/2 z-[400] hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex"
    >
      <span className="font-mono text-[10px] tracking-[0.2em] text-accent">
        {String(active + 1).padStart(2, "0")}
      </span>

      <span className="relative block h-28 w-px bg-line">
        <span
          ref={line}
          className="absolute inset-x-0 top-0 h-full origin-top bg-accent will-change-transform"
          style={{ transform: "scaleY(0)" }}
        />
      </span>

      <span className="font-mono text-[10px] tracking-[0.2em] text-muted">
        {String(chapters.length).padStart(2, "0")}
      </span>

      <span
        className="mt-2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.22em] text-muted"
        style={{ writingMode: "vertical-rl" }}
      >
        {chapters[active]?.label}
      </span>
    </aside>
  );
}

/**
 * Per-section chapter header. Hovering the number reveals the section id —
 * a small piece of implementation metadata for anyone who goes looking.
 */
export function ChapterLabel({
  index,
  label,
  id,
  className = "",
}: {
  index: number;
  label: string;
  id: string;
  className?: string;
}) {
  return (
    <div className={`group flex items-center gap-4 ${className}`}>
      <span className="font-mono text-[10px] tracking-[0.2em] text-accent">
        {String(index).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}
      </span>
      <span className="h-px w-10 bg-line transition-all duration-500 group-hover:w-16 group-hover:bg-accent" />
      <span className="label">{label}</span>
      <span className="label opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        #{id}
      </span>
    </div>
  );
}
