"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SceneHeader } from "@/components/layout/SceneHeader";
import { relationship } from "@/content/relationship";
import { cn } from "@/lib/utils";

/**
 * SCENE 03 — "Where I Went Wrong": the apology, exactly as written.
 * No excuses, no accusatory language — each paragraph arrives quietly
 * as she scrolls, and everything is always readable without animation.
 */
export function ApologyScene() {
  const reduced = useReducedMotion();
  const { heading, paragraphs } = relationship.apology;

  return (
    <section aria-labelledby="apology-heading" className="mx-auto max-w-2xl pb-6">
      <SceneHeader eyebrow="Scene 03 — Where I Went Wrong" title={heading} />
      <h2 id="apology-heading" className="sr-only">
        {heading}
      </h2>

      <div className="space-y-7">
        {paragraphs.map((paragraph, i) => {
          // The two lines that carry the weight get the quiet emphasis they deserve.
          const isAnchor =
            paragraph.startsWith("You deserved to feel heard") ||
            paragraph.startsWith("And I wish I had understood");

          return (
            <motion.p
              key={i}
              initial={reduced ? false : { opacity: 0, y: 22 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "leading-relaxed text-ivory/75",
                isAnchor
                  ? "border-l-2 border-rose/40 pl-5 font-serif text-xl italic text-champagne/90 sm:text-2xl"
                  : "text-base font-light sm:text-lg"
              )}
            >
              {paragraph}
            </motion.p>
          );
        })}
      </div>
    </section>
  );
}
