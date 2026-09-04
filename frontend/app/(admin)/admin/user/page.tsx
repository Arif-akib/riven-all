"use client";

import API from "@/lib/axios";
import { useEffect, useState } from "react";

import {
  Edit2,
} from "lucide-react";

type Address = {
  title: string;
  street: string;
  city: string;
  country: string;
  zip?: string;
  isDefault: boolean;
};

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  isAdmin: boolean;
  status: boolean;
  addresses: Address[];
};

type UserForm = {
  name: string;
  email: string;
  password: string;
  phone: string;
  isAdmin: boolean;
  status: boolean;
  addresses: Address[];
};

type Filters = {
  search: string;
  isAdmin: "" | "user" | "admin";
};

type AddressInput = Address;
type FormField = "name" | "email" | "password" | "phone";

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const fields: FormField[] = ["name", "email", "password", "phone"];

  const [filters, setFilters] = useState<Filters>({
    search: "",
    isAdmin: "",
  });

  const [form, setForm] = useState<UserForm>({
    name: "",
    email: "",
    password: "",
    phone: "",
    isAdmin: false,
    status: false,
    addresses: [],
  });

  const [addressInput, setAddressInput] = useState<AddressInput>({
    title: "",
    street: "",
    city: "",
    country: "",
    zip: "",
    isDefault: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "isAdmin"
          ? value === "true"
          : name === "status"
            ? value === "true"
            : value,
    }));
  };

  const addAddress = () => {
    if (!addressInput.street || !addressInput.city || !addressInput.country) {
      alert("Street, city, country required");
      return;
    }

    setForm((prev) => {
      let updated = [...prev.addresses];

      if (addressInput.isDefault) {
        updated = updated.map((a) => ({ ...a, isDefault: false }));
      }

      return {
        ...prev,
        addresses: [...updated, addressInput],
      };
    });

    setAddressInput({
      title: "",
      street: "",
      city: "",
      country: "",
      zip: "",
      isDefault: false,
    });
  };

  const handleSubmitUser = async () => {
    console.log(form);

    if (!form.name || !form.email || !form.phone) {
      alert("Required fields missing");
      return;
    }

    if (form.status === undefined || form.status === null) {
      alert("Status required");
      return;
    }

    try {
      const payload = {
        ...form,
      };

      if (editingUser) {
        const res = await API.post(
          `/user/admin/update/${editingUser.id}`,
          payload
        );

        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? res.data.data : u))
        );
      } else {
        const res = await API.post("/user/admin/create", payload);
        setUsers((prev) => [...prev, res.data.data]);
      }

      resetForm();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setEditingUser(null);
    setForm({
      name: "",
      email: "",
      password: "",
      phone: "",
      isAdmin: false,
      status: false,
      addresses: [],
    });
  };

  const filteredUsers = users.filter((u) => {
    const q = filters.search.toLowerCase();

    const matchSearch =
      u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);

    const matchRole =
      filters.isAdmin === ""
        ? true
        : filters.isAdmin === "admin"
          ? u.isAdmin === true
          : u.isAdmin === false;

    return matchSearch && matchRole;
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/user/admin/list");
        setUsers(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900">User Directory</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage user permissions, status, and saved address information.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-amber-900 hover:bg-amber-950 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition shadow-xs flex items-center justify-center gap-1.5"
        >
          <span>+</span> Create User
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            placeholder="Search by name or email..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full border border-gray-200 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 rounded-lg px-3 py-2 text-xs outline-none transition"
          />
        </div>

        <select
          value={filters.isAdmin}
          onChange={(e) =>
            setFilters({
              ...filters,
              isAdmin: e.target.value as "" | "user" | "admin",
            })
          }
          className="border border-gray-200 focus:border-amber-900 rounded-lg px-3 py-2 text-xs outline-none bg-white text-gray-700 font-medium"
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">User Details</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-900/10 text-amber-900 font-bold flex items-center justify-center text-xs">
                        {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{u.name}</p>
                        <p className="text-gray-400 text-xs">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-gray-700">{u.phone || "—"}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2.5 py-1 text-[11px] rounded-md font-semibold ${
                        u.isAdmin
                          ? "bg-amber-100 text-amber-900"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {u.isAdmin ? "Admin" : "User"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] rounded-full font-medium ${
                        u.status
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          u.status ? "bg-emerald-500" : "bg-rose-500"
                        }`}
                      />
                      {u.status ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setEditingUser(u);
                        setForm({
                          name: u.name,
                          email: u.email,
                          phone: u.phone,
                          password: "",
                          isAdmin: u.isAdmin,
                          status: u.status,
                          addresses: u.addresses || [],
                        });
                        setShowModal(true);
                      }}
                      className="p-1.5 text-slate-600 hover:text-rose-900 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-gray-400 text-xs">
            No matching users found.
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl shadow-xl px-6 space-y-6">
            {/* MODAL HEADER */}
            <div className="flex justify-between items-center border-b py-4 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {editingUser ? "Edit User Profile" : "Create New User"}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {editingUser
                    ? "Update account access and address details."
                    : "Fill out details to register a user into the system."}
                </p>
              </div>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 text-lg transition"
              >
                ✕
              </button>
            </div>

            {/* BASIC INFO */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Account Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fields.map((field) => (
                  <div key={field} className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600 capitalize">
                      {field}
                    </label>
                    <input
                      name={field}
                      type={field === "password" ? "password" : "text"}
                      placeholder={
                        field === "password" && editingUser
                          ? "(Leave unchanged)"
                          : `Enter ${field}`
                      }
                      value={form[field]}
                      onChange={handleChange}
                      className="w-full border border-gray-200 focus:border-amber-900 focus:ring-1 focus:ring-amber-900 rounded-lg px-3 py-2 text-xs outline-none transition"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">
                    System Role
                  </label>
                  <select
                    name="isAdmin"
                    value={form.isAdmin ? "true" : "false"}
                    onChange={handleChange}
                    className="w-full border border-gray-200 focus:border-amber-900 rounded-lg px-3 py-2 text-xs outline-none bg-white font-medium text-gray-700"
                  >
                    <option value="false">Standard User</option>
                    <option value="true">Administrator</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">
                    Status
                  </label>
                  <select
                    name="status"
                    value={form.status ? "true" : "false"}
                    onChange={handleChange}
                    className="w-full border border-gray-200 focus:border-amber-900 rounded-lg px-3 py-2 text-xs outline-none bg-white font-medium text-gray-700"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ADDRESS SECTION */}
            <div className="border-t pt-4 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Address Management
              </h3>

              <div className="bg-gray-50/70 p-4 rounded-xl space-y-3 border border-gray-100">
                <input
                  placeholder="Address Title (e.g., Home, Office)"
                  value={addressInput.title}
                  onChange={(e) =>
                    setAddressInput({ ...addressInput, title: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-lg p-2 text-xs outline-none bg-white"
                />
                <input
                  placeholder="Street Address"
                  value={addressInput.street}
                  onChange={(e) =>
                    setAddressInput({ ...addressInput, street: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-lg p-2 text-xs outline-none bg-white"
                />

                <div className="grid grid-cols-3 gap-2">
                  <input
                    placeholder="City"
                    value={addressInput.city}
                    onChange={(e) =>
                      setAddressInput({ ...addressInput, city: e.target.value })
                    }
                    className="border border-gray-200 rounded-lg p-2 text-xs outline-none bg-white"
                  />
                  <input
                    placeholder="Country"
                    value={addressInput.country}
                    onChange={(e) =>
                      setAddressInput({
                        ...addressInput,
                        country: e.target.value,
                      })
                    }
                    className="border border-gray-200 rounded-lg p-2 text-xs outline-none bg-white"
                  />
                  <input
                    placeholder="Zip Code"
                    value={addressInput.zip}
                    onChange={(e) =>
                      setAddressInput({ ...addressInput, zip: e.target.value })
                    }
                    className="border border-gray-200 rounded-lg p-2 text-xs outline-none bg-white"
                  />
                </div>

                <div className="flex justify-between items-center pt-1">
                  <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={addressInput.isDefault}
                      onChange={(e) =>
                        setAddressInput({
                          ...addressInput,
                          isDefault: e.target.checked,
                        })
                      }
                      className="rounded accent-amber-900"
                    />
                    Set as default address
                  </label>

                  <button
                    type="button"
                    onClick={addAddress}
                    className="bg-gray-900 hover:bg-black text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
                  >
                    + Add Address
                  </button>
                </div>
              </div>

              {/* SAVED ADDRESS LIST */}
              {form.addresses.length > 0 && (
                <div className="space-y-2">
                  {form.addresses.map((a, i) => (
                    <div
                      key={i}
                      className="p-3 bg-white border border-gray-200 rounded-lg flex justify-between items-center shadow-2xs"
                    >
                      <div className="text-xs">
                        <p className="font-semibold text-gray-800">
                          {a.title || "Address"}{" "}
                          {a.isDefault && (
                            <span className="ml-1 text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </p>
                        <p className="text-gray-500 mt-0.5">
                          {a.street}, {a.city}, {a.country} {a.zip ? `(${a.zip})` : ""}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            addresses: prev.addresses.filter(
                              (_, idx) => idx !== i
                            ),
                          }))
                        }
                        className="text-rose-600 text-xs font-semibold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* MODAL ACTIONS */}
            <div className="flex justify-end gap-3 py-4 border-t sticky bottom-0 bg-white z-10">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-xs font-semibold border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmitUser}
                className="bg-amber-900 hover:bg-amber-950 text-white text-xs font-semibold px-5 py-2 rounded-lg transition"
              >
                {editingUser ? "Update User" : "Create User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}