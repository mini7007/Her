"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Shared cinematic scene header: an eyebrow ("Scene 02 — Our Story"),
 * a large serif heading with a soft glow, and an optional subtitle.
 */
export function SceneHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <header
      className={cn(
        "mb-10 sm:mb-14",
        align === "center" ? "text-center" : "text-left"
      )}
    >
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "text-[11px] uppercase tracking-[0.35em] text-rose/70",
          align === "center" && "flex items-center justify-center gap-3"
        )}
      >
        {align === "center" && <span aria-hidden className="h-px w-8 bg-rose/40" />}
        {eyebrow}
        {align === "center" && <span aria-hidden className="h-px w-8 bg-rose/40" />}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="mt-4 font-serif text-3xl font-medium leading-snug text-ivory text-glow sm:text-4xl sm:leading-snug md:text-[2.75rem]"
      >
        {title}
      </motion.h1>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 text-sm font-light leading-relaxed text-ivory/60 sm:text-base"
        >
          {subtitle}
        </motion.p>
      )}
    </header>
  );
}
