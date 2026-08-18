import type { Metadata } from "next";
import { JournalIndex } from "@/components/journal/JournalIndex";
import { FooterCTA } from "@/components/layout/FooterCTA";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Notes on fintech regulation, payment infrastructure and the engineering underneath — written from the position of someone shipping into it.",
};

export default function JournalPage() {
  return (
    <>
      <JournalIndex />
      <FooterCTA />
    </>
  );
}
