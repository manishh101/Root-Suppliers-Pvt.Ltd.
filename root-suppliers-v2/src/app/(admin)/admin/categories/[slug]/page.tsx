'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: string | { _id: string; name: string };
  featured: boolean;
  isActive: boolean;
  order: number;
  metaTitle?: string;
  metaDescription?: string;
  level?: number;
}

export default function EditCategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [currentCategoryId, setCurrentCategoryId] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    parent: '',
    featured: false,
    isActive: true,
    order: 0,
    metaTitle: '',
    metaDescription: ''
  });

  useEffect(() => {
    Promise.all([
      fetchCategory(),
      fetchParentCategories()
    ]);
  }, [slug]);

  const fetchCategory = async () => {
    try {
      const response = await fetch(`/api/categories/${slug}`);
      const data = await response.json();

      if (data.success && data.category) {
        const category = data.category;
        setCurrentCategoryId(category._id);
        setFormData({
          name: category.name || '',
          description: category.description || '',
          image: category.image || '',
          parent: category.parent || '',
          featured: category.featured || false,
          isActive: category.isActive !== false,
          order: category.order || 0,
          metaTitle: category.metaTitle || '',
          metaDescription: category.metaDescription || ''
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

  const fetchParentCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setParentCategories(data.categories || []);
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
        setFormData(prev => ({ ...prev, image: data.url }));
      }
    } catch (err) {
      console.error('Error uploading image:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/categories/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to update category');
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
    let current = parentCategories.find(c => c._id === parentId);
    while (current) {
      paths.unshift(current.name);
      const parentRef = typeof current.parent === 'object' ? current.parent?._id : current.parent;
      current = parentRef ? parentCategories.find(c => c._id === parentRef) : undefined;
    }
    return paths.join(" → ");
  };

  // Filter out current category and its descendants from parent options
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

  const excludeIds = getDescendantIds(currentCategoryId, parentCategories);
  const filteredCategories = parentCategories.filter(cat => !excludeIds.includes(cat._id));
  const availableParentCategories = buildCategoryTree(filteredCategories);

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
        <Link href="/admin/categories" className="text-cardinal-red hover:underline">
          Back to Categories
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

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    placeholder="Describe this category"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red resize-none"
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
                    value={formData.parent}
                    onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red"
                  >
                    <option value="">None (Top Level)</option>
                    {availableParentCategories.map(cat => (
                      <option key={cat._id} value={cat._id}>
                        {cat.level && cat.level > 0
                          ? `${"─".repeat(cat.level)} ${cat.name}`
                          : cat.name
                        }
                        {cat.level === 1 ? " (Subcategory)" : ""}
                        {(cat.level || 0) >= 2 ? " (Sub-subcategory)" : ""}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Leave empty for top-level category. Select parent for subcategory.
                  </p>
                  {formData.parent && (
                    <div className="mt-2 p-2 bg-blue-50 rounded-lg text-sm text-blue-700 flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      Category path: {getParentPath(formData.parent)} → <span className="font-medium">{formData.name || 'This Category'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Category Image</h2>

              <div className="flex items-start gap-6">
                {formData.image ? (
                  <div className="relative">
                    <img
                      src={formData.image}
                      alt="Category"
                      className="w-40 h-40 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: '' })}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
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
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                )}

                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">
                    Upload a category image to display on the website.
                  </p>
                  <p className="text-xs text-gray-500">
                    Recommended: 400x400px, JPG or PNG format
                  </p>
                </div>
              </div>
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
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    placeholder="SEO title (defaults to category name)"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    placeholder="SEO description for search engines"
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
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-cardinal-red focus:ring-cardinal-red rounded"
                  />
                  <span className="text-sm text-gray-700">Active (visible on website)</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-cardinal-red focus:ring-cardinal-red rounded"
                  />
                  <span className="text-sm text-gray-700">Featured category</span>
                </label>
              </div>
            </div>

            {/* Display Order */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Display Order</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                  min="0"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red"
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
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
                  Update Category
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
