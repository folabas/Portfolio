import type { Metadata } from "next";

import { ContactScreen } from "@/components/sections/ContactScreen";

export const metadata: Metadata = {
  title: "Contact",
  description: "Email, phone and profiles, plus the CV. Open to full-time and contract work.",
};

/**
 * CONTACT
 * ───────
 * No FooterCTA here: ContactScreen already is the contact block at page scale,
 * and stacking the footer under it would repeat the same four details twice on
 * one screen.
 */
export default function ContactPage() {
  return <ContactScreen />;
}
