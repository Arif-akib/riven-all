"use client";

import { useEffect, useState } from "react";
import API from "@/lib/axios";
import toast from "react-hot-toast";

type Offer = {
  _id: string;
  title: string;
  subtitle?: string;
  discount?: string;
  image?: string;
  order?: number;
  isActive?: boolean;
  expiryDate?: string;
};

export default function OfferCMS() {
  const [list, setList] = useState<Offer[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Offer | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [form, setForm] = useState<any>({
    title: "",
    subtitle: "",
    discount: "",
    order: 0,
    isActive: false,
    expiryDate: "",
    image: "",
  });

  // ---------------- FETCH ----------------
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await API.get("/cms/offer/admin/list");
        setList(res.data.data);
      } catch (err) {
        toast.error("Failed to load offers");
      }
    };

    fetchOffers();
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

      formData.append("title", form.title);
      formData.append("subtitle", form.subtitle);
      formData.append("discount", form.discount);
      formData.append("buttonLink", form.buttonLink);
      formData.append("order", String(form.order || 0));
      formData.append("isActive", String(form.isActive));
      formData.append("expiryDate", form.expiryDate);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const url = editing
        ? `/cms/offer/admin/update/${editing._id}`
        : `/cms/offer/admin/create`;

      const method = editing ? "patch" : "post";

      const res = await API[method](url, formData);

      if (res.data.success) {
        toast.success(editing ? "Offer updated" : "Offer created");

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
  const handleEdit = (item: Offer) => {
    setEditing(item);

    setForm({
      title: item.title,
      subtitle: item.subtitle,
      discount: item.discount,
      order: item.order,
      isActive: item.isActive,
      expiryDate: item.expiryDate ? item.expiryDate.split("T")[0] : "",
      image: item.image,
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
      title: "",
      subtitle: "",
      discount: "",
      order: 0,
      isActive: false,
      expiryDate: "",
      image: "",
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Offer Banners</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage promotional discounts, deal campaigns, and expiration deadlines.
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="bg-amber-900 hover:bg-amber-950 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition shadow-xs flex items-center justify-center gap-1.5"
        >
          <span>+</span> Create Offer
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
            <div className="absolute top-3 left-3 z-10">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] rounded-full font-semibold backdrop-blur-md ${
                  item.isActive
                    ? "bg-emerald-500/90 text-white"
                    : "bg-gray-900/60 text-white"
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

            {/* BADGE: DISPLAY ORDER */}
            <div className="absolute top-3 right-3 z-10">
              <span className="bg-black/60 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-md">
                Order: #{item.order ?? 0}
              </span>
            </div>

            <div>
              {/* IMAGE CONTAINER */}
              <div className="w-full h-44 bg-gray-100 relative overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                    No image available
                  </div>
                )}
                {item.discount && (
                  <span className="absolute bottom-3 left-3 bg-amber-900 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                    {item.discount}
                  </span>
                )}
              </div>

              {/* DETAILS */}
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-gray-900 text-sm truncate">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {item.subtitle}
                  </p>
                )}

                {/* EXPIRY DATE */}
                <div className="pt-2 flex items-center justify-between border-t border-gray-50 text-xs">
                  <span className="text-gray-400 font-medium text-[11px]">
                    Expires:
                  </span>
                  <span className="text-gray-700 font-medium text-[11px]">
                    {item.expiryDate
                      ? new Date(item.expiryDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "No Expiration"}
                  </span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTON */}
            <div className="p-4 pt-0">
              <button
                onClick={() => handleEdit(item)}
                className="w-full px-3 py-2 border border-gray-200 hover:border-amber-900 hover:text-amber-900 rounded-lg text-xs font-semibold text-gray-700 transition text-center"
              >
                Edit Offer
              </button>
            </div>
          </div>
        ))}
      </div>

      {list.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center text-gray-400 text-xs">
          No offers available. Click "+ Create Offer" to publish a new discount promotion.
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
                  {editing ? "Edit Offer" : "Create New Offer"}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Configure discount information, media visuals, and campaign schedules.
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-lg transition"
              >
                ✕
              </button>
            </div>

            {/* MODAL FORM */}
            <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
              <div className="space-y-4">
                {/* TITLE */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">
                    Offer Title
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Headline title..."
                    className="w-full border border-gray-200 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 rounded-lg px-3 py-2 text-xs outline-none transition"
                  />
                </div>

                {/* SUBTITLE */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">
                    Subtitle / Description
                  </label>
                  <input
                    name="subtitle"
                    value={form.subtitle}
                    onChange={handleChange}
                    placeholder="Brief description of the promotion..."
                    className="w-full border border-gray-200 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 rounded-lg px-3 py-2 text-xs outline-none transition"
                  />
                </div>

                {/* DISCOUNT */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">
                    Discount Label
                  </label>
                  <input
                    name="discount"
                    value={form.discount}
                    onChange={handleChange}
                    placeholder="e.g., 20% OFF or Save $50"
                    className="w-full border border-gray-200 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 rounded-lg px-3 py-2 text-xs outline-none transition"
                  />
                </div>

                {/* IMAGE UPLOAD ZONE */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">
                    Offer Visual Image
                  </label>

                  {preview ? (
                    <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-44 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setPreview(null);
                        }}
                        className="absolute top-3 right-3 bg-black/70 hover:bg-black text-white px-3 py-1 text-xs rounded-full font-medium backdrop-blur-md transition"
                      >
                        Change Image
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <div className="border border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50/50 hover:bg-gray-100/60 transition space-y-1">
                        <p className="text-xs font-medium text-amber-900">
                          Click to upload offer banner image
                        </p>
                        <p className="text-[11px] text-gray-400">
                          PNG, JPG, or WEBP up to high resolution
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          setImageFile(file);
                          setPreview(URL.createObjectURL(file));
                        }}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* EXPIRY DATE & ORDER */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">
                      Expiration Date
                    </label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={form.expiryDate}
                      onChange={handleChange}
                      className="w-full border border-gray-200 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 rounded-lg px-3 py-2 text-xs outline-none transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">
                      Display Priority Index
                    </label>
                    <input
                      type="number"
                      name="order"
                      value={form.order}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full border border-gray-200 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 rounded-lg px-3 py-2 text-xs outline-none transition"
                    />
                  </div>
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
                    ? "Update Offer"
                    : "Create Offer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}