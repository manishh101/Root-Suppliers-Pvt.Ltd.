"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  Loader2,
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

export default function EditProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
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

  const [featureInput, setFeatureInput] = useState("");
  const [shippingInput, setShippingInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    const initData = async () => {
      await Promise.all([fetchProduct(), fetchCategories(), fetchBrands()]);
    };
    initData();
  }, [slug]);

  // Real-time slug generation
  useEffect(() => {
    if (watchedName && !watchedSlug) {
      setValue("slug", watchedName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-*|-*$/g, ""));
    }
  }, [watchedName, watchedSlug, setValue]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${slug}`);
      const data = await response.json();

      if (data.success && data.product) {
        const product = data.product;
        // Ensure specifications have key/value structure
        const specs = (product.specifications || []).map((s: any) => ({
          key: s.key || s.name || "",
          value: s.value || ""
        }));

        reset({
          name: product.name || "",
          slug: product.slug || "",
          description: product.description || "",
          shortDescription: product.shortDescription || "",
          category: typeof product.category === "object" ? product.category._id : product.category || "",
          brand: typeof product.brand === "object" ? product.brand?._id : product.brand || "",
          images: product.images || [],
          unit: product.unit || "",
          price: product.price || 0,
          discountPrice: product.discountPrice || 0,
          sku: product.sku || "",
          stock: product.stock || 0,
          specifications: specs,
          shipping: product.shipping || [],
          features: product.features || [],
          tags: product.tags || [],
          isFeatured: product.isFeatured || false,
          isTopSelling: product.isTopSelling || false,
          isActive: product.isActive !== false,
          metaTitle: product.meta?.title || "",
          metaDescription: product.meta?.description || "",
        });
      } else {
        setError("Product not found");
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const buildCategoryTree = (
    cats: Category[],
    parentId: string | null = null,
    level: number = 0
  ): Category[] => {
    const result: Category[] = [];
    const children = cats.filter((cat) => {
      const catParent = typeof cat.parent === "object" ? cat.parent?._id : cat.parent;
      return catParent === parentId || (!catParent && !parentId);
    });

    for (const child of children) {
      result.push({ ...child, level });
      const grandchildren = buildCategoryTree(cats, child._id, level + 1);
      result.push(...grandchildren);
    }
    return result;
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      if (data.success) {
        const treeCategories = buildCategoryTree(data.categories || []);
        setCategories(treeCategories);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch("/api/brands");
      const data = await response.json();
      if (data.success) {
        setBrands(data.brands || []);
      }
    } catch (err) {
      console.error("Error fetching brands:", err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploadingImage(true);

    try {
      for (const file of Array.from(files)) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("folder", "products");

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });

        const data = await response.json();
        if (data.success) {
          setValue("images", [
            ...watchedImages,
            { url: data.url, publicId: data.publicId },
          ]);
        }
      }
    } catch (err) {
      console.error("Error uploading image:", err);
    } finally {
      setUploadingImage(false);
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
    if (tagInput.trim() && !watchedTags.includes(tagInput.trim())) {
      setValue("tags", [...watchedTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setValue("tags", watchedTags.filter((_, i) => i !== index));
  };

  const onFormSubmit: SubmitHandler<ProductFormData> = async (data) => {
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/products/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (!response.ok) {
        setError(resData.error || "Failed to update product");
        return;
      }

      router.push("/admin/products");
    } catch (err) {
      console.error("Error updating product:", err);
      setError("An error occurred while saving");
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
            href="/admin/products"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-600 mt-1">Update product information</p>
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
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
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
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">/products/</span>
                  <input
                    type="text"
                    {...register("slug")}
                    className={`flex-1 px-4 py-2 border rounded-r-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red ${errors.slug ? "border-red-500" : "border-gray-300"}`}
                  />
                </div>
                {errors.slug && <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <input
                  type="text"
                  {...register("shortDescription")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  {...register("description")}
                  rows={6}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red resize-none ${errors.description ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                {watchedImages.map((image, index) => (
                  <div key={index} className="relative aspect-square group rounded-lg overflow-hidden border">
                    <CloudinaryImage src={image.url} alt={`Product ${index + 1}`} fill className="object-cover" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && <span className="absolute bottom-2 left-2 px-2 py-1 bg-cardinal-red text-white text-xs rounded z-10">Primary</span>}
                  </div>
                ))}
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-cardinal-red hover:bg-cardinal-red/5 transition-colors">
                  {uploadingImage ? <Loader2 className="w-8 h-8 text-gray-400 animate-spin" /> : <><Upload className="w-8 h-8 text-gray-400 mb-2" /><span className="text-sm text-gray-500">Upload</span></>}
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                </label>
              </div>
              {errors.images && <p className="mt-2 text-sm text-red-500 font-medium">{errors.images.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <h2 className="text-lg font-semibold text-gray-900">Tags</h2>
                <div className="flex items-center gap-2">
                  <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="Add a tag" className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red" />
                  <button type="button" onClick={addTag} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"><Plus className="w-5 h-5" /></button>
                </div>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                  {watchedTags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {tag}
                      <button type="button" onClick={() => removeTag(index)} className="text-gray-400 hover:text-red-500"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Specifications</h2>
                <button type="button" onClick={() => appendSpec({ key: "", value: "" })} className="text-sm text-cardinal-red hover:text-cardinal-red/80 flex items-center gap-1"><Plus className="w-4 h-4" /> Add Specification</button>
              </div>
              <div className="space-y-3">
                {specFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-5 gap-3 items-end">
                    <div className="col-span-2">
                      <input type="text" {...register(`specifications.${index}.key`)} placeholder="Key" className="w-full px-3 py-2 text-sm border rounded-lg" />
                    </div>
                    <div className="col-span-2">
                      <input type="text" {...register(`specifications.${index}.value`)} placeholder="Value" className="w-full px-3 py-2 text-sm border rounded-lg" />
                    </div>
                    <button type="button" onClick={() => removeSpec(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg h-9"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
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
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Status & Visibility</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" {...register("isActive")} className="w-4 h-4 text-cardinal-red rounded border-gray-300 focus:ring-cardinal-red" />
                  <span className="text-sm font-medium text-gray-700">Active (Visible on Site)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" {...register("isFeatured")} className="w-4 h-4 text-cardinal-red rounded border-gray-300 focus:ring-cardinal-red" />
                  <span className="text-sm font-medium text-gray-700">Featured Product</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" {...register("isTopSelling")} className="w-4 h-4 text-cardinal-red rounded border-gray-300 focus:ring-cardinal-red" />
                  <span className="text-sm font-medium text-gray-700">Top Product</span>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Organization</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select {...register("category")} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red ${errors.category ? "border-red-500" : "border-gray-300"}`}>
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{"\u00A0".repeat((cat.level || 0) * 4)}{cat.level && cat.level > 0 ? "└─ " : ""}{cat.name}</option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <select {...register("brand")} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red">
                    <option value="">Select Brand</option>
                    {brands.map((brand) => (<option key={brand._id} value={brand._id}>{brand.name}</option>))}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Inventory</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                  <input type="number" step="0.01" {...register("price", { valueAsNumber: true })} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red ${errors.price ? "border-red-500" : "border-gray-300"}`} />
                  {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price (₹)</label>
                  <input type="number" step="0.01" {...register("discountPrice", { valueAsNumber: true })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <input type="text" {...register("unit")} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="e.g. pc, kg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input type="text" {...register("sku")} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                  <input type="number" step="1" min="0" {...register("stock", { valueAsNumber: true })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>
            </div>

            {Object.keys(errors).length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                Please fix the validation errors before updating.
                <ul className="list-disc list-inside mt-1">
                  {Object.entries(errors).map(([key, err]) => (
                    <li key={key}>{(err as any).message || key}</li>
                  ))}
                </ul>
              </div>
            )}

            <button type="submit" disabled={saving} className="w-full py-3 bg-cardinal-red text-white rounded-lg hover:bg-cardinal-red/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              {saving ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : <><Save className="w-5 h-5" /> Update Product</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
