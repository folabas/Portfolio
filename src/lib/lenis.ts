import type Lenis from "lenis";

/**
 * Module-level handle on the Lenis instance.
 *
 * Deliberately not on `window`: the Lenis package already declares a
 * `window.lenis` of a different shape, and augmenting it would either conflict
 * or silently widen. A module singleton is also easier to reason about — there
 * is exactly one instance, created by SmoothScroll.
 */
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};

export const getLenis = () => instance;

/** Used by overlays (menu, command palette) that must freeze the page. */
export const lockScroll = () => instance?.stop();
export const unlockScroll = () => instance?.start();
