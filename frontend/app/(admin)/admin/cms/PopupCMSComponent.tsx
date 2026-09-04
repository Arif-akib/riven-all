"use client";

import { useEffect, useState } from "react";
import API from "@/lib/axios";
import toast from "react-hot-toast";

type Popup = {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  isActive?: boolean;
};

export default function PopupCMS() {
  const [list, setList] = useState<Popup[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Popup | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    isActive: false,
    image: "",
  });

  // ---------------- FETCH ----------------
  useEffect(() => {
    const fetchPopups = async () => {
      try {
        const res = await API.get("/cms/popup/admin/list");
        setList(res.data.data);
      } catch {
        toast.error("Failed to load popups");
      }
    };

    fetchPopups();
  }, []);

  // ---------------- CHANGE ----------------
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("isActive", String(form.isActive));

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const url = editing
        ? `/cms/popup/admin/update/${editing._id}`
        : `/cms/popup/admin/create`;

      const method = editing ? "patch" : "post";

      const res = await API[method](url, formData);

      if (res.data.success) {
        toast.success(editing ? "Popup updated" : "Popup created");

        setList((prev) => {
          if (editing) {
            return prev.map((p) => (p._id === editing._id ? res.data.data : p));
          }
          return [res.data.data, ...prev];
        });

        closeModal();
      } else {
        toast.error(res.data.message);
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err?.message || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------- EDIT ----------------
  const handleEdit = (item: Popup) => {
    setEditing(item);

    setForm({
      name: item.name,
      description: item.description || "",
      isActive: item.isActive || false,
      image: item.image || "",
    });

    setPreview(item.image || null);
    setOpen(true);
  };

  // ---------------- CLOSE ----------------
  const closeModal = () => {
    setOpen(false);
    setEditing(null);
    setImageFile(null);
    setPreview(null);

    setForm({
      name: "",
      description: "",
      isActive: false,
      image: "",
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Popup Banners</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage store promotional popups, announcements, and active status.
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="bg-amber-900 hover:bg-amber-950 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition shadow-xs flex items-center justify-center gap-1.5"
        >
          <span>+</span> Create Popup
        </button>
      </div>

      {/* GRID LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {list.map((item) => (
          <div
            key={item._id}
            className="group bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition relative"
          >
            {/* BADGE: ACTIVE STATUS */}
            <div className="absolute top-3 right-3 z-10">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] rounded-full font-semibold backdrop-blur-md shadow-xs ${
                  item.isActive
                    ? "bg-emerald-500/90 text-white"
                    : "bg-gray-900/70 text-gray-200"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    item.isActive ? "bg-white" : "bg-gray-400"
                  }`}
                />
                {item.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="space-y-3">
              {/* IMAGE PREVIEW AREA */}
              <div className="w-full h-40 bg-gray-100 relative overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 italic">
                    No image uploaded
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="p-4 pt-1 space-y-1">
                <h3 className="font-bold text-gray-900 text-sm truncate">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 min-h-[2.25rem]">
                  {item.description || "No description provided."}
                </p>
              </div>
            </div>

            {/* CARD ACTION */}
            <div className="p-4 pt-0">
              <button
                onClick={() => handleEdit(item)}
                className="w-full px-3 py-2 border border-gray-200 hover:border-amber-900 hover:text-amber-900 rounded-lg text-xs font-semibold text-gray-700 transition text-center"
              >
                Edit Popup
              </button>
            </div>
          </div>
        ))}
      </div>

      {list.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center text-gray-400 text-xs">
          No popups found. Click "+ Create Popup" to add your first promotional banner.
        </div>
      )}

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl space-y-6">
            {/* MODAL HEADER */}
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {editing ? "Update Popup Banner" : "Create New Popup Banner"}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Set banner title, description, display image, and visibility status.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-lg transition"
              >
                ✕
              </button>
            </div>

            {/* MODAL FORM */}
            <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
              <div className="space-y-4">
                {/* NAME */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">
                    Popup Title
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Summer Sale Announcement"
                    className="w-full border border-gray-200 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 rounded-lg px-3 py-2 text-xs outline-none transition"
                  />
                </div>

                {/* DESCRIPTION */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Brief popup message or promotional copy..."
                    rows={3}
                    className="w-full border border-gray-200 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 rounded-lg px-3 py-2 text-xs outline-none transition resize-none"
                  />
                </div>

                {/* IMAGE UPLOAD */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-600">
                    Popup Image
                  </label>
                  
                  <label className="cursor-pointer block">
                    <div className="border border-dashed border-gray-300 hover:border-amber-900 rounded-xl p-4 text-center bg-gray-50 hover:bg-gray-100/60 transition text-xs text-gray-600 flex flex-col items-center justify-center gap-1">
                      <span className="font-medium text-amber-900">Click to upload image</span>
                      <span className="text-[11px] text-gray-400">PNG, JPG, or WEBP</span>
                    </div>

                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setImageFile(file);
                        setPreview(URL.createObjectURL(file));
                      }}
                    />
                  </label>

                  {/* PREVIEW */}
                  {preview && (
                    <div className="relative rounded-xl overflow-hidden border border-gray-200 mt-2">
                      <img
                        src={preview}
                        alt="Preview"
                        className="h-44 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreview(null);
                          setImageFile(null);
                        }}
                        className="absolute top-2 right-2 bg-gray-900/80 hover:bg-gray-900 text-white px-2.5 py-1 text-xs rounded-md transition shadow-sm"
                      >
                        Remove Image
                      </button>
                    </div>
                  )}
                </div>

                {/* ACTIVE STATUS CHECKBOX */}
                <div className="pt-1">
                  <label className="flex items-center gap-2.5 text-xs text-gray-700 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={form.isActive}
                      onChange={handleChange}
                      className="w-4 h-4 rounded accent-amber-900 cursor-pointer"
                    />
                    Active (Enable popup for storefront visitors)
                  </label>
                </div>
              </div>

              {/* MODAL ACTIONS */}
              <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white z-10">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-xs font-semibold border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-amber-900 hover:bg-amber-950 text-white text-xs font-semibold px-5 py-2 rounded-lg transition disabled:opacity-60"
                >
                  {loading
                    ? "Saving..."
                    : editing
                    ? "Update Popup"
                    : "Create Popup"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}