# 📚 05 - Next.js Deep Dive

> **Understanding Next.js 14 App Router Features**

---

## 📖 Table of Contents

1. [What is Next.js?](#what-is-nextjs)
2. [App Router vs Pages Router](#app-router-vs-pages-router)
3. [File-Based Routing](#file-based-routing)
4. [Server Components vs Client Components](#server-components-vs-client-components)
5. [Layouts and Templates](#layouts-and-templates)
6. [Data Fetching](#data-fetching)
7. [Loading and Error States](#loading-and-error-states)
8. [Metadata and SEO](#metadata-and-seo)
9. [API Routes](#api-routes)
10. [Middleware](#middleware)
11. [Image Optimization](#image-optimization)

---

## 🎯 What is Next.js?

Next.js is a React framework that adds powerful features on top of React:

```
React alone:                    Next.js adds:
├── Component system            ├── File-based routing
├── Virtual DOM                 ├── Server-side rendering
├── State management            ├── API routes
└── Basic rendering             ├── Image optimization
                                ├── Built-in CSS support
                                ├── Middleware
                                └── Much more!
```

### Why Next.js?

| Feature | Benefit |
|---------|---------|
| **Server-Side Rendering** | Faster initial page load, better SEO |
| **File-Based Routing** | No router configuration needed |
| **API Routes** | Build backend in the same project |
| **Automatic Code Splitting** | Only load what's needed |
| **Image Optimization** | Automatic image resizing and lazy loading |
| **Zero Configuration** | Works out of the box |

---

## 📁 App Router vs Pages Router

Next.js has two routing systems. This project uses the **App Router** (introduced in Next.js 13).

```
Pages Router (old):              App Router (new, used here):
pages/                           src/app/
├── index.tsx       → /          ├── page.tsx        → /
├── about.tsx       → /about     ├── about/
├── products/                    │   └── page.tsx    → /about
│   ├── index.tsx   → /products  ├── products/
│   └── [id].tsx    → /products/:id  │   ├── page.tsx    → /products
└── api/                         │   └── [slug]/
    └── hello.ts    → /api/hello │       └── page.tsx → /products/:slug
                                 └── api/
                                     └── products/
                                         └── route.ts → /api/products
```

### Key Differences

| Feature | Pages Router | App Router |
|---------|--------------|------------|
| Directory | `pages/` | `app/` |
| File name | `filename.tsx` = route | `page.tsx` inside folder |
| Layouts | `_app.tsx`, `_document.tsx` | `layout.tsx` (nested) |
| API routes | `pages/api/*.ts` | `app/api/*/route.ts` |
| Default rendering | Client | Server |
| Streaming | Limited | Full support |

---

## 🗂️ File-Based Routing

In Next.js, the file structure determines the URLs.

### Basic Routes

```
File:                               URL:
src/app/page.tsx                →   /
src/app/about/page.tsx          →   /about
src/app/contact/page.tsx        →   /contact
src/app/products/page.tsx       →   /products
src/app/products/new/page.tsx   →   /products/new
```

### Dynamic Routes

Use `[brackets]` for dynamic segments:

```
File:                                   URL:
src/app/products/[slug]/page.tsx    →   /products/drill-pro
                                    →   /products/hammer-x
                                    →   /products/anything
```

**Accessing the dynamic parameter:**
```tsx
// src/app/products/[slug]/page.tsx
export default async function ProductPage({
  params
}: {
  params: { slug: string }
}) {
  console.log(params.slug);  // "drill-pro"
  
  const product = await getProduct(params.slug);
  return <ProductDetail product={product} />;
}
```

### Catch-All Routes

Use `[...name]` to catch multiple segments:

```
File:                                   URL:
src/app/docs/[...slug]/page.tsx     →   /docs/intro
                                    →   /docs/getting-started/installation
                                    →   /docs/a/b/c/d
```

**Access:**
```tsx
// params.slug = ["a", "b", "c", "d"]
```

### Route Groups

Folders in `(parentheses)` don't affect the URL:

```
src/app/
├── (public)/                    # Group name doesn't appear in URL
│   ├── layout.tsx              # Public layout
│   ├── page.tsx                # /
│   └── products/page.tsx       # /products
│
└── (admin)/                     # Group name doesn't appear in URL
    ├── layout.tsx              # Admin layout
    └── admin/
        ├── page.tsx            # /admin
        └── products/page.tsx   # /admin/products
```

---

## 🖥️ Server Components vs Client Components

### Server Components (Default)

By default, all components in Next.js 14 are **Server Components**:

```tsx
// This is a Server Component (default)
// src/app/products/page.tsx

import connectDB from "@/lib/db/connect";
import Product from "@/lib/db/models/Product";

export default async function ProductsPage() {
  // ✅ Can use async/await directly
  await connectDB();
  
  // ✅ Can access database directly
  const products = await Product.find({ isActive: true }).lean();
  
  // ✅ Can use server-only code (env vars, file system)
  console.log(process.env.MONGODB_URI);  // Works!
  
  return (
    <div>
      {products.map(product => (
        <div key={product._id}>{product.name}</div>
      ))}
    </div>
  );
}
```

**Server Components CAN:**
- ✅ Fetch data directly from database
- ✅ Access server-only resources (file system, env vars)
- ✅ Keep sensitive logic on server
- ✅ Be async

**Server Components CANNOT:**
- ❌ Use `useState`, `useEffect`, or other hooks
- ❌ Use browser APIs (`window`, `document`)
- ❌ Use event handlers (`onClick`, `onChange`)

### Client Components

Add `"use client"` at the top for interactive components:

```tsx
"use client";  // 👈 This directive is required

import { useState, useEffect } from "react";

export function Counter() {
  // ✅ Can use hooks
  const [count, setCount] = useState(0);
  
  // ✅ Can use event handlers
  const increment = () => setCount(c => c + 1);
  
  // ✅ Can use browser APIs
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);
  
  return (
    <button onClick={increment}>
      Count: {count}
    </button>
  );
}
```

**Client Components CAN:**
- ✅ Use React hooks (`useState`, `useEffect`, etc.)
- ✅ Use event handlers
- ✅ Use browser APIs
- ✅ Be interactive

**Client Components CANNOT:**
- ❌ Use async/await directly in component
- ❌ Access server-only resources
- ❌ Import server-only modules

### Mixing Server and Client Components

```tsx
// Server Component (parent)
// src/app/products/page.tsx
import { ProductList } from "@/components/ProductList";
import Product from "@/lib/db/models/Product";

export default async function ProductsPage() {
  // Fetch on server
  const products = await Product.find().lean();
  
  // Pass to client component
  return <ProductList products={products} />;
}
```

```tsx
// Client Component (child)
// src/components/ProductList.tsx
"use client";

import { useState } from "react";

export function ProductList({ products }) {
  const [filter, setFilter] = useState("");
  
  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase())
  );
  
  return (
    <div>
      <input 
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Search..."
      />
      {filtered.map(p => <div key={p._id}>{p.name}</div>)}
    </div>
  );
}
```

### Decision Tree: Server or Client?

**Ask yourself these questions:**

| Question | If YES | If NO |
|----------|--------|-------|
| Does it need interactivity (clicks, typing)? | **Client Component** | Continue ↓ |
| Does it need hooks (useState, useEffect)? | **Client Component** | Continue ↓ |
| Does it need browser APIs (window, document)? | **Client Component** | Continue ↓ |
| None of the above? | — | **Server Component** ✅ |

**Quick Reference:**

| Use Server Component | Use Client Component |
|---------------------|---------------------|
| Fetching data | Forms with input |
| Accessing backend resources | onClick, onChange handlers |
| Keeping sensitive data safe | useState, useEffect |
| Large dependencies | Browser APIs (localStorage) |

---

## 📐 Layouts and Templates

### Layouts

Layouts wrap pages and persist across navigations:

```tsx
// src/app/layout.tsx (Root Layout)
import "./globals.css";

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
```

### Nested Layouts

```tsx
// src/app/(public)/layout.tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function PublicLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
```

```tsx
// src/app/(admin)/admin/layout.tsx
import { Sidebar } from "@/components/layout/Sidebar";
import { AdminNavbar } from "@/components/layout/AdminNavbar";

export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <AdminNavbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
```

### How Layouts Nest

```
Request to /admin/products

Root Layout (src/app/layout.tsx)
  └── Admin Layout (src/app/(admin)/admin/layout.tsx)
        └── Products Page (src/app/(admin)/admin/products/page.tsx)
```

---

## 📥 Data Fetching

### Server Component Data Fetching (Recommended)

```tsx
// Direct database access
async function ProductsPage() {
  await connectDB();
  const products = await Product.find().lean();
  return <ProductList products={products} />;
}

// Or fetch from API
async function ProductsPage() {
  const res = await fetch("https://api.example.com/products", {
    cache: "no-store"  // Disable caching for fresh data
  });
  const products = await res.json();
  return <ProductList products={products} />;
}
```

### Caching Options

```tsx
// Static: Fetch once at build time
fetch(url, { cache: "force-cache" });

// Dynamic: Fetch on every request
fetch(url, { cache: "no-store" });

// Revalidate: Refresh every N seconds
fetch(url, { next: { revalidate: 60 } });
```

### Route Segment Config

```tsx
// src/app/products/page.tsx

// Force dynamic rendering
export const dynamic = "force-dynamic";

// Or force static
export const dynamic = "force-static";

// Revalidate page every 60 seconds
export const revalidate = 60;
```

### Client-Side Data Fetching

For data that needs to update without page reload:

```tsx
"use client";

import { useState, useEffect } from "react";

function ProductSearch() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  
  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch(`/api/products?search=${search}`);
      const data = await res.json();
      setProducts(data.products);
    }
    
    if (search) fetchProducts();
  }, [search]);
  
  return (/* ... */);
}
```

---

## ⏳ Loading and Error States

### Loading UI

Create `loading.tsx` for automatic loading states:

```tsx
// src/app/products/loading.tsx
export default function ProductsLoading() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 h-48 rounded-lg" />
          <div className="bg-gray-200 h-4 mt-4 rounded" />
          <div className="bg-gray-200 h-4 mt-2 w-2/3 rounded" />
        </div>
      ))}
    </div>
  );
}
```

### Error UI

Create `error.tsx` for error boundaries:

```tsx
// src/app/products/error.tsx
"use client";  // Error components must be client components

export default function ProductsError({
  error,
  reset
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-red-600">
        Something went wrong!
      </h2>
      <p className="text-gray-600 mt-2">{error.message}</p>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-primary-600 text-white rounded"
      >
        Try Again
      </button>
    </div>
  );
}
```

### Not Found

```tsx
// src/app/products/[slug]/not-found.tsx
export default function ProductNotFound() {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-gray-600 mt-2">Product not found</p>
    </div>
  );
}
```

**Triggering not-found:**
```tsx
import { notFound } from "next/navigation";

async function ProductPage({ params }) {
  const product = await getProduct(params.slug);
  
  if (!product) {
    notFound();  // Renders not-found.tsx
  }
  
  return <ProductDetail product={product} />;
}
```

---

## 🔍 Metadata and SEO

### Static Metadata

```tsx
// src/app/about/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Root Suppliers Pvt. Ltd.",
  openGraph: {
    title: "About Root Suppliers",
    description: "Your trusted hardware partner",
    images: ["/images/about-og.jpg"],
  },
};

export default function AboutPage() {
  return <div>About content...</div>;
}
```

### Dynamic Metadata

```tsx
// src/app/products/[slug]/page.tsx
import { Metadata } from "next";

export async function generateMetadata({
  params
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const product = await getProduct(params.slug);
  
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [product.images[0]?.url],
    },
  };
}

export default async function ProductPage({ params }) {
  // ...
}
```

### Root Metadata (from this project)

```tsx
// src/app/layout.tsx
export async function generateMetadata(): Promise<Metadata> {
  await connectDB();
  const settings = await Settings.findOne().lean();
  
  return {
    title: {
      default: `${settings?.site?.name} - ${settings?.site?.tagline}`,
      template: `%s | ${settings?.site?.name}`,
    },
    description: settings?.seo?.defaultDescription,
    keywords: ["hardware", "construction", "Nepal"],
    robots: {
      index: true,
      follow: true,
    },
  };
}
```

---

## 🔌 API Routes

### Basic API Route

```typescript
// src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";

// GET /api/products
export async function GET(request: NextRequest) {
  const products = await Product.find();
  
  return NextResponse.json({
    success: true,
    products
  });
}

// POST /api/products
export async function POST(request: NextRequest) {
  const body = await request.json();
  const product = await Product.create(body);
  
  return NextResponse.json(
    { success: true, product },
    { status: 201 }
  );
}
```

### Dynamic API Route

```typescript
// src/app/api/products/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const product = await Product.findOne({ slug: params.slug });
  
  if (!product) {
    return NextResponse.json(
      { success: false, message: "Not found" },
      { status: 404 }
    );
  }
  
  return NextResponse.json({ success: true, product });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const body = await request.json();
  const product = await Product.findOneAndUpdate(
    { slug: params.slug },
    body,
    { new: true }
  );
  
  return NextResponse.json({ success: true, product });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  await Product.findOneAndDelete({ slug: params.slug });
  
  return NextResponse.json({ success: true, message: "Deleted" });
}
```

### Reading Query Parameters

```typescript
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search");
  
  // Use in query...
}
```

### Setting Cookies

```typescript
export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  
  response.cookies.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,  // 7 days
  });
  
  return response;
}
```

---

## 🛡️ Middleware

Middleware runs before every request. Use for auth, redirects, headers.

```typescript
// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protect admin routes
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get("auth-token")?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    
    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.NEXTAUTH_SECRET));
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }
  
  // Add security headers
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  
  return response;
}

// Only run on specific paths
export const config = {
  matcher: [
    "/admin/:path*",
    "/api/:path*",
  ],
};
```

---

## 🖼️ Image Optimization

Next.js optimizes images automatically with the `Image` component.

```tsx
import Image from "next/image";

function ProductCard({ product }) {
  return (
    <div>
      <Image
        src={product.images[0].url}
        alt={product.name}
        width={400}
        height={300}
        className="rounded-lg"
        priority={false}  // Set true for above-the-fold images
      />
    </div>
  );
}
```

### Remote Images Configuration

```javascript
// next.config.mjs
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};
```

### Fill Mode

```tsx
<div className="relative h-48">
  <Image
    src={product.image}
    alt={product.name}
    fill
    className="object-cover"
  />
</div>
```

---

## 📚 Next Steps

Now that you understand Next.js:

→ **Next**: [06 - TypeScript Guide](./06-TYPESCRIPT-GUIDE.md) - Master TypeScript

---

*Happy Learning! 🎉*
