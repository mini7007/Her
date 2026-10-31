"use client";

import { useCallback, useEffect, useMemo, useState, type ComponentType } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { MusicProvider } from "@/components/music/MusicProvider";
import { MiniPlayer } from "@/components/music/MiniPlayer";
import { MusicToggleButton } from "@/components/layout/MusicToggleButton";
import { LoadingVeil } from "@/components/layout/LoadingVeil";
import { AmbientBackground } from "@/components/layout/AmbientBackground";
import { FilmGrain } from "@/components/layout/FilmGrain";
import { ApologyWhispers } from "@/components/layout/ApologyWhispers";
import { ProgressRail, SceneNavigation, type SceneNavEntry } from "@/components/layout/SceneNavigation";
import { OpeningScene } from "@/components/scenes/OpeningScene";
import { OurStoryScene } from "@/components/scenes/OurStoryScene";
import { ApologyScene } from "@/components/scenes/ApologyScene";
import { AbsenceScene } from "@/components/scenes/AbsenceScene";
import { LoveLetterScene } from "@/components/scenes/LoveLetterScene";
import { CommitmentsScene } from "@/components/scenes/CommitmentsScene";
import { MusicScene } from "@/components/scenes/MusicScene";
import { FinalQuestionScene } from "@/components/scenes/FinalQuestionScene";

export interface SceneProps {
  /** Jump to a scene index. */
  goTo: (index: number) => void;
  /** Next / previous scene indices (clamped). */
  next: () => void;
  back: () => void;
  index: number;
}

const SCENES: Array<{ id: string; title: string; Component: ComponentType<SceneProps> }> = [
  { id: "opening", title: "Hey, Bacha...", Component: OpeningScene },
  { id: "our-story", title: "Our Story", Component: OurStoryScene },
  { id: "where-i-went-wrong", title: "Where I Went Wrong", Component: ApologyScene },
  { id: "your-absence", title: "Your Absence", Component: AbsenceScene },
  { id: "the-letter", title: "The Letter", Component: LoveLetterScene },
  { id: "commitments", title: "What I Want to Change", Component: CommitmentsScene },
  { id: "our-songs", title: "Our Songs", Component: MusicScene },
  { id: "the-question", title: "The Quiet Question", Component: FinalQuestionScene },
];

const MUSIC_SCENE_INDEX = 6;

/**
 * The single persistent application shell.
 * Everything that must survive scene changes — the audio element, music
 * state, ambient background — is mounted HERE, above the scene switcher.
 */
export function ExperienceShell() {
  const [scene, setScene] = useState(0);

  const goTo = useCallback((index: number) => {
    setScene((prev) => {
      const clamped = Math.max(0, Math.min(SCENES.length - 1, index));
      if (clamped !== prev) {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
      return clamped;
    });
  }, []);

  const next = useCallback(() => goTo(scene + 1), [goTo, scene]);
  const back = useCallback(() => goTo(scene - 1), [goTo, scene]);

  // Keyboard navigation — ignored while typing in the response form.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing) return;
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") back();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [next, back]);

  const navEntries = useMemo<SceneNavEntry[]>(
    () => SCENES.map(({ id, title }) => ({ id, title })),
    []
  );

  const Current = SCENES[scene].Component;

  return (
    <MotionConfig reducedMotion="user">
      <MusicProvider>
        <LoadingVeil />
        <AmbientBackground scene={scene} />
        <ApologyWhispers />
        <FilmGrain />
        <MusicToggleButton />

        <ProgressRail scenes={navEntries} current={scene} />

        <div className="relative z-10 flex min-h-dvh flex-col">
          <main className="flex-1 px-5 pb-44 pt-20 sm:px-8 sm:pt-24" id="main">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={scene}
                initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <Current goTo={goTo} next={next} back={back} index={scene} />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        <MiniPlayer onOpenMusic={() => goTo(MUSIC_SCENE_INDEX)} />
        <SceneNavigation scenes={navEntries} current={scene} onSelect={goTo} />
      </MusicProvider>
    </MotionConfig>
  );
}
