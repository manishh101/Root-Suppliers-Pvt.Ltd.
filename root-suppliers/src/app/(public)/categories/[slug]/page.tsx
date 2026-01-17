"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Grid3X3,
  LayoutList,
  ChevronRight,
  Loader2,
  Package,
  ArrowUpRight,
  SlidersHorizontal,
  X
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/SelectRadix";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/SheetRadix";
import { CategorySidebar, CategoryNode } from "@/components/categories/CategorySidebar";
import { ProductCard } from "@/components/cards/ProductCard";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import { PLACEHOLDER_IMAGES } from "@/lib/cloudinary";

// --- Types ---
interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
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
  };
  images: Array<{
    url: string;
    publicId?: string;
    alt?: string;
  }>;
  isFeatured: boolean;
  isNew: boolean;
  stock: number;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  parent?: string;
  image?: { url: string; alt: string; publicId?: string };
  productCount?: number;
  description?: string;
}

// ... (rest of imports and interfaces)

// Helper to build tree
function buildCategoryTree(categories: Category[]): CategoryNode[] {
  const categoryMap = new Map<string, CategoryNode>();
  const rootCategories: CategoryNode[] = [];
  categories.forEach((cat) => categoryMap.set(cat._id, { ...cat, children: [] }));
  categories.forEach((cat) => {
    const node = categoryMap.get(cat._id)!;
    if (cat.parent && categoryMap.has(cat.parent)) {
      categoryMap.get(cat.parent)!.children!.push(node);
    } else {
      rootCategories.push(node);
    }
  });
  return rootCategories;
}

function CategoryDetailContent({ params }: { params: { slug: string } }) {
  const searchParams = useSearchParams();
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryTree, setCategoryTree] = useState<CategoryNode[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);

  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch Category Tree and Current Category Info
  useEffect(() => {
    const initData = async () => {
      try {
        const res = await fetch("/api/categories?includeProductCount=true&isActive=true");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setCategories(data.categories);
            setCategoryTree(buildCategoryTree(data.categories));

            const current = data.categories.find((c: Category) => c.slug === params.slug);
            if (current) setCurrentCategory(current);
          }
        }
      } catch (e) {
        console.error("Init error", e);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [params.slug]);

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      try {
        // Build query string
        const q = new URLSearchParams();
        q.set("category", params.slug); // Recursive filtering handled by backend now
        q.set("limit", "100"); // Fetch enough for now
        q.set("isActive", "true");

        switch (sortBy) {
          case "price-low": q.set("sort", "price"); q.set("order", "asc"); break;
          case "price-high": q.set("sort", "price"); q.set("order", "desc"); break;
          case "name-asc": q.set("sort", "name"); q.set("order", "asc"); break;
          case "name-desc": q.set("sort", "name"); q.set("order", "desc"); break;
          default: q.set("sort", "createdAt"); q.set("order", "desc");
        }

        if (searchQuery) q.set("search", searchQuery);

        const res = await fetch(`/api/products?${q.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (e) {
        console.error("Fetch products error", e);
      } finally {
        setProductsLoading(false);
      }
    };

    // Only fetch if we have category info (or at least know slug is valid?)
    // Actually we can fetch by slug directly.
    fetchProducts();
  }, [params.slug, sortBy, searchQuery]);

  // Find subcategories of current category
  const subcategories = categories.filter(c => c.parent === currentCategory?._id);

  if (loading) return <div className="h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white"><Loader2 className="animate-spin w-10 h-10 text-primary-600" /></div>;
  if (!currentCategory) return (
    <div className="container-main py-20 text-center">
      <h2 className="text-2xl font-bold">Category Not Found</h2>
      <Link href="/categories" className="text-primary-600 hover:underline mt-4 inline-block">Back to Categories</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-white border-b border-gray-100/50 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(239,68,68,0.04),transparent_50%)]" />

        <div className="container-main relative z-10 py-16 md:py-20">
          <div className="max-w-4xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/categories" className="hover:text-primary-600 transition-colors">Categories</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-900 font-medium">{currentCategory.name}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">{currentCategory.name}</h1>
            {currentCategory.description && (
              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">{currentCategory.description}</p>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container-main">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Sidebar */}
            <div className="lg:col-span-3 sticky top-24 z-20 hidden lg:block">
              <CategorySidebar categories={categoryTree} activeSlug={currentCategory.slug} />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-9">

              {/* Subcategories Grid (if any) */}
              {subcategories.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-xl text-gray-900 tracking-tight">
                      Explore {currentCategory.name} Collections
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {subcategories.map(sub => (
                      <Link
                        key={sub._id}
                        href={`/categories/${sub.slug}`}
                        className="group relative h-40 md:h-48 overflow-hidden rounded-2xl bg-gray-100 transition-all duration-500 hover:shadow-xl hover:shadow-gray-200/50 block"
                      >
                        {/* Image Layer */}
                        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110 flex items-center justify-center">
                          <CloudinaryImage
                            src={sub.image?.url || PLACEHOLDER_IMAGES.PRODUCT}
                            publicId={sub.image?.publicId}
                            alt={sub.name}
                            fill
                            className="object-cover"
                          />
                          {/* Modern Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                        </div>

                        {/* Content Layer */}
                        <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end transform transition-transform duration-500 group-hover:translate-y-[-4px]">
                          <h4 className="font-bold text-white text-sm md:text-base mb-1 tracking-tight group-hover:text-primary-300 transition-colors">
                            {sub.name}
                          </h4>
                          <div className="flex items-center justify-between items-center">
                            <p className="text-white/70 text-[10px] md:text-sm font-medium">
                              {sub.productCount || 0} Products
                            </p>
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/20">
                              <ChevronRight className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        </div>

                        {/* Hover Accent Line */}
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Toolbar */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 sticky top-0 z-10">
                <div className="flex flex-col gap-4">
                  {/* Top Row: Categories Filter + Sort */}
                  <div className="flex items-center gap-3">
                    {/* Mobile Filter */}
                    <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
                      <SheetTrigger asChild>
                        <Button variant="outline" className="lg:hidden flex-1">
                          <Filter className="w-4 h-4 mr-2" /> Categories
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-[300px] p-0">
                        <div className="p-4 border-b">
                          <h3 className="font-bold text-lg">Categories</h3>
                        </div>
                        <div className="p-4">
                          <CategorySidebar categories={categoryTree} activeSlug={currentCategory.slug} className="border-none shadow-none" />
                        </div>
                      </SheetContent>
                    </Sheet>

                    {/* Sort */}
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="flex-1 lg:w-48 h-10">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="name-asc">Name: A to Z</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Desktop View Toggle */}
                    <div className="hidden md:flex bg-gray-100 rounded-lg p-1 gap-1">
                      <button onClick={() => setView("grid")} className={`p-1.5 rounded-md transition-colors ${view === "grid" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-900"}`}>
                        <Grid3X3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => setView("list")} className={`p-1.5 rounded-md transition-colors ${view === "list" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-900"}`}>
                        <LayoutList className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Second Row: Search */}
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search in this category..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-10 bg-gray-50 border-transparent focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              {productsLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>
              ) : products.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4"><Package className="w-8 h-8 text-gray-300" /></div>
                  <h3 className="text-lg font-bold text-gray-900">No products found</h3>
                  <p className="text-gray-500 mt-2">Try adjusting your filters or search query.</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  <div className={view === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6" : "space-y-4"}>
                    {products.map(product => (
                      <ProductCard key={product._id} product={product} view={view} size="compact" />
                    ))}
                  </div>
                </AnimatePresence>
              )}

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function CategoryDetailPage({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary-600" /></div>}>
      <CategoryDetailContent params={params} />
    </Suspense>
  );
}
