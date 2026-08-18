"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { TextReveal, Reveal } from "@/components/motion/TextReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { sortedPosts, TOPICS, type Post } from "@/data/posts";

/**
 * JOURNAL INDEX
 * ─────────────
 * Editorial list, not a card grid. The lead post gets a full-width slot; the
 * rest are rows. Topic filtering reuses the same layout-animation approach as
 * the work archive so the two indexes feel like one system.
 */
export function JournalIndex() {
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>("All");
  const reduced = useReducedMotion();

  const list = useMemo(
    () => (topic === "All" ? sortedPosts : sortedPosts.filter((p) => p.topic === topic)),
    [topic]
  );
  const [lead, ...rest] = list;

  return (
    <div className="px-5 pb-[12vh] pt-32 md:px-10 md:pt-40">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex items-center gap-4">
          <span className="h-px w-10 bg-line" />
          <span className="label">Journal</span>
        </div>

        <TextReveal
          lines={["Notes on", "what I'm", "building through."]}
          as="h1"
          trigger={false}
          delay={0.2}
          accentLines={[2]}
          className="display mt-6 text-[clamp(2.4rem,8vw,7rem)] text-paper"
        />

        <Reveal className="mt-8 max-w-[58ch]" delay={0.1}>
          <p className="body-lg">
            Fintech regulation, payment infrastructure and the engineering underneath —
            written from the position of someone shipping into it rather than reporting on it.
          </p>
        </Reveal>

        {/* filters */}
        <div role="group" aria-label="Filter posts" className="mt-12 flex flex-wrap gap-2 border-b border-line pb-6">
          {TOPICS.map((t) => {
            const on = t === topic;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTopic(t)}
                aria-pressed={on}
                className={`relative rounded-full px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-300 ${
                  on ? "text-ink" : "text-muted hover:text-paper"
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="journal-pill"
                    className="absolute inset-0 rounded-full bg-accent"
                    transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative z-10">{t}</span>
              </button>
            );
          })}
        </div>

        {list.length === 0 && <p className="py-16 text-center text-sm text-muted">Nothing filed under {topic} yet.</p>}

        {/* lead post */}
        {lead && (
          <motion.div layout={!reduced} className="mt-12">
            <Link
              href={`/journal/${lead.slug}`}
              data-cursor="READ"
              className="group grid gap-8 border-b border-line pb-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end"
            >
              <div>
                <Meta post={lead} />
                <h2 className="display mt-5 text-[clamp(1.9rem,4.6vw,3.6rem)] leading-[0.94] text-paper transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
                  {lead.title}
                </h2>
                <p className="body-lg mt-5 max-w-[56ch]">{lead.standfirst}</p>
                <span className="mt-6 inline-flex items-center gap-3 border-b border-line pb-1 text-[13px] text-paper transition-colors group-hover:border-accent">
                  Read the piece
                  <span className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
                </span>
              </div>

              <CoverArt post={lead} large />
            </Link>
          </motion.div>
        )}

        {/* remaining posts */}
        <motion.ul layout={!reduced}>
          <AnimatePresence mode="popLayout" initial={false}>
            {rest.map((p, i) => (
              <motion.li
                key={p.slug}
                layout={!reduced}
                initial={reduced ? false : { opacity: 0, y: 18, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12, filter: "blur(6px)" }}
                transition={reduced ? { duration: 0 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 }}
                className="border-b border-line"
              >
                <Link
                  href={`/journal/${p.slug}`}
                  data-cursor="READ"
                  className="group grid gap-5 py-8 lg:grid-cols-[0.62fr_0.38fr] lg:items-center lg:gap-12"
                >
                  <div>
                    <Meta post={p} />
                    <h3 className="mt-3 font-display text-[clamp(1.25rem,2.6vw,2rem)] uppercase leading-[1.05] tracking-[-0.025em] text-paper transition-transform duration-500 group-hover:translate-x-1.5">
                      {p.title}
                    </h3>
                    <p className="mt-3 max-w-[62ch] text-[13.5px] leading-relaxed text-muted">{p.standfirst}</p>
                  </div>
                  <CoverArt post={p} />
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </div>
  );
}

function Meta({ post }: { post: Post }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <span className="label" style={{ color: post.accent }}>
        {post.topic}
      </span>
      <span className="label">
        {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
      </span>
      <span className="label">{post.readingMinutes} min</span>
      {post.draft && (
        <span className="label rounded-full border border-dashed border-line px-2 py-0.5 text-[8.5px] text-muted-2">
          draft
        </span>
      )}
    </div>
  );
}

/**
 * Generative cover art — a deterministic figure derived from the post's accent.
 * No stock photography, nothing to license, and it costs one SVG.
 */
function CoverArt({ post, large = false }: { post: Post; large?: boolean }) {
  const seed = [...post.slug].reduce((a, c) => a + c.charCodeAt(0), 0);
  const bars = Array.from({ length: 22 }, (_, i) => {
    const x = Math.sin(seed + i * 1.7) * 0.5 + 0.5;
    return 0.18 + x * 0.74;
  });

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-line bg-ink-2 ${
        large ? "aspect-[16/10]" : "aspect-[16/9]"
      }`}
    >
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(70% 60% at 30% 20%, ${post.accent}26 0%, transparent 68%)` }}
      />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 220 124" preserveAspectRatio="none" aria-hidden>
        {bars.map((h, i) => (
          <rect
            key={i}
            x={10 + i * 9.2}
            y={124 - h * 104}
            width={4.2}
            height={h * 104}
            rx={1}
            fill={post.accent}
            opacity={0.14 + (i % 4) * 0.1}
          />
        ))}
        <polyline
          points={bars.map((h, i) => `${12 + i * 9.2},${124 - h * 104 - 6}`).join(" ")}
          fill="none"
          stroke={post.accent}
          strokeWidth="0.9"
          opacity="0.6"
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3">
        <span className="label">{post.topic}</span>
        <span className="label">{post.readingMinutes} min read</span>
      </div>
    </div>
  );
}
