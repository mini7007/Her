"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SceneHeader } from "@/components/layout/SceneHeader";
import { relationship } from "@/content/relationship";

/**
 * SCENE 06 — "What I Want to Change": six commitment cards and the honest
 * closing. Words about actions, styled with restraint.
 */
export function CommitmentsScene() {
  const reduced = useReducedMotion();
  const { heading, items, closing } = relationship.commitments;

  return (
    <section aria-labelledby="commitments-heading" className="mx-auto max-w-4xl pb-6">
      <SceneHeader eyebrow="Scene 06 — What I Want to Change" title={heading} />
      <h2 id="commitments-heading" className="sr-only">
        {heading}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <motion.article
            key={item.number}
            initial={reduced ? false : { opacity: 0, y: 26 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.65, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="group rounded-2xl border border-rose/15 bg-burgundy/45 p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)] transition-colors duration-500 hover:border-rose/35"
          >
            <p className="font-serif text-sm tracking-[0.3em] text-champagne/70 transition-colors duration-500 group-hover:text-champagne">
              {item.number}
            </p>
            <h3 className="mt-4 font-serif text-xl leading-snug text-ivory">{item.title}</h3>
            <p className="mt-3 text-sm font-light leading-relaxed text-ivory/65">
              {item.description}
            </p>
          </motion.article>
        ))}
      </div>

      <div className="mx-auto mt-14 max-w-xl text-center">
        {closing.map((line, i) => (
          <motion.p
            key={i}
            initial={reduced ? false : { opacity: 0, y: 18 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8, delay: i * 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={
              i === closing.length - 1
                ? "mt-3 font-hand text-2xl text-rose/90 sm:text-3xl"
                : "text-base font-light leading-relaxed text-ivory/70 sm:text-lg"
            }
          >
            {line}
          </motion.p>
        ))}
      </div>
    </section>
  );
}
