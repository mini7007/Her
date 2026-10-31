"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SceneNavEntry {
  id: string;
  title: string;
}

/**
 * Top progress rail + bottom navigation dock.
 * Fully keyboard accessible; the visitor is free to move in any direction
 * at any time — the experience never traps or forces them forward.
 */
export function SceneNavigation({
  scenes,
  current,
  onSelect,
}: {
  scenes: SceneNavEntry[];
  current: number;
  onSelect: (index: number) => void;
}) {
  const isFirst = current === 0;
  const isLast = current === scenes.length - 1;

  return (
    <nav
      aria-label="Scenes"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.9rem)]"
    >
      <div className="flex max-w-full items-center gap-1.5 rounded-full border border-rose/15 bg-midnight/80 px-3 py-2 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md sm:gap-2 sm:px-4">
        <button
          type="button"
          onClick={() => onSelect(current - 1)}
          disabled={isFirst}
          aria-label="Previous scene"
          className="grid h-9 w-9 place-items-center rounded-full text-rose/80 transition-colors hover:bg-rose/10 hover:text-champagne disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>

        <ol className="flex items-center gap-1.5 sm:gap-2">
          {scenes.map((scene, i) => {
            const active = i === current;
            return (
              <li key={scene.id}>
                <button
                  type="button"
                  onClick={() => onSelect(i)}
                  aria-label={`Scene ${i + 1} of ${scenes.length}: ${scene.title}`}
                  aria-current={active ? "step" : undefined}
                  className={cn(
                    "block rounded-full transition-all duration-500",
                    active
                      ? "h-2.5 w-7 bg-gradient-to-r from-rose to-champagne"
                      : "h-2.5 w-2.5 bg-rose/25 hover:bg-rose/60"
                  )}
                />
              </li>
            );
          })}
        </ol>

        <button
          type="button"
          onClick={() => onSelect(current + 1)}
          disabled={isLast}
          aria-label="Next scene"
          className="grid h-9 w-9 place-items-center rounded-full text-rose/80 transition-colors hover:bg-rose/10 hover:text-champagne disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </nav>
  );
}

/** Hairline progress bar pinned to the top of the viewport. */
export function ProgressRail({
  scenes,
  current,
}: {
  scenes: SceneNavEntry[];
  current: number;
}) {
  const progress = ((current + 1) / scenes.length) * 100;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[2px] bg-rose/10"
      role="presentation"
    >
      <motion.div
        className="h-full bg-gradient-to-r from-wine via-rose to-champagne"
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
