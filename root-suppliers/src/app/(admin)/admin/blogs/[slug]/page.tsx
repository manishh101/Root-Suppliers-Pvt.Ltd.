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
  Plus,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { blogSchema, type BlogFormData } from '@/lib/validations';

// Dynamically import RichTextEditor to prevent SSR issues with Quill
const RichTextEditor = dynamic(
  () => import("@/components/editor/RichTextEditor"),
  {
    ssr: false,
    loading: () => <div className="flex h-64 w-full items-center justify-center bg-gray-50 rounded-lg"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>,
  }
);

export default function EditBlogPage({ params }: { params: { slug: string } }) {
  const { slug: originalSlug } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [authorName, setAuthorName] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      isActive: true,
      metaTitle: '',
      metaDescription: '',
      tags: [],
      featuredImage: null,
      author: '',
    },
  });

  const watchedTitle = watch("title");
  const watchedSlug = watch("slug");
  const watchedTags = watch("tags");
  const watchedImage = watch("featuredImage");

  useEffect(() => {
    fetchBlog();
  }, [originalSlug]);

  // Real-time slug generation
  useEffect(() => {
    if (watchedTitle && !watchedSlug) {
      setValue("slug", watchedTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-*|-*$/g, ""));
    }
  }, [watchedTitle, watchedSlug, setValue]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/blogs/${originalSlug}`);
      const data = await response.json();

      if (data.success && data.blog) {
        const blog = data.blog;
        const authorId = typeof blog.author === 'object' ? blog.author._id : blog.author;
        setAuthorName(typeof blog.author === 'object' ? blog.author.name : 'Unknown');

        reset({
          title: blog.title || '',
          slug: blog.slug || '',
          excerpt: blog.excerpt || '',
          content: blog.content || '',
          isActive: blog.isPublished || blog.status === 'published' || blog.isActive !== false,
          metaTitle: blog.meta?.title || '',
          metaDescription: blog.meta?.description || '',
          tags: blog.tags || [],
          featuredImage: blog.featuredImage || null,
          author: authorId || '',
        });
      } else {
        setError('Blog post not found');
      }
    } catch (err) {
      console.error('Error fetching blog:', err);
      setError('Failed to load blog post');
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
      formDataUpload.append('folder', 'blogs');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      });

      const data = await response.json();
      if (data.success) {
        setValue("featuredImage", {
          url: data.url,
          publicId: data.publicId,
        });
      }
    } catch (err) {
      console.error('Error uploading image:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !watchedTags?.includes(tagInput.trim())) {
      setValue("tags", [...(watchedTags || []), tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setValue("tags", (watchedTags || []).filter((_, i) => i !== index));
  };

  const onFormSubmit = async (data: BlogFormData) => {
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/blogs/${originalSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const resData = await response.json();

      if (!response.ok) {
        setError(resData.error || 'Failed to update blog post');
        return;
      }

      router.push('/admin/blogs');
    } catch (err) {
      console.error('Error updating blog:', err);
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blogs"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Blog Post</h1>
            <p className="text-gray-600 mt-1">Update blog post content</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Content</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  {...register("title")}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red ${errors.title ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL) *</label>
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">/blog/</span>
                  <input
                    type="text"
                    {...register("slug")}
                    className={`flex-1 px-4 py-2 border rounded-r-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red ${errors.slug ? "border-red-500" : "border-gray-300"}`}
                  />
                </div>
                {errors.slug && <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt *</label>
                <textarea
                  {...register("excerpt")}
                  rows={3}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red resize-none ${errors.excerpt ? "border-red-500" : ""}`}
                />
                {errors.excerpt && <p className="mt-1 text-sm text-red-500">{errors.excerpt.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                <RichTextEditor
                  value={watch("content") || ""}
                  onChange={(value) => setValue("content", value, { shouldValidate: true })}
                />
                {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Featured Image</h2>
              <div className="flex items-start gap-6">
                {watchedImage ? (
                  <div className="relative">
                    <img
                      src={watchedImage.url}
                      alt="Featured"
                      className="w-64 h-40 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => setValue("featuredImage", null)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="w-64 h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-cardinal-red hover:bg-cardinal-red/5 transition-colors">
                    {uploadingImage ? (
                      <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Upload Featured Image</span>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                  </label>
                )}
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">Recommended: 1200x630px, JPG or PNG format</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO Metadata</h2>
              <div className="space-y-4">
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
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Publish</h2>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" {...register("isActive")} className="w-4 h-4 text-cardinal-red rounded border-gray-300 focus:ring-cardinal-red" />
                <span className="text-sm text-gray-700">Published</span>
              </label>
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
                {saving ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : <><Save className="w-5 h-5" /> Update Post</>}
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Author</h2>
              <input type="text" value={authorName} readOnly className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Tags</h2>
              <div className="flex gap-2">
                <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add a tag" className="flex-1 px-3 py-2 border rounded-lg text-sm" onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} />
                <button type="button" onClick={addTag} className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(watchedTags || []).map((tag: string, index: number) => (
                  <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                    {tag}
                    <button type="button" onClick={() => removeTag(index)} className="p-0.5 hover:bg-gray-200 rounded-full"><X className="w-3 h-3" /></button>
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
