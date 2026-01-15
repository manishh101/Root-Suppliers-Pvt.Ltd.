'use client';

import { useState, useEffect } from 'react';
import { CloudinaryImage } from '@/components/ui/CloudinaryImage';
import {
  Plus,
  Trash2,
  Edit2,
  Upload,
  X,
  Loader2,
  Image as ImageIcon,
  GripVertical,
  Save,
  Eye
} from 'lucide-react';

interface HeroSlide {
  image: { url: string; publicId: string };
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState<HeroSlide>({
    image: { url: '', publicId: '' },
    title: '',
    subtitle: '',
    ctaText: '',
    ctaLink: ''
  });

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      if (data.success) {
        setSlides(data.settings?.homepage?.heroSlides || []);
      }
    } catch (error) {
      console.error('Error fetching slides:', error);
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
      formDataUpload.append("file", file);
      formDataUpload.append("folder", "hero-slides");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await response.json();

      if (data.success) {
        setFormData(prev => ({
          ...prev,
          image: {
            url: data.url,
            publicId: data.publicId
          }
        }));
      }
    } catch (err) {
      console.error("Error uploading image:", err);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: { url: '', publicId: '' }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image.url) {
      setMessage({ type: 'error', text: 'Please upload an image' });
      return;
    }

    const newSlides = [...slides];
    if (editingIndex !== null) {
      newSlides[editingIndex] = formData;
    } else {
      newSlides.push(formData);
    }

    setSlides(newSlides);
    resetForm();
  };

  const handleDelete = (index: number) => {
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setFormData(slides[index]);
    setShowModal(true);
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const newSlides = [...slides];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= slides.length) return;
    [newSlides[index], newSlides[newIndex]] = [newSlides[newIndex], newSlides[index]];
    setSlides(newSlides);
  };

  const saveSlides = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homepage: {
            heroSlides: slides
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Hero slides saved successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to save slides' });
      }
    } catch (error) {
      console.error('Error saving slides:', error);
      setMessage({ type: 'error', text: 'An error occurred while saving' });
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      image: { url: '', publicId: '' },
      title: '',
      subtitle: '',
      ctaText: '',
      ctaLink: ''
    });
    setEditingIndex(null);
    setShowModal(false);
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hero Slides</h1>
          <p className="text-gray-600 mt-1">Manage the carousel images on your homepage</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-cardinal-red text-white rounded-lg hover:bg-cardinal-red/90 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Add Slide
          </button>
          <button
            onClick={saveSlides}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Save Changes
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Slides Grid */}
      <div className="space-y-4">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border p-4 flex items-center gap-4"
          >
            {/* Drag Handle */}
            <div className="flex flex-col gap-1">
              <button
                onClick={() => moveSlide(index, 'up')}
                disabled={index === 0}
                className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
              >
                <GripVertical className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Image Preview */}
            <div className="relative w-48 h-28 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
              {slide.image?.url ? (
                <CloudinaryImage
                  src={slide.image.url}
                  alt={slide.title || 'Hero slide'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-300" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {slide.title || 'No title'}
              </h3>
              {slide.subtitle && (
                <p className="text-sm text-gray-500 truncate">{slide.subtitle}</p>
              )}
              {slide.ctaText && (
                <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                  CTA: {slide.ctaText}
                </span>
              )}
            </div>

            {/* Order Badge */}
            <div className="text-lg font-bold text-gray-300">
              #{index + 1}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEdit(index)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit2 className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {slides.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No hero slides added yet</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 text-cardinal-red hover:underline"
          >
            Add your first slide
          </button>
        </div>
      )}

      {/* Preview Link */}
      {slides.length > 0 && (
        <div className="mt-6 text-center">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-cardinal-red transition-colors"
          >
            <Eye className="w-4 h-4" />
            Preview on Homepage
          </a>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                {editingIndex !== null ? 'Edit Slide' : 'Add New Slide'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slide Image *
                </label>
                <div className="space-y-3">
                  {formData.image?.url ? (
                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <CloudinaryImage
                        src={formData.image.url}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-2">Upload a hero image</p>
                      <p className="text-xs text-gray-400">Recommended size: 1920x600px</p>
                    </div>
                  )}

                  <label className="block">
                    <span className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {uploadingImage ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          {formData.image?.url ? 'Change Image' : 'Upload Image'}
                        </>
                      )}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Quality Hardware Solutions"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtitle (Optional)
                </label>
                <input
                  type="text"
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g., Your trusted partner since 2010"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red"
                />
              </div>

              {/* CTA Button */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Button Text (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.ctaText || ''}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    placeholder="e.g., Shop Now"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Button Link (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.ctaLink || ''}
                    onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                    placeholder="e.g., /products"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-cardinal-red text-white rounded-lg hover:bg-cardinal-red/90 transition-colors"
                >
                  {editingIndex !== null ? 'Update' : 'Add'} Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
