# 🚀 Root Suppliers - API Documentation

## Overview

REST API built with Next.js 14 App Router, MongoDB, and JWT authentication.

**Base URL (Local):** `http://localhost:3000/api`  
**Base URL (Production):** `https://your-domain.com/api`

---

## 🔐 Authentication

All admin endpoints require JWT authentication via HTTP-only cookies.

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@rootsuppliers.com",
  "password": "your-password"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "...",
    "name": "Admin User",
    "email": "admin@rootsuppliers.com",
    "role": "admin"
  },
  "message": "Login successful"
}
```

### Logout
```http
POST /api/auth/logout
```

### Get Current Session
```http
GET /api/auth/session
```

---

## 📦 Products API

### List Products (Public)
```http
GET /api/products?page=1&limit=12&category=electronics&search=laptop&isActive=true&sort=-createdAt
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 12)
- `category` (string): Filter by category slug
- `search` (string): Search in name and description
- `isActive` (boolean): Filter by active status
- `sort` (string): Sort field (prefix with `-` for descending)

**Response:**
```json
{
  "success": true,
  "products": [...],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Get Single Product (Public)
```http
GET /api/products/electric-drill-pro
```

### Create Product (Admin Only)
```http
POST /api/products
Content-Type: application/json
Cookie: auth-token=...

{
  "name": "Electric Drill Pro",
  "description": "Professional grade electric drill...",
  "shortDescription": "Powerful 18V cordless drill",
  "category": "power-tools",
  "images": [
    "https://res.cloudinary.com/.../drill.jpg"
  ],
  "specifications": {
    "power": "18V",
    "battery": "2.0Ah Li-ion",
    "weight": "1.5kg"
  },
  "isActive": true
}
```

### Update Product (Admin Only)
```http
PUT /api/products/electric-drill-pro
Content-Type: application/json
Cookie: auth-token=...

{
  "name": "Updated Name",
  "isActive": false
}
```

### Delete Product (Admin Only)
```http
DELETE /api/products/electric-drill-pro
Cookie: auth-token=...
```

---

## 🗂️ Categories API

### List Categories (Public)
```http
GET /api/categories?includeProductCount=true&isActive=true
```

**Query Parameters:**
- `includeProductCount` (boolean): Include product counts
- `isActive` (boolean): Filter by active status

### Get Single Category (Public)
```http
GET /api/categories/power-tools
```

### Create Category (Admin Only)
```http
POST /api/categories
Content-Type: application/json
Cookie: auth-token=...

{
  "name": "Power Tools",
  "description": "Professional power tools...",
  "image": "https://res.cloudinary.com/.../category.jpg",
  "order": 1,
  "isActive": true
}
```

### Update Category (Admin Only)
```http
PUT /api/categories/power-tools
Content-Type: application/json
Cookie: auth-token=...

{
  "order": 2
}
```

### Delete Category (Admin Only)
```http
DELETE /api/categories/power-tools
Cookie: auth-token=...
```

**Note:** Cannot delete categories with existing products.

---

## 📝 Blogs API

### List Blog Posts (Public - Published Only)
```http
GET /api/blogs?page=1&limit=10&search=safety&tags=tips,guide&sort=-publishedAt
```

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page (default: 10)
- `search` (string): Search in title and excerpt
- `tags` (string): Comma-separated tags
- `isPublished` (boolean): Admin only - filter by published status
- `sort` (string): Sort field (default: `-publishedAt`)

### Get Single Blog Post (Public - Published Only)
```http
GET /api/blogs/safety-tips-power-tools
```

### Create Blog Post (Admin/Editor)
```http
POST /api/blogs
Content-Type: application/json
Cookie: auth-token=...

{
  "title": "Safety Tips for Power Tools",
  "content": "<p>Full HTML content...</p>",
  "excerpt": "Learn essential safety tips...",
  "featuredImage": "https://res.cloudinary.com/.../blog.jpg",
  "author": "John Doe",
  "tags": ["safety", "tips", "power-tools"],
  "isPublished": true
}
```

### Update Blog Post (Admin/Editor)
```http
PUT /api/blogs/safety-tips-power-tools
Content-Type: application/json
Cookie: auth-token=...

{
  "isPublished": true
}
```

### Delete Blog Post (Admin Only)
```http
DELETE /api/blogs/safety-tips-power-tools
Cookie: auth-token=...
```

---

## 💬 Inquiries API

### List Inquiries (Admin/Editor Only)
```http
GET /api/inquiries?page=1&limit=20&source=product_inquiry&status=new&sort=-createdAt
```

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page (default: 20)
- `source` (string): `contact_form` | `product_inquiry` | `whatsapp`
- `status` (string): `new` | `contacted` | `converted` | `closed`
- `sort` (string): Sort field (default: `-createdAt`)

### Get Single Inquiry (Admin/Editor Only)
```http
GET /api/inquiries/65f1a2b3c4d5e6f7g8h9i0j1
Cookie: auth-token=...
```

### Submit Inquiry (Public)
```http
POST /api/inquiries
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+91 9876543210",
  "message": "I'm interested in the Electric Drill Pro...",
  "product": "65f1a2b3c4d5e6f7g8h9i0j1",
  "source": "product_inquiry"
}
```

**Response:**
```json
{
  "success": true,
  "inquiry": {
    "id": "...",
    "source": "product_inquiry",
    "createdAt": "2026-01-06T..."
  },
  "message": "Your inquiry has been submitted successfully. We'll get back to you soon!"
}
```

### Update Inquiry Status (Admin/Editor Only)
```http
PUT /api/inquiries/65f1a2b3c4d5e6f7g8h9i0j1
Content-Type: application/json
Cookie: auth-token=...

{
  "status": "contacted",
  "notes": "Called customer, will follow up on Monday"
}
```

### Delete Inquiry (Admin Only)
```http
DELETE /api/inquiries/65f1a2b3c4d5e6f7g8h9i0j1
Cookie: auth-token=...
```

---

## 📊 Status Codes

- `200` OK - Request successful
- `201` Created - Resource created successfully
- `400` Bad Request - Invalid input
- `401` Unauthorized - Authentication required
- `403` Forbidden - Insufficient permissions
- `404` Not Found - Resource not found
- `409` Conflict - Duplicate resource (e.g., slug already exists)
- `500` Internal Server Error - Server error

---

## 🔒 Security

1. **JWT Authentication**: HTTP-only cookies with 7-day expiration
2. **Password Hashing**: bcrypt with salt rounds
3. **Role-Based Access**: Admin and Editor roles
4. **Input Validation**: Mongoose schema validation
5. **SQL Injection Prevention**: Mongoose ODM sanitization
6. **CORS**: Configured for production domain

---

## 🚀 Rate Limiting

*To be implemented in production*

Recommended limits:
- Public endpoints: 100 requests/15 minutes per IP
- Auth endpoints: 5 requests/15 minutes per IP
- Admin endpoints: 1000 requests/15 minutes per token

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- Slugs are auto-generated from titles/names
- Image URLs should be Cloudinary CDN links
- Product counts in categories are cached for performance
- Inquiries trigger email notifications (to be implemented)

---

**Last Updated:** January 6, 2026  
**API Version:** 1.0.0
