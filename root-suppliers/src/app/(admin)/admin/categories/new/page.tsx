"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Loader2, Upload, X, FolderTree, ChevronRight, Folder } from "lucide-react";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
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
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
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
      parent: parentFromUrl || "",
      order: 0,
      isActive: true,
      isFeatured: false,
      metaTitle: "",
      metaDescription: "",
      image: null,
    },
  });

  const watchedName = watch("name");
  const watchedSlug = watch("slug");
  const watchedImage = watch("image");
  const watchedParent = watch("parent");

  // Real-time slug generation
  useEffect(() => {
    if (watchedName && !watchedSlug) {
      setValue("slug", watchedName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-*|-*$/g, ""));
    }
  }, [watchedName, watchedSlug, setValue]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        if (data.success) {
          const rawCategories = data.categories || [];
          const treeCategories = buildCategoryTree(rawCategories);
          setCategories(treeCategories);

          if (parentFromUrl) {
            const parent = rawCategories.find((c: Category) => c._id === parentFromUrl);
            if (parent) setParentCategory(parent);
          }
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, [parentFromUrl]);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "categories");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      setValue("image", {
        url: data.url,
        publicId: data.publicId,
        alt: watchedName || 'Category Image'
      });
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit: SubmitHandler<CategoryFormData> = async (data) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      <div className="flex items-center gap-4">
        <Link href="/admin/categories" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {parentCategory ? `Add ${parentCategory.level === 0 ? "Subcategory" : "Sub-subcategory"}` : "New Main Category"}
          </h1>
          <p className="text-gray-600">
            {parentCategory ? (
              <span className="flex items-center gap-1"><Folder className="w-4 h-4 text-amber-500" /> Adding under: <strong className="text-gray-800">{parentCategory.name}</strong></span>
            ) : "Create a new top-level category"}
          </p>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Category Details</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
                <input type="text" {...register("name")} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red ${errors.name ? "border-red-500" : "border-gray-300"}`} placeholder="Enter category name" />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL) *</label>
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">/category/</span>
                  <input type="text" {...register("slug")} className={`flex-1 px-4 py-2 border rounded-r-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red ${errors.slug ? "border-red-500" : "border-gray-300"}`} placeholder="category-url-slug" />
                </div>
                {errors.slug && <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea {...register("description")} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none" placeholder="Brief category description" />
              </div>

              {!parentFromUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><FolderTree className="w-4 h-4" /> Parent Category</label>
                  <select {...register("parent")} onChange={(e) => {
                    setValue("parent", e.target.value);
                    const parent = categories.find(c => c._id === e.target.value);
                    setParentCategory(parent || null);
                  }} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white">
                    <option value="">None (Create Main Category)</option>
                    {categories.filter(cat => (cat.level || 0) < 2).map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.level && cat.level > 0 ? `└─ ${cat.name}` : cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {watchedParent && (
                <div className="p-2 bg-blue-50 rounded-lg text-sm text-blue-700 flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" /> Path: {getParentPath(watchedParent)} → {watchedName || '...'}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Category Image</h2>
              <div className="flex items-start gap-6">
                <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border flex-shrink-0 relative">
                  {watchedImage ? <CloudinaryImage src={watchedImage.url} alt="Category" fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center"><FolderTree className="w-12 h-12 text-gray-400" /></div>}
                </div>
                <div className="flex-1">
                  <label className={`inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${isUploading ? "opacity-50" : ""}`}>
                    {isUploading ? <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</> : <><Upload className="w-5 h-5" /> Upload Image</>}
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="hidden" />
                  </label>
                  {watchedImage && <button type="button" onClick={() => setValue("image", null)} className="ml-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm">Remove</button>}
                  <p className="mt-2 text-xs text-gray-500">Recommended: 400x400px. JPG/PNG.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">SEO Settings</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                <input type="text" {...register("metaTitle")} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="SEO title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                <textarea {...register("metaDescription")} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none" placeholder="SEO description" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Publish</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" {...register("isActive")} className="w-5 h-5 rounded border-gray-300 text-cardinal-red focus:ring-cardinal-red" />
                  <span className="text-gray-700">Active</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" {...register("isFeatured")} className="w-5 h-5 rounded border-gray-300 text-cardinal-red focus:ring-cardinal-red" />
                  <span className="text-gray-700">Featured</span>
                </label>
              </div>
              <div className="pt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Index</label>
                <input type="number" {...register("order", { valueAsNumber: true })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>

              {Object.keys(errors).length > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  Please fix errors:
                  <ul className="list-disc list-inside mt-1 font-medium">
                    {Object.entries(errors).map(([key, err]) => (<li key={key}>{(err as any).message || key}</li>))}
                  </ul>
                </div>
              )}

              <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cardinal-red text-white rounded-lg hover:bg-cardinal-red/90 disabled:opacity-50">
                {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : <><Save className="w-5 h-5" /> Save Category</>}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
