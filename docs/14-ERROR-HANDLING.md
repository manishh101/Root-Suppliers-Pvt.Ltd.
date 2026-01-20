# 📚 14 - Error Handling

> **Handling Errors Gracefully in Full-Stack Applications**

---

## 📖 Table of Contents

1. [Why Error Handling Matters](#why-error-handling-matters)
2. [Types of Errors](#types-of-errors)
3. [Custom Error Classes](#custom-error-classes)
4. [API Error Handling](#api-error-handling)
5. [Frontend Error Handling](#frontend-error-handling)
6. [Next.js Error Boundaries](#nextjs-error-boundaries)
7. [Form Validation Errors](#form-validation-errors)
8. [Logging Errors](#logging-errors)
9. [Best Practices](#best-practices)

---

## ⚠️ Why Error Handling Matters

**Without Error Handling:**
```
User clicks submit → API fails → Blank page → User confused, leaves ❌
```

**With Error Handling:**
```
User clicks submit → API fails → "Please try again" → User retries ✅
```

| Scenario | Bad UX | Good UX |
|----------|--------|---------|
| Form error | Page crashes | "Invalid email format" |
| Server down | Blank screen | "Service temporarily unavailable" |
| Not found | 500 error | "Product not found" with search |
| Network issue | Infinite loading | "Check your connection" |

---

## 🔍 Types of Errors

| Type | Example | Handling |
|------|---------|----------|
| **Validation** | Invalid email format | Show field error |
| **Authentication** | Not logged in | Redirect to login |
| **Authorization** | Not an admin | Show access denied |
| **Not Found** | Product doesn't exist | Show 404 page |
| **Server Error** | Database connection failed | Show generic error |
| **Network** | No internet | Show offline message |

---

## 🏗️ Custom Error Classes

### Creating Error Classes

```typescript
// src/lib/errors.ts
import { NextResponse } from "next/server";

/**
 * Base application error
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = "AppError";
  }
}

/**
 * Validation error (400)
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = "ValidationError";
  }
}

/**
 * Authentication error (401)
 */
export class AuthError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
    this.name = "AuthError";
  }
}

/**
 * Authorization error (403)
 */
export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

/**
 * Not found error (404)
 */
export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

/**
 * Conflict error (409) - Duplicate entry
 */
export class ConflictError extends AppError {
  constructor(message: string = "Resource already exists") {
    super(message, 409);
    this.name = "ConflictError";
  }
}

/**
 * Rate limit error (429)
 */
export class RateLimitError extends AppError {
  constructor(message: string = "Too many requests") {
    super(message, 429);
    this.name = "RateLimitError";
  }
}
```

### Using Custom Errors

```typescript
// In API routes
export async function GET(req, { params }) {
  const product = await Product.findById(params.id);
  
  if (!product) {
    throw new NotFoundError("Product not found");
  }
  
  return NextResponse.json({ product });
}

// In auth middleware
export async function verifyAdmin(req) {
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

---

## 🔧 API Error Handling

### Centralized Error Handler

```typescript
// src/lib/errors.ts
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { logger } from "@/lib/logger";

export function handleApiError(error: any) {
  // Log error for debugging
  logger.error({ err: error }, "API Error");

  // Handle our custom errors
  if (error instanceof AppError) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.statusCode }
    );
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const message = error.errors
      .map(err => `${err.path.join(".")}: ${err.message}`)
      .join(", ");
    
    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }

  // Handle MongoDB duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return NextResponse.json(
      { success: false, message: `${field} already exists` },
      { status: 409 }
    );
  }

  // Handle Mongoose validation errors
  if (error.name === "ValidationError") {
    const message = Object.values(error.errors)
      .map((val: any) => val.message)
      .join(", ");
    
    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }

  // Handle MongoDB CastError (invalid ObjectId)
  if (error.name === "CastError") {
    return NextResponse.json(
      { success: false, message: "Invalid ID format" },
      { status: 400 }
    );
  }

  // Default server error (don't expose internal details)
  return NextResponse.json(
    { success: false, message: "Internal Server Error" },
    { status: 500 }
  );
}
```

### Using in API Routes

```typescript
// With withValidate middleware (recommended)
export const POST = withValidate(
  async (req, validatedData) => {
    // If error is thrown, withValidate catches and handles it
    const product = await Product.create(validatedData);
    return successResponse({ product }, 201);
  },
  { schema: productSchema, requireAdmin: true }
);

// Without middleware (manual)
export async function GET(req: NextRequest) {
  try {
    const products = await Product.find();
    return NextResponse.json({ success: true, products });
  } catch (error) {
    return handleApiError(error);
  }
}
```

---

## 🖥️ Frontend Error Handling

### Try-Catch Pattern

```tsx
async function submitForm(data: FormData) {
  try {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    // Check for API error response
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Something went wrong");
    }
    
    // Success
    showToast("success", "Product created!");
    router.push("/admin/products");
    
  } catch (error) {
    // Handle error
    const message = error instanceof Error 
      ? error.message 
      : "An unexpected error occurred";
    
    showToast("error", message);
  }
}
```

### Error State Pattern

```tsx
function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch("/api/products");
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.message);
        }
        
        setProducts(data.products);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load products"
        );
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProducts();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-600">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
```

---

## 🚧 Next.js Error Boundaries

### Global Error Handler

```tsx
// src/app/error.tsx
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Something went wrong!
        </h1>
        <p className="text-gray-600 mb-6">
          We apologize for the inconvenience. Please try again.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>
            Try Again
          </Button>
          <Button variant="outline" onClick={() => window.location.href = "/"}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### 404 Not Found Page

```tsx
// src/app/not-found.tsx
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md p-8">
        <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    </div>
  );
}
```

### Route-Specific Error Handler

```tsx
// src/app/(admin)/admin/products/error.tsx
"use client";

export default function ProductsError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-bold mb-4">Failed to load products</h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="btn-primary"
      >
        Retry
      </button>
    </div>
  );
}
```

---

## 📝 Form Validation Errors

### Displaying Field Errors

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        // Server validation error - set to specific field
        if (result.field) {
          setError(result.field, { message: result.message });
        } else {
          // General error - set to root
          setError("root", { message: result.message });
        }
        return;
      }
      
      // Success...
    } catch (error) {
      setError("root", { message: "Network error. Please try again." });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Root error */}
      {errors.root && (
        <div className="bg-red-50 p-3 rounded-lg text-red-600 mb-4">
          {errors.root.message}
        </div>
      )}
      
      {/* Field with error */}
      <div>
        <label>Email</label>
        <input
          {...register("email")}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {errors.email.message}
          </p>
        )}
      </div>
      
      <button type="submit">Send</button>
    </form>
  );
}
```

---

## 📊 Logging Errors

### Simple Logger

```typescript
// src/lib/logger.ts
type LogLevel = "info" | "warn" | "error" | "debug";

interface LogData {
  message?: string;
  err?: Error;
  [key: string]: any;
}

class Logger {
  private log(level: LogLevel, data: LogData) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      ...data,
      ...(data.err && {
        error: {
          name: data.err.name,
          message: data.err.message,
          stack: data.err.stack,
        },
      }),
    };
    
    // In production, send to logging service
    if (process.env.NODE_ENV === "production") {
      // Send to Sentry, LogRocket, etc.
      console.log(JSON.stringify(logEntry));
    } else {
      // In development, pretty print
      console[level](logEntry);
    }
  }

  info(data: LogData | string) {
    this.log("info", typeof data === "string" ? { message: data } : data);
  }

  warn(data: LogData | string) {
    this.log("warn", typeof data === "string" ? { message: data } : data);
  }

  error(data: LogData | string, err?: Error) {
    this.log("error", {
      ...(typeof data === "string" ? { message: data } : data),
      ...(err && { err }),
    });
  }

  debug(data: LogData | string) {
    if (process.env.NODE_ENV !== "production") {
      this.log("debug", typeof data === "string" ? { message: data } : data);
    }
  }
}

export const logger = new Logger();
```

### Using the Logger

```typescript
import { logger } from "@/lib/logger";

// In API routes
export async function POST(req: NextRequest) {
  logger.info("Product creation started");
  
  try {
    const product = await Product.create(data);
    logger.info({ message: "Product created", productId: product._id });
    return successResponse({ product });
  } catch (error) {
    logger.error({ err: error }, "Product creation failed");
    return handleApiError(error);
  }
}

// In middleware
export function handleApiError(error: any) {
  logger.error({ err: error }, "API Error Occurred");
  // ...
}
```

---

## 💡 Best Practices

### 1. Never Expose Internal Errors

```typescript
// ❌ Bad - exposes internal details
return NextResponse.json({
  error: error.stack,  // Never send stack traces!
  query: "SELECT * FROM users WHERE..."  // Never send queries!
});

// ✅ Good - generic message
return NextResponse.json({
  success: false,
  message: "An error occurred"
});
```

### 2. Use Specific Error Messages for Validation

```typescript
// ❌ Bad - vague
throw new ValidationError("Invalid input");

// ✅ Good - specific
throw new ValidationError("Email must be a valid email address");
throw new ValidationError("Password must be at least 8 characters");
```

### 3. Don't Swallow Errors

```typescript
// ❌ Bad - error is lost
try {
  await riskyOperation();
} catch (e) {
  // Nothing happens, error is gone
}

// ✅ Good - log and handle
try {
  await riskyOperation();
} catch (error) {
  logger.error({ err: error }, "Operation failed");
  showToast("error", "Operation failed");
}
```

### 4. Provide Actionable Feedback

```tsx
// ❌ Bad - no way forward
<div>Something went wrong</div>

// ✅ Good - actionable
<div>
  <p>Failed to load products</p>
  <button onClick={retry}>Try Again</button>
  <a href="/support">Contact Support</a>
</div>
```

### 5. Type Your Errors

```typescript
// ❌ Bad - any type
catch (e) {
  console.log(e.message);  // e could be anything!
}

// ✅ Good - type check
catch (error) {
  if (error instanceof Error) {
    console.log(error.message);
  } else {
    console.log("Unknown error");
  }
}
```

---

## 📚 Next Steps

Now that you understand error handling:

→ **Next**: [15 - System Design](./15-SYSTEM-DESIGN.md) - Learn architectural patterns

---

*Handle Errors Like a Pro! 🛡️*
