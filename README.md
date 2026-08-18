# Portfolio — Basit Olajide

A motion-driven developer portfolio. Dark-first, editorial, built around a
single accent. Next.js 16 · React 19 · TypeScript · Tailwind 4 · GSAP
ScrollTrigger · Lenis · Motion · React Three Fiber.

```bash
npm run dev     # http://localhost:3000
npm run build   # 27 static pages (home + 19 case studies + journal + 4 posts + 404)
npm run lint
```

---

## The four things you'll actually want to change

### 1. Swap a placeholder for a real screenshot

Every project image is referenced from exactly one place: `src/data/projects.ts`.

```ts
hero: { src: "/images/projects/majorlink/hero.svg", alt: "…", device: "phone" },
```

Drop your screenshot at `public/images/projects/majorlink/hero.png`, change
`.svg` → `.png`, done. The featured rail, horizontal gallery, archive table,
menu preview and case study all read from that one object — nothing else needs
touching.

`device` picks the frame the image is composed into: `phone`, `browser`,
`laptop`, `tablet` or `flat`. Phone shots want a tall image (roughly 1:2),
everything else roughly 16:10.

**Regenerating the placeholders** (after adding a project, or to change an accent):

```bash
node scripts/gen-placeholders.mjs
```

That writes 55 SVG mockups — wallets, dashboards, outbreak maps, confusion
matrices, terminal output — each matched to its product's domain and tagged
`PLACEHOLDER` in the corner so none of them can be mistaken for a real screen.

### 2. Experience, credentials and hackathons

`src/data/experience.ts` holds four real roles (Cactus AI, Olyves, iléSure,
Gratebridge). Two dates disagree between the CV and the brief and carry an
inline comment saying which was used — check those.

`src/data/education.ts` holds the degree, two certifications (each with its
public verification URL, rendered as a preview card) and the three hackathons.
Hackathon entries are mirrored by a `hackathon` field on the matching project,
which drives the badge on that case study.

### 3. Publish the journal drafts

`src/data/posts.ts` holds four researched pieces. **All four are `draft: true`**,
which renders a "draft" badge on the index and a notice on the post itself.

They were written from current reporting and every factual claim carries a
`sources` list at the bottom of the post. They are drafts because the framing
and opinions are written *in your voice* — read them, make them sound like you,
correct anything you disagree with, then set `draft: false`.

- **When the cooling fails** — the August 2026 Namecheap outage, and using a
  vendor incident as a free audit of your own dependency graph
- **Nigeria's enforcement year** — the CBN's March–June 2026 rules, ring-fencing,
  market-share caps and the 31 December 2026 deadline
- **Stablecoins stopped being a crypto story** — GENIUS Act, MiCA, and settlement
  speed overtaking cost
- **Trust boundaries are enforced everywhere, or nowhere** — original engineering
  piece drawn from the iléSure audit

Posts are typed content blocks (`p`, `h`, `list`, `quote`, `code`, `note`) rather
than MDX, so they render through the site's own design system and cannot drift
out of style. Adding a post means adding one object to the array.

### 4. Identity, links and résumé

`src/data/site.ts` holds everything that is "about you" rather than "about a
project". Three items are marked `placeholder: true` and render a small `TODO`
next to them until you fix them:

- the three social URLs (GitHub / LinkedIn / X) — still the only placeholders left

The résumé points at the hosted CV on Cloudinary. Two of the four metric tiles
are computed from `projects.ts` at build time so they cannot drift; the other
two (`Products shipped`, `Years building`) are set by hand in `site.ts`.

The About portrait is an abstract placeholder that shifts under the pointer.
Swap the `<figure>` contents in `src/components/sections/About.tsx` for an
`<Image src="/images/portrait.jpg" …>` when you have a photograph.

---

## How the project data is structured

```
src/data/
  types.ts        Project / ExperienceEntry / TechNode shapes
  projects.ts     19 projects — the single source of truth
  posts.ts        journal posts (all four flagged as drafts)
  site.ts         identity, hero copy, chapters, nav, about, metrics
  experience.ts   timeline (dummy data, flagged)
  tech.ts         constellation nodes + edges
```

Each project carries a `status`:

- **`verified`** — the description is derived from that project's own
  repository, README, PRD or live product.
- **`awaiting-assets`** — structure is wired up but the copy is deliberately
  thin. The case study shows an "Awaiting assets" note explaining what's
  missing, and the archive row shows a small badge.

Two projects are currently `awaiting-assets`: Gratebridge and SIWES Tracker.

Live products and repositories are declared per project in `links`, tagged
`kind: "live"` or `kind: "repo"`. Live links render as URL preview cards on the
case study; repos render as compact rows. The preview artwork is generated from
the URL rather than scraped — see the note at the top of
`src/components/ui/LinkPreview.tsx` for why, and pass `image` to swap in a real
screenshot.

---

## Architecture

```
src/
  app/
    layout.tsx              fonts, loader, background, cursor, ⌘K, smooth scroll
    page.tsx                the chapter order — nothing else
    work/[slug]/page.tsx    SSG case studies + per-project metadata
    journal/page.tsx        journal index
    journal/[slug]/page.tsx SSG posts + article metadata
  components/
    layout/     Navbar (+ fullscreen menu), Loader, ScrollProgress,
                ChapterLabel, CommandPalette, FooterCTA
    motion/     SmoothScroll (Lenis↔ScrollTrigger), CustomCursor,
                MagneticButton, TextReveal / SplitText / Reveal
    sections/   Hero, Statement, FeaturedWork, HorizontalGallery,
                TechnologyConstellation, ExperienceTimeline, Credentials,
                About, Metrics
    ui/         LinkPreview / LinkRow — URL preview cards
    project/    ProjectImage, ProjectArchive, CaseStudy
    journal/    JournalIndex, PostView
    three/      ThreeHero — the hero WebGL scene
    bg/         AnimatedBackground — grain, grid, radial light, coordinate marks
  hooks/        useReducedMotion, useDeviceTier, useMouse, useSessionFlag
  lib/          gsap (single plugin registration), lenis (instance handle)
```

### Motion, in four levels

Most sections stay at level 1–2. Only the hero, the featured sequence and the
horizontal rail go to level 4.

| Level | What | Where |
|---|---|---|
| 1 — micro | hover, magnetic buttons, cursor states | everywhere |
| 2 — component | masked line reveals, image settle, card lift | most sections |
| 3 — section | scroll reveals, parallax, timeline draw | statement, experience, gallery |
| 4 — cinematic | sticky cross-dissolve, horizontal rail, WebGL hero | three places only |

### Why sticky, not ScrollTrigger `pin`

Both scroll set-pieces — the featured sequence and the horizontal rail — are
held by CSS `position: sticky`, and ScrollTrigger is used *only* to scrub a
timeline. This is deliberate.

ScrollTrigger's `pin` physically moves the pinned element into a generated
`.pin-spacer` wrapper. That works until React unmounts the tree on a route
change: React calls `removeChild` against the parent it remembers, the node now
lives under the pin-spacer, and you get

```
NotFoundError: Failed to execute 'removeChild' on 'Node'
```

which is what happened when clicking through to a project. Sticky reaches the
same visual result with zero DOM mutation, so navigation is safe and layout is
deterministic.

Two related fixes came out of the same area:

- **Transition pacing.** The cross-dissolves originally ran back-to-back with no
  hold, so two full-bleed project layouts were superimposed for most of the
  section — the "jampacked on top of each other" symptom. Each project now gets
  an explicit `HOLD`, and the outgoing project *leads* the incoming one rather
  than cross-fading with it. The constants are at the top of `FeaturedWork.tsx`;
  raise `HOLD` for a slower read, raise `PER_SLIDE_VH` for more scroll per project.
- **Nested reveals.** `ProjectImage` takes `reveal={false}`. Its own entrance
  ScrollTrigger measures against the document, which is meaningless for an image
  sitting in an absolutely-positioned slide inside a sticky stage — it left
  images stuck at partial opacity. Inside the sequence the slide transition owns
  the entrance instead.

### Performance decisions worth knowing

- **One animation loop.** Lenis is driven by the GSAP ticker rather than its own
  rAF, and `ScrollTrigger.update` runs on Lenis's scroll event. Two loops fighting
  each other is the usual cause of janky "smooth" scroll.
- **Pointer position lives in a ref, never in state.** A mousemove that triggers
  a React render 60×/second is the fastest way to make a site feel cheap.
- **WebGL is code-split and gated.** `useDeviceTier` only reports `canRun3D` on a
  desktop viewport with a fine pointer and ≥4 cores. Everything else gets a CSS
  composition that carries the same idea — not the 3D scene with the lights off.
- **Transforms and opacity only.** No animated width/height/top/left anywhere.
- **Blur filters are removed on completion** rather than left at `blur(0)`, which
  would keep a compositor layer alive for the life of the page.
- **The device pixel ratio is capped at 1.5** in the WebGL scene.

### Responsive behaviour

Mobile is not the desktop layout scaled down — different components render:

| | Desktop | Tablet | Mobile |
|---|---|---|---|
| Custom cursor | ✓ | — | — |
| Hero | WebGL scene | CSS rings | CSS rings, static |
| Featured work | sticky cross-dissolve | stacked scroll | stacked scroll |
| Horizontal rail | sticky, scroll-driven | sticky | native swipe + snap |
| Magnetic buttons | ✓ | ✓ | — |

### Accessibility

- `prefers-reduced-motion` is honoured throughout — masked reveals render in
  place, the pinned sequence falls back to the stacked layout, the cursor and
  loader do not mount, and CSS animations are neutralised globally.
- Skip link, semantic landmarks, visible focus rings that survive the motion
  layer, `aria-pressed` on filters, `aria-expanded` on the menu, alt text on
  every project image, decorative visuals marked `aria-hidden`.
- No content is only reachable through an animation.

### The mark

The logo is three blades rotating around a core — deliberately the same idea as
the hero WebGL object: a structure assembled from separate panels rather than one
solid shape. The blades carry stepped opacities (100% / 68% / 42%), which reads
as depth and makes the click easter egg legible: a 120° turn lands on identical
geometry but permutes the shading.

Geometry lives in `src/components/brand/Logo.tsx`. The favicon and apple-touch
icon share it and are generated to static files:

```bash
node scripts/gen-icons.mjs
```

If you change `BLADE` or `BLADES` in the component, change them in the script
too and re-run — they are intentionally duplicated (the component needs refs and
hover state; the icons must be fetchable files) but must stay in sync.

### Easter eggs

- `⌘K` / `Ctrl+K` opens a command palette over every section and project.
- Hovering a chapter number reveals the section's DOM id.
- Clicking the logo mark spins it a half turn.

None of them are load-bearing.

---

## Notes on content accuracy

Descriptions were written from each project's own repository — README, PRD,
architecture docs, `package.json` — and from the live product where one exists.
Two things worth flagging:

- **CI Guardian** is described here as a GitLab Duo Agent Platform build using
  FastAPI and Model Context Protocol tools, because that is what the local
  repository contains. If you also publish a separate Python git-hook package
  under the same name, it needs its own entry.
- **Stock Market Predictor**'s local directory is empty, so its case study is a
  scaffold only.

The RAF Compliance Repositioning Plan was deliberately left out of the site.
