# 📚 03 - Project Architecture & Folder Structure

> **Understanding How the Codebase is Organized**

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [Root Level Files](#root-level-files)
3. [The src Directory](#the-src-directory)
4. [App Router Structure](#app-router-structure)
5. [Components Organization](#components-organization)
6. [Library Files](#library-files)
7. [Scripts & Utilities](#scripts--utilities)
8. [Data Flow Architecture](#data-flow-architecture)

---

## 🎯 Overview

Understanding the project structure is crucial. Good organization makes code:
- ✅ Easy to navigate
- ✅ Easy to maintain
- ✅ Easy for teams to collaborate
- ✅ Scalable as the project grows

### High-Level Structure

```
root-suppliers/
│
├── 📁 public/                # Static assets (images, fonts)
├── 📁 src/                   # All source code
├── 📁 scripts/               # Database & utility scripts
├── 📁 docs/                  # Documentation (you're reading this!)
│
├── 📄 package.json           # Dependencies & scripts
├── 📄 tsconfig.json          # TypeScript configuration
├── 📄 tailwind.config.ts     # Tailwind CSS configuration
├── 📄 next.config.mjs        # Next.js configuration
├── 📄 .env.local             # Environment variables (secrets)
└── 📄 .gitignore             # Files excluded from git
```

---

## 📄 Root Level Files

### Configuration Files Explained

#### `package.json` - Project Manifest
```json
{
  "name": "root-suppliers-v2",
  "version": "0.1.0",
  "private": true,
  
  "scripts": {
    "dev": "next dev",           // Start development server
    "build": "next build",       // Create production build
    "start": "next start",       // Run production server
    "lint": "next lint",         // Check for code issues
    "format": "prettier --write ."  // Format all files
  },
  
  "dependencies": { ... },       // Runtime packages
  "devDependencies": { ... }     // Development-only packages
}
```

#### `tsconfig.json` - TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,               // Enable strict type checking
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "jsx": "preserve",
    
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]          // Import alias: @/lib → ./src/lib
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

**Path Alias Explained**:
```typescript
// Without alias
import { Button } from "../../../components/ui/Button";

// With alias (@/)
import { Button } from "@/components/ui/Button";
```

#### `tailwind.config.ts` - Styling Configuration
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          600: "#C41E3A",  // Cardinal Red
        },
        secondary: {
          600: "#1E3A8A",  // Navy Blue
        },
      },
      fontFamily: {
        primary: ["var(--font-primary)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
```

#### `next.config.mjs` - Next.js Configuration
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',  // Allow Cloudinary images
      },
    ],
  },
};

export default nextConfig;
```

#### `.env.local` - Environment Variables
```env
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# Authentication
NEXTAUTH_SECRET=your-32-character-secret-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> ⚠️ **Important**: `.env.local` should NEVER be committed to git. It contains secrets!

---

## 📁 The src Directory

This is where all the application code lives:

```
src/
├── 📁 app/           # Pages, layouts, and API routes
├── 📁 components/    # Reusable React components
├── 📁 lib/           # Utilities, database, helpers
├── 📁 contexts/      # React Context providers
├── 📁 types/         # TypeScript type definitions
└── 📄 middleware.ts  # Request middleware
```

### Why This Structure?

**Separation of Concerns:**

| Folder | Purpose | Responsibility |
|--------|---------|----------------|
| `app/` | WHAT users see | Pages, routes |
| `components/` | HOW things look | UI building blocks |
| `lib/` | HOW things work | Business logic, utilities |
| `contexts/` | SHARED state | Global data |
| `types/` | DATA shapes | TypeScript definitions |

---

## 📁 App Router Structure

Next.js 14 uses the **App Router**. The file structure directly maps to URLs.

### Complete App Directory

```
src/app/
│
├── 📄 layout.tsx          # Root layout (wraps EVERYTHING)
├── 📄 globals.css         # Global styles
├── 📄 robots.ts           # SEO: robots.txt generation
├── 📄 sitemap.ts          # SEO: sitemap.xml generation
├── 📁 fonts/              # Custom font files
│
├── 📁 (public)/           # Public pages (no auth required)
│   ├── 📄 layout.tsx      # Layout for public pages
│   ├── 📄 page.tsx        # Homepage (/)
│   │
│   ├── 📁 about/
│   │   └── 📄 page.tsx    # About page (/about)
│   │
│   ├── 📁 products/
│   │   ├── 📄 page.tsx    # Products list (/products)
│   │   └── 📁 [slug]/
│   │       └── 📄 page.tsx  # Product detail (/products/drill-pro)
│   │
│   ├── 📁 categories/
│   │   └── 📁 [slug]/
│   │       └── 📄 page.tsx  # Category page (/categories/power-tools)
│   │
│   ├── 📁 blogs/
│   │   ├── 📄 page.tsx    # Blog list (/blogs)
│   │   └── 📁 [slug]/
│   │       └── 📄 page.tsx  # Blog post (/blogs/my-article)
│   │
│   └── 📁 contact/
│       └── 📄 page.tsx    # Contact form (/contact)
│
├── 📁 (admin)/            # Admin pages (auth required)
│   └── 📁 admin/
│       ├── 📄 layout.tsx  # Admin layout (sidebar, etc.)
│       ├── 📄 page.tsx    # Dashboard (/admin)
│       │
│       ├── 📁 login/
│       │   └── 📄 page.tsx  # Login (/admin/login)
│       │
│       ├── 📁 products/
│       │   ├── 📄 page.tsx    # Products list (/admin/products)
│       │   ├── 📁 new/
│       │   │   └── 📄 page.tsx  # Create (/admin/products/new)
│       │   └── 📁 [id]/
│       │       └── 📄 page.tsx  # Edit (/admin/products/123)
│       │
│       ├── 📁 categories/
│       ├── 📁 blogs/
│       ├── 📁 inquiries/
│       ├── 📁 users/
│       ├── 📁 settings/
│       └── 📁 profile/    # New: Admin profile management (/admin/profile)
│
└── 📁 api/                # Backend API routes
    ├── 📁 auth/
    │   ├── 📁 login/
    │   │   └── 📄 route.ts   # POST /api/auth/login
    │   ├── 📁 logout/
    │   │   └── 📄 route.ts   # POST /api/auth/logout
    │   └── 📁 session/
    │       └── 📄 route.ts   # GET /api/auth/session
    │
    ├── 📁 products/
    │   ├── 📄 route.ts       # GET, POST /api/products
    │   └── 📁 [slug]/
    │       └── 📄 route.ts   # GET, PUT, DELETE /api/products/:slug
    │
    ├── 📁 categories/
    │   └── 📄 route.ts       # GET, POST /api/categories
    │
    ├── 📁 blogs/
    ├── 📁 inquiries/
    ├── 📁 settings/
    └── 📁 upload/
        └── 📄 route.ts       # POST /api/upload
```

### Route Groups Explained

Folders in parentheses `(name)` are **route groups**. They organize code without affecting the URL.

```
Without route groups:
src/app/public/products/page.tsx → /public/products ❌

With route groups:
src/app/(public)/products/page.tsx → /products ✅
```

**Why use route groups?**

**Route Groups Benefits:**

| Feature | `(public)/` Pages | `(admin)/` Pages |
|---------|-------------------|------------------|
| Layout | Header, Footer | Sidebar, Navbar |
| Styling | Customer-facing | Dashboard style |
| Authentication | No login required | Requires login |
| SEO | SEO optimized | No SEO needed |

**Example:**
- `(public)/layout.tsx` → Contains navigation bar for customers
- `(admin)/layout.tsx` → Contains admin sidebar and top navbar

### Dynamic Routes

Folders with `[brackets]` are **dynamic segments**. They match any value.

```
src/app/products/[slug]/page.tsx

URLs that match:
/products/electric-drill     → slug = "electric-drill"
/products/hammer-pro        → slug = "hammer-pro"
/products/123               → slug = "123"
```

**Accessing dynamic params**:
```tsx
// src/app/products/[slug]/page.tsx
export default async function ProductPage({
  params
}: {
  params: { slug: string }
}) {
  const product = await Product.findOne({ slug: params.slug });
  
  return <ProductDetail product={product} />;
}
```

### Special Files

| File | Purpose |
|------|---------|
| `page.tsx` | The UI for a route |
| `layout.tsx` | Shared UI that wraps children |
| `loading.tsx` | Loading UI (shown during navigation) |
| `error.tsx` | Error UI (shown when things break) |
| `not-found.tsx` | 404 UI (when page doesn't exist) |
| `route.ts` | API endpoint (for api/ routes) |

---

## 📁 Components Organization

```
src/components/
│
├── 📁 ui/              # Basic, reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   ├── Select.tsx
│   ├── Pagination.tsx
│   ├── Spinner.tsx
│   ├── Toast.tsx
│   └── index.ts        # Barrel export
│
├── 📁 sections/        # Page sections (larger compositions)
│   ├── HeroCarousel.tsx
│   ├── FeaturedProducts.tsx
│   ├── CategoriesSection.tsx
│   ├── TestimonialsSection.tsx
│   ├── CTASection.tsx
│   └── index.ts
│
├── 📁 cards/           # Card components
│   ├── ProductCard.tsx
│   ├── CategoryCard.tsx
│   ├── BlogCard.tsx
│   └── TestimonialCard.tsx
│
├── 📁 forms/           # Form components
│   ├── ProductForm.tsx
│   ├── CategoryForm.tsx
│   ├── BlogForm.tsx
│   ├── ContactForm.tsx
│   └── LoginForm.tsx
│
├── 📁 layout/          # Layout components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   └── AdminLayout.tsx
│
├── 📁 modals/          # Modal dialogs
│   ├── DeleteConfirmModal.tsx
│   └── ImagePreviewModal.tsx
│
└── 📁 editor/          # Rich text editor
    └── RichTextEditor.tsx
```

### Component Categories

**Component Hierarchy (Atomic Design):**

| Level | Folder | Contains | Example |
|-------|--------|----------|---------|
| **Atoms** | `ui/` | Basic building blocks | Button, Input, Card, Image |
| **Molecules** | `cards/`, `forms/` | Combinations of atoms | ProductCard = Card + Image + Button |
| **Organisms** | `sections/` | Complex UI sections | FeaturedProducts = Title + Grid of ProductCards |
| **Pages** | `app/` | Full page layouts | Homepage = Hero + Featured + Categories |

**How they connect:**

```
Atoms → Molecules → Organisms → Pages
Button + Card → ProductCard → FeaturedProducts → Homepage
```

### Barrel Exports

`index.ts` files export all components from a folder:

```typescript
// src/components/ui/index.ts
export { Button } from "./Button";
export { Input } from "./Input";
export { Card } from "./Card";
export { Modal } from "./Modal";
// ... etc
```

**Benefits**:
```typescript
// Without barrel export
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

// With barrel export
import { Button, Input, Card } from "@/components/ui";
```

---

## 📁 Library Files

```
src/lib/
│
├── 📁 db/                    # Database related
│   ├── connect.ts            # MongoDB connection
│   └── 📁 models/            # Mongoose schemas
│       ├── User.ts
│       ├── Product.ts
│       ├── Category.ts
│       ├── Brand.ts
│       ├── Blog.ts
│       ├── Inquiry.ts
│       ├── Testimonial.ts
│       ├── Settings.ts
│       └── AuditLog.ts
│
├── 📁 validations/           # Zod validation schemas
│   ├── index.ts
│   ├── shared.schema.ts      # Common schemas
│   ├── product.schema.ts
│   ├── category.schema.ts
│   ├── user.schema.ts
│   └── blog.schema.ts
│
├── 📄 auth.ts                # Authentication helpers
├── 📄 errors.ts              # Error classes & handlers
├── 📄 utils.ts               # General utilities
├── 📄 constants.ts           # App constants
├── 📄 cloudinary.ts          # Cloudinary configuration
├── 📄 rate-limit.ts          # Rate limiting
├── 📄 logger.ts              # Logging utilities
├── 📄 api-middleware.ts      # API middleware helpers
├── 📄 pagination.ts          # Pagination helpers
└── 📄 animations.ts          # Framer Motion variants
```

### Key Files Explained

#### `lib/db/connect.ts` - Database Connection
```typescript
import mongoose from "mongoose";

let cached = global.mongoose || { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) {
    return cached.conn;  // Reuse existing connection
  }
  
  cached.promise = mongoose.connect(process.env.MONGODB_URI!);
  cached.conn = await cached.promise;
  
  return cached.conn;
}

export default connectDB;
```

#### `lib/auth.ts` - Authentication Helpers
```typescript
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export interface AuthUser {
  userId: string;
  email: string;
  role: "admin" | "editor";
}

export async function verifyAuth(req: NextRequest): Promise<AuthUser | null> {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return null;
  
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload as AuthUser;
}
```

#### `lib/errors.ts` - Error Handling
```typescript
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
  constructor(message = "Not found") {
    super(message, 404);
  }
}
```

#### `lib/utils.ts` - Utility Functions
```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR"
  }).format(price);
}

// Sanitize HTML
export function sanitizeHtml(html: string) {
  return DOMPurify.sanitize(html);
}
```

---

## 📁 Scripts & Utilities

```
scripts/
├── seed-admin.ts              # Create admin user
├── seed-categories-products.ts # Seed sample data
├── seed-blogs.ts              # Seed blog posts
├── seed-hero-slides.ts        # Seed homepage slides
├── reset-passwords.ts         # Reset user passwords
│
├── test-products-api.ts       # Test product endpoints
├── test-categories-api.ts     # Test category endpoints
├── test-blogs-api.ts          # Test blog endpoints
├── test-mongodb.ts            # Test database connection
│
└── run-all-tests.sh           # Run all tests
```

**Running Scripts**:
```bash
# Seed the database
pnpm tsx scripts/seed-admin.ts

# Test APIs
pnpm tsx scripts/test-products-api.ts
```

---

## 🔄 Data Flow Architecture

### Request Flow: Public Page

**User visits `/products`:**

| Step | File | Action |
|------|------|--------|
| 1 | `src/middleware.ts` | Add security headers |
| 2 | `src/app/(public)/products/page.tsx` | Server Component runs |
| 3 | `src/lib/db/connect.ts` | Connect to MongoDB |
| 4 | `src/lib/db/models/Product.ts` | Query: `Product.find({ isActive: true })` |
| 5 | `src/components/cards/ProductCard.tsx` | Render product cards |
| 6 | **Response** | HTML sent to browser |

```
User → Middleware → Page Component → Database → Components → HTML Response
```

### Request Flow: Admin Page

**User visits `/admin/products`:**

| Step | File | Action |
|------|------|--------|
| 1 | `src/middleware.ts` | Check `auth-token` cookie |
| 2 | ↳ No token? | Redirect to `/admin/login` |
| 3 | ↳ Has token? | Verify JWT |
| 4 | `src/app/(admin)/admin/layout.tsx` | Check session, render sidebar |
| 5 | `src/app/(admin)/admin/products/page.tsx` | Fetch products, render admin table |

```
User → Middleware (Auth Check) → Layout → Admin Page → Database → Response
```

### Request Flow: API Call

**Client sends: `POST /api/products`**

| Step | File | Action |
|------|------|--------|
| 1 | `src/middleware.ts` | Rate limiting check |
| 2 | `src/app/api/products/route.ts` | `export async function POST(req)` |
| 3 | `src/lib/auth.ts` | `verifyAdmin(req)` |
| 4 | `src/lib/validations/product.schema.ts` | `productSchema.parse(body)` |
| 5 | `src/lib/db/models/Product.ts` | `Product.create(validatedData)` |
| 6 | **Response** | `{ success: true, product: {...} }` |

```
Client Request → Middleware → API Route → Auth → Validation → Database → JSON Response
```

---

## 📝 Architecture Patterns Used

### 1. Feature-Based Organization
Components and logic are grouped by feature (products, categories, blogs) rather than by type.

### 2. Separation of Concerns
- **Pages** handle routing and layout
- **Components** handle UI
- **Lib** handles business logic
- **API routes** handle data operations

### 3. Barrel Exports
Index files export multiple items for cleaner imports.

### 4. Path Aliases
`@/` prefix simplifies imports and makes moving files easier.

### 5. Environment Configuration
All secrets in `.env.local`, accessed via `process.env`.

### 6. Dynamic Configuration (Site Settings)
Critical site metadata (favicon, site name, contact links) is stored in the database (`Settings` model) and managed via the Admin Panel. This allows non-technical users to update site hardware (like phone numbers) without code changes.

---

---

## 📚 Next Steps

Now that you understand the project structure:

→ **Next**: [04 - Frontend Basics](./04-FRONTEND-BASICS.md) - Learn React fundamentals

---

*Happy Learning! 🎉*
