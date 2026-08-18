"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { metrics } from "@/data/site";

/**
 * METRICS
 * ───────
 * The first two are computed from the project data at build time, so they can
 * never drift out of sync with the work. The rest are unset placeholders and
 * render as an em dash rather than an invented number.
 */
export function Metrics() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !root.current) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count ?? 0);
        if (!target) return;
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.8,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(obj.v));
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section className="relative px-5 py-[8vh] md:px-10" aria-label="By the numbers">
      <div ref={root} className="mx-auto grid max-w-[1600px] grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="group bg-ink px-5 py-8 transition-colors duration-500 hover:bg-ink-2 md:px-7 md:py-10"
          >
            <p className="display text-[clamp(2.2rem,5.5vw,4rem)] leading-none text-paper">
              <span data-count={m.value}>0</span>
              {m.suffix}
            </p>
            <p className="label mt-4">{m.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
