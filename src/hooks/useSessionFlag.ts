"use client";

import { useSyncExternalStore } from "react";

/**
 * Reads a one-shot sessionStorage flag as an external store.
 *
 * Used by the loader to decide whether the intro has already played. Going
 * through useSyncExternalStore (rather than setState inside an effect) means
 * the server renders the "not yet seen" branch and the client corrects during
 * hydration, with no cascading render and no mismatch warning.
 */
export function useSessionFlag(key: string): boolean {
  return useSyncExternalStore(
    () => () => {},                                    // never changes within a render pass
    () => sessionStorage.getItem(key) !== null,        // client
    () => false                                        // server: assume unseen
  );
}

export const markSessionFlag = (key: string) => sessionStorage.setItem(key, "1");
