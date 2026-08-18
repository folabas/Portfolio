"use client";

import Image from "next/image";

/**
 * LINK PREVIEW
 * ────────────
 * A card that previews a destination: browser chrome, the live domain, the path,
 * and a generated field tinted with the project's accent.
 *
 * WHY THE ARTWORK IS GENERATED RATHER THAN SCRAPED
 * A real preview means either fetching each site's OG image at build (which
 * breaks the build whenever a site is down, and ships whatever that site
 * happens to be serving) or calling a third-party screenshot service at runtime
 * (an external request per card, on every visit, leaking the visitor's IP to a
 * service neither of us controls). Neither is worth it for a link the visitor
 * is about to click anyway. The card is honest about being a link, not a
 * screenshot — and it stays on-brand because it is drawn from the same tokens
 * as everything else.
 *
 * Drop a real screenshot in later by passing `image`.
 */

function parse(href: string) {
  try {
    const u = new URL(href);
    return { host: u.host.replace(/^www\./, ""), path: u.pathname === "/" ? "" : u.pathname };
  } catch {
    return { host: href, path: "" };
  }
}

export function LinkPreview({
  href,
  label,
  accent = "var(--color-accent)",
  image,
  className = "",
}: {
  href: string;
  label?: string;
  accent?: string;
  /** Optional real screenshot; replaces the generated field. */
  image?: string;
  className?: string;
}) {
  const { host, path } = parse(href);
  // Deterministic field so a given URL always draws the same way.
  const seed = [...host].reduce((a, c) => a + c.charCodeAt(0), 0);
  const bars = Array.from({ length: 16 }, (_, i) => 0.25 + (Math.sin(seed + i * 1.9) * 0.5 + 0.5) * 0.7);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="OPEN ↗"
      className={`group block overflow-hidden rounded-xl border border-line bg-ink-2 transition-colors duration-500 hover:border-[color:var(--lp-accent)] ${className}`}
      style={{ ["--lp-accent" as string]: accent }}
    >
      {/* browser chrome */}
      <div className="flex items-center gap-3 border-b border-line px-3 py-2.5">
        <span className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-[6px] w-[6px] rounded-full bg-line" />
          ))}
        </span>
        <span className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-ink px-3 py-1">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
          <span className="truncate font-mono text-[10.5px] text-paper/80">
            {host}
            <span className="text-muted-2">{path}</span>
          </span>
        </span>
        <span className="shrink-0 text-[12px] text-muted transition-all duration-500 group-hover:translate-x-0.5 group-hover:text-[color:var(--lp-accent)]">
          ↗
        </span>
      </div>

      {/* viewport */}
      <div className="relative aspect-[16/9] overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={`${host} homepage`}
            fill
            sizes="(max-width: 640px) 92vw, 380px"
            className="object-cover object-top transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          />
        ) : (
          <>
            <div
              className="absolute inset-0"
              style={{ background: `radial-gradient(66% 60% at 26% 18%, ${accent}22 0%, transparent 70%)` }}
            />
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 112" preserveAspectRatio="none" aria-hidden>
              {/* a suggestion of a page: header bar, hero block, content rows */}
              <rect x="12" y="14" width="52" height="5" rx="2.5" fill={accent} opacity="0.55" />
              <rect x="12" y="28" width="104" height="9" rx="3" fill="#edede7" opacity="0.14" />
              <rect x="12" y="42" width="74" height="9" rx="3" fill="#edede7" opacity="0.09" />
              <rect x="12" y="62" width="34" height="10" rx="5" fill={accent} opacity="0.75" />
              {bars.map((h, i) => (
                <rect
                  key={i}
                  x={124 + (i % 8) * 9}
                  y={Math.round(96 - h * 40) - (i > 7 ? 46 : 0)}
                  width="5"
                  height={Math.round(h * 40)}
                  rx="1.5"
                  fill={accent}
                  opacity={0.12 + (i % 4) * 0.08}
                />
              ))}
            </svg>
          </>
        )}

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-ink to-transparent px-3 py-2.5">
          <span className="label truncate">{label ?? host}</span>
          <span className="label" style={{ color: accent }}>
            Visit
          </span>
        </div>
      </div>
    </a>
  );
}

/** Compact single-line variant — for repositories and secondary links. */
export function LinkRow({
  href,
  label,
  accent = "var(--color-accent)",
}: {
  href: string;
  label?: string;
  accent?: string;
}) {
  const { host, path } = parse(href);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="OPEN ↗"
      className="group flex items-center gap-3 rounded-lg border border-line px-4 py-3 transition-colors duration-500 hover:border-[color:var(--lp-accent)]"
      style={{ ["--lp-accent" as string]: accent }}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
      <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-paper/80">
        {label ?? (
          <>
            {host}
            <span className="text-muted-2">{path}</span>
          </>
        )}
      </span>
      <span className="shrink-0 text-muted transition-all duration-500 group-hover:translate-x-0.5 group-hover:text-[color:var(--lp-accent)]">
        ↗
      </span>
    </a>
  );
}
