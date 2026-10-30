import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { TechnologyConstellation } from "@/components/sections/TechnologyConstellation";
import { FooterCTA } from "@/components/layout/FooterCTA";
import { techNodes } from "@/data/tech";

export const metadata: Metadata = {
  title: "Stack",
  description:
    "The tools behind the work, and which of them sit next to each other in these projects.",
};

/**
 * STACK
 * ─────
 * The constellation on its own route, because "Stack" is a nav item and a nav
 * item has to land on a screen. The home page keeps its copy of the section as
 * part of the scroll; this is where the link goes.
 */
export default function StackPage() {
  return (
    <>
      <PageHeader
        eyebrow="Stack"
        title="The tools,"
        accent="and how they connect."
        meta={`${techNodes.length} technologies`}
        standfirst="Every node here appears in the stack of at least one project on this site. Nothing is listed because it looks good on a CV. Select one to see what it sits next to."
      />

      <TechnologyConstellation />
      <FooterCTA />
    </>
  );
}
