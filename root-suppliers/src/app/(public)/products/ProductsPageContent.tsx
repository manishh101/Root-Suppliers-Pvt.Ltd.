"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Image from "next/image";
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
  priceRange,
  maxPrice,
  onCategoryChange,
  onBrandChange,
  onPriceChange,
  onClearFilters,
}: {
  categories: Category[];
  brands: Brand[];
  selectedCategories: string[];
  selectedBrands: string[];
  priceRange: [number, number];
  maxPrice: number;
  onCategoryChange: (id: string) => void;
  onBrandChange: (id: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onClearFilters: () => void;
}) {
  const hasFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < maxPrice;

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
          <span className="text-[10px] text-gray-400 font-normal uppercase tracking-wider">{brands.length} Available</span>
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

      {/* Price Range */}
      <div className="pt-4 border-t border-gray-50">
        <h4 className="font-bold text-gray-900 mb-6">Price Range</h4>
        <div className="px-2">
          <Slider
            value={priceRange}
            min={0}
            max={maxPrice}
            step={100}
            onValueChange={(value) => onPriceChange(value as [number, number])}
            className="mb-6"
          />
          <div className="flex items-center justify-between">
            <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100 flex-1 mr-2">
              <span className="text-[10px] text-gray-400 block uppercase font-bold">Min</span>
              <span className="text-sm font-bold text-gray-900">NPR {priceRange[0].toLocaleString()}</span>
            </div>
            <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100 flex-1">
              <span className="text-[10px] text-gray-400 block uppercase font-bold">Max</span>
              <span className="text-sm font-bold text-gray-900">NPR {priceRange[1].toLocaleString()}</span>
            </div>
          </div>
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
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 12;
  const maxPrice = 100000;

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
      if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
      if (priceRange[1] < maxPrice)
        params.set("maxPrice", priceRange[1].toString());

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
        setProducts(data.products || []);
        setTotalProducts(data.pagination?.total || 0);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, selectedCategories, selectedBrands, priceRange, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategories, selectedBrands, priceRange, sortBy]);

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
    setPriceRange([0, maxPrice]);
    setSortBy("newest");
  };

  const activeFilterCount =
    selectedCategories.length +
    selectedBrands.length +
    (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-white border-b border-gray-100/50 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(239,68,68,0.04),transparent_50%)]" />

        <div className="container-main relative z-10 py-16 md:py-20 text-center md:text-left">
          <div className="max-w-4xl">
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-500 mb-6 font-medium">
              <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-900">Products</span>
            </nav>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Our Collection</h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto md:mx-0">
              Explore over 1000+ quality construction materials, hardware, and electrical supplies from trusted brands.
            </p>
          </div>
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
                    priceRange={priceRange}
                    maxPrice={maxPrice}
                    onCategoryChange={handleCategoryChange}
                    onBrandChange={handleBrandChange}
                    onPriceChange={setPriceRange}
                    onClearFilters={handleClearFilters}
                  />
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-9">
              {/* Toolbar */}
              <div className="bg-white rounded-xl shadow-card p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  {/* Search */}
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>



                  <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                    {/* Mobile Filter Button */}
                    <Sheet
                      open={mobileFilterOpen}
                      onOpenChange={setMobileFilterOpen}
                    >
                      <SheetTrigger asChild>
                        <Button
                          variant="outline"
                          className="lg:hidden flex-1 md:flex-none relative h-10"
                        >
                          <Filter className="h-4 w-4 mr-2" />
                          Filters
                          {activeFilterCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                              {activeFilterCount}
                            </span>
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
                              priceRange={priceRange}
                              maxPrice={maxPrice}
                              onCategoryChange={handleCategoryChange}
                              onBrandChange={handleBrandChange}
                              onPriceChange={setPriceRange}
                              onClearFilters={handleClearFilters}
                            />
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>

                    {/* Sort */}
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="flex-1 md:w-44 h-10">
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

                    {/* View Toggle */}
                    <div className="hidden md:flex bg-gray-100 rounded-lg p-1 gap-1">
                      <button
                        onClick={() => setView("grid")}
                        className={`p-1.5 rounded-md transition-colors ${view === "grid"
                          ? "bg-white shadow-sm text-gray-900"
                          : "text-gray-500 hover:text-gray-900"
                          }`}
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setView("list")}
                        className={`p-1.5 rounded-md transition-colors ${view === "list"
                          ? "bg-white shadow-sm text-gray-900"
                          : "text-gray-500 hover:text-gray-900"
                          }`}
                      >
                        <LayoutList className="h-4 w-4" />
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
              <div className="flex items-center justify-between mb-6 px-1 text-sm text-gray-500">
                <div>
                  Showing <span className="font-bold text-gray-900">{(currentPage - 1) * productsPerPage + 1} - {Math.min(currentPage * productsPerPage, totalProducts)}</span> of <span className="font-bold text-gray-900">{totalProducts}</span> products
                </div>
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
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                        : "space-y-4"
                    }
                  >
                    {products.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        view={view}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let page: number;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "primary" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
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
