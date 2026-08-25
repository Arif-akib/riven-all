"use client";

import { useEffect, useState } from "react";
import API from "@/lib/axios";
import toast from "react-hot-toast";

type Promotion = {
  _id: string;
  name: string;
  isActive?: boolean;
};

export default function PromotionCMS() {
  const [list, setList] = useState<Promotion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Promotion | null>(null);

  const [form, setForm] = useState({
    name: "",
    isActive: false,
  });

  // ---------------- FETCH ----------------
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await API.get("/cms/promotion/admin/list");
        setList(res.data.data);
      } catch {
        toast.error("Failed to load promotions");
      }
    };

    fetchPromotions();
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

      if (!form.name) {
        toast.error("Title is required");
        return;
      }

      const payload = {
        name: form.name,
        isActive: Boolean(form.isActive),
      };

      const url = editing
        ? `/cms/promotion/admin/update/${editing._id}`
        : `/cms/promotion/admin/create`;

      const method = editing ? "patch" : "post";

      const res = await API[method](url, payload);

      if (res.data.success) {
        toast.success(editing ? "Promotion updated" : "Promotion created");

        setList((prev) => {
          if (editing) {
            return prev.map((p) =>
              p._id === editing._id ? res.data.data : p
            );
          }
          return [res.data.data, ...prev];
        });

        closeModal();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- EDIT ----------------
  const handleEdit = (item: Promotion) => {
    setEditing(item);

    setForm({
      name: item.name,
      isActive: item.isActive || false,
    });

    setOpen(true);
  };

  // ---------------- CLOSE ----------------
  const closeModal = () => {
    setOpen(false);
    setEditing(null);

    setForm({
      name: "",
      isActive: false,
    });
  };

  return (
    <div className="space-y-6 p-2">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-amber-900">
          Promotions
        </h2>

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
            className="group flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-3 shadow-sm hover:shadow-md transition relative"
          >
            {item.isActive && (
              <span className="absolute top-0 left-0 size-4 bg-amber-900 rounded-full" />
            )}

            <p className="font-semibold">{item.name}</p>

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
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-white">
              <h3 className="text-lg font-semibold text-gray-900">
                {editing ? "Update Promotion" : "Create Promotion"}
              </h3>

              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-900 text-xl"
              >
                ✕
              </button>
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
                  placeholder="name"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm
                  focus:bg-white focus:border-gray-400 focus:ring-2 focus:ring-[#7a001f]/20
                  outline-none transition"
                />

                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                    className="accent-[#7a001f]"
                  />
                  Active Promotion
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#7a001f] py-3 text-white font-semibold shadow-md
                hover:opacity-90 active:scale-[0.99] transition disabled:opacity-60"
              >
                {loading
                  ? "Saving..."
                  : editing
                  ? "Update Promotion"
                  : "Create Promotion"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}