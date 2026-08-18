"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ChapterLabel } from "@/components/layout/ScrollProgress";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { projects } from "@/data/projects";

/**
 * HORIZONTAL RAIL — the signature scroll moment
 * ─────────────────────────────────────────────
 * Vertical scroll drives the track sideways while the stage sticks. Used
 * exactly once on the site; a second one would make it a gimmick.
 *
 * Like FeaturedWork, the stage is held by CSS `position: sticky` rather than
 * ScrollTrigger's `pin`. Pin physically moves the element into a generated
 * `.pin-spacer` wrapper, which breaks React's unmount on a route change with
 * "Failed to execute 'removeChild' on 'Node'". ScrollTrigger here only scrubs
 * the track's x — it never restructures the document.
 *
 * The wrapper's height is measured from the track width, so the rail travels
 * exactly its own length and no further.
 *
 * Touch devices get a native swipe rail instead. Hijacking touch scroll to move
 * an axis the finger is not on is the fastest way to break a phone experience.
 */

const RAIL = projects.filter((p) => !p.featured).slice(0, 10);

export function HorizontalGallery() {
  const { tier, ready } = useDeviceTier();
  const reduced = useReducedMotion();
  const sticky = ready && tier !== "mobile" && !reduced;

  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sticky || !wrap.current || !track.current) return;

    const wrapEl = wrap.current;
    const trackEl = track.current;

    const ctx = gsap.context(() => {
      // Travel = how far the track overhangs the viewport, plus the gutter.
      const distance = () => Math.max(0, trackEl.scrollWidth - window.innerWidth + 80);

      // The wrapper must supply that much scroll, plus one viewport for the
      // sticky stage itself.
      const setHeight = () => {
        wrapEl.style.height = `${distance() + window.innerHeight}px`;
      };
      setHeight();

      gsap.to(trackEl, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: wrapEl,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          invalidateOnRefresh: true,
          onRefresh: setHeight,
        },
      });
    }, wrap);

    return () => {
      ctx.revert();
      wrapEl.style.height = "";
    };
  }, [sticky]);

  const cards = (
    <>
      {RAIL.map((p, i) => (
        <Link
          key={p.slug}
          href={`/work/${p.slug}`}
          data-cursor="VIEW PROJECT"
          className="rail-card group relative flex w-[80vw] shrink-0 snap-start flex-col sm:w-[56vw] lg:w-[36vw] xl:w-[30vw]"
        >
          <div className="relative overflow-hidden rounded-lg border border-line bg-ink-2">
            <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.accent }} />
              <span className="label">{String(i + 1).padStart(2, "0")}</span>
            </div>

            <Image
              src={p.hero.src}
              alt={p.hero.alt}
              width={p.hero.device === "phone" ? 760 : 1600}
              height={p.hero.device === "phone" ? 1520 : 1000}
              sizes="(max-width: 640px) 80vw, (max-width: 1024px) 56vw, 32vw"
              className="aspect-[4/3] w-full object-cover object-top transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            />

            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              style={{ background: `linear-gradient(to top, ${p.accent}22, transparent 55%)` }}
            />
          </div>

          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-lg uppercase tracking-[-0.02em] text-paper transition-transform duration-500 group-hover:translate-x-1">
                {p.title}
              </h3>
              <p className="label mt-1.5">{p.typeLine}</p>
            </div>
            <span className="mt-1 text-muted transition-all duration-500 group-hover:translate-x-1 group-hover:text-accent">
              ↗
            </span>
          </div>

          <p className="mt-3 max-w-[42ch] text-[13.5px] leading-relaxed text-muted">{p.tagline}</p>
        </Link>
      ))}

      {/* Rail end card */}
      <div className="rail-card flex w-[70vw] shrink-0 snap-start items-center sm:w-[40vw] lg:w-[26vw]">
        <div>
          <p className="label mb-4">End of rail</p>
          <Link
            href="/#all"
            className="display block text-[clamp(1.6rem,3.4vw,2.6rem)] text-paper transition-colors hover:text-accent"
            data-cursor="BROWSE"
          >
            See the
            <br />
            full index →
          </Link>
        </div>
      </div>
    </>
  );

  return (
    <section id="archive" className="relative pt-[10vh]" aria-label="More work">
      <div className="px-5 md:px-10">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-end justify-between gap-6">
          <div>
            <ChapterLabel index={3} label="Archive" id="archive" />
            <h2 className="display mt-6 text-[clamp(1.9rem,5vw,4rem)] text-paper">
              Everything else
              <br />
              <span className="text-muted">worth showing.</span>
            </h2>
          </div>
          <p className="label hidden lg:block">
            {sticky ? "Scroll ↓ moves the rail →" : "Swipe →"}
          </p>
        </div>
      </div>

      {sticky ? (
        // Height is assigned from the track width in the effect above.
        <div ref={wrap} className="relative mt-12">
          <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
            <div ref={track} className="flex w-max gap-6 px-5 will-change-transform md:px-10">
              {cards}
            </div>
          </div>
        </div>
      ) : (
        <div
          className="no-bar mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 md:px-10"
          data-cursor="DRAG"
        >
          {cards}
        </div>
      )}
    </section>
  );
}
