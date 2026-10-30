"use client";

import Link from "next/link";
import { Reveal } from "@/components/motion/TextReveal";
import { ProjectImage } from "@/components/project/ProjectImage";
import type { Project, ProjectLink } from "@/data/types";

/**
 * PROJECT GRID
 * ────────────
 * The single way projects are listed anywhere on this site — the home page,
 * side projects and personal projects all render this.
 *
 * It replaces two earlier sections that fought the user for the scrollbar: a
 * sticky stage that cross-dissolved one project into the next, and a horizontal
 * rail driven by vertical scroll. Both meant the work arrived at the pace the
 * page chose. This is an ordinary vertical grid: everything is reachable by
 * scrolling normally, by find-in-page, and by a screen reader in document
 * order. The only motion left is each card settling in as it comes into view.
 *
 * `emphasis` controls density. "lead" gives every card a full row and large
 * type, for a short list of headline work; "index" fits two or three to a row,
 * for the longer lists.
 */
export function ProjectGrid({
  items,
  emphasis = "index",
  priorityCount = 0,
}: {
  items: readonly Project[];
  emphasis?: "lead" | "index";
  /** How many images to load eagerly — only the ones above the fold. */
  priorityCount?: number;
}) {
  if (items.length === 0) {
    return <p className="py-14 text-sm text-muted">Nothing filed here yet.</p>;
  }

  const lead = emphasis === "lead";

  return (
    <ul
      className={
        lead
          ? "mt-12 grid gap-x-10 gap-y-16 md:grid-cols-2 lg:gap-x-14 lg:gap-y-24"
          : "mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3"
      }
    >
      {items.map((p, i) => (
        <li key={p.slug}>
          <Reveal delay={Math.min(i * 0.05, 0.25)}>
            <article className="group">
              <Link
                href={`/work/${p.slug}`}
                data-cursor="VIEW PROJECT"
                className="block overflow-hidden rounded-lg"
              >
                <ProjectImage
                  shot={p.hero}
                  priority={i < priorityCount}
                  reveal={false}
                  parallax={0}
                  sizes={
                    lead
                      ? "(max-width: 768px) 92vw, 46vw"
                      : "(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                  }
                  className={
                    p.hero.device === "phone"
                      ? "mx-auto w-[62%] max-w-[300px]"
                      : "w-full"
                  }
                />
              </Link>

              <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="label" style={{ color: p.accent }}>
                  {p.typeLine}
                </span>
                {p.hackathon && (
                  <span className="rounded-full border border-accent/40 px-2 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.14em] text-accent">
                    Personal project
                  </span>
                )}
              </div>

              <h3
                className={`display mt-2 text-paper ${
                  lead
                    ? "text-[clamp(1.6rem,3.4vw,2.6rem)]"
                    : "text-[clamp(1.25rem,2.2vw,1.65rem)]"
                }`}
              >
                <Link
                  href={`/work/${p.slug}`}
                  className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
                >
                  {p.title}
                </Link>
              </h3>

              <p
                className={`mt-3 text-muted ${
                  lead ? "body-lg max-w-[48ch]" : "max-w-[42ch] text-[13.5px] leading-relaxed"
                }`}
              >
                {lead ? p.description : p.tagline}
              </p>

              {/*
                The year used to sit here on its own. Where a project actually
                shipped to a store, the badge says more than the date does — so
                the badges take the slot and the year falls back in only when
                there is nothing published to point at.
              */}
              <Footer project={p} />
            </article>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

function Footer({ project }: { project: Project }) {
  const stores = (project.links ?? []).filter(
    (l): l is ProjectLink & { store: "appstore" | "play" } =>
      l.kind === "store" && !!l.store
  );
  const live = (project.links ?? []).find((l) => l.kind === "live");

  return (
    <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-4">
      {stores.length > 0 ? (
        stores.map((l) => <StoreBadge key={l.href} link={l} />)
      ) : live ? (
        <a
          href={live.href}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="OPEN ↗"
          className="inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-paper/80 transition-colors hover:text-accent"
        >
          Live ↗
        </a>
      ) : null}

      {/* The year is the fallback content of the left slot, so it is only
          repeated on the right when something else took that slot. */}
      <span
        className={`font-mono text-[10.5px] tracking-[0.14em] text-muted-2 ${
          stores.length > 0 || live ? "ml-auto" : ""
        }`}
      >
        {project.year}
      </span>
    </div>
  );
}

/**
 * STORE BADGE
 * The marks are drawn inline rather than loaded as the official badge images:
 * Apple's and Google's badge artwork carries brand guidelines about size,
 * clear space and colour that a 1-bit accent-on-ink portfolio cannot follow
 * without looking broken. A plain glyph plus "App Store" / "Google Play" is
 * honest about where the link goes and stays inside the page's own palette.
 */
function StoreBadge({ link }: { link: ProjectLink & { store: "appstore" | "play" } }) {
  const label = link.store === "appstore" ? "App Store" : "Google Play";

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="OPEN ↗"
      aria-label={`${label}, opens in a new tab`}
      className="inline-flex items-center gap-2 rounded-md border border-line px-2.5 py-1.5 transition-colors duration-300 hover:border-accent/50 hover:bg-paper/[0.04]"
    >
      <span className="text-paper/85 transition-colors group-hover:text-paper">
        {link.store === "appstore" ? <AppleMark /> : <PlayMark />}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-paper/80">
        {label}
      </span>
    </a>
  );
}

function AppleMark() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
      <path d="M16.37 12.78c.02 2.6 2.28 3.47 2.3 3.48-.02.06-.36 1.23-1.2 2.44-.72 1.04-1.47 2.08-2.65 2.1-1.16.02-1.53-.69-2.86-.69-1.32 0-1.74.67-2.84.71-1.14.04-2-.11-3.2-1.87C4.1 16.9 3.3 13.2 4.8 10.7c.74-1.26 2.08-2.05 3.52-2.07 1.12-.02 2.18.75 2.86.75.68 0 1.97-.93 3.32-.79.56.02 2.15.2 3.17 1.54-.08.05-1.86 1.09-1.84 3.25h.54zM14.2 5.9c.6-.73 1.01-1.75.9-2.76-.89.04-1.97.59-2.6 1.32-.57.65-1.06 1.69-.93 2.68.99.08 1.99-.5 2.63-1.24z" />
    </svg>
  );
}

function PlayMark() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
      <path d="M3.6 2.3c-.23.25-.36.63-.36 1.13v17.14c0 .5.13.88.36 1.13l9.02-9.7L3.6 2.3zm10.1 8.1 2.9-3.12-9.5-5.42c-.46-.26-.86-.27-1.14-.07l7.74 8.6zm0 3.2L5.96 22.2c.28.2.68.19 1.14-.07l9.5-5.42-2.9-3.11zm3.84-4.13-2.21 2.38 2.21 2.37 3.03-1.73c.6-.34.9-.8.9-1.28 0-.48-.3-.94-.9-1.28l-3.03-1.73z" />
    </svg>
  );
}
