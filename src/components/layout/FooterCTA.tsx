"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { ChapterLabel } from "@/components/layout/ScrollProgress";
import { TextReveal } from "@/components/motion/TextReveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { footerCta, site } from "@/data/site";

/**
 * FOOTER — the final chapter
 * Giant statement, a marquee rule, then the actual contact detail. The arrow
 * tracks the pointer across the section so the last thing on the page still
 * responds to you.
 */
export function FooterCTA() {
  const section = useRef<HTMLElement>(null);
  const arrow = useRef<HTMLSpanElement>(null);
  const [copied, setCopied] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = section.current;
    if (!el || reduced) return;
    const on = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      gsap.to(arrow.current, {
        x: (e.clientX - r.left - r.width / 2) * 0.06,
        y: (e.clientY - r.top - r.height / 2) * 0.06,
        rotate: (e.clientX - r.left - r.width / 2) * 0.012,
        duration: 1,
        ease: "power3.out",
      });
    };
    el.addEventListener("pointermove", on);
    return () => el.removeEventListener("pointermove", on);
  }, [reduced]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <footer
      ref={section}
      id="contact"
      className="relative overflow-hidden border-t border-line px-5 pb-8 pt-[12vh] md:px-10"
    >
      <div className="mx-auto max-w-[1600px]">
        <ChapterLabel index={7} label="Contact" id="contact" />

        <div className="relative mt-10">
          <TextReveal
            lines={footerCta.lines}
            accentLines={[footerCta.accentLine]}
            className="display display-fluid text-paper"
          />
          <span
            ref={arrow}
            aria-hidden
            className="pointer-events-none absolute right-[4%] top-1/2 hidden -translate-y-1/2 text-[clamp(4rem,11vw,11rem)] leading-none text-accent lg:block"
          >
            ↘
          </span>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <MagneticButton onClick={copyEmail} cursor={copied ? "COPIED" : "COPY"}>
            {copied ? "Copied to clipboard" : site.email}
          </MagneticButton>
          <MagneticButton href={`mailto:${site.email}`} external variant="ghost" cursor="EMAIL">
            Open mail
          </MagneticButton>
        </div>

        {/* marquee rule */}
        <div className="mt-16 overflow-hidden border-y border-line py-3" aria-hidden>
          <div className="marquee-track">
            {Array.from({ length: 2 }).map((_, k) => (
              <span key={k} className="flex shrink-0">
                {["Fintech", "Marketplaces", "Mobile", "Machine learning", "Developer tooling", "Product"].map((w) => (
                  <span key={w} className="flex items-center">
                    <span className="px-6 font-display text-[13px] uppercase tracking-[0.08em] text-muted">{w}</span>
                    <span className="h-1 w-1 rounded-full bg-accent/60" />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-10 border-b border-line pb-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="label mb-3">Direct</p>
            <ul className="space-y-1.5">
              <li>
                <a href={`mailto:${site.email}`} className="text-[13.5px] text-paper/85 transition-colors hover:text-accent" data-cursor="EMAIL">
                  {site.email}
                </a>
              </li>
              <li>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="text-[13.5px] text-paper/85 transition-colors hover:text-accent">
                  {site.phone}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="label mb-3">Elsewhere</p>
            <ul className="space-y-1.5">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="OPEN ↗"
                    className="text-[13.5px] text-paper/85 transition-colors hover:text-accent"
                  >
                    {s.label} ↗
                    {s.placeholder && <span className="label ml-2 text-muted-2">todo</span>}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label mb-3">Based in</p>
            <p className="text-[13.5px] text-paper/85">{site.location}</p>
            <p className="text-[13.5px] text-muted">{site.timezone}</p>
          </div>

          <div>
            <p className="label mb-3">Status</p>
            <p className="flex items-center gap-2 text-[13.5px] text-paper/85">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {site.availability}
            </p>
            <p className="label mt-2">Press ⌘K anywhere</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-6">
          <p className="label">
            © {site.year} {site.name}
          </p>
          <p className="label">Built with Next.js · GSAP · Lenis · Three.js</p>
          <a href="#intro" className="label transition-colors hover:text-accent" data-cursor="TOP">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
