import { Hero } from "@/components/sections/Hero";
import { Statement } from "@/components/sections/Statement";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { HorizontalGallery } from "@/components/sections/HorizontalGallery";
import { ProjectArchive } from "@/components/project/ProjectArchive";
import { TechnologyConstellation } from "@/components/sections/TechnologyConstellation";
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline";
import { About } from "@/components/sections/About";
import { Metrics } from "@/components/sections/Metrics";
import { FooterCTA } from "@/components/layout/FooterCTA";
import { ScrollProgress } from "@/components/layout/ScrollProgress";

/**
 * The page is a sequence of chapters, not a stack of blocks:
 * intro → identity → featured work → archive → index → systems → experience →
 * about → contact. Each section owns its own motion; this file owns the order.
 */
export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Hero />
      <Statement />
      <FeaturedWork />
      <HorizontalGallery />
      <ProjectArchive />
      <TechnologyConstellation />
      <ExperienceTimeline />
      <About />
      <Metrics />
      <FooterCTA />
    </>
  );
}
