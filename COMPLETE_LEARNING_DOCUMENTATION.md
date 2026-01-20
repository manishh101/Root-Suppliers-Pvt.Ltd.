# 📚 Root Suppliers - Complete Learning Documentation

> **A Comprehensive Guide for Interns & Developers to Learn Full-Stack Web Development**

---

## 📖 Table of Contents

1. [Introduction](#-introduction)
2. [What Will You Learn?](#-what-will-you-learn)
3. [Project Overview](#-project-overview)
4. [Technology Stack Explained](#-technology-stack-explained)
5. [Project Architecture](#-project-architecture)
6. [Frontend Development](#-frontend-development)
7. [Backend Development](#-backend-development)
8. [Database Design](#-database-design)
9. [Authentication & Security](#-authentication--security)
10. [API Design & REST Principles](#-api-design--rest-principles)
11. [State Management](#-state-management)
12. [Styling & UI Components](#-styling--ui-components)
13. [Form Handling & Validation](#-form-handling--validation)
14. [File Upload & Image Management](#-file-upload--image-management)
15. [Code Organization & Best Practices](#-code-organization--best-practices)
16. [System Design Concepts](#-system-design-concepts)
17. [Development Workflow](#-development-workflow)
18. [Hands-On Exercises](#-hands-on-exercises)
19. [Further Learning Resources](#-further-learning-resources)

---

## 🎯 Introduction

Welcome to the Root Suppliers codebase! This is a **production-ready** e-commerce/product catalog website built for a hardware company in Nepal. This documentation is designed to help you understand:

- **Real-world web development** practices
- **Full-stack architecture** using modern technologies
- **Best practices** for code organization, security, and performance
- **System design** principles applied in practice

### Who Is This For?

- 🎓 **Interns** learning web development
- 👨‍💻 **Junior developers** wanting to understand production codebases
- 📚 **Students** studying full-stack development
- 🔄 **Career switchers** learning modern web technologies

---

## 🎓 What Will You Learn?

By studying this codebase, you will gain practical knowledge in:

### Frontend Skills
- ✅ React.js & Next.js 14 (App Router)
- ✅ TypeScript for type-safe development
- ✅ Tailwind CSS for modern styling
- ✅ Component-based architecture
- ✅ Client-side form handling
- ✅ Animations with Framer Motion

### Backend Skills
- ✅ RESTful API design
- ✅ Server-side rendering (SSR)
- ✅ Authentication with JWT
- ✅ Database operations with MongoDB
- ✅ File upload handling
- ✅ Middleware patterns

### Database Skills
- ✅ MongoDB schema design
- ✅ Mongoose ODM (Object Document Mapper)
- ✅ Relationships between collections
- ✅ Indexing and query optimization

### DevOps & Tools
- ✅ Environment variables management
- ✅ Package management with pnpm
- ✅ ESLint & Prettier configuration
- ✅ Git workflow

---

## 📋 Project Overview

### What Does This Website Do?

**Root Suppliers Pvt. Ltd.** is a hardware company that needed:

1. **Product Catalog** - Display their products online
2. **Category Management** - Organize products into categories
3. **Blog Section** - Share news and articles
4. **Contact Form** - Receive customer inquiries
5. **Admin Panel** - Manage all content

### Key Features

| Feature | Description | Technologies Used |
|---------|-------------|-------------------|
| **Homepage** | Hero carousel, featured products, categories | React, Framer Motion, Embla Carousel |
| **Products** | List, filter, search, detail pages | Next.js SSR, MongoDB queries |
| **Categories** | Hierarchical categories with parent-child | MongoDB, recursive queries |
| **Blog** | Rich text blog posts with images | TipTap editor, Cloudinary |
| **Contact** | Inquiry form with validation | React Hook Form, Zod |
| **Admin Panel** | Full CRUD for all content | Protected routes, JWT auth |
| **Authentication** | Login, logout, session management | JWT, HTTP-only cookies |

---

## 🛠️ Technology Stack Explained

### Why These Technologies?

Let's understand why each technology was chosen:

### Frontend Stack

#### 1. **Next.js 14** (React Framework)
```
📁 Location: package.json → "next": "^14.2.35"
```

**What is it?**
- A React framework that adds server-side rendering, routing, and more
- Created by Vercel

**Why use it?**
- 🚀 **Performance**: Pages load faster with server-side rendering
- 📁 **File-based routing**: Create a file = Create a route
- 🔄 **API Routes**: Build backend within the same project
- 🔍 **SEO friendly**: Server-rendered content is better for search engines

**Example in this project:**
```
src/app/(public)/products/page.tsx  →  /products
src/app/(public)/products/[slug]/page.tsx  →  /products/electric-drill
src/app/api/products/route.ts  →  /api/products
```

#### 2. **TypeScript**
```
📁 Location: tsconfig.json, all .ts and .tsx files
```

**What is it?**
- JavaScript with types
- Catches errors before runtime

**Why use it?**
```typescript
// Without TypeScript (JavaScript)
function addProduct(product) {
  // What properties does product have? 🤷
}

// With TypeScript
interface Product {
  name: string;
  price: number;
  category: string;
}

function addProduct(product: Product) {
  // IDE tells you exactly what's available! ✅
}
```

**Example from this project:**
```typescript
// src/lib/db/models/Product.ts
export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: mongoose.Types.ObjectId;
  images: {
    url: string;
    publicId: string;
    alt: string;
  }[];
  // ... more fields
}
```

#### 3. **Tailwind CSS**
```
📁 Location: tailwind.config.ts, src/app/globals.css
```

**What is it?**
- Utility-first CSS framework
- Instead of writing CSS classes, use utility classes directly in HTML

**Traditional CSS vs Tailwind:**
```css
/* Traditional CSS */
.button {
  background-color: blue;
  padding: 10px 20px;
  border-radius: 8px;
  color: white;
}
```

```html
<!-- Tailwind CSS -->
<button class="bg-blue-500 px-5 py-2 rounded-lg text-white">
  Click me
</button>
```

**Custom colors in this project:**
```typescript
// tailwind.config.ts
colors: {
  primary: {
    600: "#C41E3A",  // Cardinal Red - Main brand color
  },
  secondary: {
    600: "#1E3A8A",  // Navy Blue
  }
}
```

### Backend Stack

#### 4. **MongoDB Atlas**
```
📁 Location: src/lib/db/connect.ts
```

**What is it?**
- NoSQL database (stores documents, not tables)
- MongoDB Atlas = Cloud-hosted MongoDB

**SQL vs MongoDB:**
```
SQL (Relational):           MongoDB (Document):
┌─────────────────┐         ┌─────────────────────────────┐
│ Products Table  │         │ Products Collection         │
├─────────────────┤         ├─────────────────────────────┤
│ id | name | ... │         │ {                           │
│ 1  | Drill| ... │         │   _id: "...",               │
│ 2  | Hammer|... │         │   name: "Drill",            │
└─────────────────┘         │   specifications: [...]     │
                            │ }                           │
                            └─────────────────────────────┘
```

**Why MongoDB for this project?**
- ✅ **Flexible schema**: Products can have different specifications
- ✅ **Nested data**: Store arrays and objects directly
- ✅ **Easy to scale**: Great for web applications
- ✅ **JSON-like documents**: Works naturally with JavaScript

#### 5. **Mongoose ODM**
```
📁 Location: src/lib/db/models/*.ts
```

**What is it?**
- Object Document Mapper for MongoDB
- Provides schema validation, type casting, and query building

**Example:**
```typescript
// Without Mongoose (raw MongoDB)
db.collection('products').insertOne({
  name: "Drill",
  price: "not a number"  // Oops! No validation
});

// With Mongoose
const ProductSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, min: 0 }
});
// Automatically validates and throws error if invalid
```

---

## 🏗️ Project Architecture

### Folder Structure Explained

```
root-suppliers/
│
├── 📁 public/                    # Static files (images, fonts)
│   ├── fonts/                    # Custom fonts
│   └── images/                   # Static images
│
├── 📁 src/                       # All source code
│   │
│   ├── 📁 app/                   # Next.js App Router (Routes)
│   │   │
│   │   ├── 📁 (public)/          # Public pages (no auth needed)
│   │   │   ├── page.tsx          # Homepage (/)
│   │   │   ├── about/page.tsx    # About page (/about)
│   │   │   ├── products/         # Products pages
│   │   │   ├── categories/       # Category pages
│   │   │   ├── blogs/            # Blog pages
│   │   │   └── contact/          # Contact page
│   │   │
│   │   ├── 📁 (admin)/           # Admin pages (auth required)
│   │   │   └── admin/
│   │   │       ├── page.tsx      # Dashboard (/admin)
│   │   │       ├── login/        # Login page
│   │   │       ├── products/     # Product management
│   │   │       └── ...
│   │   │
│   │   ├── 📁 api/               # Backend API routes
│   │   │   ├── auth/             # Authentication endpoints
│   │   │   ├── products/         # Product CRUD
│   │   │   ├── categories/       # Category CRUD
│   │   │   └── ...
│   │   │
│   │   ├── layout.tsx            # Root layout (wraps all pages)
│   │   ├── globals.css           # Global styles
│   │   └── fonts/                # Font files
│   │
│   ├── 📁 components/            # Reusable React components
│   │   ├── ui/                   # Basic UI (Button, Input, Card)
│   │   ├── sections/             # Page sections (Hero, Features)
│   │   ├── forms/                # Form components
│   │   ├── cards/                # Card components
│   │   └── layout/               # Layout components (Header, Footer)
│   │
│   ├── 📁 lib/                   # Utility functions & configs
│   │   ├── db/                   # Database connection & models
│   │   │   ├── connect.ts        # MongoDB connection
│   │   │   └── models/           # Mongoose schemas
│   │   ├── validations/          # Zod validation schemas
│   │   ├── auth.ts               # Authentication helpers
│   │   ├── errors.ts             # Error handling
│   │   ├── utils.ts              # Utility functions
│   │   └── cloudinary.ts         # Image upload config
│   │
│   ├── 📁 contexts/              # React Context providers
│   │   └── SettingsContext.tsx   # Global settings
│   │
│   ├── 📁 types/                 # TypeScript type definitions
│   │   └── api.ts                # API response types
│   │
│   └── middleware.ts             # Next.js middleware (runs on every request)
│
├── 📁 scripts/                   # Database seeding & test scripts
│
├── package.json                  # Dependencies & scripts
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── .env.local                    # Environment variables (secrets)
```

### Route Groups Explained

Next.js uses **route groups** (folders in parentheses) to organize routes:

```
src/app/
├── (public)/          # Grouped but doesn't affect URL
│   └── products/      # URL: /products (not /public/products)
└── (admin)/           # Grouped but doesn't affect URL
    └── admin/         # URL: /admin (not /admin/admin)
```

**Why use route groups?**
- Different layouts for public vs admin pages
- Different middleware/authentication
- Organized code without affecting URLs

---

## 🎨 Frontend Development

### Understanding React Components

**What is a Component?**
A reusable piece of UI. Like LEGO blocks for websites.

```tsx
// Simple Button Component
function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="bg-blue-500 text-white px-4 py-2">
      {children}
    </button>
  );
}

// Usage
<Button onClick={() => alert('Clicked!')}>Click Me</Button>
```

### Component Types in This Project

#### 1. **UI Components** (src/components/ui/)
Basic, reusable building blocks:

```tsx
// src/components/ui/Button.tsx
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? <Spinner /> : children}
      </button>
    );
  }
);
```

**Key Concepts:**
- `forwardRef`: Allows parent to access the button element
- `VariantProps`: Type-safe variants (primary, secondary, outline)
- `cn()`: Utility to merge Tailwind classes

#### 2. **Section Components** (src/components/sections/)
Larger, page-specific sections:

```tsx
// src/components/sections/FeaturedProducts.tsx
export function FeaturedProducts({ products }) {
  return (
    <section className="py-16">
      <h2>Featured Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
```

#### 3. **Page Components** (src/app/**/page.tsx)
Full pages that fetch data:

```tsx
// src/app/(public)/page.tsx (Homepage)
export default async function Home() {
  // Server-side data fetching
  const topProducts = await getTopProducts();
  const categories = await getCategories();
  
  return (
    <>
      <HeroCarousel topProducts={topProducts} />
      <FeaturedProducts products={topProducts} />
      <CategoriesSection categories={categories} />
    </>
  );
}
```

### Server Components vs Client Components

**🖥️ Server Components (Default in Next.js 14)**
- Render on the server
- Can directly fetch data from database
- Cannot use `useState`, `useEffect`, or event handlers

```tsx
// This is a Server Component (default)
async function ProductPage() {
  const products = await Product.find();  // Direct DB access!
  return <ProductList products={products} />;
}
```

**💻 Client Components**
- Render on the client (browser)
- Can use hooks and interactivity
- Must add `"use client"` at the top

```tsx
"use client";  // 👈 Required for client components

import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
```

### Data Fetching Patterns

#### Pattern 1: Server Component (Recommended)
```tsx
// Fetches data on the server, before sending HTML to client
async function ProductsPage() {
  const products = await fetch('/api/products').then(r => r.json());
  return <ProductList products={products} />;
}
```

#### Pattern 2: Client-side with useEffect
```tsx
"use client";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => setProducts(data.products));
  }, []);
  
  return <ProductList products={products} />;
}
```

#### Pattern 3: Direct Database Access (Server Only)
```tsx
// Only works in Server Components
async function ProductsPage() {
  await connectDB();
  const products = await Product.find({ isActive: true }).lean();
  return <ProductList products={products} />;
}
```

---

## 🔧 Backend Development

### API Routes in Next.js

API routes let you build your backend within the same project:

```
src/app/api/
├── products/
│   ├── route.ts          # GET /api/products, POST /api/products
│   └── [slug]/
│       └── route.ts      # GET/PUT/DELETE /api/products/:slug
├── auth/
│   ├── login/route.ts    # POST /api/auth/login
│   ├── logout/route.ts   # POST /api/auth/logout
│   └── session/route.ts  # GET /api/auth/session
```

### Anatomy of an API Route

```typescript
// src/app/api/products/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Product from "@/lib/db/models/Product";

// GET /api/products - Fetch all products
export async function GET(req: NextRequest) {
  try {
    // 1. Connect to database
    await connectDB();
    
    // 2. Get query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    
    // 3. Query database
    const products = await Product.find({ isActive: true })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    
    // 4. Return response
    return NextResponse.json({
      success: true,
      products,
      pagination: { page, limit }
    });
    
  } catch (error) {
    // 5. Handle errors
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// POST /api/products - Create new product (Admin only)
export async function POST(req: NextRequest) {
  try {
    // 1. Verify authentication
    const user = await verifyAdmin(req);
    
    // 2. Parse request body
    const body = await req.json();
    
    // 3. Validate data
    const validated = productSchema.parse(body);
    
    // 4. Create product
    const product = await Product.create(validated);
    
    // 5. Return success
    return NextResponse.json({
      success: true,
      product
    }, { status: 201 });
    
  } catch (error) {
    return handleApiError(error);
  }
}
```

### HTTP Methods Explained

| Method | Purpose | Example |
|--------|---------|---------|
| `GET` | Read data | Get list of products |
| `POST` | Create new | Create new product |
| `PUT` | Update (replace) | Update entire product |
| `PATCH` | Update (partial) | Update just the price |
| `DELETE` | Remove | Delete a product |

### Middleware Pattern

Middleware runs before your route handlers:

```typescript
// src/lib/api-middleware.ts

export function withValidate(
  handler: (req: NextRequest, data: any) => Promise<NextResponse>,
  options: MiddlewareOptions = {}
) {
  return async (req: NextRequest) => {
    try {
      // 1. Check authentication
      if (options.requireAdmin) {
        await verifyAdmin(req);
      }
      
      // 2. Rate limiting
      if (!limiter.check(ip)) {
        throw new AppError("Too many requests", 429);
      }
      
      // 3. Validate request body
      let validatedData = null;
      if (options.schema && (req.method === "POST" || req.method === "PUT")) {
        const body = await req.json();
        validatedData = options.schema.parse(body);
      }
      
      // 4. Call actual handler
      return await handler(req, validatedData);
      
    } catch (error) {
      return handleApiError(error);
    }
  };
}
```

**Usage:**
```typescript
// Before: Manual validation in every route
export async function POST(req: NextRequest) {
  const user = await verifyAdmin(req);
  const body = await req.json();
  const validated = productSchema.parse(body);
  // ... create product
}

// After: Using middleware
export const POST = withValidate(
  async (req, validatedData) => {
    // validatedData is already validated!
    // Authentication already checked!
    const product = await Product.create(validatedData);
    return successResponse({ product }, 201);
  },
  { schema: productSchema, requireAdmin: true }
);
```

---

## 💾 Database Design

### MongoDB Collections

This project has the following collections:

```
📁 Database: root-suppliers
├── 📄 users           # Admin users
├── 📄 products        # Product catalog
├── 📄 categories      # Product categories
├── 📄 brands          # Brand information
├── 📄 blogs           # Blog posts
├── 📄 inquiries       # Contact form submissions
├── 📄 testimonials    # Customer reviews
├── 📄 settings        # Site settings
└── 📄 auditlogs       # Activity tracking
```

### Schema Design Example

```typescript
// src/lib/db/models/Product.ts

const ProductSchema = new Schema<IProduct>(
  {
    // Basic fields
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    
    // Auto-generated slug for URLs
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    
    // Reference to another collection (Foreign Key equivalent)
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",  // Links to Category collection
      required: true,
      index: true,      // Creates index for faster queries
    },
    
    // Array of embedded documents
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        alt: String,
      },
    ],
    
    // Array of key-value pairs
    specifications: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    
    // Number with validation
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    
    // Boolean flags
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,  // Adds createdAt and updatedAt automatically
  }
);
```

### Relationships Between Collections

```
┌─────────────┐      ┌─────────────┐
│  Category   │◄────▶│   Product   │
└─────────────┘      └─────────────┘
       │                    │
       │                    │
       ▼                    ▼
┌─────────────┐      ┌─────────────┐
│  Category   │      │    Brand    │
│  (Parent)   │      └─────────────┘
└─────────────┘
```

**Populating References:**
```typescript
// Get product with category and brand details
const product = await Product.findOne({ slug: "electric-drill" })
  .populate("category", "name slug")  // Include category name and slug
  .populate("brand", "name logo");    // Include brand name and logo
```

### Common Query Patterns

```typescript
// 1. Find all active products
const products = await Product.find({ isActive: true });

// 2. Find with pagination
const products = await Product.find()
  .skip((page - 1) * limit)
  .limit(limit)
  .sort({ createdAt: -1 });  // Newest first

// 3. Search in multiple fields
const products = await Product.find({
  $or: [
    { name: { $regex: searchTerm, $options: "i" } },
    { description: { $regex: searchTerm, $options: "i" } },
  ]
});

// 4. Count documents
const totalProducts = await Product.countDocuments({ isActive: true });

// 5. Aggregation (complex queries)
const categoryStats = await Product.aggregate([
  { $group: { _id: "$category", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);
```

---

## 🔐 Authentication & Security

### How Authentication Works

```
┌──────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                            │
└──────────────────────────────────────────────────────────────────┘

User enters email & password
         │
         ▼
┌─────────────────────────────────────┐
│  POST /api/auth/login               │
│  ─────────────────────────────────  │
│  1. Find user by email in MongoDB   │
│  2. Compare password with bcrypt    │
│  3. Generate JWT token              │
│  4. Set HTTP-only cookie            │
└─────────────────────────────────────┘
         │
         ▼
User is redirected to /admin
         │
         ▼
┌─────────────────────────────────────┐
│  Every admin page load:             │
│  ─────────────────────────────────  │
│  1. Middleware reads cookie         │
│  2. Verifies JWT signature          │
│  3. If valid → allow access         │
│  4. If invalid → redirect to login  │
└─────────────────────────────────────┘
```

### JWT (JSON Web Token) Explained

```
┌─────────────────────────────────────────────────────────────────┐
│                        JWT STRUCTURE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.                          │
│  eyJ1c2VySWQiOiI2NWEyYjNjNGQ1ZTZmNyIsImVtYWlsIjoiYWRtaW5AZXhh... │
│  SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c                    │
│                                                                  │
│  └──────┬──────┘ └──────────────┬──────────────┘ └─────┬─────┘  │
│       Header                 Payload               Signature     │
│                                                                  │
│  Header: Algorithm used (HS256)                                  │
│  Payload: User data (userId, email, role)                        │
│  Signature: Verifies token wasn't tampered with                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Password Security with bcrypt

```typescript
// When user registers or changes password
const salt = await bcrypt.genSalt(12);  // Generate random salt
const hashedPassword = await bcrypt.hash(password, salt);
// Stored: $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY.5MRhHQNxLgWm

// When user logs in
const isMatch = await bcrypt.compare(enteredPassword, hashedPassword);
// Returns true if password matches
```

**Why bcrypt?**
- Passwords are never stored in plain text
- Even if database is hacked, passwords can't be read
- Salt prevents rainbow table attacks

### HTTP-Only Cookies

```typescript
// Setting the cookie
response.cookies.set("auth-token", jwtToken, {
  httpOnly: true,     // JavaScript cannot access this cookie
  secure: true,       // Only sent over HTTPS
  sameSite: "strict", // Prevents CSRF attacks
  maxAge: 7 * 24 * 60 * 60,  // 7 days
});
```

**Why HTTP-Only?**
```javascript
// If a hacker injects JavaScript (XSS attack):
document.cookie  // Cannot read HTTP-only cookies!
                 // Your token is safe!
```

### Middleware Protection

```typescript
// src/middleware.ts

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protect all /admin routes except /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get("auth-token")?.value;
    
    // No token? Redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    
    try {
      // Verify token is valid
      await jwtVerify(token, JWT_SECRET);
    } catch {
      // Invalid token? Redirect to login
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }
  
  // Add security headers to all responses
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  
  return response;
}
```

### Role-Based Access Control (RBAC)

```typescript
// User roles
type Role = "admin" | "editor";

// Permissions
const permissions = {
  admin: ["products", "categories", "blogs", "users", "settings"],
  editor: ["products", "categories", "blogs"],
};

// Checking permissions
function hasRole(user: AuthUser | null, allowedRoles: string[]): boolean {
  if (!user) return false;
  return allowedRoles.includes(user.role);
}

// In API route
export async function DELETE(req: NextRequest) {
  const user = await verifyAuth(req);
  
  if (user.role !== "admin") {
    throw new ForbiddenError("Only admins can delete");
  }
  
  // ... delete operation
}
```

---

## 🌐 API Design & REST Principles

### REST API Conventions

REST (Representational State Transfer) is an architecture style for APIs:

```
┌─────────────────────────────────────────────────────────────────┐
│                    REST PRINCIPLES                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Resources are nouns (products, users, categories)            │
│  2. HTTP methods are verbs (GET, POST, PUT, DELETE)              │
│  3. Stateless - each request contains all info needed            │
│  4. Consistent URL structure                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### API Endpoints in This Project

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/products` | List all products | No |
| `GET` | `/api/products/:slug` | Get single product | No |
| `POST` | `/api/products` | Create product | Admin |
| `PUT` | `/api/products/:slug` | Update product | Admin |
| `DELETE` | `/api/products/:slug` | Delete product | Admin |
| `POST` | `/api/auth/login` | User login | No |
| `POST` | `/api/auth/logout` | User logout | Yes |
| `GET` | `/api/auth/session` | Get current user | Yes |

### Request/Response Format

```typescript
// Request (Create Product)
POST /api/products
Content-Type: application/json
Cookie: auth-token=...

{
  "name": "Electric Drill Pro",
  "description": "Professional grade electric drill",
  "category": "power-tools",
  "price": 4999,
  "images": [
    { "url": "...", "publicId": "...", "alt": "Drill" }
  ]
}

// Success Response
{
  "success": true,
  "product": {
    "_id": "...",
    "name": "Electric Drill Pro",
    "slug": "electric-drill-pro",
    ...
  },
  "message": "Product created successfully"
}

// Error Response
{
  "success": false,
  "message": "Validation error: name is required"
}
```

### Query Parameters for Filtering

```
GET /api/products?page=1&limit=12&category=power-tools&search=drill&sort=-createdAt

Parameters:
├── page=1         → Pagination (page number)
├── limit=12       → Items per page
├── category=...   → Filter by category
├── search=drill   → Search term
└── sort=-createdAt → Sort by field (- for descending)
```

### Pagination Response

```json
{
  "success": true,
  "products": [...],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 150,
    "totalPages": 13,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## 📊 State Management

### Why State Management?

When multiple components need to share data, we need state management:

```
Without State Management:
┌─────────┐    ┌─────────┐    ┌─────────┐
│ Header  │    │ Sidebar │    │ Content │
│ (user?) │    │ (user?) │    │ (user?) │
└─────────┘    └─────────┘    └─────────┘
    │              │              │
    └──────────────┴──────────────┘
           Fetch user 3 times? ❌

With State Management:
     ┌────────────────────┐
     │   Context/Store    │
     │   { user: {...} }  │
     └────────────────────┘
        │     │     │
    ┌───┴─┐ ┌─┴──┐ ┌┴────┐
    │Header│ │Side│ │Content│
    └─────┘ └────┘ └──────┘
         All get same data ✅
```

### React Context in This Project

```typescript
// src/contexts/SettingsContext.tsx

import { createContext, useContext, useState, useEffect } from "react";

interface Settings {
  siteName: string;
  logo: string;
  contactEmail: string;
  // ... more settings
}

const SettingsContext = createContext<Settings | null>(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  
  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => setSettings(data.settings));
  }, []);
  
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

// Custom hook for easy access
export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}
```

**Usage:**
```tsx
function Header() {
  const settings = useSettings();
  
  return (
    <header>
      <img src={settings.logo} alt={settings.siteName} />
    </header>
  );
}
```

---

## 🎨 Styling & UI Components

### Tailwind CSS Patterns

#### 1. Responsive Design
```html
<!-- Mobile first, then larger screens -->
<div class="
  grid 
  grid-cols-1      /* Mobile: 1 column */
  md:grid-cols-2   /* Tablet: 2 columns */
  lg:grid-cols-4   /* Desktop: 4 columns */
  gap-4
">
```

#### 2. Dark Mode (if implemented)
```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

#### 3. States and Animations
```html
<button class="
  bg-blue-500 
  hover:bg-blue-600      /* On hover */
  focus:ring-2           /* On focus */
  active:scale-95        /* On click */
  disabled:opacity-50    /* When disabled */
  transition-all         /* Smooth transitions */
">
```

### Component Variants with CVA

```typescript
// src/components/ui/Button.tsx

import { cva } from "class-variance-authority";

const buttonVariants = cva(
  // Base styles (always applied)
  "inline-flex items-center justify-center rounded-lg font-medium transition-all",
  {
    variants: {
      // Color variants
      variant: {
        primary: "bg-primary-600 text-white hover:bg-primary-700",
        secondary: "bg-secondary-600 text-white hover:bg-secondary-700",
        outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-50",
        ghost: "text-gray-700 hover:bg-gray-100",
        danger: "bg-red-600 text-white hover:bg-red-700",
      },
      // Size variants
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5 text-base",
        lg: "h-13 px-7 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

// Usage
<Button variant="secondary" size="lg">Large Secondary Button</Button>
```

### Utility Function for Classes

```typescript
// src/lib/utils.ts

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage
<div className={cn(
  "base-class",
  isActive && "active-class",
  className  // Allow parent to add classes
)} />
```

---

## 📝 Form Handling & Validation

### React Hook Form + Zod

```typescript
// 1. Define validation schema with Zod
const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  price: z.number().min(0, "Price cannot be negative"),
  description: z.string().min(10, "Description too short"),
  category: z.string().min(1, "Please select a category"),
});

type ProductFormData = z.infer<typeof productSchema>;

// 2. Create form component
function ProductForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });
  
  const onSubmit = async (data: ProductFormData) => {
    const response = await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
    // Handle response
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Product Name</label>
        <input {...register("name")} />
        {errors.name && <span className="text-red-500">{errors.name.message}</span>}
      </div>
      
      <div>
        <label>Price</label>
        <input type="number" {...register("price", { valueAsNumber: true })} />
        {errors.price && <span className="text-red-500">{errors.price.message}</span>}
      </div>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
}
```

### Validation on Both Frontend and Backend

```
┌─────────────────────────────────────────────────────────────────┐
│                     VALIDATION FLOW                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User fills form                                                 │
│       │                                                          │
│       ▼                                                          │
│  ┌─────────────────────────────┐                                │
│  │ Frontend Validation (Zod)   │ ← Fast feedback                │
│  │ Shows errors immediately    │                                 │
│  └─────────────────────────────┘                                │
│       │ If valid                                                 │
│       ▼                                                          │
│  ┌─────────────────────────────┐                                │
│  │ Backend Validation (Zod)    │ ← Security layer               │
│  │ Never trust frontend!       │                                 │
│  └─────────────────────────────┘                                │
│       │ If valid                                                 │
│       ▼                                                          │
│  ┌─────────────────────────────┐                                │
│  │ Database Validation         │ ← Schema constraints           │
│  │ (Mongoose validators)       │                                 │
│  └─────────────────────────────┘                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📸 File Upload & Image Management

### Cloudinary Integration

**What is Cloudinary?**
- Cloud-based image and video management
- Handles upload, storage, transformation, and CDN delivery

```typescript
// src/lib/cloudinary.ts

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file: Buffer, folder: string) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: `root-suppliers/${folder}`,
        resource_type: "image",
        transformation: [
          { width: 1200, height: 1200, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(file);
  });
}
```

### Image Upload Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     IMAGE UPLOAD FLOW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. User selects image file                                      │
│       │                                                          │
│       ▼                                                          │
│  2. Frontend previews image (FileReader)                         │
│       │                                                          │
│       ▼                                                          │
│  3. POST /api/upload (FormData with file)                        │
│       │                                                          │
│       ▼                                                          │
│  4. Backend receives file, uploads to Cloudinary                 │
│       │                                                          │
│       ▼                                                          │
│  5. Cloudinary returns:                                          │
│     - url: https://res.cloudinary.com/xxx/image/upload/v1/...   │
│     - publicId: root-suppliers/products/abc123                   │
│       │                                                          │
│       ▼                                                          │
│  6. Backend returns URL to frontend                              │
│       │                                                          │
│       ▼                                                          │
│  7. Frontend stores URL in form state                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Code Organization & Best Practices

### File Naming Conventions

```
Components:  PascalCase     → Button.tsx, ProductCard.tsx
Utilities:   camelCase      → utils.ts, formatDate.ts
Schemas:     kebab-case     → product.schema.ts
Constants:   SCREAMING_CASE → API_BASE_URL
```

### Import Organization

```typescript
// 1. External libraries
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

// 2. Internal modules
import { Button } from "@/components/ui";
import { productSchema } from "@/lib/validations";

// 3. Types
import type { Product } from "@/types";

// 4. Styles (if any)
import styles from "./ProductCard.module.css";
```

### Error Handling Pattern

```typescript
// src/lib/errors.ts

// Custom error classes for different scenarios
export class AppError extends Error {
  constructor(public message: string, public statusCode: number = 400) {
    super(message);
  }
}

export class AuthError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

// Centralized error handler
export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.statusCode }
    );
  }
  
  // Log unknown errors for debugging
  console.error("Unexpected error:", error);
  
  return NextResponse.json(
    { success: false, message: "Internal Server Error" },
    { status: 500 }
  );
}
```

---

## 🏛️ System Design Concepts

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    SYSTEM ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐    │
│   │   Browser    │────▶│   Vercel     │────▶│  MongoDB     │    │
│   │   (Client)   │◀────│   (Server)   │◀────│   Atlas      │    │
│   └──────────────┘     └──────────────┘     └──────────────┘    │
│                               │                                  │
│                               ▼                                  │
│                        ┌──────────────┐                         │
│                        │  Cloudinary  │                         │
│                        │  (Images)    │                         │
│                        └──────────────┘                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Request Flow

```
User Request: GET /products/electric-drill

1. Browser → Vercel Edge Network (CDN)
   ↓
2. Vercel → Next.js Server
   ↓
3. Next.js checks if cached → If yes, return cached response
   ↓
4. If not cached → Connect to MongoDB Atlas
   ↓
5. Query database for product
   ↓
6. Render React component with data
   ↓
7. Return HTML to browser
   ↓
8. Browser displays page
```

### Caching Strategies

```typescript
// Static pages - generated at build time
export const dynamic = "force-static";

// Dynamic pages - generated on each request
export const dynamic = "force-dynamic";

// Revalidate every 60 seconds
export const revalidate = 60;

// On-demand revalidation
revalidateTag("products");
```

### Database Connection Pooling

```typescript
// src/lib/db/connect.ts

// Problem: Opening new connection for every request is slow
// Solution: Connection pooling - reuse connections

let cached = global.mongoose || { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) {
    return cached.conn;  // Reuse existing connection!
  }
  
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,  // Keep up to 10 connections open
    });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}
```

### Rate Limiting

```typescript
// Prevent abuse by limiting requests per IP

class RateLimiter {
  private requests = new Map<string, { count: number; resetTime: number }>();
  
  constructor(
    private limit: number,      // Max requests
    private windowMs: number    // Time window
  ) {}
  
  check(identifier: string): boolean {
    const now = Date.now();
    const record = this.requests.get(identifier);
    
    if (!record || now > record.resetTime) {
      // Reset or create new record
      this.requests.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return true;
    }
    
    if (record.count >= this.limit) {
      return false;  // Rate limited!
    }
    
    record.count++;
    return true;
  }
}

// Usage
const loginLimiter = new RateLimiter(10, 60000);  // 10 attempts per minute
```

---

## 💻 Development Workflow

### Getting Started

```bash
# 1. Clone the repository
git clone <repository-url>
cd root-suppliers

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# 4. Run development server
pnpm dev

# 5. Open http://localhost:3000
```

### Environment Variables

```env
# .env.local

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/root-suppliers

# Authentication
NEXTAUTH_SECRET=your-super-secret-key-at-least-32-characters

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Available Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # Run ESLint
pnpm format     # Format code with Prettier
pnpm seed       # Seed database with sample data
```

### Database Seeding

```bash
# Seed admin user
pnpm tsx scripts/seed-admin.ts

# Seed sample categories and products
pnpm tsx scripts/seed-categories-products.ts

# Seed blog posts
pnpm tsx scripts/seed-blogs.ts
```

---

## 🎯 Hands-On Exercises

### Exercise 1: Add a New Field to Product

**Goal:** Add a `warranty` field to products

1. Update the Mongoose schema (`src/lib/db/models/Product.ts`)
2. Update the Zod validation schema (`src/lib/validations/product.schema.ts`)
3. Update the product form in admin panel
4. Update the product detail page to display warranty

### Exercise 2: Create a New API Endpoint

**Goal:** Create an endpoint to get featured products only

1. Create `src/app/api/products/featured/route.ts`
2. Query products where `isFeatured: true`
3. Return top 8 products
4. Test with Postman or browser

### Exercise 3: Add a New Page

**Goal:** Create a "Brands" page to list all brands

1. Create `src/app/(public)/brands/page.tsx`
2. Fetch brands from database
3. Display in a grid layout
4. Add link to header navigation

### Exercise 4: Implement Search

**Goal:** Add a search bar to the header

1. Create a `SearchBar` component
2. On submit, redirect to `/products?search=query`
3. Products page reads search param and filters

### Exercise 5: Add Loading States

**Goal:** Add skeleton loaders while data is loading

1. Create `ProductCardSkeleton` component
2. Use `Suspense` with skeleton as fallback
3. Test by adding artificial delay

---

## 📚 Further Learning Resources

### Official Documentation
- [Next.js Docs](https://nextjs.org/docs) - Framework documentation
- [React Docs](https://react.dev) - React library documentation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript guide
- [Tailwind CSS Docs](https://tailwindcss.com/docs) - CSS framework
- [MongoDB Manual](https://www.mongodb.com/docs/manual/) - Database documentation
- [Mongoose Docs](https://mongoosejs.com/docs/) - ODM documentation

### Video Courses
- [Next.js 14 Full Course](https://www.youtube.com/watch?v=wm5gMKuwSYk) - Free YouTube course
- [Full Stack Open](https://fullstackopen.com/) - Free comprehensive course
- [MongoDB University](https://university.mongodb.com/) - Free MongoDB courses

### Books
- "Learning React" by Alex Banks
- "Fullstack TypeScript" by David Rubio
- "MongoDB: The Definitive Guide" by Shannon Bradshaw

### Practice Platforms
- [Frontend Mentor](https://www.frontendmentor.io/) - Frontend challenges
- [LeetCode](https://leetcode.com/) - Algorithm practice
- [Exercism](https://exercism.org/) - Language learning

---

## 📝 Quick Reference

### Common Commands

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Build for production

# Database
pnpm tsx scripts/seed-admin.ts    # Create admin user

# Code Quality
pnpm lint                   # Check for errors
pnpm format                 # Format code
```

### Common File Locations

| What | Where |
|------|-------|
| Homepage | `src/app/(public)/page.tsx` |
| API Routes | `src/app/api/` |
| Components | `src/components/` |
| Database Models | `src/lib/db/models/` |
| Utility Functions | `src/lib/utils.ts` |
| Type Definitions | `src/types/` |
| Tailwind Config | `tailwind.config.ts` |

### Common Patterns

```typescript
// Fetch data in server component
async function Page() {
  const data = await fetchData();
  return <Component data={data} />;
}

// Use state in client component
"use client";
function Component() {
  const [state, setState] = useState(initial);
}

// API route pattern
export async function GET(req: NextRequest) {
  await connectDB();
  const data = await Model.find();
  return NextResponse.json({ success: true, data });
}
```

---

## 🎉 Conclusion

Congratulations on exploring this codebase! Here's what you've learned:

✅ **Frontend**: React, Next.js, TypeScript, Tailwind CSS
✅ **Backend**: API Routes, Authentication, Middleware
✅ **Database**: MongoDB, Mongoose, Schema Design
✅ **Security**: JWT, Password Hashing, Rate Limiting
✅ **Best Practices**: Code Organization, Error Handling, Validation

**Remember**: The best way to learn is by doing. Start with small modifications, experiment, break things, and fix them. That's how you become a great developer!

---

*Documentation created: January 20, 2026*
*Last updated: January 20, 2026*
