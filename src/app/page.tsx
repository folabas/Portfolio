import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Statement } from "@/components/sections/Statement";
import { TechnologyConstellation } from "@/components/sections/TechnologyConstellation";
import { Metrics } from "@/components/sections/Metrics";
import { FooterCTA } from "@/components/layout/FooterCTA";
import { ScrollProgress } from "@/components/layout/ScrollProgress";

/**
 * HOME
 * ────
 * Five chapters: intro → projects → identity → stack → contact.
 *
 * The work comes second, directly under a hero that is deliberately shorter
 * than a viewport, because the point of the page is to show it. Everything that
 * used to sit between the two — a WebGL object, a metadata rail, a scroll hint —
 * is gone, and the longer project lists, the experience timeline, the
 * credentials and the about copy now live on their own routes.
 */
export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Hero />
      <Projects />
      <Statement />
      <TechnologyConstellation chapter />
      <Metrics />
      <FooterCTA chapter />
    </>
  );
}
