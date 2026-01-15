"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Save,
  Loader2,
  Upload,
  Settings as SettingsIcon,
  Globe,
  Mail,
  Clock,
  Share2,
  Search,
  LayoutTemplate,
  Plus,
  Trash2,
} from "lucide-react";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";

const settingsSchema = z.object({
  site: z.object({
    name: z.string().min(1, "Site name is required"),
    tagline: z.string().optional(),
    logo: z.object({ url: z.string().optional(), publicId: z.string().optional() }).optional(),
    favicon: z.object({ url: z.string().optional(), publicId: z.string().optional() }).optional(),
  }),
  contact: z.object({
    primaryEmail: z.string().email("Invalid email").optional().or(z.literal("")),
    primaryPhone: z.string().optional(),
    whatsapp: z.string().optional(),
    address: z.string().optional(),
    googleMapsUrl: z.string().optional(),
    googleMapsEmbed: z.string().optional(),
  }),
  socialLinks: z.object({
    facebook: z.string().optional(),
    twitter: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
    youtube: z.string().optional(),
  }),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }),
  businessHours: z.object({
    monday: z.string().optional(),
    tuesday: z.string().optional(),
    wednesday: z.string().optional(),
    thursday: z.string().optional(),
    friday: z.string().optional(),
    saturday: z.string().optional(),
    sunday: z.string().optional(),
  }),
  homepage: z.object({
    stats: z.array(
      z.object({
        label: z.string().min(1, "Label required"),
        value: z.number({ invalid_type_error: "Must be a number" }),
        suffix: z.string().optional(),
      })
    ).optional(),
  }),
  enableInquiryNotifications: z.boolean().optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"general" | "homepage" | "seo" | "social" | "hours">("general");

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      homepage: { stats: [] },
      businessHours: {}
    }
  });

  const { fields: statFields, append: appendStat, remove: removeStat } = useFieldArray({
    control,
    name: "homepage.stats",
  });

  const logoUrl = watch("site.logo.url");
  const faviconUrl = watch("site.favicon.url");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        const data = await response.json();

        if (data.success && data.settings) {
          const s = data.settings;
          const hoursObj: any = {};
          if (Array.isArray(s.businessHours)) {
            s.businessHours.forEach((bh: any) => {
              if (bh.day) hoursObj[bh.day.toLowerCase()] = bh.hours;
            });
          }

          const formData: SettingsFormData = {
            site: {
              name: s.site?.name || "",
              tagline: s.site?.tagline || "",
              logo: s.site?.logo || { url: "" },
              favicon: s.site?.favicon || { url: "" },
            },
            contact: {
              primaryEmail: s.contact?.primaryEmail || "",
              primaryPhone: s.contact?.primaryPhone || "",
              whatsapp: s.contact?.secondaryPhone || "", // Mapped
              address: s.contact?.address || "",
              googleMapsUrl: s.contact?.googleMapsLink || "",
              googleMapsEmbed: s.contact?.googleMapsEmbed || "",
            },
            socialLinks: {
              facebook: s.social?.facebook || "",
              twitter: s.social?.twitter || "",
              instagram: s.social?.instagram || "",
              linkedin: s.social?.linkedin || "",
              youtube: s.social?.youtube || "",
            },
            seo: {
              metaTitle: s.seo?.defaultTitle || "",
              metaDescription: s.seo?.defaultDescription || "",
            },
            businessHours: hoursObj,
            homepage: {
              stats: s.homepage?.stats || [],
            },
            enableInquiryNotifications: s.enableInquiryNotifications,
          };

          reset(formData);
        }
      } catch (error) {
        console.error(error);
        setError("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [reset]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldPath: "site.logo.url" | "site.favicon.url") => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "root-suppliers/branding");
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      setValue(fieldPath, data.url, { shouldDirty: true });
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: SettingsFormData) => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const dbData: any = {
        site: data.site,
        contact: {
          primaryEmail: data.contact.primaryEmail,
          primaryPhone: data.contact.primaryPhone,
          secondaryPhone: data.contact.whatsapp,
          address: data.contact.address,
          googleMapsLink: data.contact.googleMapsUrl,
          googleMapsEmbed: data.contact.googleMapsEmbed,
        },
        social: data.socialLinks,
        seo: {
          defaultTitle: data.seo.metaTitle,
          defaultDescription: data.seo.metaDescription,
        },
        homepage: data.homepage,
        enableInquiryNotifications: data.enableInquiryNotifications,
      };
      const hoursArray = Object.entries(data.businessHours).map(([day, hours]) => ({
        day, hours: hours || "Closed",
      }));
      dbData.businessHours = hoursArray;

      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dbData),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      setSuccess("Settings saved successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

  const tabs = [
    { id: "general", label: "General", icon: SettingsIcon },
    { id: "homepage", label: "Homepage", icon: LayoutTemplate },
    { id: "seo", label: "SEO", icon: Search },
    { id: "social", label: "Social", icon: Share2 },
    { id: "hours", label: "Hours", icon: Clock },
  ] as const;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div><h1 className="text-2xl font-bold">Settings</h1><p className="text-gray-600">Configuration</p></div>
      {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}
      {success && <div className="p-4 bg-green-50 text-green-700 rounded-lg">{success}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="border-b flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}>
                  <Icon className="w-4 h-4" /> {tab.label}
                </button>
              );
            })}
          </div>
          <div className="p-6 md:p-8">
            {activeTab === "general" && (
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium mb-2">Logo</label>
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 bg-gray-100 rounded border flex items-center justify-center overflow-hidden">{logoUrl ? <CloudinaryImage src={logoUrl} alt="Logo" fill className="object-contain p-2" /> : <Globe className="text-gray-400" />}</div>
                      <div>
                        <label className="btn-upload inline-flex items-center gap-2 px-4 py-2 border rounded cursor-pointer hover:bg-gray-50 text-sm">
                          {isUploading ? <Loader2 className="animate-spin w-4 h-4" /> : <Upload className="w-4 h-4" />} Upload
                          <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, "site.logo.url")} disabled={isUploading} />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Favicon</label>
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-gray-100 rounded border flex items-center justify-center">{faviconUrl ? <CloudinaryImage src={faviconUrl} alt="Favicon" width={48} height={48} className="object-contain" /> : <Globe className="text-gray-400" />}</div>
                      <div>
                        <label className="btn-upload inline-flex items-center gap-2 px-4 py-2 border rounded cursor-pointer hover:bg-gray-50 text-sm">
                          {isUploading ? <Loader2 className="animate-spin w-4 h-4" /> : <Upload className="w-4 h-4" />} Upload
                          <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, "site.favicon.url")} disabled={isUploading} />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="border-gray-100" />
                <div className="grid md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-medium mb-1">Site Name</label><input {...register("site.name")} className="w-full px-4 py-2 border rounded focus:ring-2 ring-primary/20 outline-none" /></div>
                  <div><label className="block text-sm font-medium mb-1">Tagline</label><input {...register("site.tagline")} className="w-full px-4 py-2 border rounded focus:ring-2 ring-primary/20 outline-none" /></div>
                </div>
                <hr className="border-gray-100" />
                <h3 className="text-lg font-semibold flex items-center gap-2"><Mail className="w-5 h-5" /> Contact</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" {...register("contact.primaryEmail")} className="w-full px-4 py-2 border rounded outline-none focus:ring-2 ring-primary/20" /></div>
                  <div><label className="block text-sm font-medium mb-1">Phone</label><input {...register("contact.primaryPhone")} className="w-full px-4 py-2 border rounded outline-none focus:ring-2 ring-primary/20" /></div>
                  <div><label className="block text-sm font-medium mb-1">WhatsApp</label><input {...register("contact.whatsapp")} className="w-full px-4 py-2 border rounded outline-none focus:ring-2 ring-primary/20" /></div>
                  <div><label className="block text-sm font-medium mb-1">Maps Link URL <span className="text-xs text-gray-500">(for Get Directions)</span></label><input {...register("contact.googleMapsUrl")} placeholder="https://maps.app.goo.gl/..." className="w-full px-4 py-2 border rounded outline-none focus:ring-2 ring-primary/20" /></div>
                </div>
                <div><label className="block text-sm font-medium mb-1">Maps Embed URL <span className="text-xs text-gray-500">(for map iframe display)</span></label><input {...register("contact.googleMapsEmbed")} placeholder="https://www.google.com/maps/embed?pb=..." className="w-full px-4 py-2 border rounded outline-none focus:ring-2 ring-primary/20" /></div>
                <div><label className="block text-sm font-medium mb-1">Address</label><textarea {...register("contact.address")} rows={2} className="w-full px-4 py-2 border rounded outline-none focus:ring-2 ring-primary/20" /></div>
                <hr className="border-gray-100" />
                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded border"><input type="checkbox" {...register("enableInquiryNotifications")} className="w-5 h-5 text-primary" /> <span>Enable Inquiry Notifications</span></label>
              </div>
            )}
            {activeTab === "homepage" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg">Stats</h3>
                  <p className="text-sm text-gray-500 mb-4">Homepage statistics counters.</p>
                  <div className="space-y-3">
                    {statFields.map((field, index) => (
                      <div key={field.id} className="flex flex-col md:flex-row gap-3 items-start p-3 bg-gray-50 rounded border">
                        <div className="flex-1"><label className="text-xs font-bold text-gray-500 uppercase">Label</label><input {...register(`homepage.stats.${index}.label`)} className="w-full p-2 border rounded" /></div>
                        <div className="w-32"><label className="text-xs font-bold text-gray-500 uppercase">Value</label><input type="number" {...register(`homepage.stats.${index}.value`, { valueAsNumber: true })} className="w-full p-2 border rounded" /></div>
                        <div className="w-24"><label className="text-xs font-bold text-gray-500 uppercase">Suffix</label><input {...register(`homepage.stats.${index}.suffix`)} className="w-full p-2 border rounded" /></div>
                        <button type="button" onClick={() => removeStat(index)} className="text-gray-400 hover:text-red-500 mt-6"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                    <button type="button" onClick={() => appendStat({ label: "", value: 0, suffix: "+" })} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded hover:bg-primary/20"><Plus className="w-4 h-4" /> Add Stat</button>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "seo" && (
              <div className="space-y-6">
                <div><label className="block text-sm font-medium mb-1">Meta Title</label><input {...register("seo.metaTitle")} className="w-full px-4 py-2 border rounded focus:ring-2 ring-primary/20 outline-none" /></div>
                <div><label className="block text-sm font-medium mb-1">Meta Description</label><textarea {...register("seo.metaDescription")} rows={3} className="w-full px-4 py-2 border rounded focus:ring-2 ring-primary/20 outline-none" /></div>
              </div>
            )}
            {activeTab === "social" && (
              <div className="grid md:grid-cols-2 gap-6">
                {["facebook", "twitter", "instagram", "linkedin", "youtube"].map(s => (
                  <div key={s}><label className="capitalize block text-sm font-medium mb-1">{s}</label><input type="url" {...register(`socialLinks.${s}` as any)} className="w-full px-4 py-2 border rounded focus:ring-2 ring-primary/20 outline-none" /></div>
                ))}
              </div>
            )}
            {activeTab === "hours" && (
              <div className="space-y-2">
                {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map(day => (
                  <div key={day} className="flex items-center gap-4"><span className="w-24 capitalize text-sm font-medium">{day}</span><input {...register(`businessHours.${day}` as any)} className="flex-1 px-4 py-2 border rounded focus:ring-2 ring-primary/20 outline-none" /></div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-end"><button type="submit" disabled={isSaving} className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded hover:bg-primary/90 shadow disabled:opacity-50">{isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />} Save Settings</button></div>
      </form>
    </div>
  );
}
