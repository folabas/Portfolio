import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { About } from "@/components/sections/About";
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline";
import { Credentials } from "@/components/sections/Credentials";
import { FooterCTA } from "@/components/layout/FooterCTA";

export const metadata: Metadata = {
  title: "About",
  description:
    "Who I am, where I have worked, and what I have studied, with the CV and every credential linked.",
};

/**
 * ABOUT
 * ─────
 * Everything that is about the person rather than the work, on one route:
 * the bio, the roles, and the credentials. All three used to be separate
 * chapters on the home page, which pushed the projects a long way down it.
 *
 * The order is deliberate — who, then where, then what was certified — so the
 * page reads as a single answer instead of three stacked sections.
 */
export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Computer science"
        accent="student by day."
        standfirst="Shipping production software the rest of it, across consumer fintech, marketplaces with real money in them, and the unglamorous data work upstream of a model."
      />

      <About />
      <ExperienceTimeline />
      <Credentials />
      <FooterCTA />
    </>
  );
}
