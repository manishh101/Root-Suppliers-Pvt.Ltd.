"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Loader2, Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import { blogSchema, type BlogFormData } from "@/lib/validations";

// Dynamically import RichTextEditor to prevent SSR issues with Quill
const RichTextEditor = dynamic(
  () => import("@/components/editor/RichTextEditor"),
  {
    ssr: false,
    loading: () => <div className="flex h-64 w-full items-center justify-center bg-gray-50 rounded-lg"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>,
  }
);

export default function NewBlogPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      isActive: true, // matches baseStatusSchema
      metaTitle: "",
      metaDescription: "",
      tags: [],
      featuredImage: null,
    },
  });

  const watchedTitle = watch("title");
  const watchedSlug = watch("slug");
  const watchedTags = watch("tags");
  const watchedFeaturedImage = watch("featuredImage");

  // Real-time slug generation
  useEffect(() => {
    if (watchedTitle && !watchedSlug) {
      setValue("slug", watchedTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-*|-*$/g, ""));
    }
  }, [watchedTitle, watchedSlug, setValue]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "root-suppliers/blogs");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setValue("featuredImage", {
        url: data.url,
        publicId: data.publicId,
      });
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !watchedTags?.includes(tagInput.trim())) {
      setValue("tags", [...(watchedTags || []), tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setValue(
      "tags",
      (watchedTags || []).filter((_: string, i: number) => i !== index)
    );
  };

  const onSubmit = async (data: BlogFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.message || "Failed to create blog post");
        return;
      }

      router.push("/admin/blogs");
    } catch (err: any) {
      console.error("Submit failed:", err);
      setError(err.message || "Failed to create blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/blogs"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Blog Post</h1>
          <p className="text-gray-600">Create a new blog article</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Post Details</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  {...register("title")}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.title ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter blog title"
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
                    className={`flex-1 px-4 py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.slug ? "border-red-500" : "border-gray-300"}`}
                    placeholder="blog-post-slug"
                  />
                </div>
                {errors.slug && <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt *</label>
                <textarea
                  {...register("excerpt")}
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.excerpt ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Brief summary of the blog post"
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

            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Featured Image</h2>
              {watchedFeaturedImage ? (
                <div className="relative rounded-lg overflow-hidden">
                  <img src={watchedFeaturedImage.url} alt="Featured" className="w-full h-64 object-cover" />
                  <button type="button" onClick={() => setValue("featuredImage", null)} className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className={`flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}>
                  {isUploading ? <Loader2 className="w-12 h-12 text-gray-400 animate-spin" /> : <><ImageIcon className="w-12 h-12 text-gray-400" /><span className="mt-2 text-gray-500">Click to upload featured image</span></>}
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="hidden" />
                </label>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">SEO Settings</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                <input type="text" {...register("metaTitle")} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="SEO title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                <textarea {...register("metaDescription")} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="SEO description" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Publish</h2>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" {...register("isActive")} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-gray-700">Publish immediately</span>
              </label>
              {Object.keys(errors).length > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  Please fix validation errors:
                  <ul className="list-disc list-inside mt-1 font-medium">
                    {Object.entries(errors).map(([key, err]) => (
                      <li key={key}>{(err as any).message || key}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
                {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : <><Save className="w-5 h-5" /> Save Post</>}
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Tags</h2>
              <div className="flex items-center gap-2">
                <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="Add a tag" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg" />
                <button type="button" onClick={addTag} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"><span className="text-xl leading-none">+</span></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(watchedTags || []).map((tag: string, index: number) => (
                  <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {tag}
                    <button type="button" onClick={() => removeTag(index)} className="text-gray-400 hover:text-red-500"><X className="w-3 h-3" /></button>
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
