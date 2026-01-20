# 📚 02 - Technology Stack Deep Dive

> **Understanding Every Technology Used in This Project**

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [Frontend Technologies](#frontend-technologies)
3. [Backend Technologies](#backend-technologies)
4. [Database](#database)
5. [External Services](#external-services)
6. [Development Tools](#development-tools)
7. [Why These Choices?](#why-these-choices)

---

## 🎯 Overview

This project uses a **modern full-stack JavaScript/TypeScript** technology stack. Everything is built with JavaScript (or TypeScript, which compiles to JavaScript).

### Complete Stack Visualization

```
FRONTEND                    BACKEND                   DATABASE
────────                    ───────                   ────────
React                       Next.js API Routes        MongoDB Atlas
Next.js         ◀────────▶  Mongoose ODM      ◀────▶  (Cloud DB)
TypeScript                  JWT Auth
Tailwind CSS                                          STORAGE
Framer Motion                                         ───────
                                                      Cloudinary
                                                      (Images)
```

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React, Next.js, TypeScript, Tailwind CSS, Framer Motion |
| **Backend** | Next.js API Routes, Mongoose ODM, JWT Authentication |
| **Database** | MongoDB Atlas (Cloud) |
| **Storage** | Cloudinary (Images) |
| **Validation** | Zod, React Hook Form |

### All Dependencies

```json
// package.json - dependencies
{
  "dependencies": {
    // 🎨 UI Framework
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "next": "^14.2.35",
    
    // 📘 Type Safety
    "typescript": "^5.7.0",
    "zod": "^3.24.0",
    
    // 🎨 Styling
    "tailwindcss": "^3.4.16",
    "tailwind-merge": "^2.6.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    
    // ✨ Animations
    "framer-motion": "^11.15.0",
    
    // 📝 Forms
    "react-hook-form": "^7.54.0",
    "@hookform/resolvers": "^3.9.0",
    
    // 🎠 UI Components
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-tabs": "^1.1.13",
    "embla-carousel-react": "^8.5.0",
    "lucide-react": "^0.468.0",
    
    // 📝 Rich Text Editor
    "@tiptap/react": "^2.10.0",
    "@tiptap/starter-kit": "^2.10.0",
    
    // 🗄️ Database
    "mongoose": "^8.9.0",
    "mongodb": "^6.12.0",
    
    // 🔐 Authentication
    "bcryptjs": "^2.4.3",
    "jose": "^5.9.0",
    
    // ☁️ Cloud Services
    "cloudinary": "^2.5.0",
    "next-cloudinary": "^6.15.0",
    
    // 🛠️ Utilities
    "date-fns": "^4.1.0",
    "slugify": "^1.6.6",
    "dompurify": "^3.3.1"
  }
}
```

---

## 🎨 Frontend Technologies

### 1. React.js

**What is React?**
React is a JavaScript library for building user interfaces. It lets you build UI from small, reusable pieces called "components".

**File Location**: Every `.tsx` file in `src/components/` and `src/app/`

**Core Concepts**:

```tsx
// 1. COMPONENTS - Building blocks of UI
function ProductCard({ product }) {
  return (
    <div className="card">
      <h3>{product.name}</h3>
      <p>{product.price}</p>
    </div>
  );
}

// 2. JSX - HTML-like syntax in JavaScript
const element = <h1>Hello, World!</h1>;

// 3. PROPS - Data passed to components
<ProductCard product={{ name: "Drill", price: 999 }} />

// 4. STATE - Data that changes over time
const [count, setCount] = useState(0);

// 5. HOOKS - Functions that add features
useEffect(() => {
  // Runs after component mounts
  fetchData();
}, []);
```

**Example from this project**:
```tsx
// src/components/sections/FeaturedProducts.tsx
export function FeaturedProducts({ products }) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Why React?**
- ✅ Component reusability
- ✅ Virtual DOM for performance
- ✅ Huge ecosystem and community
- ✅ Easy to test and debug

---

### 2. Next.js 14

**What is Next.js?**
Next.js is a React framework that adds powerful features like server-side rendering, file-based routing, and API routes.

**File Location**: `next.config.mjs`, entire `src/app/` directory

**Key Features**:

| Feature | Description |
|---------|-------------|
| **File-based Routing** | `src/app/about/page.tsx` → `/about` |
| **Server-Side Rendering** | Pages render on server, better SEO |
| **API Routes** | `src/app/api/products/route.ts` → `/api/products` |
| **Layouts** | Shared UI that persists across pages |
| **Server & Client Components** | Choose where code runs |

**Routing Examples**:
```
File System:                          URL:
src/app/page.tsx                  →   /
src/app/about/page.tsx            →   /about
src/app/products/page.tsx         →   /products
src/app/products/[slug]/page.tsx  →   /products/:slug
src/app/api/products/route.ts     →   /api/products
```

**Example from this project**:
```tsx
// src/app/(public)/products/page.tsx
export default async function ProductsPage() {
  // This runs on the SERVER
  await connectDB();
  const products = await Product.find({ isActive: true }).lean();
  
  return (
    <div>
      <h1>All Products</h1>
      <ProductGrid products={products} />
    </div>
  );
}
```

**Why Next.js?**
- ✅ SEO friendly (server rendering)
- ✅ Built-in API routes (no separate backend needed)
- ✅ Automatic code splitting
- ✅ Image optimization
- ✅ Easy deployment on Vercel

---

### 3. TypeScript

**What is TypeScript?**
TypeScript is JavaScript with syntax for types. It catches errors before runtime and provides better tooling.

**File Location**: `tsconfig.json`, all `.ts` and `.tsx` files

**Core Concepts**:

```typescript
// 1. BASIC TYPES
let name: string = "John";
let age: number = 25;
let isActive: boolean = true;
let tags: string[] = ["hardware", "tools"];

// 2. INTERFACES - Define object shapes
interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;  // Optional property
}

// 3. TYPE INFERENCE - TypeScript guesses types
const count = 5;  // TypeScript knows this is a number

// 4. FUNCTION TYPES
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}

// 5. GENERICS - Reusable type patterns
function getFirst<T>(arr: T[]): T {
  return arr[0];
}
```

**Example from this project**:
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
  price: number;
  discountPrice?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**Why TypeScript?**
- ✅ Catch errors before running code
- ✅ Better autocomplete in editor
- ✅ Self-documenting code
- ✅ Easier refactoring
- ✅ Team collaboration

---

### 4. Tailwind CSS

**What is Tailwind CSS?**
A utility-first CSS framework. Instead of writing CSS, you use pre-built utility classes directly in HTML.

**File Location**: `tailwind.config.ts`, `src/app/globals.css`

**Traditional CSS vs Tailwind**:

```css
/* Traditional CSS */
.card {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}
```

```html
<!-- Tailwind CSS -->
<div class="bg-white rounded-lg p-4 shadow-md hover:shadow-lg">
  Content
</div>
```

**Common Utility Classes**:

| Category | Examples |
|----------|----------|
| **Spacing** | `p-4` (padding), `m-2` (margin), `gap-6` |
| **Sizing** | `w-full`, `h-16`, `max-w-lg` |
| **Typography** | `text-lg`, `font-bold`, `text-center` |
| **Colors** | `bg-blue-500`, `text-gray-700` |
| **Flexbox** | `flex`, `justify-center`, `items-center` |
| **Grid** | `grid`, `grid-cols-3`, `gap-4` |
| **Responsive** | `md:grid-cols-2`, `lg:text-xl` |

**Custom Configuration**:
```typescript
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        primary: {
          600: "#C41E3A",  // Custom cardinal red
        },
        secondary: {
          600: "#1E3A8A",  // Custom navy blue
        }
      },
      fontFamily: {
        primary: ["var(--font-primary)", "sans-serif"],
      }
    }
  }
};
```

---

### 5. Framer Motion

**What is Framer Motion?**
A production-ready animation library for React. Makes animations easy and performant.

**File Location**: `src/lib/animations.ts`, various components

**Basic Usage**:

```tsx
import { motion } from "framer-motion";

// Fade in on mount
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Hello
</motion.div>

// Slide up on mount
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>
  Content
</motion.div>

// Animate on hover
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click me
</motion.button>
```

---

## 🔧 Backend Technologies

### 6. Next.js API Routes

**What are API Routes?**
They let you build your backend API within Next.js. Each file in `src/app/api/` becomes an API endpoint.

**File Location**: `src/app/api/`

**Structure**:
```
src/app/api/
├── products/
│   ├── route.ts              # GET, POST /api/products
│   └── [slug]/
│       └── route.ts          # GET, PUT, DELETE /api/products/:slug
├── auth/
│   ├── login/route.ts        # POST /api/auth/login
│   └── logout/route.ts       # POST /api/auth/logout
└── categories/
    └── route.ts              # GET, POST /api/categories
```

**Example**:
```typescript
// src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const products = await Product.find();
  return NextResponse.json({ success: true, products });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const product = await Product.create(body);
  return NextResponse.json({ success: true, product }, { status: 201 });
}
```

---

### 7. Zod (Validation)

**What is Zod?**
A TypeScript-first schema validation library. Define a schema, and Zod validates data against it.

**File Location**: `src/lib/validations/`

**Usage**:
```typescript
import { z } from "zod";

// Define schema
const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  price: z.number().min(0, "Price cannot be negative"),
  email: z.string().email("Invalid email format"),
  tags: z.array(z.string()).optional(),
});

// Validate data
const result = productSchema.safeParse(userInput);
if (!result.success) {
  console.log(result.error.errors);  // Array of validation errors
} else {
  console.log(result.data);  // Validated data
}

// Generate TypeScript type from schema
type Product = z.infer<typeof productSchema>;
```

---

## 💾 Database

### 8. MongoDB Atlas

**What is MongoDB?**
A NoSQL document database. Instead of tables and rows, it stores JSON-like documents.

**What is MongoDB Atlas?**
The cloud-hosted version of MongoDB. No server management needed.

**SQL vs MongoDB**:

| SQL Concept | MongoDB Concept |
|-------------|-----------------|
| Database | Database |
| Table | Collection |
| Row | Document |
| Column | Field |
| Primary Key | _id |
| JOIN | $lookup / populate |

**Document Example**:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Electric Drill Pro",
  "slug": "electric-drill-pro",
  "price": 4999,
  "category": "507f1f77bcf86cd799439012",
  "images": [
    {
      "url": "https://...",
      "publicId": "products/drill-1",
      "alt": "Electric Drill"
    }
  ],
  "specifications": [
    { "key": "Power", "value": "750W" },
    { "key": "Speed", "value": "2800 RPM" }
  ],
  "isActive": true,
  "createdAt": "2026-01-15T10:30:00Z"
}
```

---

### 9. Mongoose

**What is Mongoose?**
An Object Document Mapper (ODM) for MongoDB. It provides:
- Schema definition
- Data validation
- Query building
- Middleware hooks

**File Location**: `src/lib/db/models/`

**Example**:
```typescript
// src/lib/db/models/Product.ts
import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
    maxlength: [200, "Name cannot exceed 200 characters"]
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price cannot be negative"]
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",  // Reference to Category collection
    required: true
  }
}, {
  timestamps: true  // Adds createdAt, updatedAt
});

const Product = mongoose.model("Product", ProductSchema);
export default Product;
```

**Common Operations**:
```typescript
// CREATE
const product = await Product.create({ name: "Drill", price: 999 });

// READ
const products = await Product.find({ isActive: true });
const product = await Product.findOne({ slug: "drill-pro" });
const product = await Product.findById("507f1f77...");

// UPDATE
await Product.updateOne({ _id: id }, { price: 899 });
await Product.findByIdAndUpdate(id, { price: 899 }, { new: true });

// DELETE
await Product.deleteOne({ _id: id });
await Product.findByIdAndDelete(id);

// POPULATE (Join-like operation)
const product = await Product.findOne({ slug })
  .populate("category", "name slug");  // Include category details
```

---

## ☁️ External Services

### 10. Cloudinary

**What is Cloudinary?**
A cloud service for image and video management. Handles upload, storage, transformation, and delivery.

**File Location**: `src/lib/cloudinary.ts`, `src/app/api/upload/`

**Why Cloudinary?**
- ✅ No need to manage file storage
- ✅ Automatic image optimization
- ✅ Global CDN for fast delivery
- ✅ On-the-fly transformations
- ✅ Free tier available

**Example Usage**:
```typescript
// Upload
const result = await cloudinary.uploader.upload(file, {
  folder: "root-suppliers/products",
  transformation: [
    { width: 1200, height: 1200, crop: "limit" },
    { quality: "auto" }
  ]
});

// Result
{
  url: "https://res.cloudinary.com/xxx/image/upload/v1.../products/abc.jpg",
  public_id: "root-suppliers/products/abc",
  width: 1200,
  height: 800
}
```

---

## 🛠️ Development Tools

### 11. ESLint

**What is ESLint?**
A tool that analyzes code to find problems and enforce coding standards.

**File Location**: `eslint.config.mjs`

**Example Rules**:
```javascript
// Catches unused variables
const unused = 5;  // ESLint: 'unused' is defined but never used

// Catches missing dependencies in useEffect
useEffect(() => {
  fetchData(id);
}, []);  // ESLint: Missing dependency 'id'
```

### 12. Prettier

**What is Prettier?**
An opinionated code formatter. Automatically formats code to a consistent style.

**Before Prettier**:
```javascript
const   name="John"
function add(a,b){return a+b}
```

**After Prettier**:
```javascript
const name = "John";
function add(a, b) {
  return a + b;
}
```

### 13. pnpm

**What is pnpm?**
A fast, disk-efficient package manager (alternative to npm/yarn).

**Why pnpm?**
- ✅ Faster installation
- ✅ Less disk space used
- ✅ Strict dependency resolution
- ✅ Better monorepo support

**Commands**:
```bash
pnpm install          # Install dependencies
pnpm add package      # Add new package
pnpm remove package   # Remove package
pnpm dev              # Run dev script
```

---

## 🤔 Why These Choices?

### Decision Matrix

| Requirement | Solution | Why? |
|------------|----------|------|
| Fast development | Next.js | Full-stack framework, less setup |
| Type safety | TypeScript | Catch errors early, better DX |
| SEO | Next.js SSR | Server-rendered content for crawlers |
| Styling | Tailwind | Rapid development, no CSS files |
| Database | MongoDB | Flexible schema, good for products |
| Authentication | JWT + Cookies | Stateless, secure |
| Images | Cloudinary | CDN, optimization, free tier |
| Validation | Zod | Type-safe, frontend/backend shared |

### Trade-offs Considered

```
Next.js vs. Create React App
├── Next.js: SSR, API routes, file routing ✅
└── CRA: Client-only, needs separate backend

MongoDB vs. PostgreSQL
├── MongoDB: Flexible schema, nested data ✅
└── PostgreSQL: Rigid schema, relational data

Tailwind vs. CSS Modules
├── Tailwind: Utility classes, rapid development ✅
└── CSS Modules: Traditional CSS, more verbose
```

---

## 📚 Next Steps

Now that you understand the technologies:

→ **Next**: [03 - Project Architecture](./03-PROJECT-ARCHITECTURE.md) - See how these technologies are organized

---

*Happy Learning! 🎉*
