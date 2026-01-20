# 📚 16 - Codebase Walkthrough

> **Detailed Explanation of Every Key File in the Project**

---

## 📖 Table of Contents

1. [Project Entry Points](#project-entry-points)
2. [Configuration Files](#configuration-files)
3. [Core Library Files](#core-library-files)
4. [Database Models](#database-models)
5. [API Routes](#api-routes)
6. [Components](#components)
7. [Pages](#pages)
16. [Admin Features](#admin-features)

---

## 🚀 Project Entry Points

### `src/app/layout.tsx` - Root Layout

This layout is the entryway to the application. It has been modernized to support dynamic metadata (favicons, site titles) managed via the admin panel.

```typescript
// Condensed example of dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  await connectDB();
  const settings = await Settings.findOne();
  
  return {
    title: settings?.site?.name || "Root Suppliers",
    icons: {
      icon: settings?.site?.favicon?.url || "/favicon.ico",
    }
  };
}
```

```typescript
import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import { SettingsProvider } from "@/contexts/SettingsContext";

// Font configuration
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Root Suppliers",
  description: "Your trusted industrial equipment partner",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <SettingsProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
```

**Key Concepts:**
- `generateMetadata`: Dynamically fetches SEO metadata and favicon from the database (`Settings` model).
- `Font Loading`: Optimized loading for Inter and custom industrial fonts (Bank Gothic).
- `Providers`: Context providers wrap the app for global state (Toast, Settings).
- `children`: Pages render inside this layout.

---

### `src/middleware.ts` - Request Interceptor

Runs before every request to handle security and routing.

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;
  
  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Add security headers
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*'
  ]
};
```

**What It Does:**
1. Checks if admin routes have auth token
2. Redirects unauthenticated users to login
3. Adds security headers to all responses
4. `matcher` limits which paths trigger middleware

---

## ⚙️ Configuration Files

### `tailwind.config.ts` - Styling Configuration

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C41E3A',   // Crimson red
          50: '#FEF2F3',
          100: '#FCE2E5',
          // ... full palette
          900: '#7A0D22',
        },
        secondary: {
          DEFAULT: '#1E3A8A',   // Deep blue
          // ... full palette
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};

export default config;
```

**Usage:**
```jsx
// In components
<div className="bg-primary text-white shadow-card hover:shadow-card-hover">
```

---

### `next.config.mjs` - Next.js Configuration

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/your-cloud-name/**',
      },
    ],
  },
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
```

**Important Settings:**
- `images.remotePatterns`: Allows Cloudinary images in `<Image>` component
- `experimental.optimizePackageImports`: Tree-shakes icon libraries

---

## 📚 Core Library Files

### `src/lib/db/connect.ts` - Database Connection

```typescript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI environment variable');
}

// Cache connection across hot reloads (development)
interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: GlobalMongoose | undefined;
}

let cached = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectDB() {
  // Return cached connection
  if (cached.conn) {
    return cached.conn;
  }

  // Create new connection
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
```

**Why Cache?**
- Development mode has hot reloading
- Each reload would create new connection
- Connection pool would be exhausted
- Cache prevents this

---

### `src/lib/auth.ts` - Authentication Utilities

```typescript
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { connectDB } from '@/lib/db/connect';
import User from '@/lib/db/models/User';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor';
}

export async function verifyAuth(request: Request): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return null;
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    await connectDB();
    const user = await User.findById(payload.userId);

    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };
  } catch {
    return null;
  }
}

export async function verifyAdmin(request: Request): Promise<AuthUser> {
  const user = await verifyAuth(request);
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  if (user.role !== 'admin') {
    throw new Error('Forbidden: Admin access required');
  }
  
  return user;
}
```

**Flow:**
1. Get token from cookie
2. Verify JWT signature
3. Find user in database
4. Return user info or null

---

### `src/lib/errors.ts` - Custom Error Classes

```typescript
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class AuthError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}
```

**Usage in API:**
```typescript
if (!product) {
  throw new NotFoundError('Product');
}
// Returns: { error: "Product not found" } with 404 status
```

---

### `src/lib/api-middleware.ts` - API Protection

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, verifyAdmin } from './auth';
import { ZodSchema } from 'zod';

interface MiddlewareOptions {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  schema?: ZodSchema;
}

type RouteHandler = (
  req: NextRequest,
  context: { params: Record<string, string>; user?: AuthUser; body?: unknown }
) => Promise<NextResponse>;

export function withValidate(options: MiddlewareOptions, handler: RouteHandler) {
  return async (req: NextRequest, context: { params: Record<string, string> }) => {
    try {
      let user = null;
      let body = null;

      // Authentication check
      if (options.requireAuth || options.requireAdmin) {
        user = options.requireAdmin 
          ? await verifyAdmin(req)
          : await verifyAuth(req);
        
        if (!user) {
          return NextResponse.json(
            { success: false, message: 'Unauthorized' },
            { status: 401 }
          );
        }
      }

      // Body validation
      if (options.schema && ['POST', 'PUT', 'PATCH'].includes(req.method || '')) {
        const rawBody = await req.json();
        const result = options.schema.safeParse(rawBody);
        
        if (!result.success) {
          return NextResponse.json(
            { success: false, message: result.error.issues[0].message },
            { status: 400 }
          );
        }
        body = result.data;
      }

      // Call the actual handler
      return handler(req, { ...context, user, body });
    } catch (error) {
      // Error handling...
    }
  };
}
```

**Usage:**
```typescript
export const POST = withValidate(
  { requireAdmin: true, schema: productSchema },
  async (req, { body }) => {
    // body is already validated
    const product = await Product.create(body);
    return NextResponse.json({ success: true, product });
  }
);
```

---

## 💾 Database Models

### `src/lib/db/models/Product.ts`

```typescript
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  category: Types.ObjectId;
  brand?: Types.ObjectId;
  images: string[];
  specifications: {
    name: string;
    value: string;
  }[];
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
    },
    images: [{
      type: String,
    }],
    specifications: [{
      name: String,
      value: String,
    }],
    tags: [{
      type: String,
      trim: true,
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Auto-generate slug from name
ProductSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Indexes for performance
ProductSchema.index({ slug: 1 }, { unique: true });
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ isFeatured: 1, isActive: 1 });
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });

export default mongoose.models.Product || 
  mongoose.model<IProduct>('Product', ProductSchema);
```

---

### `src/lib/db/models/User.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'editor';
  isActive: boolean;
  lastLogin?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't include in queries by default
    },
    role: {
      type: String,
      enum: ['admin', 'editor'],
      default: 'editor',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || 
  mongoose.model<IUser>('User', UserSchema);
```

**Key Features:**
- `select: false` hides password from normal queries
- `pre('save')` hook automatically hashes passwords
- `comparePassword` method for login verification

---

## 🌐 API Routes

### `src/app/api/products/route.ts` - Product CRUD

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import Product from '@/lib/db/models/Product';
import Category from '@/lib/db/models/Category';
import { withValidate } from '@/lib/api-middleware';
import { productSchema } from '@/lib/validations/product.schema';

// GET /api/products - List products with filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    
    // Build query
    const query: Record<string, unknown> = { isActive: true };
    
    if (category) {
      // Get all child categories for recursive filter
      const childCategories = await Category.find({
        $or: [
          { _id: category },
          { parent: category }
        ]
      }).select('_id');
      
      query.category = { $in: childCategories.map(c => c._id) };
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    // Execute query with pagination
    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .populate('brand', 'name')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Product.countDocuments(query)
    ]);
    
    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create product (admin only)
export const POST = withValidate(
  { requireAdmin: true, schema: productSchema },
  async (req, { body }) => {
    await connectDB();
    
    const product = await Product.create(body);
    
    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product
    }, { status: 201 });
  }
);
```

---

### `src/app/api/auth/login/route.ts` - Authentication

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/db/connect';
import User from '@/lib/db/models/User';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password required' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Find user with password (normally excluded)
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Verify password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Create JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({
      userId: user._id.toString(),
      role: user.role
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secret);
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });
    
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Login failed' },
      { status: 500 }
    );
  }
}
```

---

### `src/app/api/upload/route.ts` - File Upload

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { verifyAdmin } from '@/lib/auth';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: NextRequest) {
  try {
    // Check admin access
    await verifyAdmin(request);
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'general';
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type' },
        { status: 400 }
      );
    }
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: 'File too large (max 5MB)' },
        { status: 400 }
      );
    }
    
    // Convert to buffer and base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64}`;
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: `root-suppliers/${folder}`,
      resource_type: 'image',
      transformation: [
        { quality: 'auto', fetch_format: 'auto' }
      ]
    });
    
    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Upload failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await verifyAdmin(request);
    
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');
    
    if (!publicId) {
      return NextResponse.json(
        { success: false, message: 'Public ID required' },
        { status: 400 }
      );
    }
    
    await cloudinary.uploader.destroy(publicId);
    
    return NextResponse.json({
      success: true,
      message: 'Image deleted'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Delete failed' },
      { status: 500 }
    );
  }
}
```

---

## 🧩 Components

### `src/components/ui/Button.tsx`

```typescript
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary-600 focus:ring-primary',
        secondary: 'bg-secondary text-white hover:bg-secondary-600 focus:ring-secondary',
        outline: 'border border-gray-300 bg-transparent hover:bg-gray-50',
        ghost: 'hover:bg-gray-100',
        danger: 'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle 
                cx="12" cy="12" r="10" 
                stroke="currentColor" 
                strokeWidth="4" 
                fill="none" 
                className="opacity-25" 
              />
              <path 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" 
                className="opacity-75" 
              />
            </svg>
            Loading...
          </span>
        ) : children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
```

---

### `src/components/ui/Toast.tsx`

```typescript
'use client';

import { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
```

---

## 📄 Pages

### Public Product Page Structure

```
src/app/(public)/products/
├── page.tsx              # Product listing
└── [slug]/
    └── page.tsx          # Single product
```

### `src/app/(public)/products/page.tsx`

```typescript
import { Suspense } from 'react';
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilters from '@/components/products/ProductFilters';

interface PageProps {
  searchParams: { 
    category?: string; 
    search?: string;
    page?: string;
  };
}

export default async function ProductsPage({ searchParams }: PageProps) {
  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1">
          <Suspense fallback={<div>Loading filters...</div>}>
            <ProductFilters />
          </Suspense>
        </aside>
        
        {/* Product Grid */}
        <section className="lg:col-span-3">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid 
              category={searchParams.category}
              search={searchParams.search}
              page={parseInt(searchParams.page || '1')}
            />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
```

---

## 🛠️ Admin Features

### `src/app/(admin)/admin/profile/page.tsx` - User Profile
The Profile page allows administrators and editors to manage their own credentials and avatars.

**Key Logic:**
- **Dynamic Fetching**: Uses `cache: 'no-store'` to ensure users always see their latest profile details.
- **Session Syncing**: Automatically updates the local session data when changes are saved.
- **Role Security**: Password reset fields are hidden by default and restricted to users with the `admin` role.

### Mobile-First Patterns: Master-Detail
For complex administrative modules like **Inquiries**, we use a "Master-Detail" pattern on mobile:
1. **Master View**: A list of data cards.
2. **Detail View**: Full-screen focus on a single item.
3. **UX**: On mobile, selecting an item swaps the view, whereas on desktop, they are displayed side-by-side.

---

## 📚 Next Steps

Now that you understand the codebase:

→ **Next**: [17 - Practice Exercises](./17-EXERCISES.md) - Test your knowledge

---

*Read Code, Understand Code! 📖*
