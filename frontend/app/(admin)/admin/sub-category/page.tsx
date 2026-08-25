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
  Layers,
} from "lucide-react";

type Category = {
  _id: string;
  name: string;
};

type SubCategory = {
  _id: string;
  name: string;
  slug: string;
  category: Category | string;
  image?: string;
  isActive: boolean;
};

export default function SubCategoryPage() {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    category: "",
    image: "",
    isActive: true,
  });

  // ------------------ FETCH DATA ------------------
  const fetchData = async () => {
    setLoading(true);
    try {
      const [subCatRes, catRes] = await Promise.all([
        API.get("/subcategory/admin/list"),
        API.get("/category/admin/list"),
      ]);
      setSubCategories(subCatRes.data.data || []);
      setCategories(catRes.data.data || []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ------------------ SEARCH FILTER ------------------
  const filteredSubCategories = useMemo(() => {
    return subCategories.filter((item) => {
      const catName =
        typeof item.category === "object" ? item.category?.name : "";
      return (
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        catName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [subCategories, searchQuery]);

  // ------------------ INPUT HANDLER ------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const val = type === "checkbox" ? checked : value;

    setForm((prev) => {
      const updated = { ...prev, [name]: val };
      if (name === "name" && !editingSubCategory) {
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
      toast.error("SubCategory name is required");
      return;
    }

    if (!form.category) {
      toast.error("Please select a parent category");
      return;
    }

    try {
      setActionLoading(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("slug", form.slug);
      formData.append("category", form.category);
      formData.append("isActive", String(form.isActive));

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const url = editingSubCategory
        ? `/subcategory/admin/update/${editingSubCategory._id}`
        : `/subcategory/admin/create`;

      const method = editingSubCategory ? "patch" : "post";
      const res = await API[method](url, formData);

      if (res.data.success) {
        toast.success(
          editingSubCategory
            ? "SubCategory updated successfully"
            : "SubCategory created successfully"
        );
        fetchData();
        closeModal();
      } else {
        toast.error(res.data.message || "Operation failed");
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err?.message || "Something went wrong"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ------------------ TOGGLE STATUS ------------------
  const handleToggleStatus = async (item: SubCategory) => {
    try {
      const res = await API.patch(`/subcategory/admin/update/${item._id}`, {
        isActive: !item.isActive,
      });
      if (res.data.success) {
        toast.success(`SubCategory set to ${!item.isActive ? "Active" : "Inactive"}`);
        setSubCategories((prev) =>
          prev.map((sub) =>
            sub._id === item._id ? { ...sub, isActive: !sub.isActive } : sub
          )
        );
      }
    } catch (err: any) {
      toast.error("Failed to update status");
    }
  };

  // ------------------ DELETE ------------------
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subcategory?")) return;

    try {
      const res = await API.delete(`/subcategory/admin/delete/${id}`);
      if (res.data.success) {
        toast.success("SubCategory deleted");
        setSubCategories((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete subcategory");
    }
  };

  // ------------------ EDIT ------------------
  const handleEdit = (item: SubCategory) => {
    setEditingSubCategory(item);
    const categoryId =
      typeof item.category === "object" ? item.category._id : item.category;

    setForm({
      name: item.name || "",
      slug: item.slug || "",
      category: categoryId || "",
      image: item.image || "",
      isActive: item.isActive,
    });
    setPreview(item?.image || null);
    setShowModal(true);
  };

  // ------------------ CLOSE MODAL ------------------
  const closeModal = () => {
    if (preview && imageFile) {
      URL.revokeObjectURL(preview);
    }
    setShowModal(false);
    setEditingSubCategory(null);
    setImageFile(null);
    setPreview(null);
    setForm({
      name: "",
      slug: "",
      category: "",
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
            placeholder="Search subcategory or category..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-900 focus:bg-white transition-all"
          />
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-rose-900 hover:bg-rose-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-2xs"
        >
          <Plus size={18} /> Add SubCategory
        </button>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-rose-900" />
            <p className="text-sm">Fetching subcategories...</p>
          </div>
        ) : filteredSubCategories.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Layers className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-base font-medium text-slate-600">No SubCategories found</p>
            <p className="text-xs">Try adjusting your search query or create a new subcategory.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="p-4 pl-6">SubCategory</th>
                  <th className="p-4">Parent Category</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredSubCategories.map((item) => {
                  const parentCategoryName =
                    typeof item.category === "object"
                      ? item.category?.name
                      : "Unassigned";

                  return (
                    <tr key={item._id} className="hover:bg-slate-50/60 transition-colors">
                      {/* SubCategory Image & Name */}
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          <span className="font-semibold text-slate-900 capitalize">
                            {item.name}
                          </span>
                        </div>
                      </td>

                      {/* Parent Category */}
                      <td className="p-4">
                        <span className="text-slate-700 text-xs font-medium capitalize">
                          {parentCategoryName}
                        </span>
                      </td>

                      {/* Slug */}
                      <td className="p-4 font-mono text-xs text-slate-500">
                        {item.slug}
                      </td>

                      {/* Status Badge & Toggle */}
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleStatus(item)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full font-medium border transition-colors cursor-pointer ${
                            item.isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          {item.isActive ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5" />
                          )}
                          {item.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-1.5 text-slate-600 hover:text-rose-900 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Edit SubCategory"
                          >
                            <Edit2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl border border-slate-100 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                {editingSubCategory ? "Edit SubCategory" : "Create New SubCategory"}
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
              {/* Parent Category Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Parent Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-900 focus:bg-white"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* SubCategory Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  SubCategory Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Smart Watch"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-900 focus:bg-white"
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="smart-watch"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-rose-900 focus:bg-white"
                />
              </div>

              {/* Image Upload Area */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  SubCategory Image
                </label>
                {preview ? (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (preview && imageFile) URL.revokeObjectURL(preview);
                        setImageFile(null);
                        setPreview(null);
                      }}
                      className="absolute top-1 right-1 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full p-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition-colors">
                    <ImageIcon className="w-6 h-6 text-slate-400 mb-1" />
                    <span className="text-xs text-slate-500 font-medium">
                      Click to upload image
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setImageFile(file);
                        setPreview(URL.createObjectURL(file));
                      }}
                    />
                  </label>
                )}
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
                  Set as Active SubCategory
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
                  {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {actionLoading
                    ? "Saving..."
                    : editingSubCategory
                    ? "Update SubCategory"
                    : "Create SubCategory"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}