"use client";

import { useMemo, useState } from "react";
import { ChapterLabel } from "@/components/layout/ScrollProgress";
import { Reveal } from "@/components/motion/TextReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { clusters, techEdges, techNodes } from "@/data/tech";

/**
 * TECHNOLOGY CONSTELLATION
 * ────────────────────────
 * Not a logo wall. Nodes are positioned by cluster, connected where the tools
 * genuinely sit next to each other in these projects, and selecting one dims
 * everything it does not touch.
 *
 * Hover state is the only React state — the drift is CSS, and the highlight is
 * a class change, so moving the pointer across the field costs no re-layout.
 */
export function TechnologyConstellation({ chapter = false }: { chapter?: boolean } = {}) {
  const [active, setActive] = useState<string | null>(null);
  const reduced = useReducedMotion();

  const neighbours = useMemo(() => {
    if (!active) return null;
    const set = new Set<string>([active]);
    techEdges.forEach(([a, b]) => {
      if (a === active) set.add(b);
      if (b === active) set.add(a);
    });
    return set;
  }, [active]);

  const nodeOf = (name: string) => techNodes.find((n) => n.name === name);
  const clusterOf = (id: string) => clusters.find((c) => c.id === id);

  return (
    <section id="stack" className="relative px-5 py-[12vh] md:px-10" aria-label="Stack">
      <div className="mx-auto max-w-[1600px]">
        {/* Only the home page has chapters; /stack shows a plain rule. */}
        {chapter ? (
          <ChapterLabel index={4} label="Stack" id="stack" />
        ) : (
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-line" />
            <span className="label">Stack</span>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-end justify-between gap-8 border-b border-line pb-8">
          <h2 className="display max-w-[14ch] text-[clamp(1.9rem,5vw,4rem)] text-paper">
            My stack,
            <br />
            <span className="text-accent">and how it connects.</span>
          </h2>
          <p className="body-lg max-w-[40ch]">
            Every node here appears in the stack of at least one project on this site.
            Select one to see what it sits next to.
          </p>
        </div>

        {/* legend */}
        <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3">
          {clusters.map((c) => (
            <span key={c.id} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c.accent }} />
              <span className="label">{c.label}</span>
            </span>
          ))}
        </div>

        <Reveal className="mt-10">
          <div
            className="relative aspect-[16/10] w-full rounded-xl border border-line bg-ink-2/40 sm:aspect-[16/9] lg:aspect-[2/1]"
            onMouseLeave={() => setActive(null)}
          >
            {/* edges */}
            <svg className="absolute inset-0 h-full w-full" aria-hidden>
              {techEdges.map(([a, b], i) => {
                const na = nodeOf(a);
                const nb = nodeOf(b);
                if (!na || !nb) return null;
                const on = !!neighbours && neighbours.has(a) && neighbours.has(b);
                return (
                  <line
                    key={i}
                    x1={`${na.x * 100}%`}
                    y1={`${na.y * 100}%`}
                    x2={`${nb.x * 100}%`}
                    y2={`${nb.y * 100}%`}
                    stroke={on ? "var(--color-accent)" : "rgba(237,237,231,0.09)"}
                    strokeWidth={on ? 1.1 : 0.7}
                    className="transition-all duration-500"
                    opacity={active ? (on ? 0.85 : 0.16) : 0.55}
                  />
                );
              })}
            </svg>

            {/* nodes */}
            {techNodes.map((n, i) => {
              const c = clusterOf(n.cluster);
              const dim = !!neighbours && !neighbours.has(n.name);
              const isActive = active === n.name;
              return (
                <button
                  key={n.name}
                  type="button"
                  onMouseEnter={() => setActive(n.name)}
                  onFocus={() => setActive(n.name)}
                  onClick={() => setActive((v) => (v === n.name ? null : n.name))}
                  aria-label={`${n.name}: ${n.detail}`}
                  className="group absolute -translate-x-1/2 -translate-y-1/2 rounded-full outline-offset-4 transition-opacity duration-500"
                  style={{
                    left: `${n.x * 100}%`,
                    top: `${n.y * 100}%`,
                    opacity: dim ? 0.26 : 1,
                    animation: reduced ? "none" : `float-node ${7 + (i % 5)}s ease-in-out ${i * 0.23}s infinite`,
                  }}
                >
                  <span className="flex items-center gap-2 whitespace-nowrap rounded-full border px-2.5 py-1 backdrop-blur-[2px] transition-all duration-500"
                    style={{
                      borderColor: isActive ? c?.accent : "rgba(237,237,231,0.12)",
                      backgroundColor: isActive ? `${c?.accent}1a` : "rgba(13,13,16,0.6)",
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full transition-transform duration-500 group-hover:scale-150"
                      style={{ backgroundColor: c?.accent }}
                    />
                    <span
                      className="font-mono text-[9.5px] uppercase tracking-[0.1em] transition-colors duration-500 sm:text-[10.5px]"
                      style={{ color: isActive ? c?.accent : "var(--color-paper)" }}
                    >
                      {n.name}
                    </span>
                  </span>
                </button>
              );
            })}

            {/* detail readout */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 md:p-6">
              <p className="max-w-[46ch] text-[12.5px] leading-relaxed text-muted transition-opacity duration-500">
                {active ? (
                  <>
                    <span className="text-paper">{active}</span>: {nodeOf(active)?.detail}
                  </>
                ) : (
                  "Hover or tap a node."
                )}
              </p>
              <span className="label hidden md:block">
                {techNodes.length} nodes · {techEdges.length} links
              </span>
            </div>
          </div>
        </Reveal>
      </div>

      <style jsx>{`
        @keyframes float-node {
          0%, 100% { transform: translate(-50%, -50%); }
          50% { transform: translate(-50%, calc(-50% - 6px)); }
        }
      `}</style>
    </section>
  );
}
