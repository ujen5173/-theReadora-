import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const authCookie =
    request.cookies.get("authjs.session-token") ||
    request.cookies.get("__Secure-authjs.session-token");

  if (!authCookie) {
    const url = new URL("/auth/signin", request.url);

    url.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/write/:path*", "/creations/:path*", "/settings/:path*"],
};
