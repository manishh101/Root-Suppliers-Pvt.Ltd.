// ===== Site Constants =====
export const SITE_NAME = "Root Suppliers";
export const SITE_TAGLINE = "All Construction Solutions Under One Roof";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// ===== Navigation =====
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Blog", href: "/blogs" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
] as const;

export const ADMIN_NAV_LINKS = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Products", href: "/admin/products", icon: "Package" },
  { label: "Categories", href: "/admin/categories", icon: "Folders" },
  { label: "Blogs", href: "/admin/blogs", icon: "FileText" },
  { label: "Inquiries", href: "/admin/inquiries", icon: "MessageSquare" },
  { label: "Testimonials", href: "/admin/testimonials", icon: "Star" },
  { label: "Brands", href: "/admin/brands", icon: "Award" },
  { label: "Media", href: "/admin/media", icon: "Image" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
  { label: "Users", href: "/admin/users", icon: "Users" },
] as const;

// ===== Pagination =====
export const ITEMS_PER_PAGE = 12;
export const ADMIN_ITEMS_PER_PAGE = 20;

// ===== Contact Information =====
export const CONTACT_INFO = {
  phone: {
    primary: "+977-XXX-XXXXXXX",
    secondary: "+977-XXX-XXXXXXX",
  },
  email: {
    primary: "info@rootsuppliers.com.np",
    secondary: "sales@rootsuppliers.com.np",
  },
  address: "Biratnagar, Nepal",
  businessHours: [
    { day: "Sunday - Friday", hours: "9:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
  ],
} as const;

// ===== Social Links =====
export const SOCIAL_LINKS = {
  facebook: "https://facebook.com/rootsuppliers",
  instagram: "https://instagram.com/rootsuppliers",
  youtube: "https://youtube.com/@rootsuppliers",
  linkedin: "https://linkedin.com/company/rootsuppliers",
} as const;

// ===== Inquiry Status =====
export const INQUIRY_STATUS = {
  new: { label: "New", color: "primary" },
  contacted: { label: "Contacted", color: "info" },
  converted: { label: "Converted", color: "success" },
  closed: { label: "Closed", color: "gray" },
} as const;

// ===== Blog Status =====
export const BLOG_STATUS = {
  draft: { label: "Draft", color: "warning" },
  published: { label: "Published", color: "success" },
} as const;

// ===== Image Sizes =====
export const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 300, height: 300 },
  medium: { width: 600, height: 600 },
  large: { width: 1200, height: 1200 },
  hero: { width: 1920, height: 800 },
  og: { width: 1200, height: 630 },
} as const;

// ===== Cloudinary Folders =====
export const CLOUDINARY_FOLDERS = {
  products: "root-suppliers/products",
  categories: "root-suppliers/categories",
  blogs: "root-suppliers/blogs",
  brands: "root-suppliers/brands",
  testimonials: "root-suppliers/testimonials",
  gallery: "root-suppliers/gallery",
  site: "root-suppliers/site",
} as const;

// ===== API Endpoints =====
export const API_ENDPOINTS = {
  products: "/api/products",
  categories: "/api/categories",
  blogs: "/api/blogs",
  inquiries: "/api/inquiries",
  testimonials: "/api/testimonials",
  brands: "/api/brands",
  media: "/api/media",
  settings: "/api/settings",
  auth: "/api/auth",
  upload: "/api/upload",
  search: "/api/search",
} as const;

// ===== Error Messages =====
export const ERROR_MESSAGES = {
  generic: "Something went wrong. Please try again.",
  notFound: "The requested resource was not found.",
  unauthorized: "You are not authorized to perform this action.",
  validation: "Please check your input and try again.",
  network: "Network error. Please check your connection.",
} as const;

// ===== Success Messages =====
export const SUCCESS_MESSAGES = {
  created: "Created successfully!",
  updated: "Updated successfully!",
  deleted: "Deleted successfully!",
  inquiry: "Thank you! We'll get back to you soon.",
} as const;

// ===== Fallback Data =====
export const FALLBACK_TESTIMONIALS = [
  {
    _id: "1",
    customerName: "Ramesh Kumar",
    customerDesignation: "Contractor, Kumar Construction",
    reviewText: "Root Suppliers has been our go-to hardware store for over 5 years. Their quality products and reliable service have made our projects successful.",
    rating: 5,
  },
  {
    _id: "2",
    customerName: "Sita Sharma",
    customerDesignation: "Homeowner",
    reviewText: "Excellent service and great prices. The staff is very helpful and knowledgeable. Highly recommended!",
    rating: 5,
  },
  {
    _id: "3",
    customerName: "Bikash Thapa",
    customerDesignation: "Builder, Thapa Builders",
    reviewText: "One-stop shop for all construction needs. The variety of products and brands available is impressive.",
    rating: 4,
  },
];
