# 📚 06 - TypeScript Guide

> **Understanding TypeScript Through Practical Examples**

---

## 📖 Table of Contents

1. [What is TypeScript?](#what-is-typescript)
2. [Basic Types](#basic-types)
3. [Interfaces and Type Aliases](#interfaces-and-type-aliases)
4. [Optional and Readonly Properties](#optional-and-readonly-properties)
5. [Union and Intersection Types](#union-and-intersection-types)
6. [Type Inference](#type-inference)
7. [Generics](#generics)
8. [Utility Types](#utility-types)
9. [TypeScript with React](#typescript-with-react)
10. [Common Patterns in This Project](#common-patterns-in-this-project)

---

## 🎯 What is TypeScript?

TypeScript is JavaScript with syntax for types. It catches errors before you run your code.

### JavaScript vs TypeScript

```javascript
// JavaScript - No type checking
function addProduct(product) {
  // What properties does product have? 🤷
  console.log(product.nmae);  // Typo! JavaScript won't catch this
}

addProduct({ name: "Drill", price: "999" });  // Wrong type for price!
// JavaScript runs this without any warning ❌
```

```typescript
// TypeScript - Type checking
interface Product {
  name: string;
  price: number;
}

function addProduct(product: Product) {
  console.log(product.nmae);  // ❌ Error: Property 'nmae' does not exist
}

addProduct({ name: "Drill", price: "999" });  // ❌ Error: price should be number
// TypeScript catches these before running ✅
```

### Benefits of TypeScript

| Benefit | Description |
|---------|-------------|
| **Error Prevention** | Catch bugs before runtime |
| **Better Autocomplete** | IDE knows what properties exist |
| **Documentation** | Types serve as documentation |
| **Refactoring** | Safely rename and change code |
| **Team Collaboration** | Clearer contracts between code |

---

## 📊 Basic Types

### Primitive Types

```typescript
// String
let name: string = "John";
let message: string = `Hello, ${name}`;

// Number (integers and floats)
let price: number = 999;
let discount: number = 10.5;

// Boolean
let isActive: boolean = true;

// Null and Undefined
let nothing: null = null;
let notDefined: undefined = undefined;
```

### Arrays

```typescript
// Array of strings
let tags: string[] = ["hardware", "tools", "construction"];

// Alternative syntax
let categories: Array<string> = ["power-tools", "hand-tools"];

// Array of numbers
let prices: number[] = [100, 200, 300];

// Array of objects
let products: Product[] = [
  { name: "Drill", price: 999 },
  { name: "Hammer", price: 299 }
];
```

### Objects

```typescript
// Inline object type
let product: { name: string; price: number } = {
  name: "Drill",
  price: 999
};

// Better: Use interface (covered later)
interface Product {
  name: string;
  price: number;
}

let drill: Product = {
  name: "Electric Drill",
  price: 999
};
```

### Special Types

```typescript
// Any - Opt out of type checking (avoid when possible)
let anything: any = "hello";
anything = 123;  // OK
anything = true;  // OK

// Unknown - Safer than any
let unknown: unknown = "hello";
// unknown.toUpperCase();  // ❌ Error! Must check type first
if (typeof unknown === "string") {
  unknown.toUpperCase();  // ✅ OK
}

// Void - Function returns nothing
function logMessage(message: string): void {
  console.log(message);
}

// Never - Function never returns (throws or infinite loop)
function throwError(message: string): never {
  throw new Error(message);
}
```

---

## 📐 Interfaces and Type Aliases

### Interfaces

Define the shape of objects:

```typescript
// Basic interface
interface Product {
  name: string;
  price: number;
  description: string;
}

// Using the interface
const drill: Product = {
  name: "Electric Drill",
  price: 999,
  description: "Professional grade drill"
};

// Missing property = Error
const hammer: Product = {
  name: "Hammer",
  price: 299
  // ❌ Error: Property 'description' is missing
};
```

### Extending Interfaces

```typescript
// Base interface
interface BaseEntity {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Extended interface
interface Product extends BaseEntity {
  name: string;
  slug: string;
  price: number;
  category: string;
}

// Product now has: _id, createdAt, updatedAt, name, slug, price, category
```

### Type Aliases

Alternative to interfaces, can be used for more complex types:

```typescript
// Type alias for object
type Product = {
  name: string;
  price: number;
};

// Type alias for union
type Status = "pending" | "shipped" | "delivered";

// Type alias for function
type Handler = (event: MouseEvent) => void;

// Type alias for complex types
type ProductMap = Record<string, Product>;
```

### Interface vs Type

| Feature | Interface | Type Alias |
|---------|-----------|------------|
| Extend/Inherit | ✅ `extends` keyword | ✅ `&` intersection |
| Merge declarations | ✅ Yes | ❌ No |
| Use with unions | ❌ No | ✅ Yes |
| Use with primitives | ❌ No | ✅ Yes |
| Best for | Objects, APIs, contracts | Complex types, unions |

> **Rule of thumb:** Use `interface` for objects, `type` for everything else.

---

## ❓ Optional and Readonly Properties

### Optional Properties

Use `?` for properties that may not exist:

```typescript
interface Product {
  name: string;
  price: number;
  discountPrice?: number;    // Optional
  description?: string;      // Optional
}

// Both are valid:
const product1: Product = {
  name: "Drill",
  price: 999
};

const product2: Product = {
  name: "Hammer",
  price: 299,
  discountPrice: 249,
  description: "Heavy duty hammer"
};
```

### Readonly Properties

Use `readonly` for properties that shouldn't change:

```typescript
interface User {
  readonly id: string;       // Cannot be changed after creation
  name: string;
  email: string;
}

const user: User = {
  id: "123",
  name: "John",
  email: "john@example.com"
};

user.name = "Jane";  // ✅ OK
user.id = "456";     // ❌ Error: Cannot assign to 'id' because it is readonly
```

---

## 🔀 Union and Intersection Types

### Union Types (OR)

A value can be one of several types:

```typescript
// Union of primitives
let id: string | number = "abc";
id = 123;  // Also valid

// Union of literals (like enums)
type Status = "pending" | "shipped" | "delivered" | "cancelled";

let orderStatus: Status = "pending";
orderStatus = "shipped";     // ✅ OK
orderStatus = "processing";  // ❌ Error: not in Status

// Function with union parameter
function formatPrice(price: number | string): string {
  if (typeof price === "number") {
    return `Rs. ${price.toFixed(2)}`;
  }
  return price;
}

formatPrice(999);       // "Rs. 999.00"
formatPrice("Free");    // "Free"
```

### Intersection Types (AND)

Combine multiple types:

```typescript
interface HasName {
  name: string;
}

interface HasPrice {
  price: number;
}

// Product has both name AND price
type Product = HasName & HasPrice;

const drill: Product = {
  name: "Drill",
  price: 999
};
```

### Real Example: API Response

```typescript
// Success response
interface SuccessResponse<T> {
  success: true;
  data: T;
}

// Error response
interface ErrorResponse {
  success: false;
  error: string;
}

// Combined response type
type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// Usage
function handleResponse(response: ApiResponse<Product>) {
  if (response.success) {
    // TypeScript knows response.data exists here
    console.log(response.data.name);
  } else {
    // TypeScript knows response.error exists here
    console.log(response.error);
  }
}
```

---

## 🔮 Type Inference

TypeScript automatically figures out types when possible:

```typescript
// Inferred as string
let message = "Hello";  // TypeScript knows: string

// Inferred as number
let count = 42;  // TypeScript knows: number

// Inferred as number[]
let numbers = [1, 2, 3];  // TypeScript knows: number[]

// Inferred return type
function add(a: number, b: number) {
  return a + b;  // Return type inferred as number
}

// Inferred object type
const user = {
  name: "John",
  age: 30
};
// TypeScript knows: { name: string; age: number }
```

### When to Explicitly Type

```typescript
// 1. Function parameters - always type explicitly
function greet(name: string) {  // ✅ Explicit
  return `Hello, ${name}`;
}

// 2. Empty arrays - TypeScript can't infer
let items: string[] = [];  // ✅ Explicit

// 3. Delayed initialization
let user: User;  // ✅ Explicit
user = fetchUser();

// 4. Return types for public functions
function getUser(id: string): User {  // ✅ Explicit return type
  return { id, name: "John" };
}
```

---

## 🧬 Generics

Generics create reusable components that work with multiple types.

### Basic Generic

```typescript
// Without generics - needs different functions for each type
function firstString(arr: string[]): string {
  return arr[0];
}
function firstNumber(arr: number[]): number {
  return arr[0];
}

// With generics - one function works for all types
function first<T>(arr: T[]): T {
  return arr[0];
}

first<string>(["a", "b", "c"]);  // Returns "a" (string)
first<number>([1, 2, 3]);        // Returns 1 (number)
first([true, false]);            // Returns true (inferred as boolean)
```

### Generic Interfaces

```typescript
// Generic API response
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Used with different types
type ProductResponse = ApiResponse<Product>;
type UserResponse = ApiResponse<User>;
type ProductListResponse = ApiResponse<Product[]>;

// Example response
const response: ApiResponse<Product> = {
  success: true,
  data: { name: "Drill", price: 999 }
};
```

### Generic Constraints

Limit what types can be used:

```typescript
// T must have a 'length' property
function logLength<T extends { length: number }>(item: T): void {
  console.log(item.length);
}

logLength("hello");        // ✅ String has length
logLength([1, 2, 3]);      // ✅ Array has length
logLength({ length: 10 }); // ✅ Object with length
logLength(123);            // ❌ Number doesn't have length
```

### Multiple Generic Parameters

```typescript
// Map function with two type parameters
function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}

// Usage
const numbers = [1, 2, 3];
const strings = map(numbers, n => n.toString());
// strings is string[]
```

---

## 🛠️ Utility Types

TypeScript provides built-in utility types:

### Partial

Make all properties optional:

```typescript
interface Product {
  name: string;
  price: number;
  description: string;
}

// All properties are now optional
type ProductUpdate = Partial<Product>;

// Valid - only updating some fields
const update: ProductUpdate = {
  price: 899
};
```

### Required

Make all properties required:

```typescript
interface Product {
  name: string;
  price?: number;
  description?: string;
}

type RequiredProduct = Required<Product>;
// All properties are now required
```

### Pick

Select specific properties:

```typescript
interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
}

type ProductPreview = Pick<Product, "name" | "price">;
// { name: string; price: number }
```

### Omit

Exclude specific properties:

```typescript
type ProductWithoutId = Omit<Product, "_id">;
// Has all properties except _id
```

### Record

Create an object type with specific key and value types:

```typescript
// Object with string keys and Product values
type ProductMap = Record<string, Product>;

const products: ProductMap = {
  "drill-pro": { name: "Drill Pro", price: 999, ... },
  "hammer-x": { name: "Hammer X", price: 299, ... }
};
```

### Exclude and Extract

For union types:

```typescript
type Status = "pending" | "shipped" | "delivered" | "cancelled";

// Remove types from union
type ActiveStatus = Exclude<Status, "cancelled">;
// "pending" | "shipped" | "delivered"

// Keep only specific types
type TerminalStatus = Extract<Status, "delivered" | "cancelled">;
// "delivered" | "cancelled"
```

---

## ⚛️ TypeScript with React

### Component Props

```tsx
// Define props interface
interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: () => void;
}

// Use in component
function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  onClick
}: ButtonProps) {
  return (
    <button
      className={`btn-${variant} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### useState with Types

```tsx
// Type is inferred
const [count, setCount] = useState(0);  // number

// Explicit type for complex types
const [user, setUser] = useState<User | null>(null);

// Array of specific type
const [products, setProducts] = useState<Product[]>([]);
```

### Event Types

```tsx
// Mouse event
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log(e.currentTarget);
};

// Change event for input
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};

// Form submit event
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};

// Keyboard event
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter") {
    // ...
  }
};
```

### forwardRef

```tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div>
        <label>{label}</label>
        <input ref={ref} {...props} />
        {error && <span className="text-red-500">{error}</span>}
      </div>
    );
  }
);
```

---

## 📝 Common Patterns in This Project

### 1. Database Model Types

```typescript
// src/lib/db/models/Product.ts
import mongoose, { Schema, Document } from "mongoose";

// TypeScript interface
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
  specifications: {
    key: string;
    value: string;
  }[];
  price: number;
  discountPrice?: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema
const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  // ...
});
```

### 2. API Response Types

```typescript
// src/types/api.ts

// Base response
interface BaseResponse {
  success: boolean;
  message?: string;
}

// List response with pagination
interface PaginatedResponse<T> extends BaseResponse {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Single item response
interface SingleResponse<T> extends BaseResponse {
  data: T;
}

// Usage
type ProductListResponse = PaginatedResponse<IProduct>;
type ProductResponse = SingleResponse<IProduct>;
```

### 3. Form Validation with Zod

```typescript
// src/lib/validations/product.schema.ts
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().optional(),
  description: z.string().min(10),
  price: z.number().min(0),
  category: z.string().min(1, "Please select a category"),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

// Infer TypeScript type from Zod schema
export type ProductFormData = z.infer<typeof productSchema>;
```

### 4. API Route with Types

```typescript
// src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";

interface CreateProductBody {
  name: string;
  price: number;
  category: string;
}

export async function POST(req: NextRequest) {
  const body: CreateProductBody = await req.json();
  
  // TypeScript knows body.name, body.price, body.category exist
  const product = await Product.create({
    name: body.name,
    price: body.price,
    category: body.category
  });
  
  return NextResponse.json({ success: true, product });
}
```

### 5. Component Props with Children

```typescript
// Layout component
interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showHeader?: boolean;
}

export function Layout({ 
  children, 
  title, 
  showHeader = true 
}: LayoutProps) {
  return (
    <div>
      {showHeader && <Header />}
      {title && <h1>{title}</h1>}
      {children}
    </div>
  );
}
```

---

## 📚 Next Steps

Now that you understand TypeScript:

→ **Next**: [07 - Tailwind CSS](./07-TAILWIND-CSS.md) - Master styling with Tailwind

---

*Happy Learning! 🎉*
