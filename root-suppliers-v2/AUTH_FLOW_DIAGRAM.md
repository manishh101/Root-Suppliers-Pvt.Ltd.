# 🔐 Admin Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                     ADMIN PANEL AUTHENTICATION                       │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│  Step 1: User Tries to Access Admin Panel                           │
└──────────────────────────────────────────────────────────────────────┘

    User visits: /admin/products
           ↓
    Layout checks authentication
           ↓
    GET /api/auth/session
           ↓
    ┌─────────────────┐
    │ Is Authenticated?│
    └─────────────────┘
           ↓
    ┌─────┴─────┐
    ↓           ↓
   YES          NO
    ↓           ↓
Show Page    Redirect to
             /admin/login


┌──────────────────────────────────────────────────────────────────────┐
│  Step 2: Login Process                                               │
└──────────────────────────────────────────────────────────────────────┘

    User at /admin/login
           ↓
    Enters: email + password
           ↓
    Client-side validation (Zod)
           ↓
    POST /api/auth/login
           ↓
    ┌──────────────────────────────────┐
    │  Server: Find user in MongoDB    │
    └──────────────────────────────────┘
           ↓
    ┌──────────────────────────────────┐
    │  bcrypt.compare(password, hash)  │
    └──────────────────────────────────┘
           ↓
    ┌─────────────────┐
    │ Valid Credentials?│
    └─────────────────┘
           ↓
    ┌─────┴─────┐
    ↓           ↓
   YES          NO
    ↓           ↓
    │      Return 401
    │      "Invalid credentials"
    ↓
    ┌──────────────────────────────────┐
    │  Generate JWT Token              │
    │  { userId, email, role }         │
    │  Expires in 7 days               │
    └──────────────────────────────────┘
           ↓
    ┌──────────────────────────────────┐
    │  Set HTTP-Only Cookie            │
    │  Name: auth-token                │
    │  Secure, SameSite                │
    └──────────────────────────────────┘
           ↓
    Return 200 with user data
           ↓
    Client redirects to /admin


┌──────────────────────────────────────────────────────────────────────┐
│  Step 3: Accessing Protected Pages                                   │
└──────────────────────────────────────────────────────────────────────┘

    Every admin page load
           ↓
    Layout useEffect runs
           ↓
    GET /api/auth/session
           ↓
    ┌──────────────────────────────────┐
    │  Server: Read auth-token cookie  │
    └──────────────────────────────────┘
           ↓
    ┌──────────────────────────────────┐
    │  Verify JWT signature            │
    │  Check expiration                │
    └──────────────────────────────────┘
           ↓
    ┌─────────────────┐
    │  Valid Token?    │
    └─────────────────┘
           ↓
    ┌─────┴─────┐
    ↓           ↓
   YES          NO
    ↓           ↓
Return user   Return 401
data          Redirect to
              /admin/login


┌──────────────────────────────────────────────────────────────────────┐
│  Step 4: Role-Based Access Control                                   │
└──────────────────────────────────────────────────────────────────────┘

    User logged in with role: "editor"
           ↓
    Tries to access /admin/users
           ↓
    Layout checks user.role
           ↓
    ┌─────────────────┐
    │  Is Admin?      │
    └─────────────────┘
           ↓
    ┌─────┴─────┐
    ↓           ↓
   YES          NO
    ↓           ↓
Show Page    Hide menu item
             Show 403 or redirect


┌──────────────────────────────────────────────────────────────────────┐
│  Step 5: Logout Process                                              │
└──────────────────────────────────────────────────────────────────────┘

    User clicks Logout button
           ↓
    POST /api/auth/logout
           ↓
    ┌──────────────────────────────────┐
    │  Server: Clear auth-token cookie │
    │  Set Max-Age: 0                  │
    └──────────────────────────────────┘
           ↓
    Return 200 success
           ↓
    Client redirects to /admin/login


┌──────────────────────────────────────────────────────────────────────┐
│  Security Layers                                                      │
└──────────────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────┐
    │  1. HTTP-Only Cookies                   │
    │     → Not accessible via JavaScript     │
    │     → Prevents XSS attacks              │
    └─────────────────────────────────────────┘
                    ↓
    ┌─────────────────────────────────────────┐
    │  2. Password Hashing (bcrypt)           │
    │     → Salt rounds: 12                   │
    │     → Never store plain passwords       │
    └─────────────────────────────────────────┘
                    ↓
    ┌─────────────────────────────────────────┐
    │  3. JWT Token Verification              │
    │     → Signed with secret key            │
    │     → Expires after 7 days              │
    └─────────────────────────────────────────┘
                    ↓
    ┌─────────────────────────────────────────┐
    │  4. Role-Based Access Control           │
    │     → Admin: Full access                │
    │     → Editor: Limited access            │
    └─────────────────────────────────────────┘
                    ↓
    ┌─────────────────────────────────────────┐
    │  5. Server-Side Validation              │
    │     → All auth checks on server         │
    │     → Never trust client data           │
    └─────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────┐
│  Protected Admin Routes (All require authentication)                 │
└──────────────────────────────────────────────────────────────────────┘

    /admin                          → Dashboard
    /admin/products                 → Products Management
    /admin/products/new             → Create Product
    /admin/products/[slug]          → Edit Product
    /admin/categories               → Categories Management
    /admin/categories/new           → Create Category
    /admin/categories/[slug]        → Edit Category
    /admin/blogs                    → Blogs Management
    /admin/blogs/new                → Create Blog
    /admin/blogs/[slug]             → Edit Blog
    /admin/brands                   → Brands Management
    /admin/brands/new               → Create Brand
    /admin/brands/[slug]            → Edit Brand
    /admin/inquiries                → Customer Inquiries
    /admin/testimonials             → Testimonials
    /admin/users          🔒 Admin  → User Management
    /admin/settings       🔒 Admin  → Site Settings
    /admin/media                    → Media Library


┌──────────────────────────────────────────────────────────────────────┐
│  Quick Test Checklist                                                │
└──────────────────────────────────────────────────────────────────────┘

    ✅ Step 1: Whitelist IP in MongoDB Atlas
    ✅ Step 2: Run seed script (npx tsx scripts/seed-admin.ts)
    ✅ Step 3: Start server (pnpm dev)
    ✅ Step 4: Visit http://localhost:3000/admin
    ✅ Step 5: You should be redirected to /admin/login
    ✅ Step 6: Login with admin@rootsuppliers.com / Admin@2024!
    ✅ Step 7: You should be redirected to /admin dashboard
    ✅ Step 8: Try accessing different admin pages
    ✅ Step 9: Click logout, you should be redirected to login
    ✅ Step 10: Try accessing /admin again, should redirect to login


┌──────────────────────────────────────────────────────────────────────┐
│  Environment Variables Required                                       │
└──────────────────────────────────────────────────────────────────────┘

    # .env.local
    MONGODB_URI=mongodb+srv://...
    NEXTAUTH_SECRET=your-secret-key-min-32-chars
    NEXTAUTH_URL=http://localhost:3000


┌──────────────────────────────────────────────────────────────────────┐
│  Status: ✅ FULLY IMPLEMENTED AND WORKING                            │
└──────────────────────────────────────────────────────────────────────┘
```
