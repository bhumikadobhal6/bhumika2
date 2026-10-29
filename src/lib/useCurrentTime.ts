'use client';

import { useSyncExternalStore } from 'react';

// Keep a single cached timestamp so `getSnapshot` stays stable between
// renders. Returning `Date.now()` directly would produce a new value on every
// call and can trigger React's "getSnapshot should be cached" loop.
let currentTime = 0;
let intervalId: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  currentTime = Date.now();
  listeners.add(callback);

  // Update every 30 seconds to keep countdowns accurate.
  if (intervalId === null) {
    intervalId = setInterval(() => {
      currentTime = Date.now();
      listeners.forEach((listener) => listener());
    }, 30_000);
  }

  return () => {
    listeners.delete(callback);
    if (listeners.size === 0 && intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
}

function getSnapshot() {
  return currentTime;
}

function getServerSnapshot() {
  return 0;
}

/**
 * Hook to retrieve the current wall-clock timestamp on the client,
 * using React 19's useSyncExternalStore for hydration and render purity.
 * Returns 0 during server rendering so countdown labels stay hydration-safe.
 */
export function useCurrentTime(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
