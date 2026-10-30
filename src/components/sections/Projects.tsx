"use client";

import Link from "next/link";
import { ChapterLabel } from "@/components/layout/ScrollProgress";
import { ProjectGrid } from "@/components/project/ProjectGrid";
import { mainProjects, personalProjects, sideProjects } from "@/data/projects";

/**
 * PROJECTS — the home page's one work section
 * ───────────────────────────────────────────
 * This is the merge of three sections that used to sit one after another:
 * "Selected work" (a sticky cross-dissolve stage), "Everything else worth
 * showing" (a horizontal rail) and the full index table. Three ways of saying
 * "here are the projects" read as three separate demands on the visitor.
 *
 * What is left is the headline work, in one grid, directly under the hero. The
 * longer lists did not disappear — they moved to /side-projects and
 * /personal-projects, and this section hands off to both at the end.
 */
export function Projects() {
  return (
    <section id="projects" className="relative px-5 pt-[8vh] md:px-10" aria-label="Projects">
      <div className="mx-auto max-w-[1600px]">
        <ChapterLabel index={2} label="Projects" id="projects" />

        <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
          <h2 className="display max-w-[14ch] text-[clamp(2rem,5.6vw,4.6rem)] text-paper">
            The <span className="text-accent">work.</span>
          </h2>
          <p className="body-lg max-w-[40ch]">
            Builds where I owned the product surface end to end: the payment rail, the
            verification, the model, and the pixels on top.
          </p>
        </div>

        <ProjectGrid items={mainProjects} emphasis="lead" priorityCount={2} />

        {/* Hand-off to the two longer lists. */}
        <div className="mt-20 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
          <MoreCard
            href="/side-projects"
            label="Side projects"
            count={sideProjects.length}
            blurb="Smaller builds, internal tools and experiments. The full index, filterable."
          />
          <MoreCard
            href="/personal-projects"
            label="Personal projects"
            count={personalProjects.length}
            blurb="Built solo and against a clock. Three of them came out of hackathons."
          />
        </div>
      </div>
    </section>
  );
}

function MoreCard({
  href,
  label,
  count,
  blurb,
}: {
  href: string;
  label: string;
  count: number;
  blurb: string;
}) {
  return (
    <Link
      href={href}
      data-cursor="BROWSE"
      className="group bg-ink px-6 py-8 transition-colors duration-500 hover:bg-ink-2 md:px-8 md:py-10"
    >
      <div className="flex items-baseline justify-between gap-4">
        <span className="label">{label}</span>
        <span className="font-mono text-[10.5px] text-accent">
          {String(count).padStart(2, "0")}
        </span>
      </div>
      <p className="display mt-4 flex items-center gap-3 text-[clamp(1.4rem,3vw,2.2rem)] text-paper">
        {label}
        <span className="text-muted transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-accent">
          →
        </span>
      </p>
      <p className="mt-3 max-w-[40ch] text-[13.5px] leading-relaxed text-muted">{blurb}</p>
    </Link>
  );
}
