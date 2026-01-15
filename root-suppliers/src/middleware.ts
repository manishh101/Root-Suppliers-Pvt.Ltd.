import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { RateLimiter } from "@/lib/rate-limit";

// Limit to 10 login attempts per minute per IP
const loginLimiter = new RateLimiter(10, 60000);
// Limit to 5 inquiry submissions per 5 minutes per IP
const publicFormLimiter = new RateLimiter(5, 300000);

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "your-secret-key-min-32-characters"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Admin Route Protection (Server-side)
  // Protect all /admin routes except /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      // Optional: Add redirect parameter
      // url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      // Token is valid, proceed
    } catch (error) {
      console.error("Middleware auth error:", error);
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  const response = NextResponse.next();

  // 1. Add Global Security Headers
  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");
  // Prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");
  // Control referrer information
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  // Restrict browser features
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
  );
  // Enforce HTTPS (HSTS) - 2 years
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );

  // Content Security Policy (Basic but effective)
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' *.google-analytics.com *.googletagmanager.com maps.googleapis.com;
    style-src 'self' 'unsafe-inline' fonts.googleapis.com;
    img-src 'self' blob: data: res.cloudinary.com *.google-analytics.com maps.gstatic.com *.googleapis.com;
    font-src 'self' fonts.gstatic.com;
    connect-src 'self' *.google-analytics.com maps.googleapis.com;
    frame-src 'self' www.google.com;
  `.replace(/\s{2,}/g, " ").trim();
  response.headers.set("Content-Security-Policy", cspHeader);

  // 2. Rate Limiting for Authentication Routes
  const isLoginRoute = request.nextUrl.pathname === "/api/auth/login";

  if (isLoginRoute && request.method === "POST") {
    const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown";

    if (!loginLimiter.check(ip)) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many login attempts. Please try again later."
        },
        { status: 429 }
      );
    }
  }

  // Public Form Rate Limit (Inquiries)
  if (request.nextUrl.pathname === "/api/inquiries" && request.method === "POST") {
    const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown";
    if (!publicFormLimiter.check(ip)) {
      return NextResponse.json(
        { success: false, message: "Too many submissions. Please try again in a few minutes." },
        { status: 429 }
      );
    }
  }

  // 3. CSRF Protection (Token Generation)
  // We set a CSRF token in a cookie if it doesn't exist.
  // Frontend should read this cookie and send it in 'X-CSRF-Token' header for mutations.
  // NOTE: Strict verification is currently disabled to prevent breakage until frontend is updated.
  const csrfToken = request.cookies.get("csrf-token")?.value || crypto.randomUUID();

  // Refresh schema or set new one
  response.cookies.set("csrf-token", csrfToken, {
    httpOnly: false, // Frontend needs to read this to send in header
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/upload (upload might need different headers sometimes, but mostly safe)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
