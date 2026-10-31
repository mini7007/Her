"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { relationship } from "@/content/relationship";
import { cn } from "@/lib/utils";
import type { TimelineMemory } from "@/types";

/**
 * The "Our Story" timeline — six chapters, real memory cards when Mohan has
 * added them, and honest, elegant empty states when he hasn't. Placeholder
 * cards are never presented as real memories.
 */

function MemoryCard({ memory }: { memory: TimelineMemory }) {
  const reduced = useReducedMotion();
  const animated = !reduced && !memory.placeholder;

  return (
    <motion.article
      initial={animated ? { opacity: 0, y: 24 } : false}
      whileInView={animated ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "overflow-hidden rounded-2xl border bg-burgundy/45 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)] backdrop-blur-sm",
        memory.placeholder ? "border-dashed border-rose/20" : "border-rose/15"
      )}
    >
      {memory.photo && (
        <div className="relative h-52 w-full sm:h-60">
          <Image
            src={memory.photo.src}
            alt={memory.photo.alt}
            fill
            sizes="(max-width: 640px) 100vw, 560px"
            className="object-cover"
          />
        </div>
      )}
      <div className="p-5 sm:p-6">
        <p
          className={cn(
            "text-[11px] uppercase tracking-[0.25em]",
            memory.placeholder ? "text-ivory/35" : "text-champagne/80"
          )}
        >
          {memory.date}
        </p>
        <h3 className="mt-2 font-serif text-xl text-ivory sm:text-2xl">{memory.title}</h3>
        <p className="mt-2 text-sm font-light leading-relaxed text-ivory/65">
          {memory.description}
        </p>
        {memory.photo?.caption && (
          <p className="mt-3 font-hand text-lg text-rose/80">{memory.photo.caption}</p>
        )}
      </div>
    </motion.article>
  );
}

function EmptyChapterCard({ date }: { date?: string }) {
  const { title, line } = relationship.story.emptyState;
  return (
    <article className="rounded-2xl border border-dashed border-rose/20 bg-burgundy/25 px-6 py-8 text-center">
      <h3 className="font-serif text-lg italic text-ivory/50">{title}</h3>
      <p className="mt-2 text-sm font-light leading-relaxed text-ivory/40">{line}</p>
      {date && (
        <p className="mt-4 text-[11px] uppercase tracking-[0.25em] text-rose/60">{date}</p>
      )}
    </article>
  );
}

export function RelationshipTimeline() {
  const { categories, memories, emptyState } = relationship.story;

  return (
    <div className="relative mx-auto max-w-2xl">
      {/* The thread that ties the chapters together */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-[7px] w-px bg-gradient-to-b from-rose/40 via-rose/15 to-transparent sm:left-1/2"
      />

      <div className="space-y-12">
        {categories.map((category, categoryIndex) => {
          const chapterMemories = memories.filter((m) => m.category === category.id);
          return (
            <motion.section
              key={category.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative pl-8 sm:pl-0"
              aria-labelledby={`chapter-${category.id}`}
            >
              {/* Knot on the thread */}
              <span
                aria-hidden
                className="absolute left-0 top-1.5 grid h-4 w-4 place-items-center sm:left-1/2 sm:-translate-x-1/2"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-rose to-wine shadow-[0_0_12px_rgba(220,167,181,0.5)]" />
              </span>

              <div className={cn("sm:w-[calc(50%-2rem)]", categoryIndex % 2 === 1 && "sm:ml-auto")}>
                <h2 id={`chapter-${category.id}`} className="font-serif text-xl text-rose sm:text-2xl">
                  {category.title}
                </h2>
                <p className="mt-1 text-xs font-light tracking-wide text-ivory/50">
                  {category.blurb}
                </p>

                <div className="mt-4 space-y-4">
                  {chapterMemories.length > 0 ? (
                    chapterMemories.map((memory) => (
                      <MemoryCard key={memory.id} memory={memory} />
                    ))
                  ) : (
                    <EmptyChapterCard
                      date={
                        category.id === "beginning"
                          ? "18 September 2023 — where it all began"
                          : undefined
                      }
                    />
                  )}
                </div>
              </div>
            </motion.section>
          );
        })}
      </div>

      <p className="sr-only">{emptyState.line}</p>
    </div>
  );
}
