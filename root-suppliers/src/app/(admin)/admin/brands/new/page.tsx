'use client';

import { useState } from 'react';
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

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { brandSchema, type BrandFormData } from '@/lib/validations';

export default function NewBrandPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      website: '',
      logo: { url: '', publicId: '' },
      isActive: true,
      isFeatured: false,
      order: 0,
    },
  });

  const logo = watch('logo');
  const isActive = watch('isActive');
  const isFeatured = watch('isFeatured');

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
        setValue('logo', {
          url: data.url,
          publicId: data.publicId
        });
      }
    } catch (err) {
      console.error('Error uploading image:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (data: BrandFormData) => {
    setSaving(true);
    setError('');

    // Generate slug from name if not provided
    if (!data.slug) {
      data.slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }

    try {
      const response = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.message || 'Failed to create brand');
        return;
      }

      router.push('/admin/brands');
    } catch (err) {
      console.error('Error creating brand:', err);
      setError('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Add New Brand</h1>
            <p className="text-gray-600 mt-1">Create a new brand for your products</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
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
                  {...register('name')}
                  placeholder="e.g., Bosch"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red ${errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug (Optional)
                </label>
                <input
                  type="text"
                  {...register('slug')}
                  placeholder="e.g., bosch"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate from name</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  placeholder="Brief description of the brand"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL
                </label>
                <input
                  type="text"
                  {...register('website')}
                  placeholder="https://www.example.com"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red ${errors.website ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.website && (
                  <p className="mt-1 text-sm text-red-500">{errors.website.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Logo */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Brand Logo</h2>

            <div className="flex items-start gap-6">
              {logo?.url ? (
                <div className="relative">
                  <img
                    src={logo.url}
                    alt="Brand Logo"
                    className="w-32 h-32 object-contain rounded-lg border bg-white p-2"
                  />
                  <button
                    type="button"
                    onClick={() => setValue('logo', { url: '', publicId: '' })}
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
                    {...register('isActive')}
                    className="w-4 h-4 text-cardinal-red focus:ring-cardinal-red rounded"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('isFeatured')}
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
                  {...register('order', { valueAsNumber: true })}
                  min="0"
                  className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red"
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
              </div>
            </div>
          </div>

          {/* SEO Settings */}
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
                placeholder="SEO title (defaults to brand name)"
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
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Create Brand
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
