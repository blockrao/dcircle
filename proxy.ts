import type { NextRequest } from "next/server";

/**
 * Reject legacy PHP and WordPress scanner traffic at the application edge.
 *
 * DallasCircle is a Next.js application and has no PHP/WordPress runtime.
 * Keep this deliberately narrow: normal Next.js, API, static, and directory
 * routes must continue to work.
 */
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.toLowerCase();

  const isPhpProbe = pathname.endsWith(".php") || pathname.includes(".php/");
  const isLegacyCmsProbe =
    pathname === "/wp-admin" ||
    pathname.startsWith("/wp-admin/") ||
    pathname === "/wp-content" ||
    pathname.startsWith("/wp-content/") ||
    pathname === "/wp-includes" ||
    pathname.startsWith("/wp-includes/") ||
    pathname === "/.tmb" ||
    pathname.startsWith("/.tmb/");

  if (isPhpProbe || isLegacyCmsProbe) {
    return new Response("Not Found", {
      status: 404,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }
}

export const config = {
  matcher: [
    "/:path*.php",
    "/wp-admin/:path*",
    "/wp-content/:path*",
    "/wp-includes/:path*",
    "/.tmb/:path*",
  ],
};
