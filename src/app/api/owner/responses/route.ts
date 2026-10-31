import { NextResponse } from "next/server";
import { requireOwner, adminClientOrNull } from "@/lib/owner/auth";

/**
 * Owner-only response API.
 *   GET   /api/owner/responses            → list (optional ?response=&status=)
 *   PATCH /api/owner/responses            → { id, status: "read" | "unread" }
 *
 * Every call re-verifies the Supabase Auth session AND the configured owner
 * email, server-side. Data is read with the service-role client, which bypasses
 * RLS — the RLS layer itself denies everyone else (no public policies exist).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function GET(request: Request) {
  const guard = await requireOwner();
  if (!guard.ok) {
    return json({ ok: false, error: guard.error }, guard.status);
  }

  const supabase = adminClientOrNull();
  if (!supabase) {
    return json(
      { ok: false, error: "SUPABASE_SERVICE_ROLE_KEY is not configured." },
      503
    );
  }

  const url = new URL(request.url);
  const responseFilter = url.searchParams.get("response");
  const statusFilter = url.searchParams.get("status");

  let query = supabase
    .from("relationship_responses")
    .select("id, response, message, status, submitted_at")
    .order("submitted_at", { ascending: false })
    .limit(500);

  if (responseFilter === "yes" || responseFilter === "time" || responseFilter === "talk" || responseFilter === "no" || responseFilter === "message") {
    query = query.eq("response", responseFilter);
  }
  if (statusFilter === "read" || statusFilter === "unread") {
    query = query.eq("status", statusFilter);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[owner/responses] list failed:", error.message);
    return json({ ok: false, error: "Could not load responses. Please try again." }, 500);
  }

  return json({ ok: true, responses: data ?? [] }, 200);
}

export async function PATCH(request: Request) {
  const guard = await requireOwner();
  if (!guard.ok) {
    return json({ ok: false, error: guard.error }, guard.status);
  }

  const supabase = adminClientOrNull();
  if (!supabase) {
    return json(
      { ok: false, error: "SUPABASE_SERVICE_ROLE_KEY is not configured." },
      503
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid request." }, 400);
  }

  const record = (typeof body === "object" && body !== null ? body : {}) as Record<string, unknown>;
  const id = typeof record.id === "string" ? record.id : "";
  const status = record.status;

  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_RE.test(id)) {
    return json({ ok: false, error: "Invalid response id." }, 400);
  }
  if (status !== "read" && status !== "unread") {
    return json({ ok: false, error: "Status must be 'read' or 'unread'." }, 400);
  }

  const { error: updateError } = await supabase
    .from("relationship_responses")
    .update({ status })
    .eq("id", id);

  if (updateError) {
    console.error("[owner/responses] update failed:", updateError.message);
    return json({ ok: false, error: "Could not update. Please try again." }, 500);
  }

  return json({ ok: true }, 200);
}
