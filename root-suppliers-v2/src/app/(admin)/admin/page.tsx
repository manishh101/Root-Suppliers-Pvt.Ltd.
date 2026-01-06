"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  FolderTree,
  FileText,
  MessageSquare,
  Users,
  Award,
  Star,
  TrendingUp,
  Eye,
  Plus,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Stats {
  products: { total: number; active: number };
  categories: { total: number; active: number };
  blogs: { total: number; published: number };
  inquiries: { total: number; new: number };
  users: { total: number; active: number };
  brands: { total: number };
  testimonials: { total: number; active: number };
  recentInquiries: Array<{
    _id: string;
    fullName: string;
    email: string;
    subject: string;
    status: string;
    createdAt: string;
  }>;
  recentProducts: Array<{
    _id: string;
    name: string;
    slug: string;
    images: string[];
    isActive: boolean;
    createdAt: string;
  }>;
}

const statCards = [
  {
    label: "Products",
    key: "products",
    icon: Package,
    color: "bg-blue-500",
    href: "/admin/products",
    format: (stats: Stats) => `${stats.products.active} active / ${stats.products.total} total`,
  },
  {
    label: "Categories",
    key: "categories",
    icon: FolderTree,
    color: "bg-green-500",
    href: "/admin/categories",
    format: (stats: Stats) => `${stats.categories.active} active / ${stats.categories.total} total`,
  },
  {
    label: "Blogs",
    key: "blogs",
    icon: FileText,
    color: "bg-purple-500",
    href: "/admin/blogs",
    format: (stats: Stats) => `${stats.blogs.published} published / ${stats.blogs.total} total`,
  },
  {
    label: "Inquiries",
    key: "inquiries",
    icon: MessageSquare,
    color: "bg-orange-500",
    href: "/admin/inquiries",
    format: (stats: Stats) => `${stats.inquiries.new} new / ${stats.inquiries.total} total`,
    highlight: true,
  },
  {
    label: "Brands",
    key: "brands",
    icon: Award,
    color: "bg-pink-500",
    href: "/admin/brands",
    format: (stats: Stats) => `${stats.brands.total} total`,
  },
  {
    label: "Testimonials",
    key: "testimonials",
    icon: Star,
    color: "bg-yellow-500",
    href: "/admin/testimonials",
    format: (stats: Stats) => `${stats.testimonials.active} active / ${stats.testimonials.total} total`,
  },
];

const quickActions = [
  { label: "Add Product", href: "/admin/products/new", icon: Package },
  { label: "Add Blog", href: "/admin/blogs/new", icon: FileText },
  { label: "Add Category", href: "/admin/categories/new", icon: FolderTree },
  { label: "View Inquiries", href: "/admin/inquiries", icon: MessageSquare },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats?type=overview");
        const data = await response.json();

        if (!data.success) {
          setError(data.message || "Failed to fetch stats");
          return;
        }

        setStats(data.stats);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here&apos;s your overview.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.key}
              href={card.href}
              className={`bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow ${
                card.highlight && stats?.inquiries.new && stats.inquiries.new > 0
                  ? "ring-2 ring-orange-500"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stats
                      ? card.key === "products"
                        ? stats.products.total
                        : card.key === "categories"
                        ? stats.categories.total
                        : card.key === "blogs"
                        ? stats.blogs.total
                        : card.key === "inquiries"
                        ? stats.inquiries.total
                        : card.key === "brands"
                        ? stats.brands.total
                        : stats.testimonials.total
                      : 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats ? card.format(stats) : "Loading..."}
                  </p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors text-center"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-gray-700">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Inquiries</h2>
            <Link
              href="/admin/inquiries"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y">
            {stats?.recentInquiries && stats.recentInquiries.length > 0 ? (
              stats.recentInquiries.map((inquiry) => (
                <Link
                  key={inquiry._id}
                  href={`/admin/inquiries/${inquiry._id}`}
                  className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 truncate">
                        {inquiry.fullName}
                      </p>
                      {inquiry.status === "new" && (
                        <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-700 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{inquiry.subject}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(inquiry.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p>No inquiries yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Products</h2>
            <Link
              href="/admin/products"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y">
            {stats?.recentProducts && stats.recentProducts.length > 0 ? (
              stats.recentProducts.map((product) => (
                <Link
                  key={product._id}
                  href={`/admin/products/${product.slug}/edit`}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {product.images && product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(product.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        product.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Package className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p>No products yet</p>
                <Link
                  href="/admin/products/new"
                  className="inline-flex items-center gap-2 mt-3 text-primary hover:underline"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
