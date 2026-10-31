import { NextResponse } from "next/server";
import { parseSubmission, HONEYPOT_FIELD, type ResponseValue } from "@/lib/validation/response";
import { checkRateLimit, getClientHash } from "@/lib/security/rateLimit";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/**
 * POST /api/responses — the ONLY way a response enters the database.
 *
 * Order of defense:
 *   1. Honeypot (silently swallowed — bots see success)
 *   2. Strict field validation (server-side, never trusted from client)
 *   3. Idempotency token (accidental double submissions return success once)
 *   4. Cross-instance rate limiting (salted IP hashes in Supabase)
 *   5. Database insert — confirmed BEFORE any success is returned
 *   6. Email notification (best-effort; failure never undoes the insert)
 */
export const runtime = "nodejs";

function json(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Please send a valid response." }, 400);
  }

  const record = (typeof body === "object" && body !== null ? body : {}) as Record<string, unknown>;

  // 1 — Honeypot: humans never fill this hidden field.
  if (typeof record[HONEYPOT_FIELD] === "string" && record[HONEYPOT_FIELD].length > 0) {
    return json({ ok: true }, 200);
  }

  // 2 — Validation.
  const parsed = parseSubmission(body);
  if (!parsed.ok) {
    return json({ ok: false, error: parsed.error }, 400);
  }

  // 3 — Trusted database access.
  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch {
    console.error("[responses] Supabase admin credentials are missing.");
    return json(
      { ok: false, error: "Responses are temporarily unavailable. Please try again a little later." },
      503
    );
  }

  // 3b — Accidental duplicate protection: same device token already submitted.
  if (parsed.data.clientToken) {
    const { data: existing } = await supabase
      .from("relationship_responses")
      .select("id")
      .eq("client_token", parsed.data.clientToken)
      .maybeSingle();
    if (existing) {
      return json({ ok: true, duplicate: true }, 200);
    }
  }

  // 4 — Rate limiting (after dedupe so legitimate retries aren't punished).
  const clientHash = await getClientHash(request);
  const rate = await checkRateLimit(clientHash);
  if (!rate.allowed) {
    return NextResponse.json(
      { ok: false, error: "That's a few messages in a short while — please take a breath and try again in a few minutes." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rate.retryAfterSeconds ?? 600),
          "Cache-Control": "no-store",
        },
      }
    );
  }

  // 5 — Persist FIRST.
  const { data, error: insertError } = await supabase
    .from("relationship_responses")
    .insert({
      response: parsed.data.response,
      message: parsed.data.message,
      client_token: parsed.data.clientToken,
    })
    .select("id, submitted_at")
    .single();

  if (insertError || !data) {
    console.error("[responses] insert failed:", insertError?.message ?? "no data returned");
    return json(
      { ok: false, error: "Your response could not be saved just now. Please try again in a moment." },
      500
    );
  }

  // 6 — Notify Mohan. Best-effort; a failure here never invalidates the insert.
  const submittedAt = new Date(data.submitted_at as string);
  await sendNotificationQuietly({
    response: parsed.data.response,
    message: parsed.data.message,
    submittedAt: Number.isNaN(submittedAt.getTime()) ? new Date() : submittedAt,
  });

  return json({ ok: true }, 201);
}

async function sendNotificationQuietly(payload: {
  response: ResponseValue;
  message: string | null;
  submittedAt: Date;
}) {
  try {
    const { sendResponseNotification } = await import("@/lib/email/sendResponseNotification");
    await sendResponseNotification(payload);
  } catch (err) {
    console.error(
      "[responses] notification error:",
      err instanceof Error ? err.message : "unknown"
    );
  }
}
