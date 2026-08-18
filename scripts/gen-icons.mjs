/**
 * ICON GENERATOR
 * ──────────────
 * Writes public/icon.svg and public/apple-icon.svg from the same geometry as
 * the on-page mark in src/components/brand/Logo.tsx.
 *
 *   node scripts/gen-icons.mjs
 *
 * If you change BLADE or BLADES in the Logo component, change them here too and
 * re-run — the two are intentionally duplicated (the component needs refs and
 * interaction; the icons must be static files the browser can fetch) but they
 * must stay in sync.
 */

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** One annular sector, 80° wide, centred on the +x axis. */
const BLADE =
  "M14.758 9.685 L19.277 5.891 A9.5 9.5 0 0 1 19.277 18.109 L14.758 14.315 A3.6 3.6 0 0 0 14.758 9.685 Z";

const BLADES = [
  { rotate: 0, opacity: 1 },
  { rotate: 120, opacity: 0.68 },
  { rotate: 240, opacity: 0.42 },
];

const PAPER = "#edede7";
const ACCENT = "#d6f94c";
const INK = "#08080a";

/** `pad` shrinks the mark inside the tile — maskable icons need a safe area. */
function mark({ fg = PAPER, core = ACCENT, bg = INK, pad = 0 } = {}) {
  const body = BLADES.map(
    (b) =>
      `<path d="${BLADE}" fill="${fg}" opacity="${b.opacity}" transform="rotate(${b.rotate} 12 12)"` +
      ` stroke="${fg}" stroke-width="1.1" stroke-linejoin="round"/>`
  ).join("");

  const scale = (1 - pad).toFixed(3);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">` +
    (bg ? `<rect width="24" height="24" rx="5.5" fill="${bg}"/>` : "") +
    `<g transform="translate(12 12) scale(${scale}) translate(-12 -12)">` +
    body +
    `<circle cx="12" cy="12" r="1.85" fill="${core}"/>` +
    `</g></svg>`
  );
}

writeFileSync(join(ROOT, "public", "icon.svg"), mark({ pad: 0.14 }), "utf8");
writeFileSync(join(ROOT, "public", "apple-icon.svg"), mark({ pad: 0.24 }), "utf8");
console.log("wrote public/icon.svg and public/apple-icon.svg");
