"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Share2,
  Heart,
  Phone,
  MessageCircle,
  Check,
  Package,
  Truck,
  Shield,
  Award,
  Minus,
  Plus,
  Loader2,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import ProductInquiryModal from "@/components/modals/ProductInquiryModal";
import { ProductCard } from "@/components/cards/ProductCard";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import { PLACEHOLDER_IMAGES } from "@/lib/cloudinary";
import { useToast } from "@/components/ui/Toast";

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  specifications?: Array<{ key: string; value: string }>;
  features?: string[];
  tags?: string[];
  price: number;
  discountPrice?: number;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  brand: {
    _id: string;
    name: string;
    slug: string;
    logo?: { url: string; publicId?: string };
  };
  images: Array<{
    url: string;
    publicId?: string;
    alt?: string;
  }>;
  isFeatured: boolean;
  isNew: boolean;
  stock: number;
  sku?: string;
  unit?: string;
}

interface ProductDetailContentProps {
  slug: string;
}

export default function ProductDetailContent({ slug }: ProductDetailContentProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const { showToast } = useToast();

  // Fetch settings for WhatsApp and phone number
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${slug}?t=${Date.now()}`, { cache: "no-store" });
        if (!response.ok) {
          setProduct(null);
          return;
        }
        const data = await response.json();
        const mainProduct = data.product;
        setProduct(mainProduct);

        // Fetch related products (Recommendation System)
        if (mainProduct?.category?.slug) {
          let recommended: Product[] = [];

          console.log("Fetching recommendations for category:", mainProduct.category.slug);

          // 1. Priority: Matches Tags + Category (Highly Relevant)
          if (mainProduct.tags && mainProduct.tags.length > 0) {
            try {
              const tagsQuery = mainProduct.tags.join(",");
              const tagUrl = `/api/products?category=${mainProduct.category.slug}&tags=${encodeURIComponent(tagsQuery)}&exclude=${mainProduct._id}&limit=5`;
              console.log("Tag-based recommendation URL:", tagUrl);

              const tagRes = await fetch(tagUrl);
              if (tagRes.ok) {
                const tagData = await tagRes.json();
                if (tagData.products) {
                  recommended = tagData.products;
                  console.log("Found", recommended.length, "tag-matched products");
                }
              }
            } catch (err) {
              console.error("Error fetching tag recommendations:", err);
            }
          }

          // 2. Fallback/Fill: Category match only (Broad Relevance)
          // Fills the remaining slots if tag search didn't return 4 products
          if (recommended.length < 5) {
            try {
              // Exclude current product AND already found tag-matched products
              const excludeIds = [mainProduct._id, ...recommended.map(p => p._id)].join(",");
              const catUrl = `/api/products?category=${mainProduct.category.slug}&exclude=${excludeIds}&limit=${5 - recommended.length}`;
              console.log("Category-based recommendation URL:", catUrl);

              const catRes = await fetch(catUrl);
              if (catRes.ok) {
                const catData = await catRes.json();
                if (catData.products) {
                  recommended = [...recommended, ...catData.products];
                  console.log("Total recommendations after category match:", recommended.length);
                }
              }
            } catch (err) {
              console.error("Error fetching category recommendations:", err);
            }
          }

          console.log("Final recommended products count:", recommended.length);
          setRelatedProducts(recommended);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const images = product.images?.length
    ? product.images
    : [{ url: PLACEHOLDER_IMAGES.PRODUCT, alt: product.name }];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const handleWhatsAppInquiry = () => {
    const message = encodeURIComponent(
      `Hi, I'm interested in ${product.name}. Please provide more information.`
    );
    const whatsappNumber = settings?.contact?.whatsapp || settings?.contact?.primaryPhone || '9779800000000';
    // Remove any non-digit characters and ensure it starts with country code
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    const formattedNumber = cleanNumber.startsWith('977') ? cleanNumber : `977${cleanNumber}`;
    window.open(`https://wa.me/${formattedNumber}?text=${message}`, "_blank");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("success", "Link copied to clipboard!");
    }
  };

  return (
    <>
      {/* Breadcrumb */}
      <section className="bg-gray-100 py-4">
        <div className="container-main">
          <nav className="flex items-center gap-2 text-sm text-gray-600 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-primary-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/products"
              className="hover:text-primary-600 transition-colors"
            >
              Products
            </Link>
            <span>/</span>
            <Link
              href={`/categories/${product.category?.slug}`}
              className="hover:text-primary-600 transition-colors"
            >
              {product.category?.name}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>
        </div>
      </section>

      {/* Product Detail */}
      <section className="py-8 lg:py-12 bg-white">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                <CloudinaryImage
                  src={images[currentImageIndex].url || PLACEHOLDER_IMAGES.PRODUCT}
                  publicId={images[currentImageIndex].publicId}
                  alt={images[currentImageIndex].alt || product.name}
                  fill
                  className="object-contain p-4 mix-blend-multiply"
                  priority
                />

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && (
                    <Badge className="bg-primary-600 text-white">New</Badge>
                  )}
                  {discount > 0 && (
                    <Badge className="bg-green-600 text-white">
                      -{discount}%
                    </Badge>
                  )}
                </div>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                >
                  <Share2 className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${index === currentImageIndex
                        ? "border-primary-600"
                        : "border-transparent hover:border-gray-300"
                        }`}
                    >
                      <CloudinaryImage
                        src={image.url || PLACEHOLDER_IMAGES.PRODUCT}
                        publicId={image.publicId}
                        alt={image.alt || `${product.name} ${index + 1}`}
                        fill
                        className="object-contain p-2 mix-blend-multiply"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {/* Category & Brand */}
              <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4">
                <Link
                  href={`/categories/${product.category?.slug}`}
                  className="text-xs md:text-sm text-primary-600 hover:text-primary-700 font-bold uppercase tracking-wider bg-primary-50 px-2 py-1 rounded"
                >
                  {product.category?.name}
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-gray-300 hidden md:inline">|</span>
                  <span className="text-xs md:text-sm text-gray-500">
                    Brand:{" "}
                    <span className="font-bold text-gray-900 uppercase">
                      {product.brand?.name}
                    </span>
                  </span>
                </div>
              </div>

              {/* Name */}
              <h1 className="font-secondary font-bold text-xl md:text-3xl text-gray-900 mb-4 capitalize">
                {product.name.toLowerCase()}
              </h1>

              {/* SKU & Stock */}
              <div className="flex flex-col gap-1 mb-6">
                {product.sku && (
                  <p className="text-sm font-medium text-gray-600">
                    SKU: <span className="text-gray-900">{product.sku}</span>
                  </p>
                )}
                <p className="text-sm font-medium text-gray-600">
                  Stock: <span className={product.stock > 0 ? "text-green-600" : "text-red-500"}>
                    {product.stock > 0 ? `${product.stock} ${product.unit || 'items'} available` : "Out of Stock"}
                  </span>
                </p>
              </div>

              {/* Price */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
                {product.discountPrice && product.discountPrice < product.price ? (
                  <>
                    <div className="flex flex-col">
                      <span className="text-xl md:text-3xl font-bold text-primary-600">
                        NPR {product.discountPrice?.toLocaleString() || '0'}
                      </span>
                      <span className="text-sm md:text-lg text-gray-400 line-through">
                        NPR {product.price?.toLocaleString() || '0'}
                      </span>
                    </div>
                    <Badge
                      className="bg-green-600 text-white font-bold h-7 animate-pulse-subtle"
                    >
                      Save NPR{" "}
                      {((product.price || 0) - (product.discountPrice || 0)).toLocaleString()}
                    </Badge>
                  </>
                ) : (
                  <span className="text-2xl md:text-4xl font-bold text-gray-900">
                    NPR {product.price?.toLocaleString() || '0'}
                  </span>
                )}
                {product.unit && (
                  <span className="text-sm md:text-base text-gray-500 font-medium">/ {product.unit}</span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                {product.stock > 0 ? (
                  <>
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-green-600 font-medium">In Stock</span>
                    <span className="text-gray-500">
                      ({product.stock} available)
                    </span>
                  </>
                ) : (
                  <span className="text-red-600 font-medium">Out of Stock</span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Quantity & Actions */}
              <div className="space-y-4 mb-8">
                {/* Quantity Selector */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">
                    Quantity:
                  </span>
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2 hover:bg-gray-100 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity((q) => Math.min(product.stock, q + 1))
                      }
                      className="p-2 hover:bg-gray-100 transition-colors"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <Button
                    size="lg"
                    className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-100 border-0 h-14 text-lg font-medium tracking-wide transition-all hover:scale-[1.02] hover:shadow-xl group"
                    onClick={handleWhatsAppInquiry}
                  >
                    <MessageCircle className="h-5 w-5 mr-2 group-hover:animate-bounce" />
                    Chat on WhatsApp
                  </Button>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      size="lg"
                      variant="outline"
                      className="flex-1 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 h-12 transition-all font-medium whitespace-nowrap"
                      onClick={() => setInquiryModalOpen(true)}
                    >
                      <Mail className="h-5 w-5 mr-2 flex-shrink-0" />
                      Inquiry
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="flex-1 border-2 border-gray-200 text-gray-700 hover:border-primary-600 hover:text-primary-600 hover:bg-primary-50 h-12 transition-all font-medium whitespace-nowrap"
                      onClick={() => {
                        const phoneNumber = settings?.contact?.primaryPhone || '+9779800000000';
                        window.location.href = `tel:${phoneNumber}`;
                      }}
                    >
                      <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                      Call Now
                    </Button>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-primary-600" />
                  <span className="text-sm text-gray-600">Quality Assured</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-primary-600" />
                  <span className="text-sm text-gray-600">Fast Delivery</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary-600" />
                  <span className="text-sm text-gray-600">
                    Warranty Support
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-primary-600" />
                  <span className="text-sm text-gray-600">
                    Genuine Products
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="py-8 lg:py-12 bg-gray-50">
        <div className="container-main">
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-[30rem]">
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>

            <TabsContent value="specifications" className="mt-6">
              <div className="bg-white rounded-xl p-6 shadow-card">
                <h3 className="font-semibold text-lg text-gray-900 mb-4">
                  Technical Specifications
                </h3>
                {product.specifications && product.specifications.length > 0 ? (
                  <div className="divide-y">
                    {product.specifications.map((spec, index) => (
                      <div
                        key={index}
                        className="flex py-3 first:pt-0 last:pb-0"
                      >
                        <span className="w-1/3 text-gray-600">{spec.key}</span>
                        <span className="w-2/3 font-medium text-gray-900">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No specifications available for this product.
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="features" className="mt-6">
              <div className="bg-white rounded-xl p-6 shadow-card">
                <h3 className="font-semibold text-lg text-gray-900 mb-4">
                  Key Features
                </h3>
                {product.features && product.features.length > 0 ? (
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">
                    No features listed for this product.
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <div className="bg-white rounded-xl p-6 shadow-card">
                <h3 className="font-semibold text-lg text-gray-900 mb-4">
                  Shipping Information
                </h3>
                <div className="space-y-4 text-gray-600">
                  <p>
                    We offer reliable shipping across Biratnagar and the
                    surrounding region.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Free delivery within Biratnagar city limits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>
                        Delivery to nearby districts at nominal charges
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>
                        Same-day dispatch for orders placed before 2 PM
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>
                        Bulk orders may qualify for special delivery
                        arrangements
                      </span>
                    </li>
                  </ul>
                  <p className="text-sm text-gray-500 pt-2">
                    For specific delivery inquiries, please contact us directly.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 lg:py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container-main">
            {/* Section Header */}
            <div className="mb-8">
              <h2 className="font-primary font-bold text-xl md:text-3xl bg-gradient-to-r from-gray-900 via-primary-600 to-gray-900 bg-clip-text text-transparent mb-2">
                You May Also Like
              </h2>
              <p className="text-gray-600">
                Similar products that might interest you
              </p>
            </div>

            {/* Products Grid using ProductCard */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct._id}
                  product={relatedProduct}
                  view="grid"
                  size="compact"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Inquiry Modal */}
      <ProductInquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        product={{
          _id: product._id,
          name: product.name,
          slug: product.slug,
          images: images,
        }}
      />
    </>
  );
}
