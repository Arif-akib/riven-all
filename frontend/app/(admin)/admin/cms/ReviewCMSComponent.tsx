"use client";

import { useEffect, useState } from "react";
import API from "@/lib/axios";
import toast from "react-hot-toast";

type Review = {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  isActive?: boolean;
};

export default function ReviewCMS() {
  const [list, setList] = useState<Review[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Review | null>(null);

  const [form, setForm] = useState({
    name: "",
    rating: 5,
    comment: "",
    isActive: false,
  });

  // ---------------- FETCH ----------------
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await API.get("/cms/review/admin/list");
        setList(res.data.data);
      } catch {
        toast.error("Failed to load reviews");
      }
    };

    fetchReviews();
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

      if (!form.name || !form.comment) {
        toast.error("Name and comment required");
        return;
      }

      const payload = {
        name: form.name,
        rating: Number(form.rating),
        comment: form.comment,
        isActive: Boolean(form.isActive),
      };

      const url = editing
        ? `/cms/review/admin/update/${editing._id}`
        : `/cms/review/admin/create`;

      const method = editing ? "patch" : "post";

      const res = await API[method](url, payload);

      if (res.data.success) {
        toast.success(editing ? "Review updated" : "Review created");

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
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- EDIT ----------------
  const handleEdit = (item: Review) => {
    setEditing(item);

    setForm({
      name: item.name,
      rating: item.rating,
      comment: item.comment,
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
      rating: 5,
      comment: "",
      isActive: false,
    });
  };

  return (
    <div className="space-y-6 p-2">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-amber-900">Reviews</h2>

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
            className="rounded-xl bg-white p-4 shadow hover:shadow-md transition flex justify-between items-start relative"
            >
                {item.isActive && (
              <p className="text-xs bg-amber-900 absolute size-4 text-white rounded-full top-0 left-0"></p>
            )}
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-yellow-500 text-sm">
                {"⭐".repeat(item.rating)}
              </p>
              <p className="text-xs text-gray-500 line-clamp-2">
                {item.comment}
              </p>
            </div>

            <button
              onClick={() => handleEdit(item)}
              className="text-xs bg-[#7a001f] text-white px-3 py-1 rounded-lg"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-linear-to-r from-gray-50 to-white">
              <h3 className="text-lg font-semibold text-gray-900">
                {editing ? "Update Review" : "Create Review"}
              </h3>

              <button
                type="button"
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
                {/* NAME */}
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="User Name"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:bg-white focus:border-gray-400 focus:ring-2 focus:ring-[#7a001f]/20 outline-none transition"
                />

                {/* RATING */}
                <select
                  name="rating"
                  value={form.rating}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:bg-white focus:border-gray-400 focus:ring-2 focus:ring-[#7a001f]/20 outline-none transition"
                >
                  {[1, 2, 3, 4, 5].map((r) => (
                    <option key={r} value={r}>
                      {r} Star
                    </option>
                  ))}
                </select>

                {/* COMMENT */}
                <textarea
                  name="comment"
                  value={form.comment}
                  onChange={handleChange}
                  placeholder="Write review..."
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:bg-white focus:border-gray-400 focus:ring-2 focus:ring-[#7a001f]/20 outline-none transition"
                />

                {/* ACTIVE */}
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                    className="accent-[#7a001f]"
                  />
                  Active Review
                </label>
              </div>

              {/* FOOTER BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#7a001f] py-3 text-white font-semibold shadow-md
        hover:opacity-90 active:scale-[0.99] transition disabled:opacity-60"
              >
                {loading
                  ? "Saving..."
                  : editing
                    ? "Update Review"
                    : "Create Review"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
