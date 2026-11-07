import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n/config";

const ADMIN_PATH = new RegExp(`^/(?:(?:${locales.join("|")})/)?admin(?:/|$)`);

function adminGate(request: NextRequest): NextResponse | null {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;
  if (!user || !pass) return new NextResponse("Admin disabled", { status: 503 }); // fail closed
  const h = request.headers.get("authorization") ?? "";
  if (h.startsWith("Basic ")) {
    try {
      const [u, ...rest] = atob(h.slice(6)).split(":");
      if (u === user && rest.join(":") === pass) return null;
    } catch { /* fall through */ }
  }
  return new NextResponse("Authentication required", { status: 401, headers: { "WWW-Authenticate": 'Basic realm="AADALA admin"' } });
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (ADMIN_PATH.test(pathname)) { const denied = adminGate(request); if (denied) return denied; }
  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return;
  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }
  return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url));
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};