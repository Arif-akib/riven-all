"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

import { Minus, Plus, Trash2 } from "lucide-react";

import Headline from "@/components/Headline";
import WebWrapper from "@/components/Wrapper/webWrapper";

import { useCartStore } from "@/store/cart.store";
import { validateCart } from "@/services/Cart.service";

export default function CartPage() {
  const cartItems = useCartStore((state) => state.cart);
  const [cartSummary, setCartSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const increaseQuantity = useCartStore((state) => state.increaseQuantity);

  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  const removeFromCart = useCartStore((state) => state.removeFromCart);

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
    <div className="pt-5">
      <WebWrapper>
        <Headline mainText="My Cart" subText="" />
        <div className="grid lg:grid-cols-4 gap-6 mt-5">
          {/* Cart Section */}
          <div className="col-span-4 lg:col-span-3 bg-white rounded-2xl shadow-md ring ring-amber-900/10 overflow-hidden h-fit">
            {/* Header (hidden on mobile) */}
            <div className="hidden md:grid grid-cols-12 text-sm font-semibold bg-linear-to-r from-[#800000] via-[#6b0000] to-[#4a0000] text-white py-3 px-4">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-1 text-center">Total</div>
              <div className="col-span-1 text-center">Action</div>
            </div>

            {/* Items */}
            {cartSummary?.items.map((item:any) => (
              <div
                key={`${item.productId}-${item.variantKey}`}
                className="border-t border-gray-200 p-4"
              >
                <div className="grid grid-cols-2 md:grid-cols-12 gap-4 items-center">
                  {/* Product */}
                  <div className="col-span-2 md:col-span-6 flex gap-3">
                    <Image
                      src={item.image}
                      alt={item.productName}
                      width={60}
                      height={60}
                      className="rounded-lg object-cover bg-gray-100"
                    />
                    <div>
                      <h2 className="font-semibold text-gray-800 text-sm md:text-base">
                        {item.productName}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {item.variantLabel}
                      </p>

                      {/* Mobile price */}
                      <p className="md:hidden text-sm font-medium mt-1">
                        ৳{item.finalPrice}
                      </p>
                    </div>
                  </div>

                  {/* Price (desktop only) */}
                  <div className="hidden md:block md:col-span-2 text-center">
                    ৳{item.finalPrice}
                  </div>

                  {/* Quantity */}
                  <div className="col-span-1 md:col-span-2 flex md:justify-center items-center gap-2">
                    <button
                      onClick={() =>
                        decreaseQuantity(item.productId, item.variantKey)
                      }
                      className="border rounded-md p-1 hover:bg-amber-800 hover:text-white"
                    >
                      <Minus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        increaseQuantity(item.productId, item.variantKey)
                      }
                      className="border rounded-md p-1 hover:bg-amber-800 hover:text-white"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Total */}
                  <div className="col-span-1 md:col-span-1 text-right md:text-center font-semibold">
                    ৳{item.subtotal}
                  </div>

                  {/* Delete */}
                  <div className="col-span-2 md:col-span-1 flex justify-end md:justify-center">
                    <button
                      onClick={() =>
                        removeFromCart(item.productId, item.variantKey)
                      }
                      className="text-white p-2 rounded-full bg-amber-800 hover:scale-105 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="col-span-4 lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 ring ring-amber-900/10 lg:sticky lg:top-24">
              <h3 className="text-lg font-semibold mb-2">Order Summary</h3>

              {/* <div className="flex justify-between text-sm mb-2">
                <span>Subtotal</span>
                <span>৳{cartSummary?.summary?.subtotal || 0}</span>
              </div> */}

              {/* <div className="flex justify-between text-sm mb-2">
                <span>Shipping</span>
                <span>
                  {cartSummary?.summary?.freeShipping == true
                    ? "Free"
                    : `৳${cartSummary?.summary?.shipping || 0}`}
                </span>
              </div> */}

              {/* <div className="flex justify-between text-sm mb-4">
                <span>Discount</span>
                <span>- ৳{cartSummary?.summary?.discount || 0}</span>
              </div> */}

              <div className="border-t border-gray-300 pt-4 flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>৳{cartSummary?.summary?.subtotal || 0}</span>
              </div>

              <Link href="/checkout">
                <button className="mt-6 w-full bg-linear-to-r from-[#800000] via-[#6b0000] to-[#4a0000] text-white py-3 rounded-xl font-semibold">
                  Checkout
                </button>
              </Link>

              <Link href="/shop">
                <button className="mt-3 w-full border py-3 rounded-xl text-amber-900">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      </WebWrapper>
    </div>
  );
}
