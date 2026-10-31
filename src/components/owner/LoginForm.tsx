"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Loader2, Lock, Mail } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * Owner login — a real Supabase Auth email/password sign-in.
 * There is no client-side "password check"; the session is verified again
 * on the server for every protected operation.
 */
export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError("That email and password don't match the owner account.");
        setSubmitting(false);
        return;
      }

      router.replace("/owner");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Sign-in is unavailable right now. Please check the Supabase configuration."
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-dvh place-items-center px-5">
      <div className="w-full max-w-sm rounded-3xl border border-rose/15 bg-burgundy/40 p-8 shadow-[0_40px_100px_-40px_rgba(101,27,53,0.8)]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full border border-rose/20 bg-burgundy/60">
            <Heart className="h-6 w-6 text-rose" fill="rgba(220,167,181,0.4)" strokeWidth={1} aria-hidden />
          </div>
          <h1 className="font-serif text-2xl text-ivory">For Mohan&apos;s eyes only</h1>
          <p className="mt-2 text-xs font-light tracking-wide text-ivory/50">
            Sign in with your Supabase owner account to read her heart.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-[11px] uppercase tracking-[0.2em] text-rose/70">
              Email
            </label>
            <div className="flex items-center gap-2.5 rounded-xl border border-rose/20 bg-midnight/70 px-3.5 focus-within:border-champagne/50">
              <Mail className="h-4 w-4 shrink-0 text-ivory/40" aria-hidden />
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent py-3 text-sm text-ivory placeholder:text-ivory/30 focus:outline-none"
                placeholder="mohan5050390@gmail.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-[11px] uppercase tracking-[0.2em] text-rose/70">
              Password
            </label>
            <div className="flex items-center gap-2.5 rounded-xl border border-rose/20 bg-midnight/70 px-3.5 focus-within:border-champagne/50">
              <Lock className="h-4 w-4 shrink-0 text-ivory/40" aria-hidden />
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent py-3 text-sm text-ivory placeholder:text-ivory/30 focus:outline-none"
                placeholder="Your password"
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-xl border border-wine/50 bg-wine/20 px-4 py-3 text-sm font-light text-rose">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-champagne/40 bg-gradient-to-r from-wine to-burgundy px-6 py-3.5 text-sm uppercase tracking-[0.18em] text-ivory transition-opacity disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] font-light leading-relaxed text-ivory/35">
          Only the account configured through OWNER_EMAIL can open this dashboard.
          Everyone else — thank you for respecting this space. ❤️
        </p>
      </div>
    </div>
  );
}
