# 📚 13 - State Management

> **Managing Application State with React Context and Hooks**

---

## 📖 Table of Contents

1. [Understanding State](#understanding-state)
2. [Local State with useState](#local-state-with-usestate)
3. [When to Use Context](#when-to-use-context)
4. [Creating Context](#creating-context)
5. [Custom Hooks for Context](#custom-hooks-for-context)
6. [Real Examples](#real-examples)
7. [Best Practices](#best-practices)

---

## 💡 Understanding State

### What is State?

State is data that changes over time and affects what is rendered.

**Types of State:**

| Type | Description | Example | Tool |
|------|-------------|---------|------|
| **Local State** | Lives in one component | Form inputs, toggles, loading | `useState` |
| **Shared State** | Needed by multiple components | User data, theme, notifications | Context API |
| **Server State** | Data from API | Products, categories | fetch + useState |

---

## 🎣 Local State with useState

### Basic Usage

```tsx
"use client";

import { useState } from "react";

function Counter() {
  // Declare state variable and setter
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

### Common Patterns

```tsx
// String state
const [name, setName] = useState("");

// Boolean state (toggle)
const [isOpen, setIsOpen] = useState(false);
const toggle = () => setIsOpen(prev => !prev);

// Object state
const [user, setUser] = useState({ name: "", email: "" });
const updateName = (name: string) => {
  setUser(prev => ({ ...prev, name }));  // Merge, don't replace
};

// Array state
const [items, setItems] = useState<string[]>([]);
const addItem = (item: string) => {
  setItems(prev => [...prev, item]);
};
const removeItem = (index: number) => {
  setItems(prev => prev.filter((_, i) => i !== index));
};

// Nullable state
const [user, setUser] = useState<User | null>(null);

// Loading/Error pattern
const [data, setData] = useState<Product[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

---

## 🤔 When to Use Context

### Prop Drilling Problem

```tsx
// ❌ Without Context - Prop Drilling
function App() {
  const [user, setUser] = useState<User | null>(null);
  
  return (
    <Layout user={user}>
      <Sidebar user={user}>
        <Navigation user={user}>
          <UserMenu user={user} />  {/* Deep nesting! */}
        </Navigation>
      </Sidebar>
    </Layout>
  );
}

// ✅ With Context - No Prop Drilling
function App() {
  return (
    <UserProvider>
      <Layout>
        <Sidebar>
          <Navigation>
            <UserMenu />  {/* Access user via context */}
          </Navigation>
        </Sidebar>
      </Layout>
    </UserProvider>
  );
}
```

### When to Use Context

| Use Context For | Don't Use Context For |
|-----------------|----------------------|
| User authentication | Form input values |
| Theme (dark/light) | Single component state |
| Notifications/Toasts | Loading states |
| App-wide settings | Server data (use SWR/React Query) |
| Locale/Language | UI toggle states |

---

## 🔧 Creating Context

### Basic Context Pattern

```tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// 1. Define types
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// 2. Create context with undefined default
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Create provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  
  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      setUser(data.user);
    } else {
      throw new Error(data.message);
    }
  };
  
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };
  
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 4. Create custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}
```

### Using the Context

```tsx
// Wrap your app
// src/app/layout.tsx
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

// Use in any component
function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <Link href="/login">Login</Link>;
  }
  
  return (
    <div>
      <span>Hello, {user.name}</span>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## 🎯 Custom Hooks for Context

### Why Custom Hooks?

1. Cleaner component code
2. Type safety
3. Error handling
4. Reusable logic

### Toast Notification System

```tsx
// src/components/ui/Toast.tsx
"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

// Types
type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (type: ToastType, message: string, duration?: number) => void;
  hideToast: (id: string) => void;
}

// Context
const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// Custom Hook
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

// Provider Component
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (type: ToastType, message: string, duration: number = 5000) => {
      const id = Math.random().toString(36).substring(7);
      const newToast: Toast = { id, type, message, duration };

      setToasts((prev) => [...prev, newToast]);

      // Auto-dismiss
      if (duration > 0) {
        setTimeout(() => {
          hideToast(id);
        }, duration);
      }
    },
    []
  );

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={hideToast} />
    </ToastContext.Provider>
  );
};

// Toast Container (renders all toasts)
const ToastContainer = ({ 
  toasts, 
  onClose 
}: { 
  toasts: Toast[]; 
  onClose: (id: string) => void 
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
};

// Individual Toast
const ToastItem = ({ 
  toast, 
  onClose 
}: { 
  toast: Toast; 
  onClose: (id: string) => void 
}) => {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-600" />,
    error: <AlertCircle className="h-5 w-5 text-red-600" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
    info: <Info className="h-5 w-5 text-blue-600" />,
  };

  const styles = {
    success: "bg-green-50 border-green-200 text-green-900",
    error: "bg-red-50 border-red-200 text-red-900",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
    info: "bg-blue-50 border-blue-200 text-blue-900",
  };

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg ${styles[toast.type]}`}>
      {icons[toast.type]}
      <p className="flex-1">{toast.message}</p>
      <button onClick={() => onClose(toast.id)}>
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
```

### Using Toast System

```tsx
// In any component
function ProductForm() {
  const { showToast } = useToast();
  
  const handleSubmit = async (data) => {
    try {
      await createProduct(data);
      showToast("success", "Product created successfully!");
    } catch (error) {
      showToast("error", "Failed to create product");
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* ... */}
    </form>
  );
}
```

---

## 📦 Real Examples

### Theme Context

```tsx
// src/contexts/ThemeContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Get saved theme or default to system
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    // Resolve system theme
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const resolve = () => {
      if (theme === "system") {
        setResolvedTheme(mediaQuery.matches ? "dark" : "light");
      } else {
        setResolvedTheme(theme);
      }
    };
    
    resolve();
    mediaQuery.addEventListener("change", resolve);
    return () => mediaQuery.removeEventListener("change", resolve);
  }, [theme]);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme: handleSetTheme, resolvedTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
```

### Cart Context (E-commerce Pattern)

```tsx
// src/contexts/CartContext.tsx
"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" };

interface CartContextType extends CartState {
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

// Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingIndex = state.items.findIndex(
        item => item.id === action.payload.id
      );
      
      if (existingIndex > -1) {
        // Update quantity if item exists
        const newItems = [...state.items];
        newItems[existingIndex].quantity += action.payload.quantity;
        return {
          items: newItems,
          total: calculateTotal(newItems),
        };
      }
      
      // Add new item
      const newItems = [...state.items, action.payload];
      return {
        items: newItems,
        total: calculateTotal(newItems),
      };
    }
    
    case "REMOVE_ITEM": {
      const newItems = state.items.filter(item => item.id !== action.payload);
      return {
        items: newItems,
        total: calculateTotal(newItems),
      };
    }
    
    case "UPDATE_QUANTITY": {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        items: newItems,
        total: calculateTotal(newItems),
      };
    }
    
    case "CLEAR_CART":
      return { items: [], total: 0 };
    
    default:
      return state;
  }
}

function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  const addItem = (item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
```

---

## 💡 Best Practices

### 1. Split Contexts by Concern

```tsx
// ❌ One giant context
<AppContext.Provider value={{ user, theme, cart, notifications }}>

// ✅ Separate contexts
<AuthProvider>
  <ThemeProvider>
    <ToastProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </ToastProvider>
  </ThemeProvider>
</AuthProvider>
```

### 2. Memoize Context Values

```tsx
import { useMemo, useCallback } from "react";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  
  // Memoize callbacks
  const login = useCallback(async (email, password) => {
    // ...
  }, []);
  
  // Memoize context value
  const value = useMemo(() => ({
    user,
    login,
    logout,
  }), [user, login, logout]);
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
```

### 3. Type Your Contexts

```tsx
// Always define types
interface ContextType {
  data: Data;
  updateData: (data: Data) => void;
}

// Create with undefined to catch missing provider
const Context = createContext<ContextType | undefined>(undefined);

// Throw error if used outside provider
export function useMyContext() {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useMyContext must be used within Provider");
  }
  return context;
}
```

### 4. Keep Contexts Focused

```tsx
// ❌ Too much in one context
interface BigContext {
  user: User;
  products: Product[];
  cart: CartItem[];
  theme: Theme;
  notifications: Notification[];
}

// ✅ Focused contexts
interface AuthContext { user: User; login: () => void; logout: () => void; }
interface CartContext { items: CartItem[]; add: () => void; remove: () => void; }
interface ThemeContext { theme: Theme; setTheme: () => void; }
```

---

## 📚 Next Steps

Now that you understand state management:

→ **Next**: [14 - Error Handling](./14-ERROR-HANDLING.md) - Handle errors gracefully

---

*Happy State Managing! 🎯*
