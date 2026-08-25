"use client";

import { useState } from "react";
import CreateOrderModal from "./OrderCreateModal";

export default function OrderListPage() {
  const [orders] = useState([
    {
      id: "ORD-1001",
      name: "John Doe",
      phone: "017xxxxxxx",
      total: 1200,
      payment: "Paid",
      status: "Pending",
      date: "2026-04-05",
    },
  ]);
  const [open, setOpen] = useState(false); // modal state

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div className="space-y-3">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Orders</h1>
      </div>

      {/* FILTERS */}
      <div className="bg-white flex flex-col items-start justify-start gap-4 text-xs">
        {/* LEFT: FILTERS */}
        <div className="flex flex-wrap gap-2 items-end justify-start w-full">
          {/* SEARCH */}
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Search</label>
            <input
              type="text"
              placeholder="Order ID or Phone"
              className="mt-1 border rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* STATUS */}
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">
              Order Status
            </label>
            <select className="mt-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All</option>
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Packed</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
          </div>

          {/* PAYMENT */}
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">
              Payment Status
            </label>
            <select className="mt-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All</option>
              <option>Paid</option>
              <option>Unpaid</option>
              <option>Failed</option>
              <option>Refunded</option>
            </select>
          </div>

          {/* DATE RANGE */}
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">
              Date Range
            </label>
            <div className="flex gap-2 mt-1">
              <input
                type="date"
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-400 flex items-center">—</span>
              <input
                type="date"
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* RIGHT: ACTION BUTTONS */}
        <div className="flex shrink-0 gap-3">
          <button className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 transition">
            Export CSV
          </button>
          <button  onClick={handleOpen} className="px-4 py-2 rounded-lg bg-amber-900 text-white hover:bg-amber-800 transition">
            + Create Order
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">Order ID</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
              <th className="text-right pr-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">{order.id}</td>
                <td>{order.name}</td>
                <td>{order.phone}</td>
                <td>৳{order.total}</td>

                {/* PAYMENT BADGE */}
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      order.payment === "Paid"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {order.payment}
                  </span>
                </td>

                {/* STATUS BADGE */}
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : order.status === "Shipped"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-green-100 text-green-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>

                <td>{order.date}</td>

                {/* ACTION */}
                <td className="text-right pr-4">
                  <button className="text-blue-600 hover:underline">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {open && <CreateOrderModal isOpen={open} onClose={handleClose} />}
    </div>
  );
}
