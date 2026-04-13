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
  GripVertical,
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
  onDragStart,
  onDrop,
  parentId,
}: {
  category: Category;
  level?: number;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddChild: () => void;
  onDragStart: (e: React.DragEvent, id: string, parentId: string | null) => void;
  onDrop: (e: React.DragEvent, id: string, parentId: string | null) => void;
  parentId: string | null;
}) {
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div className="select-none">
      {/* Category Row */}
      <div
        draggable
        onDragStart={(e) => onDragStart(e, category._id, parentId)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => onDrop(e, category._id, parentId)}
        className={`flex flex-col sm:flex-row sm:items-center gap-2 py-3 sm:py-2.5 px-3 hover:bg-gray-50 rounded-lg group transition-colors cursor-move ${level === 0 ? 'bg-white border shadow-sm mb-2' : 'border-l-2 border-gray-200'
          } ml-[calc(var(--level)*12px)] sm:ml-[calc(var(--level)*24px)]`}
        style={{ "--level": level } as React.CSSProperties}
      >
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0 cursor-move" />
          {/* Expand/Collapse Button */}
          <button
            onClick={onToggle}
            className={`p-1 rounded hover:bg-gray-200 transition-colors ${!hasChildren ? 'invisible' : ''
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
            <FolderOpen className="w-5 h-5 text-amber-500 flex-shrink-0" />
          ) : hasChildren ? (
            <Folder className="w-5 h-5 text-amber-500 flex-shrink-0" />
          ) : (
            <Folder className="w-5 h-5 text-gray-400 flex-shrink-0" />
          )}

          {/* Category Name */}
          <span className={`font-medium flex-1 truncate ${level === 0 ? 'text-gray-900' : 'text-gray-700'}`}>
            {category.name}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 ml-8 sm:ml-0 flex-wrap sm:flex-nowrap">
          {/* Level Badge */}
          <span className={`px-2 py-0.5 text-xs rounded-full whitespace-nowrap ${level === 0
            ? "bg-purple-100 text-purple-700"
            : level === 1
              ? "bg-blue-100 text-blue-700"
              : "bg-teal-100 text-teal-700"
            }`}>
            {level === 0 ? "Main" : level === 1 ? "Subcategory" : "Sub-sub"}
          </span>

          {/* Status */}
          <span className={`px-2 py-0.5 text-xs rounded-full ${category.isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
            }`}>
            {category.isActive ? "Active" : "Inactive"}
          </span>

          {/* Product Count */}
          <span className="text-xs text-gray-500 flex items-center gap-1 min-w-[60px]">
            <Package className="w-3 h-3" />
            {category.productCount || 0}
          </span>
        </div>

        {/* Actions - Always visible on mobile, hover on desktop */}
        <div className="flex items-center justify-end sm:justify-start gap-1 w-full sm:w-auto mt-2 sm:mt-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity border-t sm:border-0 pt-2 sm:pt-0">
          {level < 2 && (
            <button
              onClick={onAddChild}
              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg flex items-center gap-1"
              title={level === 0 ? "Add Subcategory" : "Add Sub-subcategory"}
            >
              <Plus className="w-4 h-4" />
              <span className="sm:hidden text-xs font-medium">Add Sub</span>
            </button>
          )}
          <button
            onClick={onEdit}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-1"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
            <span className="sm:hidden text-xs font-medium">Edit</span>
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
            <span className="sm:hidden text-xs font-medium">Delete</span>
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
              onDragStart={onDragStart}
              onDrop={onDrop}
              parentId={category._id}
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
  level = 0,
  onDragStart,
  onDrop,
  parentId = null,
}: {
  category: Category;
  level?: number;
  onDragStart: (e: React.DragEvent, id: string, parentId: string | null) => void;
  onDrop: (e: React.DragEvent, id: string, parentId: string | null) => void;
  parentId?: string | null;
}) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
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
        onDragStart={onDragStart}
        onDrop={onDrop}
        parentId={parentId}
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

  // DND Handlers
  const handleDragStart = (e: React.DragEvent, id: string, parentId: string | null) => {
    e.dataTransfer.setData("categoryId", id);
    e.dataTransfer.setData("parentId", parentId || "root");
  };

  const handleDrop = async (e: React.DragEvent, targetId: string, targetParentId: string | null) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("categoryId");
    const sourceParentId = e.dataTransfer.getData("parentId");
    const targetParent = targetParentId || "root";

    if (!draggedId || draggedId === targetId || sourceParentId !== targetParent) return;

    const findSiblings = (cats: Category[], parent: string): Category[] | null => {
      if (parent === "root") return cats;
      for (const cat of cats) {
        if (cat._id === parent) return cat.children || [];
        if (cat.children) {
          const found = findSiblings(cat.children, parent);
          if (found) return found;
        }
      }
      return null;
    };

    const siblings = findSiblings(categories, targetParent);
    if (!siblings) return;

    const sourceCat = siblings.find(c => c._id === draggedId);
    if (!sourceCat) return;

    const newSiblings = [...siblings.filter(c => c._id !== draggedId)];
    const targetIndex = newSiblings.findIndex(c => c._id === targetId);
    
    newSiblings.splice(targetIndex, 0, sourceCat);

    newSiblings.forEach((child, index) => {
      child.order = index;
    });

    const rebuildTree = (cats: Category[]): Category[] => {
      if (targetParent === "root") {
        return newSiblings.map(ns => {
          const existing = cats.find(c => c._id === ns._id);
          return { ...existing, order: ns.order } as Category;
        });
      }
      return cats.map(cat => {
        if (cat._id === targetParent) {
          return { ...cat, children: newSiblings };
        }
        if (cat.children) {
          return { ...cat, children: rebuildTree(cat.children) };
        }
        return cat;
      });
    };
    
    setCategories(rebuildTree(categories));

    try {
      await Promise.all(
        newSiblings.map((c) => fetch(`/api/categories/${c.slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: c.order })
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/categories?includeProductCount=true");
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
                onDragStart={handleDragStart}
                onDrop={handleDrop}
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
