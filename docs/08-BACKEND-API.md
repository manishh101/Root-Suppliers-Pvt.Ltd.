# 📚 08 - Backend API Development

> **Building REST APIs with Next.js App Router**

---

## 📖 Table of Contents

1. [Understanding APIs](#understanding-apis)
2. [Next.js Route Handlers](#nextjs-route-handlers)
3. [HTTP Methods](#http-methods)
4. [Request and Response](#request-and-response)
5. [Query Parameters and URL Parsing](#query-parameters-and-url-parsing)
6. [Request Body Handling](#request-body-handling)
7. [API Middleware Pattern](#api-middleware-pattern)
8. [Error Handling](#error-handling)
9. [Rate Limiting](#rate-limiting)
10. [Authentication in APIs](#authentication-in-apis)
11. [Complete API Example](#complete-api-example)

---

## 🌐 Understanding APIs

### What is an API?

API (Application Programming Interface) allows different software to communicate.

**How APIs Work:**

| Request Type | Frontend | Backend | Database |
|--------------|----------|---------|----------|
| **GET** | `GET /api/products` → | Query products | → Return Products[] |
| | ← JSON Response | ← Products[] | |
| **POST** | `POST /api/products` with `{ name, price }` → | Validate & Insert | → Create record |
| | ← `{ success: true }` | ← Created confirmation | |

```
Frontend → HTTP Request → Backend API → Database Query → Response → Frontend
```

### REST API Principles

| Principle | Description |
|-----------|-------------|
| **Stateless** | Each request contains all info needed |
| **Resource-Based** | URLs represent resources (/products, /users) |
| **HTTP Methods** | GET, POST, PUT, DELETE for actions |
| **JSON Format** | Standard data exchange format |
| **Status Codes** | 200 OK, 404 Not Found, 500 Error, etc. |

---

## 📂 Next.js Route Handlers

### File-Based API Routes

In Next.js App Router, create API routes using `route.ts` files:

```
src/app/api/
├── products/
│   ├── route.ts          → /api/products (GET all, POST new)
│   └── [id]/
│       └── route.ts      → /api/products/:id (GET one, PUT, DELETE)
├── categories/
│   ├── route.ts          → /api/categories
│   └── [slug]/
│       └── route.ts      → /api/categories/:slug
├── auth/
│   ├── login/
│   │   └── route.ts      → /api/auth/login
│   └── logout/
│       └── route.ts      → /api/auth/logout
└── upload/
    └── route.ts          → /api/upload
```

### Basic Route Handler

```typescript
// src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";

// GET /api/products
export async function GET(request: NextRequest) {
  // Fetch products from database
  const products = await Product.find();
  
  // Return JSON response
  return NextResponse.json({ 
    success: true, 
    products 
  });
}

// POST /api/products
export async function POST(request: NextRequest) {
  // Parse request body
  const body = await request.json();
  
  // Create product
  const product = await Product.create(body);
  
  return NextResponse.json(
    { success: true, product },
    { status: 201 }  // 201 Created
  );
}
```

---

## 📬 HTTP Methods

### Common HTTP Methods

| Method | Purpose | Has Body | Idempotent |
|--------|---------|----------|------------|
| **GET** | Retrieve data | No | Yes |
| **POST** | Create new resource | Yes | No |
| **PUT** | Replace entire resource | Yes | Yes |
| **PATCH** | Partial update | Yes | Yes |
| **DELETE** | Remove resource | Sometimes | Yes |

### Example: All Methods for Products

```typescript
// src/app/api/products/route.ts

// GET - List all products
export async function GET(req: NextRequest) {
  const products = await Product.find();
  return NextResponse.json({ products });
}

// POST - Create new product
export async function POST(req: NextRequest) {
  const body = await req.json();
  const product = await Product.create(body);
  return NextResponse.json({ product }, { status: 201 });
}
```

```typescript
// src/app/api/products/[id]/route.ts

// GET - Get single product
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = await Product.findById(params.id);
  
  if (!product) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }
  
  return NextResponse.json({ product });
}

// PUT - Update entire product
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const product = await Product.findByIdAndUpdate(
    params.id,
    body,
    { new: true }  // Return updated document
  );
  
  return NextResponse.json({ product });
}

// DELETE - Remove product
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await Product.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Product deleted" });
}
```

---

## 📥 Request and Response

### NextRequest Object

```typescript
export async function GET(request: NextRequest) {
  // URL and path
  const url = new URL(request.url);
  const pathname = url.pathname;  // /api/products
  
  // Query parameters
  const searchParams = url.searchParams;
  const page = searchParams.get("page");  // ?page=1
  
  // Headers
  const authHeader = request.headers.get("authorization");
  const contentType = request.headers.get("content-type");
  
  // Cookies
  const token = request.cookies.get("auth-token");
  
  // Method
  const method = request.method;  // GET, POST, etc.
  
  // Body (for POST/PUT)
  const body = await request.json();
  
  // Form Data (for file uploads)
  const formData = await request.formData();
}
```

### NextResponse Object

```typescript
import { NextResponse } from "next/server";

// JSON response
return NextResponse.json({ 
  success: true, 
  data: products 
});

// With status code
return NextResponse.json(
  { error: "Not found" },
  { status: 404 }
);

// With headers
return NextResponse.json(
  { data: products },
  {
    status: 200,
    headers: {
      "Cache-Control": "max-age=60",
      "X-Custom-Header": "value"
    }
  }
);

// Redirect
return NextResponse.redirect(new URL("/login", request.url));

// Set cookies
const response = NextResponse.json({ success: true });
response.cookies.set("auth-token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60  // 7 days
});
return response;
```

---

## 🔍 Query Parameters and URL Parsing

### Working with Query Parameters

```typescript
// GET /api/products?page=2&limit=10&category=tools&search=drill

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  
  // Get individual parameters
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const category = searchParams.get("category");  // "tools" or null
  const search = searchParams.get("search");      // "drill" or null
  
  // Get all values for repeated params
  // ?tags=power&tags=electric
  const tags = searchParams.getAll("tags");  // ["power", "electric"]
  
  // Check if param exists
  const hasCategory = searchParams.has("category");  // true
  
  // Convert to object
  const paramsObject = Object.fromEntries(searchParams.entries());
  // { page: "2", limit: "10", category: "tools", search: "drill" }
}
```

### Building Query Object for Database

```typescript
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  
  // Pagination
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const skip = (page - 1) * limit;
  
  // Build query object
  const query: any = {};
  
  // Category filter
  const category = searchParams.get("category");
  if (category) {
    const categoryDoc = await Category.findOne({ slug: category });
    if (categoryDoc) {
      query.category = categoryDoc._id;
    }
  }
  
  // Search filter
  const search = searchParams.get("search");
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ];
  }
  
  // Boolean filters
  const isActive = searchParams.get("isActive");
  if (isActive !== null) {
    query.isActive = isActive === "true";
  }
  
  // Sorting
  const sort = searchParams.get("sort") || "-createdAt";
  
  // Execute query
  const [products, total] = await Promise.all([
    Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(query)
  ]);
  
  return NextResponse.json({
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }
  });
}
```

---

## 📝 Request Body Handling

### JSON Body

```typescript
export async function POST(req: NextRequest) {
  try {
    // Parse JSON body
    const body = await req.json();
    
    // Destructure expected fields
    const { name, price, category, description } = body;
    
    // Validate required fields
    if (!name || !price) {
      return NextResponse.json(
        { error: "Name and price are required" },
        { status: 400 }
      );
    }
    
    // Create product
    const product = await Product.create({
      name,
      price,
      category,
      description
    });
    
    return NextResponse.json(
      { success: true, product },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }
}
```

### FormData (File Uploads)

```typescript
export async function POST(req: NextRequest) {
  // Parse form data
  const formData = await req.formData();
  
  // Get text fields
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  
  // Get file
  const file = formData.get("image") as File | null;
  
  if (file) {
    // Convert to buffer for upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Upload to Cloudinary or save locally
    const result = await uploadToCloudinary(buffer);
    
    return NextResponse.json({
      success: true,
      url: result.secure_url
    });
  }
  
  return NextResponse.json(
    { error: "No file provided" },
    { status: 400 }
  );
}
```

---

## 🔌 API Middleware Pattern

### The withValidate Higher-Order Function

This project uses a middleware pattern to wrap API handlers:

```typescript
// src/lib/api-middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { ZodSchema } from "zod";
import { handleApiError, AppError } from "@/lib/errors";
import { RateLimiter, publicApiLimiter } from "@/lib/rate-limit";
import { verifyAuth, verifyAdmin } from "@/lib/auth";

interface MiddlewareOptions {
  schema?: ZodSchema;           // Zod schema for validation
  limiter?: RateLimiter;        // Rate limiter instance
  requireAuth?: boolean;        // Require authentication
  requireAdmin?: boolean;       // Require admin role
}

export function withValidate(
  handler: (req: NextRequest, validatedData: any) => Promise<NextResponse>,
  options: MiddlewareOptions = {}
) {
  return async (req: NextRequest) => {
    try {
      // 1. Auth Check (if required)
      if (options.requireAdmin) {
        await verifyAdmin(req);
      } else if (options.requireAuth) {
        await verifyAuth(req);
      }

      // 2. Rate Limiting
      const ip = req.headers.get("x-forwarded-for") || "anonymous";
      const limiter = options.limiter || publicApiLimiter;
      
      if (!limiter.check(ip)) {
        throw new AppError("Too many requests", 429);
      }

      // 3. Body Validation (if schema provided)
      let validatedData = null;
      if (options.schema) {
        if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
          const body = await req.json();
          validatedData = options.schema.parse(body);
        }
      }

      // 4. Call actual handler
      const response = await handler(req, validatedData);

      // 5. Add Rate Limit Headers
      response.headers.set("X-RateLimit-Limit", String(limiter.limit));
      response.headers.set("X-RateLimit-Remaining", String(limiter.getRemaining(ip)));

      return response;
    } catch (error) {
      return handleApiError(error);
    }
  };
}
```

### Using the Middleware

```typescript
// src/app/api/products/route.ts
import { withValidate } from "@/lib/api-middleware";
import { productSchema } from "@/lib/validations";
import { publicApiLimiter } from "@/lib/rate-limit";

// Public endpoint - only rate limiting
export const GET = withValidate(
  async (req: NextRequest) => {
    const products = await Product.find();
    return NextResponse.json({ products });
  },
  { limiter: publicApiLimiter }
);

// Admin endpoint - auth + validation
export const POST = withValidate(
  async (req: NextRequest, validatedData) => {
    // validatedData is already validated by productSchema
    const product = await Product.create(validatedData);
    return NextResponse.json({ product }, { status: 201 });
  },
  {
    schema: productSchema,     // Validate body
    requireAdmin: true         // Require admin authentication
  }
);
```

---

## ⚠️ Error Handling

### Custom Error Classes

```typescript
// src/lib/errors.ts

// Base application error
export class AppError extends Error {
  constructor(
    public message: string, 
    public statusCode: number = 400
  ) {
    super(message);
    this.name = "AppError";
  }
}

// Specific error types
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = "ValidationError";
  }
}

export class AuthError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
    this.name = "AuthError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}
```

### Centralized Error Handler

```typescript
// src/lib/errors.ts
import { ZodError } from "zod";
import { logger } from "@/lib/logger";

export function handleApiError(error: any) {
  // Log the error
  logger.error({ err: error }, "API Error Occurred");

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

  // Default server error
  return NextResponse.json(
    { success: false, message: "Internal Server Error" },
    { status: 500 }
  );
}
```

### Using Errors in Handlers

```typescript
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = await Product.findById(params.id);
  
  if (!product) {
    throw new NotFoundError("Product not found");
  }
  
  return NextResponse.json({ product });
}
```

---

## ⏱️ Rate Limiting

### Rate Limiter Class

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
    public limit: number,           // Max requests
    public windowMs: number         // Time window in ms
  ) {}

  check(ip: string): boolean {
    const now = Date.now();
    const record = this.store[ip];

    // No record or expired - create new
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
export const authLimiter = new RateLimiter(10, 60 * 1000);        // 10/min
export const uploadLimiter = new RateLimiter(20, 60 * 1000);      // 20/min
```

---

## 🔐 Authentication in APIs

### Verifying Authentication

```typescript
// src/lib/auth.ts
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { AuthError, ForbiddenError } from "./errors";

export async function verifyAuth(req: NextRequest) {
  // Get token from cookie
  const token = req.cookies.get("auth-token")?.value;
  
  if (!token) {
    throw new AuthError("Authentication required");
  }
  
  try {
    // Verify JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    return payload;  // { userId, email, role, ... }
  } catch {
    throw new AuthError("Invalid or expired token");
  }
}

export async function verifyAdmin(req: NextRequest) {
  const payload = await verifyAuth(req);
  
  if (payload.role !== "admin") {
    throw new ForbiddenError("Admin access required");
  }
  
  return payload;
}
```

### Protected Route Example

```typescript
// Admin-only endpoint
export const DELETE = withValidate(
  async (req: NextRequest, _validatedData, { params }) => {
    await connectDB();
    
    const product = await Product.findByIdAndDelete(params.id);
    
    if (!product) {
      throw new NotFoundError("Product not found");
    }
    
    return NextResponse.json({ message: "Product deleted" });
  },
  { requireAdmin: true }
);
```

---

## 📋 Complete API Example

### Full Products API

```typescript
// src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Product from "@/lib/db/models/Product";
import Category from "@/lib/db/models/Category";
import { productSchema } from "@/lib/validations";
import { handleApiError, successResponse, NotFoundError } from "@/lib/errors";
import { withValidate } from "@/lib/api-middleware";
import { publicApiLimiter } from "@/lib/rate-limit";
import { sanitizeHtml } from "@/lib/utils";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * GET /api/products
 * Public endpoint - List products with filtering and pagination
 */
export const GET = withValidate(
  async (req: NextRequest) => {
    await connectDB();

    const { searchParams } = new URL(req.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const categorySlug = searchParams.get("category");
    const search = searchParams.get("search");
    const isActive = searchParams.get("isActive");
    const sort = searchParams.get("sort") || "-createdAt";

    // Build query
    const query: any = {};

    // Category filter
    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug });
      if (category) {
        query.category = category._id;
      }
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    // Active filter
    if (isActive !== null) {
      query.isActive = isActive === "true";
    }

    const skip = (page - 1) * limit;

    // Execute query with population
    const [products, total] = await Promise.all([
      Product.find(query)
        .populate("category", "name slug")
        .populate("brand", "name slug logo")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    return successResponse({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  },
  { limiter: publicApiLimiter }
);

/**
 * POST /api/products
 * Admin endpoint - Create new product
 */
export const POST = withValidate(
  async (req: NextRequest, validatedData) => {
    await connectDB();

    // Sanitize HTML content
    if (validatedData.description) {
      validatedData.description = sanitizeHtml(validatedData.description);
    }

    // Create product
    const product = await Product.create(validatedData);
    
    // Populate references
    await product.populate("category", "name slug");

    return successResponse(
      { product }, 
      201, 
      "Product created successfully"
    );
  },
  {
    schema: productSchema,
    requireAdmin: true
  }
);
```

### Success Response Helper

```typescript
// src/lib/errors.ts
export function successResponse(
  data: any, 
  status: number = 200, 
  message?: string
) {
  return NextResponse.json(
    {
      success: true,
      ...(message && { message }),
      ...data
    },
    { status }
  );
}
```

```

---

## ⚡ Real-time Data Consistency

### The `force-dynamic` Directive
For critical admin pages where data must always be fresh (e.g., product stock, inquiries, settings), we use the `force-dynamic` export. This prevents Next.js from caching the API response during build time or at the edge.

```typescript
// src/app/api/products/[slug]/route.ts
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  // Always fetches fresh data from MongoDB
  await connectDB();
  // ...
}
```

### Dynamic Settings & Profile Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/settings` | **GET** | Retrieve site settings (favicon, logos, contact) |
| `/api/settings` | **PUT** | Update site settings (Admin only) |
| `/api/users/profile` | **GET** | Retrieve current user's profile |
| `/api/users/profile` | **PATCH** | Update current user's details/avatar |

---

## 📊 HTTP Status Codes Reference

| Code | Name | Usage |
|------|------|-------|
| **200** | OK | Successful GET, PUT, PATCH |
| **201** | Created | Successful POST |
| **204** | No Content | Successful DELETE |
| **400** | Bad Request | Validation error |
| **401** | Unauthorized | Authentication required |
| **403** | Forbidden | Insufficient permissions |
| **404** | Not Found | Resource doesn't exist |
| **409** | Conflict | Duplicate entry |
| **429** | Too Many Requests | Rate limit exceeded |
| **500** | Internal Server Error | Unexpected error |

---

## 📚 Next Steps

Now that you understand API development:

→ **Next**: [09 - Database & MongoDB](./09-DATABASE-MONGODB.md) - Learn database operations

---

*Happy API Building! 🚀*
