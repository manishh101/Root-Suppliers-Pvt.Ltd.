"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Award,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  ExternalLink,
} from "lucide-react";

interface Brand {
  _id: string;
  name: string;
  slug: string;
  description: string;
  logo: {
    url: string;
    publicId: string;
  };
  website: string;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function BrandsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Fetch brands
  const fetchBrands = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();

      if (searchQuery) {
        params.set("search", searchQuery);
      }

      const response = await fetch(`/api/brands?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setBrands(data.brands || []);
        // Brands API doesn't have pagination, so we set it manually
        const total = data.brands?.length || 0;
        setPagination({
          page: 1,
          limit: total,
          total: total,
          pages: 1,
        });
      }
    } catch (error) {
      console.error("Failed to fetch brands:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        router.push("/admin/brands?page=1");
      } else {
        fetchBrands();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle delete
  const handleDelete = async (slug: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/brands/${slug}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        setBrands((prev) => prev.filter((b) => b.slug !== slug));
        setDeleteConfirm(null);
      } else {
        alert(data.message || "Failed to delete brand");
      }
    } catch (error) {
      console.error("Failed to delete brand:", error);
      alert("Failed to delete brand");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    router.push(`/admin/brands?page=${newPage}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
          <p className="text-gray-600">Manage partner brands</p>
        </div>
        <Link
          href="/admin/brands/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Brand
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Brands Grid */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : brands.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Award className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">No brands found</p>
            <Link
              href="/admin/brands/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Add Brand
            </Link>
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              {brands.map((brand) => (
                <div
                  key={brand._id}
                  className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow relative group"
                >
                  {/* Logo */}
                  <div className="aspect-square bg-white rounded-lg overflow-hidden mb-3 flex items-center justify-center p-4">
                    {brand.logo?.url ? (
                      <img
                        src={brand.logo.url}
                        alt={brand.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Award className="w-12 h-12 text-gray-400" />
                    )}
                  </div>

                  {/* Info */}
                  <h3 className="font-medium text-gray-900 truncate text-center">
                    {brand.name}
                  </h3>

                  {/* Status Badges */}
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${brand.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                        }`}
                    >
                      {brand.isActive ? "Active" : "Inactive"}
                    </span>
                    {brand.isFeatured && (
                      <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Actions Menu */}
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() =>
                        setOpenMenu(openMenu === brand._id ? null : brand._id)
                      }
                      className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {openMenu === brand._id && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setOpenMenu(null)}
                        />
                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border z-50">
                          <Link
                            href={`/admin/brands/${brand.slug}`}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </Link>
                          {brand.website && (
                            <a
                              href={brand.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Visit Site
                            </a>
                          )}
                          <button
                            onClick={() => {
                              setOpenMenu(null);
                              setDeleteConfirm(brand.slug);
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <p className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.pages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6 w-full max-w-md z-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Brand?
            </h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. The brand will be permanently deleted.
            </p>
            <div className="flex items-center justify-end gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
