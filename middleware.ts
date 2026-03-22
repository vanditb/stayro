import { NextResponse, type NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const host = request.headers.get("host") ?? "";
  const path = nextUrl.pathname;

  const isDashboardRoute =
    path.startsWith("/dashboard") || path.startsWith("/onboarding");
  const hasSession =
    Boolean(request.cookies.get("authjs.session-token")?.value) ||
    Boolean(request.cookies.get("__Secure-authjs.session-token")?.value);

  if (isDashboardRoute && !hasSession) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl));
  }

  const isLocalhost = host.includes("localhost");
  const hostname = host.replace(":3000", "");
  const subdomain = hostname.split(".")[0];
  const rootDomains = ["stayro.co", "stayro.local", "localhost"];

  const hasCustomSubdomain =
    !rootDomains.includes(hostname) &&
    !hostname.startsWith("www.") &&
    hostname.split(".").length > 2;

  if ((hasCustomSubdomain || (!isLocalhost && subdomain !== "www")) && !path.startsWith("/_sites")) {
    const rewriteSlug = hasCustomSubdomain ? subdomain : null;
    if (rewriteSlug) {
      return NextResponse.rewrite(new URL(`/_sites/${rewriteSlug}`, nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
