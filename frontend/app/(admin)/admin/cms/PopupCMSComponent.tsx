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
    <div className="space-y-6 p-2">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-amber-900">Popup Banners</h2>

        <button
          onClick={() => setOpen(true)}
          className="bg-amber-900 text-white px-5 py-1.5 rounded-xl text-xs"
        >
          Create
        </button>
      </div>

      {/* LIST */}
      <div className="grid grid-cols-3 gap-4">
        {list.map((item) => (
          <div
            key={item._id}
            className="group flex items-center justify-between gap-4 rounded-xl border bg-white p-2 shadow-sm hover:shadow-md transition relative"
          >
            {item.isActive && (
              <span className="absolute top-0 left-0 size-4 bg-amber-900 rounded-full" />
            )}

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden border bg-gray-100">
                <img src={item.image} className="w-full h-full object-cover" />
              </div>

              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleEdit(item)}
              className="bg-[#7a001f] text-white px-3 py-1 rounded-lg text-xs"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border overflow-hidden">
            {/* HEADER */}
            <div className="flex justify-between px-6 py-4 border-b bg-gray-50">
              <h3 className="font-semibold">
                {editing ? "Update Popup" : "Create Popup"}
              </h3>
              <button onClick={closeModal}>✕</button>
            </div>

            {/* BODY */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5 max-h-[70vh] overflow-y-auto"
            >
              <div className="grid gap-4">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Title"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:bg-white focus:border-gray-400 focus:ring-2 focus:ring-[#7a001f]/20 outline-none transition"
                />

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Description"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:bg-white focus:border-gray-400 focus:ring-2 focus:ring-[#7a001f]/20 outline-none transition"
                />

                {/* IMAGE */}
                <label className="cursor-pointer">
                  <div className="border border-dashed border-gray-300 rounded-xl p-4 text-center bg-gray-50 hover:bg-gray-100 transition text-sm text-gray-600">
                    Upload popup image
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

                {preview && (
                  <div className="relative">
                    <img
                      src={preview}
                      className="h-44 w-full object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setImageFile(null);
                      }}
                      className="absolute top-2 right-2 bg-black text-white px-2 py-1 text-xs rounded"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <label className="flex gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                  />
                  Active Popup
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#7a001f] text-white py-3 rounded-lg"
              >
                {loading
                  ? "Saving..."
                  : editing
                    ? "Update Popup"
                    : "Create Popup"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
