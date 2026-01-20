# 📚 04 - Frontend Basics with React

> **Understanding React Fundamentals Through Real Code Examples**

---

## 📖 Table of Contents

1. [What is React?](#what-is-react)
2. [Components](#components)
3. [JSX Syntax](#jsx-syntax)
4. [Props](#props)
5. [State with useState](#state-with-usestate)
6. [Side Effects with useEffect](#side-effects-with-useeffect)
7. [Event Handling](#event-handling)
8. [Conditional Rendering](#conditional-rendering)
9. [Lists and Keys](#lists-and-keys)
10. [Component Patterns in This Project](#component-patterns-in-this-project)

---

## 🎯 What is React?

React is a JavaScript library for building user interfaces. It lets you create reusable **components** - small pieces of UI that can be combined to build complex applications.

### Why React?

**Traditional Web Development:**

| File | Purpose |
|------|---------|
| `index.html` | Structure |
| `styles.css` | Styling |
| `script.js` | Behavior |

> ❌ **Problem**: Code is scattered across files, hard to maintain

**React Approach:**

| Component | Contains |
|-----------|----------|
| `Header` | HTML + CSS + JS (all in one) |
| `ProductCard` | HTML + CSS + JS (all in one) |
| `Footer` | HTML + CSS + JS (all in one) |

> ✅ **Solution**: Self-contained, reusable, easy to maintain

### Key Concepts

| Concept | Description |
|---------|-------------|
| **Component** | A reusable piece of UI |
| **JSX** | HTML-like syntax in JavaScript |
| **Props** | Data passed to components (like function arguments) |
| **State** | Data that changes over time |
| **Hooks** | Functions that add features to components |

---

## 🧱 Components

Components are the building blocks of React applications. Think of them as custom HTML elements.

### Function Components

The standard way to write components (used throughout this project):

```tsx
// Simple component
function Welcome() {
  return <h1>Welcome to Root Suppliers!</h1>;
}

// Component with props
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// Usage
<Welcome />
<Greeting name="John" />
```

### Real Example from This Project

```tsx
// src/components/cards/ProductCard.tsx
interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    shortDescription: string;
    price: number;
    images: { url: string; alt: string }[];
    category: { name: string; slug: string };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Image */}
      <div className="relative h-48">
        <img
          src={product.images[0]?.url || "/placeholder.jpg"}
          alt={product.name}
          className="object-cover w-full h-full"
        />
      </div>
      
      {/* Content */}
      <div className="p-4">
        <span className="text-sm text-primary-600">
          {product.category.name}
        </span>
        <h3 className="font-semibold text-lg mt-1">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mt-2">
          {product.shortDescription}
        </p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xl font-bold">
            Rs. {product.price}
          </span>
          <a
            href={`/products/${product.slug}`}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg"
          >
            View Details
          </a>
        </div>
      </div>
    </div>
  );
}
```

### Component Composition

Build complex UIs by combining simple components:

```tsx
// Small components
function ProductImage({ src, alt }) {
  return <img src={src} alt={alt} className="w-full h-48 object-cover" />;
}

function ProductInfo({ name, price }) {
  return (
    <div>
      <h3>{name}</h3>
      <span>Rs. {price}</span>
    </div>
  );
}

function ViewButton({ href }) {
  return (
    <a href={href} className="btn-primary">
      View Details
    </a>
  );
}

// Combined component
function ProductCard({ product }) {
  return (
    <div className="card">
      <ProductImage src={product.image} alt={product.name} />
      <ProductInfo name={product.name} price={product.price} />
      <ViewButton href={`/products/${product.slug}`} />
    </div>
  );
}
```

---

## 📝 JSX Syntax

JSX lets you write HTML-like code in JavaScript. It gets transformed into regular JavaScript.

### Basic Rules

```tsx
// 1. Single parent element
// ❌ Wrong
return (
  <h1>Title</h1>
  <p>Paragraph</p>
);

// ✅ Correct - wrap in parent
return (
  <div>
    <h1>Title</h1>
    <p>Paragraph</p>
  </div>
);

// ✅ Or use Fragment (no extra DOM element)
return (
  <>
    <h1>Title</h1>
    <p>Paragraph</p>
  </>
);
```

```tsx
// 2. JavaScript expressions in curly braces {}
const name = "John";
const price = 999;

return (
  <div>
    <h1>Hello, {name}!</h1>
    <p>Price: Rs. {price * 1.13}</p>  {/* Can do math */}
    <p>Today: {new Date().toDateString()}</p>  {/* Can call functions */}
  </div>
);
```

```tsx
// 3. Attributes use camelCase
// HTML: class, onclick, tabindex
// JSX: className, onClick, tabIndex

<button 
  className="btn-primary"
  onClick={handleClick}
  tabIndex={0}
>
  Click me
</button>
```

```tsx
// 4. Self-closing tags
<img src="..." alt="..." />
<input type="text" />
<br />
```

```tsx
// 5. Inline styles as objects
<div style={{ 
  backgroundColor: "blue", 
  fontSize: "16px",
  marginTop: "20px" 
}}>
  Styled content
</div>
```

---

## 📦 Props

Props (properties) are how you pass data to components. They're like function arguments.

### Basic Props

```tsx
// Defining props
function Button({ text, color, size }) {
  return (
    <button className={`btn-${color} btn-${size}`}>
      {text}
    </button>
  );
}

// Passing props
<Button text="Click Me" color="primary" size="lg" />
<Button text="Cancel" color="secondary" size="sm" />
```

### Props with TypeScript

```tsx
// Define prop types with interface
interface ButtonProps {
  text: string;
  color: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";  // ? means optional
  disabled?: boolean;
  onClick?: () => void;
}

function Button({ 
  text, 
  color, 
  size = "md",  // Default value
  disabled = false,
  onClick 
}: ButtonProps) {
  return (
    <button 
      className={`btn-${color} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
```

### Children Prop

Special prop for content between tags:

```tsx
// Component that accepts children
function Card({ title, children }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}

// Usage
<Card title="Product Info">
  <p>This is the product description.</p>
  <button>Buy Now</button>
</Card>
```

### Spreading Props

```tsx
// Pass all props to an element
function Input({ label, ...inputProps }) {
  return (
    <div>
      <label>{label}</label>
      <input {...inputProps} />
    </div>
  );
}

// All standard input props work
<Input 
  label="Email" 
  type="email" 
  placeholder="Enter email"
  required
/>
```

---

## 🔄 State with useState

State is data that changes over time. When state changes, React re-renders the component.

### Basic useState

```tsx
"use client";  // Required in Next.js for client components

import { useState } from "react";

function Counter() {
  // Declare state: [currentValue, setterFunction] = useState(initialValue)
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### Multiple State Variables

```tsx
function ProductForm() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [isActive, setIsActive] = useState(true);
  
  return (
    <form>
      <input 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
      />
      <input 
        type="number"
        value={price} 
        onChange={(e) => setPrice(Number(e.target.value))} 
      />
      <input 
        type="checkbox"
        checked={isActive} 
        onChange={(e) => setIsActive(e.target.checked)} 
      />
    </form>
  );
}
```

### Object State

```tsx
function UserProfile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    age: 0
  });
  
  // Update specific field (keep other fields)
  const updateName = (newName) => {
    setUser(prev => ({
      ...prev,        // Spread previous values
      name: newName   // Update just name
    }));
  };
  
  return (
    <input 
      value={user.name}
      onChange={(e) => updateName(e.target.value)}
    />
  );
}
```

### Array State

```tsx
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn React" },
    { id: 2, text: "Build Project" }
  ]);
  
  // Add item
  const addTodo = (text) => {
    setTodos(prev => [
      ...prev,
      { id: Date.now(), text }
    ]);
  };
  
  // Remove item
  const removeTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };
  
  // Update item
  const updateTodo = (id, newText) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };
  
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          {todo.text}
          <button onClick={() => removeTodo(todo.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```

---

## ⚡ Side Effects with useEffect

`useEffect` runs code after the component renders. Use it for:
- Fetching data
- Setting up subscriptions
- Updating the DOM directly

### Basic useEffect

```tsx
"use client";

import { useState, useEffect } from "react";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // This runs after component mounts
    async function fetchProducts() {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data.products);
      setLoading(false);
    }
    
    fetchProducts();
  }, []);  // Empty array = run once on mount
  
  if (loading) return <p>Loading...</p>;
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
```

### Dependency Array

```tsx
// Run once on mount
useEffect(() => {
  console.log("Mounted");
}, []);

// Run when 'id' changes
useEffect(() => {
  fetchProduct(id);
}, [id]);

// Run when any dependency changes
useEffect(() => {
  fetchProducts(category, search);
}, [category, search]);

// Run on every render (rarely needed)
useEffect(() => {
  console.log("Rendered");
});
```

### Cleanup Function

```tsx
useEffect(() => {
  // Setup
  const subscription = subscribeToUpdates();
  
  // Cleanup (runs when component unmounts or before re-running effect)
  return () => {
    subscription.unsubscribe();
  };
}, []);
```

### Real Example: Search with Debounce

```tsx
function ProductSearch() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    // Don't search if empty
    if (!search) {
      setResults([]);
      return;
    }
    
    // Debounce: wait 300ms after typing stops
    const timeoutId = setTimeout(async () => {
      const response = await fetch(`/api/products?search=${search}`);
      const data = await response.json();
      setResults(data.products);
    }, 300);
    
    // Cleanup: cancel if user types again
    return () => clearTimeout(timeoutId);
  }, [search]);
  
  return (
    <div>
      <input 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
      />
      {results.map(product => (
        <div key={product._id}>{product.name}</div>
      ))}
    </div>
  );
}
```

---

## 🖱️ Event Handling

React uses camelCase event names and passes functions as handlers.

### Common Events

```tsx
function EventExamples() {
  // Click
  const handleClick = () => {
    console.log("Clicked!");
  };
  
  // With event object
  const handleClickWithEvent = (e) => {
    e.preventDefault();  // Prevent default behavior
    console.log("Button:", e.target);
  };
  
  // Input change
  const handleChange = (e) => {
    console.log("Value:", e.target.value);
  };
  
  // Form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };
  
  // Keyboard
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      console.log("Enter pressed");
    }
  };
  
  return (
    <>
      <button onClick={handleClick}>Click me</button>
      <button onClick={handleClickWithEvent}>With event</button>
      
      <input onChange={handleChange} />
      <input onKeyDown={handleKeyDown} />
      
      <form onSubmit={handleSubmit}>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
```

### Passing Arguments to Handlers

```tsx
function ProductList({ products }) {
  const handleDelete = (productId) => {
    console.log("Delete:", productId);
  };
  
  return (
    <ul>
      {products.map(product => (
        <li key={product._id}>
          {product.name}
          {/* Method 1: Arrow function */}
          <button onClick={() => handleDelete(product._id)}>
            Delete
          </button>
          
          {/* Method 2: Bind (less common) */}
          <button onClick={handleDelete.bind(null, product._id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
```

---

## ❓ Conditional Rendering

Show different content based on conditions.

### If/Else with Ternary

```tsx
function Greeting({ isLoggedIn, username }) {
  return (
    <div>
      {isLoggedIn ? (
        <p>Welcome back, {username}!</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

### && for "Show if true"

```tsx
function Notification({ hasNotifications, count }) {
  return (
    <div>
      {hasNotifications && (
        <span className="badge">{count}</span>
      )}
    </div>
  );
}
```

### Multiple Conditions

```tsx
function OrderStatus({ status }) {
  return (
    <div>
      {status === "pending" && <span className="yellow">Pending</span>}
      {status === "shipped" && <span className="blue">Shipped</span>}
      {status === "delivered" && <span className="green">Delivered</span>}
      {status === "cancelled" && <span className="red">Cancelled</span>}
    </div>
  );
}

// Or use object mapping
function OrderStatusBetter({ status }) {
  const statusColors = {
    pending: "yellow",
    shipped: "blue",
    delivered: "green",
    cancelled: "red"
  };
  
  return (
    <span className={statusColors[status]}>
      {status}
    </span>
  );
}
```

### Early Return

```tsx
function UserProfile({ user, loading, error }) {
  if (loading) {
    return <Spinner />;
  }
  
  if (error) {
    return <Error message={error} />;
  }
  
  if (!user) {
    return <p>User not found</p>;
  }
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

---

## 📋 Lists and Keys

Render arrays of data with `.map()`. Always provide a unique `key` prop.

### Basic List

```tsx
function ProductList({ products }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
```

### Why Keys Matter

```tsx
// ❌ Bad: Using index as key
{products.map((product, index) => (
  <ProductCard key={index} product={product} />
))}
// Problems when list changes: wrong items update, animations break

// ✅ Good: Using unique ID
{products.map(product => (
  <ProductCard key={product._id} product={product} />
))}
// React correctly identifies which items changed
```

### Empty State

```tsx
function ProductList({ products }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
```

---

## 🎨 Component Patterns in This Project

### 1. Container/Presentational Pattern

```tsx
// Container: Handles data fetching
async function ProductsContainer() {
  const products = await fetchProducts();
  return <ProductGrid products={products} />;
}

// Presentational: Handles display
function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
```

### 2. Compound Components

```tsx
// Card with sub-components
function Card({ children }) {
  return <div className="card">{children}</div>;
}

Card.Header = function CardHeader({ children }) {
  return <div className="card-header">{children}</div>;
};

Card.Body = function CardBody({ children }) {
  return <div className="card-body">{children}</div>;
};

Card.Footer = function CardFooter({ children }) {
  return <div className="card-footer">{children}</div>;
};

// Usage
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>
```

### 3. Render Props

```tsx
// Component that provides data
function ProductFetcher({ render }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(data => {
        setProducts(data.products);
        setLoading(false);
      });
  }, []);
  
  return render({ products, loading });
}

// Usage
<ProductFetcher 
  render={({ products, loading }) => (
    loading ? <Spinner /> : <ProductGrid products={products} />
  )}
/>
```

### 4. Custom Hooks

```tsx
// Reusable logic in a hook
function useProducts(filters = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);
        const params = new URLSearchParams(filters);
        const res = await fetch(`/api/products?${params}`);
        const data = await res.json();
        setProducts(data.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [JSON.stringify(filters)]);
  
  return { products, loading, error };
}

// Usage in any component
function ProductPage() {
  const { products, loading, error } = useProducts({ category: "tools" });
  
  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;
  
  return <ProductGrid products={products} />;
}
```

---

## 📚 Next Steps

Now that you understand React basics:

→ **Next**: [05 - Next.js Deep Dive](./05-NEXTJS-DEEP-DIVE.md) - Learn Next.js specific features

---

*Happy Learning! 🎉*
