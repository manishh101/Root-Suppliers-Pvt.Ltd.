"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  FileText,
  MessageSquare,
  Users,
  Award,
  Star,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Image,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface User {
  userId: string;
  email: string;
  role: "admin" | "editor";
  name?: string;
}

const menuItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    label: "Blogs",
    href: "/admin/blogs",
    icon: FileText,
  },
  {
    label: "Inquiries",
    href: "/admin/inquiries",
    icon: MessageSquare,
    badge: true, // Show new inquiry count
  },
  {
    label: "Brands",
    href: "/admin/brands",
    icon: Award,
  },
  {
    label: "About Us",
    href: "/admin/about",
    icon: FolderTree, // Using FolderTree as a placeholder, maybe distinct icon like 'Info' if imported
  },
  {
    label: "Hero Slides",
    href: "/admin/hero-slides",
    icon: Image,
  },
  {
    label: "Testimonials",
    href: "/admin/testimonials",
    icon: Star,
  },
  {
    label: "Media",
    href: "/admin/media",
    icon: Image,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
    adminOnly: true,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    adminOnly: true,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newInquiryCount, setNewInquiryCount] = useState(0);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const data = await response.json();

        if (!data.success || !data.user) {
          router.replace("/admin/login");
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.replace("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Fetch new inquiry count
  useEffect(() => {
    const fetchInquiryCount = async () => {
      try {
        const response = await fetch("/api/stats?type=overview");
        const data = await response.json();
        if (data.success) {
          setNewInquiryCount(data.stats.inquiries?.new || 0);
        }
      } catch (error) {
        console.error("Failed to fetch inquiry count:", error);
      }
    };

    if (user) {
      fetchInquiryCount();
      // Refresh every 5 minutes
      const interval = setInterval(fetchInquiryCount, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Close sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter((item) => {
    if (item.adminOnly && user?.role !== "admin") {
      return false;
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If on login page, render without layout wrapper
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">Root</span>
            <span className="text-xl font-bold">Suppliers</span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-4rem)]">
          {filteredMenuItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
                {item.badge && newInquiryCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {newInquiryCount}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors mt-4"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main content area */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white border-b shadow-sm">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Page title - can be enhanced with breadcrumbs */}
          <h1 className="text-lg font-semibold text-gray-800 hidden sm:block">
            Admin Panel
          </h1>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                {user?.email?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-800">
                  {user?.name || user?.email?.split("@")[0]}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {/* Dropdown menu */}
            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                  <div className="py-1">
                    <Link
                      href="/admin/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    {user?.role === "admin" && (
                      <Link
                        href="/admin/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Settings
                      </Link>
                    )}
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Main content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
