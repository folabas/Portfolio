"use client";

import { useSyncExternalStore } from "react";

export type Tier = "desktop" | "tablet" | "mobile";

export interface Device {
  tier: Tier;
  touch: boolean;
  /** Desktop, fine pointer, enough cores for a WebGL scene. */
  canRun3D: boolean;
  ready: boolean;
}

/**
 * One source of truth for "how much experience can this device take".
 * Mobile is not a scaled-down desktop — it gets a different set of components,
 * decided here rather than with CSS that still pays the JS cost.
 *
 * Implemented as an external store so the snapshot is cached: useSyncExternalStore
 * compares by reference, so a fresh object on every read would loop forever.
 * The cache is only rebuilt when the measured values actually change.
 */

const SERVER: Device = { tier: "desktop", touch: false, canRun3D: false, ready: false };

let cache: Device = SERVER;

function measure(): Device {
  const w = window.innerWidth;
  const touch = window.matchMedia("(pointer: coarse)").matches;
  const tier: Tier = w < 768 ? "mobile" : w < 1180 ? "tablet" : "desktop";
  const cores = navigator.hardwareConcurrency ?? 4;

  // Reuse the previous object when nothing meaningful changed, so consumers do
  // not re-render on every resize pixel.
  if (cache.tier === tier && cache.touch === touch && cache.ready) return cache;

  cache = { tier, touch, canRun3D: tier === "desktop" && !touch && cores >= 4, ready: true };
  return cache;
}

function subscribe(onChange: () => void) {
  const on = () => {
    measure();
    onChange();
  };
  window.addEventListener("resize", on, { passive: true });
  const mq = window.matchMedia("(pointer: coarse)");
  mq.addEventListener("change", on);
  return () => {
    window.removeEventListener("resize", on);
    mq.removeEventListener("change", on);
  };
}

export function useDeviceTier(): Device {
  return useSyncExternalStore(subscribe, measure, () => SERVER);
}
