import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectGrid } from "@/components/project/ProjectGrid";
import { ProjectArchive } from "@/components/project/ProjectArchive";
import { FooterCTA } from "@/components/layout/FooterCTA";
import { sideProjects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Side projects",
  description:
    "Smaller builds, internal tools and experiments. The full filterable index.",
};

/**
 * SIDE PROJECTS
 * ─────────────
 * What used to be the horizontal rail and the "full index" table on the home
 * page, moved off it. The grid is the browsable view; the table underneath is
 * the same set as a scannable index with discipline filters.
 */
export default function SideProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Side projects"
        title="Everything else"
        accent="worth showing."
        meta={`${sideProjects.length} projects`}
        standfirst="Smaller builds, internal tools and the things I made to answer a question. Not headline work, but every one of them shipped, and a few of them are still running."
      />

      <section className="px-5 md:px-10" aria-label="Side projects">
        <div className="mx-auto max-w-[1600px]">
          <ProjectGrid items={sideProjects} priorityCount={3} />
        </div>
      </section>

      <ProjectArchive items={sideProjects} title="Side projects" />
      <FooterCTA />
    </>
  );
}
