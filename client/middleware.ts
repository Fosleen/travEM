import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isTokenExpired(token: string): boolean {
  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const expirationTime = decodedToken.exp * 1000;
    return Date.now() >= expirationTime;
  } catch {
    return true;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (request.nextUrl.hostname === "putujemstravem.com") {
    const canonicalUrl = request.nextUrl.clone();
    canonicalUrl.hostname = "www.putujemstravem.com";
    return NextResponse.redirect(canonicalUrl, 308);
  }

  if (pathname === "/login") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("jwt")?.value;

    if (!token || isTokenExpired(token)) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Static and optimized-image requests never need the canonical-host or
  // admin-auth logic. Excluding them avoids needless middleware executions.
  matcher: [
    "/((?!_next/static|_next/image|images/|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
