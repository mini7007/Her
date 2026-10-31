"use client";

import { motion } from "framer-motion";
import { useNow } from "@/hooks/useNow";
import { diffYMDHMS, parseLocalDate } from "@/lib/utils";
import { relationship } from "@/content/relationship";

/**
 * Live relationship counter — years, months, days, hours, minutes, seconds —
 * updating once per second.
 *
 * TIMEZONE HANDLING (documented):
 * The start date is parsed as LOCAL MIDNIGHT in the *visitor's* timezone, and
 * the elapsed time is computed with the visitor's local clock. This is
 * deliberate: Bacha and Mohan may be in the same timezone, and a visitor's
 * own clock is the most intuitive reference for "how long we've been us".
 * No server timezone is involved.
 */

const UNITS = [
  { key: "years", label: "Years" },
  { key: "months", label: "Months" },
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
] as const;

export function RelationshipCounter() {
  const now = useNow(1000);
  const start = parseLocalDate(relationship.relationshipStartDateISO);

  const values = now
    ? diffYMDHMS(start, now)
    : ({ years: NaN, months: NaN, days: NaN, hours: NaN, minutes: NaN, seconds: NaN } as Record<string, number>);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      role="timer"
      aria-label="Time since 18 September 2023"
      className="mx-auto grid w-full max-w-2xl grid-cols-3 gap-2.5 sm:grid-cols-6 sm:gap-3"
    >
      {UNITS.map(({ key, label }) => {
        const value = values[key];
        return (
          <div
            key={key}
            className="rounded-2xl border border-rose/15 bg-burgundy/50 px-2 py-3 text-center shadow-[0_18px_40px_-24px_rgba(101,27,53,0.7)] sm:py-4"
          >
            <p className="font-serif text-2xl tabular-nums text-champagne sm:text-3xl">
              {Number.isNaN(value) ? "·" : String(value).padStart(key === "years" || key === "months" ? 1 : 2, "0")}
            </p>
            <p className="mt-1 text-[9px] uppercase tracking-[0.22em] text-ivory/45 sm:text-[10px]">
              {label}
            </p>
          </div>
        );
      })}
    </motion.div>
  );
}
