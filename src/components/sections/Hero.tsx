"use client";

import { TextReveal, Reveal } from "@/components/motion/TextReveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { HeroBackdrop } from "@/components/sections/HeroBackdrop";
import { hero, site } from "@/data/site";

/**
 * HERO
 * ────
 * Type over a painted backdrop. No WebGL object, no metadata rail.
 *
 * The backdrop (see HeroBackdrop) is static by design — it gives the type
 * something to sit on without becoming the thing you look at. The brief for
 * this page is "show the work as quickly as possible", and anything that moves
 * up here competes with the one sentence that has to land. The hero is
 * deliberately shorter than a viewport on desktop so the first row of projects
 * is already visible without scrolling.
 *
 * There is also no scroll-linked exit choreography. The hero used to shrink and
 * slide out as you left it, which meant the projects section arrived underneath
 * a moving object. Now it simply scrolls away.
 */
export function Hero() {
  return (
    <section
      id="intro"
      className="relative px-5 pb-[8vh] pt-32 md:px-10 md:pb-[10vh] md:pt-40"
      aria-label="Introduction"
    >
      <HeroBackdrop />

      <div className="relative z-10 mx-auto max-w-[1600px]">
        <TextReveal
          lines={hero.lines}
          as="h1"
          trigger={false}
          delay={0.25}
          accentLines={[hero.accentLine]}
          className="display display-fluid max-w-[15ch] text-paper"
        />

        <div className="mt-8 grid gap-8 border-t border-line pt-7 md:mt-10 md:grid-cols-[1.2fr_auto] md:items-end md:gap-16">
          <p className="body-lg max-w-[52ch]">{hero.standfirst}</p>

          {/* gap-4, not gap-3: the magnetic pull is up to ~25px, and at 12px
              two pills can visibly touch as the pointer passes between them. */}
          <Reveal className="flex flex-wrap items-center gap-4" delay={0.1}>
            <MagneticButton href="/#projects" cursor="VIEW WORK">
              See the work
            </MagneticButton>
            <MagneticButton href={`mailto:${site.email}`} external variant="ghost" cursor="SAY HELLO">
              Get in touch
            </MagneticButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
