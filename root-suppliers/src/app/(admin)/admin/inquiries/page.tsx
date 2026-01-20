"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  MessageSquare,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface Inquiry {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  source: string;
  status: "new" | "contacted" | "converted" | "closed";
  product?: {
    _id: string;
    name: string;
    slug: string;
  };
  createdAt: string;
  notes?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const statusOptions = [
  { value: "new", label: "New", color: "bg-orange-100 text-orange-700", icon: Clock },
  { value: "contacted", label: "Contacted", color: "bg-blue-100 text-blue-700", icon: Mail },
  { value: "converted", label: "Converted", color: "bg-green-100 text-green-700", icon: CheckCircle },
  { value: "closed", label: "Closed", color: "bg-gray-100 text-gray-700", icon: XCircle },
];

export default function InquiriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Fetch inquiries
  const fetchInquiries = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      });

      if (searchQuery) {
        params.set("search", searchQuery);
      }

      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }

      const response = await fetch(`/api/inquiries?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setInquiries(data.inquiries);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch inquiries:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, statusFilter]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        router.push("/admin/inquiries?page=1");
      } else {
        fetchInquiries();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter]);

  // Update inquiry status
  const updateStatus = async (id: string, status: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (data.success) {
        setInquiries((prev) =>
          prev.map((inq) =>
            inq._id === id ? { ...inq, status: status as Inquiry["status"] } : inq
          )
        );
        if (selectedInquiry?._id === id) {
          setSelectedInquiry({ ...selectedInquiry, status: status as Inquiry["status"] });
        }
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete inquiry
  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setInquiries((prev) => prev.filter((inq) => inq._id !== id));
        setDeleteConfirm(null);
        setSelectedInquiry(null);
      }
    } catch (error) {
      console.error("Failed to delete inquiry:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    router.push(`/admin/inquiries?page=${newPage}`);
  };

  const getStatusInfo = (status: string) =>
    statusOptions.find((s) => s.value === status) || statusOptions[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
        <p className="text-gray-600">Manage customer inquiries and leads</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            >
              <option value="all">All Status</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inquiry List */}
        <div
          className={`lg:col-span-2 bg-white rounded-xl shadow-sm border overflow-hidden ${selectedInquiry ? "hidden lg:block" : "block"
            }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : inquiries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500">No inquiries found</p>
            </div>
          ) : (
            <>
              <div className="divide-y">
                {inquiries.map((inquiry) => {
                  const statusInfo = getStatusInfo(inquiry.status);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <button
                      key={inquiry._id}
                      onClick={() => setSelectedInquiry(inquiry)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${selectedInquiry?._id === inquiry._id ? "bg-primary/5" : ""
                        }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-semibold text-gray-600">
                            {inquiry.fullName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-medium text-gray-900 truncate">
                              {inquiry.fullName}
                            </p>
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full flex items-center gap-1 ${statusInfo.color}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {statusInfo.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{inquiry.subject}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDistanceToNow(new Date(inquiry.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t">
                  <p className="text-sm text-gray-600">
                    Page {pagination.page} of {pagination.pages}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Inquiry Detail */}
        <div
          className={`bg-white rounded-xl shadow-sm border overflow-hidden ${selectedInquiry ? "block" : "hidden lg:block"
            }`}
        >
          {selectedInquiry ? (
            <div className="p-6 space-y-6">
              {/* Back button for mobile */}
              <button
                onClick={() => setSelectedInquiry(null)}
                className="lg:hidden flex items-center gap-2 text-gray-500 hover:text-gray-900 -ml-2 px-2 py-1"
              >
                <ChevronLeft className="w-5 h-5" />
                Back to Inquiries
              </button>

              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedInquiry.fullName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {format(new Date(selectedInquiry.createdAt), "PPpp")}
                  </p>
                </div>
                <button
                  onClick={() => setDeleteConfirm(selectedInquiry._id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="hover:text-primary"
                  >
                    {selectedInquiry.email}
                  </a>
                </div>
                {selectedInquiry.phone && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <a
                      href={`tel:${selectedInquiry.phone}`}
                      className="hover:text-primary"
                    >
                      {selectedInquiry.phone}
                    </a>
                  </div>
                )}
              </div>

              {/* Subject & Message */}
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">{selectedInquiry.subject}</h3>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {selectedInquiry.message}
                </p>
              </div>

              {/* Related Product */}
              {selectedInquiry.product && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Related Product:</p>
                  <Link
                    href={`/products/${selectedInquiry.product.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                  >
                    {selectedInquiry.product.name}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                </div>
              )}

              {/* Source */}
              <div className="text-sm text-gray-500">
                Source: <span className="capitalize">{selectedInquiry.source}</span>
              </div>

              {/* Status Update */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Update Status</label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => {
                    const StatusIcon = status.icon;
                    return (
                      <button
                        key={status.value}
                        onClick={() => updateStatus(selectedInquiry._id, status.value)}
                        disabled={isUpdating || selectedInquiry.status === status.value}
                        className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${selectedInquiry.status === status.value
                            ? status.color + " font-medium"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                      >
                        <StatusIcon className="w-4 h-4" />
                        {status.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Re: ${selectedInquiry.subject}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Reply
                </a>
                {selectedInquiry.phone && (
                  <a
                    href={`tel:${selectedInquiry.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Eye className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500">Select an inquiry to view details</p>
            </div>
          )}
        </div>
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
              Delete Inquiry?
            </h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. The inquiry will be permanently deleted.
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
