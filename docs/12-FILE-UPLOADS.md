# 📚 12 - File Uploads

> **Handling Image Uploads with Cloudinary**

---

## 📖 Table of Contents

1. [Why Cloudinary?](#why-cloudinary)
2. [Cloudinary Setup](#cloudinary-setup)
3. [Upload API Route](#upload-api-route)
4. [Frontend Upload Component](#frontend-upload-component)
5. [Image Optimization](#image-optimization)
6. [Delete Images](#delete-images)
7. [Best Practices](#best-practices)

---

## ☁️ Why Cloudinary?

### The Problem with Self-Hosted Images

| ❌ Problem | Description |
|-----------|-------------|
| Storage fills up | Server disk space is limited |
| No optimization | Images are served as-is |
| Manual resizing | Need to create multiple sizes |
| Complex CDN setup | Global delivery requires setup |
| Backup management | Risk of data loss |
| Expensive scaling | More storage = more cost |

### Cloudinary Benefits

| ✅ Feature | Description |
|---------|-------------|
| **CDN** | Global delivery network for fast loading |
| **Optimization** | Automatic compression and format selection |
| **Transformation** | Resize, crop, watermark on-the-fly |
| **Storage** | Unlimited (on paid plans) |
| **Free Tier** | 25GB storage, 25GB bandwidth/month |

---

## ⚙️ Cloudinary Setup

### 1. Create Account

Go to [cloudinary.com](https://cloudinary.com) and create a free account.

### 2. Get Credentials

Find in your Cloudinary Dashboard:
- Cloud Name
- API Key
- API Secret

### 3. Environment Variables

```bash
# .env.local
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### 4. Install Cloudinary SDK

```bash
pnpm add cloudinary
```

---

## 📤 Upload API Route

### Complete Upload Handler

```typescript
// src/app/api/upload/route.ts
import { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { handleApiError, successResponse, ValidationError } from "@/lib/errors";
import { withValidate } from "@/lib/api-middleware";
import { z } from "zod";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * POST /api/upload
 * Upload an image to Cloudinary
 * Requires authentication
 */
export const POST = withValidate(
  async (req: NextRequest) => {
    // Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "root-suppliers";

    // Validate file exists
    if (!file) {
      throw new ValidationError("No file provided");
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new ValidationError(
        "Invalid file type. Allowed: JPEG, PNG, GIF, WebP, SVG"
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new ValidationError("File size exceeds 10MB limit");
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary using stream
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: "image",
          transformation: [
            { quality: "auto" },     // Auto quality
            { fetch_format: "auto" } // Auto format (webp, etc.)
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(buffer);
    });

    // Return upload result
    return successResponse({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    }, 200, "Image uploaded successfully");
  },
  { requireAuth: true }
);
```

### Understanding the Upload Process

**Upload Flow:**

| Step | Location | Action |
|------|----------|--------|
| 1️⃣ | **Frontend** | User selects file |
| 2️⃣ | **Frontend** | Create FormData with file |
| 3️⃣ | **Frontend** | POST to `/api/upload` |
| 4️⃣ | **API Route** | Parse FormData |
| 5️⃣ | **API Route** | Validate file type & size |
| 6️⃣ | **API Route** | Convert to Buffer |
| 7️⃣ | **API Route** | Stream to Cloudinary |
| 8️⃣ | **Cloudinary** | Store image on CDN |
| 9️⃣ | **Cloudinary** | Generate optimized URL |
| 🔟 | **Response** | Return `{ url, publicId, width, height }` |

```
User selects file
       ↓
[Frontend] ──POST FormData──→ [API Route] ──Stream──→ [Cloudinary]
                                                           ↓
[Frontend] ←──JSON Response──← [API Route] ←──Metadata───←─┘
```

---

## 🖼️ Frontend Upload Component

### Basic Image Upload

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";

interface UploadedImage {
  url: string;
  publicId: string;
}

interface ImageUploadProps {
  value?: UploadedImage | null;
  onChange: (image: UploadedImage | null) => void;
  folder?: string;
}

export function ImageUpload({ 
  value, 
  onChange, 
  folder = "root-suppliers" 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      // Upload to API
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,  // No Content-Type header for FormData!
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Upload failed");
      }

      // Update parent component
      onChange({
        url: result.url,
        publicId: result.publicId,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!value?.publicId) return;

    try {
      // Delete from Cloudinary
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: value.publicId }),
      });

      onChange(null);
    } catch (err) {
      console.error("Failed to delete image:", err);
    }
  };

  return (
    <div className="space-y-2">
      {value?.url ? (
        // Show uploaded image
        <div className="relative inline-block">
          <Image
            src={value.url}
            alt="Uploaded"
            width={200}
            height={200}
            className="rounded-lg object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white 
                       rounded-full p-1 hover:bg-red-600"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        // Show upload button
        <label className="cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 rounded-lg 
                          p-8 text-center hover:border-primary-500 
                          transition-colors">
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                <span className="text-sm text-gray-500">Uploading...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-500">
                  Click to upload image
                </span>
                <span className="text-xs text-gray-400">
                  JPEG, PNG, WebP (max 10MB)
                </span>
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            disabled={isUploading}
          />
        </label>
      )}
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
```

### Multiple Image Upload

```tsx
interface MultiImageUploadProps {
  value: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxImages?: number;
  folder?: string;
}

export function MultiImageUpload({
  value = [],
  onChange,
  maxImages = 5,
  folder = "root-suppliers/products",
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check max limit
    if (value.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    setIsUploading(true);

    try {
      // Upload all files
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.message);
        }

        return {
          url: result.url,
          publicId: result.publicId,
        };
      });

      const newImages = await Promise.all(uploadPromises);
      onChange([...value, ...newImages]);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    const newImages = [...value];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Image Grid */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
        {value.map((image, index) => (
          <div key={image.publicId} className="relative aspect-square">
            <Image
              src={image.url}
              alt={`Image ${index + 1}`}
              fill
              className="rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white 
                         rounded-full p-1 hover:bg-red-600"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        
        {/* Upload Button (if under max) */}
        {value.length < maxImages && (
          <label className="cursor-pointer aspect-square">
            <div className="h-full border-2 border-dashed border-gray-300 
                            rounded-lg flex items-center justify-center 
                            hover:border-primary-500 transition-colors">
              {isUploading ? (
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              ) : (
                <Upload className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        )}
      </div>
      
      <p className="text-sm text-gray-500">
        {value.length}/{maxImages} images
      </p>
    </div>
  );
}
```

---

## 🎨 Image Optimization

### Cloudinary Transformations

```typescript
// During upload - apply automatic optimization
const uploadStream = cloudinary.uploader.upload_stream({
  folder: folder,
  resource_type: "image",
  transformation: [
    { quality: "auto" },       // Auto quality based on content
    { fetch_format: "auto" },  // Serve WebP/AVIF when supported
  ],
});

// Or transform on-the-fly using URL
// Original: https://res.cloudinary.com/demo/image/upload/sample.jpg
// Transformed: https://res.cloudinary.com/demo/image/upload/w_300,h_300,c_fill/sample.jpg
```

### URL-Based Transformations

```typescript
function getOptimizedUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: "fill" | "fit" | "scale";
    quality?: number | "auto";
  }
) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const transforms = [];
  
  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop}`);
  if (options.quality) transforms.push(`q_${options.quality}`);
  transforms.push("f_auto"); // Auto format
  
  const transformString = transforms.join(",");
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}/${publicId}`;
}

// Usage
getOptimizedUrl("products/drill-123", { 
  width: 400, 
  height: 400, 
  crop: "fill" 
});
// Result: https://res.cloudinary.com/xxx/image/upload/w_400,h_400,c_fill,f_auto/products/drill-123
```

### Next.js Image with Cloudinary

```tsx
// next.config.mjs
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

// Component usage
<Image
  src={product.image.url}
  alt={product.name}
  width={400}
  height={400}
  className="object-cover"
/>
```

---

## 🗑️ Delete Images

### Delete API Route

```typescript
// src/app/api/upload/route.ts
export const DELETE = withValidate(
  async (req: NextRequest, validatedData: any) => {
    const { publicId } = validatedData;
    
    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      throw new ValidationError("Failed to delete image");
    }

    return successResponse({}, 200, "Image deleted successfully");
  },
  {
    schema: z.object({ 
      publicId: z.string().min(1, "Public ID required") 
    }),
    requireAdmin: true,
  }
);
```

### Delete on Product Deletion

```typescript
// When deleting a product, also delete its images
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = await Product.findById(params.id);
  
  if (!product) {
    throw new NotFoundError("Product not found");
  }
  
  // Delete all product images from Cloudinary
  if (product.images?.length > 0) {
    const deletePromises = product.images.map((image) =>
      cloudinary.uploader.destroy(image.publicId)
    );
    await Promise.all(deletePromises);
  }
  
  // Delete product from database
  await Product.findByIdAndDelete(params.id);
  
  return successResponse({}, 200, "Product deleted");
}
```

---

## 💡 Best Practices

### 1. File Validation

```typescript
// Always validate on server-side
const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const maxSize = 10 * 1024 * 1024; // 10MB

if (!allowedTypes.includes(file.type)) {
  throw new ValidationError("Invalid file type");
}

if (file.size > maxSize) {
  throw new ValidationError("File too large");
}
```

### 2. Organize with Folders

```typescript
// Organize images by type
const folders = {
  products: "root-suppliers/products",
  categories: "root-suppliers/categories",
  blogs: "root-suppliers/blogs",
  heroes: "root-suppliers/heroes",
};

// Use when uploading
formData.append("folder", folders.products);
```

### 3. Store Both URL and Public ID

```typescript
// In your database model
images: [{
  url: String,       // For displaying
  publicId: String,  // For deleting/transforming
  alt: String        // For accessibility
}]
```

### 4. Use Environment Variables

```bash
# Server-side (private)
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

# Client-side (public, if needed)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx
```

### 5. Handle Upload Errors

```tsx
try {
  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Upload failed");
  }
  
  const result = await response.json();
  // Handle success
} catch (error) {
  // Show user-friendly error
  if (error.message.includes("file type")) {
    setError("Please upload a valid image file");
  } else if (error.message.includes("size")) {
    setError("Image is too large. Maximum 10MB allowed");
  } else {
    setError("Failed to upload image. Please try again");
  }
}
```

---

## 📚 Next Steps

Now that you understand file uploads:

→ **Next**: [13 - State Management](./13-STATE-MANAGEMENT.md) - Manage application state with React Context

---

*Happy Uploading! 📷*
