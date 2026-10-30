"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { nav, site } from "@/data/site";
import { featuredProjects } from "@/data/projects";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { lockScroll, unlockScroll } from "@/lib/lenis";
import { Logo, Wordmark } from "@/components/brand/Logo";

/**
 * NAVBAR + FULLSCREEN MENU
 * ────────────────────────
 * The bar hides on scroll-down and returns on scroll-up. Only the links marked
 * `primary` in src/data/site.ts appear inline — the bar carries three, not the
 * whole site map, so it stays out of the way of the type. Everything is in the
 * fullscreen menu, which has staggered links and a preview that changes on
 * hover.
 *
 * The "available for work" status pill that used to sit next to the menu button
 * is gone: a blinking dot in the top-right corner of every page is exactly the
 * kind of thing that pulls attention off the work.
 */
export function Navbar() {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(0);
  const bar = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const reduced = useReducedMotion();

  /* hide on scroll down, show on scroll up */
  useEffect(() => {
    if (reduced) return;
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      const down = y > last && y > 160;
      gsap.to(bar.current, { yPercent: down ? -140 : 0, duration: 0.5, ease: "power3.out" });
      last = y;
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [reduced]);

  /* Close on route change. Adjusting state during render (rather than in an
     effect) is the documented pattern for "reset when a prop changes" — it
     avoids the extra commit an effect would cause. */
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  /* menu open/close */
  useEffect(() => {
    const el = panel.current;
    if (!el) return;

    if (open) {
      lockScroll();
      el.style.pointerEvents = "auto";
      if (reduced) {
        gsap.set(el, { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(".menu-line", { yPercent: 0, opacity: 1 });
      } else {
        gsap
          .timeline()
          .set(el, { opacity: 1 })
          .fromTo(
            el,
            { clipPath: "inset(0% 0% 100% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.72, ease: "power4.inOut" }
          )
          .fromTo(
            ".menu-line",
            { yPercent: 118 },
            { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.06 },
            "-=0.34"
          )
          .fromTo(".menu-meta", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05 }, "-=0.5");
      }
    } else {
      unlockScroll();
      el.style.pointerEvents = "none";
      if (reduced) {
        gsap.set(el, { opacity: 0 });
      } else {
        gsap.to(el, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.5,
          ease: "power4.inOut",
          onComplete: () => gsap.set(el, { opacity: 0 }),
        });
      }
    }
  }, [open, reduced]);

  /* escape closes */
  useEffect(() => {
    const on = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, []);

  return (
    <>
      <header
        ref={bar}
        className="fixed inset-x-0 top-0 z-[500] flex items-center justify-between px-5 py-5 mix-blend-difference md:px-10 md:py-7"
      >
        <Link
          href="/"
          className="group/logo flex items-center gap-2.5"
          data-cursor="HOME"
          aria-label={`${site.name}, home`}
        >
          <Logo className="text-paper" />
          <Wordmark className="hidden sm:block" />
        </Link>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
          {nav.filter((n) => n.primary).map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="group relative font-mono text-[10.5px] uppercase tracking-[0.16em] text-paper/75 transition-colors hover:text-paper"
            >
              {n.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-full origin-right scale-x-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            data-cursor={open ? "CLOSE" : "MENU"}
            className="flex h-8 w-8 flex-col items-end justify-center gap-[5px]"
          >
            <span
              className={`h-px bg-paper transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                open ? "w-6 translate-y-[3px] rotate-45" : "w-6"
              }`}
            />
            <span
              className={`h-px bg-paper transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                open ? "w-6 -translate-y-[3px] -rotate-45" : "w-4"
              }`}
            />
          </button>
        </div>
      </header>

      {/*
        Fullscreen menu.

        `data-lenis-prevent` is load-bearing: opening the menu calls lockScroll(),
        which stops Lenis — and a stopped Lenis still swallows wheel and touch
        events on the document. Without this attribute the panel cannot scroll
        even though it has overflow-y-auto. The attribute tells Lenis to ignore
        events originating inside, so this element scrolls natively while the
        page behind it stays frozen.
      */}
      <div
        ref={panel}
        data-lenis-prevent
        className="fixed inset-0 z-[490] overflow-y-auto overscroll-contain bg-ink-2 opacity-0"
        style={{ pointerEvents: "none", clipPath: "inset(0% 0% 100% 0%)" }}
      >
        <div className="mx-auto grid min-h-full max-w-[1600px] grid-cols-1 gap-8 px-6 pb-10 pt-28 md:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:pt-32">
          <nav aria-label="Menu" className="flex flex-col justify-center">
            {nav.map((n, i) => (
              <Link
                key={n.href}
                href={n.href}
                onMouseEnter={() => setPreview(i % featuredProjects.length)}
                onFocus={() => setPreview(i % featuredProjects.length)}
                onClick={() => setOpen(false)}
                data-cursor="GO"
                className="group flex items-baseline gap-5 overflow-hidden border-b border-line py-2.5 md:gap-8"
              >
                <span className="menu-line block font-mono text-[10px] tracking-[0.2em] text-accent">
                  0{i + 1}
                </span>
                <span className="menu-line display block text-[clamp(2.1rem,7vw,4.8rem)] leading-[0.98] text-paper transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3">
                  {n.label}
                </span>
                <span className="menu-line ml-auto hidden text-2xl text-muted transition-all duration-500 group-hover:translate-x-1 group-hover:text-accent md:block">
                  ↗
                </span>
              </Link>
            ))}
          </nav>

          {/* Hover preview */}
          <div className="menu-meta hidden flex-col justify-between lg:flex">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-line bg-ink">
              {featuredProjects.map((p, i) => (
                <Image
                  key={p.slug}
                  src={p.hero.src}
                  alt=""
                  aria-hidden
                  fill
                  sizes="420px"
                  className={`object-cover object-top transition-opacity duration-700 ${
                    i === preview ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-ink to-transparent p-4">
                <span className="label">{featuredProjects[preview]?.title}</span>
                <span className="label">{featuredProjects[preview]?.year}</span>
              </div>
            </div>

            <div className="menu-meta mt-8 grid grid-cols-2 gap-6">
              <div>
                <p className="label mb-2">Contact</p>
                <a
                  href={`mailto:${site.email}`}
                  className="text-sm text-paper underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
                  data-cursor="EMAIL"
                >
                  {site.email}
                </a>
                <p className="mt-1 text-sm text-muted">{site.location}</p>
              </div>
              <div>
                <p className="label mb-2">Elsewhere</p>
                <ul className="space-y-1">
                  {site.socials.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="OPEN ↗"
                        className="text-sm text-paper/85 transition-colors hover:text-accent"
                      >
                        {s.label}
                        {s.placeholder && <span className="label ml-2 text-muted-2">TODO</span>}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
