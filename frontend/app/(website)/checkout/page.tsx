"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

import {
  MapPin,
  Plus,
  CreditCard,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

import WebWrapper from "@/components/Wrapper/webWrapper";
import Headline from "@/components/Headline";

import API from "@/lib/axios";
import { useCartStore } from "@/store/cart.store";
import { validateCart } from "@/services/Cart.service";
import { orderService } from "@/services/Order.service";
import { PlaceOrderPayload } from "@/types/order.type";
import { getShippingFee } from "@/utils/deliveryZone";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const cartItems = useCartStore((state) => state.cart);
  const clearSelectedCart = useCartStore((state) => state.clearSelectedItems);
  const [cartSummary, setCartSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  const shippingFee = useMemo(() => {
    if (!selectedAddress) return 0;
    return getShippingFee({
      city: selectedAddress.city,
      zip: selectedAddress.zip,
      country: selectedAddress.country,
    });
  }, [selectedAddress]);

  useEffect(() => {
    const initializeCheckoutData = async () => {
      try {
        setLoading(true);

        // Prepare promises to run concurrently
        const promises = [API.get("/user/customer/address")];

        if (cartItems.length > 0) {
          promises.push(validateCart(cartItems));
        }

        // Execute both requests in parallel
        const [addressRes, cartRes] = await Promise.all(promises);

        // Handle address state
        if (addressRes) {
          setAddresses(addressRes.data.addresses || []);
          setPhone(addressRes?.data?.phone);
        }

        // Handle cart summary state
        if (cartRes) {
          setCartSummary(cartRes);
        }
      } catch (error) {
        console.error("Failed to fetch checkout data:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeCheckoutData();
  }, [cartItems]);

  const handleCheckout = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address.");
      return;
    }
    if (cartSummary.items / length < 0) {
      toast.error("You have nothing to order");
      return;
    }

    // 1. Construct the payload matching backend expectations
    const payload: PlaceOrderPayload = {
      items: cartSummary.items.map((item: any) => ({
        productId: item.productId,
        variantKey: item.variantKey,
        quantity: item.quantity,
      })),
      address: selectedAddress,
      paymentMethod: "cod",
      note: note,
    };

    setLoading(true);

    // 2. Directly call the API service
    try {
      const response = await orderService.placeOrder(payload);

      if (response?.success) {
        toast.success("Order placed successfully!");
        clearSelectedCart(
          cartSummary.items.map((item: any) => ({
            productId: item.productId,
            variantKey: item.variantKey,
          })),
        );

        // Reset local validated state
        setCartSummary([]);
        selectedAddress(null);
      }
    } catch (err: any) {
      toast.error("Can not place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5">
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
                    <button className="flex items-center gap-1 text-xs font-semibold text-[#800000] hover:opacity-70 transition cursor-pointer">
                      <Plus size={14} />
                      Add New
                    </button>
                  </Link>
                </div>

                <div className="space-y-3 capitalize">
                  {addresses.map((item: any, i: number) => (
                    <label
                      key={i}
                      className={`flex gap-3 p-3 rounded-xl cursor-pointer transition border ${
                        selectedAddress === item
                          ? "border-[#800000]/30 bg-rose-50"
                          : "border-gray-300 hover:border-[#800000]/30"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={selectedAddress === item}
                        onChange={() => setSelectedAddress(item)}
                        className="mt-1 size-4 accent-[#800000]"
                      />

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm text-gray-900">
                            {item?.title}
                          </p>

                          {selectedAddress === item && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#800000]/10 text-[#800000]">
                              Selected
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-500 mt-0.5">
                          {item?.street}, {item?.country}, {item?.zip},{" "}
                          {item?.city},
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

                <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-100 cursor-pointer mt-3">
                  <input
                    type="radio"
                    checked={false}
                    readOnly
                    disabled
                    className="size-4 accent-[#800000]"
                  />

                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-400">
                      Online payment
                    </p>

                    <p className="text-[11px] text-gray-400">
                      Pay when you receive your order
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {cartSummary != null || cartSummary?.items?.lenght > 0 ? (
              <div className="mb-6 bg-white rounded-2xl border border-gray-100 shadow-sm capitalize">
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
            ) : (
              <div className="min-h-112 flex flex-col items-center justify-center p-6 text-center bg-white rounded-xl border border-dashed border-gray-300">
                {/* Icon Container */}
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-800 mb-5 shadow-inner">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>

                {/* Heading & Text */}
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
                  You have nothing to order
                </h2>
                <p className="text-gray-500 max-w-md mb-8 text-sm leading-relaxed">
                  Looks like you haven't added anything to your cart yet.
                  Explore our latest collection and find something you love!
                </p>

                {/* Call To Action Button */}
                <Link
                  href="/shop" // Replace with your shop/products route
                  className="inline-flex items-center justify-center gap-2 bg-amber-800 hover:bg-amber-900 text-white font-medium px-6 py-3 rounded-lg shadow-sm hover:shadow transition-all duration-200 group text-sm"
                >
                  <span>Continue Shopping</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            )}
          </div>

          {/* ================= RIGHT (ORDER SUMMARY) ================= */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-lg h-fit sticky top-20">
            <h2 className="font-semibold text-lg mb-3">Order Summary</h2>

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
                <span>৳{shippingFee}</span>
              </div>

              <div className="flex justify-between font-semibold text-lg pt-3 border-t border-gray-200">
                <span>Total</span>
                <span className="text-[#800000]">
                  ৳{cartSummary?.summary?.subtotal + shippingFee}
                </span>
              </div>
            </div>

            <div className="mt-2 space-y-2 text-sm">
              <label htmlFor="note" className="block">
                Note
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                name="note"
                id="note"
                placeholder="Write delivery note"
                className="border w-full border-gray-400 rounded-md p-1"
              ></textarea>
            </div>

            {/* BUTTON */}
            <button
              onClick={handleCheckout}
              className="mt-3 w-full py-3.5 rounded-xl font-semibold text-white bg-[#800000] hover:scale-[1.02] active:scale-95 transition cursor-pointer"
            >
              Place Order
            </button>
            <Link href="/cart">
              <button className="mt-3 w-full border py-3 rounded-xl text-amber-900 cursor-pointer">
                Back To Cart
              </button>
            </Link>
          </div>
        </div>
      </WebWrapper>
    </div>
  );
}
