"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { projects } from "@/data/projects";
import { nav, site } from "@/data/site";
import { lockScroll, unlockScroll } from "@/lib/lenis";

/**
 * COMMAND PALETTE — ⌘K / Ctrl+K
 * An easter egg for the technically curious, not a load-bearing navigation
 * path: everything reachable here is also reachable from the menu and the page.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const router = useRouter();

  // Closing always clears the query, so no effect has to reconcile the two.
  const close = useCallback(() => {
    setOpen(false);
    setQ("");
  }, []);

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [close]);

  useEffect(() => {
    if (open) lockScroll();
    else unlockScroll();
  }, [open]);

  const items = useMemo(() => {
    const all = [
      ...nav.map((n) => ({ label: n.label, hint: "Section", href: n.href })),
      ...projects.map((p) => ({ label: p.title, hint: p.typeLine, href: `/work/${p.slug}` })),
      { label: site.email, hint: "Copy email", href: `mailto:${site.email}` },
    ];
    const term = q.trim().toLowerCase();
    return term ? all.filter((i) => i.label.toLowerCase().includes(term) || i.hint.toLowerCase().includes(term)) : all;
  }, [q]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9000] flex items-start justify-center bg-ink/80 px-4 pt-[14vh] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={close}
    >
      <div
        className="glass w-full max-w-lg overflow-hidden rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Jump to…"
          aria-label="Search sections and projects"
          className="w-full border-b border-line bg-transparent px-5 py-4 text-[15px] text-paper outline-none placeholder:text-muted-2"
        />
        <ul data-lenis-prevent className="no-bar max-h-[46vh] overflow-y-auto overscroll-contain py-1">
          {items.length === 0 && <li className="px-5 py-4 text-sm text-muted">Nothing matches.</li>}
          {items.map((i) => (
            <li key={i.href + i.label}>
              <button
                type="button"
                onClick={() => {
                  close();
                  if (i.href.startsWith("mailto:")) window.location.href = i.href;
                  else router.push(i.href);
                }}
                className="flex w-full items-center justify-between px-5 py-2.5 text-left transition-colors hover:bg-paper/[0.05]"
              >
                <span className="text-[14px] text-paper">{i.label}</span>
                <span className="label">{i.hint}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between border-t border-line px-5 py-2.5">
          <span className="label">Esc to close</span>
          <span className="label">⌘K</span>
        </div>
      </div>
    </div>
  );
}
