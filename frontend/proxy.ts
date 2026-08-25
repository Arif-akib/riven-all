import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

async function verify(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const { pathname } = req.nextUrl;

   const isProtectedRoute = pathname.startsWith("/user");
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname.startsWith("/login");
  const isCheckoutRoute = pathname.startsWith("/checkout");

  let payload = null;

  if (token) {
    payload = await verify(token);
  }

// ❌ not logged in
  if (!payload && (isProtectedRoute || isAdminRoute || isCheckoutRoute)) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // ❌ logged in users shouldn't see login page
  if (payload && isLoginRoute) {
    return NextResponse.redirect(new URL("/user/dashboard", req.url));
  }

  // 🔥 role check
  if (isAdminRoute && !payload?.isAdmin) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/signin" , '/checkout'],
};