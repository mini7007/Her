"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SceneHeader } from "@/components/layout/SceneHeader";
import { relationship } from "@/content/relationship";
import { cn, seededRandom } from "@/lib/utils";

/**
 * SCENE 04 — "Your Absence": a quiet night, a rainy window, distant lights.
 * The rain is pure CSS and deliberately gentle; text always stays readable.
 */

const bokehRand = seededRandom(42);

const BOKEH = [
  { left: "12%", top: "30%", size: 90, color: "rgba(232,214,181,0.16)" },
  { left: "78%", top: "22%", size: 60, color: "rgba(220,167,181,0.14)" },
  { left: "68%", top: "58%", size: 110, color: "rgba(101,27,53,0.5)" },
  { left: "22%", top: "66%", size: 46, color: "rgba(232,214,181,0.1)" },
  { left: "45%", top: "18%", size: 34, color: "rgba(255,245,237,0.08)" },
  { left: "88%", top: "70%", size: 70, color: "rgba(101,27,53,0.4)" },
  { left: "6%", top: "80%", size: 56, color: "rgba(220,167,181,0.1)" },
].map((dot, i) => ({ ...dot, id: i, blur: 14 + bokehRand() * 18 }));

export function AbsenceScene() {
  const reduced = useReducedMotion();
  const { heading, paragraphs } = relationship.absence;

  return (
    <section aria-labelledby="absence-heading" className="mx-auto max-w-2xl pb-6">
      <SceneHeader eyebrow="Scene 04 — Your Absence" title={heading} />
      <h2 id="absence-heading" className="sr-only">
        {heading}
      </h2>

      {/* The rainy window */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 26 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl border border-rose/15 bg-gradient-to-b from-burgundy/70 via-[#1a0a14]/90 to-midnight/95 px-6 py-12 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)] sm:px-12 sm:py-16"
      >
        {/* Distant lights through the glass */}
        <div aria-hidden className="absolute inset-0">
          {BOKEH.map((dot) => (
            <span
              key={dot.id}
              className="absolute rounded-full"
              style={{
                left: dot.left,
                top: dot.top,
                width: dot.size,
                height: dot.size,
                background: dot.color,
                filter: `blur(${dot.blur}px)`,
              }}
            />
          ))}
        </div>

        {/* The rain itself */}
        {!reduced && (
          <div aria-hidden className="rain-window absolute inset-0 opacity-70" />
        )}

        {/* A soft reflection streak */}
        <div
          aria-hidden
          className="absolute -left-20 top-0 h-full w-40 rotate-12 bg-gradient-to-b from-rose/5 via-transparent to-rose/5"
        />

        {/* The words */}
        <div className="relative space-y-6">
          {paragraphs.map((paragraph, i) => {
            const isTurn =
              paragraph === "And then there is silence." || paragraph === "I miss us.";
            return (
              <motion.p
                key={i}
                initial={reduced ? false : { opacity: 0, y: 18 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-12% 0px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "leading-relaxed",
                  isTurn
                    ? "pt-2 font-serif text-2xl italic text-champagne text-glow sm:text-3xl"
                    : "text-base font-light text-ivory/75 sm:text-lg"
                )}
              >
                {paragraph}
              </motion.p>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
