"use client";

import { useState } from "react";
import Image from "next/image";
import { Package, CreditCard, Truck, Eye, X } from "lucide-react";

type Item = {
  id: number;
  name: string;
  price: number;
  qty: number;
  image: string;
};

type Order = {
  id: string;
  date: string;
  status:
    | "Processing"
    | "Confirmed"
    | "Shipped"
    | "Delivered"
    | "Cancel"
    | "Returned";
  payment: "Pending" | "Paid";
  total: number;
  items: Item[];
  shipping: {
    name: string;
    address: string;
  };
};

const orders: Order[] = [
  {
    id: "ORD-20345",
    date: "2026-03-01",
    status: "Shipped",
    payment: "Paid",
    total: 120,
    items: [
      { id: 1, name: "Luxury Watch", price: 80, qty: 1, image: "/watch.png" },
      { id: 2, name: "Running Shoes", price: 40, qty: 1, image: "/shoes.png" },
      { id: 1, name: "Luxury Watch", price: 80, qty: 1, image: "/watch.png" },
      { id: 2, name: "Running Shoes", price: 40, qty: 1, image: "/shoes.png" },
    ],
    shipping: {
      name: "John Doe",
      address: "123 Street, Dhaka, Bangladesh",
    },
  },
  {
    id: "ORD-20346",
    date: "2026-02-20",
    status: "Processing",
    payment: "Pending",
    total: 60,
    items: [
      {
        id: 3,
        name: "Leather Wallet",
        price: 60,
        qty: 1,
        image: "/wallet.png",
      },
    ],
    shipping: {
      name: "John Doe",
      address: "123 Street, Dhaka, Bangladesh",
    },
  },
];

// Badge color helpers
const paymentBadge = (payment: string) => {
  if (payment === "Paid") return "bg-green-100 text-green-700";
  return "bg-yellow-100 text-yellow-700";
};

const statusBadge = (status: string) => {
  switch (status) {
    case "Processing":
      return "bg-yellow-100 text-yellow-700";
    case "Confirmed":
      return "bg-indigo-100 text-indigo-700";
    case "Shipped":
      return "bg-blue-100 text-blue-700";
    case "Delivered":
      return "bg-green-100 text-green-700";
    case "Cancel":
      return "bg-red-100 text-red-700";
    case "Returned":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function CustomerOrders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order, i) => (
          <div
            key={i}
            className="group border border-gray-200 rounded-xl bg-white p-5 shadow-sm hover:shadow-lg transition-all duration-300"
          >
            {/* Header */}
            <div className="flex items-start justify-between flex-wrap">
              <div>
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Package size={18} className="text-[#800000]" />
                  Order #{order.id}
                </h2>
              </div>
              <span className="text-xs font-semibold bg-gray-100 px-3 py-1 rounded-full">
                {order.items.length} Items
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Placed on {new Date(order.date).toLocaleDateString()}
            </p>

            {/* Price */}
            <div className="mt-4">
              <h3 className="text-xl font-bold text-[#800000]">
                Total : ৳{order.total}
              </h3>
            </div>

            {/* Status badges */}
            <div className="flex items-center gap-3 mt-4">
              <span
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${paymentBadge(order.payment)}`}
              >
                <CreditCard size={14} />
                {order.payment}
              </span>

              <span
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${statusBadge(order.status)}`}
              >
                <Truck size={14} />
                {order.status}
              </span>
            </div>

            {/* Action */}
            <button
              onClick={() => setSelectedOrder(order)}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#800000] via-[#6b0000] to-[#4a0000] text-white py-2.5 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg active:scale-95 transition-all duration-200"
            >
              <Eye size={16} />
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="sticky top-0 bg-white z-10">
              <div className="p-2 flex justify-between items-center flex-wrap gap-2 relative">
                <div className="flex items-center gap-2">
                  <span className="p-1 text-amber-900 rounded-full bg-rose-100">
                    <Package size={20} />
                  </span>
                  <h2 className="font-bold text-lg">
                    Order #{selectedOrder.id}
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${paymentBadge(selectedOrder.payment)}`}
                  >
                    <CreditCard size={14} />
                    {selectedOrder.payment}
                  </span>

                  <span
                    className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${statusBadge(selectedOrder.status)}`}
                  >
                    <Truck size={14} />
                    {selectedOrder.status}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-white hover:text-gray-200 bg-red-600 rounded-full p-1 absolute top-2 right-2 active:scale-95 hover:rotate-90 duration-300"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
            <p className="text-gray-400 px-4 text-sm">
              Placed on {new Date(selectedOrder.date).toLocaleDateString()}
            </p>

            <div className="p-2 space-y-3">
              {/* Items */}
              <div className="space-y-2">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="font-medium">
                    <div className="flex items-center gap-3 px-2">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-xs text-gray-400">
                          Odessa Cross: Consectetur optio n
                        </p>
                        <p className="text-xs text-gray-400">
                          {item.qty} x {item.price}
                        </p>
                        <p className="text-xs text-gray-400">Discount: 0.00</p>
                      </div>
                    </div>
                    <div className="bg-gray-100 text-sm text-gray-400 flex justify-between items-center rounded-md p-2 m-1">
                      <p className="">Payable Amount</p>
                      <p className="">৳{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping */}
              <div className="border border-gray-300 rounded-xl p-4">
                <h3 className="font-semibold text-sm mb-1">Shipping Address</h3>
                <p className="text-sm text-gray-400">
                  {selectedOrder.shipping.name}
                  <br />
                  {selectedOrder.shipping.address}
                </p>
              </div>

              {/* Summary */}
              <div className="space-y-1 bg-gradient-to-r from-[#800000] via-[#6b0000] to-[#4a0000] p-4 rounded-xl text-white">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>৳{selectedOrder.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>৳5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Discount</span>
                  <span>৳00</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="">৳{selectedOrder.total + 5}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
