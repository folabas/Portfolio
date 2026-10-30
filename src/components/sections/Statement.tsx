"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { statement } from "@/data/site";

/**
 * IDENTITY STATEMENT
 * ──────────────────
 * One sentence, revealed line by line against a pinned label. Typography is the
 * only animation here — no cards, no icons. The section earns its length by
 * saying one thing clearly.
 */
export function Statement() {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !section.current) return;
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>(".statement-line");

      // Lines brighten in sequence as the section passes through the viewport,
      // scrubbed so scrolling back dims them again.
      gsap.fromTo(
        lines,
        { opacity: 0.14, filter: "blur(3px)" },
        {
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top 72%",
            end: "bottom 62%",
            scrub: 0.7,
          },
        }
      );
    }, section);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={section}
      id="statement"
      className="relative px-5 py-[18vh] md:px-10"
      aria-label="What I build"
    >
      <div className="mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-[auto_1fr] lg:gap-20">
        <p className="label lg:sticky lg:top-[45vh] lg:h-max">(Identity)</p>

        <h2 className="display max-w-[16ch] text-[clamp(2.1rem,6.6vw,5.6rem)] leading-[0.92] text-paper">
          {statement.lines.map((line, i) => (
            <span
              key={i}
              className={`statement-line block ${
                (statement.accentLines as readonly number[]).includes(i) ? "text-accent" : ""
              }`}
              style={reduced ? undefined : { willChange: "opacity, filter" }}
            >
              {line}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
