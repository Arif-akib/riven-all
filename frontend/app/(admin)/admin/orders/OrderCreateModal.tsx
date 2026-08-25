"use client";

import { useState } from "react";

export default function CreateOrderModal({ isOpen, onClose }: any) {
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "" });
  const [address, setAddress] = useState({ line: "", city: "", zip: "" });
  const [items, setItems] = useState([
    { productId: "", variantId: "", name: "", quantity: 1, price: 0 },
  ]);
  const [payment, setPayment] = useState("COD");

  if (!isOpen) return null;

  const handleAddItem = () => {
    setItems([
      ...items,
      { productId: "", variantId: "", name: "", quantity: 1, price: 0 },
    ]);
  };

  const handleSubmit = () => {
    // Submit to backend API
    console.log({ customer, address, items, payment });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-30 flex justify-center items-center backdrop-blur-sm pt-20 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 space-y-6 relative">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Create New Order</h2>
          <button
            onClick={onClose}
            className="text-white hover:rotate-90 duration-300 border size-7 rounded-full bg-red-600"
          >
            &times;
          </button>
        </div>

        {/* CUSTOMER INFO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="text-gray-600 text-sm font-medium">
            Name
            </label>
            <input
              type="text"
              value={customer.name}
              onChange={(e) =>
                setCustomer({ ...customer, name: e.target.value })
              }
              className="mt-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 "
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 text-sm font-medium">
            Email
            </label>
            <input
              type="email"
              value={customer.email}
              onChange={(e) =>
                setCustomer({ ...customer, email: e.target.value })
              }
              className="mt-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 "
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 text-sm font-medium">Phone</label>
            <input
              type="text"
              value={customer.phone}
              onChange={(e) =>
                setCustomer({ ...customer, phone: e.target.value })
              }
              className="mt-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 "
            />
          </div>
        </div>

        {/* SHIPPING ADDRESS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="text-gray-600 text-sm font-medium">Address</label>
            <input
              type="text"
              value={address.line}
              onChange={(e) => setAddress({ ...address, line: e.target.value })}
              className="mt-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 "
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 text-sm font-medium">City</label>
            <input
              type="text"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className="mt-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 "
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 text-sm font-medium">
              ZIP Code
            </label>
            <input
              type="text"
              value={address.zip}
              onChange={(e) => setAddress({ ...address, zip: e.target.value })}
              className="mt-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 "
            />
          </div>
        </div>

        {/* ITEMS */}
        <div>
          <h3 className="text-gray-700 font-medium mb-2">Items</h3>
          {items.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2 items-end"
            >
              <div className="flex flex-col">
                <label className="text-gray-500 text-sm">Product</label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[idx].name = e.target.value;
                    setItems(newItems);
                  }}
                  className="mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 "
                  placeholder="Product Name"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-500 text-sm">Quantity</label>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[idx].quantity = parseInt(e.target.value);
                    setItems(newItems);
                  }}
                  className="mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 "
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-500 text-sm">Price</label>
                <input
                  type="number"
                  min={0}
                  value={item.price}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[idx].price = parseFloat(e.target.value);
                    setItems(newItems);
                  }}
                  className="mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 "
                />
              </div>
              {idx === items.length - 1 && (
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-700"
                >
                  + Add
                </button>
              )}
            </div>
          ))}
        </div>

        {/* PAYMENT */}
        <div className="flex flex-col md:flex-row gap-4 md:items-end">
          <div className="flex flex-col">
            <label className="text-gray-600 text-sm font-medium">
              Payment Type
            </label>
            <select
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              className="mt-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 "
            >
              <option value="COD">Cash on Delivery</option>
              <option value="SSLCommerz">SSLCommerz</option>
            </select>
          </div>

          {/* SUBMIT */}
          <div className="flex-1 flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-700"
            >
              Create Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
