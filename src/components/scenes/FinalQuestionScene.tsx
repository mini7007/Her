"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Loader2, Send, SkipForward, Sparkles, Heart, PenLine } from "lucide-react";
import { SceneHeader } from "@/components/layout/SceneHeader";
import { relationship } from "@/content/relationship";
import { useClientToken } from "@/hooks/useClientToken";
import { HONEYPOT_FIELD, type ResponseValue } from "@/lib/validation/response";
import { cn } from "@/lib/utils";

/**
 * SCENE 08 — "The Quiet Final Question".
 *
 * Four equally prominent, equally respectful options — AND a free space to
 * simply write what's in her heart, with no option required at all. No
 * countdowns, no fake success animations, no guilt, no repeated prompts, and
 * never any visual pressure toward one answer. She submits only when SHE
 * chooses to; the response is stored once, and she may intentionally return
 * and respond again.
 */

type Phase = "composing" | "sending" | "done";

interface SubmitResult {
  ok: boolean;
  duplicate?: boolean;
  error?: string;
}

export function FinalQuestionScene() {
  const reduced = useReducedMotion();
  const { heading, paragraphs, question, options, messagePrompt, messageMaxLength, sendLabel, skipMessageLabel, thankYou, writeMoreLabel, acknowledgementByResponse } =
    relationship.final;

  const [phase, setPhase] = useState<Phase>("composing");
  const [choice, setChoice] = useState<ResponseValue | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [finalResponse, setFinalResponse] = useState<ResponseValue | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const { token, rotateToken } = useClientToken();

  const trimmed = message.trim();
  const canSend = choice !== null || trimmed.length > 0;
  const canSkip = choice !== null && trimmed.length === 0;

  const appear = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-10% 0px" } as const,
          transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  async function submit(withMessage: boolean) {
    if (phase === "sending") return;
    if (!canSend && !withMessage) return;

    // "Send" carries the message when she wrote one; "Skip" sends the choice alone.
    const outgoingMessage = withMessage && trimmed.length > 0 ? trimmed : null;
    if (!choice && (!outgoingMessage || outgoingMessage.length === 0)) {
      setError("Write what's in your heart — or choose one of the four options. Either is welcome.");
      return;
    }

    setPhase("sending");
    setError(null);

    try {
      const res = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          response: choice ?? "message",
          message: outgoingMessage,
          clientToken: token || null,
          [HONEYPOT_FIELD]: honeypot,
        }),
      });
      const data = (await res.json()) as SubmitResult;

      if (!res.ok || !data.ok) {
        setError(data.error || "Something went wrong. Please try again in a moment.");
        setPhase("composing");
        return;
      }

      setFinalResponse(choice ?? "message");
      setPhase("done");
    } catch {
      setError(
        "Your response couldn't reach me — perhaps the connection dropped. Nothing was lost; please try again."
      );
      setPhase("composing");
    }
  }

  function respondAgain() {
    rotateToken();
    setChoice(null);
    setMessage("");
    setError(null);
    setFinalResponse(null);
    setPhase("composing");
  }

  const acknowledge = finalResponse ? acknowledgementByResponse[finalResponse] : null;

  return (
    <section aria-labelledby="final-heading" className="mx-auto max-w-2xl pb-6">
      <SceneHeader eyebrow="Scene 08 — The Quiet Question" title={heading} />
      <h2 id="final-heading" className="sr-only">
        {heading}
      </h2>

      {/* The glowing rose */}
      <motion.div
        initial={reduced ? false : { opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mb-10 grid h-24 w-24 place-items-center rounded-full"
        aria-hidden
      >
        <div className="absolute h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(232,214,181,0.14),transparent_70%)]" />
        <RoseGlyph />
      </motion.div>

      {/* The words before the question */}
      <div className="space-y-5 text-center">
        {paragraphs.map((paragraph, i) => (
          <motion.p
            key={i}
            {...appear(0.1 + i * 0.06)}
            className="text-base font-light leading-relaxed text-ivory/75 sm:text-lg"
          >
            {paragraph}
          </motion.p>
        ))}
      </div>

      {/* THE question */}
      <motion.div
        {...appear(0.4)}
        className="my-12 rounded-3xl border border-champagne/25 bg-burgundy/50 px-6 py-10 text-center shadow-[0_40px_100px_-40px_rgba(101,27,53,0.8)]"
      >
        <p className="font-serif text-2xl italic leading-snug text-champagne text-glow sm:text-3xl">
          {question}
        </p>
      </motion.div>

      {/* ── The response flow ─────────────────────────────────────────── */}
      {phase === "done" ? (
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          role="status"
          className="rounded-3xl border border-rose/20 bg-burgundy/40 px-6 py-12 text-center sm:px-10"
        >
          <Heart className="mx-auto h-6 w-6 text-rose/70" strokeWidth={1.25} aria-hidden />
          <p className="mt-6 font-serif text-xl italic leading-relaxed text-ivory/90 sm:text-2xl">
            {thankYou[0]}
          </p>
          <p className="mt-4 font-light leading-relaxed text-ivory/65">{thankYou[1]}</p>
          <p className="mt-2 font-light leading-relaxed text-ivory/65">{thankYou[2]}</p>
          {acknowledge && (
            <p className="mt-6 border-t border-rose/10 pt-6 font-hand text-2xl leading-relaxed text-rose/85">
              {acknowledge}
            </p>
          )}
          <button
            type="button"
            onClick={respondAgain}
            className="mt-10 text-xs font-light tracking-wide text-ivory/40 underline decoration-ivory/20 underline-offset-4 transition-colors hover:text-rose/70"
          >
            {writeMoreLabel}
          </button>
        </motion.div>
      ) : (
        <div>
          {/* Four equally prominent options */}
          <motion.div
            {...appear(0.5)}
            className={cn("grid gap-3", "sm:grid-cols-2")}
            role="radiogroup"
            aria-label="Your answer"
          >
            {options.map((option) => {
              const selected = choice === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setChoice(choice === option.value ? null : option.value)}
                  className={cn(
                    "rounded-2xl border px-5 py-5 text-left transition-all duration-300",
                    selected
                      ? "border-champagne/60 bg-champagne/10 shadow-[0_20px_50px_-25px_rgba(232,214,181,0.4)]"
                      : "border-rose/15 bg-burgundy/35 hover:border-rose/40"
                  )}
                >
                  <span className="block font-serif text-lg leading-snug text-ivory">
                    {option.label}
                  </span>
                  <span className="mt-1.5 block text-xs font-light text-ivory/50">
                    {option.helper}
                  </span>
                </button>
              );
            })}
          </motion.div>

          {/* Free space — always here, with or without an option */}
          <motion.div
            {...appear(0.6)}
            className="mt-8 rounded-3xl border border-rose/15 bg-burgundy/40 p-6 sm:p-8"
          >
            <p className="text-center font-hand text-2xl text-rose/85">{messagePrompt}</p>

            <div className="mt-6">
              <label htmlFor="final-message" className="mb-1.5 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-rose/70">
                <PenLine className="h-3 w-3" aria-hidden />
                Or simply write what you want to
              </label>
              <textarea
                id="final-message"
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, messageMaxLength))}
                maxLength={messageMaxLength}
                rows={6}
                placeholder="Type anything here — in your own words. You don't have to choose any option first."
                className="w-full resize-y rounded-2xl border border-rose/20 bg-midnight/70 px-4 py-3.5 text-base font-light leading-relaxed text-ivory placeholder:text-ivory/30 focus:border-champagne/50 focus:outline-none"
              />
              <div className="mt-2 flex items-center justify-between">
                <p aria-hidden className="text-[11px] uppercase tracking-[0.25em] text-ivory/35">
                  {choice ? options.find((o) => o.value === choice)?.label : "Just words — no option needed"}
                </p>
                <p className="text-[11px] tabular-nums text-ivory/35">
                  {message.length}/{messageMaxLength}
                </p>
              </div>
            </div>

            {/* Honeypot — visually removed, ignored by humans, traps bots */}
            <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
              <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
              <input
                id={HONEYPOT_FIELD}
                type="text"
                name={HONEYPOT_FIELD}
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {error && (
              <p role="alert" className="mt-4 rounded-xl border border-wine/50 bg-wine/20 px-4 py-3 text-sm font-light text-rose">
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => submit(true)}
                disabled={phase === "sending" || !canSend}
                className="inline-flex min-w-[13rem] items-center justify-center gap-2.5 rounded-full border border-champagne/40 bg-gradient-to-r from-wine via-[#4a1428] to-wine px-8 py-3.5 text-sm uppercase tracking-[0.18em] text-ivory transition-all duration-300 hover:shadow-[0_20px_60px_-20px_rgba(220,167,181,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {phase === "sending" ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <Send className="h-4 w-4" aria-hidden />
                )}
                {phase === "sending" ? "Sending…" : sendLabel}
              </button>
              {canSkip && (
                <button
                  type="button"
                  onClick={() => submit(false)}
                  disabled={phase === "sending"}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-xs font-light uppercase tracking-[0.18em] text-ivory/50 transition-colors hover:text-rose disabled:opacity-50"
                >
                  <SkipForward className="h-3.5 w-3.5" aria-hidden />
                  {skipMessageLabel}
                </button>
              )}
            </div>

            {!canSend && (
              <p className="mt-6 flex items-center justify-center gap-2 text-center text-[11px] font-light tracking-wide text-ivory/35">
                <Sparkles className="h-3 w-3" aria-hidden />
                Choose an option above, write below, or do both — whatever feels right.
              </p>
            )}
          </motion.div>
        </div>
      )}
    </section>
  );
}

/** A quietly glowing rose, drawn with a few honest curves. */
function RoseGlyph() {
  return (
    <svg viewBox="0 0 64 64" className="h-20 w-20" aria-hidden>
      <defs>
        <radialGradient id="rose-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#DCA7B5" stopOpacity="0.55" />
          <stop offset="1" stopColor="#DCA7B5" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rose-petal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E8D6B5" />
          <stop offset="1" stopColor="#DCA7B5" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#rose-glow)" />
      <g fill="none" stroke="url(#rose-petal)" strokeWidth="1.4" strokeLinecap="round">
        <path d="M32 14c5 4 8 8.5 8 14.5C40 35 36.5 40 32 40s-8-5-8-11.5C24 22.5 27 18 32 14z" />
        <path d="M32 20c3.2 2.6 5 5.6 5 9.2 0 3.9-2.2 6.8-5 6.8s-5-2.9-5-6.8c0-3.6 1.8-6.6 5-9.2z" opacity="0.85" />
        <path d="M32 40v10" />
        <path d="M32 46c-3 0-5.5-1.4-7-3.4" opacity="0.8" />
        <path d="M32 48c3 0 5.5-1.4 7-3.4" opacity="0.8" />
      </g>
    </svg>
  );
}
