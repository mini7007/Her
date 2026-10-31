"use client";

import { Play, Pause, SkipBack, SkipForward, Repeat, Repeat1, Volume2, VolumeX, Disc3, Music2 } from "lucide-react";import { useMusic } from "@/components/music/MusicProvider";
import { cn } from "@/lib/utils";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const iconButtonStyles =
  "grid place-items-center rounded-full border border-rose/20 bg-burgundy/50 text-rose transition-colors duration-300 hover:border-rose/50 hover:text-champagne focus-visible:outline-champagne/70 disabled:opacity-40";

/**
 * The full player shown in Scene 07 ("Our Songs").
 * All state comes from the persistent MusicProvider — nothing is remounted
 * when navigating away, so playback never restarts.
 */
export function MusicPlayer() {
  const {
    tracks,
    currentIndex,
    currentTrack,
    playing,
    volume,
    muted,
    currentTime,
    duration,
    repeat,
    trackError,
    togglePlay,
    next,
    previous,
    selectTrack,
    seek,
    setVolume,
    toggleMute,
    cycleRepeat,
    start,
    started,
  } = useMusic();

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="rounded-3xl border border-rose/15 bg-burgundy/40 p-6 shadow-[0_30px_80px_-30px_rgba(101,27,53,0.55)] backdrop-blur-sm sm:p-8">
        {/* Artwork / disc */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className={cn(
              "grid h-28 w-28 place-items-center rounded-full border border-rose/25 bg-gradient-to-br from-wine via-burgundy to-midnight shadow-inner",
              playing && "animate-spin-slow"
            )}
            aria-hidden
          >
            <Disc3 className="h-10 w-10 text-rose/70" strokeWidth={1.25} />
          </div>

          <div>
            <p className="font-serif text-2xl text-ivory sm:text-3xl">
              {currentTrack.title}
            </p>
            {currentTrack.artist && (
              <p className="mt-1 text-sm tracking-wide text-rose/80">
                {currentTrack.artist}
              </p>
            )}
          </div>

          {trackError && (
            <p
              role="status"
              className="flex items-start gap-2 rounded-xl border border-champagne/20 bg-midnight/60 px-4 py-3 text-left text-xs leading-relaxed text-champagne/80"
            >
              <Music2 className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              {trackError}
            </p>
          )}
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div
            role="slider"
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration) || 0}
            aria-valuenow={Math.round(currentTime)}
            tabIndex={0}
            className="group relative h-2 w-full cursor-pointer rounded-full bg-midnight/80"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              seek((e.clientX - rect.left) / rect.width);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") seek(progress + 0.05);
              if (e.key === "ArrowLeft") seek(progress - 0.05);
            }}
          >
            <div
              className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-wine via-rose to-champagne transition-[width] duration-150"
              style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[11px] tabular-nums text-ivory/50">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-5 flex items-center justify-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={cycleRepeat}
            aria-label={`Repeat mode: ${repeat}. Click to change.`}
            className={cn(iconButtonStyles, "h-10 w-10", repeat !== "off" && "border-champagne/60 text-champagne")}
          >
            {repeat === "one" ? <Repeat1 className="h-4 w-4" /> : <Repeat className="h-4 w-4" />}
          </button>

          <button type="button" onClick={previous} aria-label="Previous song" className={cn(iconButtonStyles, "h-12 w-12")}>
            <SkipBack className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={started ? togglePlay : start}
            aria-label={playing ? "Pause" : "Play"}
            className="grid h-16 w-16 place-items-center rounded-full border border-champagne/40 bg-gradient-to-br from-wine to-burgundy text-ivory shadow-[0_10px_35px_-10px_rgba(101,27,53,0.9)] transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            {playing ? <Pause className="h-6 w-6" /> : <Play className="ml-0.5 h-6 w-6" />}
          </button>

          <button type="button" onClick={next} aria-label="Next song" className={cn(iconButtonStyles, "h-12 w-12")}>
            <SkipForward className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
            className={cn(iconButtonStyles, "h-10 w-10", muted && "border-champagne/60 text-champagne")}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>

        {/* Volume */}
        <div className="mt-5 flex items-center gap-3">
          <Volume2 className="h-4 w-4 shrink-0 text-ivory/50" aria-hidden />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Volume"
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-midnight/80 accent-rose
              [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-rose"
          />
        </div>

        {/* Playlist */}
        <div className="mt-7 border-t border-rose/10 pt-5">
          <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-ivory/45">
            Playlist
          </p>
          <ul className="space-y-1.5">
            {tracks.map((track, i) => {
              const active = i === currentIndex;
              return (
                <li key={track.id}>
                  <button
                    type="button"
                    onClick={() => selectTrack(i)}
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors duration-300",
                      active
                        ? "bg-rose/10 text-champagne"
                        : "text-ivory/70 hover:bg-rose/5 hover:text-ivory"
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[11px]",
                        active ? "border-champagne/60 text-champagne" : "border-rose/20 text-rose/70"
                      )}
                    >
                      {active && playing ? <Music2 className="h-3 w-3" /> : i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-serif text-lg leading-tight">{track.title}</span>
                      {track.artist && (
                        <span className="block truncate text-xs text-ivory/50">{track.artist}</span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
