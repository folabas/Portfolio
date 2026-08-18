import type { ExperienceEntry } from "./types";

/**
 * EXPERIENCE TIMELINE
 * ───────────────────
 * These rows are DUMMY DATA, placed here so the timeline animation and layout
 * are complete and reviewable. Every row carries `placeholder: true`, which the
 * UI renders as a visible "PLACEHOLDER" badge — nothing on this page claims to
 * be a real role until you replace it.
 *
 * To go live: overwrite each entry with your real role, company and dates, then
 * delete the `placeholder` flag. The badge and the disclaimer disappear on their
 * own once no entry is flagged.
 */

export const experience: ExperienceEntry[] = [
  {
    year: "2023",
    role: "Role title",
    company: "Company / Team",
    description:
      "Placeholder row. Replace with what you actually did here — the system you owned, the problem it solved, and what changed because you shipped it.",
    technologies: ["React", "Node.js", "MongoDB"],
    placeholder: true,
  },
  {
    year: "2024",
    role: "Role title",
    company: "Company / Team",
    description:
      "Placeholder row. Two sentences is the right length: one for scope, one for outcome.",
    technologies: ["React Native", "Expo", "Express"],
    placeholder: true,
  },
  {
    year: "2025",
    role: "Role title",
    company: "Company / Team",
    description:
      "Placeholder row. If a role covered several products, name the one that mattered most rather than listing all of them.",
    technologies: ["Next.js", "TypeScript", "PostgreSQL"],
    placeholder: true,
  },
  {
    year: "2026",
    role: "Role title",
    company: "Company / Team",
    description:
      "Placeholder row. Most recent entry — this one gets read the closest, so make it the strongest.",
    technologies: ["Next.js", "Python", "FastAPI"],
    placeholder: true,
  },
];

export const hasRealExperience = experience.some((e) => !e.placeholder);
