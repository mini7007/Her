"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Filter, Loader2, LogOut, RefreshCw } from "lucide-react";
import { ResponseCard, type OwnerResponse } from "@/components/owner/ResponseCard";
import { RESPONSE_LABELS, RESPONSE_VALUES, type ResponseValue } from "@/lib/validation/response";
import { cn } from "@/lib/utils";

/**
 * The private dashboard — where Mohan reads what her heart said.
 * Every fetch goes through /api/owner/responses, which re-verifies the
 * session server-side. Nothing here is ever shown to the public.
 */

type StatusFilter = "all" | "unread" | "read";
type TypeFilter = "all" | ResponseValue;

export function OwnerDashboard() {
  const router = useRouter();
  const [responses, setResponses] = useState<OwnerResponse[] | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const load = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/owner/responses", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setFetchError(data.error || "Could not load responses.");
      } else {
        setResponses(data.responses as OwnerResponse[]);
      }
    } catch {
      setFetchError("Connection problem — please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    // Quiet refresh every minute while the tab is visible.
    const id = setInterval(() => {
      if (document.visibilityState === "visible") load();
    }, 60_000);
    return () => clearInterval(id);
  }, [load]);

  async function toggleRead(id: string, next: "read" | "unread") {
    setBusyId(id);
    // Optimistic update, reconciled by the next refresh.
    setResponses((prev) =>
      prev?.map((r) => (r.id === id ? { ...r, status: next } : r)) ?? prev
    );
    try {
      await fetch("/api/owner/responses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: next }),
      });
    } catch {
      load();
    } finally {
      setBusyId(null);
    }
  }

  async function logout() {
    try {
      const { createSupabaseBrowserClient } = await import("@/lib/supabase/client");
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
    } catch {
      /* even if signout fails locally, the session will expire */
    }
    router.replace("/owner/login");
    router.refresh();
  }

  const filtered = useMemo(() => {
    if (!responses) return null;
    return responses.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (typeFilter !== "all" && r.response !== typeFilter) return false;
      return true;
    });
  }, [responses, statusFilter, typeFilter]);

  const unreadCount = responses?.filter((r) => r.status === "unread").length ?? 0;

  return (
    <div className="mx-auto max-w-3xl px-5 pb-24 pt-10 sm:px-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-rose/60">
            If You Could Hear My Heart
          </p>
          <h1 className="mt-2 font-serif text-3xl text-ivory sm:text-4xl">
            What she said…
          </h1>
          {responses && (
            <p className="mt-2 text-sm font-light text-ivory/55">
              {responses.length} {responses.length === 1 ? "response" : "responses"} ·{" "}
              <span className="text-champagne/80">{unreadCount} unread</span>
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={load}
            aria-label="Refresh"
            className="grid h-10 w-10 place-items-center rounded-full border border-rose/20 text-rose transition-colors hover:border-rose/50 hover:text-champagne"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} aria-hidden />
          </button>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-full border border-rose/20 px-4 py-2.5 text-[11px] uppercase tracking-[0.15em] text-rose/80 transition-colors hover:border-rose/50 hover:text-champagne"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden />
            Sign out
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-ivory/40">
          <Filter className="h-3 w-3" aria-hidden />
          Filter
        </span>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          aria-label="Filter by read status"
          className="rounded-full border border-rose/20 bg-midnight/70 px-3.5 py-2 text-xs text-ivory focus:border-champagne/50 focus:outline-none"
        >
          <option value="all">All</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
          aria-label="Filter by response type"
          className="rounded-full border border-rose/20 bg-midnight/70 px-3.5 py-2 text-xs text-ivory focus:border-champagne/50 focus:outline-none"
        >
          <option value="all">Every answer</option>
          {RESPONSE_VALUES.map((value) => (
            <option key={value} value={value}>
              {RESPONSE_LABELS[value]}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      {loading && responses === null ? (
        <div className="grid place-items-center rounded-3xl border border-rose/10 bg-burgundy/30 py-24 text-ivory/50">
          <Loader2 className="h-6 w-6 animate-spin" aria-hidden />
          <p className="mt-4 text-sm font-light">Listening for her words…</p>
        </div>
      ) : fetchError ? (
        <div role="alert" className="rounded-3xl border border-wine/50 bg-wine/20 px-6 py-10 text-center">
          <p className="text-sm font-light text-rose">{fetchError}</p>
          <button
            type="button"
            onClick={load}
            className="mt-5 rounded-full border border-rose/30 px-5 py-2 text-xs uppercase tracking-[0.15em] text-rose hover:border-rose/60 hover:text-champagne"
          >
            Try again
          </button>
        </div>
      ) : filtered && filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-rose/20 bg-burgundy/25 px-6 py-16 text-center">
          <p className="font-serif text-xl italic text-ivory/50">
            Nothing here yet.
          </p>
          <p className="mt-2 text-sm font-light text-ivory/40">
            When Bacha responds, her words will arrive here — and in your inbox.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered?.map((response) => (
            <ResponseCard
              key={response.id}
              response={response}
              onToggleRead={toggleRead}
            />
          ))}
        </div>
      )}

      {busyId && <span className="sr-only" role="status">Updating…</span>}
    </div>
  );
}
