"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, Loader2, Upload, Trash2, Plus, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

// Schema definition
const aboutPageSchema = z.object({
  about: z.object({
    story: z.object({
      title: z.string().min(1, "Title is required"),
      content: z.string().min(1, "Content is required"),
      image: z.object({
        url: z.string(),
        publicId: z.string().optional(),
      }).optional(),
    }),
    mission: z.object({
      title: z.string().min(1, "Title is required"),
      content: z.string().min(1, "Content is required"),
    }),
    vision: z.object({
      title: z.string().min(1, "Title is required"),
      content: z.string().min(1, "Content is required"),
    }),
  }),
});

type AboutFormData = z.infer<typeof aboutPageSchema>;

export default function AboutAdminPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Custom states for complex fields
  const [storyImage, setStoryImage] = useState<{ url: string; publicId?: string } | null>(null);
  const [gallery, setGallery] = useState<{ url: string; publicId?: string; alt?: string }[]>([]);

  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AboutFormData>({
    resolver: zodResolver(aboutPageSchema),
  });

  // Default Fallback Data (Matches Frontend)
  const defaultStoryImage = { url: "/images/hero/image.png", publicId: "" };
  const defaultGallery = [
    { url: "/images/hero/image copy.png", alt: "Warehouse Operations" },
    { url: "/images/products/image copy.png", alt: "Safety Gear" },
    { url: "/images/products/image copy 2.png", alt: "Quality Tools" },
  ];
  const defaultStory = {
    title: "More Than Just a Hardware Store.",
    content: "Root Suppliers Pvt. Ltd. isn't just about selling tools; it's about enabling dreams. Established in 2010 in the heart of Biratnagar, we started with a simple vision: to bring world-class construction materials to our local community.\n\nWhat began as a modest storefront has blossomed into a trusted institution. We've weathered market changes and expanded our horizons, but our core philosophy remains unchanged — integrity in every transaction.\n\nToday, we pride ourselves on being a partner in your progress. Whether you're building a family home or a commercial landmark, our team puts their expertise to work for you, ensuring you have the right materials at the right time."
  };
  const defaultMission = {
    title: "Our Mission",
    content: "To empower builders and homeowners by providing unmatched quality construction materials. We strive to simplify the complex supply chain, offering fair prices and expert guidance to ensure every structure built with our supplies stands the test of time."
  };
  const defaultVision = {
    title: "Our Vision",
    content: "To represent the gold standard in hardware supply across Nepal. We envision a future where Root Suppliers is synonymous with trust, innovation, and community development, helping shape the skyline of Biratnagar and beyond."
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const settingsRes = await fetch("/api/settings");
      const settingsData = await settingsRes.json();

      if (settingsData.success) {
        const aboutData = settingsData.settings?.homepage?.about || {};

        // Reset form fields with DB data OR Defaults
        reset({
          about: {
            story: {
              title: aboutData.story?.title || defaultStory.title,
              content: aboutData.story?.content || defaultStory.content,
              image: aboutData.story?.image || defaultStoryImage,
            },
            mission: {
              title: aboutData.mission?.title || defaultMission.title,
              content: aboutData.mission?.content || defaultMission.content,
            },
            vision: {
              title: aboutData.vision?.title || defaultVision.title,
              content: aboutData.vision?.content || defaultVision.content,
            }
          }
        });

        // Set custom states with DB data OR Defaults
        setStoryImage(aboutData.story?.image || defaultStoryImage);
        setGallery(aboutData.gallery && aboutData.gallery.length > 0 ? aboutData.gallery : defaultGallery);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setMessage({ type: "error", text: "Failed to load data" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "story" | "gallery") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "root-suppliers/about");

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      const newImage = { url: data.url, publicId: data.public_id };

      if (type === "story") setStoryImage(newImage);
      else if (type === "gallery") setGallery([...gallery, newImage]);

    } catch (error) {
      console.error("Upload failed:", error);
      setMessage({ type: "error", text: "Image upload failed" });
    } finally {
      setIsUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: AboutFormData) => {
    setIsSaving(true);
    setMessage(null);

    const payload = {
      homepage: {
        about: {
          ...data.about,
          story: { ...data.about.story, image: storyImage },
          gallery,
        }
      }
    };

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (!result.success) throw new Error(result.message);

      setMessage({ type: "success", text: "About Us page updated successfully!" });
      // Re-fetch to ensure sync
      fetchData();
    } catch (error: any) {
      console.error("Save failed:", error);
      setMessage({ type: "error", text: error.message || "Failed to save changes" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">About Us Page</h1>
          <p className="text-gray-500">Manage content for the public About Us page.</p>
        </div>
        <button onClick={handleSubmit(onSubmit)} disabled={isSaving} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
          {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
          Save Changes
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Our Story */}
      <section className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Our Story</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input {...register("about.story.title")} className="w-full px-4 py-2 border rounded-lg" />
              {errors.about?.story?.title && <p className="text-red-500 text-sm">{errors.about.story.title.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea {...register("about.story.content")} rows={6} className="w-full px-4 py-2 border rounded-lg" />
              {errors.about?.story?.content && <p className="text-red-500 text-sm">{errors.about.story.content.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Story Image</label>
            <div className="relative w-full aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden border">
              {storyImage ? (
                <Image src={storyImage.url} alt="Story" fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
              )}
            </div>
            <label className="block w-full text-center py-2 border rounded-lg cursor-pointer hover:bg-gray-50">
              Change Image
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'story')} disabled={isUploading} />
            </label>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-6">
        <section className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Our Mission</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input {...register("about.mission.title")} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea {...register("about.mission.content")} rows={4} className="w-full px-4 py-2 border rounded-lg" />
          </div>
        </section>
        <section className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Our Vision</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input {...register("about.vision.title")} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea {...register("about.vision.content")} rows={4} className="w-full px-4 py-2 border rounded-lg" />
          </div>
        </section>
      </div>

      {/* Gallery */}
      <section className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-semibold text-gray-900">Company Gallery</h2>
          <label className="flex items-center gap-1 text-sm text-primary font-medium cursor-pointer hover:underline">
            <Plus className="w-4 h-4" /> Add Image
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'gallery')} disabled={isUploading} />
          </label>
        </div>

        {gallery.length === 0 ? (
          <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed">
            No images in gallery. Upload some to showcase your company.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((img, idx) => (
              <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border">
                <Image src={img.url} alt="Gallery" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => removeGalleryImage(idx)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
