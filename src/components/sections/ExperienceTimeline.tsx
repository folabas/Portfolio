"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ChapterLabel } from "@/components/layout/ScrollProgress";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { experience, hasRealExperience } from "@/data/experience";

/**
 * EXPERIENCE TIMELINE
 * ───────────────────
 * The spine draws itself as the section scrolls (scaleY scrub), entries enter
 * from alternating sides, and each node pops when the line reaches it.
 *
 * Every row currently in the data is a placeholder and says so — see
 * src/data/experience.ts. The disclaimer and the badges disappear on their own
 * once real entries replace them.
 */
export function ExperienceTimeline() {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !section.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".xp-spine",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top",
          scrollTrigger: {
            trigger: ".xp-list",
            start: "top 68%",
            end: "bottom 72%",
            scrub: 0.6,
          },
        }
      );

      gsap.utils.toArray<HTMLElement>(".xp-row").forEach((row, i) => {
        gsap.fromTo(
          row,
          { opacity: 0, x: i % 2 ? 48 : -48, filter: "blur(6px)" },
          {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: row, start: "top 84%", once: true },
            onComplete: () => {
              row.style.filter = "";
              row.style.willChange = "auto";
            },
          }
        );

        gsap.fromTo(
          row.querySelector(".xp-node"),
          { scale: 0 },
          {
            scale: 1,
            duration: 0.6,
            ease: "back.out(2.4)",
            scrollTrigger: { trigger: row, start: "top 80%", once: true },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={section} id="experience" className="relative px-5 py-[12vh] md:px-10" aria-label="Experience">
      <div className="mx-auto max-w-[1240px]">
        <ChapterLabel index={5} label="Experience" id="experience" />

        <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
          <h2 className="display text-[clamp(1.9rem,5vw,4rem)] text-paper">
            The <span className="text-accent">timeline.</span>
          </h2>

          {!hasRealExperience && (
            <p className="max-w-[44ch] rounded-md border border-dashed border-line px-4 py-3 text-[12.5px] leading-relaxed text-muted">
              <span className="label label-accent mb-1 block">Placeholder content</span>
              These entries are dummy data standing in for the real timeline. Replace them in{" "}
              <code className="font-mono text-[11.5px] text-paper/80">src/data/experience.ts</code> — this
              notice removes itself once they are real.
            </p>
          )}
        </div>

        <div className="xp-list relative mt-16 pl-8 md:pl-0">
          {/* spine */}
          <span
            aria-hidden
            className="absolute left-[3px] top-2 h-full w-px bg-line md:left-1/2 md:-translate-x-1/2"
          >
            <span className="xp-spine absolute inset-0 block origin-top bg-accent" style={{ transform: "scaleY(0)" }} />
          </span>

          <ol className="space-y-14 md:space-y-20">
            {experience.map((e, i) => (
              <li
                key={`${e.year}-${i}`}
                className={`xp-row relative md:grid md:grid-cols-2 md:gap-14 ${
                  i % 2 ? "md:[&>*:first-child]:col-start-2" : ""
                }`}
                style={reduced ? undefined : { willChange: "transform, opacity" }}
              >
                <div className={i % 2 ? "md:text-left" : "md:text-right"}>
                  <span
                    aria-hidden
                    className="xp-node absolute -left-8 top-1.5 block h-2.5 w-2.5 rounded-full bg-accent md:left-1/2 md:-translate-x-1/2"
                  />

                  <div className="flex items-center gap-3 md:justify-start" style={i % 2 ? undefined : { justifyContent: "inherit" }}>
                    <span className="font-mono text-[11px] tracking-[0.18em] text-accent">{e.year}</span>
                    {e.placeholder && (
                      <span className="label rounded-full border border-dashed border-line px-2 py-0.5 text-[8.5px] text-muted-2">
                        placeholder
                      </span>
                    )}
                  </div>

                  <h3 className="mt-2 font-display text-[clamp(1.15rem,2.4vw,1.7rem)] uppercase tracking-[-0.02em] text-paper">
                    {e.role}
                  </h3>
                  <p className="mt-1 text-[13px] text-muted">{e.company}</p>
                  <p className="mt-3 max-w-[46ch] text-[13.5px] leading-relaxed text-paper/70 md:inline-block">
                    {e.description}
                  </p>

                  <ul className={`mt-4 flex flex-wrap gap-2 ${i % 2 ? "" : "md:justify-end"}`}>
                    {e.technologies.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-line px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
