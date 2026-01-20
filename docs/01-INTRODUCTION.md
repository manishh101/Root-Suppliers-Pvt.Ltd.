# 📚 01 - Introduction to Root Suppliers Project

> **Understanding the Project Before Diving Into Code**

---

## 📖 Table of Contents

1. [What is This Project?](#what-is-this-project)
2. [Who Built This and Why?](#who-built-this-and-why)
3. [What Will You Learn?](#what-will-you-learn)
4. [Project Features Overview](#project-features-overview)
5. [How Websites Work (Quick Refresher)](#how-websites-work)
6. [Getting Started](#getting-started)
7. [Understanding the Development Environment](#understanding-the-development-environment)

---

## 🎯 What is This Project?

**Root Suppliers** is a **production-ready e-commerce/product catalog website** built for a hardware company in Nepal. It's not a tutorial project - it's a real website used by a real business!

### Business Context

| Field | Details |
|-------|---------|
| **Client** | Root Suppliers Pvt. Ltd. |
| **Location** | Biratnagar, Nepal |
| **Business Type** | Hardware & Construction Supplies |
| **Domain** | www.rootsuppliers.com.np |
| **Purpose** | Online Product Catalog & Lead Generation |

### Why Study This Project?

Unlike tutorial projects that only cover basics, this codebase shows you:

- ✅ **Real business requirements** - Actual features a client needs
- ✅ **Production patterns** - Code that runs in real environments
- ✅ **Security practices** - Protecting user data and preventing attacks
- ✅ **Scalable architecture** - Code organized for growth
- ✅ **Error handling** - Dealing with things that go wrong
- ✅ **Admin systems** - Managing content without touching code

---

## 👨‍💻 Who Built This and Why?

This website was built as a **custom solution** because:

1. **Template websites** didn't fit the client's needs
2. Client wanted **full control** over design and features
3. Need for a **custom admin panel** to manage products
4. **SEO optimization** was critical for online visibility
5. **Performance** needed to be excellent on slow networks

### The Development Journey

```
Week 1: Planning & Design
   ↓
Week 2-3: Frontend Development (Public Pages)
   ↓
Week 4-5: Backend Development (APIs & Database)
   ↓
Week 6: Admin Panel Development
   ↓
Week 7: Testing & Security
   ↓
Week 8: Deployment & Launch
```

---

## 🎓 What Will You Learn?

By studying this codebase, you'll gain practical skills in:

### Frontend Development

| Skill | Description |
|-------|-------------|
| **React.js** | Building user interfaces with components |
| **Next.js 14** | Full-stack React framework |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS** | Modern utility-first styling |
| **Framer Motion** | Smooth animations |
| **React Hook Form** | Form handling |

### Backend Development

| Skill | Description |
|-------|-------------|
| **REST API Design** | Creating and consuming APIs |
| **MongoDB** | NoSQL database operations |
| **Mongoose** | Object modeling for MongoDB |
| **JWT Authentication** | Secure user sessions |
| **Middleware** | Request/response processing |
| **File Uploads** | Image management with Cloudinary |

### Professional Skills

| Skill | Description |
|-------|-------------|
| **Code Organization** | Clean, maintainable code |
| **Error Handling** | Graceful failure management |
| **Security** | Protecting against vulnerabilities |
| **Performance** | Optimizing load times |
| **Version Control** | Git workflow |
| **Environment Management** | Configuration handling |

---

## 🌟 Project Features Overview

### Public Website (What Visitors See)

| Feature | Description |
|---------|-------------|
| **Homepage** | Hero carousel, featured products, categories, testimonials |
| **Products** | Browse, search, filter, view details |
| **Categories** | Organized product groupings with hierarchies |
| **Blog** | Company news and articles |
| **About** | Company information |
| **Contact** | Inquiry form for potential customers |

### Admin Panel (What Administrators See)

| Feature | Description |
|---------|-------------|
| **Dashboard** | Overview statistics |
| **Products CRUD** | Create, Read, Update, Delete products |
| **Categories CRUD** | Manage product categories |
| **Blogs CRUD** | Write and publish articles |
| **Inquiries** | View customer contact submissions |
| **Settings** | Site configuration |
| **Users** | Manage admin accounts |

### Technical Features (Under the Hood)

| Feature | Purpose |
|---------|---------|
| **Server-Side Rendering** | Fast initial page loads, SEO friendly |
| **JWT Authentication** | Secure admin access |
| **Image CDN** | Fast image delivery via Cloudinary |
| **Rate Limiting** | Prevent abuse and attacks |
| **Input Validation** | Prevent bad data entry |
| **Responsive Design** | Works on all devices |

---

## 🌐 How Websites Work

Before diving into code, let's refresh how websites work:

### The Client-Server Model

**How websites work:**

```
YOU (Browser)  ─────── 1. Request (URL) ──────────▶  SERVER
                                                        ↓
                                                   Database Query
                                                        ↓
YOU (Browser)  ◀────── 2. Response (HTML/JSON) ──────  SERVER
```

| Component | Role |
|-----------|------|
| **Browser** | Sends requests, displays content |
| **Next.js Server** | Processes requests, generates responses |
| **MongoDB** | Stores and retrieves data |

### Request-Response Cycle

1. **User Action**: You click a link or type a URL
2. **Request Sent**: Browser sends HTTP request to server
3. **Server Processing**: Server reads the request, queries database
4. **Response Generated**: Server creates HTML/JSON response
5. **Response Received**: Browser receives and displays content

### Types of Content

| Static Content | Dynamic Content |
|----------------|-----------------|
| Images | Product listings |
| CSS files | User-specific data |
| JavaScript files | Search results |
| Fonts | Form submissions |

---

## 🚀 Getting Started

### Prerequisites

Before you begin, make sure you have:

- ✅ **Node.js** (v18 or higher) - [Download](https://nodejs.org)
- ✅ **pnpm** (Package manager) - `npm install -g pnpm`
- ✅ **Git** - [Download](https://git-scm.com)
- ✅ **VS Code** (recommended) - [Download](https://code.visualstudio.com)
- ✅ **MongoDB Atlas account** (free) - [Sign up](https://www.mongodb.com/atlas)
- ✅ **Cloudinary account** (free) - [Sign up](https://cloudinary.com)

### Step-by-Step Setup

```bash
# 1. Navigate to the project folder
cd root-suppliers

# 2. Install dependencies
pnpm install
# This reads package.json and installs all required packages

# 3. Create environment file
cp .env.example .env.local
# This creates a local configuration file

# 4. Edit .env.local with your credentials
# Open in VS Code and add:
# - MONGODB_URI (from MongoDB Atlas)
# - NEXTAUTH_SECRET (any random 32+ character string)
# - CLOUDINARY_CLOUD_NAME (from Cloudinary)
# - CLOUDINARY_API_KEY (from Cloudinary)
# - CLOUDINARY_API_SECRET (from Cloudinary)

# 5. Start development server
pnpm dev

# 6. Open browser
# Go to http://localhost:3000
```

### What Each Command Does

| Command | What It Does |
|---------|--------------|
| `pnpm install` | Downloads all project dependencies |
| `pnpm dev` | Starts development server with hot reload |
| `pnpm build` | Creates optimized production build |
| `pnpm start` | Runs production server |
| `pnpm lint` | Checks code for errors |

---

## 🛠️ Understanding the Development Environment

### VS Code Extensions (Recommended)

Install these for the best experience:

```
Essential:
├── ESLint - Code error detection
├── Prettier - Code formatting
├── Tailwind CSS IntelliSense - CSS autocompletion
├── TypeScript Vue Plugin (Volar) - Better TS support
└── Auto Rename Tag - HTML/JSX tag renaming

Helpful:
├── Error Lens - Inline error display
├── GitLens - Git integration
├── Thunder Client - API testing
└── MongoDB for VS Code - Database viewer
```

### Project Files You'll See

```
root-suppliers/
├── package.json          # Project config & dependencies
├── pnpm-lock.yaml        # Locked dependency versions
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── next.config.mjs       # Next.js configuration
├── .env.local            # Your secret credentials (NOT in git)
├── .gitignore            # Files to exclude from git
└── README.md             # Project documentation
```

### Understanding package.json

```json
{
  "name": "root-suppliers-v2",    // Project name
  "version": "0.1.0",              // Version number
  "scripts": {                      // Commands you can run
    "dev": "next dev",             // Development mode
    "build": "next build",         // Production build
    "start": "next start"          // Run production
  },
  "dependencies": {                 // Packages needed to run
    "next": "^14.2.35",            // The framework
    "react": "^18.3.1",            // UI library
    "mongoose": "^8.9.0"           // Database ORM
  },
  "devDependencies": {              // Packages for development only
    "typescript": "^5.7.0",        // Type checking
    "eslint": "^8.57.0"            // Code linting
  }
}
```

---

## ✅ Checklist Before Moving On

Before proceeding to the next chapter, make sure you:

- [ ] Understand what this project is about
- [ ] Have all prerequisites installed
- [ ] Successfully ran `pnpm install`
- [ ] Created `.env.local` file
- [ ] Can run `pnpm dev` without errors
- [ ] Can open http://localhost:3000 in browser

---

## 📚 Next Steps

Now that you understand the project:

→ **Next**: [02 - Technology Stack](./02-TECHNOLOGY-STACK.md) - Learn about all the technologies used

---

*Happy Learning! 🎉*
