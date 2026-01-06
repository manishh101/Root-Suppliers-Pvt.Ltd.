'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';

interface Brand {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: {
    url: string;
    publicId: string;
  };
  website?: string;
  featured: boolean;
  isActive: boolean;
  order: number;
}

export default function EditBrandPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: { url: '', publicId: '' },
    website: '',
    featured: false,
    isActive: true,
    order: 0
  });

  useEffect(() => {
    fetchBrand();
  }, [slug]);

  const fetchBrand = async () => {
    try {
      const response = await fetch(`/api/brands/${slug}`);
      const data = await response.json();

      if (data.success && data.brand) {
        const brand = data.brand;
        setFormData({
          name: brand.name || '',
          description: brand.description || '',
          logo: brand.logo || { url: '', publicId: '' },
          website: brand.website || '',
          featured: brand.isFeatured || false,
          isActive: brand.isActive !== false,
          order: brand.orderIndex || 0
        });
      } else {
        setError('Brand not found');
      }
    } catch (err) {
      console.error('Error fetching brand:', err);
      setError('Failed to load brand');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('folder', 'brands');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      });

      const data = await response.json();
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          logo: {
            url: data.url,
            publicId: data.publicId
          }
        }));
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
      const response = await fetch(`/api/brands/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to update brand');
        return;
      }

      router.push('/admin/brands');
    } catch (err) {
      console.error('Error updating brand:', err);
      setError('An error occurred while saving');
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
        <Link href="/admin/brands" className="text-cardinal-red hover:underline">
          Back to Brands
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
            href="/admin/brands"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Brand</h1>
            <p className="text-gray-600 mt-1">Update brand information</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Brand Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand Name *
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
                  placeholder="Brief description of the brand"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://www.example.com"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red"
                />
              </div>
            </div>
          </div>

          {/* Logo */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Brand Logo</h2>

            <div className="flex items-start gap-6">
              {formData.logo.url ? (
                <div className="relative">
                  <img
                    src={formData.logo.url}
                    alt="Brand Logo"
                    className="w-32 h-32 object-contain rounded-lg border bg-white p-2"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, logo: { url: '', publicId: '' } })}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-cardinal-red hover:bg-cardinal-red/5 transition-colors">
                  {uploadingImage ? (
                    <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-xs text-gray-500">Upload Logo</span>
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
                  Upload the brand logo to display on the website.
                </p>
                <p className="text-xs text-gray-500">
                  Recommended: 200x200px, PNG with transparent background
                </p>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>

            <div className="space-y-4">
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-cardinal-red focus:ring-cardinal-red rounded"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-cardinal-red focus:ring-cardinal-red rounded"
                  />
                  <span className="text-sm text-gray-700">Featured</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                  min="0"
                  className="w-32 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red"
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Link
              href="/admin/brands"
              className="flex-1 py-3 text-center border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-cardinal-red text-white rounded-lg hover:bg-cardinal-red/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Update Brand
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
