"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, Heart, MailOpen } from "lucide-react";
import { SceneHeader } from "@/components/layout/SceneHeader";
import { relationship } from "@/content/relationship";
import { cn } from "@/lib/utils";
import type { LetterPart } from "@/types";

/**
 * SCENE 05 — The Central Love Letter.
 *
 * The envelope opens on its own, the letter rises from it, and the complete,
 * unabridged letter is then ALWAYS fully available: paragraphs appear as she
 * scrolls (scroll-triggered, never time-based), manual scrolling always works,
 * and the "Read the whole letter" control switches to a plain, animation-free
 * rendering. No text is ever hidden behind a mandatory interaction.
 */

type Stage = "sealed" | "opening" | "letter";

function LetterParagraph({
  part,
  plain,
  index,
}: {
  part: LetterPart;
  plain: boolean;
  index: number;
}) {
  const base = cn(
    "mx-auto max-w-xl",
    part.kind === "salutation" && "font-hand text-3xl text-[#651B35] sm:text-4xl",
    part.kind === "body" && "text-[1.05rem] font-normal leading-[1.85] text-[#33202a] sm:text-lg",
    part.kind === "emphasis" &&
      "py-2 text-center font-serif text-2xl italic leading-snug text-[#651B35] sm:text-[1.7rem]",
    part.kind === "signoff" && "pt-6 font-hand text-2xl text-[#651B35]/90",
    part.kind === "signature" && "pb-4 font-hand text-4xl text-[#651B35] sm:text-5xl",
    part.kind === "dedication" &&
      "border-t border-[#651B35]/15 pt-5 text-center text-[11px] uppercase tracking-[0.22em] text-[#651B35]/60"
  );

  if (plain) {
    return <p className={base}>{part.text}</p>;
  }

  return (
    <motion.p
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className={base}
    >
      {part.text}
    </motion.p>
  );
}

export function LoveLetterScene() {
  const reduced = useReducedMotion();
  const [stage, setStage] = useState<Stage>(reduced ? "letter" : "sealed");
  const [plain, setPlain] = useState(false);

  // Envelope choreography: appears → flap opens → letter rises → full letter.
  useEffect(() => {
    if (reduced || stage !== "sealed") return;
    const t1 = setTimeout(() => setStage("opening"), 1000);
    const t2 = setTimeout(() => setStage("letter"), 2400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [reduced, stage]);

  const { heading, parts, readFullyLabel } = relationship.letter;

  return (
    <section aria-labelledby="letter-heading" className="mx-auto max-w-3xl pb-6">
      <SceneHeader eyebrow="Scene 05 — The Letter" title={heading} />
      <h2 id="letter-heading" className="sr-only">
        {heading}
      </h2>

      {/* ── Envelope ceremony ─────────────────────────────────────────── */}
      {stage !== "letter" && (
        <div className="grid min-h-[46vh] place-items-center" aria-live="polite">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative h-48 w-72 rounded-xl border border-champagne/25 bg-gradient-to-br from-wine via-[#4a1428] to-burgundy shadow-[0_40px_90px_-30px_rgba(101,27,53,0.8)] sm:h-56 sm:w-80">
              {/* Envelope body seam */}
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-1/2 rounded-t-xl bg-gradient-to-b from-[#7a2340]/60 to-transparent"
                style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
              />
              {/* Wax seal */}
              <motion.div
                initial={{ opacity: 1, scale: 1 }}
                animate={stage === "opening" ? { opacity: 0, scale: 0.6 } : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute left-1/2 top-1/2 z-10 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-champagne/40 bg-gradient-to-br from-wine to-[#3f0f24] shadow-md"
              >
                <Heart className="h-5 w-5 text-champagne/90" fill="rgba(232,214,181,0.5)" strokeWidth={1} />
              </motion.div>
              {/* The flap — rotates open */}
              <motion.div
                aria-hidden
                initial={{ rotateX: 0 }}
                animate={stage === "opening" ? { rotateX: -165 } : { rotateX: 0 }}
                transition={{ duration: 1, delay: stage === "opening" ? 0.35 : 0, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
                className="absolute inset-x-0 top-0 z-20 h-1/2 rounded-t-xl border-b border-champagne/20 bg-gradient-to-b from-[#5a1a33] to-[#4a1428]"
              />
              {/* The letter peeking out */}
              <motion.div
                aria-hidden
                initial={{ y: 30, opacity: 0 }}
                animate={stage === "opening" ? { y: -46, opacity: 1 } : { y: 30, opacity: 0 }}
                transition={{ duration: 0.9, delay: stage === "opening" ? 0.8 : 0, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-1/2 top-1/2 z-0 h-36 w-[85%] -translate-x-1/2 rounded-md bg-ivory shadow-lg"
              >
                <div className="space-y-2 p-4">
                  <div className="h-1.5 w-3/4 rounded bg-[#651B35]/20" />
                  <div className="h-1.5 w-full rounded bg-[#651B35]/15" />
                  <div className="h-1.5 w-5/6 rounded bg-[#651B35]/15" />
                  <div className="h-1.5 w-2/3 rounded bg-[#651B35]/15" />
                </div>
              </motion.div>
            </div>
            <p className="mt-6 text-center text-[11px] uppercase tracking-[0.3em] text-rose/60">
              {stage === "sealed" ? "for you" : "opening…"}
            </p>
          </motion.div>
        </div>
      )}

      {/* ── The letter itself — always complete, always readable ──────── */}
      {stage === "letter" && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-6 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setPlain(true);
                document.getElementById("the-letter-paper")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="inline-flex items-center gap-2 rounded-full border border-rose/25 bg-burgundy/40 px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-rose transition-colors hover:border-rose/50 hover:text-champagne"
            >
              <BookOpen className="h-3.5 w-3.5" aria-hidden />
              {readFullyLabel}
            </button>
          </div>

          <article
            id="the-letter-paper"
            className="paper relative overflow-hidden rounded-2xl px-6 py-10 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9)] sm:px-12 sm:py-14"
          >
            {/* Soft candlelight leak on the paper */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#E8D6B5]/30 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#DCA7B5]/25 blur-3xl"
            />

            {!plain && <div aria-hidden className="paper-lines pointer-events-none absolute inset-0" />}

            <div className="relative space-y-6">
              {parts.map((part, i) => (
                <LetterParagraph key={i} part={part} plain={plain} index={i} />
              ))}
            </div>
          </article>

          <p className="mt-8 flex items-center justify-center gap-2 text-center text-[11px] uppercase tracking-[0.3em] text-rose/50">
            <MailOpen className="h-3.5 w-3.5" aria-hidden />
            read at your own pace — there is no clock here
          </p>
        </motion.div>
      )}
    </section>
  );
}
