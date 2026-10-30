"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { FILTERS, projects, type Filter } from "@/data/projects";
import type { Project } from "@/data/types";

/**
 * WORK ARCHIVE
 * ────────────
 * The full index, as an editorial table rather than a card grid. Filtering is a
 * layout animation — rows that survive the filter slide to their new position
 * instead of the list snapping, so the eye can follow a project across a change.
 *
 * Motion handles this (not GSAP) because `layout` is exactly the problem it
 * solves and re-implementing FLIP by hand here would be worse.
 *
 * `items` is a parameter rather than always the whole catalogue, so the same
 * table serves the side-projects index and any other filtered view. The filter
 * buttons are derived from what is actually in `items` — offering a discipline
 * that would always return an empty list is worse than not offering it.
 */
export function ProjectArchive({
  items = projects,
  title = "All work",
}: {
  items?: readonly Project[];
  title?: string;
} = {}) {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [hovered, setHovered] = useState<string | null>(null);
  const reduced = useReducedMotion();

  const filters = useMemo(
    () => FILTERS.filter((f) => f === "ALL" || items.some((p) => p.disciplines.includes(f as never))),
    [items]
  );

  const list = useMemo(
    () => (filter === "ALL" ? items : items.filter((p) => p.disciplines.includes(filter as never))),
    [filter, items]
  );

  return (
    <section id="all" className="relative px-5 py-[12vh] md:px-10" aria-label="Work archive">
      <div className="mx-auto max-w-[1600px]">
        {/* Part of chapter 03 with the rail above, so no second chapter number. */}
        <div className="mb-8 flex items-center gap-4">
          <span className="h-px w-10 bg-line" />
          <span className="label">Full index</span>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-8 border-b border-line pb-6">
          <h2 className="display text-[clamp(1.8rem,4.4vw,3.4rem)] text-paper">
            {title} <span className="text-muted">{items.length}</span>
          </h2>

          <div role="group" aria-label="Filter work" className="flex flex-wrap gap-2">
            {filters.map((f) => {
              const on = f === filter;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  aria-pressed={on}
                  className={`relative rounded-full px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-300 ${
                    on ? "text-ink" : "text-muted hover:text-paper"
                  }`}
                >
                  {on && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 rounded-full bg-accent"
                      transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative z-10">{f}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* header row */}
        <div className="hidden grid-cols-[3rem_1.35fr_1fr_0.85fr_5rem] gap-6 border-b border-line py-3 lg:grid">
          {["No.", "Project", "Type", "Stack", "Year"].map((h) => (
            <span key={h} className="label">
              {h}
            </span>
          ))}
        </div>

        <motion.ul layout={!reduced} className="relative">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((p, i) => (
              <motion.li
                key={p.slug}
                layout={!reduced}
                initial={reduced ? false : { opacity: 0, y: 18, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -14, filter: "blur(6px)" }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: Math.min(i * 0.022, 0.22) }
                }
                onMouseEnter={() => setHovered(p.slug)}
                onMouseLeave={() => setHovered(null)}
                className="border-b border-line"
              >
                <Link
                  href={`/work/${p.slug}`}
                  data-cursor="VIEW PROJECT"
                  className="group grid grid-cols-1 items-center gap-2 py-5 lg:grid-cols-[3rem_1.35fr_1fr_0.85fr_5rem] lg:gap-6"
                >
                  <span className="label hidden lg:block">{String(i + 1).padStart(2, "0")}</span>

                  <span className="flex items-center gap-3">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full transition-transform duration-500 group-hover:scale-[1.8]"
                      style={{ backgroundColor: p.accent }}
                    />
                    <span className="font-display text-[clamp(1.05rem,2vw,1.5rem)] uppercase tracking-[-0.02em] text-paper transition-transform duration-500 group-hover:translate-x-1.5">
                      {p.title}
                    </span>
                    {p.status === "awaiting-assets" && (
                      <span className="label rounded-full border border-line px-2 py-0.5 text-[8.5px] text-muted-2">
                        awaiting assets
                      </span>
                    )}
                  </span>

                  <span className="text-[12px] text-muted lg:text-[12.5px]">{p.typeLine}</span>
                  <span className="hidden text-[12.5px] text-muted lg:block">{p.stack.slice(0, 2).join(" · ")}</span>

                  <span className="flex items-center justify-between gap-3 lg:justify-end">
                    <span className="font-mono text-[11px] text-muted">{p.year}</span>
                    <span className="text-muted transition-all duration-500 group-hover:translate-x-1 group-hover:text-accent">
                      ↗
                    </span>
                  </span>
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {list.length === 0 && (
          <p className="py-14 text-center text-sm text-muted">Nothing in this category yet.</p>
        )}

        {/* Hover preview — desktop only, follows the row under the pointer */}
        <div className="pointer-events-none fixed bottom-8 right-8 z-[300] hidden lg:block">
          <AnimatePresence>
            {hovered && !reduced && (
              <motion.div
                key={hovered}
                initial={{ opacity: 0, scale: 0.94, y: 14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-[280px] overflow-hidden rounded-lg border border-line bg-ink-2"
              >
                <Image
                  src={items.find((p) => p.slug === hovered)!.hero.src}
                  alt=""
                  aria-hidden
                  width={560}
                  height={420}
                  sizes="280px"
                  className="aspect-[4/3] w-full object-cover object-top"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
