export type Discipline =
  | "PRODUCT" | "MOBILE" | "WEB" | "FINTECH" | "AI / ML" | "BACKEND" | "TOOLS" | "STRATEGY";

export type Group =
  | "PRODUCT / STARTUPS"
  | "FINTECH / FINANCIAL SYSTEMS"
  | "BUSINESS / ENTERPRISE"
  | "AI / MACHINE LEARNING"
  | "OTHER PRODUCTS";

export interface ProjectLink {
  label: string;
  href: string;
  /**
   * "live"  renders a URL preview card
   * "repo"  renders a compact source link
   * "store" renders a store badge with the platform's mark — set `store` too.
   */
  kind?: "live" | "repo" | "store";
  /** Which store the badge draws. Only read when `kind` is "store". */
  store?: "appstore" | "play";
}

/** Set when a project was built for a competition rather than as product work. */
export interface Hackathon {
  name: string;
  year: string;
  /** Only set this when there is a real placing to report. */
  result?: string;
}

export interface Shot {
  /** Replace this path with a real screenshot and every surface updates. */
  src: string;
  alt: string;
  /**
   * Frame the image is composed into.
   *
   * `bare` means no frame at all — for images that already carry their own
   * device rendering (a supplied mockup composite). Wrapping one of those in a
   * phone or browser chrome puts a frame inside a frame.
   */
  device?: "browser" | "phone" | "laptop" | "tablet" | "flat" | "bare";
  /**
   * Intrinsic pixel size. Only needed when the image is not the standard
   * 1600×1000 (or 760×1520 for a phone) that the generated placeholders use —
   * a supplied screenshot with a different ratio will otherwise be stretched to
   * whatever ratio the defaults imply.
   */
  width?: number;
  height?: number;
  caption?: string;
}

export interface Project {
  slug: string;
  title: string;
  /** Short line under the title in listings. */
  tagline: string;
  group: Group;
  disciplines: Discipline[];
  /** Shown as the type line: "FINTECH / MOBILE / WEB" */
  typeLine: string;
  year: string;
  role: string;
  platform: string;
  /** 1–3 sentences. Factual only. */
  description: string;
  problem?: string;
  solution?: string;
  features?: string[];
  stack: string[];
  challenges?: string;
  outcome?: string;
  links?: ProjectLink[];
  hackathon?: Hackathon;
  hero: Shot;
  gallery: Shot[];
  featured: boolean;
  /** Per-project accent. The global system still dominates. */
  accent: string;
  /**
   * "verified"       — description derives from the repository or the live product.
   * "awaiting-assets" — structure is in place; copy is deliberately thin until
   *                     screenshots and product detail are supplied.
   */
  status: "verified" | "awaiting-assets";
  /** Rendered as a visible note on the case study when present. */
  note?: string;
}

export interface ExperienceEntry {
  year: string;
  role: string;
  company: string;
  description: string;
  technologies: string[];
  /** Dummy rows are badged in the UI so nothing reads as a real claim. */
  placeholder?: boolean;
}

export interface TechNode {
  name: string;
  cluster: string;
  detail: string;
  /** Normalised 0–1 coordinates inside the constellation field. */
  x: number;
  y: number;
}
