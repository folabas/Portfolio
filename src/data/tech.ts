import type { TechNode } from "./types";

/**
 * TECHNOLOGY CONSTELLATION
 * Positions are normalised 0–1 inside the field and hand-placed so clusters read
 * as regions rather than a grid. Everything listed here appears in the stack of
 * at least one project in `projects.ts`.
 */

export const clusters = [
  { id: "frontend", label: "Frontend", accent: "#d6f94c" },
  { id: "mobile", label: "Mobile", accent: "#6ee7b7" },
  { id: "backend", label: "Backend", accent: "#7dd3fc" },
  { id: "data", label: "Data", accent: "#fca5a5" },
  { id: "ai", label: "AI / ML", accent: "#c4b5fd" },
  { id: "infra", label: "Infrastructure", accent: "#fcd34d" },
] as const;

export const techNodes: TechNode[] = [
  /* Frontend — upper left */
  { name: "React", cluster: "frontend", detail: "Every web surface in this portfolio", x: 0.14, y: 0.18 },
  { name: "Next.js", cluster: "frontend", detail: "App Router across 9 projects", x: 0.27, y: 0.10 },
  { name: "TypeScript", cluster: "frontend", detail: "Default on anything with more than one contributor", x: 0.22, y: 0.29 },
  { name: "Tailwind CSS", cluster: "frontend", detail: "Design tokens over utility soup", x: 0.08, y: 0.34 },
  { name: "GSAP", cluster: "frontend", detail: "ScrollTrigger choreography, including this page", x: 0.35, y: 0.23 },
  { name: "Three.js", cluster: "frontend", detail: "R3F scenes where 3D earns its cost", x: 0.33, y: 0.37 },

  /* Mobile — upper right */
  { name: "React Native", cluster: "mobile", detail: "iléSure, Olyves, RAF", x: 0.72, y: 0.14 },
  { name: "Expo", cluster: "mobile", detail: "EAS build and release pipeline", x: 0.84, y: 0.22 },
  { name: "NativeWind", cluster: "mobile", detail: "Shared token layer with the web apps", x: 0.65, y: 0.27 },

  /* Backend — centre */
  { name: "Node.js", cluster: "backend", detail: "Service layer on most products", x: 0.48, y: 0.42 },
  { name: "Express", cluster: "backend", detail: "ReportUs, EasilyPromote, iléSure APIs", x: 0.58, y: 0.50 },
  { name: "FastAPI", cluster: "backend", detail: "CI Guardian and the outbreak prediction service", x: 0.40, y: 0.56 },
  { name: "Socket.io", cluster: "backend", detail: "Authoritative playback sync in ConnectUS", x: 0.62, y: 0.38 },
  { name: "REST / JWT", cluster: "backend", detail: "Auth and session across the fintech stack", x: 0.52, y: 0.62 },

  /* Data — lower left */
  { name: "MongoDB", cluster: "data", detail: "Primary store on the marketplace products", x: 0.20, y: 0.62 },
  { name: "PostgreSQL", cluster: "data", detail: "Relational schema via Prisma on EL.AY", x: 0.12, y: 0.74 },
  { name: "Prisma", cluster: "data", detail: "Typed access and migrations", x: 0.26, y: 0.80 },
  { name: "Sanity", cluster: "data", detail: "Headless CMS on Eleemosy and RAF", x: 0.33, y: 0.68 },

  /* AI / ML — lower right */
  { name: "Python", cluster: "ai", detail: "Everything upstream of a model", x: 0.70, y: 0.62 },
  { name: "PyTorch", cluster: "ai", detail: "ResNet50 and EfficientNet-B3 classifiers", x: 0.82, y: 0.70 },
  { name: "TensorFlow", cluster: "ai", detail: "Deep sequence models and CNNs", x: 0.62, y: 0.74 },
  { name: "scikit-learn", cluster: "ai", detail: "Regression baselines and evaluation", x: 0.74, y: 0.84 },
  { name: "pandas", cluster: "ai", detail: "Schema reconciliation and feature builds", x: 0.55, y: 0.85 },

  /* Infrastructure — right edge */
  { name: "Docker", cluster: "infra", detail: "Reproducible ML and service environments", x: 0.90, y: 0.46 },
  { name: "Vercel", cluster: "infra", detail: "Web deploys", x: 0.88, y: 0.34 },
  { name: "Cloudinary", cluster: "infra", detail: "Direct-to-CDN media pipelines", x: 0.93, y: 0.58 },
  { name: "Firebase", cluster: "infra", detail: "Auth and push on the mobile products", x: 0.80, y: 0.40 },
];

/** Edges are drawn between related nodes to imply a system, not a dependency graph. */
export const techEdges: [string, string][] = [
  ["React", "Next.js"],
  ["React", "TypeScript"],
  ["Next.js", "TypeScript"],
  ["Tailwind CSS", "React"],
  ["GSAP", "React"],
  ["Three.js", "GSAP"],
  ["React Native", "Expo"],
  ["React Native", "NativeWind"],
  ["React Native", "React"],
  ["Node.js", "Express"],
  ["Express", "MongoDB"],
  ["Node.js", "Socket.io"],
  ["Express", "REST / JWT"],
  ["FastAPI", "Python"],
  ["Python", "PyTorch"],
  ["Python", "TensorFlow"],
  ["Python", "pandas"],
  ["Python", "scikit-learn"],
  ["MongoDB", "Prisma"],
  ["PostgreSQL", "Prisma"],
  ["Sanity", "Next.js"],
  ["Docker", "FastAPI"],
  ["Vercel", "Next.js"],
  ["Cloudinary", "Express"],
  ["Firebase", "Expo"],
  ["Next.js", "Node.js"],
  ["Socket.io", "React"],
];
