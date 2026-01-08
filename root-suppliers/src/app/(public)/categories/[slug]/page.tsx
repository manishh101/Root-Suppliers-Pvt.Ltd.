"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
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
  image?: { url: string; alt: string };
  productCount?: number;
  description?: string;
}



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
                  <h3 className="font-semibold text-lg text-gray-900 mb-5 flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary-600" />
                    Explore {currentCategory.name}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {subcategories.map(sub => (
                      <Link
                        key={sub._id}
                        href={`/categories/${sub.slug}`}
                        className="group bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-gray-100/50 hover:border-gray-200/50 hover:shadow-md transition-all text-center"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-xl mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Package className="w-6 h-6 text-primary-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 text-sm mb-1 transition-colors">{sub.name}</h4>
                        <p className="text-xs text-gray-500">{sub.productCount || 0} products</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Toolbar */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 sticky top-20 lg:static z-10">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                  {/* Mobile Filter */}
                  <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden w-full md:w-auto">
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

                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search in this category..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-10 bg-gray-50 border-transparent focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full md:w-40 h-10">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="name-asc">Name: A to Z</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="hidden md:flex bg-gray-100 rounded-lg p-1 gap-1">
                      <button onClick={() => setView("grid")} className={`p-1.5 rounded-md transition-colors ${view === "grid" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-900"}`}>
                        <Grid3X3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => setView("list")} className={`p-1.5 rounded-md transition-colors ${view === "list" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-900"}`}>
                        <LayoutList className="w-4 h-4" />
                      </button>
                    </div>
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
                  <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" : "space-y-4"}>
                    {products.map(product => (
                      <ProductCard key={product._id} product={product} view={view} />
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
