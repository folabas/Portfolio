"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { TextReveal } from "@/components/motion/TextReveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMouse } from "@/hooks/useMouse";
import { hero, site } from "@/data/site";

/* WebGL is code-split and only requested on devices that will run it well. */
const ThreeHero = dynamic(() => import("@/components/three/ThreeHero"), { ssr: false });

export function Hero() {
  const { canRun3D, ready, tier } = useDeviceTier();
  const reduced = useReducedMotion();
  const mouse = useMouse(ready && canRun3D);
  const pointer = useRef({ x: 0, y: 0 });

  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);

  const show3D = ready && canRun3D && !reduced;

  /* Feed pointer into the scene without re-rendering React. */
  useEffect(() => {
    if (!show3D) return;
    let raf = 0;
    const loop = () => {
      pointer.current.x = mouse.current.nx;
      pointer.current.y = mouse.current.ny;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [show3D, mouse]);

  /**
   * Exit choreography — the hero hands off to the next section rather than
   * ending. The object shrinks and slides right while the copy lifts and fades,
   * both scrubbed to scroll so the handoff is reversible.
   */
  useEffect(() => {
    if (reduced || !section.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
      tl.to(stage.current, { scale: 0.62, xPercent: 22, yPercent: -6, rotate: 6, opacity: 0.25, ease: "none" }, 0);
      tl.to(copy.current, { yPercent: -22, opacity: 0, ease: "none" }, 0);
    }, section);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={section}
      id="intro"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-5 pb-10 pt-28 md:px-10 md:pb-14"
      aria-label="Introduction"
    >
      {/* 3D stage sits behind the type and never intercepts pointer events */}
      <div ref={stage} className="pointer-events-none absolute inset-0 z-0 will-change-transform">
        {show3D ? (
          <div className="absolute inset-0 translate-x-[8%] md:translate-x-[14%]">
            <ThreeHero pointer={pointer} />
          </div>
        ) : (
          <CssFallback simplified={tier === "mobile"} />
        )}
      </div>

      {/* Top metadata rail */}
      <div className="pointer-events-none absolute inset-x-5 top-24 z-10 hidden justify-between md:inset-x-10 lg:flex">
        <div className="space-y-1">
          <p className="label">{site.role}</p>
          <p className="label">
            {site.location} · {site.timezone}
          </p>
        </div>
        <div className="space-y-1 text-right">
          <p className="label">Portfolio — {site.year}</p>
          <p className="label label-accent">Scroll to begin</p>
        </div>
      </div>

      <div ref={copy} className="relative z-10 will-change-transform">
        <TextReveal
          lines={hero.lines}
          as="h1"
          trigger={false}
          delay={0.35}
          accentLines={[hero.accentLine]}
          className="display display-fluid max-w-[15ch] text-paper"
        />

        <div className="mt-8 grid gap-8 border-t border-line pt-7 md:mt-12 md:grid-cols-[1.2fr_auto] md:items-end md:gap-16">
          <p className="body-lg max-w-[52ch]">{hero.standfirst}</p>

          <div className="flex flex-wrap items-center gap-3">
            <MagneticButton href="/#work" cursor="VIEW WORK">
              Selected work
            </MagneticButton>
            <MagneticButton href="/#contact" variant="ghost" cursor="SAY HELLO">
              Get in touch
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
        <span className="label">Scroll</span>
        <span className="relative block h-10 w-px overflow-hidden bg-line">
          <span className="absolute inset-x-0 top-0 h-4 animate-[scroll-hint_2.2s_ease-in-out_infinite] bg-accent" />
        </span>
      </div>

      <style jsx>{`
        @keyframes scroll-hint {
          0% { transform: translateY(-100%); }
          60%, 100% { transform: translateY(280%); }
        }
      `}</style>
    </section>
  );
}

/**
 * Mobile / reduced-motion fallback.
 * Not "the 3D scene turned off" — a different composition that carries the same
 * idea (a structure made of parts) in two CSS-animated rings and a core.
 */
function CssFallback({ simplified }: { simplified: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
      <div className="relative aspect-square w-[86vw] max-w-[520px] translate-y-[-6%] md:w-[52vw]">
        <div
          className="absolute inset-0 rounded-full border border-accent/25"
          style={{ animation: simplified ? "none" : "spin 26s linear infinite" }}
        />
        <div
          className="absolute inset-[9%] rounded-full border border-paper/10"
          style={{ animation: simplified ? "none" : "spin 34s linear infinite reverse" }}
        />
        <div className="absolute inset-[26%] rounded-full border border-paper/[0.07]" />
        <div
          className="absolute inset-[38%] rounded-full"
          style={{
            background: "radial-gradient(circle at 34% 28%, #2a2a32 0%, #101014 58%, #08080a 100%)",
            boxShadow: "0 0 90px -20px rgba(214,249,76,0.22)",
          }}
        />
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 block h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-[1px] bg-paper/25"
            style={{
              transform: `rotate(${i * 20}deg) translateY(-${42 + (i % 3) * 4}%)`,
            }}
          />
        ))}
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
