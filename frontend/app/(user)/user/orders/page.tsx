"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Package, CreditCard, Truck, Eye, X } from "lucide-react";
import { orderService } from "@/services/Order.service";
import toast from "react-hot-toast";

type OrderItem = {
  productId: string;
  productName: string;
  productSlug: string;
  variantKey: string;
  variant: {
    size: string;
    color: string;
  };
  image: string;
  quantity: number;
  price: number;
  subtotal: number;
};

type CustomerInfo = {
  name: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  zip: string;
  country: string;
};

type Pricing = {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
};

type Order = {
  _id: string;
  orderId: string;
  user: string;
  customerInfo: CustomerInfo;
  items: OrderItem[];
  pricing: Pricing;
  paymentMethod: string;
  note:string,
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus:
    | "pending"
    | "processing"
    | "confirmed"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned";
  createdAt: string;
};

// Badge color helpers
const paymentBadge = (payment: string) => {
  if (payment === "paid") return "bg-green-100 text-green-700 capitalize";
  return "bg-yellow-100 text-yellow-700 capitalize";
};

const statusBadge = (status: string) => {
  switch (status) {
    case "pending":
    case "processing":
      return "bg-yellow-100 text-yellow-700 capitalize";
    case "confirmed":
      return "bg-indigo-100 text-indigo-700 capitalize";
    case "shipped":
      return "bg-blue-100 text-blue-700 capitalize";
    case "delivered":
      return "bg-green-100 text-green-700 capitalize";
    case "cancelled":
      return "bg-red-100 text-red-700 capitalize";
    case "returned":
      return "bg-orange-100 text-orange-700 capitalize";
    default:
      return "bg-gray-100 text-gray-700 capitalize";
  }
};

export default function CustomerOrders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderlist, setOrderlist] = useState<Order[]>([]);

  const getOrderList = async () => {
    try {
      const response = await orderService.getUserOrders();
      if (response) {
        setOrderlist(response.data.data);
      }
    } catch (err: any) {
      toast.error("Can not get order list");
    }
  };

  useEffect(() => {
    getOrderList();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orderlist.map((order) => (
          <div
            key={order._id}
            className="group border border-gray-200 rounded-xl bg-white p-5 shadow-sm hover:shadow-lg transition-all duration-300"
          >
            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Package size={18} className="text-[#800000]" />
                  Order #{order.orderId}
                </h2>
              </div>
              <span className="text-xs font-semibold bg-gray-100 px-3 py-1 rounded-full">
                {order.items.length} Items
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>

            {/* Price */}
            <div className="mt-4">
              <h3 className="text-xl font-bold text-[#800000]">
                Total : ৳{order.pricing.total}
              </h3>
            </div>

            {/* Status badges */}
            <div className="flex items-center gap-3 mt-4">
              <span
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${paymentBadge(
                  order.paymentStatus
                )}`}
              >
                <CreditCard size={14} />
                {order.paymentStatus}
              </span>

              <span
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${statusBadge(
                  order.orderStatus
                )}`}
              >
                <Truck size={14} />
                {order.orderStatus}
              </span>
            </div>

            {/* Action */}
            <button
              onClick={() => setSelectedOrder(order)}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-linear-to-r from-[#800000] via-[#6b0000] to-[#4a0000] text-white py-2.5 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer"
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
            <div className="sticky top-0 bg-white z-10 border-b p-4">
              <div className="flex justify-between items-center flex-wrap gap-2 relative">
                <div className="flex items-center gap-2">
                  <span className="p-1 text-amber-900 rounded-full bg-rose-100">
                    <Package size={20} />
                  </span>
                  <h2 className="font-bold text-lg">
                    Order #{selectedOrder.orderId}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-white hover:text-gray-200 bg-red-600 rounded-full p-1 active:scale-95 hover:rotate-90 duration-300 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="flex items-center gap-3 mt-3">
                <span
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${paymentBadge(
                    selectedOrder.paymentStatus
                  )}`}
                >
                  <CreditCard size={14} />
                  {selectedOrder.paymentStatus}
                </span>

                <span
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${statusBadge(
                    selectedOrder.orderStatus
                  )}`}
                >
                  <Truck size={14} />
                  {selectedOrder.orderStatus}
                </span>
              </div>
              <p className="text-gray-400 text-xs mt-2">
                Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="p-4 space-y-4">
              {/* Items */}
              <div className="space-y-3">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="font-medium border-b pb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-100 shrink-0 bg-gray-50">
                        <Image
                          src={item.image || "/placeholder.png"}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">
                          {item.productName}
                        </p>
                        <p className="text-xs text-gray-500">
                          Variant: {item.variant.size} | {item.variant.color}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.quantity} x ৳{item.price}
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-100 text-sm text-gray-600 flex justify-between items-center rounded-md p-2 mt-2">
                      <span>Payable Amount</span>
                      <span className="font-semibold">৳{item.subtotal}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping */}
              <div className="border border-gray-300 rounded-xl p-4">
                <h3 className="font-semibold text-sm mb-1">
                  Shipping Address
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedOrder.customerInfo.name}
                  <br />
                  {selectedOrder.customerInfo.street},{" "}
                  {selectedOrder.customerInfo.city},{" "}
                  {selectedOrder.customerInfo.country}
                  <br />
                  Phone: {selectedOrder.customerInfo.phone}
                </p>
              </div>

              <div>
               <h3 className="font-semibold text-sm mb-1">
                  Order note
                </h3>
                <p className="text-sm border rounded-md border-gray-300 p-1.5 text-gray-500">{selectedOrder.note? selectedOrder.note : "No order note"}</p>
              </div>

              {/* Summary */}
              <div className="space-y-1 bg-linear-to-r from-[#800000] via-[#6b0000] to-[#4a0000] p-4 rounded-xl text-white">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>৳{selectedOrder.pricing.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>৳{selectedOrder.pricing.shipping}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Discount</span>
                  <span>৳{selectedOrder.pricing.discount}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-1 border-t border-white/20">
                  <span>Total</span>
                  <span>৳{selectedOrder.pricing.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}