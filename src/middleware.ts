import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Check for auth cookie instead of using Prisma
  const authCookie =
    request.cookies.get("next-auth.session-token") ||
    request.cookies.get("__Secure-next-auth.session-token") ||
    request.cookies.get("authjs.csrf-token") ||
    request.cookies.get("authjs.session-token");

  // Protected routes start with /write
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/write");

  if (isProtectedRoute && !authCookie) {
    // Create the URL for the sign-in page with a redirect back to the current page
    const url = new URL("/auth/signin", request.url);
    // Add the current URL as a callback parameter
    url.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Apply this middleware only to /write routes
  matcher: "/write/:path*",
};
