"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Tag,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  Trash2,
  Loader2,
  Eye
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

const statusOptions = [
  { value: "new", label: "New", color: "bg-orange-100 text-orange-700", icon: Clock },
  { value: "contacted", label: "Contacted", color: "bg-blue-100 text-blue-700", icon: Mail },
  { value: "converted", label: "Converted", color: "bg-green-100 text-green-700", icon: CheckCircle },
  { value: "closed", label: "Closed", color: "bg-gray-100 text-gray-700", icon: XCircle },
];

export default function InquiryDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        const response = await fetch(`/api/inquiries/${params.id}`);
        const data = await response.json();

        if (data.success) {
          setInquiry(data.inquiry);
        } else {
          setError(data.message || "Failed to load inquiry");
        }
      } catch (err) {
        console.error("Error fetching inquiry:", err);
        setError("An error occurred while loading the inquiry");
      } finally {
        setLoading(false);
      }
    };

    fetchInquiry();
  }, [params.id]);

  const updateStatus = async (status: string) => {
    if (!inquiry) return;
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/inquiries/${inquiry._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (data.success) {
        setInquiry((prev) => prev ? { ...prev, status: status as Inquiry["status"] } : null);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!inquiry) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/inquiries/${inquiry._id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        router.push("/admin/inquiries");
      }
    } catch (error) {
      console.error("Failed to delete inquiry:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !inquiry) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-red-500 mb-4">{error || "Inquiry not found"}</p>
        <Link
          href="/admin/inquiries"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Back to Inquiries
        </Link>
      </div>
    );
  }

  const getStatusInfo = (status: string) =>
    statusOptions.find((s) => s.value === status) || statusOptions[0];

  const currentStatus = getStatusInfo(inquiry.status);
  const StatusIcon = currentStatus.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/inquiries"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inquiry Details</h1>
            <p className="text-gray-500 text-sm">View and manage inquiry</p>
          </div>
        </div>
        <button
          onClick={() => setDeleteConfirm(true)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete Inquiry"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* Inquiry Header */}
        <div className="p-6 border-b space-y-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{inquiry.subject}</h2>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>
                  {format(new Date(inquiry.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                </span>
                <span className="text-gray-300">•</span>
                <span>{formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true })}</span>
              </div>
            </div>

            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${currentStatus.color}`}>
              <StatusIcon className="w-4 h-4" />
              <span className="capitalize">{currentStatus.label}</span>
            </div>
          </div>

          {/* Status Actions */}
          <div className="space-y-2 pt-4 border-t">
            <label className="text-sm font-medium text-gray-700">Update Status</label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => {
                const OptionIcon = status.icon;
                return (
                  <button
                    key={status.value}
                    onClick={() => updateStatus(status.value)}
                    disabled={isUpdating || inquiry.status === status.value}
                    className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${inquiry.status === status.value
                        ? status.color + " font-medium ring-2 ring-offset-1 ring-gray-200"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                      }`}
                  >
                    <OptionIcon className="w-4 h-4" />
                    {status.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Contact Info Grid */}
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-b">
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">Contact Information</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-gray-900 font-medium">{inquiry.fullName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <a href={`mailto:${inquiry.email}`} className="text-primary hover:underline font-medium">
                    {inquiry.email}
                  </a>
                </div>
              </div>

              {inquiry.phone && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <a href={`tel:${inquiry.phone}`} className="text-gray-900 hover:text-primary font-medium">
                      {inquiry.phone}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 space-y-4">
            <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">Inquiry Context</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Source</p>
                  <p className="text-gray-900 font-medium capitalize">{inquiry.source || "Website"}</p>
                </div>
              </div>

              {inquiry.product && (
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Interested in Product</p>
                  <Link
                    href={`/products/${inquiry.product.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium inline-flex items-center gap-1 group"
                  >
                    {inquiry.product.name}
                    <Eye className="w-3 h-3 group-hover:scale-110 transition-transform" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message Body */}
        <div className="p-8 bg-gray-50/50">
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-4">Message Content</h3>
          <div className="bg-white p-6 rounded-lg border text-gray-800 whitespace-pre-wrap leading-relaxed shadow-sm">
            {inquiry.message}
          </div>
        </div>

        {/* Quick Actions Footer */}
        <div className="p-6 bg-gray-50 border-t">
          <div className="flex gap-3">
            <a
              href={`mailto:${inquiry.email}?subject=Re: ${inquiry.subject}`}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm"
            >
              <Mail className="w-4 h-4" />
              Reply via Email
            </a>
            {inquiry.phone && (
              <a
                href={`tel:${inquiry.phone}`}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 transition-opacity"
            onClick={() => setDeleteConfirm(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6 w-full max-w-md z-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Inquiry?
            </h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. The inquiry will be permanently deleted from the database.
            </p>
            <div className="flex items-center justify-end gap-4">
              <button
                onClick={() => setDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-medium"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Inquiry
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
