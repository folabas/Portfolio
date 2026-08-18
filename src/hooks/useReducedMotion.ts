"use client";

import { useSyncExternalStore } from "react";

/**
 * prefers-reduced-motion, as an external store.
 *
 * useSyncExternalStore rather than useState + useEffect: the media query *is*
 * an external system, so subscribing to it directly avoids the extra render
 * pass on mount and stays correct if the user flips the OS setting mid-session.
 * The server snapshot is `false` — markup is authored as if motion is allowed,
 * and the client corrects on hydration without a mismatch.
 */

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
