"use client";

import { useEffect, useState } from "react";

/**
 * A ticking clock for the relationship counter.
 * Returns null until mounted (avoids SSR/CSR hydration mismatch), then
 * updates once per second. Uses the visitor's LOCAL time consistently —
 * see README ("Timezone handling").
 */
export function useNow(intervalMs = 1000): Date | null {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
