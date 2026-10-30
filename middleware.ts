import { NextResponse, type NextRequest } from "next/server";

/**
 * Keep one canonical public origin. This runs at the edge before the app
 * renders, so alternate-host requests do not execute page/database work.
 *
 * OpenNext's Cloudflare adapter supports Edge Middleware. Keep this on the
 * legacy middleware convention until the adapter supports Next.js 16's
 * Node.js-only proxy convention.
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase();

  if (host !== "www.dallascircle.com") {
    return NextResponse.next();
  }

  const destination = request.nextUrl.clone();
  destination.protocol = "https:";
  destination.hostname = "dallascircle.com";
  destination.port = "";

  return NextResponse.redirect(destination, 308);
}

export const config = {
  matcher: ["/:path*"],
};
