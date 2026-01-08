# 🏗️ Root Suppliers - Custom Next.js Website

A fully custom, modern hardware shop website built with Next.js 14, MongoDB Atlas, Cloudinary, and a custom admin panel.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🌟 Features

### Public Website
- ✨ **Beautiful UI** - Modern, aesthetic design with smooth animations
- 📱 **Fully Responsive** - Mobile-first approach, works on all devices
- 🚀 **Fast Loading** - Optimized images with Cloudinary CDN
- 🔍 **SEO Optimized** - Proper meta tags, Open Graph, structured data
- 🎨 **Framer Motion** - Smooth scroll animations and transitions
- 🛍️ **Product Catalogue** - Dynamic product listings with filters
- 📝 **Blog System** - Rich blog posts with WYSIWYG editor
- 💬 **Inquiry Forms** - Contact and product inquiry functionality
- 🗺️ **Google Maps** - Location integration
- ⭐ **Testimonials** - Customer reviews carousel
- 🏢 **Company Info** - About us, gallery, contact pages

### Admin Panel
- 🔐 **Secure Authentication** - JWT-based admin login
- 📊 **Dashboard** - Overview stats and recent inquiries
- 🛠️ **Complete CRUD** - Manage all content types
- 🖼️ **Image Uploader** - Drag & drop with Cloudinary
- ✏️ **Rich Text Editor** - Tiptap WYSIWYG editor for blogs
- 📋 **Data Tables** - Sortable, filterable, paginated
- 🎯 **Inquiry Management** - Lead tracking with status updates
- ⚙️ **Settings Panel** - Configure site settings
- 👥 **User Management** - Admin and editor roles

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **Lucide React** - Icon library
- **Embla Carousel** - Touch-friendly carousels

### Backend
- **Next.js API Routes** - RESTful API
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **bcryptjs** - Password hashing
- **jose** - JWT authentication

### Media
- **Cloudinary** - Image storage & CDN
- **next-cloudinary** - React components

---

## 📦 Installation

### Prerequisites
- Node.js 18+ and pnpm installed
- MongoDB Atlas account
- Cloudinary account

### 1. Clone the repository
```bash
cd root-suppliers-v2
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Set up environment variables
Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

**Required Environment Variables:**
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `NEXTAUTH_SECRET` - Random 32+ character secret key
- `CLOUDINARY_CLOUD_NAME` - From Cloudinary dashboard
- `CLOUDINARY_API_KEY` - From Cloudinary dashboard
- `CLOUDINARY_API_SECRET` - From Cloudinary dashboard

### 4. Run development server
```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 5. (Optional) Seed initial data
```bash
pnpm seed
```

---

## 📁 Project Structure

```
src/
├── app/                      # Next.js app directory
│   ├── (public)/            # Public-facing pages
│   │   ├── about/
│   │   ├── products/
│   │   ├── blogs/
│   │   └── contact/
│   ├── (admin)/admin/       # Admin panel pages
│   │   ├── products/
│   │   ├── categories/
│   │   ├── blogs/
│   │   └── settings/
│   ├── api/                 # API routes
│   │   ├── products/
│   │   ├── auth/
│   │   └── upload/
│   ├── layout.tsx
│   └── page.tsx
│
├── components/              # React components
│   ├── admin/              # Admin-specific components
│   ├── layout/             # Header, Footer, etc.
│   ├── ui/                 # Reusable UI components
│   ├── sections/           # Page sections
│   ├── cards/              # Card components
│   └── forms/              # Form components
│
├── lib/                    # Utilities & libraries
│   ├── db/                # Database
│   │   ├── connect.ts     # MongoDB connection
│   │   └── models/        # Mongoose models
│   ├── actions/           # Server actions
│   ├── utils.ts           # Helper functions
│   ├── constants.ts       # App constants
│   └── animations.ts      # Framer Motion variants
│
├── hooks/                  # Custom React hooks
├── context/                # React context providers
└── types/                  # TypeScript types
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push code to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Add environment variables
- Deploy!

3. **Set up custom domain**
- Add `www.rootsuppliers.com.np` in Vercel domains
- Configure DNS settings

### MongoDB Atlas Setup
1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free M0 cluster
3. Whitelist IP: `0.0.0.0/0`
4. Create database user
5. Get connection string

### Cloudinary Setup
1. Create account at [cloudinary.com](https://cloudinary.com)
2. Get credentials from dashboard
3. Create upload preset (unsigned)

---

## 📝 Scripts

```bash
# Development
pnpm dev          # Start dev server

# Build
pnpm build        # Build for production
pnpm start        # Start production server

# Code Quality
pnpm lint         # Run ESLint
pnpm format       # Format with Prettier

# Database
pnpm seed         # Seed initial data
```

---

## 🎨 Design System

### Colors
- **Primary**: Cardinal Red (#C41E3A)
- **Secondary**: Navy Blue (#1E3A8A)
- **Success**: Green (#22c55e)
- **Warning**: Amber (#f59e0b)
- **Error**: Red (#ef4444)

### Typography
- **Primary Font**: Bank Gothic (headings)
- **Secondary Font**: Inter (body text)

### Components
All components use Tailwind CSS utility classes and follow consistent design patterns. See `src/app/globals.css` for utility classes.

---

## 🔒 Authentication

Admin authentication uses JWT tokens stored in HTTP-only cookies.

**Default Admin:**
- Email: `admin@rootsuppliers.com.np`
- Password: Set during seed or manual creation

---

## 📚 API Documentation

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/[id]` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/[id]` - Update product (Admin)
- `DELETE /api/products/[id]` - Delete product (Admin)

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/[id]` - Update category (Admin)
- `DELETE /api/categories/[id]` - Delete category (Admin)

### Inquiries
- `GET /api/inquiries` - List inquiries (Admin)
- `POST /api/inquiries` - Submit inquiry (Public)
- `PUT /api/inquiries/[id]` - Update status (Admin)

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/session` - Get current session

---

## 🧪 Testing

```bash
# Run tests (when configured)
pnpm test

# E2E tests (when configured)
pnpm test:e2e
```

---

## 📈 Performance

- ⚡ Lighthouse Score: 90+
- 🎯 Core Web Vitals optimized
- 🖼️ Images optimized with Cloudinary
- 📦 Code splitting with Next.js
- 💾 Server-side caching

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 💬 Support

For issues and questions:
- 📧 Email: dev@rootsuppliers.com.np
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 📖 Docs: See `PROJECT_DOCUMENTATION.md`

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting platform
- MongoDB Atlas for database
- Cloudinary for image CDN
- All open-source contributors

---

**Built with ❤️ for Root Suppliers Pvt. Ltd.**

*Last Updated: January 6, 2026*
