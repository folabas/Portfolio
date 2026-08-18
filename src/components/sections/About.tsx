"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ChapterLabel } from "@/components/layout/ScrollProgress";
import { TextReveal, Reveal } from "@/components/motion/TextReveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { about, site } from "@/data/site";

/**
 * ABOUT
 * ─────
 * Editorial split: statement on the left, supporting detail on the right.
 * The portrait slot is an abstract placeholder that shifts under the pointer —
 * drop a real photograph at public/images/portrait.jpg and swap the `<figure>`
 * contents; nothing else needs to change.
 */
export function About() {
  const portrait = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { touch } = useDeviceTier();

  useEffect(() => {
    const el = portrait.current;
    if (!el || reduced || touch) return;

    const layers = el.querySelectorAll<HTMLElement>("[data-depth]");
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      layers.forEach((l) => {
        const d = Number(l.dataset.depth ?? 1);
        gsap.to(l, { x: x * 26 * d, y: y * 26 * d, duration: 0.9, ease: "power3.out" });
      });
    };
    const reset = () => gsap.to(layers, { x: 0, y: 0, duration: 1.1, ease: "power3.out" });

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
    };
  }, [reduced, touch]);

  return (
    <section id="about" className="relative px-5 py-[12vh] md:px-10" aria-label="About">
      <div className="mx-auto max-w-[1600px]">
        <ChapterLabel index={7} label="About" id="about" />

        <div className="mt-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          {/* left — statement */}
          <div>
            <TextReveal
              lines={about.headline}
              accentLines={about.accentLines as readonly number[]}
              className="display text-[clamp(1.9rem,5.2vw,4.4rem)] leading-[0.92] text-paper"
            />

            <Reveal className="mt-10 max-w-[54ch] space-y-5" delay={0.1}>
              {about.bio.map((p, i) => (
                <p key={i} className="body-lg">
                  {p}
                </p>
              ))}
            </Reveal>

            <Reveal className="mt-10 flex flex-wrap gap-3" delay={0.15}>
              <MagneticButton href={`mailto:${site.email}`} external cursor="EMAIL">
                Work with me
              </MagneticButton>
              <MagneticButton href={site.resume.href} external variant="ghost" cursor="OPEN ↗">
                {site.resume.label}
              </MagneticButton>
            </Reveal>
            {site.resume.placeholder && (
              <p className="label mt-3">Résumé link is a placeholder — add public{site.resume.href}</p>
            )}
          </div>

          {/* right — portrait + facts */}
          <div className="flex flex-col gap-8">
            <figure
              ref={portrait}
              data-cursor="EXPLORE"
              className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-line bg-ink-2"
            >
              {/* Replace this block with <Image src="/images/portrait.jpg" … /> */}
              <div
                data-depth="0.5"
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(70% 55% at 40% 30%, rgba(214,249,76,0.14) 0%, transparent 62%), linear-gradient(160deg, #16161c 0%, #0b0b0e 70%)",
                }}
              />
              <div
                data-depth="1.4"
                className="absolute left-1/2 top-1/2 h-[52%] w-[52%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/25"
              />
              <div
                data-depth="2.1"
                className="absolute left-1/2 top-1/2 h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ background: "linear-gradient(150deg, #23232b, #0d0d11)" }}
              />
              <div
                data-depth="0.8"
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent 0 3px, rgba(237,237,231,0.022) 3px 4px)",
                }}
              />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
                <span className="label">{site.name}</span>
                <span className="label">Portrait — placeholder</span>
              </figcaption>
            </figure>

            <Reveal>
              <dl className="divide-y divide-line border-y border-line">
                {about.facts.map((f) => (
                  <div key={f.k} className="grid grid-cols-[7rem_1fr] gap-4 py-3.5">
                    <dt className="label pt-0.5">{f.k}</dt>
                    <dd className="text-[13.5px] leading-relaxed text-paper/85">{f.v}</dd>
                  </div>
                ))}
              </dl>

              <ul className="mt-6 flex flex-wrap gap-2">
                {about.interests.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-line px-3 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-muted"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
