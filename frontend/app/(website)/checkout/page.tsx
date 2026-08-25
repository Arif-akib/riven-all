"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

import { MapPin, Plus, CreditCard, Tag } from "lucide-react";

import WebWrapper from "@/components/Wrapper/webWrapper";
import Headline from "@/components/Headline";

import { useCartStore } from "@/store/cart.store";
import { validateCart } from "@/services/Cart.service";
import API from "@/lib/axios";
import Link from "next/link";

export default function CheckoutPage() {
  const cartItems = useCartStore((state) => state.cart);
  const [cartSummary, setCartSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [phone, setPhone] = useState("");

  const fetchAddresses = async () => {
    const res = await API.get("/user/customer/address");
    setAddresses(res.data.addresses || []);
    setPhone(res?.data?.phone);
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  useEffect(() => {
    const fetchValidatedCart = async () => {
      try {
        setLoading(true);

        const response = await validateCart(cartItems);

        setCartSummary(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (cartItems.length > 0) {
      fetchValidatedCart();
    }
  }, [cartItems]);

  return (
    <div className="min-h-screen mt-5">
      <WebWrapper>
        <Headline mainText="Checkout" subText="" />

        <div className="grid lg:grid-cols-3 gap-6 mt-5 items-start">
          {/* ================= LEFT ================= */}
          <div className="space-y-5 lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-5">
              {/* ADDRESS */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-base flex items-center gap-2 text-gray-900">
                    <MapPin size={16} />
                    Delivery Address
                  </h2>
                  <Link href="/user/address">
                    <button className="flex items-center gap-1 text-xs font-semibold text-[#800000] hover:opacity-70 transition">
                      <Plus size={14} />
                      Add New
                    </button>
                  </Link>
                </div>

                <div className="space-y-3">
                  {addresses.map((item: any, i: number) => (
                    <label
                      key={i}
                      className={`flex gap-3 p-3 rounded-xl cursor-pointer transition border ${
                        selectedAddress === i
                          ? "border-[#800000]/30 bg-rose-50"
                          : "border-gray-100 hover:border-[#800000]/30"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={selectedAddress === i}
                        onChange={() => setSelectedAddress(i)}
                        className="mt-1 size-4 accent-[#800000]"
                      />

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm text-gray-900">
                            {item?.title}
                          </p>

                          {selectedAddress === i && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#800000]/10 text-[#800000]">
                              Selected
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-500 mt-0.5">
                          {item?.street}, {item?.city}, {item?.country}
                        </p>

                        <p className="text-[11px] text-gray-400">{phone}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* PAYMENT */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-fit">
                <h2 className="font-semibold text-base mb-4 flex items-center gap-2 text-gray-900">
                  <CreditCard size={16} />
                  Payment Method
                </h2>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-[#800000]/20 bg-rose-50 cursor-pointer">
                  <input
                    type="radio"
                    checked
                    readOnly
                    className="size-4 accent-[#800000]"
                  />

                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900">
                      Cash on Delivery
                    </p>

                    <p className="text-[11px] text-gray-500">
                      Pay when you receive your order
                    </p>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#800000]/10 text-[#800000]">
                    Recommended
                  </span>
                </label>
              </div>
            </div>

            {/* ORDER ITEMS (FIXED - NOW PROPER SECTION) */}
            <div className="mb-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="font-semibold text-xl mb-6 text-gray-900 px-4 mt-4">
                {" "}
                Order Summary{" "}
              </h2>
              {cartSummary?.items.map((item: any) => (
                <div
                  key={`${item.productId}-${item.variantKey}`}
                  className="flex items-center gap-4 p-3 rounded-2xl border border-gray-100"
                >
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900">
                      {item.productName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty {item.quantity} x ৳{item.finalPrice}
                    </p>
                  </div>

                  <p className="font-semibold text-[#800000]">
                    ৳{item.subtotal}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ================= RIGHT (ORDER SUMMARY) ================= */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-lg h-fit sticky top-20">
            <h2 className="font-semibold text-lg mb-5">Order Summary</h2>

            {/* COUPON */}
            <div className="flex gap-2 mb-5">
              <div className="flex items-center border rounded-xl px-3 flex-1 bg-gray-50">
                <Tag size={16} className="text-gray-400" />

                <input
                  placeholder="Coupon code"
                  className="flex-1 px-2 py-3 outline-none text-sm bg-transparent"
                />
              </div>

              <button className="px-5 rounded-xl text-sm font-semibold text-white bg-[#800000] hover:opacity-90 transition">
                Apply
              </button>
            </div>

            {/* PRICE SUMMARY */}
            <div className="space-y-2 text-sm border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>৳{cartSummary?.summary?.subtotal || 0}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Discount</span>
                <span>- ৳{cartSummary?.summary?.discount || 0}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {cartSummary?.summary?.freeShipping == true
                    ? "Free"
                    : `৳${cartSummary?.summary?.shipping || 0}`}
                </span>
              </div>

              <div className="flex justify-between font-semibold text-lg pt-3 border-t border-gray-200">
                <span>Total</span>
                <span className="text-[#800000]">
                  ৳{cartSummary?.summary?.total || 0}
                </span>
              </div>
            </div>

            {/* BUTTON */}
            <button className="mt-6 w-full py-3.5 rounded-xl font-semibold text-white bg-[#800000] hover:scale-[1.02] active:scale-95 transition">
              Place Order
            </button>
          </div>
        </div>
      </WebWrapper>
    </div>
  );
}
