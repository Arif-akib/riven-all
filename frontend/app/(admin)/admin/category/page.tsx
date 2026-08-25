"use client";

import API from "@/lib/axios";
import { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Image as ImageIcon,
  X,
  Loader2,
  CheckCircle2,
  XCircle,
  FolderTree,
} from "lucide-react";

type Category = {
  _id: string;
  name: string;
  slug: string;
  color?: string;
  image?: string;
  isActive: boolean;
};

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    color: "",
    image: "",
    isActive: true,
  });

  // ------------------ FETCH ------------------
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await API.get("/category/admin/list");
      setCategories(res.data.data || []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ------------------ SEARCH FILTER ------------------
  const filteredCategories = useMemo(() => {
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [categories, searchQuery]);

  // ------------------ INPUT ------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    setForm((prev) => {
      const updated = { ...prev, [name]: val };
      if (name === "name" && !editingCategory) {
        updated.slug = value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9 -]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");
      }
      return updated;
    });
  };

  // ------------------ CREATE / UPDATE ------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setActionLoading(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("slug", form.slug);
      formData.append("color", form.color);
      formData.append("isActive", String(form.isActive));

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const url = editingCategory
        ? `/category/admin/update/${editingCategory._id}`
        : `/category/admin/create`;

      const method = editingCategory ? "patch" : "post";
      const res = await API[method](url, formData);

      if (res.data.success) {
        toast.success(
          editingCategory
            ? "Category updated successfully"
            : "Category created successfully",
        );
        fetchCategories();
        closeModal();
      } else {
        toast.error(res.data.message || "Operation failed");
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err?.message || "Something went wrong",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ------------------ TOGGLE STATUS ------------------
  const handleToggleStatus = async (cat: Category) => {
    try {
      const res = await API.patch(`/category/admin/update/${cat._id}`, {
        isActive: !cat.isActive,
      });
      if (res.data.success) {
        toast.success(
          `Category set to ${!cat.isActive ? "Active" : "Inactive"}`,
        );
        setCategories((prev) =>
          prev.map((item) =>
            item._id === cat._id ? { ...item, isActive: !item.isActive } : item,
          ),
        );
      }
    } catch (err: any) {
      toast.error("Failed to update status");
    }
  };

  // ------------------ DELETE ------------------
  // const handleDelete = async (id: string) => {
  //   if (!confirm("Are you sure you want to delete this category?")) return;

  //   try {
  //     const res = await API.delete(`/category/admin/delete/${id}`);
  //     if (res.data.success) {
  //       toast.success("Category deleted");
  //       setCategories((prev) => prev.filter((cat) => cat._id !== id));
  //     }
  //   } catch (err: any) {
  //     toast.error(err?.response?.data?.message || "Failed to delete category");
  //   }
  // };

  // ------------------ EDIT ------------------
  const handleEdit = (cat: Category) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name || "",
      slug: cat.slug || "",
      color: cat.color || "",
      image: cat.image || "",
      isActive: cat.isActive,
    });
    setPreview(cat?.image || null);
    setShowModal(true);
  };

  // ------------------ CLOSE MODAL ------------------
  const closeModal = () => {
    if (preview && imageFile) {
      URL.revokeObjectURL(preview);
    }
    setShowModal(false);
    setEditingCategory(null);
    setImageFile(null);
    setPreview(null);
    setForm({
      name: "",
      slug: "",
      color: "",
      image: "",
      isActive: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* TOP CONTROLS */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search category by name or slug..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-900 focus:bg-white transition-all"
          />
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-rose-900 hover:bg-rose-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-2xs"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-rose-900" />
            <p className="text-sm">Fetching categories...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <FolderTree className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-base font-medium text-slate-600">
              No categories found
            </p>
            <p className="text-xs">
              Try adjusting your search query or create a new category.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="p-4 pl-6">Category</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCategories.map((cat) => (
                  <tr
                    key={cat._id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Category Image & Name */}
                    <td className="p-4 pl-6">
                      <div className="font-semibold text-slate-900 capitalize">
                        {cat.name}
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="p-4 font-mono text-xs text-slate-500">
                      {cat.slug}
                    </td>

                    {/* Status Badge & Toggle */}
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(cat)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full font-medium border transition-colors cursor-pointer ${
                          cat.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {cat.isActive ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5" />
                        )}
                        {cat.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="p-1.5 text-slate-600 hover:text-rose-900 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Edit Category"
                        >
                          <Edit2 size={16} />
                        </button>
                        {/* <button
                          onClick={() => handleDelete(cat._id)}
                          className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 size={16} />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl border border-slate-100 overflow-hidden space-y-0">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                {editingCategory ? "Edit Category" : "Create New Category"}
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Consumer Electronics"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-900 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="consumer-electronics"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-rose-900 focus:bg-white"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-rose-900 rounded border-slate-300 focus:ring-rose-900 accent-amber-700"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium text-slate-700 cursor-pointer"
                >
                  Set as Active Category
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-rose-900 hover:bg-rose-800 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
                >
                  {actionLoading && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {actionLoading
                    ? "Saving..."
                    : editingCategory
                      ? "Update Category"
                      : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
