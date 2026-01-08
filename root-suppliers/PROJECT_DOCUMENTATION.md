# 📋 Root Suppliers Pvt. Ltd. - Project Documentation

> **Hardware Shop Website Development Project (v2 - Custom Build)**

---

## 🎯 Project Overview

| Field | Details |
|-------|---------|
| **Project** | Root Suppliers Website  |
| **Client** | Root Suppliers Pvt. Ltd. |
| **Location** | Biratnagar, Nepal |
| **Domain** | www.rootsuppliers.com.np |
| **Tech Stack** | Next.js 14 + MongoDB Atlas + Cloudinary + Tailwind CSS |
| **Project Type** | Fully Custom Website with Custom Admin Panel |
| **Purpose** | Online Product Catalogue & Lead Generation |
| **Created** | January 6, 2026 |

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.x | React Framework with App Router |
| **TypeScript** | 5.x | Type Safety |
| **Tailwind CSS** | 3.x | Utility-first CSS Framework |
| **Framer Motion** | 11.x | Animations & Transitions |
| **React Hook Form** | 7.x | Form Handling |
| **Zod** | 3.x | Schema Validation |
| **Lucide React** | Latest | Icon Library |
| **Embla Carousel** | 8.x | Touch-friendly Carousels |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js API Routes** | 14.x | RESTful API Endpoints |
| **MongoDB Atlas** | Latest | Cloud Database |
| **Mongoose** | 8.x | MongoDB ODM |
| **NextAuth.js** | 5.x | Authentication |
| **bcryptjs** | Latest | Password Hashing |
| **jsonwebtoken** | Latest | JWT Tokens |

### Media & Storage
| Technology | Purpose |
|------------|---------|
| **Cloudinary** | Image Storage & CDN |
| **next-cloudinary** | Cloudinary React Components |

### Development Tools
| Tool | Purpose |
|------|---------|
| **ESLint** | Code Linting |
| **Prettier** | Code Formatting |
| **pnpm** | Package Manager |

---

## 🎨 Design System

### Brand Colors

```css
/* Primary Colors - Cardinal Red */
--primary-50: #fef2f3;
--primary-100: #fee2e5;
--primary-200: #fecacd;
--primary-300: #fca5ab;
--primary-400: #f8717b;
--primary-500: #ef4352;
--primary-600: #C41E3A;  /* Main Primary */
--primary-700: #9B1B30;
--primary-800: #851d2d;
--primary-900: #721d2b;

/* Secondary Colors - Navy Blue */
--secondary-50: #f0f4ff;
--secondary-100: #e0e7ff;
--secondary-200: #c7d2fe;
--secondary-300: #a5b4fc;
--secondary-400: #818cf8;
--secondary-500: #6366f1;
--secondary-600: #1E3A8A;  /* Main Secondary */
--secondary-700: #1E3A6E;
--secondary-800: #1e1b4b;
--secondary-900: #0f0a30;

/* Neutral Colors */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;

/* Semantic Colors */
--success: #22c55e;
--warning: #f59e0b;
--error: #ef4444;
--info: #3b82f6;
```

### Typography

```css
/* Font Families */
--font-primary: 'Bank Gothic', 'Inter', sans-serif;
--font-secondary: 'Inter', system-ui, sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
```

### Spacing System

```css
/* Based on 4px grid */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

---

## 📁 Project Structure

```
root-suppliers-v2/
├── public/
│   ├── fonts/
│   │   ├── bank-gothic.woff2
│   │   └── inter-var.woff2
│   ├── images/
│   │   ├── logo.png
│   │   ├── logo-white.png
│   │   ├── favicon.ico
│   │   └── og-image.jpg
│   └── icons/
│
├── src/
│   ├── app/
│   │   ├── (public)/                    # Public routes
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                 # Homepage
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── categories/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── blogs/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── contact/
│   │   │   │   └── page.tsx
│   │   │   ├── gallery/
│   │   │   │   └── page.tsx
│   │   │   └── privacy-policy/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (admin)/                     # Admin routes
│   │   │   ├── layout.tsx
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx             # Dashboard
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── products/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── categories/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── blogs/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── inquiries/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── testimonials/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── brands/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── media/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── settings/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── users/
│   │   │   │       └── page.tsx
│   │   │
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── logout/
│   │   │   │   │   └── route.ts
│   │   │   │   └── session/
│   │   │   │       └── route.ts
│   │   │   ├── products/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── categories/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── blogs/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── inquiries/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── testimonials/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── brands/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── media/
│   │   │   │   └── route.ts
│   │   │   ├── settings/
│   │   │   │   └── route.ts
│   │   │   ├── search/
│   │   │   │   └── route.ts
│   │   │   └── upload/
│   │   │       └── route.ts
│   │   │
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   └── error.tsx
│   │
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminHeader.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── DashboardStats.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── ImageUploader.tsx
│   │   │   ├── RichTextEditor.tsx
│   │   │   └── forms/
│   │   │       ├── ProductForm.tsx
│   │   │       ├── CategoryForm.tsx
│   │   │       ├── BlogForm.tsx
│   │   │       ├── TestimonialForm.tsx
│   │   │       ├── BrandForm.tsx
│   │   │       └── SettingsForm.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MobileMenu.tsx
│   │   │   ├── MegaMenu.tsx
│   │   │   └── Container.tsx
│   │   │
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Breadcrumb.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   ├── Tabs.tsx
│   │   │   └── Switch.tsx
│   │   │
│   │   ├── sections/
│   │   │   ├── HeroCarousel.tsx
│   │   │   ├── FeaturedProducts.tsx
│   │   │   ├── TopBrands.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── VisitUs.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── StatsSection.tsx
│   │   │   ├── ProductGallery.tsx
│   │   │   ├── ProductSidebar.tsx
│   │   │   ├── RelatedProducts.tsx
│   │   │   ├── ContactInfo.tsx
│   │   │   └── CTASection.tsx
│   │   │
│   │   ├── cards/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── CategoryCard.tsx
│   │   │   ├── BlogCard.tsx
│   │   │   ├── TestimonialCard.tsx
│   │   │   └── BrandCard.tsx
│   │   │
│   │   └── forms/
│   │       ├── ContactForm.tsx
│   │       ├── ProductInquiryModal.tsx
│   │       └── SearchForm.tsx
│   │
│   ├── lib/
│   │   ├── db/
│   │   │   ├── connect.ts           # MongoDB connection
│   │   │   └── models/
│   │   │       ├── Product.ts
│   │   │       ├── Category.ts
│   │   │       ├── Blog.ts
│   │   │       ├── Inquiry.ts
│   │   │       ├── Testimonial.ts
│   │   │       ├── Brand.ts
│   │   │       ├── User.ts
│   │   │       ├── Media.ts
│   │   │       └── Settings.ts
│   │   │
│   │   ├── actions/
│   │   │   ├── products.ts
│   │   │   ├── categories.ts
│   │   │   ├── blogs.ts
│   │   │   ├── inquiries.ts
│   │   │   ├── testimonials.ts
│   │   │   ├── brands.ts
│   │   │   ├── media.ts
│   │   │   └── settings.ts
│   │   │
│   │   ├── utils.ts
│   │   ├── constants.ts
│   │   ├── animations.ts
│   │   ├── cloudinary.ts
│   │   ├── auth.ts
│   │   └── validations.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useToast.ts
│   │   ├── useModal.ts
│   │   ├── useDebounce.ts
│   │   └── useLocalStorage.ts
│   │
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── ToastContext.tsx
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   └── middleware.ts
│
├── .env.local
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── package.json
├── pnpm-lock.yaml
├── README.md
├── PROJECT_DOCUMENTATION.md
└── TODO.md
```

---

## 🗄️ Database Schema (MongoDB)

### Products Collection
```typescript
interface Product {
  _id: ObjectId;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;           // Rich text HTML
  category: ObjectId;            // Reference to Category
  images: {
    url: string;
    publicId: string;
    alt: string;
  }[];
  specifications: {
    key: string;
    value: string;
  }[];
  brand?: ObjectId;              // Reference to Brand
  model?: string;
  isFeatured: boolean;
  isTopSelling: boolean;
  isActive: boolean;
  orderIndex: number;
  meta: {
    title?: string;
    description?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Categories Collection
```typescript
interface Category {
  _id: ObjectId;
  name: string;
  slug: string;
  description?: string;
  image?: {
    url: string;
    publicId: string;
    alt: string;
  };
  icon?: string;                 // Lucide icon name
  parent?: ObjectId;             // Self-reference for subcategories
  isFeatured: boolean;
  isActive: boolean;
  orderIndex: number;
  productCount: number;          // Virtual/computed
  meta: {
    title?: string;
    description?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Blogs Collection
```typescript
interface Blog {
  _id: ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;               // Rich text HTML
  featuredImage: {
    url: string;
    publicId: string;
    alt: string;
  };
  author: ObjectId;              // Reference to User
  status: 'draft' | 'published';
  publishedAt?: Date;
  tags: string[];
  meta: {
    title?: string;
    description?: string;
  };
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Inquiries Collection
```typescript
interface Inquiry {
  _id: ObjectId;
  fullName: string;
  email?: string;
  phone: string;
  message: string;
  product?: ObjectId;            // Reference to Product (optional)
  source: 'contact_form' | 'product_inquiry' | 'whatsapp';
  status: 'new' | 'contacted' | 'converted' | 'closed';
  notes?: string;                // Admin notes
  createdAt: Date;
  updatedAt: Date;
}
```

### Testimonials Collection
```typescript
interface Testimonial {
  _id: ObjectId;
  customerName: string;
  customerDesignation?: string;
  customerImage?: {
    url: string;
    publicId: string;
  };
  rating: number;                // 1-5
  reviewText: string;
  isFeatured: boolean;
  isActive: boolean;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Brands Collection
```typescript
interface Brand {
  _id: ObjectId;
  name: string;
  slug: string;
  logo: {
    url: string;
    publicId: string;
  };
  websiteUrl?: string;
  description?: string;
  isFeatured: boolean;
  isActive: boolean;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Users Collection
```typescript
interface User {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;              // Hashed
  role: 'admin' | 'editor';
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Media Collection
```typescript
interface Media {
  _id: ObjectId;
  filename: string;
  url: string;
  publicId: string;              // Cloudinary public ID
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  caption?: string;
  folder?: string;
  uploadedBy: ObjectId;          // Reference to User
  createdAt: Date;
}
```

### Settings Collection (Single Document)
```typescript
interface Settings {
  _id: ObjectId;
  site: {
    name: string;
    tagline: string;
    logo: { url: string; publicId: string; };
    favicon: { url: string; publicId: string; };
  };
  contact: {
    primaryPhone: string;
    secondaryPhone?: string;
    primaryEmail: string;
    secondaryEmail?: string;
    address: string;
    googleMapsEmbed: string;
    googleMapsLink: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
  };
  businessHours: {
    day: string;
    hours: string;
  }[];
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    googleAnalyticsId?: string;
  };
  homepage: {
    heroSlides: {
      image: { url: string; publicId: string; };
      title: string;
      subtitle?: string;
      ctaText?: string;
      ctaLink?: string;
    }[];
    featuredProductsTitle: string;
    featuredProductsSubtitle?: string;
    aboutSectionContent: string;
    stats: {
      label: string;
      value: number;
      suffix?: string;
    }[];
  };
  updatedAt: Date;
}
```

---

## 🔐 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/logout` | Admin logout |
| GET | `/api/auth/session` | Get current session |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products (with filters) |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (Admin) |
| PUT | `/api/products/:id` | Update product (Admin) |
| DELETE | `/api/products/:id` | Delete product (Admin) |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| GET | `/api/categories/:id` | Get single category |
| POST | `/api/categories` | Create category (Admin) |
| PUT | `/api/categories/:id` | Update category (Admin) |
| DELETE | `/api/categories/:id` | Delete category (Admin) |

### Blogs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blogs` | Get all blogs |
| GET | `/api/blogs/:id` | Get single blog |
| POST | `/api/blogs` | Create blog (Admin) |
| PUT | `/api/blogs/:id` | Update blog (Admin) |
| DELETE | `/api/blogs/:id` | Delete blog (Admin) |

### Inquiries
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/inquiries` | Get all inquiries (Admin) |
| GET | `/api/inquiries/:id` | Get single inquiry (Admin) |
| POST | `/api/inquiries` | Create inquiry (Public) |
| PUT | `/api/inquiries/:id` | Update inquiry status (Admin) |
| DELETE | `/api/inquiries/:id` | Delete inquiry (Admin) |

### Other Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/testimonials` | Get testimonials |
| GET | `/api/brands` | Get brands |
| GET | `/api/settings` | Get site settings |
| PUT | `/api/settings` | Update settings (Admin) |
| POST | `/api/upload` | Upload image to Cloudinary |
| GET | `/api/search` | Search products |

---

## 🎨 Admin Panel Features

### Dashboard
- Total products, categories, blogs count
- New inquiries count (with badge)
- Recent inquiries list
- Quick action buttons
- Analytics overview (if GA connected)

### Products Management
- Data table with sorting & filtering
- Bulk actions (delete, toggle status)
- Image gallery upload
- Rich text editor for descriptions
- Specification builder (key-value pairs)
- Category & brand selection
- SEO meta fields
- Preview before publish

### Categories Management
- Hierarchical category display
- Drag & drop ordering
- Image upload
- Parent category selection
- Product count display

### Blog Management
- Rich text editor (WYSIWYG)
- Featured image upload
- Draft/Publish status
- Schedule publishing
- Tag management
- SEO preview

### Inquiry Management
- Inbox-style interface
- Status updates (new → contacted → converted → closed)
- Filter by status
- Export to CSV
- Quick reply (email integration - optional)

### Media Library
- Grid view of all uploaded images
- Upload multiple images
- Delete images
- Copy URL to clipboard
- Image details (size, dimensions)

### Settings
- Site information
- Contact details
- Social media links
- Business hours
- Homepage customization
- SEO defaults

### User Management (Super Admin only)
- Add/edit users
- Role assignment
- Password reset
- Activity logs

---

## 🔒 Environment Variables

```env
# ===== DATABASE =====
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/root_suppliers?retryWrites=true&w=majority

# ===== AUTHENTICATION =====
NEXTAUTH_SECRET=your-super-secret-key-minimum-32-characters
NEXTAUTH_URL=http://localhost:3000

# ===== CLOUDINARY =====
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=root_suppliers_unsigned

# ===== GOOGLE SERVICES =====
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# ===== SITE CONFIG =====
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Root Suppliers

# ===== EMAIL (Optional) =====
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@rootsuppliers.com.np
```

---

## 📱 Pages & Routes

### Public Pages
| Route | Page | Description |
|-------|------|-------------|
| `/` | Homepage | Hero, featured products, brands, testimonials |
| `/about` | About Us | Company info, vision, mission, stats |
| `/products` | Products | Product listing with filters & search |
| `/products/[slug]` | Product Detail | Single product with inquiry form |
| `/categories/[slug]` | Category | Products by category |
| `/blogs` | Blogs | Blog listing |
| `/blogs/[slug]` | Blog Detail | Single blog post |
| `/contact` | Contact | Contact form, map, info |
| `/gallery` | Gallery | Photo gallery |
| `/privacy-policy` | Privacy Policy | Legal page |
| `/terms` | Terms | Legal page |

### Admin Pages
| Route | Page | Description |
|-------|------|-------------|
| `/admin` | Dashboard | Overview & stats |
| `/admin/login` | Login | Admin authentication |
| `/admin/products` | Products | CRUD for products |
| `/admin/products/new` | New Product | Create product |
| `/admin/products/[id]` | Edit Product | Update product |
| `/admin/categories` | Categories | CRUD for categories |
| `/admin/blogs` | Blogs | CRUD for blogs |
| `/admin/inquiries` | Inquiries | View & manage leads |
| `/admin/testimonials` | Testimonials | CRUD for testimonials |
| `/admin/brands` | Brands | CRUD for brands |
| `/admin/media` | Media Library | Image management |
| `/admin/settings` | Settings | Site configuration |
| `/admin/users` | Users | User management |

---

## 🚀 Deployment

### Recommended Platform: Vercel
- Automatic deployments from GitHub
- Edge functions for API routes
- Built-in analytics
- Easy environment variable management

### Database: MongoDB Atlas
- Free tier available (512 MB)
- Automatic backups
- Global clusters

### Media: Cloudinary
- Free tier (25 credits/month)
- Automatic image optimization
- Responsive breakpoints

---

## 📋 Development Workflow

1. Clone repository
2. Install dependencies: `pnpm install`
3. Set up environment variables
4. Run development server: `pnpm dev`
5. Access site at `http://localhost:3000`
6. Access admin at `http://localhost:3000/admin`

### Scripts
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "format": "prettier --write .",
  "seed": "tsx scripts/seed.ts",
  "reset-db": "tsx scripts/reset-db.ts"
}
```

---

## 📞 Contact

**Client:** Root Suppliers Pvt. Ltd.  
**Location:** Biratnagar, Nepal  
**Website:** www.rootsuppliers.com.np

---

*Document Version: 1.0.0*  
*Last Updated: January 6, 2026*
