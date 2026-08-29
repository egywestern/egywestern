import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "./lib/auth";
import { checkRateLimit, getClientIp } from "./lib/rateLimit";

function isProtected(pathname: string, method: string) {
  if (pathname === "/api/discounts/apply") return false;
  if (pathname.startsWith("/api/discounts")) return true;
  if (pathname === "/api/uploads" && method === "POST") return true;
  if (pathname.startsWith("/api/products/") && pathname.endsWith("/variants"))
    return true;
  if (pathname === "/api/products" && method !== "GET") return true;
  if (pathname === "/api/catalog" && method !== "GET") return true;
  if (pathname === "/api/orders" && method !== "POST") return true;
  if (pathname === "/api/settings" && method !== "GET") return true;
  return false;
}

// Public-but-sensitive routes worth throttling per IP, independent of the
// admin-auth check above: brute-forcing the login, spamming fake orders /
// draining stock, hammering the payment gateway, or guessing discount codes.
function rateLimitFor(pathname: string, method: string) {
  if (pathname === "/api/admin/login" && method === "POST")
    return { limit: 5, windowMs: 15 * 60 * 1000 };
  if (pathname === "/api/orders" && method === "POST")
    return { limit: 10, windowMs: 10 * 60 * 1000 };
  if (pathname === "/api/payments/paymob" && method === "POST")
    return { limit: 10, windowMs: 10 * 60 * 1000 };
  if (pathname === "/api/discounts/apply" && method === "POST")
    return { limit: 20, windowMs: 10 * 60 * 1000 };
  return null;
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const method = request.method;

  const limitRule = rateLimitFor(pathname, method);
  if (limitRule) {
    const key = `${pathname}:${getClientIp(request)}`;
    const result = checkRateLimit(key, limitRule.limit, limitRule.windowMs);
    if (!result.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((result.retryAfterMs || 0) / 1000)),
          },
        },
      );
    }
  }

  if (!isProtected(pathname, method)) return NextResponse.next();
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const authenticated = await verifySessionToken(token);
  if (!authenticated)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/products",
    "/api/products/:path*",
    "/api/catalog",
    "/api/orders",
    "/api/discounts",
    "/api/discounts/:path*",
    "/api/settings",
    "/api/uploads",
    "/api/admin/login",
    "/api/payments/paymob",
  ],
};
