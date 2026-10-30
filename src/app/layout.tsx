import type { Metadata, Viewport } from "next";
import { Archivo, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { CustomCursor } from "@/components/motion/CustomCursor";
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
    default: `${site.name} · Software Engineer`,
    template: `%s · ${site.name}`,
  },
  description:
    "Software engineer building across fintech, marketplaces, mobile and machine learning. Selected work, case studies and contact.",
  openGraph: {
    title: `${site.name} · Software Engineer`,
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
    <html
      lang="en"
      className={`${archivo.variable} ${inter.variable} ${mono.variable}`}
      // The script below stamps a class on <html> before React hydrates.
      suppressHydrationWarning
    >
      <body className="antialiased">
        {/*
          PRE-PAINT GUARD — must stay the first node in <body>.

          The intro curtain is server-rendered so a first visit never flashes raw
          page content. But only the client knows whether the intro already
          played this session, and deciding that in React means the curtain
          paints and is then torn down on hydration — a visible flash of "000"
          on every repeat visit.

          This is a synchronous, blocking script sitting ahead of the curtain in
          document order, so the class lands before the browser paints anything
          and the rule in globals.css suppresses the curtain outright.

          Raw <script>, not next/script: `beforeInteractive` renders as a direct
          child of <html>, which is invalid HTML and throws a hydration error.
          React only executes this during SSR, which is exactly the scope wanted
          — it must run on document load and never again.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('intro-seen'))document.documentElement.classList.add('intro-seen')}catch(e){}",
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[10000] focus:rounded-full focus:bg-accent focus:px-5 focus:py-2 focus:text-[13px] focus:font-medium focus:text-ink"
        >
          Skip to content
        </a>

        {/*
          There is no animated background component any more. It was four fixed
          layers — a pointer-tracked radial light, a drifting grid, coordinate
          marks and shifting grain — all running off a rAF loop behind the type.
          It pulled the eye away from the one sentence the hero has to land.

          What replaced it is a single static gradient and vignette painted by
          `body::before` in globals.css: no JavaScript, no pointer tracking, no
          frame loop, and nothing on the page that moves on its own.
        */}
        <Loader />
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
