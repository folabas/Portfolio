"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { TextReveal } from "@/components/motion/TextReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Block, Post } from "@/data/posts";

/**
 * POST VIEW
 * ─────────
 * Reading is the job here, so the motion budget is deliberately small: a
 * headline reveal, a hairline reading-progress bar, and nothing that moves
 * while your eyes are on a paragraph.
 */
export function PostView({ post, next }: { post: Post; next: Post }) {
  const bar = useRef<HTMLSpanElement>(null);
  const article = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = article.current;
    if (!el) return;

    // Progress across the article body, not the whole document — the footer
    // should not count as "still reading".
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const done = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${done})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (reduced || !article.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-block]").forEach((b) => {
        gsap.fromTo(
          b,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "expo.out",
            scrollTrigger: { trigger: b, start: "top 92%", once: true },
          }
        );
      });
    }, article);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div style={{ ["--pa" as string]: post.accent }}>
      {/* reading progress */}
      <div aria-hidden className="fixed inset-x-0 top-0 z-[480] h-px bg-line/60">
        <span
          ref={bar}
          className="block h-full origin-left bg-accent will-change-transform"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      <header className="relative px-5 pt-32 md:px-10 md:pt-40">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[52vh]"
          style={{ background: `radial-gradient(58% 48% at 42% 0%, ${post.accent}1c 0%, transparent 70%)` }}
        />

        <div className="relative mx-auto max-w-[900px]">
          <Link href="/journal" data-cursor="BACK" className="label inline-flex items-center gap-2 transition-colors hover:text-accent">
            ← Journal
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="label" style={{ color: post.accent }}>
              {post.topic}
            </span>
            <span className="label">
              {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </span>
            <span className="label">{post.readingMinutes} min read</span>
          </div>

          <TextReveal
            lines={[post.title]}
            as="h1"
            trigger={false}
            delay={0.15}
            className="display mt-5 text-[clamp(2rem,5.6vw,4.4rem)] leading-[0.96] text-paper"
          />

          <p className="body-lg mt-6 max-w-[60ch] text-[clamp(1.05rem,1.7vw,1.35rem)] leading-[1.5]">
            {post.standfirst}
          </p>

          {post.draft && (
            <p className="mt-8 rounded-md border border-dashed border-line px-4 py-3 text-[12.5px] leading-relaxed text-muted">
              <span className="label label-accent mb-1 block">Draft</span>
              This piece is a researched draft awaiting a final pass. Facts are sourced at the
              bottom; the framing and opinions are still being edited.
            </p>
          )}
        </div>
      </header>

      <article ref={article} className="relative px-5 py-[8vh] md:px-10">
        <div className="mx-auto max-w-[900px]">
          {post.body.map((b, i) => (
            <BlockView key={i} block={b} accent={post.accent} />
          ))}

          {post.sources && post.sources.length > 0 && (
            <section className="mt-16 border-t border-line pt-8" data-block>
              <p className="label mb-4">Sources</p>
              <ol className="space-y-2.5">
                {post.sources.map((s, i) => (
                  <li key={s.href} className="grid grid-cols-[2rem_1fr] gap-3">
                    <span className="font-mono text-[10.5px] tracking-[0.14em] text-muted-2 pt-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="OPEN ↗"
                      className="text-[13.5px] leading-relaxed text-paper/80 underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>
      </article>

      <section className="border-t border-line px-5 py-[10vh] md:px-10">
        <div className="mx-auto max-w-[900px]">
          <p className="label mb-6">Next</p>
          <Link href={`/journal/${next.slug}`} data-cursor="READ" className="group block">
            <span className="label" style={{ color: next.accent }}>
              {next.topic}
            </span>
            <h2 className="display mt-3 text-[clamp(1.6rem,4.4vw,3.2rem)] leading-[0.98] text-paper transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
              {next.title}
            </h2>
            <p className="body-lg mt-3 max-w-[54ch]">{next.standfirst}</p>
          </Link>
        </div>
      </section>
    </div>
  );
}

function BlockView({ block, accent }: { block: Block; accent: string }) {
  switch (block.t) {
    case "h":
      return (
        <h2 data-block className="display mt-14 text-[clamp(1.3rem,2.6vw,2rem)] leading-[1.05] text-paper">
          {block.text}
        </h2>
      );

    case "p":
      return (
        <p data-block className="mt-6 max-w-[68ch] text-[clamp(1rem,1.25vw,1.1rem)] leading-[1.72] text-paper/80">
          {block.text}
        </p>
      );

    case "list":
      return (
        <ul data-block className="mt-7 max-w-[68ch] space-y-3 border-l pl-6" style={{ borderColor: `${accent}44` }}>
          {block.items.map((it, i) => (
            <li key={i} className="text-[15px] leading-[1.65] text-paper/80">
              {it}
            </li>
          ))}
        </ul>
      );

    case "quote":
      return (
        <blockquote data-block className="my-12 max-w-[56ch]">
          <p className="display text-[clamp(1.2rem,2.4vw,1.8rem)] leading-[1.2] text-paper">“{block.text}”</p>
          {block.cite && <cite className="label mt-3 block not-italic">{block.cite}</cite>}
        </blockquote>
      );

    case "note":
      return (
        <aside
          data-block
          className="my-10 max-w-[64ch] rounded-md border border-line bg-ink-2/60 px-5 py-4"
          style={{ borderLeftWidth: 2, borderLeftColor: accent }}
        >
          <p className="text-[13.5px] leading-relaxed text-muted">{block.text}</p>
        </aside>
      );

    case "code":
      return (
        <div data-block className="my-10 overflow-hidden rounded-lg border border-line bg-[#0b0b0e]">
          <div className="flex items-center justify-between border-b border-line px-4 py-2">
            <span className="label">{block.lang}</span>
            <span className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-1.5 w-1.5 rounded-full bg-line" />
              ))}
            </span>
          </div>
          <pre className="no-bar overflow-x-auto px-4 py-4">
            <code className="font-mono text-[12.5px] leading-[1.7] text-paper/85">{block.text}</code>
          </pre>
        </div>
      );
  }
}
