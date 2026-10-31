"use client";

/**
 * Ambient animated background: deep burgundy gradient, drifting light leaks,
 * faint twinkling stars and floating rose petals. All positions are seeded
 * (identical on server and client) to avoid hydration mismatches, and every
 * layer hides from screen readers / sits behind the content.
 */
import { seededRandom } from "@/lib/utils";

const rand = seededRandom(20230918);

const STARS = Array.from({ length: 34 }, (_, i) => ({
  id: i,
  left: rand() * 100,
  top: rand() * 62,
  size: 1 + rand() * 1.6,
  duration: 3 + rand() * 5,
  delay: -rand() * 8,
}));

const PETALS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: rand() * 100,
  size: 9 + rand() * 9,
  drift: (rand() - 0.5) * 180,
  duration: 10 + rand() * 8,
  delay: -rand() * 18,
  opacity: 0.25 + rand() * 0.4,
  swayDuration: 4 + rand() * 3,
}));

export function AmbientBackground({ scene }: { scene: number }) {
  const isFinalScene = scene === 7;

  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-midnight">
      {/* Base cinematic gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(130%_90%_at_50%_0%,#300D20_0%,#150711_55%,#09070B_85%)]" />

      {/* Warm champagne wash for the final scene */}
      {isFinalScene && (
        <div className="absolute inset-x-0 bottom-0 h-[45vh] bg-[radial-gradient(70%_100%_at_50%_100%,rgba(232,214,181,0.14),transparent_75%)]" />
      )}

      {/* Drifting light leaks */}
      <div className="absolute -left-28 -top-28 h-[26rem] w-[26rem] animate-glow-drift rounded-full bg-wine/35 blur-3xl" />
      <div className="absolute -right-32 top-1/4 h-[30rem] w-[30rem] animate-glow-drift rounded-full bg-rose/10 blur-3xl [animation-delay:-8s]" />

      {/* Faint stars */}
      {STARS.map((star) => (
        <span
          key={`star-${star.id}`}
          className="absolute rounded-full bg-champagne animate-twinkle"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      {/* Floating rose petals */}
      {PETALS.map((petal) => (
        <span
          key={`petal-${petal.id}`}
          className="absolute -top-[6vh] animate-petal-fall"
          style={
            {
              left: `${petal.left}%`,
              width: petal.size,
              height: petal.size * 1.35,
              animationDuration: `${petal.duration}s`,
              animationDelay: `${petal.delay}s`,
              "--petal-drift": `${petal.drift}px`,
              "--petal-opacity": petal.opacity,
            } as React.CSSProperties
          }
        >
          <span
            className="block h-full w-full animate-sway bg-gradient-to-br from-rose/70 via-rose/40 to-wine/30"
            style={{
              borderRadius: "100% 4% 100% 4%",
              animationDuration: `${petal.swayDuration}s`,
            }}
          />
        </span>
      ))}
    </div>
  );
}
