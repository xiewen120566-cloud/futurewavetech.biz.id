import { NextResponse, userAgent } from "next/server";
import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { ua } = userAgent(request);
  const isServer = ua === "node";
  if (pathname.startsWith("/api")) {
    return isServer
      ? NextResponse.next()
      : NextResponse.rewrite(new URL("/404", request.url));
  }
  const handleI18nRouting = createMiddleware(routing);
  const response = handleI18nRouting(request);
  return response;
}
export const config = {
  matcher: ["/api/:path*", "/((?!_next|static|ads).*)"],
};
