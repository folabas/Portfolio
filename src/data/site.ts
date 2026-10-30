import { projects } from "./projects";

/**
 * IDENTITY + SITE CONTENT
 * Single source of truth for anything that is "about the person" rather than
 * "about a project". Placeholders are marked so nothing reads as a real claim.
 */

export const site = {
  name: "Basit Olajide",
  shortName: "Basit",
  initials: "BO",
  role: "Software Engineer · Full-stack · Mobile · AI",
  location: "Ibadan, Nigeria",
  timezone: "GMT+1",
  availability: "Available for work",
  year: "2026",

  email: "folabas2@gmail.com",
  phone: "+234 810 232 3281",

  /** TODO — replace the placeholder hrefs with your real profiles. */
  socials: [
    { label: "GitHub", href: "https://github.com/", placeholder: true },
    { label: "LinkedIn", href: "https://linkedin.com/in/", placeholder: true },
    { label: "X", href: "https://x.com/", placeholder: true },
  ],

  resume: {
    label: "Résumé",
    href: "https://res.cloudinary.com/daptfl7az/raw/upload/v1787071460/BASIT_OLAJIDE_CV.docx",
    placeholder: false,
  },
} as const;

export const hero = {
  lines: ["I build", "products", "that ship."],
  /** The word that takes the accent. Index into `lines`. */
  accentLine: 2,
  standfirst:
    "Software engineer working across fintech, marketplaces, mobile and machine learning, from the payment rail to the pixel.",
} as const;

export const statement = {
  lines: [
    "I don't just",
    "write code.",
    "I build the",
    "systems money,",
    "housing and",
    "data move through.",
  ],
  accentLines: [3, 5],
} as const;

/**
 * HOME-PAGE CHAPTERS
 * Drives the left-margin progress rail. Ids must match the section elements on
 * the home page — sections that moved to their own route are not chapters.
 */
export const chapters = [
  { id: "intro", label: "INTRO" },
  { id: "projects", label: "PROJECTS" },
  { id: "statement", label: "IDENTITY" },
  { id: "stack", label: "STACK" },
  { id: "contact", label: "CONTACT" },
] as const;

/**
 * NAVIGATION
 * ──────────
 * Every entry is its own route. None of these may be an in-page anchor:
 * a nav item that scrolls the current page instead of navigating reads as a
 * broken link, because the thing it promised (another screen) never arrives.
 * In-page anchors belong to buttons inside a page, not to the nav.
 *
 * `primary` links sit in the top bar on desktop; all of them are in the
 * fullscreen menu. The bar stays short so it never competes with the type.
 */
export const nav = [
  { label: "Projects", href: "/projects", primary: true },
  { label: "Side projects", href: "/side-projects", primary: false },
  { label: "Personal projects", href: "/personal-projects", primary: false },
  { label: "Stack", href: "/stack", primary: false },
  { label: "About", href: "/about", primary: true },
  { label: "Journal", href: "/journal", primary: false },
  { label: "Contact", href: "/contact", primary: true },
] as const;

export const about = {
  headline: ["Computer science", "student by day.", "Shipping", "production", "software", "the rest of it."],
  accentLines: [2],
  bio: [
    "I'm a computer science student at Lead City University in Ibadan, and I spend most of my time building things that go into production.",
    "The work runs across three lanes that keep feeding each other: consumer fintech (wallets, gift card exchange, savings, payment rails); marketplaces with real verification and money in them; and machine learning, where I care most about the unglamorous part upstream of the model.",
    "I also run security and correctness audits on my own systems. On iléSure that meant reading all six repositories end to end and writing up every finding against a file and line reference, the fastest way I know to learn where a system actually breaks.",
  ],
  facts: [
    { k: "Based in", v: "Ibadan, Nigeria" },
    { k: "Studying", v: "BSc Computer Science, Lead City University" },
    { k: "Focus", v: "Fintech · Marketplaces · Applied ML" },
    { k: "Currently", v: "Full-Stack Developer at Gratebridge" },
    { k: "Also", v: "Google Developer Student Club: workshops on Python & data structures" },
  ],
  interests: ["Technology", "Fashion", "Music", "Gaming"],
} as const;

/**
 * METRICS
 * The first two are computed from the project data, so they cannot drift.
 * The rest are explicitly flagged as placeholders — fill them in yourself.
 */
export const metrics = [
  {
    value: projects.length,
    label: "Projects in this portfolio",
    suffix: "",
    computed: true,
  },
  {
    value: new Set(projects.flatMap((p) => p.stack)).size,
    label: "Technologies used",
    suffix: "",
    computed: true,
  },
  { value: projects.filter((p) => p.links?.some((l) => l.kind === "live" || l.kind === "store")).length,
    label: "Shipped and publicly live",
    suffix: "",
    computed: true,
  },
  { value: 4, label: "Years building", suffix: "+" },
] as const;

export const footerCta = {
  lines: ["Let's", "build", "something."],
  accentLine: 2,
} as const;
