import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getXRobotsTag } from "@/lib/seo";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Crawl / bot control
  response.headers.set("X-Robots-Tag", getXRobotsTag());

  // Hardened security headers (SEO-adjacent trust signals)
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );

  // Discourage caching of private/admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths except static assets that Next serves directly.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
