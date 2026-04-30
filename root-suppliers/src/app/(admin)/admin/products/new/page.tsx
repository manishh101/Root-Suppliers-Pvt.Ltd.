"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  Trash2,
  Upload,
  X,
  GripVertical,
} from "lucide-react";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import { productSchema, type ProductFormData } from "@/lib/validations";

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
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [featureInput, setFeatureInput] = useState("");
  const [shippingInput, setShippingInput] = useState("");
  const [tagInput, setTagInput] = useState("");

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
      slug: "",
      description: "",
      shortDescription: "",
      category: "",
      brand: "",
      sku: "",
      unit: "",
      price: 0,
      discountPrice: 0,
      stock: 0,
      specifications: [],
      shipping: [],
      features: [],
      tags: [],
      isActive: true,
      isFeatured: false,
      isTopSelling: false,
      metaTitle: "",
      metaDescription: "",
      images: [],
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

  const watchedName = watch("name");
  const watchedSlug = watch("slug");
  const watchedFeatures = watch("features") || [];
  const watchedShipping = watch("shipping") || [];
  const watchedTags = watch("tags") || [];
  const watchedImages = watch("images") || [];

  // Real-time slug generation
  useEffect(() => {
    if (watchedName && !watchedSlug) {
      setValue("slug", watchedName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-*|-*$/g, ""));
    }
  }, [watchedName, watchedSlug, setValue]);

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
          // Flatten tree logic if needed, or just set
          setCategories(buildCategoryTree(categoriesData.categories));
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "products");

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (!data.success) throw new Error(data.message);

        return {
          url: data.url,
          publicId: data.publicId,
          alt: watchedName || file.name.split('.')[0]
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      setValue("images", [...watchedImages, ...uploadedImages]);
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError(err.message || "Failed to upload images");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setValue("images", watchedImages.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setValue("features", [...watchedFeatures, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const removeFeature = (index: number) => {
    setValue("features", watchedFeatures.filter((_, i) => i !== index));
  };

  const addShipping = () => {
    if (shippingInput.trim()) {
      setValue("shipping", [...watchedShipping, shippingInput.trim()]);
      setShippingInput("");
    }
  };

  const removeShipping = (index: number) => {
    setValue("shipping", watchedShipping.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput.trim() && !watchedTags?.includes(tagInput.trim())) {
      setValue("tags", [...watchedTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setValue("tags", watchedTags.filter((_, i) => i !== index));
  };

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Product</h1>
          <p className="text-gray-600">Create a new product</p>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input type="text" {...register("name")} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red ${errors.name ? "border-red-500" : "border-gray-300"}`} placeholder="Enter product name" />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL) *</label>
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">/products/</span>
                  <input type="text" {...register("slug")} className={`flex-1 px-4 py-2 border rounded-r-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red ${errors.slug ? "border-red-500" : "border-gray-300"}`} placeholder="product-url-slug" />
                </div>
                {errors.slug && <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <input type="text" {...register("shortDescription")} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Brief product description" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Description *</label>
                <textarea {...register("description")} rows={6} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red resize-none ${errors.description ? "border-red-500" : "border-gray-300"}`} placeholder="Detailed product description" />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Product Images (At least 1 required)</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {watchedImages.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border group">
                    <CloudinaryImage src={image.url} alt={`Product ${index + 1}`} fill className="object-cover" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-4 h-4" /></button>
                    {index === 0 && <span className="absolute bottom-2 left-2 px-2 py-1 bg-cardinal-red text-white text-xs rounded">Primary</span>}
                  </div>
                ))}
                <label className={`aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-cardinal-red hover:bg-cardinal-red/5 transition-colors ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}>
                  {isUploading ? <Loader2 className="w-8 h-8 text-gray-400 animate-spin" /> : <><Upload className="w-8 h-8 text-gray-400" /><span className="mt-2 text-sm text-gray-500">Upload</span></>}
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={isUploading} className="hidden" />
                </label>
              </div>
              {errors.images && <p className="mt-2 text-sm text-red-500 font-medium">{errors.images.message}</p>}
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Specifications</h2>
                <button type="button" onClick={() => appendSpec({ key: "", value: "" })} className="text-sm text-cardinal-red hover:underline flex items-center gap-1"><Plus className="w-4 h-4" /> Add Specification</button>
              </div>
              <div className="space-y-3">
                {specFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-3">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                    <input type="text" {...register(`specifications.${index}.key` as const)} placeholder="Name" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg" />
                    <input type="text" {...register(`specifications.${index}.value` as const)} placeholder="Value" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg" />
                    <button type="button" onClick={() => removeSpec(index)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Features</h2>
              <div className="flex items-center gap-2">
                <input type="text" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())} placeholder="Add a feature" className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red" />
                <button type="button" onClick={addFeature} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"><Plus className="w-5 h-5" /></button>
              </div>
              <ul className="space-y-2 max-h-48 overflow-y-auto">
                {watchedFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg text-sm">
                    <span className="text-gray-700">{feature}</span>
                    <button type="button" onClick={() => removeFeature(index)} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Shipping Information</h2>
              <div className="flex items-center gap-2">
                <input type="text" value={shippingInput} onChange={(e) => setShippingInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addShipping())} placeholder="Add a shipping detail" className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red" />
                <button type="button" onClick={addShipping} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"><Plus className="w-5 h-5" /></button>
              </div>
              <ul className="space-y-2 max-h-48 overflow-y-auto">
                {watchedShipping.map((detail, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg text-sm">
                    <span className="text-gray-700">{detail}</span>
                    <button type="button" onClick={() => removeShipping(index)} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                  </li>
                ))}
              </ul>
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
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" {...register("isTopSelling")} className="w-5 h-5 rounded border-gray-300 text-cardinal-red focus:ring-cardinal-red" />
                  <span className="text-gray-700">Top Selling</span>
                </label>
              </div>

              {Object.keys(errors).length > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  Please fix validation errors:
                  <ul className="list-disc list-inside mt-1">
                    {Object.entries(errors).map(([key, err]) => (
                      <li key={key}>{(err as any).message || key}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cardinal-red text-white rounded-lg hover:bg-cardinal-red/90 disabled:opacity-50">
                {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : <><Save className="w-5 h-5" /> Save Product</>}
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Organization</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select {...register("category")} className={`w-full px-4 py-2 border rounded-lg bg-white ${errors.category ? "border-red-500" : "border-gray-300"}`}>
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.level && cat.level > 0 ? `${"─".repeat(cat.level)} ${cat.name}` : cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <select {...register("brand")} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white">
                  <option value="">Select brand</option>
                  {brands.map((brand) => (
                    <option key={brand._id} value={brand._id}>{brand.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input type="text" {...register("sku")} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Stock keeping unit" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                <input type="text" {...register("unit")} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="e.g. pc, kg" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Pricing & Inventory</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MRP (₹) *</label>
                <input type="number" step="0.01" {...register("price", { valueAsNumber: true })} className={`w-full px-4 py-2 border rounded-lg ${errors.price ? "border-red-500" : "border-gray-300"}`} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price (₹)</label>
                <input type="number" step="0.01" {...register("discountPrice", { valueAsNumber: true })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                <input type="number" step="1" min="0" {...register("stock", { valueAsNumber: true })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Tags</h2>
              <div className="flex items-center gap-2">
                <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="Add a tag" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg" />
                <button type="button" onClick={addTag} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"><Plus className="w-5 h-5" /></button>
              </div>
              <div className="flex flex-wrap gap-2">{watchedTags?.map((tag, index) => (<span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{tag}<button type="button" onClick={() => removeTag(index)} className="text-gray-400 hover:text-red-500"><X className="w-3 h-3" /></button></span>))}</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
