"use client";

import { motion } from "framer-motion";
import { Pause, Play, SkipForward } from "lucide-react";
import { useMusic } from "@/components/music/MusicProvider";

/**
 * Floating mini-player — appears once music has been started and quietly
 * follows Bacha through every scene (except the full player scene).
 * Tap the title to jump to "Our Songs".
 */
export function MiniPlayer({ onOpenMusic }: { onOpenMusic: () => void }) {
  const { currentTrack, playing, togglePlay, next, started } = useMusic();

  if (!started) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-4 bottom-[calc(env(safe-area-inset-bottom,0px)+5.5rem)] z-30 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-72"
      role="region"
      aria-label="Music mini player"
    >
      <div className="flex items-center gap-2 rounded-2xl border border-rose/15 bg-midnight/80 p-2.5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pause music" : "Play music"}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-champagne/40 bg-gradient-to-br from-wine to-burgundy text-ivory transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
        </button>

        <button
          type="button"
          onClick={onOpenMusic}
          className="min-w-0 flex-1 text-left"
          aria-label={`Now playing: ${currentTrack.title}. Open Our Songs.`}
        >
          <span className="block text-[10px] uppercase tracking-[0.2em] text-rose/60">
            {playing ? "Now playing" : "Paused"}
          </span>
          <span className="block truncate font-serif text-sm text-ivory">
            {currentTrack.title}
            {currentTrack.artist ? ` · ${currentTrack.artist}` : ""}
          </span>
        </button>

        <button
          type="button"
          onClick={next}
          aria-label="Next song"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-rose/20 text-rose transition-colors hover:border-rose/50 hover:text-champagne"
        >
          <SkipForward className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
