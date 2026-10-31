"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * A brief, elegant loading veil — the hush before the experience begins.
 * Shown once per browser session; skipped entirely for reduced-motion users.
 */
export function LoadingVeil() {
  const [done, setDone] = useState<boolean | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setDone(true);
      return;
    }
    let shown = false;
    try {
      shown = window.sessionStorage.getItem("iycHMh-veil") === "1";
    } catch {
      /* private mode — just show it once */
    }
    if (shown) {
      setDone(true);
      return;
    }
    try {
      window.sessionStorage.setItem("iycHMh-veil", "1");
    } catch {
      /* ignore */
    }
    const t = setTimeout(() => setDone(true), 1700);
    return () => clearTimeout(t);
  }, [reducedMotion]);

  return (
    <AnimatePresence>
      {done === false && (
        <motion.div
          key="veil"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="fixed inset-0 z-50 grid place-items-center bg-midnight"
          aria-hidden
        >
          <div className="text-center">
            <p className="font-hand text-2xl text-rose/80 sm:text-3xl">for you…</p>
            <p className="mt-3 text-[11px] uppercase tracking-[0.4em] text-champagne/60">
              If You Could Hear My Heart
            </p>
            <div className="mx-auto mt-6 h-px w-24 overflow-hidden rounded-full bg-rose/15">
              <motion.div
                className="h-full w-1/2 bg-champagne/70"
                initial={{ x: "-100%" }}
                animate={{ x: "220%" }}
                transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
