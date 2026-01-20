# 📚 09 - Database & MongoDB

> **Understanding MongoDB, Mongoose, and Database Operations**

---

## 📖 Table of Contents

1. [What is MongoDB?](#what-is-mongodb)
2. [SQL vs NoSQL](#sql-vs-nosql)
3. [MongoDB Connection](#mongodb-connection)
4. [Mongoose ODM](#mongoose-odm)
5. [Creating Schemas and Models](#creating-schemas-and-models)
6. [CRUD Operations](#crud-operations)
7. [Queries and Filters](#queries-and-filters)
8. [Population (Joins)](#population-joins)
9. [Middleware (Hooks)](#middleware-hooks)
10. [Indexes and Performance](#indexes-and-performance)
11. [Project Models Explained](#project-models-explained)

---

## 🗄️ What is MongoDB?

MongoDB is a NoSQL document database. Instead of tables and rows, it uses collections and documents.

**MongoDB Structure:**

```
Database: root_suppliers
│
├── Collection: products
│   ├── { _id: "...", name: "Drill", price: 999 }
│   ├── { _id: "...", name: "Hammer", price: 299 }
│   └── { _id: "...", name: "Saw", price: 499 }
│
├── Collection: categories
│   ├── { _id: "...", name: "Power Tools" }
│   └── { _id: "...", name: "Hand Tools" }
│
└── Collection: users
    └── { _id: "...", email: "admin@..." }
```

| SQL Term | MongoDB Term |
|----------|--------------|
| Database | Database |
| Table | Collection |
| Row | Document |
| Column | Field |

### MongoDB Document

Documents are JSON-like objects (BSON):

```javascript
// A product document
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "Electric Drill",
  slug: "electric-drill",
  price: 999,
  category: ObjectId("507f1f77bcf86cd799439022"),
  images: [
    { url: "https://...", publicId: "drill-1", alt: "Drill front" }
  ],
  specifications: [
    { key: "Power", value: "750W" },
    { key: "Speed", value: "3000 RPM" }
  ],
  isActive: true,
  createdAt: ISODate("2024-01-15T10:30:00Z"),
  updatedAt: ISODate("2024-01-15T10:30:00Z")
}
```

---

## 🔄 SQL vs NoSQL

| Feature | SQL (MySQL, PostgreSQL) | NoSQL (MongoDB) |
|---------|------------------------|-----------------|
| **Structure** | Tables with fixed schema | Collections with flexible documents |
| **Schema** | Rigid, predefined | Flexible, can vary per document |
| **Relationships** | Foreign keys, JOINs | Embedded documents or references |
| **Scaling** | Vertical (bigger server) | Horizontal (more servers) |
| **Best For** | Complex relationships | Rapid development, flexibility |

### When to Use MongoDB

✅ **Good for:**
- Rapid prototyping
- Flexible, evolving schemas
- Document-like data (products, articles)
- Hierarchical data (categories)

❌ **Not ideal for:**
- Complex multi-table transactions
- Heavy relational data
- Strict data integrity requirements

---

## 🔌 MongoDB Connection

### Connection Setup

```typescript
// src/lib/db/connect.ts
import mongoose from "mongoose";

/**
 * Global cache prevents multiple connections during hot reload
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  const MONGODB_URI = process.env.MONGODB_URI!;

  if (!MONGODB_URI) {
    throw new Error(
      "Please define MONGODB_URI in .env.local"
    );
  }

  // Return cached connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create new connection
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,           // Max 10 connections
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4                  // IPv4
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ MongoDB connected");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
```

### Using the Connection

```typescript
// In any API route
import connectDB from "@/lib/db/connect";

export async function GET() {
  await connectDB();  // Ensure connection before queries
  
  const products = await Product.find();
  return NextResponse.json({ products });
}
```

### Connection String Format

```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

---

## 🦦 Mongoose ODM

Mongoose is an Object Document Mapper (ODM) for MongoDB. It provides:

- **Schema definition** - Structure your documents
- **Validation** - Ensure data integrity
- **Type casting** - Automatic type conversion
- **Middleware** - Pre/post hooks for operations
- **Population** - Join-like functionality

**Mongoose Workflow:**

| Step | Action | Example |
|------|--------|---------|
| 1️⃣ | Define Schema | `const ProductSchema = new Schema({ name: String })` |
| 2️⃣ | Create Model | `const Product = mongoose.model("Product", ProductSchema)` |
| 3️⃣ | Use Model | `const drill = await Product.create({ name: "Drill" })` |

```
Schema (structure) → Model (class) → Document (instance)
```

---

## 📋 Creating Schemas and Models

### Basic Schema

```typescript
import mongoose, { Schema, Document, Model } from "mongoose";

// TypeScript interface for type safety
export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  price: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema
const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [200, "Name cannot exceed 200 characters"]
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"]
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true  // Auto-add createdAt and updatedAt
  }
);

// Create and export model
const Product: Model<IProduct> = 
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
```

### Schema Types

```typescript
const ExampleSchema = new Schema({
  // String
  name: { type: String, required: true },
  slug: { type: String, unique: true, lowercase: true },
  
  // Number
  price: { type: Number, min: 0, max: 1000000 },
  
  // Boolean
  isActive: { type: Boolean, default: true },
  
  // Date
  publishDate: { type: Date, default: Date.now },
  
  // ObjectId (reference to another document)
  category: { 
    type: Schema.Types.ObjectId, 
    ref: "Category",
    required: true
  },
  
  // Array of strings
  tags: [String],
  
  // Array of objects
  images: [{
    url: { type: String, required: true },
    publicId: String,
    alt: String
  }],
  
  // Nested object
  meta: {
    title: String,
    description: String
  },
  
  // Enum (restricted values)
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "draft"
  }
});
```

### Validation Options

```typescript
const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false  // Don't include in queries by default
  },
  role: {
    type: String,
    enum: {
      values: ["admin", "editor"],
      message: "{VALUE} is not a valid role"
    },
    default: "editor"
  }
});
```

---

## 🔧 CRUD Operations

### Create

```typescript
// Method 1: Using create()
const product = await Product.create({
  name: "Electric Drill",
  price: 999,
  category: categoryId
});

// Method 2: Using new + save()
const product = new Product({
  name: "Electric Drill",
  price: 999
});
await product.save();

// Method 3: Create multiple
const products = await Product.insertMany([
  { name: "Drill", price: 999 },
  { name: "Hammer", price: 299 }
]);
```

### Read

```typescript
// Find all
const products = await Product.find();

// Find with filter
const activeProducts = await Product.find({ isActive: true });

// Find one by ID
const product = await Product.findById(id);

// Find one by condition
const product = await Product.findOne({ slug: "electric-drill" });

// Lean queries (faster, plain objects)
const products = await Product.find().lean();
```

### Update

```typescript
// Find and update (returns updated document)
const product = await Product.findByIdAndUpdate(
  id,
  { price: 899 },
  { new: true }  // Return updated document, not original
);

// Find by condition and update
const product = await Product.findOneAndUpdate(
  { slug: "electric-drill" },
  { $set: { price: 899 } },
  { new: true }
);

// Update multiple
await Product.updateMany(
  { category: categoryId },
  { $set: { isActive: false } }
);

// Save method (when you have the document)
const product = await Product.findById(id);
product.price = 899;
await product.save();
```

### Delete

```typescript
// Find and delete
const product = await Product.findByIdAndDelete(id);

// Delete by condition
const result = await Product.deleteOne({ slug: "old-product" });

// Delete multiple
const result = await Product.deleteMany({ isActive: false });
// result = { deletedCount: 5 }
```

---

## 🔍 Queries and Filters

### Comparison Operators

```typescript
// Equal
await Product.find({ price: 999 });

// Not equal
await Product.find({ price: { $ne: 999 } });

// Greater than / Less than
await Product.find({ price: { $gt: 500 } });   // > 500
await Product.find({ price: { $gte: 500 } });  // >= 500
await Product.find({ price: { $lt: 1000 } });  // < 1000
await Product.find({ price: { $lte: 1000 } }); // <= 1000

// In array
await Product.find({ category: { $in: [cat1Id, cat2Id] } });

// Not in array
await Product.find({ category: { $nin: [cat1Id, cat2Id] } });

// Range
await Product.find({
  price: { $gte: 100, $lte: 500 }
});
```

### Logical Operators

```typescript
// AND (implicit)
await Product.find({
  isActive: true,
  isFeatured: true
});

// AND (explicit)
await Product.find({
  $and: [
    { price: { $gt: 100 } },
    { price: { $lt: 1000 } }
  ]
});

// OR
await Product.find({
  $or: [
    { isFeatured: true },
    { isTopSelling: true }
  ]
});

// NOT
await Product.find({
  price: { $not: { $gt: 1000 } }
});
```

### Text Search

```typescript
// Create text index first
ProductSchema.index({ name: "text", description: "text" });

// Search
await Product.find({
  $text: { $search: "drill power" }
});
```

### Regex Search

```typescript
// Case-insensitive search
await Product.find({
  name: { $regex: "drill", $options: "i" }
});

// Or with $or for multiple fields
await Product.find({
  $or: [
    { name: { $regex: search, $options: "i" } },
    { description: { $regex: search, $options: "i" } }
  ]
});
```

### Query Modifiers

```typescript
// Sorting
await Product.find()
  .sort({ createdAt: -1 })  // Descending
  .sort("name");             // Ascending

// Pagination
const page = 1;
const limit = 10;
await Product.find()
  .skip((page - 1) * limit)
  .limit(limit);

// Select specific fields
await Product.find()
  .select("name price slug");  // Only these fields

await Product.find()
  .select("-description");     // Exclude description

// Count documents
const count = await Product.countDocuments({ isActive: true });
```

---

## 🔗 Population (Joins)

### Setting Up References

```typescript
// Product references Category
const ProductSchema = new Schema({
  name: String,
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",  // Reference to Category model
    required: true
  }
});
```

### Populating References

```typescript
// Basic population
const product = await Product.findById(id)
  .populate("category");

// Select specific fields
const product = await Product.findById(id)
  .populate("category", "name slug");

// Multiple populations
const product = await Product.findById(id)
  .populate("category", "name slug")
  .populate("brand", "name logo");

// Nested population
const product = await Product.findById(id)
  .populate({
    path: "category",
    select: "name slug parent",
    populate: {
      path: "parent",
      select: "name"
    }
  });
```

### Result

```javascript
// Before population
{
  name: "Electric Drill",
  category: ObjectId("507f1f77bcf86cd799439022")
}

// After population
{
  name: "Electric Drill",
  category: {
    _id: ObjectId("507f1f77bcf86cd799439022"),
    name: "Power Tools",
    slug: "power-tools"
  }
}
```

---

## ⚙️ Middleware (Hooks)

### Pre Middleware

Runs before an operation:

```typescript
// Generate slug before saving
ProductSchema.pre("save", function(next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Hash password before saving
UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Delete related data before deleting
CategorySchema.pre("deleteOne", async function(next) {
  const categoryId = this.getQuery()["_id"];
  await Product.deleteMany({ category: categoryId });
  next();
});
```

### Post Middleware

Runs after an operation:

```typescript
// Log after save
ProductSchema.post("save", function(doc) {
  console.log(`Product ${doc.name} was saved`);
});

// Handle errors
ProductSchema.post("save", function(error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error("Duplicate key error"));
  } else {
    next(error);
  }
});
```

### Instance Methods

```typescript
// Add custom method to documents
UserSchema.methods.comparePassword = async function(
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Usage
const user = await User.findById(id).select("+password");
const isMatch = await user.comparePassword("test123");
```

### Static Methods

```typescript
// Add to model itself
ProductSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

// Usage
const activeProducts = await Product.findActive();
```

---

## 📈 Indexes and Performance

### Creating Indexes

```typescript
const ProductSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },  // Unique index
  category: { 
    type: Schema.Types.ObjectId, 
    index: true  // Single field index
  },
  isActive: { type: Boolean, index: true },
  isFeatured: Boolean
});

// Compound indexes
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ isFeatured: 1, isActive: 1 });

// Text index for search
ProductSchema.index({ name: "text", description: "text" });
```

### Index Benefits

```
Without Index:                  With Index:
────────────────────           ────────────────────
Collection Scan                 Index Scan
Check every document            Jump to matching docs
O(n) - slow                     O(log n) - fast

Find in 1M docs:                Find in 1M docs:
~1000ms                         ~1ms
```

### When to Index

| Index | Not Index |
|-------|-----------|
| Fields used in queries | Rarely queried fields |
| Sort fields | Write-heavy collections |
| Foreign key references | Small collections |
| Unique constraints | Fields with few unique values |

---

## 📦 Project Models Explained

### Product Model

```typescript
// src/lib/db/models/Product.ts
export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;                    // URL-friendly name
  shortDescription: string;        // Brief description
  description: string;             // Full HTML description
  category: mongoose.Types.ObjectId;  // Reference to Category
  brand?: mongoose.Types.ObjectId;    // Reference to Brand
  images: {
    url: string;
    publicId: string;              // Cloudinary ID
    alt: string;
  }[];
  specifications: {
    key: string;                   // e.g., "Power"
    value: string;                 // e.g., "750W"
  }[];
  price: number;
  discountPrice?: number;
  stock: number;
  features: string[];              // Feature list
  tags: string[];                  // Search tags
  isFeatured: boolean;             // Show on homepage
  isTopSelling: boolean;           // Top selling badge
  isActive: boolean;               // Published status
  orderIndex: number;              // Sort order
  meta: {
    title?: string;                // SEO title
    description?: string;          // SEO description
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Category Model

```typescript
// src/lib/db/models/Category.ts
export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  image?: {
    url: string;
    publicId: string;
    alt: string;
  };
  icon?: string;                   // Lucide icon name
  parent?: mongoose.Types.ObjectId; // Parent category for hierarchy
  isFeatured: boolean;
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

### User Model with Password Hashing

```typescript
// src/lib/db/models/User.ts
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "admin" | "editor";
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  // ... fields
  password: {
    type: String,
    required: true,
    select: false  // Not included in queries
  }
});

// Auto-hash password
UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password comparison method
UserSchema.methods.comparePassword = async function(
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};
```

---

## 💡 Best Practices

### 1. Always Connect First

```typescript
export async function GET() {
  await connectDB();  // Always await connection
  // ... queries
}
```

### 2. Use Lean for Read-Only

```typescript
// Full Mongoose documents (slower, more features)
const products = await Product.find();

// Plain JavaScript objects (faster, less memory)
const products = await Product.find().lean();
```

### 3. Select Only Needed Fields

```typescript
// Instead of getting everything
const products = await Product.find();

// Get only what you need
const products = await Product.find()
  .select("name price slug images");
```

### 4. Handle Errors

```typescript
try {
  const product = await Product.findById(id);
  if (!product) {
    throw new NotFoundError("Product not found");
  }
  return product;
} catch (error) {
  if (error.name === "CastError") {
    throw new ValidationError("Invalid product ID");
  }
  throw error;
}
```

---

## 📚 Next Steps

Now that you understand databases:

→ **Next**: [10 - Authentication & Security](./10-AUTHENTICATION-SECURITY.md) - Secure your application

---

*Happy Querying! 🔍*
