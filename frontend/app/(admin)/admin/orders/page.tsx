"use client";

import { useEffect, useState } from "react";
import { orderService } from "@/services/Order.service";
import toast from "react-hot-toast";

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
  variant?: {
    size?: string;
    color?: string;
  };
}

interface Order {
  _id: string;
  orderId: string;
  customerInfo: {
    name: string;
    phone: string;
    email: string;
    street: string;
    city: string;
    zip: string;
    country: string;
  };
  items: OrderItem[];
  pricing: {
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
  };
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  note?: string;
  createdAt: string;
}

export default function OrderListPage() {
  const [orderlist, setOrderlist] = useState<Order[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getOrderList = async () => {
    try {
      const response = await orderService.getAllUserOrders();
      if (response?.data?.data) {
        setOrderlist(response.data.data);
      }
    } catch (err: any) {
      toast.error("Can not get order list");
    }
  };

  useEffect(() => {
    getOrderList();
  }, []);

  const handleStatusChange = async (
    id: string,
    field: "paymentStatus" | "orderStatus",
    value: string,
  ) => {
    setUpdatingId(id);
    try {
      await orderService.updateOrderStatus(id, { [field]: value });
      setOrderlist((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, [field]: value } : order,
        ),
      );
      if (selectedOrder?._id === id) {
        setSelectedOrder((prev) => (prev ? { ...prev, [field]: value } : null));
      }
      toast.success("Status updated successfully");
    } catch (err: any) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-4 relative">
      {/* FILTERS */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 text-xs bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:flex xl:flex-wrap gap-3 items-end w-full">
          {/* Search */}
          <div className="flex flex-col col-span-1 sm:col-span-2 xl:col-span-1">
            <label className="text-gray-600 font-medium mb-1">Search</label>
            <input
              type="text"
              placeholder="Order ID or Phone"
              className="bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-900 focus:bg-white transition-all p-1.5"
            />
          </div>

          {/* Order Status */}
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium mb-1">
              Order Status
            </label>
            <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-900 focus:bg-white transition-all p-1.5">
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="packed">Packed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment Status */}
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium mb-1">
              Payment Status
            </label>
            <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-900 focus:bg-white transition-all p-1.5">
              <option value="">All</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="flex flex-col col-span-1 sm:col-span-2 xl:col-span-1">
            <label className="text-gray-600 font-medium mb-1">Date Range</label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                className="bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-900 focus:bg-white transition-all p-1.5"
              />
              <span className="text-gray-400 flex items-center">—</span>
              <input
                type="date"
                className="bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-900 focus:bg-white transition-all p-1.5"
              />
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block bg-white p-4 rounded-xl border border-slate-200 shadow-2xs overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">Order ID</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Total</th>
              <th>Payment Status</th>
              <th>Order Status</th>
              <th>Date</th>
              <th className="text-right pr-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {orderlist.map((order) => (
              <tr
                key={order._id}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="p-4 font-medium">{order.orderId}</td>
                <td>{order.customerInfo?.name}</td>
                <td>{order.customerInfo?.phone}</td>
                <td>৳{order.pricing?.total}</td>

                {/* EDITABLE PAYMENT STATUS */}
                <td className="py-2">
                  <select
                    disabled={updatingId === order._id}
                    value={order.paymentStatus}
                    onChange={(e) =>
                      handleStatusChange(
                        order._id,
                        "paymentStatus",
                        e.target.value,
                      )
                    }
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize border border-transparent focus:outline-none cursor-pointer ${
                      order.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : order.paymentStatus === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </td>

                {/* EDITABLE ORDER STATUS */}
                <td className="py-2">
                  <select
                    disabled={updatingId === order._id}
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleStatusChange(
                        order._id,
                        "orderStatus",
                        e.target.value,
                      )
                    }
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize border border-transparent focus:outline-none cursor-pointer ${
                      order.orderStatus === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.orderStatus === "shipped"
                          ? "bg-blue-100 text-blue-700"
                          : order.orderStatus === "delivered"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="packed">Packed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>

                <td>{new Date(order.createdAt).toLocaleDateString()}</td>

                {/* ACTION */}
                <td className="text-right pr-4">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-amber-700 hover:underline font-medium cursor-pointer"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="block md:hidden space-y-3">
        {orderlist.map((order) => (
          <div
            key={order._id}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3"
          >
            <div className="flex justify-between items-start border-b border-slate-200 pb-2">
              <div>
                <span className="font-bold text-gray-800 text-base">
                  {order.orderId}
                </span>
                <p className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(order)}
                className="text-amber-700 font-medium text-xs bg-amber-50 px-3 py-1 rounded-md hover:bg-amber-700 hover:text-white cursor-pointer"
              >
                View
              </button>
            </div>

            <div className="text-xs space-y-1 text-gray-600">
              <p>
                <span className="font-semibold text-gray-700">Customer:</span>{" "}
                {order.customerInfo?.name}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Phone:</span>{" "}
                {order.customerInfo?.phone}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Total:</span>{" "}
                <span className="font-bold text-gray-900">
                  ৳{order.pricing?.total}
                </span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-xs">
              <div>
                <label className="block text-gray-500 text-[10px] uppercase font-semibold mb-1">
                  Payment
                </label>
                <select
                  disabled={updatingId === order._id}
                  value={order.paymentStatus}
                  onChange={(e) =>
                    handleStatusChange(
                      order._id,
                      "paymentStatus",
                      e.target.value,
                    )
                  }
                  className={`w-full px-2 py-1 rounded-md text-xs font-semibold capitalize border focus:outline-none cursor-pointer ${
                    order.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700 border-green-200"
                      : order.paymentStatus === "pending"
                        ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                        : "bg-red-100 text-red-700 border-red-200"
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-500 text-[10px] uppercase font-semibold mb-1">
                  Status
                </label>
                <select
                  disabled={updatingId === order._id}
                  value={order.orderStatus}
                  onChange={(e) =>
                    handleStatusChange(order._id, "orderStatus", e.target.value)
                  }
                  className={`w-full px-2 py-1 rounded-md text-xs font-semibold capitalize border focus:outline-none cursor-pointer ${
                    order.orderStatus === "pending"
                      ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                      : order.orderStatus === "shipped"
                        ? "bg-blue-100 text-blue-700 border-blue-200"
                        : order.orderStatus === "delivered"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="packed">Packed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* VIEW ORDER DETAILS DRAWER */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
          <div className="w-full md:max-w-xl bg-white h-full shadow-2xl p-4 sm:p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex justify-between items-center border-b pb-4 sticky top-0 bg-white">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                    {selectedOrder.orderId}
                  </h2>
                  <p className="text-xs text-gray-500">
                    Placed on:{" "}
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold p-2 leading-none"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Customer Information */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-xl space-y-2 text-xs sm:text-sm">
                <h3 className="font-semibold text-gray-700">
                  Customer Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600">
                  <p>
                    <span className="font-medium text-gray-800">Name:</span>{" "}
                    {selectedOrder.customerInfo?.name}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">Phone:</span>{" "}
                    {selectedOrder.customerInfo?.phone}
                  </p>
                  <p className="sm:col-span-2">
                    <span className="font-medium text-gray-800">Email:</span>{" "}
                    {selectedOrder.customerInfo?.email}
                  </p>
                  <p className="sm:col-span-2">
                    <span className="font-medium text-gray-800">Address:</span>{" "}
                    {selectedOrder.customerInfo?.street},{" "}
                    {selectedOrder.customerInfo?.country},{" "}
                    {selectedOrder.customerInfo?.city} -{" "}
                    {selectedOrder.customerInfo?.zip}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700 text-xs sm:text-sm">
                  Items ({selectedOrder.items?.length || 0})
                </h3>
                <div className="border rounded-xl divide-y overflow-hidden">
                  {selectedOrder.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 flex justify-between items-center text-xs sm:text-sm"
                    >
                      <div>
                        <p className="font-medium capitalize text-gray-800">
                          {item.productName}
                        </p>
                        {item.variant && (
                          <p className="text-[11px] sm:text-xs text-gray-500">
                            Size: {item.variant.size} | Color:{" "}
                            {item.variant.color}
                          </p>
                        )}
                        <p className="text-[11px] sm:text-xs text-gray-500">
                          Qty: {item.quantity} × ৳{item.price}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-800">
                        ৳{item.subtotal}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-xl space-y-2 text-xs sm:text-sm">
                <h3 className="font-semibold text-gray-700">Payment Details</h3>
                <div className="space-y-1.5 text-gray-600">
                  <div className="flex justify-between">
                    <span>Payment Method</span>
                    <span className="uppercase font-medium text-gray-800">
                      {selectedOrder.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>৳{selectedOrder.pricing?.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>৳{selectedOrder.pricing?.shipping}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span>-৳{selectedOrder.pricing?.discount}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 border-t pt-2 text-sm sm:text-base">
                    <span>Total Amount</span>
                    <span>৳{selectedOrder.pricing?.total}</span>
                  </div>
                </div>
              </div>

              {/* Note */}
              {selectedOrder.note && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-800">
                  <span className="font-semibold">Note:</span>{" "}
                  {selectedOrder.note}
                </div>
              )}
            </div>

            {/* Footer Close */}
            <div className="pt-4 border-t mt-6">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg text-sm transition"
              >
                Close Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
