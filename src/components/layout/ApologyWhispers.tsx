"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { relationship } from "@/content/relationship";

/**
 * ApologyWhispers — soft handwritten thoughts ("I'm sorry, Bacha…",
 * "One more chance, Bacha?") that drift faintly across the screen on every
 * scene. Deliberately quiet: one at a time, very low opacity, behind all
 * content, never interactive, never blocking reading. Honors reduced motion
 * via the shell's MotionConfig (transforms collapse to gentle fades).
 */

interface Whisper {
  id: number;
  text: string;
  left: number;
  top: number;
  scale: number;
}

const SPAWN_INTERVAL_MS = 13_000;
const VISIBLE_MS = 9_500;

export function ApologyWhispers() {
  const pool = relationship.whispers;
  const [whisper, setWhisper] = useState<Whisper | null>(null);
  const idRef = useRef(0);

  useEffect(() => {
    if (!pool.length) return;

    let index = Math.floor(Math.random() * pool.length);
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    const spawn = () => {
      if (document.hidden) return;
      // Step forward through the pool with a little randomness.
      index = (index + 1 + Math.floor(Math.random() * 3)) % pool.length;
      idRef.current += 1;
      setWhisper({
        id: idRef.current,
        text: pool[index],
        left: 6 + Math.random() * 62,
        top: 10 + Math.random() * 66,
        scale: 0.9 + Math.random() * 0.5,
      });
      hideTimer = setTimeout(() => setWhisper(null), VISIBLE_MS);
    };

    const firstTimer = setTimeout(spawn, 5_500);
    const interval = setInterval(spawn, SPAWN_INTERVAL_MS);

    return () => {
      clearTimeout(firstTimer);
      clearTimeout(hideTimer);
      clearInterval(interval);
    };
  }, [pool]);

  if (!whisper) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.span
        key={whisper.id}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: [0, 0.17, 0.17, 0], y: [30, -12, -58] }}
        transition={{ duration: 9.5, times: [0, 0.22, 0.72, 1], ease: "easeOut" }}
        className="absolute whitespace-nowrap font-hand text-2xl text-rose sm:text-3xl"
        style={{ left: `${whisper.left}%`, top: `${whisper.top}%`, scale: whisper.scale }}
      >
        {whisper.text}
      </motion.span>
    </div>
  );
}
