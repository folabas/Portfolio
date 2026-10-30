import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectGrid } from "@/components/project/ProjectGrid";
import { FooterCTA } from "@/components/layout/FooterCTA";
import { mainProjects, personalProjects, projects, sideProjects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Every project in one place: selected client work, personal builds and side projects.",
};

/**
 * PROJECTS
 * ────────
 * The whole catalogue on one screen, grouped the way the data files it.
 *
 * This is deliberately a wider view than the home page's projects section,
 * which shows the five headline builds only. A nav item called "Projects" that
 * landed on something the visitor had already scrolled past would be the same
 * failure as pointing it at an in-page anchor: it has to arrive somewhere new.
 * Each group header links on to its own screen where one exists.
 */
export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Everything"
        accent="I have built."
        meta={`${projects.length} projects`}
        standfirst="Client work, company work, hackathon builds and the things I made to answer a question. Grouped by how they came about, not by how they look."
      />

      <Group
        label="Selected work"
        count={mainProjects.length}
        blurb="Builds where I owned the product surface end to end: the payment rail, the verification, the model, and the pixels on top."
      >
        <ProjectGrid items={mainProjects} emphasis="lead" priorityCount={2} />
      </Group>

      <Group
        label="Personal projects"
        count={personalProjects.length}
        blurb="Built solo and against a clock. Three of them came out of hackathons."
        href="/personal-projects"
      >
        <ProjectGrid items={personalProjects} />
      </Group>

      <Group
        label="Side projects"
        count={sideProjects.length}
        blurb="Smaller builds, internal tools and experiments. Not headline work, but every one of them shipped."
        href="/side-projects"
      >
        <ProjectGrid items={sideProjects} />
      </Group>

      <FooterCTA />
    </>
  );
}

function Group({
  label,
  count,
  blurb,
  href,
  children,
}: {
  label: string;
  count: number;
  blurb: string;
  /** The group's own screen, when it has one. */
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-5 pt-[10vh] md:px-10" aria-label={label}>
      <div className="mx-auto max-w-[1600px]">
        <div className="flex items-center gap-4">
          <span className="h-px w-10 bg-line" />
          <span className="label">{label}</span>
          <span className="font-mono text-[10.5px] text-accent">
            {String(count).padStart(2, "0")}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6">
          <p className="body-lg max-w-[52ch]">{blurb}</p>

          {href && (
            <Link
              href={href}
              data-cursor="BROWSE"
              className="group inline-flex items-center gap-2 border-b border-line pb-1 font-mono text-[10.5px] uppercase tracking-[0.16em] text-paper/80 transition-colors hover:border-accent hover:text-paper"
            >
              All {label.toLowerCase()}
              <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </Link>
          )}
        </div>

        {children}
      </div>
    </section>
  );
}
