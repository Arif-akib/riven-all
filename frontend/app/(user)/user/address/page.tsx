"use client";

import { useEffect, useState } from "react";
import API from "@/lib/axios";
import toast from "react-hot-toast";

export default function AddressPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    street: "",
    city: "",
    zip: "",
    country: "",
    isDefault: false,
  });

  // ---------------- FETCH ----------------
  const fetchAddresses = async () => {
    const res = await API.get("/user/customer/address");
    setAddresses(res.data.addresses || []);
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // ---------------- FORM ----------------
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ---------------- OPEN MODAL ----------------
  const openCreate = () => {
    setEditing(null);
    setForm({
      title: "",
      street: "",
      city: "",
      zip: "",
      country: "",
      isDefault: false,
    });
    setOpen(true);
  };

  const openEdit = (addr: any) => {
    setEditing(addr);
    setForm({
      title: addr.title,
      street: addr.street,
      city: addr.city,
      zip: addr.zip || "",
      country: addr.country,
      isDefault: addr.isDefault,
    });
    setOpen(true);
  };

  // ---------------- SAVE (CREATE + EDIT) ----------------
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (editing) {
        // UPDATE
        const res = await API.put(
          `/user/customer/address/${editing._id}`,
          form,
        );

        setAddresses((prev) =>
          prev.map((a) => (a._id === editing._id ? res.data : a)),
        );

        setAddresses((prev) =>
          prev.map((a) => ({
            ...a,
            isDefault: a._id === res.data._id ? true : false,
          })),
        );
      } else {
        // CREATE
        if (!form.title || !form.city || !form.country || !form.street) {
          toast.error("Title , city , street and country can not be empty");
          return;
        }
        const res = await API.post("/user/customer/address", form);
        setAddresses((prev) => [...prev, res.data]);

        setAddresses((prev) =>
          prev.map((a) => ({
            ...a,
            isDefault: a._id === res.data._id ? true : false,
          })),
        );
      }

      setOpen(false);
    } catch (err) {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- DELETE ----------------
  const confirmDelete = async () => {
    if (!deleteId) return;

    await API.delete(`/user/customer/address/${deleteId}`);

    setAddresses((prev) => prev.filter((a) => a._id !== deleteId));
    setDeleteId(null);
  };

  // ---------------- SET DEFAULT ----------------
  const setDefault = async (id: string) => {
    await API.patch(`/user/customer/address/default/${id}`);

    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a._id === id,
      })),
    );
  };

  return (
    <div className="">
      {addresses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className="group relative bg-white border border-gray-200 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* subtle background glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-black/5 via-transparent to-amber-500/5 pointer-events-none" />

              {/* DEFAULT BADGE */}
              {addr.isDefault && (
                <div className="absolute top-2 right-2 z-10">
                  <span className="bg-amber-900 text-amber-100 text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                    Default
                  </span>
                </div>
              )}

              {/* ICON + TITLE */}
              <div className="flex items-start gap-3 mb-3 relative">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-black group-hover:text-white transition">
                  📍
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-black transition">
                    {addr.title}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                    {addr.street}, {addr.city}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">{addr.country}</p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 mt-5 relative">
                <button
                  onClick={() => openEdit(addr)}
                  className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition font-medium"
                >
                  Edit
                </button>

                <button
                  onClick={() => setDeleteId(addr._id)}
                  className="flex-1 px-3 py-2 text-sm rounded-xl border border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 transition font-medium"
                >
                  Delete
                </button>
              </div>

              {/* DEFAULT ACTION */}
              {!addr.isDefault && (
                <button
                  onClick={() => setDefault(addr._id)}
                  className="w-full mt-3 text-sm font-medium text-blue-600 hover:text-blue-800 transition flex items-center justify-center gap-1"
                >
                  Make Default
                  <span className="text-xs">→</span>
                </button>
              )}
            </div>
          ))}

          {/* ADD CARD */}
          <div
            onClick={openCreate}
            className="group cursor-pointer border-2 border-dashed border-black/40 rounded-3xl flex flex-col items-center justify-center p-8 text-center hover:border-black hover:bg-gray-50 transition"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition">
              +
            </div>
            <p className="font-medium text-gray-700">Add New Address</p>
            <p className="text-xs text-gray-400 mt-1">
              Save home, office or other location
            </p>
          </div>
        </div>
      )}
      {/* EMPTY STATE (important UX fix) */}
      {addresses.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-3">📍</div>
          <h2 className="text-xl font-semibold">No addresses found</h2>
          <p className="text-gray-500 mt-1">Add your first delivery location</p>

          <button
            onClick={openCreate}
            className="mt-5 px-5 py-2 bg-black text-white rounded-lg"
          >
            Add Address
          </button>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl w-80 shadow-xl">
            <h3 className="text-lg font-semibold mb-2">Delete Address?</h3>
            <p className="text-sm text-gray-500 mb-4">
              This action cannot be undone.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-3 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-xl mx-4 animate-in fade-in zoom-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* HEADER */}
              <div className="px-6 py-5 border-b bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editing ? "Edit Address" : "Add New Address"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Fill in the details below to save your location
                </p>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">Title</label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Home, Office"
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500">City</label>
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Dhaka"
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs text-gray-500">
                      Street Address
                    </label>
                    <input
                      name="street"
                      value={form.street}
                      onChange={handleChange}
                      placeholder="House, Road, Area"
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500">Zip Code</label>
                    <input
                      name="zip"
                      value={form.zip}
                      onChange={handleChange}
                      placeholder="1200"
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500">Country</label>
                    <input
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      placeholder="Bangladesh"
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition"
                    />
                  </div>
                </div>

                {/* DEFAULT CHECKBOX */}
                <label className="flex items-center gap-3 mt-2 p-3 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer hover:bg-gray-100 transition">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={form.isDefault}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">
                    Set as default address
                  </span>
                </label>

                {/* ACTIONS */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 transition text-gray-700"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-xl bg-amber-900 text-white hover:bg-amber-700 transition shadow-md"
                  >
                    {loading
                      ? "Saving..."
                      : editing
                        ? "Update Address"
                        : "Save Address"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
