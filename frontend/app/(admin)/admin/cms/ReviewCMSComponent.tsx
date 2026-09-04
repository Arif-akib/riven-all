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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Customer Reviews</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage store testimonials, customer ratings, and visibility settings.
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="bg-amber-900 hover:bg-amber-950 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition shadow-xs flex items-center justify-center gap-1.5"
        >
          <span>+</span> Create Review
        </button>
      </div>

      {/* GRID LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {list.map((item) => (
          <div
            key={item._id}
            className="group bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition relative"
          >
            {/* BADGE: ACTIVE STATUS */}
            <div className="absolute top-3 right-3">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] rounded-full font-semibold ${
                  item.isActive
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                    : "bg-gray-100 text-gray-500 border border-gray-200/60"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    item.isActive ? "bg-emerald-500" : "bg-gray-400"
                  }`}
                />
                {item.isActive ? "Published" : "Draft"}
              </span>
            </div>

            <div className="space-y-3 pr-16">
              {/* AUTHOR & RATING */}
              <div>
                <h3 className="font-bold text-gray-900 text-sm truncate">
                  {item.name}
                </h3>
                <div className="flex items-center gap-1 mt-1 text-amber-500 text-xs">
                  {"★".repeat(item.rating)}
                  {"☆".repeat(Math.max(0, 5 - item.rating))}
                  <span className="text-[11px] font-semibold text-gray-500 ml-1">
                    ({item.rating}.0)
                  </span>
                </div>
              </div>

              {/* COMMENT */}
              <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                "{item.comment}"
              </p>
            </div>

            {/* CARD ACTION */}
            <div className="pt-4 mt-2 border-t border-gray-100">
              <button
                onClick={() => handleEdit(item)}
                className="w-full px-3 py-2 border border-gray-200 hover:border-amber-900 hover:text-amber-900 rounded-lg text-xs font-semibold text-gray-700 transition text-center"
              >
                Edit Review
              </button>
            </div>
          </div>
        ))}
      </div>

      {list.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center text-gray-400 text-xs">
          No reviews found. Click "+ Create Review" to add your first customer feedback item.
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
                  {editing ? "Edit Review" : "Create New Review"}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Configure author details, star rating, and review comments.
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
                    Reviewer Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Jane Doe"
                    className="w-full border border-gray-200 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 rounded-lg px-3 py-2 text-xs outline-none transition"
                  />
                </div>

                {/* RATING */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">
                    Star Rating
                  </label>
                  <select
                    name="rating"
                    value={form.rating}
                    onChange={handleChange}
                    className="w-full border border-gray-200 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 rounded-lg px-3 py-2 text-xs outline-none transition bg-white"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r} {r === 1 ? "Star" : "Stars"} {"★".repeat(r)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* COMMENT */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">
                    Review Content
                  </label>
                  <textarea
                    name="comment"
                    value={form.comment}
                    onChange={handleChange}
                    placeholder="Customer testimonial or review feedback..."
                    rows={4}
                    className="w-full border border-gray-200 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 rounded-lg px-3 py-2 text-xs outline-none transition resize-none"
                  />
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
                    Active (Visible on Storefront)
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
                    ? "Update Review"
                    : "Create Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}