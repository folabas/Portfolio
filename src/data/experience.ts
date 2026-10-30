import type { ExperienceEntry } from "./types";

/**
 * EXPERIENCE TIMELINE
 * ───────────────────
 * Real roles, taken from the CV and confirmed against the project work.
 *
 * Two dates differ between the CV and the brief I was given — both are noted
 * inline. Correct whichever is right and delete the comment.
 */

export const experience: ExperienceEntry[] = [
  {
    year: "2022–2023",
    role: "Frontend Developer",
    company: "Cactus AI",
    description:
      "Built the frontend for a healthcare service-provider platform: multi-step provider onboarding with validation and persistence, on a typed Next.js codebase.",
    technologies: ["Next.js", "React", "TypeScript", "MongoDB", "Tailwind CSS"],
  },
  {
    year: "Dec 2024–Aug 2025",
    role: "Mobile Developer (contract)",
    company: "Olyves Technologies Ltd",
    // CV lists this as "Dec 2024 – Present"; the brief says the contract ended
    // Aug 2025. Using the brief.
    description:
      "Built a cross-platform marketplace connecting artisans with clients, and shipped the trust layer around it: real-time chat, proposal submission, and ratings and reviews.",
    technologies: ["React Native", "Expo Router", "React Query", "TypeScript", "Firebase"],
  },
  {
    year: "Sept 2025–Present",
    role: "Co-founder",
    company: "iléSure",
    description:
      "Student housing and roommate matching for Nigerian universities. Property listings, real-time chat over Socket.io, contract e-signing with pdf-lib, Cloudinary document storage, and a tiered subscription for agents and companies.",
    technologies: ["React Native", "Expo", "TypeScript", "Node.js", "Express", "MongoDB", "Socket.io"],
  },
  {
    year: "Oct 2025–Present",
    role: "Full-Stack Developer",
    company: "Gratebridge",
    // CV says October 2025; the brief said September. Using the CV.
    description:
      "Shipping across fintech products handling cross-border payments and multi-currency transactions for users in several African countries, including crypto deposits that convert straight into local currency. Built a self-service transaction reporting system that routes issues like undelivered payments to management for investigation and bank escalation. Daily support tickets fell from 6–7 to 1–2.",
    technologies: ["Next.js", "TypeScript", "Node.js", "React", "Tailwind CSS"],
  },
];

export const hasRealExperience = experience.some((e) => !e.placeholder);
