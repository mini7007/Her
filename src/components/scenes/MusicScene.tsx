"use client";

import { SceneHeader } from "@/components/layout/SceneHeader";
import { MusicPlayer } from "@/components/music/MusicPlayer";
import { relationship } from "@/content/relationship";

/**
 * SCENE 07 — "Our Songs": the full floating player with playlist.
 * The player talks to the same persistent MusicProvider the mini-player and
 * the music toggle use — navigating away never interrupts a song.
 */
export function MusicScene() {
  const { heading, subtitle } = relationship.music;

  return (
    <section aria-labelledby="music-heading" className="mx-auto max-w-3xl pb-6">
      <SceneHeader eyebrow="Scene 07 — Our Songs" title={heading} subtitle={subtitle} />
      <h2 id="music-heading" className="sr-only">
        {heading}
      </h2>
      <MusicPlayer />
    </section>
  );
}
