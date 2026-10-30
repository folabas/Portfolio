/**
 * HERO BACKDROP
 * ─────────────
 * Fills the space behind the hero type with structure rather than movement.
 *
 * This is the deliberate opposite of the animated background that used to run
 * site-wide: nothing here tracks the pointer, nothing runs on a frame loop, and
 * nothing animates after the page settles. It is four painted layers and no
 * JavaScript, so it costs one composite and cannot compete with the headline.
 *
 * The layers, back to front:
 *
 *   1. bloom         — a soft accent wash behind the first word, so the type
 *                      has something to sit on instead of flat ink
 *   2. ring figure   — concentric hairlines in the right half, where the
 *                      headline's ragged edge leaves a genuine void. Texture
 *                      alone does not fill a hole that size; it needs a shape.
 *                      The geometry is the one the old WebGL object and its CSS
 *                      fallback both used, so this reads as the same site —
 *                      drawn once in SVG and never touched again.
 *   3. column rules  — hairlines on the same 1600px container the content uses,
 *                      which is why they look intentional rather than decorative
 *   4. dot field     — drafting-paper texture, masked away before it reaches
 *                      the standfirst
 *   5. grain         — static film noise; the one thing that stops large flat
 *                      areas of near-black reading as a dead region
 *
 * Every layer is masked so it has faded out by the time it reaches the copy.
 * The type is never laid over texture at full strength.
 */
export function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* 1 — accent bloom, anchored behind the opening word */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(46% 42% at 14% 24%, rgba(214,249,76,0.16) 0%, rgba(214,249,76,0.05) 44%, transparent 74%)",
        }}
      />

      {/* cool counter-light on the opposite corner, for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(38% 46% at 88% 4%, rgba(237,237,231,0.055) 0%, transparent 68%)",
        }}
      />

      {/*
        2 — ring figure.
        Sits in the right half, vertically centred on the headline. Hidden below
        md: on a phone the headline wraps to fill the width and there is no void
        left for it to occupy, so it would sit under the type instead of beside
        it.

        `vector-effect="non-scaling-stroke"` keeps every stroke at a true
        hairline however the viewBox is scaled — without it the circles thicken
        with the viewport and stop reading as drafting lines.
      */}
      <div className="absolute inset-y-0 right-[-6%] hidden w-[52%] items-center md:flex lg:right-[2%] lg:w-[44%]">
        <svg
          viewBox="0 0 400 400"
          className="h-auto w-full"
          fill="none"
          style={{
            maskImage: "radial-gradient(circle at 50% 50%, #000 42%, transparent 76%)",
            WebkitMaskImage: "radial-gradient(circle at 50% 50%, #000 42%, transparent 76%)",
          }}
        >
          <g stroke="rgba(237,237,231,0.16)" vectorEffect="non-scaling-stroke">
            <circle cx="200" cy="200" r="186" />
            <circle cx="200" cy="200" r="150" />
            <circle cx="200" cy="200" r="96" strokeDasharray="2 7" />
          </g>
          <circle
            cx="200"
            cy="200"
            r="168"
            stroke="rgba(214,249,76,0.30)"
            strokeDasharray="1 11"
            vectorEffect="non-scaling-stroke"
          />
          {/* Radial ticks, longer every third, like a dial. */}
          {Array.from({ length: 36 }).map((_, i) => (
            <line
              key={i}
              x1="200"
              y1="26"
              x2="200"
              y2={i % 3 === 0 ? 40 : 33}
              stroke={i % 9 === 0 ? "rgba(214,249,76,0.42)" : "rgba(237,237,231,0.17)"}
              vectorEffect="non-scaling-stroke"
              transform={`rotate(${i * 10} 200 200)`}
            />
          ))}
          {/* Soft core so the centre is not a hole. */}
          <circle cx="200" cy="200" r="78" fill="url(#hero-core)" />
          <defs>
            <radialGradient id="hero-core" cx="38%" cy="32%">
              <stop offset="0%" stopColor="rgba(237,237,231,0.085)" />
              <stop offset="100%" stopColor="rgba(237,237,231,0)" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/*
        3 — column rules.
        Same max-width and padding as the hero content, so the hairlines land on
        the layout's own columns. Hidden below md: at phone widths six columns
        in a 375px viewport is stripes, not structure.
      */}
      <div className="absolute inset-0 hidden px-10 md:block">
        <div
          className="mx-auto grid h-full max-w-[1600px] grid-cols-6"
          style={{
            maskImage: "linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.35) 52%, transparent 86%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.35) 52%, transparent 86%)",
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="block h-full border-l"
              style={{ borderColor: "rgba(237,237,231,0.085)" }}
            />
          ))}
        </div>
      </div>

      {/* 4 — dot field */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(237,237,231,0.19) 0.9px, transparent 0.9px)",
          backgroundSize: "26px 26px",
          maskImage: "radial-gradient(76% 62% at 28% 18%, #000 0%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(76% 62% at 28% 18%, #000 0%, transparent 72%)",
          opacity: 0.9,
        }}
      />

      {/*
        5 — grain.
        An inline SVG turbulence filter rather than a bitmap: no extra request,
        and it scales to any viewport. Static, unlike the old version which
        stepped through six offsets on a loop.
      */}
      <div
        className="absolute inset-0 opacity-[0.17] mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/*
        Bottom fade. The hero has no hard edge of its own, so without this the
        whole backdrop would stop in a straight line where the section ends.
      */}
      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{ background: "linear-gradient(to bottom, transparent, var(--color-ink))" }}
      />
    </div>
  );
}
