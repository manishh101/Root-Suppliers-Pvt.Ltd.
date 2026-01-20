# 📚 15 - System Design & Architecture

> **Understanding the Architecture of Modern Web Applications**

---

## 📖 Table of Contents

1. [What is System Design?](#what-is-system-design)
2. [Monolith vs Microservices](#monolith-vs-microservices)
3. [Project Architecture Overview](#project-architecture-overview)
4. [Data Flow Patterns](#data-flow-patterns)
5. [API Design Principles](#api-design-principles)
6. [Database Design](#database-design)
7. [Caching Strategies](#caching-strategies)
8. [Security Architecture](#security-architecture)
9. [Scaling Considerations](#scaling-considerations)

---

## 🏗️ What is System Design?

System design is the process of defining the architecture, components, and data flow of a system to satisfy specific requirements.

### System Design Goals

**Functional Requirements** (What the system should do):
- Features and capabilities
- User interactions
- Business logic

**Non-Functional Requirements** (How well it should work):

| Requirement | Description |
|-------------|-------------|
| **Performance** | Fast response time |
| **Scalability** | Handle growth |
| **Reliability** | Always available |
| **Security** | Protected data |
| **Maintainability** | Easy to change |

---

## 🔄 Monolith vs Microservices

### This Project: Monolith

**Architecture:**
```
[Frontend (React)] → [API Routes] → [MongoDB]
         ↑________________________________↓
              All in ONE Next.js App
```

| ✅ Pros | ❌ Cons |
|---------|---------|
| Simple to deploy | Scales as whole unit |
| Easy to develop | Single point of failure |
| No network latency | Harder to scale teams |
| Shared code/types | Large codebase over time |

### Microservices (For Large Scale)

**Architecture:**

```
Frontend → API Gateway
                ↓
    +-----------+-----------+
    ↓           ↓           ↓
Product     User        Order
Service    Service     Service
    ↓           ↓           ↓
Product     User        Order
   DB         DB          DB
```

| ✅ Pros | ❌ Cons |
|---------|---------|
| Scale independently | Complex to deploy |
| Team autonomy | Network latency |
| Fault isolation | Distributed debugging |
| Tech flexibility | More infrastructure |

### When to Use What

| Monolith | Microservices |
|----------|---------------|
| Small to medium apps | Large, complex apps |
| Small team (1-5 devs) | Large team (10+ devs) |
| MVP/Prototypes | High traffic apps |
| Simple domain | Complex business domains |

---

## 🏛️ Project Architecture Overview

### Full Stack Architecture

**Root Suppliers Architecture:**

| Layer | Components | Responsibility |
|-------|------------|----------------|
| **Client (Browser)** | React Components, Client-side State, Form Validation | User interface, interactions |
| **Next.js Server** | Server Components (SSR), API Route Handlers, Middleware | Server-side rendering, API logic |
| **Data Layer** | MongoDB, Cloudinary, External Services | Data storage, images, third-party integrations |

**Data Flow:**
```
Browser → Next.js Server → MongoDB / Cloudinary / External APIs
```

### Folder Structure Explained

```
src/
├── app/                      # Next.js App Router
│   ├── (admin)/              # Admin section (grouped route)
│   │   └── admin/
│   │       ├── page.tsx      # Dashboard
│   │       ├── products/     # Product management
│   │       ├── categories/   # Category management
│   │       └── ...
│   ├── (public)/             # Public website (grouped route)
│   │   ├── page.tsx          # Homepage
│   │   ├── products/         # Product pages
│   │   └── ...
│   ├── api/                  # API Routes
│   │   ├── products/         # Product endpoints
│   │   ├── auth/             # Authentication
│   │   └── ...
│   └── layout.tsx            # Root layout
│
├── components/               # Reusable components
│   ├── ui/                   # Basic UI (Button, Input, etc.)
│   ├── layout/               # Layout components (Header, Footer)
│   └── sections/             # Page sections (Hero, Features)
│
├── lib/                      # Utility libraries
│   ├── db/                   # Database connection & models
│   ├── auth.ts               # Authentication utilities
│   ├── errors.ts             # Error handling
│   ├── validations/          # Zod schemas
│   └── utils.ts              # Helper functions
│
├── contexts/                 # React Contexts
│   └── SettingsContext.tsx
│
└── types/                    # TypeScript types
    └── index.ts
```

---

## 🔄 Data Flow Patterns

### 1. Server-Side Rendering (SSR)

**Flow:**
1. **User Request** → Browser sends request
2. **Next.js Server** → Fetches data from MongoDB
3. **Render** → React components rendered with data
4. **Response** → Complete HTML sent to browser
5. **Result** → User sees content immediately ✅ (Good for SEO)

### 2. Client-Side Data Fetching

**Flow:**
1. **Page Loads** → Browser loads page (empty or skeleton)
2. **useEffect Runs** → JavaScript runs after render
3. **API Call** → `fetch("/api/products")`
4. **Server Processes** →
   - Validate auth (if needed)
   - Query MongoDB
   - Return JSON
5. **State Updates** → Data stored in React state
6. **Re-render** → UI updates with products

### 3. Form Submission Flow

**Flow:**

| Step | Action |
|------|--------|
| 1 | User fills form |
| 2 | Client-side validation (Zod + React Hook Form) |
| 3 | If invalid → Show field errors |
| 4 | If valid → POST to `/api/products` |
| 5 | Middleware checks: auth token, rate limit, body validation |
| 6 | Route handler: business logic → save to MongoDB |
| 7 | Return response |
| 8 | Client shows success/error toast |

---

## 📡 API Design Principles

### RESTful Conventions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

### Request/Response Format

```typescript
// Request
POST /api/products
Content-Type: application/json
Cookie: auth-token=xxx

{
  "name": "Electric Drill",
  "price": 999,
  "category": "65abc123..."
}

// Success Response
{
  "success": true,
  "message": "Product created",
  "product": {
    "_id": "65xyz789...",
    "name": "Electric Drill",
    ...
  }
}

// Error Response
{
  "success": false,
  "message": "Validation error: name is required"
}
```

### API Versioning (Future)

```
/api/v1/products    # Current version
/api/v2/products    # Future version with breaking changes
```

---

## 💾 Database Design

### Document Relationships

**Collections and their relationships:**

| Collection | Key Fields | Relationships |
|------------|------------|---------------|
| **Category** | `_id`, `name`, `slug` | `parent` → Category (self-reference) |
| **Product** | `_id`, `name`, `price` | `category` → Category, `brand` → Brand |
| **Brand** | `_id`, `name`, `logo` | Referenced by Product |
| **User** | `_id`, `email`, `role` | Independent |

**Relationship Diagram:**

```
Category ←──────────────┐ (parent: self-reference)
    ↑                   │
    │ category          │
    │                   │
Product ─────────────► Brand
    │
    └── Stores: name, price, images, specifications
```

### Indexing Strategy

```typescript
// Single field indexes
ProductSchema.index({ slug: 1 }, { unique: true });
ProductSchema.index({ category: 1 });
ProductSchema.index({ isActive: 1 });

// Compound indexes
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ isFeatured: 1, isActive: 1 });

// Text index for search
ProductSchema.index({ 
  name: "text", 
  description: "text", 
  tags: "text" 
});
```

---

## 🚀 Caching Strategies

### Next.js Caching

```typescript
// Static generation (build time)
export const dynamic = 'force-static';

// Dynamic (no caching)
export const dynamic = 'force-dynamic';

// Revalidate every 60 seconds
export const revalidate = 60;

// On-demand revalidation
import { revalidatePath } from 'next/cache';
revalidatePath('/products');
```

### API Response Caching

```typescript
// Cache for 1 hour
return NextResponse.json(data, {
  headers: {
    'Cache-Control': 'public, s-maxage=3600'
  }
});
```

### Database Query Optimization

```typescript
// Use lean() for read-only queries
const products = await Product.find().lean();

// Select only needed fields
const products = await Product.find()
  .select('name price slug images')
  .lean();

// Use indexes for filtering
const products = await Product.find({
  category: categoryId,  // Indexed
  isActive: true         // Indexed
});
```

---

## 🔒 Security Architecture

### Defense in Depth

Security is implemented in multiple layers:

| Layer | Location | Protections |
|-------|----------|-------------|
| **Layer 1** | Edge (Middleware) | Rate limiting, Security headers, Route protection |
| **Layer 2** | API Routes | Auth verification, Authorization, Input validation (Zod) |
| **Layer 3** | Database | Parameterized queries, Password hashing, TLS connection |
| **Layer 4** | Infrastructure | HTTPS only, Environment variables, Secure cookies |

```
Request → [Middleware] → [API Route] → [Database]
             ↓               ↓              ↓
         Rate limit      Validate       Sanitize
         Headers         Auth           Encrypt
```

---

## 📈 Scaling Considerations

### Current Setup (Sufficient for ~10K daily users)

```
[Vercel Edge Network (CDN)]
            ↓
[Single Next.js Instance]
            ↓
[MongoDB Atlas (Shared Cluster)]
```

| Component | Current |
|-----------|---------|
| Frontend | Vercel CDN |
| Backend | Single Next.js instance |
| Database | MongoDB Atlas Shared |
| Images | Cloudinary CDN |

### Scaled Setup (For High Traffic)

```
[Global CDN (Cloudflare/Vercel)]
            ↓
    [Load Balancer]
     ↓     ↓     ↓
[App 1] [App 2] [App 3]
            ↓
    [Redis Cache]
            ↓
[MongoDB Atlas Dedicated + Replicas]
```

| Component | Scaled |
|-----------|--------|
| Frontend | Global CDN |
| Backend | Multiple instances + Load Balancer |
| Cache | Redis for sessions/queries |
| Database | Dedicated cluster + Read replicas |

### Scaling Strategies

| Strategy | When | Benefit |
|----------|------|---------|
| CDN | Always | Static asset caching |
| Database Indexes | When queries slow | Faster reads |
| Read Replicas | High read traffic | Distribute load |
| Redis Cache | Repeated queries | Reduce DB hits |
| Horizontal Scaling | High concurrent users | More capacity |

---

## 📚 Next Steps

Now that you understand system design:

→ **Next**: [16 - Codebase Walkthrough](./16-CODEBASE-WALKTHROUGH.md) - Detailed code explanation

---

*Design for Scale! 🏗️*

*Design for Scale! 🏗️*
