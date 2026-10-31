"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Heart, ChevronRight } from "lucide-react";
import { relationship } from "@/content/relationship";

/**
 * SCENE 01 — "Hey, Bacha..."
 * Full-screen cinematic opening: floating petals, one subtle animated heart,
 * the invitation. Music is NEVER started here automatically — the visitor
 * chooses it with the music control, and playback then follows her everywhere.
 */
export function OpeningScene({ goTo, next }: { goTo: (i: number) => void; next: () => void }) {
  const reduced = useReducedMotion();
  const { heading, lines, ctaLabel, skipLabel } = relationship.opening;

  return (
    <section className="relative flex min-h-[82vh] flex-col items-center justify-center text-center" aria-labelledby="opening-heading">
      {/* The subtle heart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10"
        aria-hidden
      >
        <motion.div
          animate={reduced ? undefined : { scale: [1, 1.07, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          className="grid h-20 w-20 place-items-center rounded-full border border-rose/20 bg-burgundy/50 shadow-[0_0_60px_rgba(101,27,53,0.55)]"
        >
          <Heart className="h-8 w-8 text-rose" fill="rgba(220,167,181,0.55)" strokeWidth={1} />
        </motion.div>
      </motion.div>

      <motion.h1
        id="opening-heading"
        initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="font-serif text-5xl font-light text-ivory text-glow sm:text-6xl md:text-7xl"
      >
        {heading}
      </motion.h1>

      <div className="mt-8 max-w-xl space-y-4 px-2">
        {lines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.9 + i * 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="text-base font-light leading-relaxed text-ivory/75 sm:text-lg"
          >
            {line}
          </motion.p>
        ))}
      </div>

      <motion.button
        type="button"
        onClick={next}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 2, ease: [0.22, 1, 0.36, 1] }}
        whileHover={reduced ? undefined : { scale: 1.035 }}
        whileTap={{ scale: 0.97 }}
        className="mt-12 inline-flex items-center gap-2.5 rounded-full border border-champagne/40 bg-gradient-to-r from-wine via-burgundy to-wine px-8 py-4 text-sm uppercase tracking-[0.2em] text-ivory shadow-[0_20px_60px_-20px_rgba(101,27,53,0.9)] transition-shadow duration-500 hover:shadow-[0_25px_70px_-15px_rgba(220,167,181,0.35)] sm:text-base"
      >
        {ctaLabel}
        <ChevronRight className="h-4 w-4" aria-hidden />
      </motion.button>

      <motion.button
        type="button"
        onClick={() => goTo(4)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.8 }}
        className="mt-6 text-xs font-light tracking-wide text-ivory/35 underline decoration-ivory/20 underline-offset-4 transition-colors hover:text-rose/70"
      >
        {skipLabel}
      </motion.button>
    </section>
  );
}
