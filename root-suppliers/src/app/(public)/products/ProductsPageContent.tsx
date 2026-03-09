"use client";

import React, { useState, useEffect, useCallback, Suspense, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Grid3X3,
  LayoutList,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  SlidersHorizontal,
  Package,
  Loader2,
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
import { Checkbox } from "@/components/ui/CheckboxRadix";
import { Label } from "@/components/ui/Label";
import { Slider } from "@/components/ui/SliderRadix";
import { ProductCard } from "@/components/cards/ProductCard";
import { CategorySidebar, CategoryNode } from "@/components/categories/CategorySidebar";

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
  productCount: number;
}

interface Brand {
  _id: string;
  name: string;
  slug: string;
}



// Helper to build tree
function buildCategoryTree(categories: any[]): CategoryNode[] {
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

// Filter Sidebar Component
function FilterSidebar({
  categories,
  brands,
  selectedCategories,
  selectedBrands,
  onCategoryChange,
  onBrandChange,
  onClearFilters,
}: {
  categories: Category[];
  brands: Brand[];
  selectedCategories: string[];
  selectedBrands: string[];
  onCategoryChange: (id: string) => void;
  onBrandChange: (id: string) => void;
  onClearFilters: () => void;
}) {
  const hasFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    selectedBrands.length > 0;

  return (
    <div className="space-y-6">
      {/* Clear Filters */}
      {hasFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="w-full"
        >
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      )}

      {/* Brands */}
      <div>
        <h4 className="font-bold text-gray-900 mb-4 flex items-center justify-between">
          Brands
          <span className="text-[10px] text-gray-400 font-normal capitalize tracking-wider">{brands.length} Available</span>
        </h4>
        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
          {brands.map((brand) => (
            <label
              key={brand._id}
              className="flex items-center gap-3 cursor-pointer group py-0.5"
            >
              <Checkbox
                checked={selectedBrands.includes(brand._id)}
                onCheckedChange={() => onBrandChange(brand._id)}
                className="border-gray-300 data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
              />
              <span className="text-sm text-gray-600 group-hover:text-primary-600 transition-colors flex-1">
                {brand.name}
              </span>
            </label>
          ))}
        </div>
      </div>

    </div>
  );
}

// Main content component with search params
function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryTree, setCategoryTree] = useState<CategoryNode[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  // Sync searchQuery with URL param "q"
  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 12;

  // Fetch categories and brands
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          fetch("/api/categories?limit=100&isActive=true&includeProductCount=true"),
          fetch("/api/brands?limit=100&isActive=true"),
        ]);

        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          if (data.success) {
            setCategories(data.categories || []);
            setCategoryTree(buildCategoryTree(data.categories || []));
          }
        }

        if (brandsRes.ok) {
          const data = await brandsRes.json();
          if (data.success) {
            setBrands(data.brands || []);
          }
        }
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };

    fetchFilters();
  }, []);

  // Fetch products with filters
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", currentPage.toString());
      params.set("limit", productsPerPage.toString());

      if (searchQuery) params.set("search", searchQuery);
      if (selectedCategories.length > 0)
        params.set("category", selectedCategories.join(","));
      if (selectedBrands.length > 0)
        params.set("brand", selectedBrands.join(","));

      switch (sortBy) {
        case "price-low":
          params.set("sort", "price");
          params.set("order", "asc");
          break;
        case "price-high":
          params.set("sort", "price");
          params.set("order", "desc");
          break;
        case "name-asc":
          params.set("sort", "name");
          params.set("order", "asc");
          break;
        case "name-desc":
          params.set("sort", "name");
          params.set("order", "desc");
          break;
        case "newest":
        default:
          params.set("sort", "createdAt");
          params.set("order", "desc");
      }

      const response = await fetch(`/api/products?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        // Append new products if page > 1, otherwise replace
        setProducts((prev) =>
          currentPage === 1 ? data.products || [] : [...prev, ...(data.products || [])]
        );
        setTotalProducts(data.pagination?.total || 0);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, selectedCategories, selectedBrands, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Infinite Scroll: Load more when scrolling near bottom
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setHasMore(currentPage < totalPages);
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
    setProducts([]); // Clear products when filters change
  }, [searchQuery, selectedCategories, selectedBrands, sortBy]);

  const handleCategoryChange = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleBrandChange = (id: string) => {
    setSelectedBrands((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSortBy("newest");
  };

  const activeFilterCount =
    selectedCategories.length +
    selectedBrands.length;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="container-main py-12 md:py-16">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-900">Products</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">All Products</h1>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="container-main">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Desktop Sidebar */}
            <aside className="lg:col-span-3 sticky top-24 z-20 hidden lg:block space-y-8">
              <div className="space-y-6">
                <CategorySidebar categories={categoryTree} activeSlug={undefined} />
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2 pb-4 border-b border-gray-50">
                    <SlidersHorizontal className="h-5 w-5 text-primary-600" />
                    Filters
                  </h3>
                  <FilterSidebar
                    categories={categories}
                    brands={brands}
                    selectedCategories={selectedCategories}
                    selectedBrands={selectedBrands}
                    onCategoryChange={handleCategoryChange}
                    onBrandChange={handleBrandChange}
                    onClearFilters={handleClearFilters}
                  />
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-9">
              {/* Toolbar */}
              {/* Toolbar */}
              <div className="bg-white rounded-xl shadow-card p-4 mb-6 sticky top-0 z-10">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  {/* Search */}
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors h-11"
                    />
                  </div>

                  <div className="flex items-center gap-3 w-full">
                    {/* Mobile Filter Button */}
                    <Sheet
                      open={mobileFilterOpen}
                      onOpenChange={setMobileFilterOpen}
                    >
                      <SheetTrigger asChild>
                        <Button
                          variant="outline"
                          className={`lg:hidden flex-1 relative h-11 border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 ${activeFilterCount > 0 ? "border-primary-200 bg-primary-50/50 text-primary-700" : ""
                            }`}
                        >
                          <Filter className={`h-4 w-4 mr-2 ${activeFilterCount > 0 ? "text-primary-600" : "text-gray-500"}`} />
                          Filters
                          {activeFilterCount > 0 && (
                            <Badge variant="secondary" className="ml-2 bg-primary-100 text-primary-700 border-none h-5 px-1.5 min-w-[20px]">
                              {activeFilterCount}
                            </Badge>
                          )}
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-[300px] p-0 overflow-y-auto">
                        <div className="p-4 border-b">
                          <h3 className="font-bold text-lg">Categories & Filters</h3>
                        </div>
                        <div className="p-4 space-y-8">
                          <CategorySidebar categories={categoryTree} activeSlug={undefined} className="border-none shadow-none" />
                          <div className="space-y-6 px-2">
                            <h3 className="font-bold text-gray-900 border-b border-gray-50 pb-2">Other Filters</h3>
                            <FilterSidebar
                              categories={categories}
                              brands={brands}
                              selectedCategories={selectedCategories}
                              selectedBrands={selectedBrands}
                              onCategoryChange={handleCategoryChange}
                              onBrandChange={handleBrandChange}
                              onClearFilters={handleClearFilters}
                            />
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>

                    {/* Sort */}
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="flex-1 md:w-48 h-11 border-gray-200 bg-white text-gray-700">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="price-low">
                          Price: Low to High
                        </SelectItem>
                        <SelectItem value="price-high">
                          Price: High to Low
                        </SelectItem>
                        <SelectItem value="name-asc">Name: A to Z</SelectItem>
                        <SelectItem value="name-desc">Name: Z to A</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Desktop View Toggle */}
                    <div className="hidden md:flex bg-gray-100 rounded-lg p-1 gap-1 h-11 items-center">
                      <button
                        onClick={() => setView("grid")}
                        className={`p-1.5 rounded-md transition-colors ${view === "grid"
                          ? "bg-white shadow-sm text-gray-900"
                          : "text-gray-500 hover:text-gray-900"
                          }`}
                      >
                        <Grid3X3 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setView("list")}
                        className={`p-1.5 rounded-md transition-colors ${view === "list"
                          ? "bg-white shadow-sm text-gray-900"
                          : "text-gray-500 hover:text-gray-900"
                          }`}
                      >
                        <LayoutList className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Active Filters */}
                {activeFilterCount > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-50">
                    {selectedBrands.map((id) => {
                      const brand = brands.find((b) => b._id === id);
                      return brand ? (
                        <Badge
                          key={id}
                          variant="secondary"
                          className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border-none px-3 py-1"
                        >
                          {brand.name}
                          <button onClick={() => handleBrandChange(id)}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ) : null;
                    })}
                    {selectedCategories.map((id) => {
                      const cat = categories.find((c) => c._id === id);
                      return cat ? (
                        <Badge
                          key={id}
                          variant="secondary"
                          className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border-none px-3 py-1"
                        >
                          {cat.name}
                          <button onClick={() => handleCategoryChange(id)}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ) : null;
                    })}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFilters}
                      className="text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-2 h-7 text-xs font-bold"
                    >
                      Clear All
                    </Button>
                  </div>
                )}
              </div>

              {/* Results Count and View Controls */}
              <div className="flex items-center justify-between mb-6 px-1">
                <p className="text-sm text-gray-500 font-medium">
                  Showing <span className="text-gray-900">{(currentPage - 1) * productsPerPage + 1}-{Math.min(currentPage * productsPerPage, totalProducts)}</span> of <span className="text-gray-900">{totalProducts}</span> products
                </p>
              </div>

              {/* Products Grid/List */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
                </div>
              ) : products.length === 0 ? (
                <div className="bg-white rounded-xl shadow-card p-12 text-center">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-xl text-gray-900 mb-2">
                    No Products Found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search or filter criteria.
                  </p>
                  <Button onClick={handleClearFilters}>Clear Filters</Button>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={view}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={
                      view === "grid"
                        ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6"
                        : "space-y-4"
                    }
                  >
                    {products.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        view={view}
                        size="compact"
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Infinite Scroll Trigger */}
              {hasMore && !loading && products.length > 0 && (
                <div ref={loadMoreRef} className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 text-primary-600 animate-spin" />
                </div>
              )}

              {/* End of Results */}
              {!hasMore && products.length > 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">
                  You've reached the end of the results
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ProductsPageContent() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-40">
          <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
