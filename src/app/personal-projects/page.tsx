import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectGrid } from "@/components/project/ProjectGrid";
import { FooterCTA } from "@/components/layout/FooterCTA";
import { personalProjects } from "@/data/projects";
import { hackathons } from "@/data/education";

export const metadata: Metadata = {
  title: "Personal projects",
  description:
    "Projects built solo and against a clock, including three hackathon builds.",
};

/**
 * PERSONAL PROJECTS
 * ─────────────────
 * The hackathon work, which used to be a column inside the credentials section
 * where it read as a qualification rather than as projects. It is project work,
 * so it is listed as project work — and the competition itself becomes the
 * footnote underneath rather than the frame around it.
 */
export default function PersonalProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Personal projects"
        title="Built solo,"
        accent="against a clock."
        meta={`${personalProjects.length} projects`}
        standfirst="Nobody briefed these. Each one came out of a question I wanted answered or a competition weekend, and the constraint was the clock, with the thing still having to work at the end of it."
      />

      <section className="px-5 md:px-10" aria-label="Personal projects">
        <div className="mx-auto max-w-[1600px]">
          <ProjectGrid items={personalProjects} emphasis="lead" priorityCount={2} />
        </div>
      </section>

      {/* ── where they were built ──────────────────────────────── */}
      <section className="px-5 py-[12vh] md:px-10" aria-label="Hackathons">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-line" />
            <span className="label">Hackathons</span>
          </div>

          <h2 className="display mt-6 max-w-[18ch] text-[clamp(1.7rem,4.4vw,3.2rem)] text-paper">
            Shipped under <span className="text-accent">pressure.</span>
          </h2>

          <ol className="mt-12 divide-y divide-line border-y border-line">
            {hackathons.map((h, i) => (
              <li key={h.name}>
                <Link
                  href={`/work/${h.slug}`}
                  data-cursor="VIEW PROJECT"
                  className="group grid grid-cols-[2.5rem_1fr] gap-4 py-6"
                >
                  <span className="font-mono text-[10.5px] tracking-[0.16em] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span>
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <span className="font-display text-[clamp(1.05rem,2vw,1.45rem)] uppercase tracking-[-0.02em] text-paper transition-transform duration-500 group-hover:translate-x-1">
                        {h.name}
                      </span>
                      {"result" in h && h.result && (
                        <span className="rounded-full bg-accent px-2.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink">
                          {h.result}
                        </span>
                      )}
                      <span className="label">{h.year}</span>
                    </span>

                    <span className="mt-2 block text-[13px] text-muted">
                      Built <span className="text-paper/85">{h.project}</span>
                    </span>
                    <span className="mt-2 block max-w-[54ch] text-[13.5px] leading-relaxed text-paper/70">
                      {h.blurb}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <FooterCTA />
    </>
  );
}
