'use client';

import { useState, useCallback } from 'react';
import {
  Upload,
  Search,
  Grid,
  List,
  Trash2,
  Copy,
  Check,
  Image as ImageIcon,
  Loader2,
  X,
  FolderOpen
} from 'lucide-react';
import { CloudinaryImage } from '@/components/ui/CloudinaryImage';

interface UploadedImage {
  id: string;
  url: string;
  publicId: string;
  folder: string;
  filename: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  createdAt: string;
}

export default function MediaPage() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFolder, setUploadFolder] = useState('general');
  const [dragActive, setDragActive] = useState(false);

  const folders = ['all', 'products', 'categories', 'blogs', 'brands', 'general'];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = async (files: FileList) => {
    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', uploadFolder);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();
        if (data.success) {
          const newImage: UploadedImage = {
            id: data.publicId || Date.now().toString(),
            url: data.url,
            publicId: data.publicId,
            folder: uploadFolder,
            filename: file.name,
            format: file.type.split('/')[1],
            width: data.width || 0,
            height: data.height || 0,
            bytes: file.size,
            createdAt: new Date().toISOString()
          };
          setImages(prev => [newImage, ...prev]);
        }
      }
    } catch (err) {
      console.error('Error uploading:', err);
    } finally {
      setUploading(false);
      setShowUploadModal(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const copyToClipboard = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const toggleSelectImage = (id: string) => {
    setSelectedImages(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const deleteSelected = async () => {
    // For now, just remove from local state
    // In production, you'd call the Cloudinary API to delete
    setImages(prev => prev.filter(img => !selectedImages.includes(img.id)));
    setSelectedImages([]);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredImages = images.filter(img => {
    const matchesSearch = img.filename.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = selectedFolder === 'all' || img.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600 mt-1">Manage your uploaded images</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-cardinal-red text-white rounded-lg hover:bg-cardinal-red/90 transition-colors"
        >
          <Upload className="w-5 h-5" />
          Upload Images
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red"
            />
          </div>

          {/* Folder Filter */}
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-gray-400" />
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red"
            >
              {folders.map(folder => (
                <option key={folder} value={folder}>
                  {folder.charAt(0).toUpperCase() + folder.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          {/* Delete Selected */}
          {selectedImages.length > 0 && (
            <button
              onClick={deleteSelected}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              Delete ({selectedImages.length})
            </button>
          )}
        </div>
      </div>

      {/* Images */}
      {images.length === 0 ? (
        <div
          className={`bg-white rounded-xl shadow-sm border-2 border-dashed p-12 text-center transition-colors ${dragActive ? 'border-cardinal-red bg-cardinal-red/5' : 'border-gray-300'
            }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No images yet</h3>
          <p className="text-gray-500 mb-4">
            Drag and drop images here, or click the upload button
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-cardinal-red text-white rounded-lg hover:bg-cardinal-red/90 transition-colors"
          >
            <Upload className="w-5 h-5" />
            Upload Images
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className={`relative group aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImages.includes(image.id)
                ? 'border-cardinal-red ring-2 ring-cardinal-red/20'
                : 'border-transparent hover:border-gray-200'
                }`}
            >
              <CloudinaryImage
                src={image.url}
                alt={image.filename}
                fill
                className="object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => copyToClipboard(image.url)}
                  className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                  title="Copy URL"
                >
                  {copiedUrl === image.url ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => toggleSelectImage(image.id)}
                  className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                  title="Select"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>

              {/* Selection Indicator */}
              <div
                className={`absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${selectedImages.includes(image.id)
                  ? 'bg-cardinal-red border-cardinal-red'
                  : 'bg-white/80 border-gray-300 opacity-0 group-hover:opacity-100'
                  }`}
                onClick={() => toggleSelectImage(image.id)}
              >
                {selectedImages.includes(image.id) && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>

              {/* Folder Badge */}
              <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 text-white text-xs rounded">
                {image.folder}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 w-12">
                  <input
                    type="checkbox"
                    checked={selectedImages.length === filteredImages.length && filteredImages.length > 0}
                    onChange={(e) => setSelectedImages(e.target.checked ? filteredImages.map(i => i.id) : [])}
                    className="w-4 h-4 text-cardinal-red focus:ring-cardinal-red rounded"
                  />
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Preview</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Filename</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Folder</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Size</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Dimensions</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredImages.map((image) => (
                <tr key={image.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedImages.includes(image.id)}
                      onChange={() => toggleSelectImage(image.id)}
                      className="w-4 h-4 text-cardinal-red focus:ring-cardinal-red rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative w-12 h-12 rounded overflow-hidden">
                      <CloudinaryImage
                        src={image.url}
                        alt={image.filename}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium truncate max-w-[200px]">
                    {image.filename}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                      {image.folder}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatBytes(image.bytes)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {image.width} x {image.height}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => copyToClipboard(image.url)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors inline-flex items-center gap-1 text-sm text-gray-600"
                    >
                      {copiedUrl === image.url ? (
                        <>
                          <Check className="w-4 h-4 text-green-600" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy URL
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Upload Images</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload to Folder
                </label>
                <select
                  value={uploadFolder}
                  onChange={(e) => setUploadFolder(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red"
                >
                  <option value="products">Products</option>
                  <option value="categories">Categories</option>
                  <option value="blogs">Blogs</option>
                  <option value="brands">Brands</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? 'border-cardinal-red bg-cardinal-red/5' : 'border-gray-300'
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {uploading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-12 h-12 text-cardinal-red animate-spin mb-4" />
                    <p className="text-gray-600">Uploading...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Drag and drop images here, or
                    </p>
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-cardinal-red text-white rounded-lg hover:bg-cardinal-red/90 transition-colors cursor-pointer">
                      <Upload className="w-4 h-4" />
                      Browse Files
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileInput}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-4">
                      Supports: JPG, PNG, GIF, WebP (Max 10MB each)
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
