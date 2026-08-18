import type { Metadata, Viewport } from "next";
import { Archivo, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { AnimatedBackground } from "@/components/bg/AnimatedBackground";
import { Navbar } from "@/components/layout/Navbar";
import { Loader } from "@/components/layout/Loader";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { site } from "@/data/site";

/* Display face carries the art direction; Inter reads; mono does metadata. */
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  weight: ["600", "700", "800"],
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-jb",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://basitolajide.dev"),
  title: {
    default: `${site.name} — Software Engineer`,
    template: `%s — ${site.name}`,
  },
  description:
    "Software engineer building across fintech, marketplaces, mobile and machine learning. Selected work, case studies and contact.",
  openGraph: {
    title: `${site.name} — Software Engineer`,
    description:
      "Software engineer building across fintech, marketplaces, mobile and machine learning.",
    type: "website",
    locale: "en_NG",
  },
  robots: { index: true, follow: true },
  // Icons share their geometry with the on-page mark in
  // src/components/brand/Logo.tsx. Regenerate with `node scripts/gen-icons.mjs`.
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.svg" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#08080a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable} ${mono.variable}`}>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[10000] focus:rounded-full focus:bg-accent focus:px-5 focus:py-2 focus:text-[13px] focus:font-medium focus:text-ink"
        >
          Skip to content
        </a>

        <Loader />
        <AnimatedBackground />
        <CustomCursor />
        <CommandPalette />

        <SmoothScroll>
          <Navbar />
          <main id="main" className="relative z-10">
            {children}
          </main>
        </SmoothScroll>
      </body>
    </html>
  );
}
