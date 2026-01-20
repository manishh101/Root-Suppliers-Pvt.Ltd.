# 📚 17 - Practice Exercises

> **Hands-On Exercises to Master Full-Stack Development**

---

## 📖 Table of Contents

1. [Beginner Exercises](#beginner-exercises)
2. [Intermediate Exercises](#intermediate-exercises)
3. [Advanced Exercises](#advanced-exercises)
4. [Challenge Projects](#challenge-projects)
5. [Solutions & Hints](#solutions--hints)

---

## 🌱 Beginner Exercises

### Exercise 1: Create a Simple React Component

**Goal**: Create a `ProductCard` component that displays product information.

**Requirements**:
- Accept `name`, `price`, `image`, and `description` as props
- Display the product image
- Show the name and price
- Include a "View Details" button

**Starter Code**:
```typescript
// src/components/cards/ProductCard.tsx

interface ProductCardProps {
  // Define props here
}

export default function ProductCard(/* props */) {
  return (
    <div className="card">
      {/* Your code here */}
    </div>
  );
}
```

**Test Your Work**:
```tsx
<ProductCard 
  name="Electric Drill"
  price={999}
  image="/images/products/drill.jpg"
  description="Powerful cordless drill"
/>
```

---

### Exercise 2: Add TypeScript Types

**Goal**: Add proper TypeScript types to a JavaScript function.

**Convert this JavaScript**:
```javascript
function formatPrice(price, currency, locale) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(price);
}
```

**To TypeScript with**:
- Proper parameter types
- Return type
- Optional parameters with defaults

---

### Exercise 3: Tailwind CSS Styling

**Goal**: Create a styled button using only Tailwind classes.

**Requirements**:
Create buttons with these variants:
1. Primary (red background, white text)
2. Secondary (blue background, white text)
3. Outline (transparent, border only)

**Each button should have**:
- Rounded corners
- Hover effect
- Focus ring
- Padding

**Write the className strings**:
```tsx
// Primary Button
<button className="???">Primary</button>

// Secondary Button
<button className="???">Secondary</button>

// Outline Button
<button className="???">Outline</button>
```

---

### Exercise 4: useState Hook

**Goal**: Create a counter component with increment/decrement.

**Requirements**:
- Display current count
- "+" button to increment
- "-" button to decrement
- Count cannot go below 0

**Starter Code**:
```tsx
'use client';

import { useState } from 'react';

export default function Counter() {
  // Your code here
  
  return (
    <div className="flex items-center gap-4">
      {/* Your JSX here */}
    </div>
  );
}
```

---

### Exercise 5: API Data Fetching

**Goal**: Fetch and display products from the API.

**Requirements**:
- Use `useEffect` and `useState`
- Handle loading state
- Handle error state
- Display products in a grid

**Starter Code**:
```tsx
'use client';

import { useState, useEffect } from 'react';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
}

export default function ProductList() {
  // 1. Create state for products, loading, error
  
  // 2. Fetch products in useEffect
  
  // 3. Render products
  
  return (
    <div>
      {/* Your code here */}
    </div>
  );
}
```

---

## 🌿 Intermediate Exercises

### Exercise 6: Create a Zod Validation Schema

**Goal**: Create a validation schema for a contact form.

**Form Fields**:
| Field | Rules |
|-------|-------|
| name | Required, 2-50 characters |
| email | Required, valid email |
| phone | Optional, valid phone format |
| subject | Required, one of: "general", "support", "sales" |
| message | Required, 10-1000 characters |

**Starter Code**:
```typescript
// src/lib/validations/contact.schema.ts
import { z } from 'zod';

export const contactSchema = z.object({
  // Define your schema here
});

export type ContactFormData = z.infer<typeof contactSchema>;
```

---

### Exercise 7: Build a React Hook Form

**Goal**: Create a contact form using React Hook Form with Zod validation.

**Requirements**:
- Use the schema from Exercise 6
- Show validation errors
- Submit to `/api/contact`
- Show success/error toast

**Starter Code**:
```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, ContactFormData } from '@/lib/validations/contact.schema';

export default function ContactForm() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    // Submit logic here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Build your form */}
    </form>
  );
}
```

---

### Exercise 8: Create a Mongoose Model

**Goal**: Create a `Testimonial` model for customer reviews.

**Schema**:
| Field | Type | Rules |
|-------|------|-------|
| customerName | String | Required, trim |
| companyName | String | Optional |
| rating | Number | Required, 1-5 |
| comment | String | Required, max 500 |
| avatar | String | Optional, URL |
| isApproved | Boolean | Default: false |
| createdAt | Date | Auto |

**Requirements**:
- Add indexes for `isApproved` and `createdAt`
- Export the model properly

---

### Exercise 9: Build a REST API Route

**Goal**: Create a complete API route for testimonials.

**Endpoints**:
- `GET /api/testimonials` - List approved testimonials
- `POST /api/testimonials` - Submit new testimonial (public)
- `PATCH /api/testimonials/:id` - Approve testimonial (admin)
- `DELETE /api/testimonials/:id` - Delete testimonial (admin)

**Starter Code**:
```typescript
// src/app/api/testimonials/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import Testimonial from '@/lib/db/models/Testimonial';

export async function GET(request: NextRequest) {
  // List approved testimonials
}

export async function POST(request: NextRequest) {
  // Create testimonial (no auth required)
}
```

---

### Exercise 10: Create a React Context

**Goal**: Create a `CartContext` for shopping cart functionality.

**Features**:
- Add item to cart
- Remove item from cart
- Update quantity
- Calculate total
- Persist to localStorage

**Starter Code**:
```tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Implement the provider
}

export function useCart() {
  // Implement the hook
}
```

---

## 🌳 Advanced Exercises

### Exercise 11: Implement Image Upload

**Goal**: Create a complete image upload component.

**Requirements**:
- Drag & drop support
- File type validation (jpg, png, webp)
- Size limit (5MB)
- Preview before upload
- Upload progress indicator
- Upload to Cloudinary via `/api/upload`

---

### Exercise 12: Add Search with Debouncing

**Goal**: Create a search component with debounced API calls.

**Requirements**:
- Input with search icon
- Debounce by 300ms (don't call API on every keystroke)
- Show loading indicator
- Display results in dropdown
- Keyboard navigation (up/down arrows)

**Hint - Custom Hook**:
```typescript
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

---

### Exercise 13: Build Pagination Component

**Goal**: Create a reusable pagination component.

**Requirements**:
- Show page numbers
- Previous/Next buttons
- Show current page indicator
- Handle edge cases (first/last page)
- URL-based pagination (use query params)

**Usage Example**:
```tsx
<Pagination 
  currentPage={3}
  totalPages={10}
  onPageChange={(page) => router.push(`?page=${page}`)}
/>
```

---

### Exercise 14: Implement Optimistic Updates

**Goal**: Update UI immediately, then sync with server.

**Scenario**: Like button on a product

**Requirements**:
1. User clicks "Like"
2. UI immediately shows liked state
3. API call happens in background
4. If API fails, revert to previous state
5. Show error toast

---

### Exercise 15: Create a Data Table with Sorting

**Goal**: Build a sortable data table component.

**Requirements**:
- Display data in table format
- Click column header to sort
- Toggle ascending/descending
- Show sort indicator (arrow)
- Server-side sorting via API

---

## 🏆 Challenge Projects

### Project 1: Product Comparison Feature

**Build a feature that allows users to**:
1. Add products to comparison (max 4)
2. View side-by-side comparison
3. Compare specifications
4. Persist selection in localStorage

**Components to Create**:
- `CompareButton` - Add to compare
- `CompareBar` - Fixed bottom bar showing selected
- `ComparePage` - Side-by-side view

---

### Project 2: Wishlist System

**Build a complete wishlist feature**:
1. Add/remove from wishlist
2. View wishlist page
3. Move to cart
4. Share wishlist via link
5. Store in database (authenticated) or localStorage (guest)

---

### Project 3: Product Reviews

**Build a review system**:
1. Submit review with rating
2. Display average rating
3. List reviews with pagination
4. Helpful/Not helpful voting
5. Admin approval workflow

**Database Schema Design**:
```typescript
interface Review {
  product: ObjectId;
  user?: ObjectId;
  guestName?: string;
  rating: number;
  title: string;
  comment: string;
  isApproved: boolean;
  helpfulVotes: number;
  createdAt: Date;
}
```

---

### Project 4: Real-Time Notifications

**Build a notification system**:
1. Display notification bell icon
2. Badge with unread count
3. Dropdown with recent notifications
4. Mark as read
5. Notification types: order, promotion, system

---

## 💡 Solutions & Hints

### Exercise 1 Solution

```tsx
interface ProductCardProps {
  name: string;
  price: number;
  image: string;
  description: string;
}

export default function ProductCard({ 
  name, 
  price, 
  image, 
  description 
}: ProductCardProps) {
  return (
    <div className="card p-4 rounded-lg shadow-card hover:shadow-card-hover transition-shadow">
      <img 
        src={image} 
        alt={name}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
      <p className="text-gray-600 text-sm mt-1 line-clamp-2">{description}</p>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-xl font-bold text-primary">
          ₹{price.toLocaleString()}
        </span>
        <button className="btn-primary px-4 py-2 rounded-md">
          View Details
        </button>
      </div>
    </div>
  );
}
```

---

### Exercise 2 Solution

```typescript
function formatPrice(
  price: number, 
  currency: string = 'INR', 
  locale: string = 'en-IN'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(price);
}
```

---

### Exercise 3 Solution

```tsx
// Primary Button
<button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors">
  Primary
</button>

// Secondary Button
<button className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-colors">
  Secondary
</button>

// Outline Button
<button className="border border-gray-300 bg-transparent px-4 py-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors">
  Outline
</button>
```

---

### Exercise 4 Solution

```tsx
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => Math.max(0, prev - 1));

  return (
    <div className="flex items-center gap-4">
      <button 
        onClick={decrement}
        className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 text-xl font-bold"
        disabled={count === 0}
      >
        -
      </button>
      <span className="text-2xl font-bold min-w-[3rem] text-center">
        {count}
      </span>
      <button 
        onClick={increment}
        className="w-10 h-10 rounded-full bg-primary text-white hover:bg-primary-600 text-xl font-bold"
      >
        +
      </button>
    </div>
  );
}
```

---

### Exercise 5 Solution

```tsx
'use client';

import { useState, useEffect } from 'react';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setProducts(data.products);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product._id} className="card p-4">
          <img 
            src={product.images[0] || '/placeholder.jpg'} 
            alt={product.name}
            className="w-full h-48 object-cover rounded"
          />
          <h3 className="mt-4 font-semibold">{product.name}</h3>
          <p className="text-primary font-bold">₹{product.price}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 📚 Next Steps

Great job completing the exercises!

→ **Next**: [18 - Resources & Further Learning](./18-RESOURCES.md)

---

*Practice Makes Perfect! 🎯*
