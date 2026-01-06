"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  Trash2,
  Upload,
  X,
  Package,
  GripVertical,
} from "lucide-react";

// Validation schema
const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().optional(),
  category: z.string().min(1, "Please select a category"),
  brand: z.string().optional(),
  sku: z.string().optional(),
  price: z.number().min(0, "Price must be positive").optional(),
  compareAtPrice: z.number().optional(),
  specifications: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
    })
  ),
  features: z.array(z.string()),
  tags: z.array(z.string()),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

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

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  interface ProductImage {
    url: string;
    publicId: string;
    alt?: string;
  }

  const [images, setImages] = useState<ProductImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [featureInput, setFeatureInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  // Build category tree with levels for display
  const buildCategoryTree = (cats: Category[], parentId: string | null = null, level: number = 0): Category[] => {
    const result: Category[] = [];
    const children = cats.filter(cat => {
      const catParent = typeof cat.parent === 'object' ? cat.parent?._id : cat.parent;
      return catParent === parentId || (!catParent && !parentId);
    });

    for (const child of children) {
      result.push({ ...child, level });
      const grandchildren = buildCategoryTree(cats, child._id, level + 1);
      result.push(...grandchildren);
    }
    return result;
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      shortDescription: "",
      category: "",
      brand: "",
      sku: "",
      price: undefined,
      compareAtPrice: undefined,
      specifications: [],
      features: [],
      tags: [],
      isActive: true,
      isFeatured: false,
      metaTitle: "",
      metaDescription: "",
    },
  });

  const {
    fields: specFields,
    append: appendSpec,
    remove: removeSpec,
  } = useFieldArray({
    control,
    name: "specifications",
  });

  const watchedFeatures = watch("features");
  const watchedTags = watch("tags");

  // Fetch categories and brands
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          fetch("/api/categories?limit=100"),
          fetch("/api/brands?limit=100"),
        ]);

        const categoriesData = await categoriesRes.json();
        const brandsData = await brandsRes.json();

        if (categoriesData.success) {
          // Build hierarchical category tree
          const treeCategories = buildCategoryTree(categoriesData.categories);
          setCategories(treeCategories);
        }
        if (brandsData.success) {
          setBrands(brandsData.brands);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "root-suppliers/products");

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message);
        }

        return {
          url: data.url,
          publicId: data.publicId,
          alt: file.name.split('.')[0]
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...uploadedImages]);
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError(err.message || "Failed to upload images");
    } finally {
      setIsUploading(false);
      // Reset input value to allow uploading same file again
      e.target.value = "";
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Add feature
  const addFeature = () => {
    if (featureInput.trim()) {
      setValue("features", [...(watchedFeatures || []), featureInput.trim()]);
      setFeatureInput("");
    }
  };

  // Remove feature
  const removeFeature = (index: number) => {
    setValue(
      "features",
      (watchedFeatures || []).filter((_, i) => i !== index)
    );
  };

  // Add tag
  const addTag = () => {
    if (tagInput.trim() && !watchedTags?.includes(tagInput.trim())) {
      setValue("tags", [...(watchedTags || []), tagInput.trim()]);
      setTagInput("");
    }
  };

  // Remove tag
  const removeTag = (index: number) => {
    setValue(
      "tags",
      (watchedTags || []).filter((_, i) => i !== index)
    );
  };

  // Submit form
  const onSubmit = async (data: ProductFormData) => {
    if (images.length === 0) {
      setError("Please upload at least one product image");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          images, // Now sending array of {url, publicId, alt} objects
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.message || "Failed to create product");
        return;
      }

      router.push("/admin/products");
    } catch (err: any) {
      console.error("Submit failed:", err);
      setError(err.message || "Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper replacement to fix render loop
  // ... in return JSX ...
  // {images.map((image, index) => (
  //   <div key={index} ...>
  //      <img src={image.url} ... />
  //   </div>
  // ))}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">New Product</h1>
            <p className="text-gray-600">Create a new product</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  {...register("shortDescription")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Brief product description"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Description *
                </label>
                <textarea
                  {...register("description")}
                  rows={6}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.description ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Detailed product description"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Product Images</h2>

              {/* Image Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden border group"
                  >
                    <img
                      src={image.url}
                      alt={image.alt || `Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 px-2 py-1 bg-primary text-white text-xs rounded">
                        Primary
                      </span>
                    )}
                  </div>
                ))}

                {/* Upload Button */}
                <label
                  className={`aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors ${isUploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  {isUploading ? (
                    <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="mt-2 text-sm text-gray-500">Upload</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
              </div>

              <p className="text-sm text-gray-500">
                First image will be the primary product image. Recommended size: 800x800px
              </p>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Specifications</h2>
                <button
                  type="button"
                  onClick={() => appendSpec({ key: "", value: "" })}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Specification
                </button>
              </div>

              <div className="space-y-3">
                {specFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-3">
                    <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      {...register(`specifications.${index}.key` as const)}
                      placeholder="Name (e.g., Material)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="text"
                      {...register(`specifications.${index}.value` as const)}
                      placeholder="Value (e.g., Stainless Steel)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpec(index)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {specFields.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No specifications added yet
                  </p>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Features</h2>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                  placeholder="Add a feature"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Add
                </button>
              </div>

              <ul className="space-y-2">
                {watchedFeatures?.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg"
                  >
                    <span className="text-gray-700">{feature}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* SEO */}
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">SEO Settings</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  {...register("metaTitle")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="SEO title (defaults to product name)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  {...register("metaDescription")}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="SEO description (max 160 characters)"
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish */}
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Publish</h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("isActive")}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-gray-700">Active (visible on site)</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("isFeatured")}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-gray-700">Featured product</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Product
                  </>
                )}
              </button>
            </div>

            {/* Organization */}
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Organization</h2>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  {...register("category")}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white ${errors.category ? "border-red-500" : "border-gray-300"
                    }`}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.level === 0
                        ? cat.name
                        : cat.level === 1
                          ? `    └─ ${cat.name}`
                          : `        └─ ${cat.name}`
                      }
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Select the most specific category for your product
                </p>
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <select
                  {...register("brand")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  <option value="">Select brand</option>
                  {brands.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU
                </label>
                <input
                  type="text"
                  {...register("sku")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Stock keeping unit"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Pricing</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Compare at Price (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("compareAtPrice", { valueAsNumber: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0.00"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Original price for showing discount
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Tags</h2>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="Add a tag"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {watchedTags?.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
