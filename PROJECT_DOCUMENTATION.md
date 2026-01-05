# 🔧 Roots Suppliers Pvt. Ltd.  - Hardware Shop Website

## Complete Project Documentation

**Project Name:** Roots Suppliers Website  
**Client:** Roots Suppliers Pvt. Ltd.  
**Location:** Biratnagar, Nepal  
**Domain:** www.rootsuppliers.com.np  
**Project Type:** Custom Dynamic Website with CMS  
**Purpose:** Online Product Catalogue & Lead Generation  

---

## 📋 Table of Contents

1. [Project Summary](#-project-summary)
2. [Target Audience](#-target-audience)
3. [Tech Stack](#-tech-stack)
4. [Design System](#-design-system)
5. [Site Architecture](#-site-architecture)
6. [Page Specifications](#-page-specifications)
7. [Database Schema](#-database-schema)
8. [Payload CMS Collections](#-payload-cms-collections)
9. [Component Structure](#-component-structure)
10. [Project Structure](#-project-structure)
11. [Security Implementation](#-security-implementation)
12. [SEO Strategy](#-seo-strategy)
13. [Performance Optimization](#-performance-optimization)
14. [Deployment Strategy](#-deployment-strategy)
15. [Environment Variables](#-environment-variables)
16. [Project Timeline](#-project-timeline)
17. [Post-Launch Support](#-post-launch-support)

---

## 🎯 Project Summary

### Business Overview
Roots Suppliers Pvt.  Ltd. is a hardware shop located in Biratnagar, Nepal, offering comprehensive construction and hardware solutions under one roof. Their tagline:  **"All Construction Solutions Under One Roof"**

### Business Requirements
| Requirement | Details |
|-------------|---------|
| Product Catalogue | 100-200 hardware products |
| E-commerce | ❌ No online sales |
| Payment Gateway | ❌ Not required |
| Lead Generation | ✅ Contact forms & inquiries |
| Content Management | ✅ Admin-managed dynamic content |
| Blog Section | ✅ Industry insights & updates |
| Inventory Management | ❌ Not required |
| Third-party Integration | ❌ None |
| Target Market | Local - Biratnagar, Nepal |

### Key Features
- ✅ Dynamic Product Catalogue with Categories
- ✅ Category-based Product Filtering & Search
- ✅ Lead Generation Contact Forms
- ✅ Blog/News Section
- ✅ Company Information & About Us
- ✅ Customer Testimonials
- ✅ Google Maps Integration
- ✅ Admin Dashboard (Payload CMS)
- ✅ Fully Responsive Design
- ✅ SEO Optimized
- ✅ Fast Loading (Cloudinary CDN)
- ✅ Nepali Local Business Schema

---

## 👥 Target Audience

### Customer Segments

| Segment | Description | Priority | Behavior |
|---------|-------------|----------|----------|
| Contractors | Construction professionals, bulk buyers | 🔴 High | Desktop, calls after browsing |
| House Builders | Individuals building new homes | 🔴 High | Mobile, form submissions |
| Local Businesses | Commercial hardware needs | 🟡 Medium | Desktop, email inquiries |
| General Public | Residential hardware buyers | 🟡 Medium | Mobile, quick browsing |
| Architects/Designers | Specification references | 🟢 Low | Desktop, detailed viewing |

### User Personas

**Persona 1: Ram Sharma (Contractor)**
- **Age:** 35-50
- **Occupation:** Building Contractor
- **Needs:** Quick product browsing, bulk inquiry, product specifications
- **Device:** Desktop/Laptop
- **Behavior:** Browses catalogue, notes products, calls for bulk pricing

**Persona 2:  Sita Devi (Homeowner)**
- **Age:** 28-45
- **Occupation:** Building new home
- **Needs:** Visual product gallery, easy contact, product variety
- **Device:** Mobile phone
- **Behavior:** Browses on mobile, submits inquiry forms

**Persona 3: Bikash Gupta (Shop Owner)**
- **Age:** 30-55
- **Occupation:** Local hardware retailer
- **Needs:** Wholesale information, product range
- **Device:** Both mobile and desktop
- **Behavior:** Looks for partnership/bulk deals

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.x | React Framework (App Router) |
| TypeScript | 5.x | Type Safety |
| Tailwind CSS | 3.4. x | Utility-first Styling |
| Framer Motion | 11.x | Animations & Transitions |
| React Hook Form | 7.x | Form Handling |
| Zod | 3.x | Schema Validation |
| Lucide React | Latest | Icon Library |
| Embla Carousel | 8.x | Carousels & Sliders |

### Backend & CMS
| Technology | Version | Purpose |
|------------|---------|---------|
| Payload CMS | 3.x | Headless CMS & Admin Panel |
| PostgreSQL | 15.x+ | Relational Database |
| Next.js API Routes | 14.x | API Endpoints |

### Infrastructure & Services
| Service | Purpose |
|---------|---------|
| Vercel | Hosting, Deployment, Edge Functions |
| Cloudinary | Image Storage, Optimization, CDN |
| Neon / Vercel Postgres | PostgreSQL Database Hosting |
| Google Maps API | Location & Directions |
| Google Analytics 4 | Analytics & Tracking |
| Google Search Console | SEO Monitoring |

### Development Tools
| Tool | Purpose |
|------|---------|
| pnpm | Package Manager |
| ESLint | Code Linting |
| Prettier | Code Formatting |
| Husky | Git Hooks |
| lint-staged | Pre-commit Linting |
| TypeScript | Static Type Checking |

---

## 🎨 Design System

### Brand Identity

**Logo:** Circular red emblem with "Roots Suppliers Pvt. Ltd." text
**Tagline:** "All Construction Solutions Under One Roof"

### Brand Colors

```css
: root {
  /* ========== PRIMARY COLORS (From Logo) ========== */
  
  /* Red Palette - Primary Brand Color */
  --color-primary: #C41E3A;           /* Primary Red */
  --color-primary-dark: #9B1B30;      /* Darker Red - Hover states */
  --color-primary-light:  #E63950;     /* Lighter Red - Accents */
  --color-primary-50: #FEF2F2;        /* Red tint - Backgrounds */
  --color-primary-100: #FEE2E2;       /* Red tint - Light backgrounds */
  --color-primary-500: #C41E3A;       /* Red - Primary */
  --color-primary-600: #9B1B30;       /* Red - Hover */
  --color-primary-700: #7F1D2B;       /* Red - Active */
  
  /* Blue Palette - Secondary Brand Color */
  --color-secondary: #1E3A8A;         /* Primary Blue */
  --color-secondary-dark: #1E3A6E;    /* Darker Blue - Hover states */
  --color-secondary-light:  #3B82F6;   /* Lighter Blue - Accents */
  --color-secondary-50: #EFF6FF;      /* Blue tint - Backgrounds */
  --color-secondary-100: #DBEAFE;     /* Blue tint - Light backgrounds */
  --color-secondary-500: #1E3A8A;     /* Blue - Primary */
  --color-secondary-600: #1E3A6E;     /* Blue - Hover */
  --color-secondary-700: #1E3050;     /* Blue - Active */
  
  /* ========== NEUTRAL COLORS ========== */
  --color-white: #FFFFFF;
  --color-off-white: #F8FAFC;
  --color-gray-50: #F9FAFB;
  --color-gray-100: #F3F4F6;
  --color-gray-200: #E5E7EB;
  --color-gray-300: #D1D5DB;
  --color-gray-400: #9CA3AF;
  --color-gray-500: #6B7280;
  --color-gray-600: #4B5563;
  --color-gray-700: #374151;
  --color-gray-800: #1F2937;
  --color-gray-900: #111827;
  --color-black: #0F172A;
  
  /* ========== SEMANTIC COLORS ========== */
  --color-success: #22C55E;
  --color-success-light: #DCFCE7;
  --color-warning: #F59E0B;
  --color-warning-light: #FEF3C7;
  --color-error: #EF4444;
  --color-error-light: #FEE2E2;
  --color-info: #3B82F6;
  --color-info-light: #DBEAFE;
}
```

### Tailwind Configuration

```typescript
// tailwind. config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C41E3A',
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#E63950',
          500: '#C41E3A',
          600: '#9B1B30',
          700: '#7F1D2B',
          800: '#5C1520',
          900: '#450A14',
        },
        secondary: {
          DEFAULT: '#1E3A8A',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#3B82F6',
          500: '#1E3A8A',
          600: '#1E3A6E',
          700: '#1E3050',
          800: '#162040',
          900: '#0F1629',
        },
      },
      fontFamily: {
        primary: ['BankGothic MD BT', 'Arial Black', 'Helvetica Neue', 'sans-serif'],
        secondary: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'nav': '0 2px 10px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
export default config
```

### Color Usage Guidelines

| Element | Color | Variable |
|---------|-------|----------|
| Primary CTA Buttons | Red | `--color-primary` |
| Secondary Buttons | Blue | `--color-secondary` |
| Navigation Bar | White bg, Blue text | `white` / `secondary` |
| Navigation Links Hover | Red | `--color-primary` |
| Footer Background | Dark Gray/Charcoal | `--color-gray-800` |
| Headings | Dark Gray | `--color-gray-900` |
| Body Text | Medium Gray | `--color-gray-600` |
| Page Background | Off White | `--color-off-white` |
| Cards | White | `--color-white` |
| Category Badges | Red Light bg | `--color-primary-100` |
| Links | Blue | `--color-secondary` |
| Active/Selected | Red | `--color-primary` |

### Typography

#### Font Setup

```css
/* src/app/globals.css */

/* Primary Font - Bank Gothic MD BT */
@font-face {
  font-family: 'BankGothic MD BT';
  src: url('/fonts/BankGothicMdBT. woff2') format('woff2'),
       url('/fonts/BankGothicMdBT.woff') format('woff');
  font-weight:  500;
  font-style: normal;
  font-display: swap;
}

/* Secondary Font - Inter (Google Fonts) */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
```

#### Typography Scale

| Element | Font Family | Size (Desktop) | Size (Mobile) | Weight | Line Height |
|---------|-------------|----------------|---------------|--------|-------------|
| H1 | BankGothic MD BT | 48px / 3rem | 32px / 2rem | 500 | 1.2 |
| H2 | BankGothic MD BT | 36px / 2.25rem | 28px / 1.75rem | 500 | 1.25 |
| H3 | BankGothic MD BT | 28px / 1.75rem | 24px / 1.5rem | 500 | 1.3 |
| H4 | BankGothic MD BT | 24px / 1.5rem | 20px / 1.25rem | 500 | 1.35 |
| H5 | BankGothic MD BT | 20px / 1.25rem | 18px / 1.125rem | 500 | 1.4 |
| H6 | BankGothic MD BT | 18px / 1.125rem | 16px / 1rem | 500 | 1.45 |
| Body Large | Inter | 18px / 1.125rem | 16px / 1rem | 400 | 1.6 |
| Body | Inter | 16px / 1rem | 14px / 0.875rem | 400 | 1.6 |
| Body Small | Inter | 14px / 0.875rem | 13px / 0.8125rem | 400 | 1.5 |
| Caption | Inter | 12px / 0.75rem | 11px / 0.6875rem | 400 | 1.4 |
| Button | BankGothic MD BT | 14px / 0.875rem | 14px | 500 | 1.2 |
| Nav Link | BankGothic MD BT | 14px / 0.875rem | 14px | 500 | 1.2 |

### Spacing System

```css
/* Using Tailwind's default spacing scale */
--spacing-0: 0;
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
--spacing-20: 5rem;     /* 80px */
--spacing-24: 6rem;     /* 96px */
--spacing-32: 8rem;     /* 128px */
```

### Component Styles

#### Buttons

```css
/* Primary Button */
.btn-primary {
  @apply bg-primary text-white font-primary text-sm uppercase tracking-wider
         px-6 py-3 rounded-md
         hover:bg-primary-600 active:bg-primary-700
         transition-all duration-200 ease-in-out
         shadow-md hover:shadow-lg;
}

/* Secondary Button */
.btn-secondary {
  @apply bg-secondary text-white font-primary text-sm uppercase tracking-wider
         px-6 py-3 rounded-md
         hover:bg-secondary-600 active:bg-secondary-700
         transition-all duration-200 ease-in-out;
}

/* Outline Button */
.btn-outline {
  @apply border-2 border-primary text-primary font-primary text-sm uppercase
         px-6 py-3 rounded-md
         hover:bg-primary hover:text-white
         transition-all duration-200 ease-in-out;
}

/* Ghost Button */
.btn-ghost {
  @apply text-secondary font-primary text-sm uppercase
         px-4 py-2
         hover:text-primary
         transition-colors duration-200;
}
```

#### Cards

```css
/* Product Card */
.card-product {
  @apply bg-white rounded-lg overflow-hidden
         shadow-card hover:shadow-card-hover
         transition-shadow duration-300 ease-in-out;
}

/* Blog Card */
.card-blog {
  @apply bg-white rounded-lg overflow-hidden
         border border-gray-100
         hover:border-primary-200
         transition-all duration-300;
}

/* Testimonial Card */
. card-testimonial {
  @apply bg-white rounded-xl p-6
         border border-gray-100
         shadow-sm;
}
```

#### Form Elements

```css
/* Input Field */
. input-field {
  @apply w-full px-4 py-3 
         border border-gray-300 rounded-md
         font-secondary text-gray-700
         placeholder: text-gray-400
         focus:outline-none focus:ring-2 focus: ring-primary-300 focus:border-primary
         transition-all duration-200;
}

/* Textarea */
.textarea-field {
  @apply w-full px-4 py-3 
         border border-gray-300 rounded-md
         font-secondary text-gray-700
         placeholder:text-gray-400
         focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary
         resize-none
         transition-all duration-200;
}

/* Label */
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}
```

### Breakpoints

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

### Animation Guidelines

```css
/* Fade In Up */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform:  translateY(0);
  }
}

/* Slide In Left */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform:  translateX(0);
  }
}

/* Pulse for CTAs */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Usage with Framer Motion */
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate:  { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};
```

---

## 🗺️ Site Architecture

### Sitemap

```
📁 Root (www. rootsuppliers.com.np)
│
├── 📄 Home (/)
│
├── 📁 Products (/products)
│   ├── 📄 All Products (/products)
│   ├── 📄 Filtered by Category (/products? category=plumbing)
│   └── 📄 Product Detail (/products/[slug])
│
├── 📁 Categories (/categories)
│   └── 📄 Category Detail (/categories/[slug])
│
├── 📄 About Us (/about)
│
├── 📄 Gallery (/gallery)
│
├── 📁 Blog (/blog)
│   └── 📄 Blog Post (/blog/[slug])
│
├── 📄 Contact Us (/contact)
│
├── 📄 Privacy Policy (/privacy-policy)
│
├── 📄 Terms & Conditions (/terms)
│
└── 📁 Admin Panel (/admin) - Payload CMS
    ├── 📄 Dashboard
    ├── 📄 Products Management
    ├── 📄 Categories Management
    ├── 📄 Blog Management
    ├── 📄 Inquiries/Leads
    ├── 📄 Testimonials
    ├── 📄 Media Library
    └── 📄 Settings
```

### URL Structure

| Page | URL Pattern | Example |
|------|-------------|---------|
| Home | `/` | `/` |
| All Products | `/products` | `/products` |
| Products by Category | `/products?category={slug}` | `/products?category=plumbing` |
| Product Detail | `/products/{slug}` | `/products/stainless-steel-gate-valve` |
| Category Page | `/categories/{slug}` | `/categories/electrical-lighting` |
| About Us | `/about` | `/about` |
| Gallery | `/gallery` | `/gallery` |
| All Blogs | `/blog` | `/blog` |
| Blog Post | `/blog/{slug}` | `/blog/choosing-right-hardware` |
| Contact | `/contact` | `/contact` |
| Privacy Policy | `/privacy-policy` | `/privacy-policy` |
| Terms | `/terms` | `/terms` |
| Admin | `/admin` | `/admin` |

### Navigation Structure

**Header Navigation:**
```
┌─────────────────────────────────────────────────────────────────────┐
│ [LOGO]          HOME | CATEGORIES ▼ | BLOGS | CONTACT US | ABOUT US │
│                                                     [Search] 📞 Phone│
└─────────────────────────────────────────────────────────────────────┘
```

**Categories Mega Menu:**
```
┌─────────────────────────────────────────────────────────────────┐
│ Plumbing & Bathroom  │  Electrical & Lighting  │  Tools & Equip │
│ • Pipes & Fittings   │  • Wires & Cables       │  • Power Tools │
│ • Taps & Faucets     │  • Switches & Sockets   │  • Hand Tools  │
│ • Bathroom Access.    │  • Lighting Fixtures    │  • Measuring   │
├──────────────────────┼─────────────────────────┼────────────────┤
│ Construction Mat.     │  Paints & Finishes      │  Safety & Sec.  │
│ • Cement & Mortar    │  • Wall Paints          │  • Locks       │
│ • Steel & Iron       │  • Wood Finishes        │  • CCTV        │
│ • Roofing Materials  │  • Primers              │  • Alarms      │
└─────────────────────────────────────────────────────────────────┘
```

**Footer Structure:**
```
┌─────────────────────────────────────────────────────────────────────┐
│ [LOGO]                                                              │
│ All Construction Solutions                                          │
│ Under One Roof                                                      │
│ 📘 📷                                                                │
├─────────────────┬──────────────────┬─────────────────┬──────────────┤
│ Quick Links     │ Our Products     │ Contact Us      │              │
│ • Home          │ • Plumbing       │ 📞 +977-XXX     │              │
│ • Categories    │ • Electrical     │ 📧 info@...      │              │
│ • Contact Us    │ • Tools          │ 📍 Biratnagar   │              │
│ • About Us      │ • Paints         │ 🕐 Sun-Fri      │              │
│                 │ • Safety         │    10AM-6PM     │              │
└─────────────────┴──────────────────┴─────────────────┴──────────────┘
│ © 2024 Roots Suppliers Pvt. Ltd. All Rights Reserved.               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📄 Page Specifications

### 1. Home Page (`/`)

Based on wireframe - Reference Image 1 & 2 (Home page section)

#### Layout Sections

**1. 1 Header (Global)**
```
┌─────────────────────────────────────────────────────────────────────┐
│ [LOGO - Red Circle]     "ALL CONSTRUCTION"     📞 +977XXXXXXXX      │
│                         "SOLUTIONS UNDER THE"   📍 Location         │
│                         "ROOF"                                      │
├─────────────────────────────────────────────────────────────────────┤
│ HOME | CATEGORIES | BLOGS | CONTACT US | ABOUT US      [🔍 Search] │
└─────────────────────────────────────────────────────────────────────┘
```

**1.2 Hero Section / Top Selling Products**
- Full-width carousel/slider
- Auto-rotating (5 second intervals)
- Manual navigation arrows (left/right)
- Dot indicators
- 3-4 featured product images
- Optional overlay text/CTA

**1.3 Top Brands Under One Roof**
- Section title:  "TOP BRANDS UNDER ONE ROOF"
- Logo carousel with navigation arrows
- Display 5-6 brand logos visible at once
- Auto-scroll with manual override

**1.4 Featured Products Grid**
- Section title: "FEATURED PRODUCTS"
- Grid:  2 rows × 4 columns (desktop), 2×2 (mobile)
- Product cards with image, name
- One featured/highlighted product (larger or styled)
- "VIEW ALL PRODUCTS" CTA button

**1.5 Who Are We?  + Why Choose Us? **
- Two-column layout
- Left: Company logo, description text
- Right: 3 value proposition cards
  - Quality Products
  - Best Prices
  - Trusted Service

**1.6 Visit Us Section**
- Section title: "Visit Us"
- Contact information card
- Embedded Google Map
- "Get Directions" button
- Business hours display

**1.7 Customer Testimonials**
- Section title: "What Our Customer Says"
- Carousel of testimonial cards
- Each card:  Customer photo, name, rating, review text
- Dot navigation indicators

**1.8 Footer (Global)**
- Company logo and tagline
- Social media icons
- Quick Links column
- Our Products column
- Contact Us column
- Copyright notice

---

### 2. Categories/Products Page (`/products`)

Based on wireframe - Reference Image 1 & 2 (Categories section)

#### Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│                           HEADER                                    │
├─────────────────────────────────────────────────────────────────────┤
│ OUR PRODUCTS                                                        │
│ All Construction Solutions Under One Roof                           │
├──────────────────┬──────────────────────────────────────────────────┤
│                  │                                                  │
│  SIDEBAR         │         PRODUCT GRID                             │
│                  │                                                  │
│  ┌────────────┐  │   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │
│  │ Search...   │  │   │      │ │      │ │      │ │      │          │
│  └────────────┘  │   │ IMG  │ │ IMG  │ │ IMG  │ │ IMG  │          │
│                  │   │      │ │      │ │      │ │      │          │
│  Categories      │   ├──────┤ ├──────┤ ├──────┤ ├──────┤          │
│  ┌────────────┐  │   │ Name │ │ Name │ │ Name │ │ Name │          │
│  │ □ Hardware │  │   └──────┘ └──────┘ └──────┘ └──────┘          │
│  │ □ Plumbing │  │                                                  │
│  │ □ Electric │  │   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │
│  │ □ Tools    │  │   │      │ │      │ │      │ │      │          │
│  │ □ Paints   │  │   │ IMG  │ │ IMG  │ │ IMG  │ │ IMG  │          │
│  │ □ Safety   │  │   │      │ │      │ │      │ │      │          │
│  │ □ Cement   │  │   ├──────┤ ├──────┤ ├──────┤ ├──────┤          │
│  │ □ Bathroom │  │   │ Name │ │ Name │ │ Name │ │ Name │          │
│  │ □ Roofing  │  │   └──────┘ └──────┘ └──────┘ └──────┘          │
│  └────────────┘  │                                                  │
│                  │              [PAGINATION]                        │
│                  │              < 1 2 3 4 5 >                       │
│                  │                                                  │
└──────────────────┴──────────────────────────────────────────────────┘
│                           FOOTER                                    │
└─────────────────────────────────────────────────────────────────────┘
```

#### Features
- **Sidebar (Desktop)**
  - Search input field
  - Category filter checkboxes
  - Collapsible on mobile (filter button)

- **Product Grid**
  - 4 columns (desktop), 2 columns (tablet), 1-2 columns (mobile)
  - 12-16 products per page
  - Lazy loading images

- **Product Card**
  ```
  ┌─────────────────┐
  │                 │
  │   Product       │
  │   Image         │
  │                 │
  ├─────────────────┤
  │ Product Name    │
  │ [Category]      │
  └─────────────────┘
  ```

- **Pagination**
  - Show page numbers
  - Previous/Next arrows
  - "Showing X-X of Y products"

---

### 3. Product Detail Page (`/products/[slug]`)

#### Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ Breadcrumb:  Home > Products > Category > Product Name               │
├───────────────────────────────┬─────────────────────────────────────┤
│                               │                                     │
│   ┌─────────────────────┐     │  Category Badge:  [PLUMBING]         │
│   │                     │     │                                     │
│   │                     │     │  Product Name                       │
│   │    MAIN IMAGE       │     │  ════════════════════════           │
│   │                     │     │                                     │
│   │                     │     │  Product Description                │
│   │                     │     │  Lorem ipsum dolor sit amet...       │
│   └─────────────────────┘     │                                     │
│                               │                                     │
│   ┌────┐ ┌────┐ ┌────┐ ┌────┐│  Specifications:                     │
│   │ T1 │ │ T2 │ │ T3 │ │ T4 ││  • Material:  Stainless Steel       │
│   └────┘ └────┘ └────┘ └────┘│  • Size: 1 inch                     │
│   (Thumbnail Gallery)        │  • Brand: XYZ Brand                 │
│                               │  • Model: ABC-123                   │
│                               │                                     │
│                               │  ┌─────────────────────────────┐   │
│                               │  │ 📞 ENQUIRE ABOUT THIS       │   │
│                               │  │    PRODUCT                   │   │
│                               │  └─────────────────────────────┘   │
│                               │                                     │
│                               │  ┌─────────────────────────────┐   │
│                               │  │ 📱 WhatsApp Inquiry         │   │
│                               │  └─────────────────────────────┘   │
├───────────────────────────────┴─────────────────────────────────────┤
│                                                                     │
│  RELATED PRODUCTS                                                   │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                               │
│  │ IMG  │ │ IMG  │ │ IMG  │ │ IMG  │                               │
│  │ Name │ │ Name │ │ Name │ │ Name │                               │
│  └──────┘ └──────┘ └──────┘ └──────┘                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### Features
- **Image Gallery**
  - Main large image
  - Thumbnail strip (4-6 images)
  - Click thumbnail to change main image
  - Lightbox/zoom on click

- **Product Information**
  - Category badge (colored)
  - Product name (H1)
  - Description (rich text)
  - Specifications table
  - CTA buttons

- **Inquiry Section**
  - "Enquire About This Product" button
  - Opens modal with pre-filled product name
  - WhatsApp direct link

- **Related Products**
  - 4 products from same category
  - Horizontal scroll on mobile

---

### 4. About Us Page (`/about`)

Based on wireframe - Reference Image 1 & 2 (About Us section)

#### Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ ABOUT ROOTS SUPPLIERS PVT. LTD.                                     │
│ All Construction Solutions Under One Roof                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐    WELCOME                                     │
│  │                 │    Roots Suppliers Pvt. Ltd.                   │
│  │   Company       │                                                │
│  │   Image         │    Company description paragraph...             │
│  │                 │    Our history and journey...                  │
│  │                 │    What we offer...                            │
│  └─────────────────┘                                                │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    Our Vision & Mission                             │
│                                                                     │
│  ┌───────────────────────┐  ┌───────────────────────┐              │
│  │     Our Mission       │  │      Our Vision       │              │
│  │                       │  │                       │              │
│  │ Mission statement...   │  │ Vision statement...   │              │
│  └───────────────────────┘  └───────────────────────┘              │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                            │
│  │  IMAGE   │ │  IMAGE   │ │  IMAGE   │  (Company/Showroom Photos) │
│  └──────────┘ └──────────┘ └──────────┘                            │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│         ┌────────────┐  ┌────────────┐  ┌────────────┐             │
│         │   1000+    │  │   2000+    │  │   100%     │             │
│         │  products  │  │  customers │  │satisfaction│             │
│         └────────────┘  └────────────┘  └────────────┘             │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Our Products                                                       │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                      │
│  │ Cat  │ │ Cat  │ │ Cat  │ │ Cat  │ │ Cat  │                      │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘                      │
│                    [VIEW MORE PRODUCTS]                             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### Sections
1. Page Header with title
2. Welcome section with image + description
3. Vision & Mission cards
4. Company photo gallery
5. Statistics counters (animated)
6. Product categories preview

---

### 5. Blog Page (`/blog`)

Based on wireframe - Reference Image 1 & 2 (Blogs section)

#### Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ BLOGS                                                               │
│ Expert Guidance & Construction Tips to Keep You Up to Date          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ ┌─────────┐                                                    │ │
│  │ │  IMAGE  │  Blog Title Here                                   │ │
│  │ │         │  Lorem ipsum dolor sit amet, consectetur...         │ │
│  │ │         │  📅 Jan 5, 2026                    [Read More →]   │ │
│  │ └─────────┘                                                    │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ ┌─────────┐                                                    │ │
│  │ │  IMAGE  │  Another Blog Title                                │ │
│  │ │         │  Description text goes here...                     │ │
│  │ │         │  📅 Jan 3, 2026                    [Read More →]   │ │
│  │ └─────────┘                                                    │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│                    [LOAD MORE / PAGINATION]                         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### Blog Card Features
- Featured image (left side)
- Title (H3)
- Excerpt (2-3 lines)
- Published date
- Read More link

---

### 6. Blog Detail Page (`/blog/[slug]`)

#### Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ Breadcrumb: Home > Blog > Blog Title                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Blog Title Goes Here                                               │
│  ═══════════════════════════════════════════                        │
│                                                                     │
│  📅 Published: Jan 5, 2026  |  👤 By:  Admin  |  🏷️ Category        │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │                    FEATURED IMAGE                           │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Blog content paragraph 1...                                         │
│                                                                     │
│  Blog content paragraph 2...                                        │
│                                                                     │
│  ## Subheading                                                      │
│                                                                     │
│  More content...                                                    │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Related Posts                                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                            │
│  │  Post 1  │ │  Post 2  │ │  Post 3  │                            │
│  └──────────┘ └──────────┘ └──────────┘                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 7. Contact Us Page (`/contact`)

Based on wireframe - Reference Image 1 & 2 (Contact Us section)

#### Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ CONTACT US                                                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Get In Touch With Us                 Contact Information           │
│  ─────────────────────               ─────────────────────          │
│                                                                     │
│  Full Name *                          📍 Our Location              │
│  ┌─────────────────────────┐             Biratnagar-XX, Nepal      │
│  │                         │                                        │
│  └─────────────────────────┘          📞 Phone Number              │
│                                          +977-XXX-XXXXXXX           │
│  Phone Number *                                                     │
│  ┌─────────────────────────┐          📧 Email Address             │
│  │                         │             info@rootsuppliers.com. np │
│  └─────────────────────────┘                                        │
│                                       🕐 Business Hours            │
│  Email Address                           Sun-Fri: 10AM - 6PM       │
│  ┌─────────────────────────┐             Sat: 10AM - 2PM           │
│  │                         │                                        │
│  └─────────────────────────┘          Connect With Us              │
│                                       📘 📷 (Social icons)          │
│  Message *                                                          │
│  ┌─────────────────────────┐                                        │
│  │                         │                                        │
│  │                         │                                        │
│  │                         │                                        │
│  └─────────────────────────┘                                        │
│                                                                     │
│  [       SEND MESSAGE      ]                                        │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Visit Us                                                           │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                                                              │  │
│  │                      GOOGLE MAP EMBED                        │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌─────────────────┐  ┌─────────────────┐                          │
│  │  [Showroom 1]   │  │  [Showroom 2]   │  (Location photos)       │
│  └─────────────────┘  └─────────────────┘                          │
│                                                                     │
│            [GET DIRECTIONS]                                         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### Form Fields
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Full Name | text | Yes | Min 2 characters |
| Phone Number | tel | Yes | Valid phone format |
| Email Address | email | No | Valid email format |
| Message | textarea | Yes | Min 10 characters |

#### Features
- Form validation with error messages
- Success toast on submission
- Form data saved to Payload CMS (Inquiries collection)
- Email notification to admin
- Google Maps embed
- Get Directions button (opens Google Maps)

---

## 🗄️ Database Schema

### PostgreSQL Tables (Managed by Payload CMS)

```sql
-- Categories Table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_id INTEGER REFERENCES media(id),
    parent_id INTEGER REFERENCES categories(id),
    order_index INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    category_id INTEGER REFERENCES categories(id),
    is_featured BOOLEAN DEFAULT false,
    is_top_selling BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    specifications JSONB,
    brand VARCHAR(255),
    model VARCHAR(255),
    meta_title VARCHAR(255),
    meta_description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product Images (Many-to-One)
CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    media_id INTEGER REFERENCES media(id),
    is_primary BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0
);

-- Blogs Table
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content JSONB NOT NULL, -- Rich text content
    featured_image_id INTEGER REFERENCES media(id),
    author_id INTEGER REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'draft', -- draft, published
    published_at TIMESTAMP,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inquiries/Leads Table
CREATE TABLE inquiries (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    product_id INTEGER REFERENCES products(id), -- Optional, if inquiry is about specific product
    source VARCHAR(50) DEFAULT 'contact_form', -- contact_form, product_inquiry, whatsapp
    status VARCHAR(50) DEFAULT 'new', -- new, contacted, converted, closed
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials Table
CREATE TABLE testimonials (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_designation VARCHAR(255),
    customer_image_id INTEGER REFERENCES media(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Brands Table
CREATE TABLE brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    logo_id INTEGER REFERENCES media(id),
    website_url VARCHAR(500),
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Media Table
CREATE TABLE media (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    alt_text VARCHAR(255),
    caption TEXT,
    mime_type VARCHAR(100),
    file_size INTEGER,
    width INTEGER,
    height INTEGER,
    cloudinary_id VARCHAR(255), -- Cloudinary public ID
    url VARCHAR(500) NOT NULL, -- Cloudinary URL
    thumbnail_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Site Settings (Singleton)
CREATE TABLE site_settings (
    id SERIAL PRIMARY KEY,
    site_name VARCHAR(255) DEFAULT 'Roots Suppliers Pvt. Ltd.',
    tagline VARCHAR(255) DEFAULT 'All Construction Solutions Under One Roof',
    logo_id INTEGER REFERENCES media(id),
    favicon_id INTEGER REFERENCES media(id),
    phone_primary VARCHAR(50),
    phone_secondary VARCHAR(50),
    email_primary VARCHAR(255),
    email_secondary VARCHAR(255),
    address TEXT,
    google_maps_embed TEXT,
    google_maps_link VARCHAR(500),
    business_hours JSONB,
    social_facebook VARCHAR(500),
    social_instagram VARCHAR(500),
    social_twitter VARCHAR(500),
    social_linkedin VARCHAR(500),
    meta_title VARCHAR(255),
    meta_description TEXT,
    google_analytics_id VARCHAR(50),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Homepage Settings
CREATE TABLE homepage_settings (
    id SERIAL PRIMARY KEY,
    hero_slides JSONB, -- Array of slide objects
    featured_products_title VARCHAR(255),
    featured_products_subtitle VARCHAR(255),
    about_section_content TEXT,
    stats JSONB, -- Array of stat objects {label, value, suffix}
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users Table (Payload built-in, extended)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'editor', -- admin, editor
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📦 Payload CMS Collections

### Collection Configurations

```typescript
// src/payload/collections/index.ts

export { Categories } from './Categories'
export { Products } from './Products'
export { Blogs } from './Blogs'
export { Inquiries } from './Inquiries'
export { Testimonials } from './Testimonials'
export { Brands } from './Brands'
export { Media } from './Media'
export { Users } from './Users'
```

### 1. Categories Collection

```typescript
// src/payload/collections/Categories.ts
import { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Category',
    plural: 'Categories',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'isFeatured', 'isActive'],
    group: 'Products',
  },
  access: {
    read: () => true,
  },
  fields:  [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    slugField('name'),
    {
      name: 'description',
      type:  'textarea',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name:  'parent',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: false,
      admin: {
        description: 'Select parent category for subcategories',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Featured on Homepage',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue:  true,
      label: 'Active',
    },
    {
      name:  'orderIndex',
      type: 'number',
      defaultValue:  0,
      admin: {
        description: 'Lower numbers appear first',
      },
    },
    {
      name:  'meta',
      type: 'group',
      fields: [
        {
          name: 'title',
          type:  'text',
          label: 'Meta Title',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Meta Description',
        },
      ],
    },
  ],
}
```

### 2. Products Collection

```typescript
// src/payload/collections/Products.ts
import { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'

export const Products: CollectionConfig = {
  slug:  'products',
  labels: {
    singular: 'Product',
    plural: 'Products',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'isFeatured', 'isActive'],
    group: 'Products',
  },
  access:  {
    read:  () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required:  true,
    },
    slugField('name'),
    {
      name: 'shortDescription',
      type: 'textarea',
      maxLength: 300,
      admin: {
        description: 'Brief description for product cards (max 300 chars)',
      },
    },
    {
      name: 'description',
      type:  'richText',
      label: 'Full Description',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo:  'categories',
      required: true,
      hasMany: false,
    },
    {
      name: 'images',
      type:  'array',
      label: 'Product Images',
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'isPrimary',
          type: 'checkbox',
          defaultValue: false,
          label: 'Primary Image',
        },
      ],
    },
    {
      name: 'specifications',
      type:  'array',
      label:  'Specifications',
      fields: [
        {
          name: 'label',
          type:  'text',
          required: true,
        },
        {
          name:  'value',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'brand',
      type: 'relationship',
      relationTo: 'brands',
      hasMany: false,
    },
    {
      name: 'model',
      type: 'text',
      label: 'Model Number',
    },
    {
      type: 'row',
      fields:  [
        {
          name: 'isFeatured',
          type: 'checkbox',
          defaultValue: false,
          label: 'Featured Product',
        },
        {
          name: 'isTopSelling',
          type:  'checkbox',
          defaultValue: false,
          label:  'Top Selling',
        },
        {
          name: 'isActive',
          type:  'checkbox',
          defaultValue: true,
          label:  'Active',
        },
      ],
    },
    {
      name:  'orderIndex',
      type: 'number',
      defaultValue:  0,
    },
    {
      name: 'meta',
      type: 'group',
      fields: [
        {
          name: 'title',
          type:  'text',
          label: 'Meta Title',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Meta Description',
        },
      ],
    },
  ],
}
```

### 3. Blogs Collection

```typescript
// src/payload/collections/Blogs.ts
import { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'

export const Blogs: CollectionConfig = {
  slug: 'blogs',
  labels:  {
    singular:  'Blog Post',
    plural:  'Blog Posts',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt'],
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type:  'text',
      required: true,
    },
    slugField('title'),
    {
      name: 'excerpt',
      type: 'textarea',
      maxLength: 300,
      required: true,
      admin: {
        description: 'Short summary for blog listings (max 300 chars)',
      },
    },
    {
      name:  'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'content',
      type:  'richText',
      required: true,
    },
    {
      name: 'author',
      type:  'relationship',
      relationTo: 'users',
      hasMany: false,
    },
    {
      name:  'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'meta',
      type: 'group',
      fields:  [
        {
          name: 'title',
          type: 'text',
          label: 'Meta Title',
        },
        {
          name: 'description',
          type: 'textarea',
          label:  'Meta Description',
        },
      ],
    },
  ],
}
```

### 4. Inquiries Collection

```typescript
// src/payload/collections/Inquiries. ts
import { CollectionConfig } from 'payload'

export const Inquiries: CollectionConfig = {
  slug:  'inquiries',
  labels: {
    singular: 'Inquiry',
    plural: 'Inquiries',
  },
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'phone', 'source', 'status', 'createdAt'],
    group: 'Leads',
  },
  access: {
    read: () => true,
    create: () => true, // Allow public form submissions
  },
  fields: [
    {
      name: 'fullName',
      type:  'text',
      required: true,
    },
    {
      name:  'email',
      type:  'email',
    },
    {
      name: 'phone',
      type: 'text',
      required:  true,
    },
    {
      name: 'message',
      type:  'textarea',
      required: true,
    },
    {
      name: 'product',
      type:  'relationship',
      relationTo: 'products',
      hasMany: false,
      admin: {
        description: 'Related product (if inquiry is about specific product)',
      },
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 