"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ChapterLabel } from "@/components/layout/ScrollProgress";
import { ProjectImage } from "@/components/project/ProjectImage";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { featuredProjects } from "@/data/projects";

/**
 * FEATURED WORK — the cinematic sequence
 * ──────────────────────────────────────
 * The stage sticks to the viewport and each project cross-dissolves into the
 * next: the outgoing visual scales down and lifts, the incoming one rises from
 * 1.06, the index advances, and the background tint shifts to the project's
 * accent.
 *
 * PINNING IS CSS `position: sticky`, NOT ScrollTrigger's `pin`.
 * ScrollTrigger's pin physically moves the element into a generated
 * `.pin-spacer` wrapper. That is fine until React unmounts the tree on a route
 * change — React then calls removeChild against the *original* parent, the node
 * is no longer there, and you get:
 *
 *     NotFoundError: Failed to execute 'removeChild' on 'Node'
 *
 * Sticky reaches the same result with zero DOM mutation, so navigation is safe
 * and the layout is deterministic. ScrollTrigger is still used — but only to
 * scrub a timeline, never to restructure the document.
 *
 * On tablet and mobile the same data renders as a stacked scroll. The content
 * and hierarchy are identical; only the choreography differs.
 */
export function FeaturedWork() {
  const { tier, ready } = useDeviceTier();
  const reduced = useReducedMotion();
  const cinematic = ready && tier === "desktop" && !reduced;

  return (
    <section id="work" className="relative" aria-label="Selected work">
      <div className="px-5 pt-[12vh] md:px-10">
        <div className="mx-auto max-w-[1600px]">
          <ChapterLabel index={2} label="Selected work" id="work" />
          <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
            <h2 className="display max-w-[13ch] text-[clamp(2rem,5.6vw,4.6rem)] text-paper">
              Products, not
              <br />
              <span className="text-accent">portfolio pieces.</span>
            </h2>
            <p className="body-lg max-w-[38ch]">
              Seven builds where I owned the product surface end to end — the payment rail,
              the verification, the model, and the pixels on top.
            </p>
          </div>
        </div>
      </div>

      {cinematic ? <CinematicRail /> : <StackedRail />}
    </section>
  );
}

/* ── desktop: sticky stage, scrubbed cross-dissolve ─────────────────── */

const TOTAL = featuredProjects.length;
/** Viewport heights of scroll per project. Higher = slower, more deliberate. */
const PER_SLIDE_VH = 95;

/**
 * TIMELINE SHAPE (in abstract timeline units)
 *
 *   ├── HOLD ──┤├ EXIT ┤
 *              ├─ 0.3 ─┤├──── ENTER ────┤
 *   project 1 still     project 2 arriving
 *
 * The exit leads the enter rather than running with it. A true simultaneous
 * cross-fade leaves both full-bleed layouts on screen at ~50% for a third of
 * every transition, which reads as two projects stacked on top of each other
 * rather than one replacing another.
 */
const HOLD = 1;         // stillness on each project
const EXIT = 0.45;      // outgoing project leaves
const ENTER_AT = 0.3;   // incoming starts this long after the exit begins
const ENTER = 0.55;     // incoming project arrives
const SWAP = ENTER_AT + ENTER;   // full length of one transition
const CYCLE = HOLD + SWAP;       // hold + transition, per project

function CinematicRail() {
  const wrap = useRef<HTMLDivElement>(null);
  const tint = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!wrap.current) return;

    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray<HTMLElement>(".fw-slide");

      // Explicit resting state for every slide. Without this a slide that has
      // not been reached yet inherits nothing and paints on top of the active
      // one — which is exactly the "stacked on project 3" symptom.
      slides.forEach((s, i) => {
        gsap.set(s, {
          autoAlpha: i === 0 ? 1 : 0,
          scale: i === 0 ? 1 : 1.06,
          yPercent: i === 0 ? 0 : 6,
        });
      });
      gsap.set(tint.current, { backgroundColor: featuredProjects[0].accent });

      // Start of transition i (the swap from project i-1 to project i).
      const swapAt = (i: number) => (i - 1) * CYCLE + HOLD;
      // Half a beat on the last project, then release. A full HOLD here reads
      // as ~2 viewport heights of dead scroll before the section lets go.
      const TAIL = 0.5;
      const totalTime = swapAt(TOTAL - 1) + SWAP + TAIL;
      // Midpoints drive the counter, so the number flips when the swap reads as
      // committed rather than the instant it starts.
      const midpoints = Array.from({ length: TOTAL - 1 }, (_, k) => swapAt(k + 1) + SWAP / 2);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          // The sticky child releases when the wrapper's bottom reaches the
          // bottom of the viewport, so the timeline must end at the same point.
          end: "bottom bottom",
          scrub: 0.7,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const t = self.progress * totalTime;
            const i = midpoints.filter((m) => t >= m).length;
            if (counter.current) counter.current.textContent = String(i + 1).padStart(2, "0");
          },
        },
      });

      slides.forEach((slide, i) => {
        if (i === 0) return;
        const at = swapAt(i);

        tl.to(
          slides[i - 1],
          { autoAlpha: 0, scale: 0.94, yPercent: -6, duration: EXIT, ease: "power2.in" },
          at
        )
          .to(
            slide,
            { autoAlpha: 1, scale: 1, yPercent: 0, duration: ENTER, ease: "power2.out" },
            at + ENTER_AT
          )
          .to(
            tint.current,
            { backgroundColor: featuredProjects[i].accent, duration: SWAP, ease: "none" },
            at
          )
          .to(".fw-progress", { scaleX: (i + 1) / TOTAL, duration: SWAP, ease: "none" }, at);
      });

      // Trailing hold so the last project is readable before the stage releases.
      tl.set({}, {}, totalTime);
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrap} className="relative mt-16" style={{ height: `${TOTAL * PER_SLIDE_VH}svh` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        <div ref={tint} className="pointer-events-none absolute inset-0 z-0 opacity-[0.06]" />

        {/* fixed chrome */}
        <div className="relative z-20 flex items-center justify-between px-10 pt-6">
          <span className="label">
            Project <span ref={counter} className="text-accent">01</span> /{" "}
            {String(TOTAL).padStart(2, "0")}
          </span>
          <span className="label">Scroll to advance</span>
        </div>
        <div className="relative z-20 mx-10 mt-4 h-px bg-line">
          <span
            className="fw-progress absolute inset-0 origin-left bg-accent"
            style={{ transform: `scaleX(${1 / TOTAL})` }}
          />
        </div>

        <div className="relative z-10 flex-1">
          {featuredProjects.map((p) => (
            <article
              key={p.slug}
              className="fw-slide absolute inset-0 grid grid-cols-[0.85fr_1.15fr] items-center gap-12 px-10 pb-10 pt-6 xl:gap-20"
            >
              <div className="flex flex-col justify-center">
                <span className="label mb-4" style={{ color: p.accent }}>
                  {p.typeLine}
                </span>
                <h3 className="display text-[clamp(2.2rem,4.4vw,4.2rem)] leading-[0.9] text-paper">
                  {p.title}
                </h3>
                <p className="body-lg mt-5 max-w-[42ch]">{p.description}</p>

                <dl className="mt-8 grid max-w-[34rem] grid-cols-2 gap-x-8 gap-y-4 border-t border-line pt-6">
                  <Meta k="Role" v={p.role} />
                  <Meta k="Platform" v={p.platform} />
                  <Meta k="Year" v={p.year} />
                  <Meta k="Stack" v={p.stack.slice(0, 3).join(" · ")} />
                </dl>

                <Link
                  href={`/work/${p.slug}`}
                  data-cursor="VIEW PROJECT"
                  className="group mt-8 inline-flex w-max items-center gap-3 border-b border-line pb-1 text-[13px] text-paper transition-colors hover:border-accent"
                >
                  Read the case study
                  <span className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
                </Link>
              </div>

              <Link href={`/work/${p.slug}`} data-cursor="VIEW PROJECT" className="relative block">
                {/*
                  reveal={false}: the slide transition above already owns this
                  image's entrance. A second ScrollTrigger measuring a slide that
                  is absolutely positioned inside a sticky stage resolves against
                  the wrong scroll position and leaves images half-revealed.
                */}
                <ProjectImage
                  shot={p.hero}
                  reveal={false}
                  sizes="(max-width: 1024px) 90vw, 52vw"
                  className={p.hero.device === "phone" ? "mx-auto max-h-[68svh] w-auto" : "w-full"}
                />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── tablet + mobile: stacked, no sticky ────────────────────────────── */

function StackedRail() {
  return (
    <div className="mt-12 space-y-24 px-5 md:px-10">
      {featuredProjects.map((p, i) => (
        <article key={p.slug} className="mx-auto max-w-[1600px]">
          <div className="mb-4 flex items-center justify-between">
            <span className="label" style={{ color: p.accent }}>
              {p.typeLine}
            </span>
            <span className="label">
              {String(i + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
            </span>
          </div>

          <Link href={`/work/${p.slug}`} className="block">
            <ProjectImage
              shot={p.hero}
              parallax={8}
              sizes="(max-width: 768px) 92vw, 88vw"
              className={p.hero.device === "phone" ? "mx-auto w-[72%] max-w-[340px]" : "w-full"}
            />
          </Link>

          <h3 className="display mt-6 text-[clamp(1.9rem,7vw,3rem)] text-paper">{p.title}</h3>
          <p className="body-lg mt-3 max-w-[52ch]">{p.description}</p>

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-5">
            <Meta k="Role" v={p.role} />
            <Meta k="Platform" v={p.platform} />
            <Meta k="Year" v={p.year} />
            <Meta k="Stack" v={p.stack.slice(0, 3).join(" · ")} />
          </dl>

          <Link
            href={`/work/${p.slug}`}
            className="mt-6 inline-flex items-center gap-3 border-b border-line pb-1 text-[13px] text-paper"
          >
            Read the case study <span>→</span>
          </Link>
        </article>
      ))}
    </div>
  );
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="label mb-1">{k}</dt>
      <dd className="text-[13px] leading-snug text-paper/85">{v}</dd>
    </div>
  );
}
