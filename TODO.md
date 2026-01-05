# 📋 Roots Suppliers Pvt. Ltd. - Project TODO List

> **Hardware Shop Website Development Project**

| Field | Details |
|-------|---------|
| **Project** | Roots Suppliers Website |
| **Client** | Roots Suppliers Pvt. Ltd. |
| **Location** | Biratnagar, Nepal |
| **Domain** | www.rootsuppliers.com.np |
| **Tech Stack** | Next.js 14 + Payload CMS 3.x + PostgreSQL + Tailwind CSS |
| **Project Type** | Custom Dynamic Website with CMS |
| **Purpose** | Online Product Catalogue & Lead Generation |
| **Last Updated** | January 5, 2026 |

---

## 🎯 Project Overview

Building a **custom dynamic website with CMS** for Roots Suppliers Pvt. Ltd., a hardware shop in Biratnagar, Nepal offering *"All Construction Solutions Under One Roof"*.

### Key Deliverables
- ✅ Dynamic Product Catalogue (100-200 products)
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

### Out of Scope
- ❌ E-commerce / Online Sales
- ❌ Payment Gateway
- ❌ Inventory Management
- ❌ Third-party Integrations

---

## 📊 Project Progress Tracker

| Phase | Status | Progress | Tasks | Est. Days |
|-------|--------|----------|-------|-----------|
| **Phase 1: Project Setup** | ⏳ Not Started | 0/20 | 20 | 2-3 |
| **Phase 2: Design System** | ⏳ Not Started | 0/35 | 35 | 3-4 |
| **Phase 3: Backend & CMS** | ⏳ Not Started | 0/48 | 48 | 5-7 |
| **Phase 4: Frontend Pages** | ⏳ Not Started | 0/70 | 70 | 10-14 |
| **Phase 5: API Integration** | ⏳ Not Started | 0/20 | 20 | 3-4 |
| **Phase 6: Animations** | ⏳ Not Started | 0/18 | 18 | 2-3 |
| **Phase 7: Testing & QA** | ⏳ Not Started | 0/38 | 38 | 4-5 |
| **Phase 8: Deployment** | ⏳ Not Started | 0/28 | 28 | 2-3 |
| **Phase 9: Post-Launch** | ⏳ Not Started | 0/18 | 18 | Ongoing |
| **TOTAL** | | **0/295** | **295** | **~35-45** |

### Status Legend
| Icon | Status | Description |
|------|--------|-------------|
| ⏳ | Not Started | Work has not begun |
| 🚧 | In Progress | Currently being worked on |
| 🔄 | In Review | Completed, awaiting review |
| ✅ | Completed | Done and verified |
| ⚠️ | Blocked | Waiting on dependency/decision |
| 🐛 | Has Issues | Completed but has known bugs |

---

## 📁 PHASE 1: PROJECT SETUP & INITIALIZATION

> **Goal:** Set up development environment, initialize project, and configure all services.
> **Estimated Duration:** 2-3 days

### 1.1 Development Environment
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Install Node.js v18+ | 🔴 High | ⏳ | Required for Next.js |
| Install pnpm package manager | 🔴 High | ⏳ | `npm install -g pnpm` |
| Install VS Code extensions (ESLint, Prettier, Tailwind) | 🟡 Medium | ⏳ | Optional but recommended |

### 1.2 Repository Setup
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Create GitHub repository | 🔴 High | ⏳ | `roots-suppliers-website` |
| Create `.gitignore` file | 🔴 High | ⏳ | Node, Next.js, env files |
| Set up branch protection rules | 🟡 Medium | ⏳ | Protect `main` branch |
| Create README.md | 🟢 Low | ⏳ | Project documentation |

### 1.3 Next.js Project Initialization
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Initialize Next.js 14 with TypeScript | 🔴 High | ⏳ | See command below |
| Install Payload CMS 3.x | 🔴 High | ⏳ | `pnpm add payload` |
| Install PostgreSQL adapter | 🔴 High | ⏳ | `@payloadcms/db-postgres` |
| Install Tailwind CSS plugins | 🔴 High | ⏳ | Already included |
| Install Framer Motion | 🔴 High | ⏳ | `pnpm add framer-motion` |
| Install React Hook Form + Zod | 🔴 High | ⏳ | Form validation |
| Install Lucide React | 🟡 Medium | ⏳ | Icon library |
| Install Embla Carousel | 🟡 Medium | ⏳ | Carousel component |

```bash
# Project initialization command
pnpm create next-app@latest roots-suppliers --typescript --tailwind --app --use-pnpm

# Core dependencies
pnpm add payload @payloadcms/db-postgres @payloadcms/richtext-lexical
pnpm add framer-motion react-hook-form zod @hookform/resolvers
pnpm add lucide-react embla-carousel-react embla-carousel-autoplay
pnpm add cloudinary next-cloudinary
```

### 1.4 Project Folder Structure
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Create `src/app/(frontend)/` directory | 🔴 High | ⏳ | Public pages |
| Create `src/app/(admin)/admin/` directory | 🔴 High | ⏳ | Payload admin |
| Create `src/components/` subdirectories | 🔴 High | ⏳ | layout, ui, sections, cards, forms |
| Create `src/payload/` subdirectories | 🔴 High | ⏳ | collections, globals, fields, blocks |
| Create `src/lib/` directory | 🟡 Medium | ⏳ | utils, constants, payload client |
| Create `src/types/` directory | 🟡 Medium | ⏳ | TypeScript types |
| Create `public/fonts/` directory | 🟡 Medium | ⏳ | Custom fonts |
| Create `public/images/` directory | 🟡 Medium | ⏳ | Static images |

<details>
<summary>📂 Complete Folder Structure (Click to expand)</summary>

```
src/
├── app/
│   ├── (frontend)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── about/page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── categories/[slug]/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── gallery/page.tsx
│   │   ├── privacy-policy/page.tsx
│   │   └── terms/page.tsx
│   ├── (admin)/admin/[[...segments]]/page.tsx
│   └── api/
│       ├── inquiries/route.ts
│       └── search/route.ts
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── MobileMenu.tsx
│   │   └── MegaMenu.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── ...
│   ├── sections/
│   │   ├── HeroCarousel.tsx
│   │   ├── FeaturedProducts.tsx
│   │   └── ...
│   ├── cards/
│   │   ├── ProductCard.tsx
│   │   ├── BlogCard.tsx
│   │   └── ...
│   └── forms/
│       ├── ContactForm.tsx
│       └── ProductInquiryModal.tsx
├── payload/
│   ├── collections/
│   │   ├── Categories.ts
│   │   ├── Products.ts
│   │   ├── Blogs.ts
│   │   ├── Inquiries.ts
│   │   ├── Testimonials.ts
│   │   ├── Brands.ts
│   │   ├── Media.ts
│   │   └── Users.ts
│   ├── globals/
│   │   ├── SiteSettings.ts
│   │   └── HomepageSettings.ts
│   ├── fields/
│   │   ├── slug.ts
│   │   └── richText.ts
│   └── payload.config.ts
├── lib/
│   ├── utils.ts
│   ├── constants.ts
│   ├── payload.ts
│   └── animations.ts
├── types/
│   └── index.ts
└── styles/
    └── globals.css
```
</details>

### 1.5 Database Setup
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Sign up for Neon or Vercel Postgres | 🔴 High | ⏳ | Free tier available |
| Create PostgreSQL database | 🔴 High | ⏳ | Name: `roots_suppliers_db` |
| Get database connection string | 🔴 High | ⏳ | Copy `DATABASE_URL` |
| Test database connectivity | 🔴 High | ⏳ | Verify connection works |

### 1.6 Third-Party Services Setup
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Create Cloudinary account | 🔴 High | ⏳ | Image storage & CDN |
| Get Cloudinary API credentials | 🔴 High | ⏳ | cloud_name, api_key, api_secret |
| Get Google Maps API key | 🟡 Medium | ⏳ | For location embed |
| Create Google Analytics 4 property | 🟡 Medium | ⏳ | Tracking ID |
| Set up Google Search Console | 🟢 Low | ⏳ | Can do post-launch |

### 1.7 Environment Variables
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Create `.env.local` file | 🔴 High | ⏳ | Local development |
| Create `.env.example` template | 🟡 Medium | ⏳ | For documentation |

```env
# .env.local - Required Environment Variables

# ===== DATABASE =====
DATABASE_URI=postgresql://user:password@host:5432/roots_suppliers_db
PAYLOAD_SECRET=your-super-secret-key-minimum-32-characters

# ===== CLOUDINARY =====
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

# ===== GOOGLE SERVICES =====
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# ===== SITE CONFIG =====
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_EMAIL=admin@rootsuppliers.com.np

# ===== OPTIONAL =====
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

### 1.8 Development Tools Configuration
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Configure ESLint (`.eslintrc.json`) | 🟡 Medium | ⏳ | Code linting |
| Configure Prettier (`.prettierrc`) | 🟡 Medium | ⏳ | Code formatting |
| Set up Husky for git hooks | 🟢 Low | ⏳ | Pre-commit hooks |
| Configure lint-staged | 🟢 Low | ⏳ | Lint on commit |
| Update `package.json` scripts | 🟡 Medium | ⏳ | dev, build, lint, etc. |

---

## 🎨 PHASE 2: DESIGN SYSTEM & UI COMPONENTS

> **Goal:** Establish brand identity, configure Tailwind, and build reusable UI components.
> **Estimated Duration:** 3-4 days

### 2.1 Brand Assets & Fonts
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Download Bank Gothic MD BT font files | 🔴 High | ⏳ | .woff2, .woff formats |
| Add fonts to `/public/fonts/` | 🔴 High | ⏳ | Primary font |
| Set up @font-face in `globals.css` | 🔴 High | ⏳ | Font declarations |
| Import Google Fonts (Inter) | 🔴 High | ⏳ | Secondary font |
| Create logo in SVG/PNG formats | 🔴 High | ⏳ | Multiple sizes |
| Create favicon (16x16, 32x32, 180x180) | 🟡 Medium | ⏳ | ico, png formats |
| Create Open Graph image (1200x630) | 🟡 Medium | ⏳ | For social sharing |

### 2.2 Brand Color Palette
| Color | Hex Code | CSS Variable | Usage |
|-------|----------|--------------|-------|
| **Primary Red** | `#C41E3A` | `--color-primary` | CTA buttons, active states |
| Primary Red Dark | `#9B1B30` | `--color-primary-600` | Hover states |
| Primary Red Light | `#FEE2E2` | `--color-primary-100` | Light backgrounds |
| **Secondary Blue** | `#1E3A8A` | `--color-secondary` | Links, secondary buttons |
| Secondary Blue Dark | `#1E3A6E` | `--color-secondary-600` | Hover states |
| Success | `#22C55E` | `--color-success` | Success messages |
| Warning | `#F59E0B` | `--color-warning` | Warning messages |
| Error | `#EF4444` | `--color-error` | Error states |
| Gray 900 | `#111827` | `--color-gray-900` | Headings |
| Gray 600 | `#4B5563` | `--color-gray-600` | Body text |
| Gray 100 | `#F3F4F6` | `--color-gray-100` | Backgrounds |

### 2.3 Tailwind Configuration
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Configure primary color palette | 🔴 High | ⏳ | 50-900 shades |
| Configure secondary color palette | 🔴 High | ⏳ | 50-900 shades |
| Add semantic colors | 🔴 High | ⏳ | success, warning, error |
| Configure font families | 🔴 High | ⏳ | primary, secondary |
| Add custom box shadows | 🟡 Medium | ⏳ | card, card-hover, nav |
| Configure container settings | 🟡 Medium | ⏳ | max-width, padding |

### 2.4 Global Styles (`globals.css`)
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Add CSS custom properties (variables) | 🔴 High | ⏳ | Color, spacing vars |
| Add animation keyframes | 🟡 Medium | ⏳ | fadeInUp, slideIn |
| Create button utility classes | 🔴 High | ⏳ | See below |
| Create card utility classes | 🔴 High | ⏳ | See below |
| Create form utility classes | 🔴 High | ⏳ | See below |
| Set up base typography styles | 🔴 High | ⏳ | Headings, body |

<details>
<summary>📝 Utility Classes to Create (Click to expand)</summary>

```css
/* Button Classes */
.btn-primary     /* Red primary button */
.btn-secondary   /* Blue secondary button */
.btn-outline     /* Outlined button */
.btn-ghost       /* Text-only button */

/* Card Classes */
.card-product      /* Product card styling */
.card-blog         /* Blog card styling */
.card-testimonial  /* Testimonial card styling */

/* Form Classes */
.input-field     /* Input styling */
.textarea-field  /* Textarea styling */
.form-label      /* Label styling */
.form-error      /* Error message styling */
```
</details>

### 2.5 Base UI Components
| Component | File Path | Priority | Status | Description |
|-----------|-----------|----------|--------|-------------|
| Button | `components/ui/Button.tsx` | 🔴 High | ⏳ | Variants: primary, secondary, outline, ghost |
| Input | `components/ui/Input.tsx` | 🔴 High | ⏳ | With label, error state |
| Textarea | `components/ui/Textarea.tsx` | 🔴 High | ⏳ | With label, error state |
| Select | `components/ui/Select.tsx` | 🟡 Medium | ⏳ | Dropdown select |
| Checkbox | `components/ui/Checkbox.tsx` | 🟡 Medium | ⏳ | For filters |
| Badge | `components/ui/Badge.tsx` | 🟡 Medium | ⏳ | Category badges |
| Card | `components/ui/Card.tsx` | 🔴 High | ⏳ | Base card wrapper |
| Modal | `components/ui/Modal.tsx` | 🔴 High | ⏳ | Inquiry modal, lightbox |
| Toast | `components/ui/Toast.tsx` | 🟡 Medium | ⏳ | Success/error notifications |
| Spinner | `components/ui/Spinner.tsx` | 🟡 Medium | ⏳ | Loading indicator |
| Skeleton | `components/ui/Skeleton.tsx` | 🟢 Low | ⏳ | Loading placeholders |
| Breadcrumb | `components/ui/Breadcrumb.tsx` | 🟡 Medium | ⏳ | Navigation breadcrumbs |
| Pagination | `components/ui/Pagination.tsx` | 🟡 Medium | ⏳ | Page navigation |

### 2.6 Layout Components
| Component | File Path | Priority | Status | Description |
|-----------|-----------|----------|--------|-------------|
| **Header** | `components/layout/Header.tsx` | 🔴 High | ⏳ | Main navigation |
| └─ Logo & tagline | | 🔴 High | ⏳ | Left side |
| └─ Navigation menu | | 🔴 High | ⏳ | HOME, CATEGORIES, BLOGS, etc. |
| └─ Contact info | | 🔴 High | ⏳ | Phone, location |
| └─ Search bar | | 🟡 Medium | ⏳ | Product search |
| └─ Mobile hamburger | | 🔴 High | ⏳ | Mobile toggle |
| **MobileMenu** | `components/layout/MobileMenu.tsx` | 🔴 High | ⏳ | Slide-out menu |
| **MegaMenu** | `components/layout/MegaMenu.tsx` | 🟡 Medium | ⏳ | Categories dropdown |
| **Footer** | `components/layout/Footer.tsx` | 🔴 High | ⏳ | Site footer |
| └─ Company info | | 🔴 High | ⏳ | Logo, tagline, social |
| └─ Quick links | | 🔴 High | ⏳ | Navigation links |
| └─ Product categories | | 🟡 Medium | ⏳ | Category links |
| └─ Contact details | | 🔴 High | ⏳ | Phone, email, address |
| └─ Copyright | | 🔴 High | ⏳ | © 2026 text |

### 2.7 Card Components
| Component | File Path | Priority | Status | Description |
|-----------|-----------|----------|--------|-------------|
| ProductCard | `components/cards/ProductCard.tsx` | 🔴 High | ⏳ | Image, name, category badge |
| CategoryCard | `components/cards/CategoryCard.tsx` | 🔴 High | ⏳ | Category with icon/image |
| BlogCard | `components/cards/BlogCard.tsx` | 🔴 High | ⏳ | Image, title, excerpt, date |
| TestimonialCard | `components/cards/TestimonialCard.tsx` | 🟡 Medium | ⏳ | Photo, name, rating, review |
| BrandCard | `components/cards/BrandCard.tsx` | 🟢 Low | ⏳ | Brand logo display |

---

## 🔧 PHASE 3: BACKEND & PAYLOAD CMS SETUP

> **Goal:** Configure Payload CMS, create all collections, globals, and admin panel.
> **Estimated Duration:** 5-7 days

### 3.1 Payload CMS Configuration
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Install Payload CMS dependencies | 🔴 High | ⏳ | See package list |
| Create `src/payload/payload.config.ts` | 🔴 High | ⏳ | Main config file |
| Configure PostgreSQL database adapter | 🔴 High | ⏳ | `@payloadcms/db-postgres` |
| Configure Cloudinary for media | 🔴 High | ⏳ | Cloud storage plugin |
| Set up admin panel customization | 🟡 Medium | ⏳ | Logo, colors |
| Configure CORS settings | 🟡 Medium | ⏳ | API access |
| Set up email adapter (optional) | 🟢 Low | ⏳ | For notifications |

```bash
# Payload dependencies
pnpm add payload @payloadcms/db-postgres @payloadcms/richtext-lexical
pnpm add @payloadcms/plugin-cloud-storage @payloadcms/storage-cloudinary
```

### 3.2 Collection: Categories
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Create `payload/collections/Categories.ts` | 🔴 High | ⏳ | |
| Field: name (text, required) | 🔴 High | ⏳ | |
| Field: slug (auto-generated) | 🔴 High | ⏳ | |
| Field: description (textarea) | 🟡 Medium | ⏳ | |
| Field: image (upload to media) | 🔴 High | ⏳ | |
| Field: parent (relationship - subcategories) | 🟡 Medium | ⏳ | |
| Field: isFeatured (checkbox) | 🟡 Medium | ⏳ | |
| Field: isActive (checkbox) | 🔴 High | ⏳ | |
| Field: orderIndex (number) | 🟡 Medium | ⏳ | |
| Field: meta group (title, description) | 🟡 Medium | ⏳ | SEO |
| Add slug auto-generation hook | 🔴 High | ⏳ | |
| Configure admin columns | 🟡 Medium | ⏳ | |

### 3.3 Collection: Products
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Create `payload/collections/Products.ts` | 🔴 High | ⏳ | |
| Field: name (text, required) | 🔴 High | ⏳ | |
| Field: slug (auto-generated) | 🔴 High | ⏳ | |
| Field: shortDescription (textarea, 300 chars) | 🔴 High | ⏳ | For cards |
| Field: description (richText) | 🔴 High | ⏳ | Full details |
| Field: category (relationship, required) | 🔴 High | ⏳ | |
| Field: images (array of uploads) | 🔴 High | ⏳ | Multiple images |
| Field: specifications (array of key-value) | 🟡 Medium | ⏳ | Specs table |
| Field: brand (relationship) | 🟡 Medium | ⏳ | |
| Field: model (text) | 🟡 Medium | ⏳ | |
| Field: isFeatured (checkbox) | 🔴 High | ⏳ | |
| Field: isTopSelling (checkbox) | 🟡 Medium | ⏳ | |
| Field: isActive (checkbox) | 🔴 High | ⏳ | |
| Field: orderIndex (number) | 🟡 Medium | ⏳ | |
| Field: meta group (title, description) | 🟡 Medium | ⏳ | SEO |
| Add slug auto-generation hook | 🔴 High | ⏳ | |

### 3.4 Collection: Blogs
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Create `payload/collections/Blogs.ts` | 🔴 High | ⏳ | |
| Field: title (text, required) | 🔴 High | ⏳ | |
| Field: slug (auto-generated) | 🔴 High | ⏳ | |
| Field: excerpt (textarea, 300 chars) | 🔴 High | ⏳ | Summary |
| Field: featuredImage (upload, required) | 🔴 High | ⏳ | |
| Field: content (richText, required) | 🔴 High | ⏳ | Blog body |
| Field: author (relationship to users) | 🟡 Medium | ⏳ | |
| Field: status (select: draft/published) | 🔴 High | ⏳ | |
| Field: publishedAt (date) | 🔴 High | ⏳ | |
| Field: meta group (title, description) | 🟡 Medium | ⏳ | SEO |
| Add slug auto-generation hook | 🔴 High | ⏳ | |

### 3.5 Collection: Inquiries (Leads)
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Create `payload/collections/Inquiries.ts` | 🔴 High | ⏳ | |
| Field: fullName (text, required) | 🔴 High | ⏳ | |
| Field: email (email) | 🟡 Medium | ⏳ | Optional |
| Field: phone (text, required) | 🔴 High | ⏳ | |
| Field: message (textarea, required) | 🔴 High | ⏳ | |
| Field: product (relationship, optional) | 🟡 Medium | ⏳ | Product inquiry |
| Field: source (select) | 🟡 Medium | ⏳ | contact_form, product_inquiry |
| Field: status (select) | 🔴 High | ⏳ | new, contacted, converted, closed |
| Field: notes (textarea) | 🟡 Medium | ⏳ | Admin notes |
| Allow public form submissions | 🔴 High | ⏳ | access.create: () => true |
| Set up email notification hook | 🟡 Medium | ⏳ | Notify on new inquiry |

### 3.6 Collection: Testimonials
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Create `payload/collections/Testimonials.ts` | 🟡 Medium | ⏳ | |
| Field: customerName (text, required) | 🔴 High | ⏳ | |
| Field: customerDesignation (text) | 🟡 Medium | ⏳ | e.g., "Contractor" |
| Field: customerImage (upload) | 🟡 Medium | ⏳ | Photo |
| Field: rating (number, 1-5) | 🔴 High | ⏳ | Star rating |
| Field: reviewText (textarea, required) | 🔴 High | ⏳ | |
| Field: isFeatured (checkbox) | 🟡 Medium | ⏳ | |
| Field: isActive (checkbox) | 🔴 High | ⏳ | |
| Field: orderIndex (number) | 🟡 Medium | ⏳ | |

### 3.7 Collection: Brands
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Create `payload/collections/Brands.ts` | 🟡 Medium | ⏳ | |
| Field: name (text, required) | 🔴 High | ⏳ | |
| Field: slug (auto-generated) | 🟡 Medium | ⏳ | |
| Field: logo (upload, required) | 🔴 High | ⏳ | |
| Field: websiteUrl (text) | 🟢 Low | ⏳ | |
| Field: isFeatured (checkbox) | 🟡 Medium | ⏳ | |
| Field: isActive (checkbox) | 🔴 High | ⏳ | |
| Field: orderIndex (number) | 🟡 Medium | ⏳ | |

### 3.8 Collection: Media
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Create `payload/collections/Media.ts` | 🔴 High | ⏳ | |
| Configure Cloudinary upload | 🔴 High | ⏳ | |
| Set up image optimization | 🔴 High | ⏳ | Auto-resize, formats |
| Field: altText (text) | 🔴 High | ⏳ | Accessibility |
| Field: caption (text) | 🟢 Low | ⏳ | |

### 3.9 Collection: Users
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Create `payload/collections/Users.ts` | 🔴 High | ⏳ | |
| Field: name (text) | 🔴 High | ⏳ | |
| Field: role (select: admin, editor) | 🔴 High | ⏳ | |
| Configure authentication | 🔴 High | ⏳ | Email/password |
| Set up access control | 🔴 High | ⏳ | Role-based |

### 3.10 Global: Site Settings
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Create `payload/globals/SiteSettings.ts` | 🔴 High | ⏳ | |
| Field: siteName | 🔴 High | ⏳ | |
| Field: tagline | 🔴 High | ⏳ | |
| Field: logo (upload) | 🔴 High | ⏳ | |
| Field: favicon (upload) | 🟡 Medium | ⏳ | |
| Field: phone (primary, secondary) | 🔴 High | ⏳ | |
| Field: email (primary, secondary) | 🔴 High | ⏳ | |
| Field: address (textarea) | 🔴 High | ⏳ | |
| Field: googleMapsEmbed (textarea) | 🔴 High | ⏳ | |
| Field: googleMapsLink (text) | 🔴 High | ⏳ | |
| Field: businessHours (JSON or array) | 🟡 Medium | ⏳ | |
| Field: socialFacebook, socialInstagram | 🟡 Medium | ⏳ | |
| Field: meta (title, description) | 🔴 High | ⏳ | Default SEO |
| Field: googleAnalyticsId | 🟡 Medium | ⏳ | |

### 3.11 Global: Homepage Settings
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Create `payload/globals/HomepageSettings.ts` | 🔴 High | ⏳ | |
| Field: heroSlides (array) | 🔴 High | ⏳ | Image, title, CTA |
| Field: featuredProductsTitle | 🟡 Medium | ⏳ | |
| Field: featuredProductsSubtitle | 🟡 Medium | ⏳ | |
| Field: aboutSectionContent (richText) | 🟡 Medium | ⏳ | |
| Field: stats (array) | 🟡 Medium | ⏳ | label, value, suffix |

### 3.12 Custom Fields & Hooks
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Create `payload/fields/slug.ts` | 🔴 High | ⏳ | Auto-generate from name/title |
| Create `payload/fields/richText.ts` | 🟡 Medium | ⏳ | Custom editor config |
| Create email notification hook | 🟡 Medium | ⏳ | On inquiry creation |
| Create auto-timestamp hook | 🟢 Low | ⏳ | updatedAt field |

### 3.13 Admin Panel Customization
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Add company logo to admin | 🟡 Medium | ⏳ | |
| Group collections by type | 🟡 Medium | ⏳ | Products, Content, Leads |
| Configure default admin columns | 🟡 Medium | ⏳ | |
| Set up user permissions | 🔴 High | ⏳ | Admin vs Editor |

---

## 🌐 PHASE 4: FRONTEND PAGES DEVELOPMENT

> **Goal:** Build all public-facing pages with components and data fetching.
> **Estimated Duration:** 10-14 days

### 4.1 Root Layout & Global Setup
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Create `(frontend)/layout.tsx` | 🔴 High | ⏳ | Main layout wrapper |
| Implement Header component | 🔴 High | ⏳ | Import from components |
| Implement Footer component | 🔴 High | ⏳ | Import from components |
| Add global metadata | 🔴 High | ⏳ | Title, description, OG |
| Set up Google Analytics | 🟡 Medium | ⏳ | gtag.js |
| Add skip-to-content link | 🟢 Low | ⏳ | Accessibility |

### 4.2 Home Page (`/`) - HIGH PRIORITY
| Section | Component | Priority | Status | Notes |
|---------|-----------|----------|--------|-------|
| **Page Setup** | `(frontend)/page.tsx` | 🔴 High | ⏳ | Homepage |
| **Hero Section** | `sections/HeroCarousel.tsx` | 🔴 High | ⏳ | |
| └─ Auto-rotating slides | | 🔴 High | ⏳ | 5s interval |
| └─ Navigation arrows | | 🔴 High | ⏳ | Left/right |
| └─ Dot indicators | | 🟡 Medium | ⏳ | |
| └─ Fetch from Homepage Settings | | 🔴 High | ⏳ | |
| **Top Brands** | `sections/TopBrands.tsx` | 🟡 Medium | ⏳ | |
| └─ Logo carousel | | 🟡 Medium | ⏳ | 5-6 visible |
| └─ Auto-scroll | | 🟡 Medium | ⏳ | |
| └─ Fetch featured brands | | 🟡 Medium | ⏳ | |
| **Featured Products** | `sections/FeaturedProducts.tsx` | 🔴 High | ⏳ | |
| └─ Product grid (2×4) | | 🔴 High | ⏳ | 8 products |
| └─ "VIEW ALL PRODUCTS" CTA | | 🔴 High | ⏳ | |
| └─ Fetch featured products | | 🔴 High | ⏳ | |
| **Who Are We** | `sections/AboutSection.tsx` | 🟡 Medium | ⏳ | |
| └─ Two-column layout | | 🟡 Medium | ⏳ | Image + text |
| └─ Value proposition cards | | 🟡 Medium | ⏳ | 3 cards |
| **Visit Us** | `sections/VisitUs.tsx` | 🟡 Medium | ⏳ | |
| └─ Google Maps embed | | 🟡 Medium | ⏳ | |
| └─ Contact info display | | 🟡 Medium | ⏳ | |
| └─ "Get Directions" button | | 🟡 Medium | ⏳ | |
| **Testimonials** | `sections/Testimonials.tsx` | 🟡 Medium | ⏳ | |
| └─ Testimonial carousel | | 🟡 Medium | ⏳ | |
| └─ Dot navigation | | 🟡 Medium | ⏳ | |
| └─ Fetch from Payload | | 🟡 Medium | ⏳ | |
| **Scroll Animations** | Framer Motion | 🟢 Low | ⏳ | Enhance UX |

### 4.3 Products Listing Page (`/products`) - HIGH PRIORITY
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Create `products/page.tsx` | 🔴 High | ⏳ | |
| **Page Header** | | | |
| └─ Title: "OUR PRODUCTS" | 🔴 High | ⏳ | |
| └─ Subtitle | 🟡 Medium | ⏳ | |
| **Sidebar (Desktop)** | `sections/ProductSidebar.tsx` | 🔴 High | ⏳ | |
| └─ Search input | 🔴 High | ⏳ | Product search |
| └─ Category checkboxes | 🔴 High | ⏳ | Filter by category |
| └─ Collapsible on mobile | 🔴 High | ⏳ | Filter button |
| **Product Grid** | | | |
| └─ 4 columns (desktop) | 🔴 High | ⏳ | |
| └─ 2 columns (tablet) | 🔴 High | ⏳ | |
| └─ 1-2 columns (mobile) | 🔴 High | ⏳ | |
| └─ Use ProductCard | 🔴 High | ⏳ | |
| **Filtering Logic** | | | |
| └─ Category filter | 🔴 High | ⏳ | URL: ?category=slug |
| └─ Search filter | 🔴 High | ⏳ | URL: ?search=query |
| └─ Show active filters | 🟡 Medium | ⏳ | Clear filter option |
| **Pagination** | | | |
| └─ Page numbers | 🔴 High | ⏳ | |
| └─ Previous/Next arrows | 🔴 High | ⏳ | |
| └─ "Showing X-Y of Z" | 🟡 Medium | ⏳ | |
| **States** | | | |
| └─ Loading skeleton | 🟡 Medium | ⏳ | |
| └─ Empty state | 🟡 Medium | ⏳ | No products found |
| └─ Error state | 🟡 Medium | ⏳ | |

### 4.4 Product Detail Page (`/products/[slug]`) - HIGH PRIORITY
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Create `products/[slug]/page.tsx` | 🔴 High | ⏳ | |
| **Breadcrumb** | | 🔴 High | ⏳ | Home > Products > Category > Name |
| **Image Gallery** | `sections/ProductGallery.tsx` | 🔴 High | ⏳ | |
| └─ Main large image | 🔴 High | ⏳ | |
| └─ Thumbnail strip (4-6) | 🔴 High | ⏳ | |
| └─ Click to change | 🔴 High | ⏳ | |
| └─ Lightbox/zoom | 🟡 Medium | ⏳ | |
| **Product Info** | | | |
| └─ Category badge | 🔴 High | ⏳ | Colored badge |
| └─ Product name (H1) | 🔴 High | ⏳ | |
| └─ Description (rich text) | 🔴 High | ⏳ | |
| └─ Specifications table | 🔴 High | ⏳ | Key-value pairs |
| **CTA Buttons** | | | |
| └─ "Enquire About This Product" | 🔴 High | ⏳ | Opens modal |
| └─ WhatsApp inquiry link | 🔴 High | ⏳ | Pre-filled message |
| └─ Call button (mobile) | 🟡 Medium | ⏳ | Click to call |
| **Inquiry Modal** | `forms/ProductInquiryModal.tsx` | 🔴 High | ⏳ | |
| └─ Pre-fill product name | 🔴 High | ⏳ | |
| └─ Form validation | 🔴 High | ⏳ | |
| └─ Submit to API | 🔴 High | ⏳ | |
| └─ Success/error toast | 🔴 High | ⏳ | |
| **Related Products** | `sections/RelatedProducts.tsx` | 🟡 Medium | ⏳ | |
| └─ 4 from same category | 🟡 Medium | ⏳ | |
| └─ Horizontal scroll (mobile) | 🟡 Medium | ⏳ | |
| **SEO** | | | |
| └─ Generate static params | 🔴 High | ⏳ | `generateStaticParams` |
| └─ Add Product schema | 🟡 Medium | ⏳ | JSON-LD |
| └─ Dynamic metadata | 🔴 High | ⏳ | Title, description |

### 4.5 Category Page (`/categories/[slug]`)
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Create `categories/[slug]/page.tsx` | 🟡 Medium | ⏳ | |
| Display category info | 🟡 Medium | ⏳ | Name, description, image |
| Show products in category | 🟡 Medium | ⏳ | Reuse product grid |
| Breadcrumb navigation | 🟡 Medium | ⏳ | |
| Pagination | 🟡 Medium | ⏳ | |
| Dynamic metadata | 🟡 Medium | ⏳ | |

### 4.6 About Us Page (`/about`)
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Create `about/page.tsx` | 🔴 High | ⏳ | |
| **Welcome Section** | | | |
| └─ Two-column layout | 🔴 High | ⏳ | Image + text |
| └─ Company description | 🔴 High | ⏳ | |
| **Vision & Mission** | `sections/VisionMission.tsx` | 🟡 Medium | ⏳ | |
| └─ Two-card layout | 🟡 Medium | ⏳ | |
| **Company Gallery** | `sections/CompanyGallery.tsx` | 🟡 Medium | ⏳ | |
| └─ 3-image grid | 🟡 Medium | ⏳ | |
| └─ Lightbox on click | 🟢 Low | ⏳ | |
| **Stats Section** | `sections/StatsSection.tsx` | 🟡 Medium | ⏳ | |
| └─ Animated counters | 🟡 Medium | ⏳ | 1000+, 2000+, etc. |
| └─ 3-stat layout | 🟡 Medium | ⏳ | |
| **Product Categories** | | 🟡 Medium | ⏳ | Category cards |
| └─ "VIEW MORE" button | 🟡 Medium | ⏳ | |

### 4.7 Gallery Page (`/gallery`)
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Create `gallery/page.tsx` | 🟢 Low | ⏳ | |
| Masonry/grid layout | 🟢 Low | ⏳ | |
| Fetch from Media collection | 🟢 Low | ⏳ | |
| Lightbox modal | 🟢 Low | ⏳ | |
| Lazy loading images | 🟢 Low | ⏳ | |

### 4.8 Blog Listing Page (`/blog`)
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Create `blog/page.tsx` | 🔴 High | ⏳ | |
| Page header | 🔴 High | ⏳ | Title, subtitle |
| **Blog List** | | | |
| └─ Horizontal card layout | 🔴 High | ⏳ | Image left, content right |
| └─ Display: image, title, excerpt, date | 🔴 High | ⏳ | |
| └─ "Read More" link | 🔴 High | ⏳ | |
| Pagination / Load More | 🟡 Medium | ⏳ | 6-10 posts per page |
| Loading state | 🟡 Medium | ⏳ | |

### 4.9 Blog Detail Page (`/blog/[slug]`)
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Create `blog/[slug]/page.tsx` | 🔴 High | ⏳ | |
| Breadcrumb | 🟡 Medium | ⏳ | Home > Blog > Title |
| Blog metadata | 🔴 High | ⏳ | Date, author |
| Featured image | 🔴 High | ⏳ | |
| **Content Rendering** | | | |
| └─ Rich text HTML | 🔴 High | ⏳ | |
| └─ Typography styles | 🔴 High | ⏳ | Headings, lists, etc. |
| **Related Posts** | 🟡 Medium | ⏳ | 3 related |
| **Social Share** | 🟢 Low | ⏳ | Optional |
| Generate static params | 🔴 High | ⏳ | |
| Article schema (JSON-LD) | 🟡 Medium | ⏳ | |

### 4.10 Contact Page (`/contact`) - HIGH PRIORITY
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Create `contact/page.tsx` | 🔴 High | ⏳ | |
| **Contact Form** | `forms/ContactForm.tsx` | 🔴 High | ⏳ | |
| └─ Fields: name, phone, email, message | 🔴 High | ⏳ | |
| └─ React Hook Form setup | 🔴 High | ⏳ | |
| └─ Zod validation | 🔴 High | ⏳ | |
| └─ Submit to API | 🔴 High | ⏳ | POST /api/inquiries |
| └─ Success toast | 🔴 High | ⏳ | |
| └─ Error handling | 🔴 High | ⏳ | |
| └─ Loading state | 🟡 Medium | ⏳ | |
| **Contact Info** | `sections/ContactInfo.tsx` | 🔴 High | ⏳ | |
| └─ Address, phone, email | 🔴 High | ⏳ | |
| └─ Business hours | 🟡 Medium | ⏳ | |
| └─ Social media icons | 🟡 Medium | ⏳ | |
| **Map Section** | | | |
| └─ Google Maps embed | 🔴 High | ⏳ | |
| └─ "Get Directions" button | 🟡 Medium | ⏳ | |
| **Location Photos** | 🟢 Low | ⏳ | 2 showroom photos |

### 4.11 Privacy Policy Page (`/privacy-policy`)
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Create `privacy-policy/page.tsx` | 🟢 Low | ⏳ | |
| Add privacy content | 🟢 Low | ⏳ | Static or from CMS |
| Typography layout | 🟢 Low | ⏳ | |

### 4.12 Terms & Conditions Page (`/terms`)
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Create `terms/page.tsx` | 🟢 Low | ⏳ | |
| Add terms content | 🟢 Low | ⏳ | Static or from CMS |
| Typography layout | 🟢 Low | ⏳ | |

---

## 🔗 PHASE 5: API INTEGRATION & DATA FETCHING

> **Goal:** Create API utilities, form handling, and data fetching logic.
> **Estimated Duration:** 3-4 days

### 5.1 Payload API Client
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Create `src/lib/payload.ts` | 🔴 High | ⏳ | API client setup |
| Configure base URL | 🔴 High | ⏳ | From env vars |
| Add TypeScript types | 🔴 High | ⏳ | Type safety |
| Implement error handling | 🔴 High | ⏳ | Try-catch wrapper |

### 5.2 Data Fetching Functions
| Function | File | Priority | Status | Description |
|----------|------|----------|--------|-------------|
| `getProducts(filters)` | `lib/payload.ts` | 🔴 High | ⏳ | With pagination, filtering |
| `getProductBySlug(slug)` | `lib/payload.ts` | 🔴 High | ⏳ | Single product |
| `getFeaturedProducts()` | `lib/payload.ts` | 🔴 High | ⏳ | For homepage |
| `getCategories()` | `lib/payload.ts` | 🔴 High | ⏳ | All active categories |
| `getCategoryBySlug(slug)` | `lib/payload.ts` | 🟡 Medium | ⏳ | Single category |
| `getBlogs(limit, page)` | `lib/payload.ts` | 🔴 High | ⏳ | Published blogs |
| `getBlogBySlug(slug)` | `lib/payload.ts` | 🔴 High | ⏳ | Single blog post |
| `getTestimonials()` | `lib/payload.ts` | 🟡 Medium | ⏳ | Featured testimonials |
| `getBrands()` | `lib/payload.ts` | 🟡 Medium | ⏳ | Featured brands |
| `getSiteSettings()` | `lib/payload.ts` | 🔴 High | ⏳ | Global settings |
| `getHomepageSettings()` | `lib/payload.ts` | 🔴 High | ⏳ | Hero, stats, etc. |

### 5.3 Form Submission API
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Create `api/inquiries/route.ts` | 🔴 High | ⏳ | POST endpoint |
| Validate form data with Zod | 🔴 High | ⏳ | Server-side validation |
| Save to Payload Inquiries | 🔴 High | ⏳ | Create document |
| Send email notification | 🟡 Medium | ⏳ | To admin email |
| Return JSON response | 🔴 High | ⏳ | Success/error |
| Add rate limiting | 🟢 Low | ⏳ | Prevent spam |

```typescript
// Example API route structure
// src/app/api/inquiries/route.ts
export async function POST(request: Request) {
  // 1. Parse request body
  // 2. Validate with Zod
  // 3. Save to Payload
  // 4. Send email (optional)
  // 5. Return response
}
```

### 5.4 Search API
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Create `api/search/route.ts` | 🟡 Medium | ⏳ | GET endpoint |
| Accept query params | 🟡 Medium | ⏳ | ?q=search&category=slug |
| Search products by name | 🟡 Medium | ⏳ | Case-insensitive |
| Filter by category | 🟡 Medium | ⏳ | Optional |
| Return paginated results | 🟡 Medium | ⏳ | |

### 5.5 Caching Strategy
| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Use `revalidate` for ISR | 🔴 High | ⏳ | 60-300 seconds |
| Static generation for products | 🔴 High | ⏳ | `generateStaticParams` |
| Static generation for blogs | 🔴 High | ⏳ | `generateStaticParams` |
| Cache site settings | 🟡 Medium | ⏳ | Longer revalidation |
| On-demand revalidation | 🟢 Low | ⏳ | Webhook from Payload |

---

## 🎭 PHASE 6: ANIMATIONS & INTERACTIONS

### 6.1 Scroll Animations
- [ ] Install and configure Framer Motion
- [ ] Create animation variants in `src/lib/animations.ts`:
  - [ ] fadeInUp
  - [ ] slideInLeft
  - [ ] slideInRight
  - [ ] staggerChildren
  - [ ] scaleIn
- [ ] Apply scroll animations to:
  - [ ] Section titles
  - [ ] Product cards
  - [ ] Blog cards
  - [ ] Testimonial cards
  - [ ] Stats counters

### 6.2 Interactive Elements
- [ ] Add hover effects to:
  - [ ] Buttons
  - [ ] Cards
  - [ ] Navigation links
  - [ ] Images
- [ ] Add loading spinners
- [ ] Add skeleton loaders for content
- [ ] Smooth page transitions

### 6.3 Carousels & Sliders
- [ ] Implement hero carousel (auto-play)
- [ ] Implement brand logo carousel
- [ ] Implement testimonials carousel
- [ ] Add navigation controls (arrows, dots)
- [ ] Make carousels touch-friendly (swipe)

### 6.4 Modal & Overlay
- [ ] Product inquiry modal
- [ ] Image lightbox/zoom
- [ ] Mobile menu overlay
- [ ] Toast notifications

---

## 🧪 PHASE 7: TESTING & QUALITY ASSURANCE

### 7.1 Functionality Testing
- [ ] Test all page routes
- [ ] Test navigation (header, footer, breadcrumbs)
- [ ] Test category filtering
- [ ] Test search functionality
- [ ] Test product inquiry forms
- [ ] Test contact form submissions
- [ ] Test form validations
- [ ] Test error handling

### 7.2 Responsive Testing
- [ ] Test on mobile (320px, 375px, 414px)
- [ ] Test on tablet (768px, 1024px)
- [ ] Test on desktop (1280px, 1920px)
- [ ] Test landscape orientation
- [ ] Test touch interactions

### 7.3 Browser Compatibility
- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on Edge
- [ ] Test on mobile browsers

### 7.4 Performance Testing
- [ ] Run Lighthouse audit
- [ ] Check Core Web Vitals:
  - [ ] LCP (Largest Contentful Paint) < 2.5s
  - [ ] FID (First Input Delay) < 100ms
  - [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] Optimize images (Cloudinary)
- [ ] Minimize JavaScript bundles
- [ ] Enable compression
- [ ] Check page load times

### 7.5 SEO Testing
- [ ] Verify meta titles and descriptions
- [ ] Check Open Graph tags
- [ ] Check Twitter Card tags
- [ ] Verify structured data (Schema.org)
- [ ] Check robots.txt
- [ ] Generate sitemap.xml
- [ ] Test canonical URLs
- [ ] Check internal linking

### 7.6 Accessibility Testing
- [ ] Check color contrast ratios
- [ ] Test keyboard navigation
- [ ] Test with screen readers
- [ ] Add ARIA labels where needed
- [ ] Check heading hierarchy
- [ ] Add alt text to all images
- [ ] Ensure form labels are proper

### 7.7 Security Testing
- [ ] Validate environment variables
- [ ] Check CORS settings
- [ ] Test SQL injection prevention
- [ ] Test XSS prevention
- [ ] Implement rate limiting
- [ ] Secure API endpoints
- [ ] Test authentication
- [ ] Implement CSRF protection

---

## 🚀 PHASE 8: DEPLOYMENT & LAUNCH

> **Goal:** Deploy the website to production, configure domain, and launch.
> **Estimated Duration:** 2-3 days

### 8.1 Pre-Deployment
- [ ] Review all environment variables
- [ ] Update `.env.production`
- [ ] Final code review
- [ ] Merge feature branches
- [ ] Tag release version
- [ ] Create deployment checklist

### 8.2 Database Setup (Production)
- [ ] Create production PostgreSQL database
- [ ] Run database migrations
- [ ] Verify database connection
- [ ] Set up database backups

### 8.3 Vercel Deployment
- [ ] Sign up for Vercel account
- [ ] Connect GitHub repository
- [ ] Configure build settings
- [ ] Add environment variables
- [ ] Configure domains
- [ ] Set up preview deployments

### 8.4 Domain Configuration
- [ ] Purchase domain: www.rootsuppliers.com.np
- [ ] Configure DNS settings
- [ ] Add domain to Vercel
- [ ] Set up SSL certificate
- [ ] Test domain propagation

### 8.5 Third-Party Service Configuration
- [ ] Verify Cloudinary in production
- [ ] Verify Google Maps API
- [ ] Set up Google Analytics tracking
- [ ] Set up Google Search Console
- [ ] Submit sitemap to Google

### 8.6 Initial Content Population
- [ ] Create admin user
- [ ] Upload company logo and favicon
- [ ] Configure site settings
- [ ] Upload homepage hero slides
- [ ] Add categories (10-15 categories)
- [ ] Add initial products (20-30 products)
- [ ] Add brand logos (5-10 brands)
- [ ] Add testimonials (5-8 testimonials)
- [ ] Add blog posts (3-5 initial posts)
- [ ] Upload gallery images

### 8.7 Launch
- [ ] Final smoke testing on production
- [ ] Monitor error logs
- [ ] Check analytics tracking
- [ ] Announce launch
- [ ] Monitor performance
- [ ] Gather initial feedback

---

## 📈 PHASE 9: POST-LAUNCH & MAINTENANCE

### 9.1 Monitoring Setup
- [ ] Set up error tracking (Sentry optional)
- [ ] Monitor Google Analytics
- [ ] Track Core Web Vitals
- [ ] Set up uptime monitoring
- [ ] Monitor database performance

### 9.2 SEO Optimization
- [ ] Submit sitemap to search engines
- [ ] Monitor search console for errors
- [ ] Track keyword rankings
- [ ] Build internal links
- [ ] Optimize meta descriptions based on data

### 9.3 Content Management Training
- [ ] Create admin user guide
- [ ] Train client on Payload CMS:
  - [ ] Adding/editing products
  - [ ] Managing categories
  - [ ] Creating blog posts
  - [ ] Uploading images
  - [ ] Managing inquiries
  - [ ] Updating site settings

### 9.4 Backup & Security
- [ ] Set up automated database backups
- [ ] Document backup restore procedure
- [ ] Regular security updates
- [ ] Monitor for vulnerabilities

### 9.5 Ongoing Maintenance
- [ ] Weekly: Check for inquiries/leads
- [ ] Weekly: Review analytics
- [ ] Monthly: Update dependencies
- [ ] Monthly: Review performance metrics
- [ ] Quarterly: Content audit
- [ ] Quarterly: Security audit

---

## 📝 OPTIONAL ENHANCEMENTS

### Future Features (Phase 10+)
- [ ] **Multi-language Support:**
  - [ ] Add Nepali language
  - [ ] Implement i18n
- [ ] **Advanced Search:**
  - [ ] Implement Algolia or similar
  - [ ] Add autocomplete
- [ ] **Product Comparison:**
  - [ ] Compare multiple products side-by-side
- [ ] **Wishlist/Favorites:**
  - [ ] Allow users to save favorite products
- [ ] **Newsletter Signup:**
  - [ ] Email collection
  - [ ] Mailchimp integration
- [ ] **Live Chat:**
  - [ ] WhatsApp Business API
  - [ ] Facebook Messenger integration
- [ ] **Product Reviews:**
  - [ ] User-submitted reviews
  - [ ] Rating system
- [ ] **Video Integration:**
  - [ ] Product videos
  - [ ] Company introduction video
- [ ] **PWA (Progressive Web App):**
  - [ ] Offline support
  - [ ] Install prompt
- [ ] **Advanced Analytics:**
  - [ ] Heatmaps
  - [ ] User behavior tracking

---

## 🐛 KNOWN ISSUES & BUGS

### Critical
- [ ] _No critical issues_

### High Priority
- [ ] _No high priority issues_

### Medium Priority
- [ ] _No medium priority issues_

### Low Priority
- [ ] _No low priority issues_

---

## 📞 CONTACT & STAKEHOLDERS

**Client:** Roots Suppliers Pvt. Ltd.  
**Location:** Biratnagar, Nepal  
**Email:** info@rootsuppliers.com.np  
**Phone:** +977-XXX-XXXXXXX

**Development Team:**
- Project Manager: _[Name]_
- Lead Developer: _[Name]_
- Designer: _[Name]_
- Content Manager: _[Name]_

---

## 📅 TIMELINE ESTIMATES

| Phase | Duration | Start Date | End Date |
|-------|----------|------------|----------|
| Phase 1: Setup | 2-3 days | TBD | TBD |
| Phase 2: Design | 3-4 days | TBD | TBD |
| Phase 3: Backend | 5-7 days | TBD | TBD |
| Phase 4: Frontend | 10-14 days | TBD | TBD |
| Phase 5: Integration | 3-4 days | TBD | TBD |
| Phase 6: Animations | 2-3 days | TBD | TBD |
| Phase 7: Testing | 4-5 days | TBD | TBD |
| Phase 8: Deployment | 2-3 days | TBD | TBD |
| **TOTAL** | **~35-45 days** | | |

---

## 📚 RESOURCES & REFERENCES

### Documentation
- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [React Hook Form Documentation](https://react-hook-form.com/)

### Design References
- Wireframes: `home-page.png`, `categories.png`, `about-us.png`, `registration.jpg`
- Brand Assets: Logo, Colors from PROJECT_DOCUMENTATION.md

### APIs & Services
- Cloudinary: Image CDN
- Google Maps: Location embedding
- Google Analytics 4: Tracking
- Neon/Vercel Postgres: Database hosting

---

## ✅ DEFINITION OF DONE

A task is considered "Done" when:
- [ ] Code is written and tested
- [ ] Code is reviewed (if team workflow requires)
- [ ] No console errors or warnings
- [ ] Responsive on all breakpoints
- [ ] Accessible (WCAG AA)
- [ ] Performance optimized
- [ ] SEO tags added
- [ ] Documentation updated (if needed)
- [ ] Merged to main branch

---

**Last Updated:** January 5, 2026  
**Version:** 1.0.0
