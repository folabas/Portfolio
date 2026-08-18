/**
 * EDUCATION & CERTIFICATIONS
 * Verified items only — each credential carries the public verification URL it
 * was issued with, so the claim is checkable rather than asserted.
 */

export interface Credential {
  title: string;
  issuer: string;
  /** Public verification URL — rendered as a link preview. */
  href?: string;
  detail?: string;
  year?: string;
  kind: "degree" | "certificate" | "badge";
}

export const education: Credential[] = [
  {
    kind: "degree",
    title: "BSc Computer Science",
    issuer: "Lead City University, Oyo State, Nigeria",
    year: "Sept 2023 — Present",
    detail:
      "Artificial Intelligence · Database Management · Object-Oriented Programming · Web Computing · Computer Architecture · Digital Logic Systems",
  },
  {
    kind: "certificate",
    title: "Introducing Generative AI with AWS",
    issuer: "Udacity",
    href: "http://www.udacity.com/certificate/e/f2190af0-4fcb-11f0-ad8d-af2a3f367ad0",
    detail: "Nanodegree programme certificate",
  },
  {
    kind: "badge",
    title: "Machine Learning Foundations",
    issuer: "AWS (AWS Labs)",
    href: "https://www.credly.com/badges/1c65e3a2-3bdb-458d-b87f-f6b6d46a4fae/public_url",
    detail: "Verified badge issued through Credly",
  },
];

/**
 * HACKATHONS
 * Derived from the project data — see `hackathon` on each Project — plus the
 * placing recorded in the CV.
 */
export const hackathons = [
  {
    name: "Build With Oyo",
    year: "March 2026",
    result: "3rd overall",
    project: "ReportAm",
    slug: "reportam",
    blurb:
      "A civic-tech platform letting Oyo State residents report real-time incidents and infrastructure issues — potholes, bad roads, waste — directly to government.",
  },
  {
    name: "GitLab AI Hackathon",
    year: "2025 — 2026",
    project: "CI Guardian",
    slug: "ci-guardian",
    blurb:
      "A GitLab Duo agent that risk-scores a .gitlab-ci.yml before it merges and diagnoses pipeline failures from job logs, exposed as Model Context Protocol tools.",
  },
  {
    name: "Devpost Hackathon",
    year: "2025 — 2026",
    project: "Disease Outbreak Prediction",
    slug: "disease-outbreak-prediction",
    blurb:
      "A machine-learning pipeline over Nigerian NCDC surveillance data, joining outbreak records against climate, population and hospital features.",
  },
] as const;
