"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Single registration point. Importing gsap from here guarantees ScrollTrigger
 * is registered before any component uses it. registerPlugin is idempotent, so
 * repeated imports cost nothing.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/** House easing. Used everywhere so the motion reads as one system. */
export const EASE = "expo.out";
export const EASE_IO = "power4.inOut";
