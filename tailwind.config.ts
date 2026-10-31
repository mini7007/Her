import type { Config } from "tailwindcss";

/**
 * Design system — "If You Could Hear My Heart"
 * Palette: MIDNIGHT #09070B · BURGUNDY #300D20 · WINE #651B35
 *          ROSE #DCA7B5 · CHAMPAGNE #E8D6B5 · IVORY #FFF5ED
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#09070B",
        burgundy: "#300D20",
        wine: "#651B35",
        rose: "#DCA7B5",
        champagne: "#E8D6B5",
        ivory: "#FFF5ED",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        hand: ["var(--font-hand)", "cursive"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "petal-fall": {
          "0%": { transform: "translate3d(0, -8vh, 0) rotate(0deg)", opacity: "0" },
          "8%": { opacity: "var(--petal-opacity, 0.6)" },
          "92%": { opacity: "var(--petal-opacity, 0.6)" },
          "100%": {
            transform: "translate3d(var(--petal-drift, 40px), 110vh, 0) rotate(300deg)",
            opacity: "0",
          },
        },
        sway: {
          "0%,100%": { transform: "translateX(-12px) rotate(-8deg)" },
          "50%": { transform: "translateX(12px) rotate(8deg)" },
        },
        twinkle: {
          "0%,100%": { opacity: "0.12", transform: "scale(0.8)" },
          "50%": { opacity: "0.85", transform: "scale(1.25)" },
        },
        "glow-drift": {
          "0%,100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(4%, -3%, 0) scale(1.1)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "petal-fall": "petal-fall linear infinite",
        sway: "sway 5.5s ease-in-out infinite",
        twinkle: "twinkle 4.5s ease-in-out infinite",
        "glow-drift": "glow-drift 16s ease-in-out infinite",
        "spin-slow": "spin-slow 9s linear infinite",
        "fade-in": "fade-in 0.9s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
