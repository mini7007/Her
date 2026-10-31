"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Track } from "@/types";
import { relationship } from "@/content/relationship";

/**
 * The heart of the persistent music experience.
 *
 * The <audio> element is mounted ONCE here — in the persistent application
 * shell — so playback continues seamlessly while scenes change. Autoplay is
 * never attempted: playback starts only from an explicit user interaction
 * (the music toggle or the player in "Our Songs").
 *
 * Volume defaults to 35%. iOS ignores programmatic volume changes — the
 * slider is simply ineffective there, and the UI still works.
 */

export type RepeatMode = "off" | "all" | "one";

interface MusicContextValue {
  tracks: Track[];
  currentTrack: Track;
  currentIndex: number;
  started: boolean;
  playing: boolean;
  volume: number;
  muted: boolean;
  currentTime: number;
  duration: number;
  repeat: RepeatMode;
  /** Error for the current track, e.g. missing file. */
  trackError: string | null;
  start: () => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  selectTrack: (index: number) => void;
  seek: (fraction: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  cycleRepeat: () => void;
}

const MusicContext = createContext<MusicContextValue | null>(null);

export function useMusic(): MusicContextValue {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used inside <MusicProvider>.");
  return ctx;
}

const tracks = relationship.music.tracks;
const defaultVolume = relationship.music.defaultVolume;

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolumeState] = useState(defaultVolume);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeat, setRepeat] = useState<RepeatMode>("off");
  const [trackError, setTrackError] = useState<string | null>(null);

  // Restore persisted preferences (never auto-resume playback itself).
  useEffect(() => {
    try {
      const savedVolume = window.localStorage.getItem("iycHMh-volume");
      if (savedVolume !== null) {
        const v = Number(savedVolume);
        if (!Number.isNaN(v) && v >= 0 && v <= 1) setVolumeState(v);
      }
      const savedRepeat = window.localStorage.getItem("iycHMh-repeat");
      if (savedRepeat === "off" || savedRepeat === "all" || savedRepeat === "one") {
        setRepeat(savedRepeat);
      }
    } catch {
      /* storage unavailable — defaults are fine */
    }
  }, []);

  const currentTrack = tracks[currentIndex] ?? tracks[0];

  const playCurrent = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.play().catch(() => {
      // Browser refused (autoplay policy / missing file). Treat as paused.
      setPlaying(false);
    });
  }, []);

  const start = useCallback(() => {
    setStarted(true);
    setTrackError(null);
    // Defer until after the <audio src> mount/commit — requestAnimationFrame
    // ensures the element exists with the right source.
    requestAnimationFrame(() => playCurrent());
  }, [playCurrent]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      setStarted(true);
      playCurrent();
    }
  }, [playing, playCurrent]);

  const selectTrack = useCallback(
    (index: number) => {
      if (index === currentIndex) {
        togglePlay();
        return;
      }
      setCurrentIndex(index);
      setCurrentTime(0);
      setDuration(0);
      setTrackError(null);
      setStarted(true);
      // Play after the new src commits.
      requestAnimationFrame(() => playCurrent());
    },
    [currentIndex, playCurrent, togglePlay]
  );

  const next = useCallback(() => {
    selectTrack((currentIndex + 1) % tracks.length);
  }, [currentIndex, selectTrack]);

  const previous = useCallback(() => {
    const audio = audioRef.current;
    // If a track is underway, "previous" first restarts it (standard player UX).
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    selectTrack((currentIndex - 1 + tracks.length) % tracks.length);
  }, [currentIndex, selectTrack]);

  const seek = useCallback((fraction: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    const clamped = Math.min(1, Math.max(0, fraction));
    audio.currentTime = audio.duration * clamped;
    setCurrentTime(audio.currentTime);
  }, []);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.min(1, Math.max(0, v));
    setVolumeState(clamped);
    setMuted(clamped === 0);
    try {
      window.localStorage.setItem("iycHMh-volume", String(clamped));
    } catch {
      /* ignore */
    }
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((m) => !m);
  }, []);

  const cycleRepeat = useCallback(() => {
    setRepeat((r) => (r === "off" ? "all" : r === "all" ? "one" : "off"));
  }, []);

  // Keep audio element in sync with state.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = muted ? 0 : volume;
  }, [volume, muted]);

  useEffect(() => {
    try {
      window.localStorage.setItem("iycHMh-repeat", repeat);
    } catch {
      /* ignore */
    }
  }, [repeat]);

  // Audio element event handlers (wired via props below).
  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };
  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };
  const handleEnded = () => {
    if (repeat === "one") {
      playCurrent();
      return;
    }
    const isLast = currentIndex === tracks.length - 1;
    if (repeat === "all" || !isLast) {
      selectTrack((currentIndex + 1) % tracks.length);
    } else {
      setPlaying(false);
    }
  };
  const handleError = () => {
    setTrackError(
      "This song isn't available yet — the audio file hasn't been added. You can keep going without music."
    );
    setPlaying(false);
  };

  const value = useMemo<MusicContextValue>(
    () => ({
      tracks,
      currentTrack,
      currentIndex,
      started,
      playing,
      volume,
      muted,
      currentTime,
      duration,
      repeat,
      trackError,
      start,
      togglePlay,
      next,
      previous,
      selectTrack,
      seek,
      setVolume,
      toggleMute,
      cycleRepeat,
    }),
    [
      currentTrack,
      currentIndex,
      started,
      playing,
      volume,
      muted,
      currentTime,
      duration,
      repeat,
      trackError,
      start,
      togglePlay,
      next,
      previous,
      selectTrack,
      seek,
      setVolume,
      toggleMute,
      cycleRepeat,
    ]
  );

  return (
    <MusicContext.Provider value={value}>
      {children}
      {/* The ONE persistent audio element for the whole experience. */}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleError}
      />
    </MusicContext.Provider>
  );
}
