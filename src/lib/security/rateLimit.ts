import { getSupabaseAdmin } from "@/lib/supabase/admin";

/**
 * Cross-instance rate limiting backed by Supabase (works across Vercel
 * serverless instances, unlike in-memory counters).
 *
 * Window: fixed 15-minute buckets, max 3 submissions per client hash.
 * The client hash is a salted SHA-256 of the visitor's IP — the raw IP is
 * never stored.
 */

const WINDOW_MS = 15 * 60 * 1000;
const MAX_SUBMISSIONS_PER_WINDOW = 3;
/** Pepper so stored hashes can't be reversed with public IP lists. */
const HASH_PEPPER = "iycHMh::rl::v1";

export async function getClientHash(request: Request): Promise<string> {
  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  const ip =
    forwarded.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  return sha256Hex(`${HASH_PEPPER}:${ip}`);
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
}

export async function checkRateLimit(clientHash: string): Promise<RateLimitResult> {
  let supabase: ReturnType<typeof getSupabaseAdmin>;
  try {
    supabase = getSupabaseAdmin();
  } catch {
    // Without configured credentials the insert would fail anyway; allow the
    // request to proceed so it hits the same clear error path.
    console.warn("[rate-limit] Supabase not configured — rate limiting disabled.");
    return { allowed: true };
  }

  const now = new Date();

  const { data: existing, error: selectError } = await supabase
    .from("response_rate_limits")
    .select("count, window_start")
    .eq("client_hash", clientHash)
    .maybeSingle();

  if (selectError) {
    // Fail open: never lock the front door because of a monitoring hiccup.
    console.error("[rate-limit] select failed:", selectError.message);
    return { allowed: true };
  }

  if (!existing) {
    const { error: insertError } = await supabase
      .from("response_rate_limits")
      .insert({ client_hash: clientHash, count: 1, window_start: now.toISOString() });
    if (insertError) console.error("[rate-limit] insert failed:", insertError.message);
    return { allowed: true };
  }

  const windowStart = new Date(existing.window_start as string);
  const expired = now.getTime() - windowStart.getTime() >= WINDOW_MS;

  if (expired) {
    const { error: resetError } = await supabase
      .from("response_rate_limits")
      .update({ count: 1, window_start: now.toISOString() })
      .eq("client_hash", clientHash);
    if (resetError) console.error("[rate-limit] reset failed:", resetError.message);
    return { allowed: true };
  }

  const count = typeof existing.count === "number" ? existing.count : 0;
  if (count >= MAX_SUBMISSIONS_PER_WINDOW) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((windowStart.getTime() + WINDOW_MS - now.getTime()) / 1000)
    );
    return { allowed: false, retryAfterSeconds };
  }

  const { error: bumpError } = await supabase
    .from("response_rate_limits")
    .update({ count: count + 1 })
    .eq("client_hash", clientHash);
  if (bumpError) console.error("[rate-limit] bump failed:", bumpError.message);

  return { allowed: true };
}
