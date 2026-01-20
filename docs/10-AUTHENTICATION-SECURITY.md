# 📚 10 - Authentication & Security

> **Implementing Secure User Authentication in Next.js**

---

## 📖 Table of Contents

1. [What is Authentication?](#what-is-authentication)
2. [Authentication vs Authorization](#authentication-vs-authorization)
3. [JWT Tokens Explained](#jwt-tokens-explained)
4. [Password Security](#password-security)
5. [Login Flow](#login-flow)
6. [Middleware Protection](#middleware-protection)
7. [API Route Protection](#api-route-protection)
8. [Security Headers](#security-headers)
9. [Rate Limiting](#rate-limiting)
10. [Security Best Practices](#security-best-practices)

---

## 🔐 What is Authentication?

Authentication verifies **who you are**. It answers: "Are you really who you claim to be?"

**Authentication Flow:**

| Step | User Action | Server Action | Database |
|------|-------------|---------------|----------|
| 1 | Send email + password | Receive login request | - |
| 2 | - | Find user by email | Query user |
| 3 | - | Receive user data | Return user |
| 4 | - | Verify password with `bcrypt.compare()` | - |
| 5 | Receive JWT token (stored in cookie) | Generate JWT | - |
| 6 | Send API request with cookie | Verify JWT | - |
| 7 | Receive protected data | Return data | - |

```
Login Flow:
User → POST /api/auth/login → Server verifies → JWT Cookie → Subsequent requests use cookie
```

---

## 🔑 Authentication vs Authorization

| Aspect | Authentication | Authorization |
|--------|---------------|---------------|
| **Question** | Who are you? | What can you do? |
| **Verifies** | Identity | Permissions |
| **Example** | Login with email/password | Can edit products? |
| **When** | At login | After authentication |

### In This Project

```typescript
// Authentication - Verify identity
const user = await verifyAuth(req);
// user = { userId, email, role }

// Authorization - Check permissions
if (user.role !== "admin") {
  throw new ForbiddenError("Admin access required");
}
```

### Role-Based Profile Access
For profile management, certain operations are restricted to ensure system integrity:
- **Profile Viewing**: Any authenticated user can view their own profile.
- **Sensitive Operations**: Operations like changing passwords or modifying system-critical user details are restricted to users with the `admin` role in the Admin Panel.
- **Data Sync**: The application ensures that profile updates automatically sync with the global user directory to maintain data consistency.

---

## 🎫 JWT Tokens Explained

### What is JWT?

JWT (JSON Web Token) is a compact, URL-safe way to represent claims between two parties.

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWE...
└─────────── Header ───────────┘└─────────── Payload ──────────┘

Header.Payload.Signature
```

### JWT Structure

A JWT token has 3 parts, separated by dots: `header.payload.signature`

**Header** (Algorithm & Token Type):
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload** (Claims/Data):
```json
{
  "userId": "65a8b...",
  "email": "admin@...",
  "role": "admin",
  "iat": 1705555555,
  "exp": 1706160355
}
```

**Signature**:
```
HMACSHA256(base64(header) + "." + base64(payload), secret)
```

| Part | Purpose |
|------|---------|
| Header | Identifies algorithm used |
| Payload | Contains user data (claims) |
| Signature | Verifies token wasn't tampered |

### Creating a JWT Token

```typescript
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

const token = await new SignJWT({
  userId: user._id.toString(),
  email: user.email,
  role: user.role,
})
  .setProtectedHeader({ alg: "HS256" })
  .setIssuedAt()
  .setExpirationTime("7d")  // Expires in 7 days
  .sign(JWT_SECRET);
```

### Verifying a JWT Token

```typescript
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

try {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  
  // payload = { userId, email, role, iat, exp }
  return payload;
} catch (error) {
  // Token is invalid or expired
  return null;
}
```

---

## 🔒 Password Security

### Never Store Plain Text Passwords!

```typescript
// ❌ WRONG - Never do this!
const user = await User.create({
  email: "admin@example.com",
  password: "mypassword123"  // Plain text!
});

// ✅ CORRECT - Hash the password
const hashedPassword = await bcrypt.hash("mypassword123", 12);
const user = await User.create({
  email: "admin@example.com",
  password: hashedPassword  // Hashed!
});
```

### bcrypt Hashing

```typescript
import bcrypt from "bcryptjs";

// Hashing (when creating user)
const salt = await bcrypt.genSalt(12);  // Salt rounds
const hashedPassword = await bcrypt.hash("mypassword", salt);
// Result: $2a$12$xyz...abc (60 characters)

// Comparing (when logging in)
const isMatch = await bcrypt.compare("mypassword", hashedPassword);
// Returns: true or false
```

### Automatic Hashing with Mongoose

```typescript
// src/lib/db/models/User.ts
const UserSchema = new Schema({
  password: {
    type: String,
    required: true,
    select: false  // Don't include in queries by default
  }
});

// Pre-save middleware - hash password automatically
UserSchema.pre("save", async function(next) {
  // Only hash if password is modified
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Instance method for password comparison
UserSchema.methods.comparePassword = async function(
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};
```

---

## 🚪 Login Flow

### Complete Login API

```typescript
// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import connectDB from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import { withValidate } from "@/lib/api-middleware";
import { loginSchema } from "@/lib/validations";
import { loginLimiter } from "@/lib/rate-limit";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

export const POST = withValidate(
  async (req: NextRequest, validatedData: any) => {
    await connectDB();

    const { email, password } = validatedData;

    // 1. Find user (include password for comparison)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new AuthError("Invalid credentials");
    }

    // 2. Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new AuthError("Invalid credentials");
    }

    // 3. Check if user is active
    if (!user.isActive) {
      throw new ForbiddenError("Account deactivated");
    }

    // 4. Create JWT token
    const token = await new SignJWT({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    // 5. Update last login
    user.lastLogin = new Date();
    await user.save();

    // 6. Create response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    // 7. Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,        // Not accessible via JavaScript
      secure: process.env.NODE_ENV === "production",  // HTTPS only in production
      sameSite: "lax",       // CSRF protection
      maxAge: 60 * 60 * 24 * 7,  // 7 days
      path: "/",             // Available on all routes
    });

    return response;
  },
  {
    schema: loginSchema,
    limiter: loginLimiter,
  }
);
```

### Cookie Security Options

| Option | Description |
|--------|-------------|
| `httpOnly` | Cannot be accessed by JavaScript (XSS protection) |
| `secure` | Only sent over HTTPS |
| `sameSite` | Controls cross-site sending (CSRF protection) |
| `maxAge` | Expiration time in seconds |
| `path` | URL path where cookie is valid |

---

## 🛡️ Middleware Protection

### Edge Middleware

Middleware runs before every request at the edge:

```typescript
// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Protect admin routes (except login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get("auth-token")?.value;

    // No token - redirect to login
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    // Verify token
    try {
      await jwtVerify(token, JWT_SECRET);
      // Token valid - continue
    } catch (error) {
      // Token invalid - redirect to login
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Which routes to run middleware on
export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
```

---

## 🔐 API Route Protection

### Auth Verification Functions

```typescript
// src/lib/auth.ts
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { AuthError, ForbiddenError } from "@/lib/errors";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

export interface AuthUser {
  userId: string;
  email: string;
  role: "admin" | "editor";
}

/**
 * Verify JWT token and return user data
 */
export async function verifyAuth(req: NextRequest): Promise<AuthUser | null> {
  try {
    const token = req.cookies.get("auth-token")?.value;

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as "admin" | "editor",
    };
  } catch (error) {
    return null;
  }
}

/**
 * Verify admin access
 */
export async function verifyAdmin(req: NextRequest): Promise<AuthUser> {
  const user = await verifyAuth(req);
  
  if (!user) {
    throw new AuthError("Authentication required");
  }
  
  if (user.role !== "admin") {
    throw new ForbiddenError("Admin access required");
  }
  
  return user;
}
```

### Protected API Route

```typescript
// src/app/api/products/route.ts
import { withValidate } from "@/lib/api-middleware";

// Public endpoint
export const GET = withValidate(
  async (req: NextRequest) => {
    const products = await Product.find();
    return NextResponse.json({ products });
  }
);

// Admin-only endpoint
export const POST = withValidate(
  async (req: NextRequest, validatedData) => {
    const product = await Product.create(validatedData);
    return NextResponse.json({ product }, { status: 201 });
  },
  {
    requireAdmin: true,  // Requires admin authentication
    schema: productSchema
  }
);
```

---

## 🔒 Security Headers

### Adding Security Headers

```typescript
// src/middleware.ts
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");
  
  // Prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");
  
  // Control referrer information
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // Restrict browser features
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );
  
  // Enforce HTTPS
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );

  // Content Security Policy
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline' fonts.googleapis.com;
    img-src 'self' blob: data: res.cloudinary.com;
    font-src 'self' fonts.gstatic.com;
    connect-src 'self';
  `.replace(/\s{2,}/g, " ").trim();
  
  response.headers.set("Content-Security-Policy", cspHeader);

  return response;
}
```

### Security Headers Explained

| Header | Purpose |
|--------|---------|
| **X-Frame-Options** | Prevents your site from being embedded in iframes (clickjacking) |
| **X-Content-Type-Options** | Prevents browsers from MIME-sniffing |
| **Referrer-Policy** | Controls what info is sent in Referer header |
| **Permissions-Policy** | Restricts browser features |
| **Strict-Transport-Security** | Forces HTTPS connections |
| **Content-Security-Policy** | Controls which resources can be loaded |

---

## ⏱️ Rate Limiting

### Rate Limiter Implementation

```typescript
// src/lib/rate-limit.ts
interface RateLimiterStore {
  [ip: string]: {
    count: number;
    resetTime: number;
  };
}

export class RateLimiter {
  private store: RateLimiterStore = {};
  
  constructor(
    public limit: number,      // Max requests
    public windowMs: number    // Time window in ms
  ) {}

  check(ip: string): boolean {
    const now = Date.now();
    const record = this.store[ip];

    // No record or expired window
    if (!record || now > record.resetTime) {
      this.store[ip] = {
        count: 1,
        resetTime: now + this.windowMs
      };
      return true;
    }

    // Under limit
    if (record.count < this.limit) {
      record.count++;
      return true;
    }

    // Over limit
    return false;
  }

  getRemaining(ip: string): number {
    const record = this.store[ip];
    if (!record) return this.limit;
    return Math.max(0, this.limit - record.count);
  }
}

// Pre-configured limiters
export const publicApiLimiter = new RateLimiter(100, 60 * 1000);  // 100/min
export const loginLimiter = new RateLimiter(5, 15 * 60 * 1000);   // 5/15min
export const uploadLimiter = new RateLimiter(20, 60 * 1000);      // 20/min
```

### Using Rate Limiting

```typescript
// In middleware
if (pathname === "/api/auth/login" && method === "POST") {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  
  if (!loginLimiter.check(ip)) {
    return NextResponse.json(
      { error: "Too many login attempts" },
      { status: 429 }
    );
  }
}

// In API routes via withValidate
export const POST = withValidate(handler, {
  limiter: loginLimiter
});
```

---

## 🛡️ Security Best Practices

### 1. Environment Variables

```bash
# .env.local (never commit this!)
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=your-32-character-secret-key-here
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### 2. Password Requirements

```typescript
// src/lib/validations/auth.schema.ts
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8, "Minimum 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[a-z]/, "Must contain lowercase")
    .regex(/[0-9]/, "Must contain number")
    .regex(/[^A-Za-z0-9]/, "Must contain special character"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});
```

### 3. Input Sanitization

```typescript
import DOMPurify from "isomorphic-dompurify";

// Sanitize HTML content
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "br", "strong", "em", "ul", "ol", "li", "a"],
    ALLOWED_ATTR: ["href", "target"]
  });
}
```

### 4. CSRF Protection

```typescript
// Using sameSite cookie attribute
response.cookies.set("auth-token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "lax",  // Prevents CSRF
  // ...
});
```

### 5. Generic Error Messages

```typescript
// ❌ Bad - reveals too much
if (!user) {
  throw new Error("User with email admin@example.com not found");
}

// ✅ Good - generic message
if (!user) {
  throw new AuthError("Invalid credentials");
}
```

---

## 📋 Authentication Checklist

```
Before Deployment:
□ Strong NEXTAUTH_SECRET (32+ characters)
□ HTTP-only cookies enabled
□ Secure cookies in production
□ Rate limiting on login
□ Rate limiting on sensitive endpoints
□ HTTPS enforced
□ Security headers configured
□ Input validation (Zod)
□ HTML sanitization
□ Password hashing (bcrypt, 12 rounds)
□ Generic error messages
□ No secrets in code/logs
```

---

## 📚 Next Steps

Now that you understand authentication:

→ **Next**: [11 - Form Handling](./11-FORM-HANDLING.md) - Build and validate forms

---

*Stay Secure! 🔐*
