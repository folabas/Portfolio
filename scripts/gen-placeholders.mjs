/**
 * PLACEHOLDER MOCKUP GENERATOR
 * ────────────────────────────
 * Writes one SVG per project image into public/images/projects/<slug>/.
 * Each mockup is a real UI composition matched to that product's domain —
 * a wallet, a campaign dashboard, an outbreak map, a confusion matrix — rendered
 * inside a browser, phone or flat frame.
 *
 * These exist so the layout is honest about scale and aspect ratio before real
 * screenshots arrive. Every file carries a small "PLACEHOLDER" tag so nobody
 * mistakes one for a shipped screen.
 *
 *   node scripts/gen-placeholders.mjs
 *
 * To replace: drop a real PNG at the same path and update `src` in src/data/projects.ts.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "images", "projects");

/* ── palette ─────────────────────────────────────────────────────────── */
const BG = "#0b0b0e";
const PANEL = "#121216";
const PANEL_2 = "#17171c";
const LINE = "#26262e";
const TEXT = "#e8e8e2";
const MUTED = "#6a6a72";

/* deterministic pseudo-random so regenerating gives identical files */
function rng(seed) {
  let s = [...seed].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const t = (x, y, str, { size = 13, fill = TEXT, weight = 400, anchor = "start", mono = false, ls = 0 } = {}) =>
  `<text x="${x}" y="${y}" font-family="${mono ? "ui-monospace, monospace" : "Inter, system-ui, sans-serif"}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" letter-spacing="${ls}">${esc(str)}</text>`;
const rect = (x, y, w, h, { fill = PANEL, r = 8, stroke = "", op = 1 } = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" opacity="${op}"${stroke ? ` stroke="${stroke}"` : ""}/>`;
const bar = (x, y, w, h, fill, r = 3) => rect(x, y, w, h, { fill, r });

/* ── content blocks (each returns SVG for a w×h region) ──────────────── */

const blocks = {
  /* balance + transaction list — fintech mobile */
  wallet(w, h, a, seed) {
    const r = rng(seed);
    const rows = Array.from({ length: 5 }, (_, i) => {
      const y = 300 + i * 74;
      return [
        rect(24, y, w - 48, 62, { fill: PANEL_2, r: 14 }),
        `<circle cx="58" cy="${y + 31}" r="17" fill="${a}" opacity="0.16"/>`,
        `<circle cx="58" cy="${y + 31}" r="6" fill="${a}" opacity="0.9"/>`,
        bar(88, y + 18, 96 + r() * 60, 9, "#2e2e36"),
        bar(88, y + 36, 62 + r() * 40, 7, "#212128"),
        t(w - 40, y + 30, (i % 2 ? "+₦" : "−₦") + (12 + Math.floor(r() * 88)) + ",500", {
          size: 13, anchor: "end", mono: true, fill: i % 2 ? a : MUTED,
        }),
      ].join("");
    }).join("");
    return [
      t(24, 52, "Balance", { size: 12, fill: MUTED, ls: 1.4 }),
      t(24, 100, "₦ 482,300.00", { size: 34, weight: 700 }),
      rect(24, 128, 96, 24, { fill: a, r: 12, op: 0.14 }),
      t(40, 145, "+4.2% wk", { size: 11, mono: true, fill: a }),
      ...["Send", "Convert", "Bills", "Cards"].map((l, i) =>
        rect(24 + i * ((w - 48) / 4), 176, (w - 48) / 4 - 10, 72, { fill: PANEL_2, r: 16 }) +
        `<circle cx="${24 + i * ((w - 48) / 4) + ((w - 48) / 4 - 10) / 2}" cy="206" r="9" fill="${a}" opacity="${0.25 + i * 0.1}"/>` +
        t(24 + i * ((w - 48) / 4) + ((w - 48) / 4 - 10) / 2, 236, l, { size: 10, anchor: "middle", fill: MUTED })
      ),
      t(24, 285, "RECENT", { size: 10, fill: MUTED, mono: true, ls: 1.8 }),
      rows,
    ].flat().join("");
  },

  /* KPI row + bar chart + table — admin console */
  dashboard(w, h, a, seed) {
    const r = rng(seed);
    const kpis = ["Volume", "Users", "Pending", "Reversals"].map((l, i) => {
      const x = 40 + i * ((w - 80) / 4);
      const cw = (w - 80) / 4 - 16;
      return [
        rect(x, 96, cw, 96, { fill: PANEL, r: 10 }),
        t(x + 18, 124, l.toUpperCase(), { size: 10, fill: MUTED, mono: true, ls: 1.6 }),
        t(x + 18, 162, i === 0 ? "₦18.4M" : `${(1 + r() * 9).toFixed(1)}k`, { size: 26, weight: 700 }),
        bar(x + cw - 46, 150, 28, 3 + r() * 18, a, 2),
      ].join("");
    }).join("");
    const chartY = 232, chartH = 210;
    const bars = Array.from({ length: 18 }, (_, i) => {
      const bh = 24 + r() * (chartH - 50);
      return bar(64 + i * 34, chartY + chartH - bh, 18, bh, i === 12 ? a : "#25252d");
    }).join("");
    const rows = Array.from({ length: 5 }, (_, i) => {
      const y = 500 + i * 46;
      return [
        `<line x1="40" y1="${y + 34}" x2="${w - 40}" y2="${y + 34}" stroke="${LINE}"/>`,
        t(56, y + 22, `TX-${8400 + i * 17}`, { size: 12, mono: true, fill: MUTED }),
        bar(180, y + 13, 130, 8, "#2a2a32"),
        bar(360, y + 13, 90, 8, "#232329"),
        rect(w - 190, y + 6, 78, 22, { fill: i === 1 ? "#3a2a18" : "#1b2a22", r: 11 }),
        t(w - 151, y + 21, i === 1 ? "review" : "settled", {
          size: 10, anchor: "middle", mono: true, fill: i === 1 ? "#f0a35e" : "#5fd6a0",
        }),
        t(w - 56, y + 22, `₦${(20 + r() * 400).toFixed(0)}k`, { size: 12, anchor: "end", mono: true }),
      ].join("");
    }).join("");
    return [
      t(40, 62, "Overview", { size: 20, weight: 600 }),
      rect(w - 200, 44, 160, 26, { fill: PANEL, r: 13 }),
      t(w - 120, 61, "Last 30 days", { size: 11, anchor: "middle", fill: MUTED, mono: true }),
      rect(40, chartY - 24, w - 80, chartH + 48, { fill: PANEL, r: 10 }),
      t(64, chartY - 2, "TRANSACTION VOLUME", { size: 10, fill: MUTED, mono: true, ls: 1.6 }),
      bars,
      t(40, 486, "RECENT TRANSACTIONS", { size: 10, fill: MUTED, mono: true, ls: 1.6 }),
      rows,
    ].join("");
  },

  /* line chart + donut + reach bars — campaign analytics */
  analytics(w, h, a, seed) {
    const r = rng(seed);
    const pts = Array.from({ length: 24 }, (_, i) => {
      const x = 72 + i * ((w - 420) / 23);
      const y = 300 - (40 + r() * 140);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    const donut = (cx, cy, rad, segs) => {
      let off = 0;
      const C = 2 * Math.PI * rad;
      return segs.map((s) => {
        const dash = `${(C * s.v).toFixed(1)} ${(C * (1 - s.v)).toFixed(1)}`;
        const el = `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="none" stroke="${s.c}" stroke-width="22" stroke-dasharray="${dash}" stroke-dashoffset="${(-C * off).toFixed(1)}" transform="rotate(-90 ${cx} ${cy})"/>`;
        off += s.v;
        return el;
      }).join("");
    };
    return [
      t(40, 62, "Campaign performance", { size: 20, weight: 600 }),
      rect(40, 90, w - 380, 260, { fill: PANEL, r: 10 }),
      t(72, 122, "DELIVERED REACH", { size: 10, fill: MUTED, mono: true, ls: 1.6 }),
      ...[0, 1, 2, 3].map((i) => `<line x1="72" y1="${150 + i * 50}" x2="${w - 372}" y2="${150 + i * 50}" stroke="${LINE}" stroke-dasharray="2 6"/>`),
      `<polyline points="${pts.join(" ")}" fill="none" stroke="${a}" stroke-width="2.5" stroke-linejoin="round"/>`,
      `<polygon points="${pts.join(" ")} ${w - 372},300 72,300" fill="${a}" opacity="0.09"/>`,
      rect(w - 320, 90, 280, 260, { fill: PANEL, r: 10 }),
      t(w - 292, 122, "SLOT MIX", { size: 10, fill: MUTED, mono: true, ls: 1.6 }),
      donut(w - 180, 236, 62, [{ v: 0.46, c: a }, { v: 0.3, c: "#4b5dff" }, { v: 0.24, c: "#2f2f38" }]),
      t(w - 180, 244, "46%", { size: 22, weight: 700, anchor: "middle" }),
      ...Array.from({ length: 4 }, (_, i) => {
        const y = 400 + i * 78;
        const pct = 0.35 + r() * 0.6;
        return [
          rect(40, y, w - 80, 62, { fill: PANEL, r: 10 }),
          `<circle cx="76" cy="${y + 31}" r="16" fill="${a}" opacity="0.18"/>`,
          bar(104, y + 18, 120, 9, "#2e2e36"),
          bar(104, y + 36, 74, 7, "#212128"),
          rect(280, y + 26, w - 460, 8, { fill: "#22222a", r: 4 }),
          rect(280, y + 26, (w - 460) * pct, 8, { fill: a, r: 4 }),
          t(w - 72, y + 37, `${(pct * 100).toFixed(0)}%`, { size: 13, anchor: "end", mono: true }),
        ].join("");
      }),
    ].flat().join("");
  },

  /* abstract region + report pins — civic / geographic */
  map(w, h, a, seed) {
    const r = rng(seed);
    const pins = Array.from({ length: 14 }, () => {
      const x = 120 + r() * (w - 460);
      const y = 150 + r() * (h - 280);
      const big = r() > 0.75;
      return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${big ? 13 : 6}" fill="${a}" opacity="${big ? 0.28 : 0.5}"/><circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${big ? 5 : 2.5}" fill="${a}"/>`;
    }).join("");
    const grid = Array.from({ length: 22 }, (_, i) =>
      `<line x1="${60 + i * 52}" y1="110" x2="${60 + i * 52}" y2="${h - 60}" stroke="${LINE}" opacity="0.5"/>`
    ).join("") + Array.from({ length: 12 }, (_, i) =>
      `<line x1="60" y1="${110 + i * 52}" x2="${w - 320}" y2="${110 + i * 52}" stroke="${LINE}" opacity="0.5"/>`
    ).join("");
    return [
      t(40, 62, "Reports · Oyo State", { size: 20, weight: 600 }),
      rect(40, 96, w - 320, h - 150, { fill: PANEL, r: 10 }),
      grid,
      `<path d="M 200 220 C 340 150, 620 180, 780 260 S 1000 430, 900 540 S 520 640, 340 560 S 120 350, 200 220 Z" fill="${a}" opacity="0.05" stroke="${a}" stroke-opacity="0.25" stroke-width="1.5"/>`,
      pins,
      rect(w - 260, 96, 220, h - 150, { fill: PANEL, r: 10 }),
      t(w - 236, 130, "OPEN REPORTS", { size: 10, fill: MUTED, mono: true, ls: 1.6 }),
      ...Array.from({ length: 6 }, (_, i) => {
        const y = 156 + i * 92;
        return [
          rect(w - 240, y, 180, 78, { fill: PANEL_2, r: 8 }),
          rect(w - 228, y + 12, 54, 54, { fill: "#20202a", r: 6 }),
          `<circle cx="${w - 201}" cy="${y + 39}" r="10" fill="${a}" opacity="0.3"/>`,
          bar(w - 162, y + 20, 88, 8, "#2e2e36"),
          bar(w - 162, y + 36, 56, 6, "#212128"),
          t(w - 162, y + 62, i < 2 ? "open" : "in progress", { size: 9, mono: true, fill: i < 2 ? a : MUTED }),
        ].join("");
      }),
    ].flat().join("");
  },

  /* photo card + price + filters — marketplace listing */
  listing(w, h, a, seed) {
    const r = rng(seed);
    return [
      rect(0, 0, w, 300, { fill: "#1a1a20", r: 0 }),
      `<path d="M0 300 L0 170 L${w * 0.3} 90 L${w * 0.58} 200 L${w * 0.78} 130 L${w} 240 L${w} 300 Z" fill="${a}" opacity="0.14"/>`,
      `<circle cx="${w * 0.78}" cy="72" r="30" fill="${a}" opacity="0.2"/>`,
      rect(20, 24, 40, 40, { fill: "#00000055", r: 20 }),
      rect(w - 60, 24, 40, 40, { fill: "#00000055", r: 20 }),
      rect(20, 250, 96, 30, { fill: a, r: 15 }),
      t(68, 270, "Verified", { size: 12, anchor: "middle", fill: "#0b0b0e", weight: 600 }),
      t(24, 356, "2-Bedroom · Oba Otudeko", { size: 20, weight: 600 }),
      t(24, 386, "Toll Gate corridor, Ibadan", { size: 13, fill: MUTED }),
      t(24, 440, "₦ 850,000", { size: 30, weight: 700, fill: a }),
      t(180, 440, "/ year", { size: 13, fill: MUTED }),
      ...["Shared", "Furnished", "Water", "Power"].map((l, i) => {
        const x = 24 + (i % 2) * ((w - 48) / 2);
        const y = 476 + Math.floor(i / 2) * 56;
        return rect(x, y, (w - 48) / 2 - 10, 44, { fill: PANEL_2, r: 10 }) +
          t(x + 16, y + 28, l, { size: 12, fill: MUTED });
      }),
      rect(24, 600, w - 48, 88, { fill: PANEL_2, r: 14 }),
      `<circle cx="66" cy="644" r="22" fill="${a}" opacity="0.2"/>`,
      bar(102, 626, 110, 9, "#2e2e36"),
      bar(102, 646, 148, 7, "#212128"),
      t(102, 676, "NIN · BVN · Ownership verified", { size: 9, mono: true, fill: a }),
      rect(24, h - 96, w - 48, 56, { fill: a, r: 16 }),
      t(w / 2, h - 61, "Book this listing", { size: 15, anchor: "middle", fill: "#0b0b0e", weight: 600 }),
      ...Array.from({ length: 3 }, (_, i) => rect(24 + i * 40, h - 132, r() > 0.5 ? 28 : 22, 6, { fill: "#26262e", r: 3 })),
    ].flat().join("");
  },

  /* candles + series — market data */
  chart(w, h, a, seed) {
    const r = rng(seed);
    let last = 220;
    const candles = Array.from({ length: 40 }, (_, i) => {
      const o = last;
      const c = Math.max(80, Math.min(340, o + (r() - 0.48) * 46));
      last = c;
      const up = c < o;
      const x = 80 + i * ((w - 400) / 40);
      const hi = Math.min(o, c) - r() * 22;
      const lo = Math.max(o, c) + r() * 22;
      const col = up ? a : "#3a3a44";
      return `<line x1="${x + 6}" y1="${hi.toFixed(0)}" x2="${x + 6}" y2="${lo.toFixed(0)}" stroke="${col}" stroke-width="1.2" opacity="0.7"/>` +
        rect(x, Math.min(o, c), 12, Math.max(3, Math.abs(c - o)), { fill: col, r: 1 });
    }).join("");
    return [
      t(40, 58, "DANGCEM", { size: 22, weight: 700 }),
      t(160, 58, "Dangote Cement Plc · NGX", { size: 13, fill: MUTED }),
      t(40, 92, "₦ 486.50", { size: 28, weight: 700 }),
      t(190, 92, "+2.14%", { size: 14, fill: a, mono: true }),
      rect(40, 118, w - 340, 300, { fill: PANEL, r: 10 }),
      ...[0, 1, 2, 3, 4].map((i) => `<line x1="80" y1="${150 + i * 60}" x2="${w - 320}" y2="${150 + i * 60}" stroke="${LINE}" stroke-dasharray="2 6"/>`),
      candles,
      rect(w - 280, 118, 240, 300, { fill: PANEL, r: 10 }),
      t(w - 256, 150, "KEY METRICS", { size: 10, fill: MUTED, mono: true, ls: 1.6 }),
      ...["P/E ratio", "Market cap", "Dividend yield", "52w range"].map((l, i) => {
        const y = 186 + i * 56;
        return t(w - 256, y, l, { size: 12, fill: MUTED }) +
          t(w - 64, y, ["14.2", "₦8.2T", "4.1%", "312–520"][i], { size: 13, anchor: "end", mono: true }) +
          `<line x1="${w - 256}" y1="${y + 20}" x2="${w - 64}" y2="${y + 20}" stroke="${LINE}"/>`;
      }),
      rect(40, 448, w - 80, 116, { fill: PANEL, r: 10 }),
      `<circle cx="78" cy="486" r="11" fill="${a}" opacity="0.35"/>`,
      t(100, 491, "What is a P/E ratio?", { size: 14, weight: 600 }),
      bar(64, 512, w - 200, 8, "#26262e"),
      bar(64, 530, w - 320, 8, "#212128"),
    ].flat().join("");
  },

  /* nodes + arrows — architecture / pipeline */
  pipeline(w, h, a, seed) {
    const stages = ["DATA", "PROCESSING", "MODEL", "PREDICTION", "SERVING"];
    const bw = 210, gap = (w - 80 - stages.length * bw) / (stages.length - 1);
    const nodes = stages.map((s, i) => {
      const x = 40 + i * (bw + gap);
      const active = i === 2;
      return [
        rect(x, 190, bw, 132, { fill: active ? PANEL_2 : PANEL, r: 10, stroke: active ? a : LINE }),
        t(x + 20, 222, String(i + 1).padStart(2, "0"), { size: 10, mono: true, fill: a, ls: 1.4 }),
        t(x + 20, 258, s, { size: 15, weight: 600 }),
        bar(x + 20, 274, bw - 80, 7, "#26262e"),
        bar(x + 20, 290, bw - 120, 7, "#1f1f26"),
        i < stages.length - 1
          ? `<line x1="${x + bw + 8}" y1="256" x2="${x + bw + gap - 14}" y2="256" stroke="${a}" stroke-width="1.4" opacity="0.5"/><path d="M ${x + bw + gap - 16} 251 l 7 5 l -7 5 Z" fill="${a}" opacity="0.7"/>`
          : "",
      ].join("");
    }).join("");
    const r = rng(seed);
    return [
      t(40, 62, "Pipeline", { size: 20, weight: 600 }),
      t(40, 92, "Reproducible from raw sources to served prediction", { size: 13, fill: MUTED }),
      nodes,
      rect(40, 372, w - 80, 180, { fill: PANEL, r: 10 }),
      t(64, 404, "STAGE OUTPUT", { size: 10, fill: MUTED, mono: true, ls: 1.6 }),
      ...Array.from({ length: 5 }, (_, i) =>
        t(64, 436 + i * 26, ["$ python rebuild_dataset.py", "  → merged 4 schema versions", "  → WHO mapping: 312 matched, 8 flagged", "  → features: climate · population · hospital", "  → dataset v7 written"][i], {
          size: 12, mono: true, fill: i === 0 ? TEXT : MUTED,
        })
      ),
      ...Array.from({ length: 3 }, (_, i) => `<circle cx="${w - 90 - i * 26}" cy="404" r="4" fill="${a}" opacity="${0.2 + r() * 0.5}"/>`),
    ].flat().join("");
  },

  /* terminal / checks — developer tooling */
  terminal(w, h, a, seed) {
    const lines = [
      ["$ ci-guardian analyze .gitlab-ci.yml", TEXT],
      ["", MUTED],
      ["  Structural integrity ........... pass", MUTED],
      ["  Cache configuration ........... warn", "#f0a35e"],
      ["  Job ordering .................. pass", MUTED],
      ["  Permission scope .............. fail", "#e4645a"],
      ["", MUTED],
      ["  RISK SCORE  62 / 100", a],
      ["", MUTED],
      ["  → deploy: job runs with overly permissive scope", MUTED],
      ["    fix: scope the token to read_repository", a],
    ];
    return [
      rect(40, 90, w - 460, h - 150, { fill: "#0e0e12", r: 10, stroke: LINE }),
      rect(40, 90, w - 460, 38, { fill: PANEL, r: 10 }),
      ...[0, 1, 2].map((i) => `<circle cx="${68 + i * 20}" cy="109" r="5" fill="${["#e4645a", "#f0a35e", "#5fd6a0"][i]}" opacity="0.55"/>`),
      t(140, 114, "pipeline-analysis", { size: 11, mono: true, fill: MUTED }),
      ...lines.map(([l, c], i) => t(72, 168 + i * 30, l, { size: 13, mono: true, fill: c })),
      rect(w - 400, 90, 360, 250, { fill: PANEL, r: 10 }),
      t(w - 372, 124, "RISK SCORE", { size: 10, fill: MUTED, mono: true, ls: 1.6 }),
      `<circle cx="${w - 220}" cy="222" r="62" fill="none" stroke="#22222a" stroke-width="14"/>`,
      `<circle cx="${w - 220}" cy="222" r="62" fill="none" stroke="${a}" stroke-width="14" stroke-dasharray="${(2 * Math.PI * 62 * 0.62).toFixed(0)} ${(2 * Math.PI * 62 * 0.38).toFixed(0)}" transform="rotate(-90 ${w - 220} 222)" stroke-linecap="round"/>`,
      t(w - 220, 232, "62", { size: 34, weight: 700, anchor: "middle" }),
      rect(w - 400, 364, 360, h - 424, { fill: PANEL, r: 10 }),
      t(w - 372, 398, "CHECKS", { size: 10, fill: MUTED, mono: true, ls: 1.6 }),
      ...["Syntax", "Stages", "Cache", "Security", "Ordering"].map((l, i) => {
        const y = 432 + i * 46;
        const ok = i !== 2 && i !== 3;
        return t(w - 372, y, l, { size: 13, fill: MUTED }) +
          `<circle cx="${w - 84}" cy="${y - 5}" r="5" fill="${ok ? a : "#e4645a"}" opacity="0.8"/>`;
      }),
    ].flat().join("");
  },

  /* grid of cards — catalogue / archive */
  catalogue(w, h, a, seed) {
    const r = rng(seed);
    const cols = 3, rows = 2;
    const cw = (w - 80 - (cols - 1) * 24) / cols;
    const ch = (h - 180 - (rows - 1) * 24) / rows;
    const cards = Array.from({ length: cols * rows }, (_, i) => {
      const x = 40 + (i % cols) * (cw + 24);
      const y = 130 + Math.floor(i / cols) * (ch + 24);
      return [
        rect(x, y, cw, ch, { fill: PANEL, r: 10 }),
        rect(x + 1, y + 1, cw - 2, ch * 0.58, { fill: "#1b1b22", r: 9 }),
        `<circle cx="${x + cw * 0.5}" cy="${y + ch * 0.29}" r="${26 + r() * 16}" fill="${a}" opacity="${0.1 + r() * 0.16}"/>`,
        `<path d="M ${x + 20} ${y + ch * 0.55} L ${x + cw * 0.35} ${y + ch * 0.3} L ${x + cw * 0.62} ${y + ch * 0.44} L ${x + cw - 20} ${y + ch * 0.22}" fill="none" stroke="${a}" stroke-width="1.6" opacity="0.35"/>`,
        bar(x + 18, y + ch * 0.58 + 22, cw * 0.55, 9, "#2e2e36"),
        bar(x + 18, y + ch * 0.58 + 42, cw * 0.34, 7, "#212128"),
        t(x + cw - 18, y + ch * 0.58 + 30, "0" + (i + 1), { size: 11, anchor: "end", mono: true, fill: MUTED }),
      ].join("");
    }).join("");
    return [
      t(40, 62, "Archive", { size: 20, weight: 600 }),
      ...["All", "Vision", "Forecasting", "Services"].map((l, i) =>
        rect(40 + i * 104, 82, 92, 28, { fill: i === 0 ? a : PANEL, r: 14 }) +
        t(86 + i * 104, 101, l, { size: 11, anchor: "middle", fill: i === 0 ? "#0b0b0e" : MUTED })
      ),
      cards,
    ].flat().join("");
  },

  /* email layout preview */
  email(w, h, a, seed) {
    return [
      rect(40, 96, 320, h - 156, { fill: PANEL, r: 10 }),
      t(64, 130, "TEMPLATES", { size: 10, fill: MUTED, mono: true, ls: 1.6 }),
      ...["Welcome", "Bid received", "Task assigned", "Payout sent", "Password reset", "Digest"].map((l, i) =>
        (i === 1 ? rect(52, 148 + i * 46, 296, 38, { fill: PANEL_2, r: 8 }) : "") +
        t(70, 172 + i * 46, l, { size: 13, fill: i === 1 ? TEXT : MUTED })
      ),
      rect(392, 96, w - 432, h - 156, { fill: "#f6f6f2", r: 10 }),
      rect(392, 96, w - 432, 44, { fill: "#eaeae4", r: 10 }),
      t(416, 124, "hello@olyves.com → you", { size: 11, mono: true, fill: "#8b8b83" }),
      rect(444, 176, 120, 26, { fill: a, r: 4, op: 0.9 }),
      rect(444, 232, w - 620, 22, { fill: "#dededa", r: 3 }),
      rect(444, 268, w - 700, 14, { fill: "#e6e6e2", r: 3 }),
      rect(444, 294, w - 660, 14, { fill: "#e6e6e2", r: 3 }),
      rect(444, 320, w - 780, 14, { fill: "#e6e6e2", r: 3 }),
      rect(444, 372, 176, 46, { fill: "#16161a", r: 6 }),
      t(532, 401, "View the bid", { size: 13, anchor: "middle", fill: "#f6f6f2", weight: 600 }),
      rect(444, 456, w - 620, 1, { fill: "#dededa" }),
      rect(444, 486, w - 760, 12, { fill: "#e6e6e2", r: 3 }),
    ].flat().join("");
  },

  /* confusion matrix + curves — model evaluation */
  matrix(w, h, a, seed) {
    const r = rng(seed);
    const n = 4, cell = 74, ox = 100, oy = 170;
    const cells = Array.from({ length: n * n }, (_, i) => {
      const row = Math.floor(i / n), col = i % n;
      const diag = row === col;
      const v = diag ? 0.72 + r() * 0.24 : r() * 0.16;
      return rect(ox + col * cell, oy + row * cell, cell - 4, cell - 4, { fill: a, r: 3, op: Math.max(0.05, v) }) +
        t(ox + col * cell + (cell - 4) / 2, oy + row * cell + (cell - 4) / 2 + 5, v.toFixed(2), {
          size: 11, anchor: "middle", mono: true, fill: v > 0.5 ? "#0b0b0e" : MUTED,
        });
    }).join("");
    const curve = (yBase, col, mul) =>
      `<polyline points="${Array.from({ length: 26 }, (_, i) => `${640 + i * 15},${(yBase - (1 - Math.exp(-i / 6)) * 90 * mul - r() * 6).toFixed(1)}`).join(" ")}" fill="none" stroke="${col}" stroke-width="2"/>`;
    return [
      t(40, 62, "Model evaluation", { size: 20, weight: 600 }),
      t(40, 92, "Skin tone classifier · ResNet50 · 4 classes", { size: 13, fill: MUTED }),
      t(100, 150, "CONFUSION MATRIX", { size: 10, fill: MUTED, mono: true, ls: 1.6 }),
      cells,
      ...["light", "mid-light", "mid-dark", "dark"].map((l, i) =>
        t(92, oy + i * cell + 42, l, { size: 10, anchor: "end", fill: MUTED })
      ),
      rect(620, 130, w - 660, 220, { fill: PANEL, r: 10 }),
      t(644, 162, "TRAINING CURVES", { size: 10, fill: MUTED, mono: true, ls: 1.6 }),
      curve(330, a, 1),
      curve(330, "#4b5dff", 0.86),
      ...["Accuracy", "F1", "Precision", "Recall"].map((l, i) => {
        const x = 620 + (i % 2) * 200, y = 396 + Math.floor(i / 2) * 84;
        return rect(x, y, 184, 68, { fill: PANEL, r: 10 }) +
          t(x + 18, y + 26, l.toUpperCase(), { size: 9, fill: MUTED, mono: true, ls: 1.4 }) +
          t(x + 18, y + 54, "—", { size: 22, weight: 700, fill: MUTED });
      }),
      t(100, h - 74, "Target ≥85%. Measured results pending write-up.", { size: 11, fill: MUTED, mono: true }),
    ].flat().join("");
  },

  /* jurisdiction nodes + stage tracker — compliance */
  jurisdiction(w, h, a, seed) {
    const r = rng(seed);
    const nodes = Array.from({ length: 9 }, (_, i) => {
      const x = 120 + (i % 3) * 220 + r() * 60;
      const y = 200 + Math.floor(i / 3) * 150 + r() * 40;
      return { x, y, on: i < 4 };
    });
    const edges = nodes.slice(1).map((n, i) =>
      `<line x1="${nodes[i].x}" y1="${nodes[i].y}" x2="${n.x}" y2="${n.y}" stroke="${a}" stroke-width="1" opacity="0.16"/>`
    ).join("");
    return [
      t(40, 62, "Jurisdictions", { size: 20, weight: 600 }),
      rect(40, 96, w - 400, h - 156, { fill: PANEL, r: 10 }),
      edges,
      ...nodes.map((n) =>
        `<circle cx="${n.x.toFixed(0)}" cy="${n.y.toFixed(0)}" r="${n.on ? 16 : 9}" fill="${a}" opacity="${n.on ? 0.22 : 0.1}"/>` +
        `<circle cx="${n.x.toFixed(0)}" cy="${n.y.toFixed(0)}" r="${n.on ? 5 : 3}" fill="${a}" opacity="${n.on ? 0.95 : 0.4}"/>`
      ),
      rect(w - 340, 96, 300, h - 156, { fill: PANEL, r: 10 }),
      t(w - 316, 130, "LICENSING STAGES", { size: 10, fill: MUTED, mono: true, ls: 1.6 }),
      ...["Incorporation", "Regulatory filing", "Banking partner", "Licence granted", "Market entry"].map((l, i) => {
        const y = 174 + i * 74;
        const done = i < 2;
        return `<line x1="${w - 300}" y1="${y}" x2="${w - 300}" y2="${y + 56}" stroke="${LINE}"/>` +
          `<circle cx="${w - 300}" cy="${y}" r="7" fill="${done ? a : "#22222a"}"/>` +
          t(w - 276, y + 5, l, { size: 13, fill: done ? TEXT : MUTED }) +
          t(w - 276, y + 26, done ? "complete" : "pending", { size: 10, mono: true, fill: MUTED });
      }),
    ].flat().join("");
  },

  /* video room grid + chat — real-time */
  room(w, h, a, seed) {
    const r = rng(seed);
    return [
      rect(40, 96, w - 380, (w - 380) * 0.5, { fill: "#101014", r: 10 }),
      `<path d="M0 0" />`,
      `<circle cx="${40 + (w - 380) / 2}" cy="${96 + (w - 380) * 0.25}" r="46" fill="${a}" opacity="0.14"/>`,
      `<path d="M ${40 + (w - 380) / 2 - 14} ${96 + (w - 380) * 0.25 - 20} l 34 20 l -34 20 Z" fill="${a}" opacity="0.85"/>`,
      rect(64, 96 + (w - 380) * 0.5 - 46, w - 428, 30, { fill: "#00000066", r: 15 }),
      rect(76, 96 + (w - 380) * 0.5 - 38, (w - 452) * 0.42, 14, { fill: a, r: 7 }),
      ...Array.from({ length: 4 }, (_, i) =>
        rect(40 + i * ((w - 380) / 4), 96 + (w - 380) * 0.5 + 20, (w - 380) / 4 - 14, 110, { fill: PANEL, r: 8 }) +
        `<circle cx="${40 + i * ((w - 380) / 4) + ((w - 380) / 4 - 14) / 2}" cy="${96 + (w - 380) * 0.5 + 72}" r="22" fill="${a}" opacity="${0.12 + r() * 0.14}"/>`
      ),
      rect(w - 320, 96, 280, h - 156, { fill: PANEL, r: 10 }),
      t(w - 296, 130, "ROOM CHAT", { size: 10, fill: MUTED, mono: true, ls: 1.6 }),
      ...Array.from({ length: 7 }, (_, i) => {
        const y = 162 + i * 62;
        const mine = i % 3 === 2;
        const bwid = 120 + r() * 90;
        return rect(mine ? w - 64 - bwid : w - 296, y, bwid, 44, { fill: mine ? a : PANEL_2, r: 10, op: mine ? 0.16 : 1 }) +
          bar(mine ? w - 52 - bwid : w - 284, y + 14, bwid - 24, 7, mine ? a : "#2e2e36") +
          bar(mine ? w - 52 - bwid : w - 284, y + 28, (bwid - 24) * 0.6, 6, "#232329");
      }),
      rect(w - 296, h - 108, 232, 40, { fill: PANEL_2, r: 20 }),
      t(w - 274, h - 82, "Say something…", { size: 12, fill: MUTED }),
    ].flat().join("");
  },

  /* warm editorial — non-profit */
  editorial(w, h, a, seed) {
    const r = rng(seed);
    return [
      rect(40, 96, w - 80, 260, { fill: "#1a1712", r: 10 }),
      `<circle cx="${w * 0.24}" cy="226" r="86" fill="${a}" opacity="0.16"/>`,
      `<circle cx="${w * 0.36}" cy="252" r="52" fill="${a}" opacity="0.1"/>`,
      `<path d="M ${w * 0.55} 320 Q ${w * 0.68} 150 ${w * 0.92} 250" fill="none" stroke="${a}" stroke-width="1.5" opacity="0.3"/>`,
      t(72, 176, "Education · Community · Relief", { size: 11, mono: true, fill: a, ls: 1.6 }),
      t(72, 232, "Programmes", { size: 34, weight: 700 }),
      bar(72, 262, 420, 10, "#2a2620"),
      bar(72, 284, 320, 10, "#231f1a"),
      ...Array.from({ length: 3 }, (_, i) => {
        const cw = (w - 80 - 48) / 3;
        const x = 40 + i * (cw + 24);
        return rect(x, 384, cw, h - 444, { fill: PANEL, r: 10 }) +
          rect(x + 1, 385, cw - 2, 150, { fill: "#211d18", r: 9 }) +
          `<circle cx="${x + cw * 0.5}" cy="460" r="${30 + r() * 14}" fill="${a}" opacity="${0.14 + r() * 0.12}"/>` +
          t(x + 20, 570, ["Scholarships", "Community", "Relief"][i], { size: 16, weight: 600 }) +
          bar(x + 20, 590, cw - 70, 8, "#2a2620") +
          bar(x + 20, 610, cw - 110, 8, "#231f1a") +
          t(x + 20, 654, "Learn more →", { size: 12, fill: a });
      }),
    ].flat().join("");
  },

  /* service cards — lifestyle booking */
  booking(w, h, a, seed) {
    const r = rng(seed);
    return [
      rect(40, 96, w - 80, 200, { fill: "#1d1519", r: 10 }),
      `<circle cx="${w * 0.8}" cy="196" r="94" fill="${a}" opacity="0.16"/>`,
      `<circle cx="${w * 0.88}" cy="140" r="42" fill="${a}" opacity="0.1"/>`,
      t(76, 172, "EL.AY BEAUTY", { size: 11, mono: true, fill: a, ls: 2.4 }),
      t(76, 226, "Book a service", { size: 32, weight: 700 }),
      t(76, 258, "Choose a treatment, a size and a time.", { size: 13, fill: MUTED }),
      ...Array.from({ length: 6 }, (_, i) => {
        const cw = (w - 80 - 2 * 20) / 3;
        const x = 40 + (i % 3) * (cw + 20);
        const y = 328 + Math.floor(i / 3) * 190;
        return rect(x, y, cw, 170, { fill: PANEL, r: 10 }) +
          rect(x + 1, y + 1, cw - 2, 96, { fill: "#241a1f", r: 9 }) +
          `<circle cx="${x + cw * 0.5}" cy="${y + 48}" r="${20 + r() * 12}" fill="${a}" opacity="${0.16 + r() * 0.14}"/>` +
          t(x + 18, y + 124, ["Braids", "Lashes", "Nails", "Facial", "Locs", "Colour"][i], { size: 15, weight: 600 }) +
          t(x + 18, y + 148, `${45 + i * 15} min`, { size: 11, mono: true, fill: MUTED }) +
          t(x + cw - 18, y + 148, `₦${8 + i * 4},000`, { size: 12, anchor: "end", mono: true, fill: a });
      }),
    ].flat().join("");
  },

  /* task feed + bids */
  tasks(w, h, a, seed) {
    const r = rng(seed);
    return [
      t(24, 56, "Open tasks", { size: 24, weight: 700 }),
      rect(24, 78, 120, 26, { fill: a, r: 13, op: 0.16 }),
      t(84, 96, "12 near you", { size: 11, anchor: "middle", mono: true, fill: a }),
      ...Array.from({ length: 4 }, (_, i) => {
        const y = 132 + i * 168;
        const bids = 2 + Math.floor(r() * 6);
        return [
          rect(24, y, w - 48, 152, { fill: PANEL, r: 14 }),
          t(44, y + 36, ["Move a 2-bed flat", "Fix kitchen plumbing", "Photograph an event", "Deep clean, 3 rooms"][i], { size: 16, weight: 600 }),
          t(44, y + 60, "Ibadan · today", { size: 11, mono: true, fill: MUTED }),
          bar(44, y + 78, w - 140, 8, "#26262e"),
          bar(44, y + 96, w - 220, 8, "#1f1f26"),
          `<line x1="44" y1="${y + 116}" x2="${w - 68}" y2="${y + 116}" stroke="${LINE}"/>`,
          t(44, y + 138, `${bids} bids`, { size: 12, mono: true, fill: a }),
          t(w - 68, y + 138, `₦${15 + i * 12},000`, { size: 14, anchor: "end", weight: 600 }),
        ].join("");
      }),
    ].flat().join("");
  },

  /* savings plans */
  savings(w, h, a, seed) {
    const r = rng(seed);
    return [
      t(24, 52, "Total savings balance", { size: 12, fill: MUTED }),
      t(24, 100, "₦ 1,240,000", { size: 32, weight: 700 }),
      rect(24, 130, w - 48, 116, { fill: PANEL_2, r: 16 }),
      t(44, 162, "GOAL · RENT 2027", { size: 10, mono: true, fill: a, ls: 1.6 }),
      rect(44, 180, w - 88, 10, { fill: "#22222a", r: 5 }),
      rect(44, 180, (w - 88) * 0.62, 10, { fill: a, r: 5 }),
      t(44, 218, "62% · ₦760,000 to go", { size: 12, fill: MUTED }),
      t(24, 286, "SAVINGS BREAKDOWN", { size: 10, mono: true, fill: MUTED, ls: 1.8 }),
      ...["Target savings", "Locked savings", "Community savings"].map((l, i) => {
        const y = 306 + i * 92;
        return rect(24, y, w - 48, 78, { fill: PANEL, r: 14 }) +
          `<circle cx="60" cy="${y + 39}" r="16" fill="${a}" opacity="${0.3 - i * 0.07}"/>` +
          t(90, y + 34, l, { size: 14, weight: 600 }) +
          t(90, y + 56, `${2 + i} plans`, { size: 11, mono: true, fill: MUTED }) +
          t(w - 44, y + 45, `₦${(300 + r() * 500).toFixed(0)}k`, { size: 14, anchor: "end", mono: true });
      }),
      rect(24, 596, w - 48, 96, { fill: PANEL_2, r: 16 }),
      t(44, 630, "LEARN", { size: 10, mono: true, fill: a, ls: 1.8 }),
      t(44, 660, "How compound saving works", { size: 14, weight: 600 }),
      rect(24, h - 96, w - 48, 56, { fill: a, r: 16 }),
      t(w / 2, h - 61, "Create a plan", { size: 15, anchor: "middle", fill: "#0b0b0e", weight: 600 }),
    ].flat().join("");
  },

  /* generic API / service diagram */
  service(w, h, a, seed) {
    const layers = [
      ["CLIENTS", ["Mobile", "Web", "Admin"]],
      ["API", ["Auth", "Reports", "Media", "Rate limit"]],
      ["DATA", ["MongoDB", "Cloudinary"]],
    ];
    let y = 130;
    const out = [];
    layers.forEach(([label, items]) => {
      out.push(t(40, y, label, { size: 10, mono: true, fill: MUTED, ls: 1.8 }));
      const bw = (w - 80 - (items.length - 1) * 20) / items.length;
      items.forEach((it, i) => {
        const x = 40 + i * (bw + 20);
        out.push(rect(x, y + 18, bw, 96, { fill: PANEL, r: 10, stroke: LINE }));
        out.push(t(x + 20, y + 56, it, { size: 15, weight: 600 }));
        out.push(bar(x + 20, y + 74, bw * 0.5, 7, "#26262e"));
        out.push(`<circle cx="${x + bw - 24}" cy="${y + 42}" r="4" fill="${a}" opacity="0.6"/>`);
      });
      y += 176;
      if (y < h - 120) {
        out.push(`<line x1="${w / 2}" y1="${y - 42}" x2="${w / 2}" y2="${y - 12}" stroke="${a}" stroke-width="1.2" opacity="0.4"/>`);
        out.push(`<path d="M ${w / 2 - 5} ${y - 16} l 5 7 l 5 -7 Z" fill="${a}" opacity="0.6"/>`);
      }
    });
    out.push(t(40, h - 60, "JWT · bcrypt · express-rate-limit · multer → Cloudinary", { size: 12, mono: true, fill: MUTED }));
    return out.join("");
  },
};

/* ── frames ──────────────────────────────────────────────────────────── */

function browserFrame(inner, w, h, a) {
  const CH = 46;
  return `
  <rect x="0" y="0" width="${w}" height="${h}" rx="14" fill="${BG}" stroke="${LINE}"/>
  <rect x="0" y="0" width="${w}" height="${CH}" fill="${PANEL}"/>
  <line x1="0" y1="${CH}" x2="${w}" y2="${CH}" stroke="${LINE}"/>
  ${[0, 1, 2].map((i) => `<circle cx="${28 + i * 20}" cy="${CH / 2}" r="5.5" fill="#2c2c34"/>`).join("")}
  <rect x="112" y="${CH / 2 - 12}" width="${w - 200}" height="24" rx="12" fill="${PANEL_2}"/>
  <circle cx="130" cy="${CH / 2}" r="3.5" fill="${a}" opacity="0.7"/>
  <g transform="translate(0 ${CH})">${inner}</g>`;
}

function phoneFrame(inner, w, h, a) {
  return `
  <rect x="0" y="0" width="${w}" height="${h}" rx="54" fill="#16161b" stroke="${LINE}" stroke-width="2"/>
  <rect x="10" y="10" width="${w - 20}" height="${h - 20}" rx="46" fill="${BG}"/>
  <rect x="${w / 2 - 58}" y="24" width="116" height="26" rx="13" fill="#0b0b0e"/>
  <g transform="translate(10 74)">${inner}</g>
  <rect x="${w / 2 - 64}" y="${h - 30}" width="128" height="5" rx="2.5" fill="#33333c"/>`;
}

function flatFrame(inner, w, h) {
  return `<rect x="0" y="0" width="${w}" height="${h}" rx="12" fill="${BG}" stroke="${LINE}"/>${inner}`;
}

/* ── assembly ────────────────────────────────────────────────────────── */

function build({ slug, name, kind, device, accent }) {
  const isPhone = device === "phone";
  const W = isPhone ? 760 : 1600;
  const H = isPhone ? 1520 : 1000;
  const innerW = isPhone ? W - 20 : W;
  const innerH = isPhone ? H - 84 : H - 46;

  const body = blocks[kind](innerW, innerH, accent, slug + name);
  const framed =
    device === "phone" ? phoneFrame(body, W, H, accent)
    : device === "browser" ? browserFrame(body, W, H, accent)
    : flatFrame(body, W, H);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Placeholder interface mockup">
<defs>
  <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="${accent}" stop-opacity="0.10"/>
    <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
  </linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="${BG}"/>
<rect width="${W}" height="${H}" fill="url(#g)"/>
${framed}
<g opacity="0.55">
  <rect x="${W - 148}" y="${H - 42}" width="120" height="22" rx="11" fill="#000" fill-opacity="0.45"/>
  <text x="${W - 88}" y="${H - 27}" font-family="ui-monospace, monospace" font-size="9" fill="${MUTED}" text-anchor="middle" letter-spacing="1.4">PLACEHOLDER</text>
</g>
</svg>`;
}

/* which composition each project image uses */
const MANIFEST = {
  majorlink: { accent: "#4b5dff", images: [["hero", "wallet", "phone"], ["shot-1", "wallet", "phone"], ["shot-2", "savings", "phone"], ["shot-3", "dashboard", "browser"]] },
  reportam: { accent: "#35c4a8", images: [["hero", "map", "browser"], ["shot-1", "listing", "phone"], ["shot-2", "dashboard", "browser"]] },
  "reportus-backend": { accent: "#7d8b9c", images: [["hero", "service", "flat"], ["shot-1", "pipeline", "flat"]] },
  connectus: { accent: "#e4483f", images: [["hero", "room", "browser"], ["shot-1", "room", "browser"], ["shot-2", "tasks", "phone"]] },
  easilypromote: { accent: "#feb604", images: [["hero", "analytics", "browser"], ["shot-1", "analytics", "browser"], ["shot-2", "dashboard", "browser"], ["shot-3", "wallet", "phone"]] },
  ilesure: { accent: "#f0894b", images: [["hero", "listing", "phone"], ["shot-1", "listing", "phone"], ["shot-2", "wallet", "phone"], ["shot-3", "dashboard", "browser"]] },
  stockpedia: { accent: "#2ecc8f", images: [["hero", "chart", "browser"], ["shot-1", "chart", "browser"], ["shot-2", "savings", "phone"]] },
  "raf-mobile": { accent: "#c9a227", images: [["hero", "savings", "phone"], ["shot-1", "savings", "phone"], ["shot-2", "tasks", "phone"]] },
  "rich-aunty-finance": { accent: "#c9a227", images: [["hero", "editorial", "browser"], ["shot-1", "catalogue", "browser"]] },
  gratebridge: { accent: "#3e7bfa", images: [["hero", "jurisdiction", "browser"], ["shot-1", "jurisdiction", "browser"], ["shot-2", "pipeline", "browser"]] },
  olyves: { accent: "#16c79a", images: [["hero", "tasks", "phone"], ["shot-1", "tasks", "phone"], ["shot-2", "wallet", "phone"]] },
  "elay-beauty": { accent: "#e8a0b8", images: [["hero", "booking", "browser"], ["shot-1", "listing", "phone"], ["shot-2", "catalogue", "browser"]] },
  "disease-outbreak-prediction": { accent: "#45b0e3", images: [["hero", "map", "browser"], ["shot-1", "pipeline", "flat"], ["shot-2", "chart", "browser"]] },
  "stock-market-predictor": { accent: "#7bd389", images: [["hero", "chart", "browser"], ["shot-1", "matrix", "flat"]] },
  "siwes-tracker": { accent: "#5b8def", images: [["hero", "dashboard", "browser"], ["shot-1", "catalogue", "browser"], ["shot-2", "tasks", "phone"]] },
  "machine-learning": { accent: "#9aa5b1", images: [["hero", "catalogue", "browser"], ["shot-1", "matrix", "flat"]] },
  "ci-guardian": { accent: "#ff8a3d", images: [["hero", "terminal", "browser"], ["shot-1", "terminal", "flat"], ["shot-2", "pipeline", "browser"]] },
  eleemosy: { accent: "#e9a03b", images: [["hero", "editorial", "browser"], ["shot-1", "editorial", "browser"], ["shot-2", "listing", "phone"]] },
  "tona-app-model": { accent: "#d98e6a", images: [["hero", "matrix", "browser"], ["shot-1", "matrix", "flat"]] },
};

let count = 0;
for (const [slug, cfg] of Object.entries(MANIFEST)) {
  const dir = join(OUT, slug);
  mkdirSync(dir, { recursive: true });
  for (const [name, kind, device] of cfg.images) {
    writeFileSync(join(dir, `${name}.svg`), build({ slug, name, kind, device, accent: cfg.accent }), "utf8");
    count++;
  }
}
console.log(`generated ${count} placeholder mockups across ${Object.keys(MANIFEST).length} projects`);
