"use client";

import { useEffect, useState, useMemo } from "react";
import API from "@/lib/axios";
import toast from "react-hot-toast";
import { steadfastLocations } from "@/store/address"; // Adjust this import path if needed

export default function AddressPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    street: "",
    city: "",      // Stores Division name
    zip: "",       // Stores District name
    country: "",   // Stores Area name
    isDefault: false,
  });

  // ---------------- LOCATION MEMOS ----------------
  const divisions = useMemo(() => {
    return [...new Set(steadfastLocations.map((item:any) => item.division))];
  }, []);

  const districts = useMemo(() => {
    if (!form.city) return [];
    return [
      ...new Set(
        steadfastLocations
          .filter((item:any) => item.division === form.city)
          .map((item:any) => item.district)
      ),
    ];
  }, [form.city]);

  const areas = useMemo(() => {
    if (!form.city || !form.zip) return [];
    return steadfastLocations.filter(
      (item:any) => item.division === form.city && item.district === form.zip
    );
  }, [form.city, form.zip]);

  // ---------------- FETCH ----------------
  const fetchAddresses = async () => {
    try {
      const res = await API.get("/user/customer/address");
      setAddresses(res.data.addresses || []);
    } catch (err) {
      toast.error("Failed to fetch addresses");
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // ---------------- FORM HANDLERS ----------------
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "city") {
      // Changing Division resets District and Area
      setForm((prev) => ({
        ...prev,
        city: value,
        zip: "",
        country: "",
      }));
    } else if (name === "zip") {
      // Changing District resets Area
      setForm((prev) => ({
        ...prev,
        zip: value,
        country: "",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
      title: addr.title || "",
      street: addr.street || "",
      city: addr.city || "",
      zip: addr.zip || "",
      country: addr.country || "",
      isDefault: addr.isDefault || false,
    });
    setOpen(true);
  };

  // ---------------- SAVE (CREATE + EDIT) ----------------
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.title || !form.city || !form.zip || !form.country || !form.street) {
      toast.error("Please fill in all location fields");
      return;
    }

    setLoading(true);

    try {
      if (editing) {
        // UPDATE
        const res = await API.put(
          `/user/customer/address/${editing._id}`,
          form
        );

        setAddresses((prev) =>
          prev.map((a) => (a._id === editing._id ? res.data : a))
        );

        if (form.isDefault) {
          setAddresses((prev) =>
            prev.map((a) => ({
              ...a,
              isDefault: a._id === res.data._id,
            }))
          );
        }
        toast.success("Address updated");
      } else {
        // CREATE
        const res = await API.post("/user/customer/address", form);
        
        if (form.isDefault) {
          setAddresses((prev) =>
            prev.map((a) => ({ ...a, isDefault: false }))
          );
        }
        
        setAddresses((prev) => [...prev, res.data]);
        toast.success("Address added");
      }

      setOpen(false);
    } catch (err) {
      toast.error("Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- DELETE ----------------
  const confirmDelete = async () => {
    if (!deleteId) return;
    if (addresses.length < 2) {
      toast.error("You must have at least 1 address")
      return
    }

    try {
      await API.delete(`/user/customer/address/${deleteId}`);
      setAddresses((prev) => prev.filter((a) => a._id !== deleteId));
      toast.success("Address deleted");
    } catch (err) {
      toast.error("Failed to delete address");
    } finally {
      setDeleteId(null);
    }
  };

  // ---------------- SET DEFAULT ----------------
  const setDefault = async (id: string) => {
    try {
      await API.patch(`/user/customer/address/default/${id}`);
      setAddresses((prev) =>
        prev.map((a) => ({
          ...a,
          isDefault: a._id === id,
        }))
      );
      toast.success("Default address updated");
    } catch (err) {
      toast.error("Failed to set default address");
    }
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
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-linear-to-br from-black/5 via-transparent to-amber-500/5 pointer-events-none" />

              {/* DEFAULT BADGE */}
              {addr.isDefault && (
                <div className="absolute top-2 right-2 z-0">
                  <span className="bg-amber-800 text-amber-100 text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                    Default
                  </span>
                </div>
              )}

              {/* ICON + TITLE */}
              <div className="flex items-start gap-3 mb-3 relative capitalize">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-black group-hover:text-white transition">
                  📍
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-black transition">
                    {addr.title}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                    {addr.street}, {addr.country}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {addr.zip}, {addr.city}
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 mt-5 relative">
                <button
                  onClick={() => openEdit(addr)}
                  className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition font-medium cursor-pointer"
                >
                  Edit
                </button>

                <button
                  onClick={() => setDeleteId(addr._id)}
                  className="flex-1 px-3 py-2 text-sm rounded-xl border border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 transition font-medium cursor-pointer"
                >
                  Delete
                </button>
              </div>

              {/* DEFAULT ACTION */}
              {!addr.isDefault && (
                <button
                  onClick={() => setDefault(addr._id)}
                  className="w-full mt-3 text-sm font-medium text-amber-800 hover:text-amber-900 transition flex items-center justify-center gap-1 cursor-pointer"
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

      {/* EMPTY STATE */}
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-2xl w-80 shadow-xl">
            <h3 className="text-lg font-semibold mb-2">Delete Address?</h3>
            <p className="text-sm text-gray-500 mb-4">
              This action cannot be undone.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-xl mx-4 animate-in fade-in zoom-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* HEADER */}
              <div className="px-6 py-5 border-b bg-linear-to-r from-gray-50 to-white">
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
                  {/* TITLE */}
                  <div>
                    <label className="text-xs text-gray-500">Title</label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Home, Office"
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition bg-white"
                    />
                  </div>

                  {/* DIVISION (city) */}
                  <div>
                    <label className="text-xs text-gray-500">Division</label>
                    <select
                      name="city"
                      value={form.city}
                      onChange={handleSelectChange}
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition bg-white cursor-pointer text-sm"
                    >
                      <option value="">Select Division</option>
                      {divisions.map((div) => (
                        <option key={div} value={div}>
                          {div}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* DISTRICT (zip) */}
                  <div>
                    <label className="text-xs text-gray-500">District</label>
                    <select
                      name="zip"
                      value={form.zip}
                      onChange={handleSelectChange}
                      disabled={!form.city}
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition bg-white disabled:bg-gray-100 cursor-pointer text-sm"
                    >
                      <option value="">Select District</option>
                      {districts.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* AREA (country) */}
                  <div>
                    <label className="text-xs text-gray-500">Area</label>
                    <select
                      name="country"
                      value={form.country}
                      onChange={handleSelectChange}
                      disabled={!form.zip}
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition bg-white disabled:bg-gray-100 cursor-pointer text-sm"
                    >
                      <option value="">Select Area</option>
                      {areas.map((loc) => (
                        <option key={loc.id} value={loc.area}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* STREET ADDRESS */}
                  <div className="md:col-span-2">
                    <label className="text-xs text-gray-500">
                      Street Address
                    </label>
                    <input
                      name="street"
                      value={form.street}
                      onChange={handleChange}
                      placeholder="House, Road details"
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition bg-white"
                    />
                  </div>
                </div>

                {/* DEFAULT CHECKBOX */}
                <label className="flex items-center gap-3 mt-2 p-3 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer hover:bg-gray-100 transition accent-amber-700">
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
                    className="flex-1 py-2.5 rounded-xl bg-amber-900 text-white hover:bg-amber-700 transition shadow-md disabled:opacity-50"
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