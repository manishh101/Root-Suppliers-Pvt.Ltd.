"use client";

import React, { useState, useEffect } from "react";
import { X, Phone, Mail, MessageCircle, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";

interface ProductInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    _id: string;
    name: string;
    slug: string;
    images?: Array<{ url: string; alt?: string }>;
  };
  quantity?: number;
}

export default function ProductInquiryModal({
  isOpen,
  onClose,
  product,
  quantity = 1,
}: ProductInquiryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<any>(null);

  // Fetch settings for contact information
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();
        if (data.success) {
          setSettings(data.settings);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: `${formData.message}\n\n--- Product Details ---\nProduct: ${product.name}\nQuantity: ${quantity}${formData.company ? `\nCompany: ${formData.company}` : ''}`,
          product: product._id,
          source: "product_inquiry",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit inquiry");
      }

      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setFormData({ name: "", email: "", phone: "", company: "", message: "" });
      }, 2000);
    } catch (err) {
      setError("Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10 group"
          aria-label="Close modal"
        >
          <X className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
        </button>

        {/* Success State */}
        {isSuccess ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Inquiry Submitted!
            </h3>
            <p className="text-gray-600">
              We&apos;ll get back to you within 24 hours.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Product Inquiry
              </h2>
              <p className="text-sm text-gray-600">
                Fill out the form below and we&apos;ll get back to you shortly.
              </p>
            </div>

            {/* Product Info */}
            <div className="p-6 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0 ring-2 ring-gray-100">
                  {product.images?.[0]?.url ? (
                    <CloudinaryImage
                      src={product.images[0].url}
                      alt={product.images[0].alt || product.name || "Product Image"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MessageCircle className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-base mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="font-medium">Quantity:</span>
                    <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">{quantity}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
                  <span className="text-red-600 font-bold">⚠</span>
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-all"
                    placeholder="+977-XXX-XXXXXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-all"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none transition-all"
                  placeholder="I'm interested in this product. Please provide pricing and availability details..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full shadow-lg hover:shadow-xl transition-all"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Mail className="h-5 w-5 mr-2" />
                    Submit Inquiry
                  </>
                )}
              </Button>
            </form>

            {/* Alternative Contact */}
            <div className="p-6 bg-gradient-to-br from-gray-50 to-white border-t border-gray-100">
              <p className="text-sm text-gray-600 text-center mb-4 font-medium">
                Or contact us directly:
              </p>
              <div className="flex justify-center gap-3">
                <a
                  href={`tel:${settings?.contact?.primaryPhone || '+9779851235637'}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 transition-all shadow-sm hover:shadow-md whitespace-nowrap"
                >
                  <Phone className="h-4 w-4 text-primary-600" />
                  Call Us
                </a>
                <a
                  href={`https://wa.me/${(() => {
                    const whatsappNumber = settings?.contact?.whatsapp || settings?.contact?.primaryPhone || '9779851235637';
                    const cleanNumber = whatsappNumber.replace(/\D/g, '');
                    return cleanNumber.startsWith('977') ? cleanNumber : `977${cleanNumber}`;
                  })()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 rounded-xl text-sm font-semibold text-white hover:bg-green-700 transition-all shadow-sm hover:shadow-md whitespace-nowrap"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
