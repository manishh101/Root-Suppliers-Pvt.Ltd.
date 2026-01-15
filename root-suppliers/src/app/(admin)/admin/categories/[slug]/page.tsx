'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Loader2,
  Image as ImageIcon,
  FolderTree,
  ChevronRight
} from 'lucide-react';
import { CloudinaryImage } from '@/components/ui/CloudinaryImage';
import { categorySchema, type CategoryFormData } from '@/lib/validations';

interface Category {
  _id: string;
  name: string;
  slug: string;
  parent?: string | { _id: string; name: string };
  level?: number;
}

export default function EditCategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [currentCategoryId, setCurrentCategoryId] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      parent: '',
      isActive: true,
      isFeatured: false,
      order: 0,
      metaTitle: '',
      metaDescription: '',
      image: null,
    },
  });

  const watchedName = watch("name");
  const watchedSlug = watch("slug");
  const watchedImage = watch("image");
  const watchedParent = watch("parent");

  useEffect(() => {
    const initData = async () => {
      await Promise.all([fetchCategory(), fetchAllCategories()]);
    };
    initData();
  }, [slug]);

  // Real-time slug generation
  useEffect(() => {
    if (watchedName && !watchedSlug) {
      setValue("slug", watchedName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-*|-*$/g, ""));
    }
  }, [watchedName, watchedSlug, setValue]);

  const fetchCategory = async () => {
    try {
      const response = await fetch(`/api/categories/${slug}`);
      const data = await response.json();

      if (data.success && data.category) {
        const category = data.category;
        setCurrentCategoryId(category._id);
        reset({
          name: category.name || '',
          slug: category.slug || '',
          description: category.description || '',
          parent: typeof category.parent === 'object' ? category.parent?._id : category.parent || '',
          isActive: category.isActive !== false,
          isFeatured: category.isFeatured || false,
          order: category.order || category.orderIndex || 0,
          metaTitle: category.meta?.title || '',
          metaDescription: category.meta?.description || '',
          image: category.image || null,
        });
      } else {
        setError('Category not found');
      }
    } catch (err) {
      console.error('Error fetching category:', err);
      setError('Failed to load category');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setAllCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('folder', 'categories');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      });

      const data = await response.json();
      if (data.success) {
        setValue("image", {
          url: data.url,
          publicId: data.publicId,
          alt: watchedName || 'Category Image'
        });
      }
    } catch (err) {
      console.error('Error uploading image:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const onFormSubmit = async (data: CategoryFormData) => {
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/categories/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const resData = await response.json();

      if (!response.ok) {
        setError(resData.error || 'Failed to update category');
        return;
      }

      router.push('/admin/categories');
    } catch (err) {
      console.error('Error updating category:', err);
      setError('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  // Tree building logic
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
    let current = allCategories.find(c => c._id === parentId);
    while (current) {
      paths.unshift(current.name);
      const parentRef = typeof current.parent === 'object' ? current.parent?._id : current.parent;
      current = parentRef ? allCategories.find(c => c._id === parentRef) : undefined;
    }
    return paths.join(" → ");
  };

  const getDescendantIds = (catId: string, cats: Category[]): string[] => {
    const ids: string[] = [catId];
    const children = cats.filter(cat => {
      const parentRef = typeof cat.parent === 'object' ? cat.parent?._id : cat.parent;
      return parentRef === catId;
    });
    for (const child of children) {
      ids.push(...getDescendantIds(child._id, cats));
    }
    return ids;
  };

  const excludeIds = getDescendantIds(currentCategoryId, allCategories);
  const filteredCategories = allCategories.filter(cat => !excludeIds.includes(cat._id));
  const availableParentCategories = buildCategoryTree(filteredCategories);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-cardinal-red border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/categories"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
            <p className="text-gray-600 mt-1">Update category information</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onFormSubmit)} className="max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  {...register("name")}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red ${errors.name ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL) *</label>
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">/category/</span>
                  <input
                    type="text"
                    {...register("slug")}
                    className={`flex-1 px-4 py-2 border rounded-r-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red ${errors.slug ? "border-red-500" : "border-gray-300"}`}
                  />
                </div>
                {errors.slug && <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  {...register("description")}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-2">
                    <FolderTree className="w-4 h-4" />
                    Parent Category
                  </span>
                </label>
                <select
                  {...register("parent")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red"
                >
                  <option value="">None (Top Level)</option>
                  {availableParentCategories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.level && cat.level > 0 ? `${"─".repeat(cat.level)} ${cat.name}` : cat.name}
                      {cat.level === 1 ? " (Subcategory)" : ""}
                      {(cat.level || 0) >= 2 ? " (Sub-subcategory)" : ""}
                    </option>
                  ))}
                </select>
                {watchedParent && (
                  <div className="mt-2 p-2 bg-blue-50 rounded-lg text-sm text-blue-700 flex items-center gap-2">
                    <ChevronRight className="w-4 h-4" />
                    Category path: {getParentPath(watchedParent)} → <span className="font-medium">{watchedName || 'This Category'}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Category Image</h2>
              <div className="flex items-start gap-6">
                {watchedImage ? (
                  <div className="relative w-40 h-40 rounded-lg border overflow-hidden">
                    <CloudinaryImage
                      src={watchedImage.url}
                      alt="Category"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setValue("image", null)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-cardinal-red hover:bg-cardinal-red/5 transition-colors">
                    {uploadingImage ? (
                      <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Upload Image</span>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                  </label>
                )}
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">Upload a category image to display on the website.</p>
                  <p className="text-xs text-gray-500">Recommended: 400x400px, JPG or PNG format</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO Metadata</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                  <input
                    type="text"
                    {...register("metaTitle")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red"
                    placeholder="SEO title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                  <textarea
                    {...register("metaDescription")}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red resize-none"
                    placeholder="SEO description"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Status & Visibility</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" {...register("isActive")} className="w-4 h-4 text-cardinal-red rounded border-gray-300 focus:ring-cardinal-red" />
                  <span className="text-sm text-gray-700">Active (Visible)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" {...register("isFeatured")} className="w-4 h-4 text-cardinal-red rounded border-gray-300 focus:ring-cardinal-red" />
                  <span className="text-sm text-gray-700">Featured</span>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Display Order</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input
                  type="number"
                  {...register("order", { valueAsNumber: true })}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
              </div>
            </div>

            {Object.keys(errors).length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                Please fix the validation errors before updating.
                <ul className="list-disc list-inside mt-1 font-medium">
                  {Object.entries(errors).map(([key, err]) => (
                    <li key={key}>{(err as any).message || key}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-cardinal-red text-white rounded-lg hover:bg-cardinal-red/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : <><Save className="w-5 h-5" /> Update Category</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
