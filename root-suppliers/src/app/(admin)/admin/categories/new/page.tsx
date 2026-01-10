"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, Loader2, Upload, X, FolderTree, ChevronRight, Folder } from "lucide-react";
import { categorySchema, type CategoryFormData } from "@/lib/validations";


interface Category {
  _id: string;
  name: string;
  slug: string;
  parent?: string | { _id: string; name: string };
  level?: number;
}

export default function NewCategoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parentFromUrl = searchParams.get("parent");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedParent, setSelectedParent] = useState<string>(parentFromUrl || "");
  const [parentCategory, setParentCategory] = useState<Category | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      parent: "",
      order: 0,
      isActive: true,
      isFeatured: false,
      metaTitle: "",
      metaDescription: "",
    },
  });

  // Fetch existing categories for parent selection
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        if (data.success) {
          const rawCategories = data.categories || [];
          // Build hierarchical list with levels
          const categoriesWithLevels = buildCategoryTree(rawCategories);
          setCategories(categoriesWithLevels);

          // If parent is from URL, find and set it
          if (parentFromUrl) {
            const parent = rawCategories.find((c: Category) => c._id === parentFromUrl);
            if (parent) {
              setParentCategory(parent);
              setSelectedParent(parentFromUrl);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, [parentFromUrl]);

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

  // Get parent category path for display
  const getParentPath = (parentId: string): string => {
    const paths: string[] = [];
    let current = categories.find(c => c._id === parentId);
    while (current) {
      paths.unshift(current.name);
      const parentRef = typeof current.parent === 'object' ? current.parent?._id : current.parent;
      current = parentRef ? categories.find(c => c._id === parentRef) : undefined;
    }
    return paths.join(" → ");
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "root-suppliers/categories");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      const imageData = {
        url: data.url,
        publicId: data.publicId,
      };
      setImage(data.url); // Keep for local preview
      setValue("image", imageData);
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const watchedImage = watch("image");

  // Submit form
  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    setError(null);

    // Generate slug if empty
    if (!data.slug) {
      data.slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.message || "Failed to create category");
        return;
      }

      router.push("/admin/categories");
    } catch (err: any) {
      console.error("Submit failed:", err);
      setError(err.message || "Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/categories"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {parentCategory ? (
              <>Add {parentCategory.level === 0 ? "Subcategory" : "Sub-subcategory"}</>
            ) : (
              "New Main Category"
            )}
          </h1>
          <p className="text-gray-600">
            {parentCategory ? (
              <span className="flex items-center gap-1">
                <Folder className="w-4 h-4 text-amber-500" />
                Adding under: <strong className="text-gray-800">{parentCategory.name}</strong>
              </span>
            ) : (
              "Create a new top-level category"
            )}
          </p>
        </div>
      </div>

      {/* Parent Info Banner */}
      {parentCategory && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Folder className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-sm text-amber-800">
                You are creating a <strong>{parentCategory.level === 0 ? "subcategory" : "sub-subcategory"}</strong> under <strong>"{parentCategory.name}"</strong>
              </p>
              <p className="text-xs text-amber-600 mt-1">
                This category will appear nested under its parent in the category tree.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedParent("");
                setParentCategory(null);
                router.replace("/admin/categories/new");
              }}
              className="ml-auto text-sm text-amber-700 hover:text-amber-900 underline"
            >
              Create main category instead
            </button>
          </div>
        </div>
      )}

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
              <h2 className="text-lg font-semibold text-gray-900">Category Details</h2>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter category name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Brief category description"
                />
              </div>

              {/* Parent Category */}
              {!parentFromUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-2">
                      <FolderTree className="w-4 h-4" />
                      Parent Category
                    </span>
                  </label>
                  <select
                    {...register("parent")}
                    onChange={(e) => {
                      setValue("parent", e.target.value);
                      const parent = categories.find(c => c._id === e.target.value);
                      setParentCategory(parent || null);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                  >
                    <option value="">None (Create Main Category)</option>
                    {categories
                      .filter(cat => (cat.level || 0) < 2) // Only show Main and Subcategories as parent options
                      .map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.level && cat.level > 0
                            ? `└─ ${cat.name} (creates sub-subcategory)`
                            : `${cat.name} (creates subcategory)`
                          }
                        </option>
                      ))
                    }
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Select a parent to create a subcategory, or leave empty for a main category.
                  </p>
                </div>
              )}

              {/* Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  {...register("order", { valueAsNumber: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0"
                  min="0"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Lower numbers appear first
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Category Image</h2>

              <div className="flex items-start gap-6">
                {/* Image Preview */}
                <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {image ? (
                    <img
                      src={image}
                      alt="Category"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FolderTree className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Upload Controls */}
                <div className="flex-1">
                  <label
                    className={`inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${isUploading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        Upload Image
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>

                  {image && (
                    <button
                      type="button"
                      onClick={() => setImage(null)}
                      className="ml-2 inline-flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Remove
                    </button>
                  )}

                  <p className="mt-2 text-sm text-gray-500">
                    Recommended size: 400x400px. Max file size: 2MB.
                  </p>
                </div>
              </div>
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
                  placeholder="SEO title (defaults to category name)"
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

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("isActive")}
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-gray-700">Active (visible on site)</span>
              </label>

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
                    Save Category
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
