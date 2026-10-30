"use client";

import { useState } from "react";
import { TextReveal, Reveal } from "@/components/motion/TextReveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { footerCta, site } from "@/data/site";

/**
 * CONTACT SCREEN
 * ──────────────
 * The /contact route renders this instead of the shared FooterCTA.
 *
 * The footer already carries the full contact block on every page, so stacking
 * it under a contact page would make the screen a duplicate of its own footer.
 * This is the same information at page scale: the statement leads, the email is
 * the primary action, and the detail sits underneath as a plain table.
 */
export function ContactScreen() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // No clipboard permission (or no secure context): fall back to the thing
      // the button is for rather than failing silently.
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <section className="px-5 pb-16 pt-32 md:px-10 md:pt-40" aria-label="Contact">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex items-center gap-4">
          <span className="label label-accent">Contact</span>
          <span className="h-px w-10 bg-line" />
          <span className="label">{site.availability}</span>
        </div>

        <div className="mt-8">
          <TextReveal
            lines={footerCta.lines}
            as="h1"
            trigger={false}
            delay={0.2}
            accentLines={[footerCta.accentLine]}
            className="display display-fluid text-paper"
          />
        </div>

        <Reveal className="mt-10 max-w-[56ch] border-t border-line pt-8" delay={0.1}>
          <p className="body-lg">
            Open to full-time and contract work across fintech, marketplaces and applied
            machine learning. The fastest way to reach me is email.
          </p>
        </Reveal>

        <Reveal className="mt-10 flex flex-wrap items-center gap-4" delay={0.15}>
          <MagneticButton onClick={copyEmail} cursor={copied ? "COPIED" : "COPY"}>
            {copied ? "Copied to clipboard" : site.email}
          </MagneticButton>
          <MagneticButton href={`mailto:${site.email}`} external variant="ghost" cursor="EMAIL">
            Open mail
          </MagneticButton>
          <MagneticButton href={site.resume.href} external variant="ghost" cursor="OPEN ↗">
            {site.resume.label}
          </MagneticButton>
        </Reveal>

        <Reveal className="mt-20">
          <dl className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            <Cell k="Email">
              <a
                href={`mailto:${site.email}`}
                data-cursor="EMAIL"
                className="transition-colors hover:text-accent"
              >
                {site.email}
              </a>
            </Cell>

            <Cell k="Phone">
              <a
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                className="transition-colors hover:text-accent"
              >
                {site.phone}
              </a>
            </Cell>

            <Cell k="Based in">
              {site.location}
              <span className="mt-1 block text-[13px] text-muted">{site.timezone}</span>
            </Cell>

            <Cell k="Elsewhere">
              <ul className="space-y-1.5">
                {site.socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="OPEN ↗"
                      className="transition-colors hover:text-accent"
                    >
                      {s.label} ↗
                      {s.placeholder && <span className="label ml-2 text-muted-2">todo</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </Cell>
          </dl>
        </Reveal>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <p className="label">
            © {site.year} {site.name}
          </p>
          <p className="label">Press ⌘K anywhere</p>
        </div>
      </div>
    </section>
  );
}

function Cell({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="bg-ink px-6 py-8">
      <dt className="label mb-3">{k}</dt>
      <dd className="text-[13.5px] leading-relaxed text-paper/85">{children}</dd>
    </div>
  );
}
