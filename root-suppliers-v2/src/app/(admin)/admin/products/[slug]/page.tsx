"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  parent?: string | { _id: string; name: string };
  level?: number;
}

interface Brand {
  _id: string;
  name: string;
  slug: string;
}

interface ProductVariant {
  name: string;
  sku: string;
  price: number;
  stock: number;
}

interface ProductSpecification {
  name: string;
  value: string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: string | Category;
  brand?: string | Brand;
  images: {
    url: string;
    publicId: string;
  }[];
  price: number;
  comparePrice?: number;
  sku?: string;
  stock: number;
  variants?: ProductVariant[];
  specifications?: ProductSpecification[];
  featured: boolean;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export default function EditProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    category: "",
    brand: "",
    images: [] as { url: string; publicId: string }[],
    price: 0,
    comparePrice: 0,
    sku: "",
    stock: 0,
    variants: [] as ProductVariant[],
    specifications: [] as ProductSpecification[],
    featured: false,
    isActive: true,
    metaTitle: "",
    metaDescription: "",
  });

  useEffect(() => {
    Promise.all([fetchProduct(), fetchCategories(), fetchBrands()]);
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${slug}`);
      const data = await response.json();

      if (data.success && data.product) {
        const product = data.product;
        setFormData({
          name: product.name || "",
          description: product.description || "",
          shortDescription: product.shortDescription || "",
          category:
            typeof product.category === "object"
              ? product.category._id
              : product.category || "",
          brand:
            typeof product.brand === "object"
              ? product.brand?._id
              : product.brand || "",
          images: product.images || [],
          price: product.price || 0,
          comparePrice: product.comparePrice || 0,
          sku: product.sku || "",
          stock: product.stock || 0,
          variants: product.variants || [],
          specifications: product.specifications || [],
          featured: product.featured || false,
          isActive: product.isActive !== false,
          metaTitle: product.metaTitle || "",
          metaDescription: product.metaDescription || "",
        });
      } else {
        setError("Product not found");
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  // Build category tree with levels for display
  const buildCategoryTree = (
    cats: Category[],
    parentId: string | null = null,
    level: number = 0
  ): Category[] => {
    const result: Category[] = [];
    const children = cats.filter((cat) => {
      const catParent =
        typeof cat.parent === "object" ? cat.parent?._id : cat.parent;
      return catParent === parentId || (!catParent && !parentId);
    });

    for (const child of children) {
      result.push({ ...child, level });
      const grandchildren = buildCategoryTree(cats, child._id, level + 1);
      result.push(...grandchildren);
    }
    return result;
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      if (data.success) {
        // Build hierarchical category tree
        const treeCategories = buildCategoryTree(data.categories || []);
        setCategories(treeCategories);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch("/api/brands");
      const data = await response.json();
      if (data.success) {
        setBrands(data.brands || []);
      }
    } catch (err) {
      console.error("Error fetching brands:", err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploadingImage(true);

    try {
      for (const file of Array.from(files)) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("folder", "products");

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });

        const data = await response.json();
        if (data.success) {
          setFormData((prev) => ({
            ...prev,
            images: [
              ...prev.images,
              { url: data.url, publicId: data.publicId },
            ],
          }));
        }
      }
    } catch (err) {
      console.error("Error uploading image:", err);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { name: "", sku: "", price: 0, stock: 0 }],
    }));
  };

  const updateVariant = (
    index: number,
    field: keyof ProductVariant,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) =>
        i === index ? { ...v, [field]: value } : v
      ),
    }));
  };

  const removeVariant = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { name: "", value: "" }],
    }));
  };

  const updateSpecification = (
    index: number,
    field: "name" | "value",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      ),
    }));
  };

  const removeSpecification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/products/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update product");
        return;
      }

      router.push("/admin/products");
    } catch (err) {
      console.error("Error updating product:", err);
      setError("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-cardinal-red border-t-transparent"></div>
      </div>
    );
  }

  if (error && !formData.name) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Link
          href="/admin/products"
          className="text-cardinal-red hover:underline"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-600 mt-1">Update product information</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Basic Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shortDescription: e.target.value,
                      })
                    }
                    placeholder="Brief product summary"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                    rows={6}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Images
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative aspect-square group">
                    <img
                      src={image.url}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 px-2 py-1 bg-cardinal-red text-white text-xs rounded">
                        Primary
                      </span>
                    )}
                  </div>
                ))}

                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-cardinal-red hover:bg-cardinal-red/5 transition-colors">
                  {uploadingImage ? (
                    <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Upload</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
              </div>
            </div>

            {/* Variants */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Variants
                </h2>
                <button
                  type="button"
                  onClick={addVariant}
                  className="text-sm text-cardinal-red hover:text-cardinal-red/80 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Variant
                </button>
              </div>

              {formData.variants.length === 0 ? (
                <p className="text-gray-500 text-sm">No variants added yet</p>
              ) : (
                <div className="space-y-4">
                  {formData.variants.map((variant, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-5 gap-3 items-end p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={variant.name}
                          onChange={(e) =>
                            updateVariant(index, "name", e.target.value)
                          }
                          placeholder="e.g., Red, Large"
                          className="w-full px-3 py-2 text-sm border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          SKU
                        </label>
                        <input
                          type="text"
                          value={variant.sku}
                          onChange={(e) =>
                            updateVariant(index, "sku", e.target.value)
                          }
                          className="w-full px-3 py-2 text-sm border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Price (₹)
                        </label>
                        <input
                          type="number"
                          value={variant.price}
                          onChange={(e) =>
                            updateVariant(index, "price", Number(e.target.value))
                          }
                          className="w-full px-3 py-2 text-sm border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Stock
                        </label>
                        <input
                          type="number"
                          value={variant.stock}
                          onChange={(e) =>
                            updateVariant(index, "stock", Number(e.target.value))
                          }
                          className="w-full px-3 py-2 text-sm border rounded-lg"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Specifications
                </h2>
                <button
                  type="button"
                  onClick={addSpecification}
                  className="text-sm text-cardinal-red hover:text-cardinal-red/80 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Specification
                </button>
              </div>

              {formData.specifications.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No specifications added yet
                </p>
              ) : (
                <div className="space-y-3">
                  {formData.specifications.map((spec, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-5 gap-3 items-end"
                    >
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={spec.name}
                          onChange={(e) =>
                            updateSpecification(index, "name", e.target.value)
                          }
                          placeholder="Specification name"
                          className="w-full px-3 py-2 text-sm border rounded-lg"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) =>
                            updateSpecification(index, "value", e.target.value)
                          }
                          placeholder="Value"
                          className="w-full px-3 py-2 text-sm border rounded-lg"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSpecification(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SEO */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, metaTitle: e.target.value })
                    }
                    placeholder="SEO title (defaults to product name)"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.metaDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        metaDescription: e.target.value,
                      })
                    }
                    placeholder="SEO description"
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Status
              </h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4 text-cardinal-red focus:ring-cardinal-red rounded"
                  />
                  <span className="text-sm text-gray-700">
                    Active (visible on website)
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="w-4 h-4 text-cardinal-red focus:ring-cardinal-red rounded"
                  />
                  <span className="text-sm text-gray-700">
                    Featured product
                  </span>
                </label>
              </div>
            </div>

            {/* Organization */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Organization
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.level === 0
                          ? cat.name
                          : cat.level === 1
                            ? `    └─ ${cat.name}`
                            : `        └─ ${cat.name}`}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Select the most specific category
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand
                  </label>
                  <select
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red"
                  >
                    <option value="">Select brand</option>
                    {brands.map((brand) => (
                      <option key={brand._id} value={brand._id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Pricing
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Compare at Price (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.comparePrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        comparePrice: Number(e.target.value),
                      })
                    }
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Original price for showing discounts
                  </p>
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Inventory
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    placeholder="Stock Keeping Unit"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock: Number(e.target.value),
                      })
                    }
                    min="0"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-cardinal-red text-white rounded-lg hover:bg-cardinal-red/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Update Product
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
