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

// ProductCard component
function ProductCard({ product, view }: { product: Product; view: "grid" | "list" }) {
  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  if (view === "list") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-xl shadow-card overflow-hidden flex flex-col md:flex-row group hover:shadow-lg transition-shadow"
      >
        {/* Image */}
        <div className="relative w-full md:w-64 h-48 md:h-auto flex-shrink-0 bg-gray-100">
          <Image
            src={product.images?.[0]?.url || "/images/placeholder-product.jpg"}
            alt={product.images?.[0]?.alt || product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.isNew && (
            <Badge className="absolute top-3 left-3 bg-primary-600 text-white">
              New
            </Badge>
          )}
          {discount > 0 && (
            <Badge className="absolute top-3 right-3 bg-green-600 text-white">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <Link
                href={`/categories/${product.category?.slug}`}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                {product.category?.name}
              </Link>
              <h3 className="font-semibold text-lg text-gray-900 mt-1 group-hover:text-primary-600 transition-colors">
                <Link href={`/products/${product.slug}`}>{product.name}</Link>
              </h3>
            </div>
            <div className="text-right">
              {product.discountPrice ? (
                <>
                  <span className="text-xl font-bold text-primary-600">
                    NPR {product.discountPrice.toLocaleString()}
                  </span>
                  <span className="block text-sm text-gray-400 line-through">
                    NPR {product.price.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-gray-900">
                  NPR {product.price.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">
            {product.description}
          </p>

          <div className="flex items-center justify-between gap-4 mt-auto">
            <span className="text-sm text-gray-500">
              Brand:{" "}
              <Link
                href={`/brands/${product.brand?.slug}`}
                className="text-secondary-600 hover:text-secondary-700 font-medium"
              >
                {product.brand?.name}
              </Link>
            </span>
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              View Details
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white rounded-xl shadow-card overflow-hidden group hover:shadow-lg transition-shadow"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <Image
          src={product.images?.[0]?.url || "/images/placeholder-product.jpg"}
          alt={product.images?.[0]?.alt || product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.isNew && (
          <Badge className="absolute top-3 left-3 bg-primary-600 text-white">
            New
          </Badge>
        )}
        {discount > 0 && (
          <Badge className="absolute top-3 right-3 bg-green-600 text-white">
            -{discount}%
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <Link
          href={`/categories/${product.category?.slug}`}
          className="text-xs text-primary-600 hover:text-primary-700 font-medium"
        >
          {product.category?.name}
        </Link>
        <h3 className="font-semibold text-gray-900 mt-1 line-clamp-2 group-hover:text-primary-600 transition-colors min-h-[2.5rem]">
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>
        <div className="flex items-center justify-between mt-3">
          <div>
            {product.discountPrice ? (
              <>
                <span className="text-lg font-bold text-primary-600">
                  NPR {product.discountPrice.toLocaleString()}
                </span>
                <span className="block text-xs text-gray-400 line-through">
                  NPR {product.price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                NPR {product.price.toLocaleString()}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500">{product.brand?.name}</span>
        </div>
      </div>
    </motion.div>
  );
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

      {/* Categories */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Categories</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {categories.map((category) => (
            <label
              key={category._id}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <Checkbox
                checked={selectedCategories.includes(category._id)}
                onCheckedChange={() => onCategoryChange(category._id)}
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 flex-1">
                {category.name}
              </span>
              <span className="text-xs text-gray-400">
                ({category.productCount})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Brands</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands.map((brand) => (
            <label
              key={brand._id}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <Checkbox
                checked={selectedBrands.includes(brand._id)}
                onCheckedChange={() => onBrandChange(brand._id)}
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900">
                {brand.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Price Range</h4>
        <div className="px-2">
          <Slider
            value={priceRange}
            min={0}
            max={maxPrice}
            step={100}
            onValueChange={(value) => onPriceChange(value as [number, number])}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>NPR {priceRange[0].toLocaleString()}</span>
            <span>NPR {priceRange[1].toLocaleString()}</span>
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
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
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
          fetch("/api/categories?limit=50"),
          fetch("/api/brands?limit=50"),
        ]);

        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setCategories(data.categories || []);
        }

        if (brandsRes.ok) {
          const data = await brandsRes.json();
          setBrands(data.brands || []);
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
    <>
      {/* Hero Section */}
      <section className="relative py-16 lg:py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-secondary-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        </div>

        <div className="container-main relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary-600/20 text-primary-300 rounded-full text-sm font-medium mb-4">
              Our Products
            </span>
            <h1 className="font-primary font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-4">
              Browse Our Collection
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl">
              Explore over 1000+ quality construction materials, hardware, and
              electrical supplies from trusted brands.
            </p>
          </motion.div>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mt-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white">Products</span>
          </nav>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="container-main">
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-card p-6 sticky top-24">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-6">
                  <SlidersHorizontal className="h-5 w-5" />
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
            </aside>

            {/* Main Content */}
            <div className="flex-1">
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

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Mobile Filter Button */}
                    <Sheet
                      open={mobileFilterOpen}
                      onOpenChange={setMobileFilterOpen}
                    >
                      <SheetTrigger asChild>
                        <Button
                          variant="outline"
                          className="lg:hidden relative"
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
                      <SheetContent side="left" className="w-80">
                        <SheetHeader>
                          <SheetTitle>Filters</SheetTitle>
                        </SheetHeader>
                        <div className="mt-6">
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
                      </SheetContent>
                    </Sheet>

                    {/* Sort */}
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full md:w-44">
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
                    <div className="hidden md:flex items-center border rounded-lg overflow-hidden">
                      <button
                        onClick={() => setView("grid")}
                        className={`p-2 ${
                          view === "grid"
                            ? "bg-primary-600 text-white"
                            : "bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setView("list")}
                        className={`p-2 ${
                          view === "list"
                            ? "bg-primary-600 text-white"
                            : "bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <LayoutList className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Active Filters */}
                {activeFilterCount > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                    {selectedCategories.map((id) => {
                      const category = categories.find((c) => c._id === id);
                      return category ? (
                        <Badge
                          key={id}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {category.name}
                          <button onClick={() => handleCategoryChange(id)}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ) : null;
                    })}
                    {selectedBrands.map((id) => {
                      const brand = brands.find((b) => b._id === id);
                      return brand ? (
                        <Badge
                          key={id}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {brand.name}
                          <button onClick={() => handleBrandChange(id)}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}
              </div>

              {/* Results Count */}
              <p className="text-sm text-gray-600 mb-4">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * productsPerPage + 1} -{" "}
                  {Math.min(currentPage * productsPerPage, totalProducts)}
                </span>{" "}
                of <span className="font-medium">{totalProducts}</span> products
              </p>

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
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
    </>
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
