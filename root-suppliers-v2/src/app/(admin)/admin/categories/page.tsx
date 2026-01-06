"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  FolderTree,
  Loader2,
  Package,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Folder,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  order: number;
  productCount?: number;
  createdAt: string;
  parent?: string | { _id: string; name: string; slug: string };
  children?: Category[];
}

// Recursive Category Item Component
function CategoryItem({ 
  category, 
  level = 0,
  expanded,
  onToggle,
  onEdit,
  onDelete,
  onAddChild,
}: {
  category: Category;
  level?: number;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddChild: () => void;
}) {
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div className="select-none">
      {/* Category Row */}
      <div 
        className={`flex items-center gap-2 py-2.5 px-3 hover:bg-gray-50 rounded-lg group transition-colors ${
          level === 0 ? 'bg-white border shadow-sm mb-2' : 'border-l-2 border-gray-200 ml-4'
        }`}
        style={{ marginLeft: level > 0 ? `${level * 24}px` : '0' }}
      >
        {/* Expand/Collapse Button */}
        <button
          onClick={onToggle}
          className={`p-1 rounded hover:bg-gray-200 transition-colors ${
            !hasChildren ? 'invisible' : ''
          }`}
        >
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>

        {/* Folder Icon */}
        {hasChildren && expanded ? (
          <FolderOpen className="w-5 h-5 text-amber-500" />
        ) : hasChildren ? (
          <Folder className="w-5 h-5 text-amber-500" />
        ) : (
          <Folder className="w-5 h-5 text-gray-400" />
        )}

        {/* Category Image (small) */}
        {category.image && (
          <img 
            src={category.image} 
            alt="" 
            className="w-6 h-6 rounded object-cover"
          />
        )}

        {/* Category Name */}
        <span className={`font-medium flex-1 ${level === 0 ? 'text-gray-900' : 'text-gray-700'}`}>
          {category.name}
        </span>

        {/* Level Badge */}
        <span className={`px-2 py-0.5 text-xs rounded-full ${
          level === 0 
            ? "bg-purple-100 text-purple-700"
            : level === 1
            ? "bg-blue-100 text-blue-700" 
            : "bg-teal-100 text-teal-700"
        }`}>
          {level === 0 ? "Main" : level === 1 ? "Subcategory" : "Sub-subcategory"}
        </span>

        {/* Status */}
        <span className={`px-2 py-0.5 text-xs rounded-full ${
          category.isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
        }`}>
          {category.isActive ? "Active" : "Inactive"}
        </span>

        {/* Product Count */}
        <span className="text-xs text-gray-500 flex items-center gap-1 min-w-[60px]">
          <Package className="w-3 h-3" />
          {category.productCount || 0}
        </span>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {level < 2 && (
            <button
              onClick={onAddChild}
              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
              title={level === 0 ? "Add Subcategory" : "Add Sub-subcategory"}
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onEdit}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div className="mt-1">
          {category.children!.map(child => (
            <CategoryItemWrapper
              key={child._id}
              category={child}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Wrapper to handle state for each category item
function CategoryItemWrapper({ 
  category, 
  level = 0 
}: { 
  category: Category; 
  level?: number;
}) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(level === 0); // Auto-expand main categories
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/categories/${category.slug}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        window.location.reload();
      } else {
        alert(data.message || "Failed to delete category");
      }
    } catch (error) {
      alert("Failed to delete category");
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(false);
    }
  };

  return (
    <>
      <CategoryItem
        category={category}
        level={level}
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
        onEdit={() => router.push(`/admin/categories/${category.slug}`)}
        onDelete={() => setDeleteConfirm(true)}
        onAddChild={() => router.push(`/admin/categories/new?parent=${category._id}`)}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setDeleteConfirm(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6 w-full max-w-md z-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete "{category.name}"?
            </h3>
            <p className="text-gray-600 mb-4">
              {category.children?.length ? (
                <span className="text-red-600">
                  ⚠️ This category has {category.children.length} subcategories. They will also be deleted.
                </span>
              ) : (
                "This will remove the category. Products in this category will become uncategorized."
              )}
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Build nested category tree
  const buildNestedTree = (cats: Category[]): Category[] => {
    const categoryMap = new Map<string, Category>();
    const roots: Category[] = [];

    // First pass: create all category objects with empty children
    cats.forEach(cat => {
      categoryMap.set(cat._id, { ...cat, children: [] });
    });

    // Second pass: build the tree structure
    cats.forEach(cat => {
      const category = categoryMap.get(cat._id)!;
      const parentId = typeof cat.parent === 'object' ? cat.parent?._id : cat.parent;
      
      if (parentId && categoryMap.has(parentId)) {
        categoryMap.get(parentId)!.children!.push(category);
      } else {
        roots.push(category);
      }
    });

    // Sort by order
    const sortCategories = (cats: Category[]) => {
      cats.sort((a, b) => (a.order || 0) - (b.order || 0));
      cats.forEach(cat => {
        if (cat.children?.length) {
          sortCategories(cat.children);
        }
      });
    };
    sortCategories(roots);

    return roots;
  };

  // Filter categories by search
  const filterCategories = (cats: Category[], query: string): Category[] => {
    if (!query) return cats;
    
    const lowerQuery = query.toLowerCase();
    
    const filterRecursive = (cat: Category): Category | null => {
      const matchesName = cat.name.toLowerCase().includes(lowerQuery);
      const filteredChildren = cat.children?.map(filterRecursive).filter(Boolean) as Category[] || [];
      
      if (matchesName || filteredChildren.length > 0) {
        return { ...cat, children: filteredChildren };
      }
      return null;
    };
    
    return cats.map(filterRecursive).filter(Boolean) as Category[];
  };

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();

      if (data.success) {
        const rawCategories = data.categories || [];
        const nestedCategories = buildNestedTree(rawCategories);
        setCategories(nestedCategories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = filterCategories(categories, searchQuery);

  // Count total categories
  const countCategories = (cats: Category[]): number => {
    return cats.reduce((count, cat) => {
      return count + 1 + (cat.children ? countCategories(cat.children) : 0);
    }, 0);
  };

  const totalCount = countCategories(categories);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">
            {totalCount} categories • Organize products into hierarchy
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-cardinal-red text-white rounded-lg hover:bg-cardinal-red/90 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Main Category
        </Link>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <FolderTree className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">How to organize categories:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li><strong>Main Category</strong> – Top level (e.g., "Electronics", "Clothing")</li>
              <li><strong>Subcategory</strong> – Under main category (e.g., "Phones" under "Electronics")</li>
              <li><strong>Sub-subcategory</strong> – Under subcategory (e.g., "Smartphones" under "Phones")</li>
            </ul>
            <p className="mt-2">Click the <Plus className="w-3 h-3 inline text-green-600" /> button on any category to add a child category.</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red"
          />
        </div>
      </div>

      {/* Categories Tree */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-cardinal-red" />
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FolderTree className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">
              {searchQuery ? "No categories match your search" : "No categories yet"}
            </p>
            {!searchQuery && (
              <Link
                href="/admin/categories/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-cardinal-red text-white rounded-lg hover:bg-cardinal-red/90 shadow-sm"
              >
                <Plus className="w-5 h-5" />
                Add Your First Category
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredCategories.map(category => (
              <CategoryItemWrapper
                key={category._id}
                category={category}
                level={0}
              />
            ))}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Legend:</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-700">Main</span>
            Top-level category
          </span>
          <span className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">Subcategory</span>
            Level 2
          </span>
          <span className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs rounded-full bg-teal-100 text-teal-700">Sub-subcategory</span>
            Level 3
          </span>
        </div>
      </div>
    </div>
  );
}
