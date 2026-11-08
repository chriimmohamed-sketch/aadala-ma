import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n/config";

const ADMIN_PATH = new RegExp(`^/(?:(?:${locales.join("|")})/)?admin(?:/|$)`);

function localeFromPath(pathname: string): string {
  const seg = pathname.split("/").filter(Boolean)[0];
  return seg && (locales as readonly string[]).includes(seg) ? seg : defaultLocale;
}

/**
 * Supabase Auth session refresh + admin gate.
 * - No public role is trusted from client/storage.
 * - Admin requires authenticated session (verified by Supabase Auth server).
 *   Role == 'admin' is enforced server-side in the Admin Server Component
 *   (profiles via RLS); the proxy only enforces "signed-in".
 * - Fail-closed: missing Supabase env -> 503 (like the old Basic Auth gate).
 */
export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdmin = ADMIN_PATH.test(pathname);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Locale handling first (unchanged behavior)
  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  let response: NextResponse;
  if (hasLocale) {
    response = NextResponse.next({ request });
  } else if (pathname === "/") {
    response = NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  } else {
    response = NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url));
  }

  if (!isAdmin) return response;

  // --- Admin gate (Supabase session) ---
  if (!url || !anon) {
    // Fail closed: no Supabase configured -> admin disabled (503).
    return new NextResponse("Admin disabled: Supabase Auth not configured", { status: 503 });
  }

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // Refresh session + verify user against Supabase Auth server
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    const loginUrl = new URL(`/${localeFromPath(pathname)}/login`, request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated — allow to Admin Server Component which enforces role === 'admin' via profiles (RLS).
  // Replace response with the refreshed-session response so cookies stay in sync.
  response.headers.set("x-aadala-admin-session", "authenticated");
  return response;
}
