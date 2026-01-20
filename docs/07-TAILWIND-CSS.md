# 📚 07 - Tailwind CSS Guide

> **Mastering Utility-First CSS with Tailwind**

---

## 📖 Table of Contents

1. [What is Tailwind CSS?](#what-is-tailwind-css)
2. [How Tailwind Works](#how-tailwind-works)
3. [Basic Utilities](#basic-utilities)
4. [Layout and Flexbox](#layout-and-flexbox)
5. [Grid System](#grid-system)
6. [Responsive Design](#responsive-design)
7. [Hover, Focus, and Other States](#hover-focus-and-other-states)
8. [Custom Configuration](#custom-configuration)
9. [Component Patterns](#component-patterns)
10. [Project Examples](#project-examples)

---

## 🎯 What is Tailwind CSS?

Tailwind is a utility-first CSS framework. Instead of writing CSS, you compose classes directly in HTML.

### Traditional CSS vs Tailwind

```html
<!-- Traditional CSS -->
<style>
.card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.card h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
</style>
<div class="card">
  <h2>Title</h2>
</div>

<!-- Tailwind CSS -->
<div class="bg-white p-6 rounded-lg shadow">
  <h2 class="text-xl font-semibold mb-2">Title</h2>
</div>
```

### Benefits of Tailwind

| Benefit | Description |
|---------|-------------|
| **No Context Switching** | Stay in HTML, no separate CSS files |
| **Consistent Design** | Predefined scales for spacing, colors, etc. |
| **Small Bundle Size** | Only includes CSS you actually use |
| **Responsive by Default** | Easy mobile-first responsive utilities |
| **Rapid Prototyping** | Build UIs faster without writing CSS |

---

## ⚙️ How Tailwind Works

### Installation in This Project

```json
// package.json
{
  "devDependencies": {
    "tailwindcss": "^3.4.1",
    "postcss": "^8",
    "autoprefixer": "^0.4.0"
  }
}
```

### Configuration Files

```typescript
// tailwind.config.ts - Main configuration
import type { Config } from "tailwindcss";

const config: Config = {
  // Which files to scan for classes
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Custom colors, fonts, etc.
    },
  },
  plugins: [],
};

export default config;
```

```css
/* src/app/globals.css - Import Tailwind */
@tailwind base;        /* Reset and base styles */
@tailwind components;  /* Component classes */
@tailwind utilities;   /* Utility classes */
```

---

## 📏 Basic Utilities

### Spacing

Tailwind uses a numeric scale where each unit = 0.25rem (4px).

```html
<!-- Padding -->
<div class="p-4">All sides: 1rem (16px)</div>
<div class="px-4 py-2">Horizontal: 1rem, Vertical: 0.5rem</div>
<div class="pt-2 pr-4 pb-6 pl-8">Individual sides</div>

<!-- Margin -->
<div class="m-4">All sides: 1rem</div>
<div class="mx-auto">Center horizontally</div>
<div class="mt-8 mb-4">Top and bottom</div>

<!-- Negative margin -->
<div class="-mt-4">Negative top margin</div>
```

**Spacing Scale:**
| Class | Size |
|-------|------|
| `p-0` | 0 |
| `p-1` | 0.25rem (4px) |
| `p-2` | 0.5rem (8px) |
| `p-4` | 1rem (16px) |
| `p-6` | 1.5rem (24px) |
| `p-8` | 2rem (32px) |
| `p-12` | 3rem (48px) |

### Colors

```html
<!-- Text Color -->
<p class="text-gray-600">Gray text</p>
<p class="text-primary-600">Primary red text</p>
<p class="text-secondary-600">Secondary blue text</p>

<!-- Background Color -->
<div class="bg-white">White background</div>
<div class="bg-gray-100">Light gray background</div>
<div class="bg-primary-600">Primary red background</div>

<!-- Border Color -->
<div class="border border-gray-300">Gray border</div>
<div class="border-2 border-primary-600">Primary border</div>
```

**Project Color Palette:**
```
Error:                     #ef4444 (error-500)
```

**Custom Industrial Branding**:
The project uses a custom "Bank Gothic" font for headings and navigational elements to maintain a premium, industrial aesthetic.
- **Font Variable**: `--font-bank-gothic`
- **Tailwind Utility**: `font-primary` (mapped in `tailwind.config.ts`)

### Typography

```html
<!-- Font Size -->
<p class="text-sm">Small (14px)</p>
<p class="text-base">Base (16px)</p>
<p class="text-lg">Large (18px)</p>
<p class="text-xl">Extra large (20px)</p>
<p class="text-2xl">2XL (24px)</p>
<p class="text-3xl">3XL (30px)</p>

<!-- Font Weight -->
<p class="font-normal">Normal (400)</p>
<p class="font-medium">Medium (500)</p>
<p class="font-semibold">Semibold (600)</p>
<p class="font-bold">Bold (700)</p>

<!-- Text Alignment -->
<p class="text-left">Left aligned</p>
<p class="text-center">Center aligned</p>
<p class="text-right">Right aligned</p>

<!-- Line Height -->
<p class="leading-tight">Tight line height</p>
<p class="leading-normal">Normal line height</p>
<p class="leading-relaxed">Relaxed line height</p>
```

### Sizing

```html
<!-- Width -->
<div class="w-full">100% width</div>
<div class="w-1/2">50% width</div>
<div class="w-64">16rem (256px)</div>
<div class="w-auto">Auto width</div>
<div class="max-w-md">Max width: 28rem</div>

<!-- Height -->
<div class="h-screen">100vh (full viewport)</div>
<div class="h-64">16rem height</div>
<div class="min-h-screen">Minimum 100vh</div>
```

### Borders

```html
<!-- Border Width -->
<div class="border">1px border</div>
<div class="border-2">2px border</div>
<div class="border-t">Top border only</div>

<!-- Border Radius -->
<div class="rounded">Small radius (4px)</div>
<div class="rounded-lg">Large radius (8px)</div>
<div class="rounded-xl">Extra large (12px)</div>
<div class="rounded-full">Full (circular)</div>
```

---

## 📐 Layout and Flexbox

### Display

```html
<div class="block">Block element</div>
<span class="inline-block">Inline block</span>
<div class="hidden">Hidden element</div>
<div class="flex">Flex container</div>
<div class="grid">Grid container</div>
```

### Flexbox

```html
<!-- Flex Container -->
<div class="flex">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Direction -->
<div class="flex flex-row">Horizontal (default)</div>
<div class="flex flex-col">Vertical</div>

<!-- Justify Content (main axis) -->
<div class="flex justify-start">Start</div>
<div class="flex justify-center">Center</div>
<div class="flex justify-end">End</div>
<div class="flex justify-between">Space between</div>
<div class="flex justify-around">Space around</div>

<!-- Align Items (cross axis) -->
<div class="flex items-start">Top</div>
<div class="flex items-center">Center</div>
<div class="flex items-end">Bottom</div>
<div class="flex items-stretch">Stretch (default)</div>

<!-- Gap -->
<div class="flex gap-4">Gap of 1rem</div>
<div class="flex gap-x-4 gap-y-2">Different x/y gaps</div>

<!-- Wrap -->
<div class="flex flex-wrap">Wrap items</div>
```

### Real Example: Navigation

```tsx
// Horizontal navigation with logo and links
<nav className="flex items-center justify-between px-6 py-4">
  {/* Logo */}
  <div className="flex items-center gap-2">
    <Image src="/logo.png" alt="Logo" width={40} height={40} />
    <span className="font-bold text-xl">Root Suppliers</span>
  </div>
  
  {/* Navigation Links */}
  <ul className="flex items-center gap-8">
    <li><Link href="/">Home</Link></li>
    <li><Link href="/products">Products</Link></li>
    <li><Link href="/about">About</Link></li>
    <li><Link href="/contact">Contact</Link></li>
  </ul>
  
  {/* Actions */}
  <div className="flex items-center gap-4">
    <Button variant="ghost">Login</Button>
    <Button variant="primary">Get Quote</Button>
  </div>
</nav>
```

---

## 🔲 Grid System

### Basic Grid

```html
<!-- 3 Column Grid -->
<div class="grid grid-cols-3 gap-4">
  <div>Col 1</div>
  <div>Col 2</div>
  <div>Col 3</div>
</div>

<!-- Responsive Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>

<!-- Column Span -->
<div class="grid grid-cols-4 gap-4">
  <div class="col-span-2">Spans 2 columns</div>
  <div>Col 3</div>
  <div>Col 4</div>
</div>
```

### Real Example: Product Grid

```tsx
// Product grid with responsive columns
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {products.map((product) => (
    <ProductCard key={product._id} product={product} />
  ))}
</div>
```

---

## 📱 Responsive Design

Tailwind uses mobile-first breakpoints:

```
sm:  640px and up   (small tablets)
md:  768px and up   (tablets)
lg:  1024px and up  (laptops)
xl:  1280px and up  (desktops)
2xl: 1536px and up  (large screens)
```

### How It Works

```html
<!-- Mobile first: styles apply to all sizes unless overridden -->
<div class="text-sm md:text-base lg:text-lg">
  <!-- Small text on mobile, base on tablet, large on desktop -->
</div>

<!-- Hidden on mobile, shown on desktop -->
<div class="hidden lg:block">
  Desktop only content
</div>

<!-- Shown on mobile, hidden on desktop -->
<div class="block lg:hidden">
  Mobile only content
</div>

<!-- Different padding at different sizes -->
<div class="p-4 md:p-6 lg:p-8">
  Responsive padding
</div>

<!-- Different grid columns -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  <!-- 1 col mobile, 2 cols tablet, 4 cols desktop -->
</div>
```

### Real Example: Hero Section

```tsx
<section className="py-12 md:py-20 lg:py-32">
  <div className="container mx-auto px-4">
    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
      {/* Text - Full width mobile, half on desktop */}
      <div className="w-full lg:w-1/2 text-center lg:text-left">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4">
          Industrial Supplies
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-6">
          Quality tools and equipment
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <Button size="lg">Shop Now</Button>
          <Button variant="outline" size="lg">Learn More</Button>
        </div>
      </div>
      
      {/* Image - Full width mobile, half on desktop */}
      <div className="w-full lg:w-1/2">
        <Image src="/hero.jpg" alt="Hero" />
      </div>
    </div>
  </div>
</section>
```

---

## 🎭 Hover, Focus, and Other States

### State Modifiers

```html
<!-- Hover -->
<button class="bg-primary-600 hover:bg-primary-700">
  Hover me
</button>

<!-- Focus -->
<input class="border focus:border-primary-500 focus:ring-2 focus:ring-primary-200" />

<!-- Active -->
<button class="bg-primary-600 active:bg-primary-800">
  Click me
</button>

<!-- Disabled -->
<button class="disabled:opacity-50 disabled:cursor-not-allowed" disabled>
  Disabled
</button>

<!-- Group Hover -->
<div class="group">
  <h3>Title</h3>
  <p class="text-gray-500 group-hover:text-primary-600">
    Changes when parent is hovered
  </p>
</div>

<!-- First/Last Child -->
<ul>
  <li class="first:pt-0 last:pb-0">Item</li>
</ul>
```

### Real Example: Card with Hover Effects

```tsx
<div className="group bg-white rounded-xl shadow-card hover:shadow-card-hover 
                transition-all duration-300 hover:-translate-y-1 overflow-hidden">
  {/* Image with zoom on hover */}
  <div className="overflow-hidden">
    <Image 
      src={product.image}
      alt={product.name}
      className="w-full h-48 object-cover transition-transform duration-300 
                 group-hover:scale-105"
    />
  </div>
  
  <div className="p-4">
    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 
                   transition-colors">
      {product.name}
    </h3>
    <p className="text-gray-500">{product.description}</p>
    
    {/* Button appears on hover */}
    <Button className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
      View Details
    </Button>
  </div>
</div>
```

---

## ⚙️ Custom Configuration

### Our tailwind.config.ts

```typescript
// tailwind.config.ts
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
        // Primary - Cardinal Red
        primary: {
          DEFAULT: "#C41E3A",
          50: "#fef2f3",
          100: "#fee2e5",
          200: "#fecacd",
          300: "#fca5ab",
          400: "#f8717b",
          500: "#ef4352",
          600: "#C41E3A",  // Main color
          700: "#9B1B30",
          800: "#851d2d",
          900: "#721d2b",
          950: "#3e0b12",
        },
        // Secondary - Navy Blue
        secondary: {
          DEFAULT: "#1E3A8A",
          50: "#f0f4ff",
          100: "#e0e7ff",
          // ... more shades
          600: "#1E3A8A",  // Main color
        },
        // Semantic Colors
        success: {
          500: "#22c55e",
          600: "#16a34a",
        },
        warning: {
          500: "#f59e0b",
        },
        error: {
          500: "#ef4444",
        },
      },
      fontFamily: {
        primary: ["var(--font-primary)", "Inter", "sans-serif"],
        secondary: ["var(--font-secondary)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 8px -2px rgba(0, 0, 0, 0.08), 0 4px 16px -4px rgba(0, 0, 0, 0.08)",
        "card-hover": "0 8px 24px -4px rgba(0, 0, 0, 0.12), 0 16px 32px -8px rgba(0, 0, 0, 0.12)",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1.5rem",
          lg: "2rem",
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

### Using Custom Values

```tsx
// Using custom colors
<div className="bg-primary-600">Cardinal Red</div>
<div className="text-secondary-600">Navy Blue</div>

// Using custom shadows
<div className="shadow-card hover:shadow-card-hover">Card</div>

// Using custom fonts
<h1 className="font-primary">Heading Font</h1>
<p className="font-secondary">Body Font</p>
```

---

## 🧩 Component Patterns

### Custom Component Classes (globals.css)

```css
/* src/app/globals.css */
@layer components {
  /* Buttons */
  .btn {
    @apply inline-flex items-center justify-center gap-2 
           px-6 py-2.5 text-sm md:text-base md:px-8 md:py-4 
           font-medium rounded-full transition-all duration-200 
           disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .btn-primary {
    @apply btn bg-primary-600 text-white 
           hover:bg-primary-700 active:bg-primary-800 
           shadow-sm hover:shadow-md;
  }

  .btn-secondary {
    @apply btn bg-secondary-600 text-white 
           hover:bg-secondary-700 active:bg-secondary-800;
  }

  .btn-outline {
    @apply btn border-2 border-primary-600 text-primary-600 
           hover:bg-primary-600 hover:text-white;
  }

  /* Cards */
  .card {
    @apply bg-white rounded-xl shadow-card overflow-hidden 
           transition-all duration-300;
  }

  .card-hover {
    @apply hover:shadow-card-hover hover:-translate-y-1;
  }

  /* Form Inputs */
  .input-field {
    @apply w-full px-4 py-3 border border-gray-300 rounded-lg 
           bg-white text-gray-900 placeholder:text-gray-400 
           focus:border-primary-500 focus:ring-2 focus:ring-primary-100 
           focus:outline-none transition-all duration-200;
  }

  .form-label {
    @apply block text-sm font-medium text-gray-700 mb-1.5;
  }

  .form-error {
    @apply text-sm text-error-500 mt-1;
  }
}
```

### Using Component Classes

```tsx
// Using custom button classes
<button className="btn-primary">Primary Button</button>
<button className="btn-outline">Outline Button</button>

// Using custom card classes
<div className="card card-hover p-6">
  <h3>Card Title</h3>
</div>

// Using form classes
<div>
  <label className="form-label">Email</label>
  <input type="email" className="input-field" placeholder="Enter email" />
  <span className="form-error">Invalid email</span>
</div>
```

---

## 📝 Project Examples

### 1. Button Component with class-variance-authority

```tsx
// src/components/ui/Button.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base styles applied to all buttons
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md",
        secondary: "bg-secondary-600 text-white hover:bg-secondary-700",
        outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-50",
        ghost: "text-gray-700 hover:bg-gray-100",
        danger: "bg-red-600 text-white hover:bg-red-700",
      },
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
<Button variant="primary" size="lg">Large Primary</Button>
<Button variant="outline">Outline Button</Button>
```

### 2. Product Card

```tsx
<article className="group card card-hover">
  {/* Image Container */}
  <div className="relative aspect-square overflow-hidden">
    <Image
      src={product.image}
      alt={product.name}
      fill
      className="object-cover transition-transform duration-500 
                 group-hover:scale-110"
    />
    {product.isFeatured && (
      <span className="absolute top-3 left-3 bg-primary-600 text-white 
                       px-3 py-1 text-xs font-medium rounded-full">
        Featured
      </span>
    )}
  </div>

  {/* Content */}
  <div className="p-4 md:p-6">
    <span className="text-xs text-gray-500 uppercase tracking-wider">
      {product.category}
    </span>
    <h3 className="mt-1 text-lg font-semibold text-gray-900 
                   group-hover:text-primary-600 transition-colors line-clamp-2">
      {product.name}
    </h3>
    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
      {product.description}
    </p>
    
    {/* Price */}
    <div className="mt-4 flex items-center justify-between">
      <div>
        {product.discountPrice ? (
          <>
            <span className="text-lg font-bold text-primary-600">
              ₹{product.discountPrice}
            </span>
            <span className="ml-2 text-sm text-gray-400 line-through">
              ₹{product.price}
            </span>
          </>
        ) : (
          <span className="text-lg font-bold text-gray-900">
            ₹{product.price}
          </span>
        )}
      </div>
      <Button variant="primary" size="sm">View</Button>
    </div>
  </div>
</article>
```

### 3. Form Layout

```tsx
<form className="space-y-6">
  {/* Two column grid on larger screens */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="form-label">First Name</label>
      <input type="text" className="input-field" />
    </div>
    <div>
      <label className="form-label">Last Name</label>
      <input type="text" className="input-field" />
    </div>
  </div>

  {/* Full width */}
  <div>
    <label className="form-label">Email</label>
    <input type="email" className="input-field" />
  </div>

  {/* Textarea */}
  <div>
    <label className="form-label">Message</label>
    <textarea className="input-field min-h-[150px] resize-none" />
  </div>

  {/* Button group */}
  <div className="flex flex-col sm:flex-row gap-4 pt-4">
    <Button type="submit" className="flex-1 sm:flex-none">
      Submit
    </Button>
    <Button type="button" variant="outline">
      Cancel
    </Button>
  </div>
</form>
```

### 4. Section with Background

```tsx
<section className="relative py-16 md:py-24 bg-gradient-to-br 
                    from-primary-50 via-white to-secondary-50">
  {/* Decorative background elements */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-40 -right-40 w-80 h-80 
                    bg-primary-200 rounded-full opacity-20 blur-3xl" />
    <div className="absolute -bottom-40 -left-40 w-80 h-80 
                    bg-secondary-200 rounded-full opacity-20 blur-3xl" />
  </div>
  
  {/* Content */}
  <div className="container mx-auto px-4 relative z-10">
    <div className="text-center max-w-3xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
        Why Choose Us?
      </h2>
      <p className="mt-4 text-lg text-gray-600">
        Leading industrial supplier in Nepal
      </p>
    </div>
    
    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((feature) => (
        <FeatureCard key={feature.id} {...feature} />
      ))}
    </div>
  </div>
</section>
```

---

## 🔧 The cn() Utility Function

Combine Tailwind classes conditionally:

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Usage

```tsx
// Basic usage
<div className={cn("text-base", "font-medium")}>
  Combined classes
</div>

// Conditional classes
<button className={cn(
  "btn",
  isActive && "btn-primary",
  !isActive && "btn-outline",
  isDisabled && "opacity-50"
)}>
  Click me
</button>

// Merging with props
function Card({ className, children }) {
  return (
    <div className={cn("card p-4", className)}>
      {children}
    </div>
  );
}

// Override default styles
<Card className="p-8">  {/* p-8 wins over p-4 */}
  Content
</Card>
```

---

## 🔧 Troubleshooting

### Unknown at-rule @tailwind / @apply
If your IDE (like VS Code) shows warnings for Tailwind directives in `globals.css`, you can silence them by configuring your workspace settings:

1. Create or open `.vscode/settings.json`.
2. Add the following rules:
```json
{
  "css.validate": false,
  "scss.validate": false,
  "less.validate": false,
  "css.lint.unknownAtRules": "ignore"
}
```

---

## 📚 Next Steps

Now that you understand Tailwind CSS:

→ **Next**: [08 - Backend API](./08-BACKEND-API.md) - Build REST APIs with Next.js

---

*Happy Styling! 🎨*
