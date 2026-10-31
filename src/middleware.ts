import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes Supabase Auth sessions on owner-only routes so the server
 * components behind them always see valid cookies.
 *
 * NOTE: This does NOT gatekeep by itself — /owner and the owner API re-verify
 * the user server-side on every request (see lib/owner/auth.ts).
 */
export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let response = NextResponse.next({ request });

  if (!url || !anonKey) return response;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh the session cookies if the access token has expired.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ["/owner", "/owner/:path*", "/api/owner", "/api/owner/:path*"],
};
