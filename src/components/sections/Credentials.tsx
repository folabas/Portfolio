"use client";

import { Reveal } from "@/components/motion/TextReveal";
import { LinkPreview } from "@/components/ui/LinkPreview";
import { education } from "@/data/education";

/**
 * CREDENTIALS
 * ───────────
 * What was studied and what was certified. Every certificate carries its public
 * verification URL as a preview card, so the claim is checkable rather than
 * asserted.
 *
 * The hackathons used to sit in a second column here, which framed them as
 * qualifications. They are projects, so they are listed as projects — see
 * /personal-projects.
 */
export function Credentials() {
  return (
    <section id="credentials" className="relative px-5 py-[12vh] md:px-10" aria-label="Education and certification">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex items-center gap-4">
          <span className="h-px w-10 bg-line" />
          <span className="label">Credentials</span>
        </div>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-8 border-b border-line pb-8">
          <h2 className="display max-w-[16ch] text-[clamp(1.9rem,5vw,4rem)] text-paper">
            Studied,
            <br />
            <span className="text-accent">and verifiable.</span>
          </h2>
          <p className="body-lg max-w-[38ch]">
            Every certificate below links to the issuer&rsquo;s own verification page, so
            none of it has to be taken on trust.
          </p>
        </div>

        <div className="mt-14">
          <p className="label mb-6">Education &amp; certification</p>

          <ol className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-14">
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
                        <LinkPreview href={c.href} label={`Verify: ${c.issuer}`} />
                      </div>
                    )}
                  </Reveal>
                </li>
              ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
