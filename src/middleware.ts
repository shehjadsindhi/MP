import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = [
  "/account",
  "/wishlist",
  "/cart",
  "/checkout",
  "/orders",
];

const ADMIN_PREFIXES = [
  "/admin",
];

const PUBLIC_PREFIXES = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
  "/api/auth/me",
];

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isAdminRoute(pathname: string): boolean {
  return ADMIN_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isPublicApi(pathname: string): boolean {
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("galaxy_auth_token")?.value;
  const pathname = req.nextUrl.pathname;

  const isPageRoute = !pathname.startsWith("/_next") && !pathname.startsWith("/api");

  if (!isPageRoute) {
    return NextResponse.next();
  }

  if (isProtected(pathname)) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isAdminRoute(pathname)) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const adminRes = await fetch(`${process.env.NEXTAUTH_URL || req.nextUrl.origin}/api/auth/me`, {
      headers: {
        cookie: `galaxy_auth_token=${token}`,
      },
      cache: "no-store",
    });

    if (!adminRes.ok) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const data = await adminRes.json().catch(() => ({ user: null }));
    const user = data?.user;

    if (!user || user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|images|api/auth).*)"],
};
