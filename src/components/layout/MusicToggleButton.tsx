"use client";

import { motion } from "framer-motion";
import { Music2, Pause } from "lucide-react";
import { useMusic } from "@/components/music/MusicProvider";

/**
 * Persistent music control — the explicit "music start" interaction.
 * Before music has begun it invites playback; afterwards it toggles
 * play/pause. Music NEVER starts by itself.
 */
export function MusicToggleButton() {
  const { started, playing, start, togglePlay } = useMusic();

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      onClick={started ? togglePlay : start}
      aria-label={started ? (playing ? "Pause music" : "Play music") : "Play music"}
      className="fixed right-4 top-4 z-40 flex items-center gap-2 rounded-full border border-rose/20 bg-midnight/70 px-3.5 py-2 text-[11px] uppercase tracking-[0.2em] text-rose backdrop-blur-md transition-colors duration-300 hover:border-rose/50 hover:text-champagne sm:right-6 sm:top-6"
    >
      {started && playing ? (
        <Pause className="h-3.5 w-3.5" aria-hidden />
      ) : (
        <Music2 className="h-3.5 w-3.5" aria-hidden />
      )}
      <span className="hidden sm:inline">{started ? (playing ? "Pause" : "Play") : "Play music"}</span>
    </motion.button>
  );
}
