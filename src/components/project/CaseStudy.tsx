"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ProjectImage } from "@/components/project/ProjectImage";
import { TextReveal, Reveal } from "@/components/motion/TextReveal";
import { LinkPreview, LinkRow } from "@/components/ui/LinkPreview";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Project } from "@/data/types";

/**
 * CASE STUDY
 * ──────────
 * One template, themed per project by a single CSS variable (`--pa`) taken from
 * the project's accent. The global system still owns type, spacing and motion —
 * the accent only touches rules, labels and the hero wash, so twenty-one case
 * studies still read as one site.
 */
export function CaseStudy({ project: p, next }: { project: Project; next: Project }) {
  const root = useRef<HTMLDivElement>(null);
  const heroImg = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !root.current) return;
    const ctx = gsap.context(() => {
      // Entry: the hero visual expands into place, continuing the thumbnail
      // the visitor clicked rather than cutting to a new page.
      gsap.fromTo(
        heroImg.current,
        { clipPath: "inset(22% 12% 22% 12% round 16px)", scale: 1.06, opacity: 0 },
        { clipPath: "inset(0% 0% 0% 0% round 12px)", scale: 1, opacity: 1, duration: 1.25, ease: "expo.out", delay: 0.12 }
      );

      // Hero drifts up as you leave it.
      gsap.to(heroImg.current, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: { trigger: heroImg.current, start: "top top", end: "bottom top", scrub: 0.7 },
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={root} style={{ ["--pa" as string]: p.accent }}>
      {/* ── hero ─────────────────────────────────────────────── */}
      <header className="relative px-5 pb-10 pt-32 md:px-10 md:pt-40">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[60vh]"
          style={{
            background: `radial-gradient(60% 50% at 50% 0%, ${p.accent}1f 0%, transparent 70%)`,
          }}
        />

        <div className="relative mx-auto max-w-[1600px]">
          <Link
            href="/projects"
            data-cursor="BACK"
            className="label inline-flex items-center gap-2 transition-colors hover:text-accent"
          >
            ← All work
          </Link>

          <p className="label mt-8" style={{ color: p.accent }}>
            {p.typeLine}
          </p>

          <TextReveal
            lines={[p.title]}
            as="h1"
            trigger={false}
            delay={0.15}
            className="display mt-4 text-[clamp(2.4rem,9vw,8rem)] text-paper"
          />

          <p className="body-lg mt-6 max-w-[58ch]">{p.tagline}</p>

          {p.status === "awaiting-assets" && p.note && (
            <p className="mt-8 max-w-[62ch] rounded-md border border-dashed border-line px-4 py-3 text-[12.5px] leading-relaxed text-muted">
              <span className="label label-accent mb-1 block">Awaiting assets</span>
              {p.note}
            </p>
          )}

          <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-y border-line py-7 md:grid-cols-4">
            <Field k="Role" v={p.role} />
            <Field k="Platform" v={p.platform} />
            <Field k="Year" v={p.year} />
            <Field k="Category" v={p.group} />
          </dl>

          {p.hackathon && (
            <div className="mt-8 inline-flex flex-wrap items-center gap-3 rounded-full border border-line px-4 py-2">
              <span className="label label-accent">Hackathon</span>
              <span className="text-[13px] text-paper">{p.hackathon.name}</span>
              <span className="label">{p.hackathon.year}</span>
              {p.hackathon.result && (
                <span
                  className="rounded-full px-2.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink"
                  style={{ backgroundColor: p.accent }}
                >
                  {p.hackathon.result}
                </span>
              )}
            </div>
          )}

          {p.links && p.links.length > 0 && (
            <div className="mt-10">
              <p className="label mb-4">Live</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {p.links
                  .filter((l) => l.kind !== "repo")
                  .map((l) => (
                    <LinkPreview key={l.href} href={l.href} label={l.label} accent={p.accent} />
                  ))}
              </div>

              {p.links.some((l) => l.kind === "repo") && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:max-w-[62%]">
                  {p.links
                    .filter((l) => l.kind === "repo")
                    .map((l) => (
                      <LinkRow key={l.href} href={l.href} label={l.label} accent={p.accent} />
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* ── hero visual ──────────────────────────────────────── */}
      <div className="px-5 md:px-10">
        <div ref={heroImg} className="mx-auto max-w-[1600px] will-change-transform">
          <ProjectImage
            shot={p.hero}
            priority
            sizes="(max-width: 768px) 92vw, 90vw"
            className={p.hero.device === "phone" ? "mx-auto w-[68%] max-w-[380px]" : "w-full"}
          />
        </div>
      </div>

      {/* ── narrative ────────────────────────────────────────── */}
      <section className="px-5 py-[10vh] md:px-10">
        <div className="mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-[0.32fr_0.68fr] lg:gap-20">
          <p className="label lg:sticky lg:top-32 lg:h-max">Overview</p>

          <div className="space-y-12">
            <Reveal>
              <p className="max-w-[62ch] text-[clamp(1.05rem,1.9vw,1.5rem)] leading-[1.5] tracking-[-0.015em] text-paper">
                {p.description}
              </p>
            </Reveal>

            {p.problem && <Block label="The problem" body={p.problem} accent={p.accent} />}
            {p.solution && <Block label="The approach" body={p.solution} accent={p.accent} />}
          </div>
        </div>
      </section>

      {/* ── features ─────────────────────────────────────────── */}
      {p.features && p.features.length > 0 && (
        <section className="px-5 pb-[10vh] md:px-10">
          <div className="mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-[0.32fr_0.68fr] lg:gap-20">
            <p className="label lg:sticky lg:top-32 lg:h-max">What it does</p>
            <ol className="divide-y divide-line border-y border-line">
              {p.features.map((f, i) => (
                <li key={i} className="group grid grid-cols-[2.5rem_1fr] gap-4 py-4 transition-colors hover:bg-paper/[0.02]">
                  <span className="font-mono text-[10.5px] tracking-[0.16em] pt-1" style={{ color: p.accent }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="max-w-[64ch] text-[14px] leading-relaxed text-paper/85">{f}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ── gallery ──────────────────────────────────────────── */}
      {p.gallery.length > 0 && (
        <section className="px-5 pb-[10vh] md:px-10">
          <div className="mx-auto max-w-[1600px]">
            <p className="label mb-8">Screens</p>
            <div className="grid gap-6 md:grid-cols-2">
              {p.gallery.map((shot, i) => (
                <div
                  key={shot.src}
                  className={
                    shot.device === "phone"
                      ? "flex justify-center"
                      : i === 0 && p.gallery.length % 2 === 1
                        ? "md:col-span-2"
                        : ""
                  }
                >
                  <ProjectImage
                    shot={shot}
                    parallax={10}
                    sizes="(max-width: 768px) 92vw, 46vw"
                    className={shot.device === "phone" ? "w-[62%] max-w-[300px]" : "w-full"}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── stack + challenges + outcome ─────────────────────── */}
      <section className="px-5 pb-[10vh] md:px-10">
        <div className="mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-[0.32fr_0.68fr] lg:gap-20">
          <p className="label lg:sticky lg:top-32 lg:h-max">Engineering</p>

          <div className="space-y-12">
            <Reveal>
              <p className="label mb-4">Stack</p>
              <ul className="flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-line px-3.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-paper/80 transition-colors duration-500 hover:border-[var(--pa)] hover:text-[var(--pa)]"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>

            {p.challenges && <Block label="What was hard" body={p.challenges} accent={p.accent} />}
            {p.outcome && <Block label="Outcome" body={p.outcome} accent={p.accent} />}
          </div>
        </div>
      </section>

      {/* ── next project ─────────────────────────────────────── */}
      <section className="border-t border-line px-5 py-[10vh] md:px-10">
        <div className="mx-auto max-w-[1600px]">
          <p className="label mb-6">Next project</p>
          <Link href={`/work/${next.slug}`} data-cursor="VIEW PROJECT" className="group grid gap-8 lg:grid-cols-[1fr_0.42fr] lg:items-center">
            <div>
              <p className="label mb-3" style={{ color: next.accent }}>
                {next.typeLine}
              </p>
              <h2 className="display text-[clamp(2.2rem,7vw,6rem)] text-paper transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3">
                {next.title}
              </h2>
              <p className="body-lg mt-4 max-w-[48ch]">{next.tagline}</p>
            </div>

            <div className="overflow-hidden rounded-lg border border-line bg-ink-2">
              <Image
                src={next.hero.src}
                alt=""
                aria-hidden
                width={800}
                height={600}
                sizes="(max-width: 1024px) 92vw, 40vw"
                className="aspect-[4/3] w-full object-cover object-top transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}

function Field({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="label mb-2">{k}</dt>
      <dd className="text-[13.5px] leading-snug text-paper/85">{v}</dd>
    </div>
  );
}

function Block({ label, body, accent }: { label: string; body: string; accent: string }) {
  return (
    <Reveal>
      <div className="border-l pl-6" style={{ borderColor: `${accent}59` }}>
        <p className="label mb-3" style={{ color: accent }}>
          {label}
        </p>
        <p className="body-lg max-w-[62ch]">{body}</p>
      </div>
    </Reveal>
  );
}
