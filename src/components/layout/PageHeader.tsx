import Link from "next/link";

/**
 * PAGE HEADER
 * ───────────
 * The masthead every sub-page shares: a back link to the home page, an eyebrow,
 * the title, and a standfirst. Sub-pages do not carry the home page's chapter
 * rail — a five-chapter indicator on a one-section page is noise — so this is
 * the only orientation they need.
 */
export function PageHeader({
  eyebrow,
  title,
  accent,
  standfirst,
  meta,
}: {
  eyebrow: string;
  title: string;
  /** Second line of the title, taking the accent colour. Optional. */
  accent?: string;
  standfirst: string;
  /** Short right-hand detail — a count, a date range. */
  meta?: string;
}) {
  return (
    <header className="px-5 pb-10 pt-32 md:px-10 md:pt-40">
      <div className="mx-auto max-w-[1600px]">
        <Link
          href="/"
          data-cursor="HOME"
          className="group inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-paper"
        >
          <span className="transition-transform duration-500 group-hover:-translate-x-1">←</span>
          Index
        </Link>

        <div className="mt-8 flex items-center gap-4">
          <span className="label label-accent">{eyebrow}</span>
          <span className="h-px w-10 bg-line" />
          {meta && <span className="label">{meta}</span>}
        </div>

        <h1 className="display mt-5 max-w-[16ch] text-[clamp(2.4rem,8vw,6rem)] text-paper">
          {title}
          {accent && (
            <>
              <br />
              <span className="text-accent">{accent}</span>
            </>
          )}
        </h1>

        <p className="body-lg mt-7 max-w-[56ch] border-t border-line pt-7">{standfirst}</p>
      </div>
    </header>
  );
}
