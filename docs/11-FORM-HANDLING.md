# 📚 11 - Form Handling

> **Building Robust Forms with React Hook Form and Zod**

---

## 📖 Table of Contents

1. [Form Handling in React](#form-handling-in-react)
2. [React Hook Form](#react-hook-form)
3. [Zod Validation](#zod-validation)
4. [Connecting Zod with React Hook Form](#connecting-zod-with-react-hook-form)
5. [Form Field Components](#form-field-components)
6. [Complex Form Patterns](#complex-form-patterns)
7. [Form State Management](#form-state-management)
8. [Submission and Error Handling](#submission-and-error-handling)
9. [Real Examples from Project](#real-examples-from-project)

---

## 📝 Form Handling in React

### The Problem with Basic Forms

```tsx
// Basic React form - lots of manual work
function BasicForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Manual validation
    if (!email.includes("@")) {
      setEmailError("Invalid email");
      return;
    }
    if (password.length < 6) {
      setPasswordError("Too short");
      return;
    }
    
    // Submit...
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      {emailError && <span>{emailError}</span>}
      {/* ... more fields ... */}
    </form>
  );
}
```

### Problems:
- Many useState calls
- Manual validation logic
- Error state management
- No TypeScript safety
- Code duplication

---

## 📦 React Hook Form

React Hook Form provides performant, flexible form handling.

### Installation

```bash
pnpm add react-hook-form @hookform/resolvers
```

### Basic Usage

```tsx
"use client";

import { useForm } from "react-hook-form";

interface FormData {
  email: string;
  password: string;
}

function LoginForm() {
  const {
    register,      // Connect inputs
    handleSubmit,  // Handle form submission
    formState: { errors, isSubmitting }  // Form state
  } = useForm<FormData>();
  
  const onSubmit = async (data: FormData) => {
    console.log(data);  // { email: "...", password: "..." }
    // Submit to API
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("email", { required: "Email is required" })}
        type="email"
        placeholder="Email"
      />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input
        {...register("password", { required: "Password is required" })}
        type="password"
        placeholder="Password"
      />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Loading..." : "Login"}
      </button>
    </form>
  );
}
```

### The register Function

`register` connects your input to React Hook Form:

```tsx
// register returns these props
const { onChange, onBlur, name, ref } = register("fieldName");

// Spread onto input
<input {...register("email")} />

// With validation rules
<input {...register("email", {
  required: "Email is required",
  pattern: {
    value: /^\S+@\S+\.\S+$/,
    message: "Invalid email format"
  }
})} />
```

---

## ✅ Zod Validation

Zod is a TypeScript-first schema validation library.

### Installation

```bash
pnpm add zod
```

### Basic Schemas

```typescript
import { z } from "zod";

// String validation
const emailSchema = z.string().email("Invalid email");

// Number validation
const priceSchema = z.number().min(0, "Price cannot be negative");

// Boolean
const isActiveSchema = z.boolean().default(true);

// Enum
const roleSchema = z.enum(["admin", "editor"]);

// Optional
const nicknameSchema = z.string().optional();
```

### Object Schemas

```typescript
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

// Infer TypeScript type from schema
type LoginFormData = z.infer<typeof loginSchema>;
// { email: string; password: string }
```

### Advanced Validation

```typescript
const userSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long"),
    
  email: z.string()
    .email("Invalid email")
    .toLowerCase(),  // Transform to lowercase
    
  age: z.number()
    .int("Must be whole number")
    .min(18, "Must be 18 or older")
    .max(120, "Invalid age"),
    
  website: z.string()
    .url("Invalid URL")
    .optional()
    .or(z.literal("")),  // Allow empty string
    
  role: z.enum(["admin", "editor", "viewer"]),
  
  tags: z.array(z.string()).default([]),
  
  // Custom validation
  username: z.string().refine(
    (val) => !val.includes(" "),
    "No spaces allowed"
  ),
});
```

### Shared Schemas

```typescript
// src/lib/validations/shared.schema.ts
import { z } from "zod";

// Reusable image schema
export const imageSchema = z.object({
  url: z.string().optional().or(z.literal("")),
  publicId: z.string().optional(),
  alt: z.string().optional(),
});

// Reusable SEO schema
export const seoSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

// Reusable status schema
export const baseStatusSchema = z.object({
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  order: z.number().default(0),
});
```

### Product Schema Example

```typescript
// src/lib/validations/product.schema.ts
import { z } from "zod";
import { imageSchema, seoSchema, baseStatusSchema } from "./shared.schema";

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().optional().or(z.literal("")),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().optional(),
  category: z.string().min(1, "Please select a category"),
  brand: z.string().optional(),
  sku: z.string().optional(),
  price: z.number().optional(),
  discountPrice: z.number().optional(),
  stock: z.number().optional().default(0),
  images: z.array(imageSchema).default([]),
  specifications: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
    })
  ).default([]),
  features: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  isTopSelling: z.boolean().default(false),
}).merge(baseStatusSchema).merge(seoSchema);

export type ProductFormData = z.infer<typeof productSchema>;
```

---

## 🔗 Connecting Zod with React Hook Form

### zodResolver

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),  // Connect Zod
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  // errors are now typed and validated by Zod
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} />
      {errors.email && <span>{errors.email.message}</span>}
      {/* ... */}
    </form>
  );
}
```

---

## 🧩 Form Field Components

### Creating Reusable Form Fields

```tsx
// Input field with error handling
interface FormInputProps {
  label: string;
  name: string;
  register: any;
  errors: any;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

function FormInput({
  label,
  name,
  register,
  errors,
  type = "text",
  placeholder,
  required,
}: FormInputProps) {
  return (
    <div className="space-y-1">
      <label className="form-label">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className={cn(
          "input-field",
          errors[name] && "border-red-500 focus:border-red-500"
        )}
      />
      {errors[name] && (
        <p className="form-error">{errors[name].message}</p>
      )}
    </div>
  );
}

// Usage
<FormInput
  label="Email"
  name="email"
  register={register}
  errors={errors}
  type="email"
  required
/>
```

### Select Field

```tsx
interface FormSelectProps {
  label: string;
  name: string;
  register: any;
  errors: any;
  options: { value: string; label: string }[];
  placeholder?: string;
}

function FormSelect({
  label,
  name,
  register,
  errors,
  options,
  placeholder = "Select...",
}: FormSelectProps) {
  return (
    <div className="space-y-1">
      <label className="form-label">{label}</label>
      <select
        {...register(name)}
        className={cn(
          "select-field",
          errors[name] && "border-red-500"
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors[name] && (
        <p className="form-error">{errors[name].message}</p>
      )}
    </div>
  );
}
```

### Checkbox Field

```tsx
interface FormCheckboxProps {
  label: string;
  name: string;
  register: any;
  description?: string;
}

function FormCheckbox({
  label,
  name,
  register,
  description,
}: FormCheckboxProps) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        {...register(name)}
        type="checkbox"
        className="mt-1 h-4 w-4 rounded border-gray-300 
                   text-primary-600 focus:ring-primary-500"
      />
      <div>
        <span className="font-medium text-gray-700">{label}</span>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>
    </label>
  );
}
```

---

## 🔄 Complex Form Patterns

### useFieldArray for Dynamic Fields

```tsx
import { useForm, useFieldArray } from "react-hook-form";

interface FormData {
  name: string;
  specifications: { key: string; value: string }[];
}

function ProductForm() {
  const { register, control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: "",
      specifications: [{ key: "", value: "" }],
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "specifications",
  });
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} />
      
      <div>
        <h3>Specifications</h3>
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <input
              {...register(`specifications.${index}.key`)}
              placeholder="Key"
            />
            <input
              {...register(`specifications.${index}.value`)}
              placeholder="Value"
            />
            <button type="button" onClick={() => remove(index)}>
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => append({ key: "", value: "" })}
        >
          Add Specification
        </button>
      </div>
      
      <button type="submit">Save</button>
    </form>
  );
}
```

### watch - React to Field Changes

```tsx
function PriceForm() {
  const { register, watch } = useForm<{
    price: number;
    discountPrice: number;
  }>();
  
  // Watch specific field
  const price = watch("price");
  const discountPrice = watch("discountPrice");
  
  // Calculate savings
  const savings = price && discountPrice 
    ? ((price - discountPrice) / price * 100).toFixed(0)
    : 0;
  
  return (
    <form>
      <input {...register("price", { valueAsNumber: true })} />
      <input {...register("discountPrice", { valueAsNumber: true })} />
      {savings > 0 && (
        <p className="text-green-600">Save {savings}%!</p>
      )}
    </form>
  );
}
```

### setValue and reset

```tsx
function EditForm({ existingData }) {
  const { register, setValue, reset, handleSubmit } = useForm();
  
  // Set single value
  useEffect(() => {
    setValue("name", existingData.name);
  }, [existingData, setValue]);
  
  // Reset entire form
  useEffect(() => {
    reset(existingData);  // Populate all fields
  }, [existingData, reset]);
  
  // Reset to defaults
  const handleClear = () => {
    reset({
      name: "",
      email: "",
    });
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* ... */}
    </form>
  );
}
```

---

## 📊 Form State Management

### formState Properties

```tsx
const {
  formState: {
    errors,       // Field errors
    isSubmitting, // Form is being submitted
    isDirty,      // Any field has been modified
    isValid,      // All validations pass
    dirtyFields,  // Which fields are dirty
    touchedFields // Which fields have been touched
  }
} = useForm();

// Usage
<button 
  type="submit" 
  disabled={isSubmitting || !isDirty}
>
  {isSubmitting ? "Saving..." : "Save"}
</button>

// Show unsaved changes warning
{isDirty && (
  <p className="text-amber-500">You have unsaved changes</p>
)}
```

### Error Handling

```tsx
// Access errors
const { formState: { errors } } = useForm();

// Display errors
{errors.email?.message && (
  <p className="text-red-500">{errors.email.message}</p>
)}

// Root level errors (from API)
{errors.root?.message && (
  <p className="text-red-500">{errors.root.message}</p>
)}

// Set error manually
const { setError, clearErrors } = useForm();

setError("email", { 
  type: "manual", 
  message: "This email is already taken" 
});

clearErrors("email");
```

---

## 📤 Submission and Error Handling

### Complete Form Submission

```tsx
function ContactForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });
  
  const onSubmit = async (data: ContactFormData) => {
    setServerError(null);
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }
      
      // Success - reset form
      reset();
      toast.success("Message sent successfully!");
      
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "An error occurred"
      );
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg">
          {serverError}
        </div>
      )}
      
      <div>
        <label className="form-label">Name</label>
        <input {...register("name")} className="input-field" />
        {errors.name && (
          <p className="form-error">{errors.name.message}</p>
        )}
      </div>
      
      <div>
        <label className="form-label">Email</label>
        <input {...register("email")} type="email" className="input-field" />
        {errors.email && (
          <p className="form-error">{errors.email.message}</p>
        )}
      </div>
      
      <div>
        <label className="form-label">Message</label>
        <textarea {...register("message")} className="textarea-field" />
        {errors.message && (
          <p className="form-error">{errors.message.message}</p>
        )}
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending...
          </span>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
}
```

---

## 📋 Real Examples from Project

### Login Form

```tsx
// src/app/(admin)/admin/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.message || "Invalid credentials");
        return;
      }

      router.replace("/admin");
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      {/* Email Field */}
      <div>
        <label htmlFor="email" className="form-label">
          Email Address
        </label>
        <input
          {...register("email")}
          id="email"
          type="email"
          autoComplete="email"
          className={cn(
            "input-field",
            errors.email && "border-red-500"
          )}
        />
        {errors.email && (
          <p className="form-error">{errors.email.message}</p>
        )}
      </div>
      
      {/* Password Field with Toggle */}
      <div>
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <div className="relative">
          <input
            {...register("password")}
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            className={cn(
              "input-field pr-10",
              errors.password && "border-red-500"
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && (
          <p className="form-error">{errors.password.message}</p>
        )}
      </div>
      
      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Signing in...
          </span>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
}
```

---

## 📚 Next Steps

Now that you understand form handling:

→ **Next**: [12 - File Uploads](./12-FILE-UPLOADS.md) - Handle image uploads with Cloudinary

---

*Happy Form Building! 📝*
