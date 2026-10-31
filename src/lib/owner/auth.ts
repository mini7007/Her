import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Server-side authorization for every owner data operation.
 *
 * Verifies — against Supabase Auth, over the network, with the request's
 * cookies — that the caller is authenticated AND is exactly the configured
 * owner. Never trust the client, never rely on a hidden route.
 */
export type OwnerGuard =
  | { ok: true }
  | { ok: false; status: 401 | 403 | 503; error: string };

export async function requireOwner(): Promise<OwnerGuard> {
  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return { ok: false, status: 503, error: "Authentication is not configured yet." };
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { ok: false, status: 401, error: "Please sign in first." };
  }

  const ownerEmail = process.env.OWNER_EMAIL?.trim().toLowerCase();
  if (!ownerEmail) {
    return { ok: false, status: 503, error: "OWNER_EMAIL is not configured." };
  }

  if (user.email?.trim().toLowerCase() !== ownerEmail) {
    return { ok: false, status: 403, error: "This dashboard is private." };
  }

  return { ok: true };
}

/** True when Supabase auth is configured (used by the login page UI). */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/** Service-role client or null when credentials are missing (clear 503s). */
export function adminClientOrNull() {
  try {
    return getSupabaseAdmin();
  } catch {
    return null;
  }
}
