"use client";

import Link from "next/link";
import { ChapterLabel } from "@/components/layout/ScrollProgress";
import { Reveal } from "@/components/motion/TextReveal";
import { LinkPreview } from "@/components/ui/LinkPreview";
import { education, hackathons } from "@/data/education";

/**
 * CREDENTIALS
 * ───────────
 * Two columns of the same idea: what was studied, and what was built under
 * competition conditions. Every certificate carries its public verification URL
 * as a preview card, so the claim is checkable rather than asserted.
 */
export function Credentials() {
  return (
    <section id="credentials" className="relative px-5 py-[12vh] md:px-10" aria-label="Education and hackathons">
      <div className="mx-auto max-w-[1600px]">
        <ChapterLabel index={6} label="Credentials" id="credentials" />

        <div className="mt-8 flex flex-wrap items-end justify-between gap-8 border-b border-line pb-8">
          <h2 className="display max-w-[16ch] text-[clamp(1.9rem,5vw,4rem)] text-paper">
            Studied,
            <br />
            <span className="text-accent">and shipped under pressure.</span>
          </h2>
          <p className="body-lg max-w-[38ch]">
            Three of the projects on this site were built at hackathons — where the
            constraint is the clock, and the thing still has to work at the end of it.
          </p>
        </div>

        <div className="mt-14 grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* ── education ─────────────────────────────────────── */}
          <div>
            <p className="label mb-6">Education & certification</p>

            <ol className="space-y-8">
              {education.map((c) => (
                <li key={c.title}>
                  <Reveal>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="label label-accent">{c.issuer}</span>
                      {c.year && <span className="label">{c.year}</span>}
                    </div>

                    <h3 className="mt-2 font-display text-[clamp(1.05rem,2vw,1.4rem)] uppercase leading-tight tracking-[-0.02em] text-paper">
                      {c.title}
                    </h3>

                    {c.detail && (
                      <p className="mt-2 max-w-[46ch] text-[13px] leading-relaxed text-muted">{c.detail}</p>
                    )}

                    {c.href && (
                      <div className="mt-4 max-w-[380px]">
                        <LinkPreview href={c.href} label={`Verify — ${c.issuer}`} />
                      </div>
                    )}
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>

          {/* ── hackathons ────────────────────────────────────── */}
          <div>
            <p className="label mb-6">Hackathons</p>

            <ol className="divide-y divide-line border-y border-line">
              {hackathons.map((h, i) => (
                <li key={h.name}>
                  <Reveal>
                    <Link
                      href={`/work/${h.slug}`}
                      data-cursor="VIEW PROJECT"
                      className="group grid grid-cols-[2.5rem_1fr] gap-4 py-6"
                    >
                      <span className="font-mono text-[10.5px] tracking-[0.16em] text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <span>
                        <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
                          <span className="font-display text-[clamp(1.05rem,2vw,1.45rem)] uppercase tracking-[-0.02em] text-paper transition-transform duration-500 group-hover:translate-x-1">
                            {h.name}
                          </span>
                          {"result" in h && h.result && (
                            <span className="rounded-full bg-accent px-2.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink">
                              {h.result}
                            </span>
                          )}
                          <span className="label">{h.year}</span>
                        </span>

                        <span className="mt-2 block text-[13px] text-muted">
                          Built <span className="text-paper/85">{h.project}</span>
                        </span>
                        <span className="mt-2 block max-w-[54ch] text-[13.5px] leading-relaxed text-paper/70">
                          {h.blurb}
                        </span>
                      </span>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
