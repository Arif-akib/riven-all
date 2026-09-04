"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

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
          {!cartItems.length ? (
            <div className="col-span-4 lg:col-span-3 min-h-112 flex flex-col items-center justify-center p-6 text-center bg-white rounded-xl border border-dashed border-gray-300">
              {/* Icon Container */}
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-800 mb-5 shadow-inner">
                <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
              </div>

              {/* Heading & Text */}
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
                You have nothing to order
              </h2>
              <p className="text-gray-500 max-w-md mb-8 text-sm leading-relaxed">
                Looks like you haven't added anything to your cart yet. Explore
                our latest collection and find something you love!
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
          ) : (
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
              {cartItems.map((localItem: any) => {
                // Find matching item validated by API
                const validItem = cartSummary?.items?.find(
                  (item: any) =>
                    item.productId === localItem.productId &&
                    item.variantKey === localItem.variantKey,
                );

                const isOutOfStock = !validItem;

                return (
                  <div
                    key={`${localItem.productId}-${localItem.variantKey}`}
                    className={`border-t border-gray-200 p-4 transition ${
                      isOutOfStock ? "bg-red-50/50 opacity-80" : ""
                    }`}
                  >
                    <div className="grid grid-cols-2 md:grid-cols-12 gap-4 items-center">
                      {/* Product Details */}
                      <div className="col-span-2 md:col-span-6 flex gap-3">
                        <Image
                          src={validItem?.image || localItem.image || ""}
                          alt={
                            validItem?.productName ||
                            localItem.title ||
                            "Product"
                          }
                          width={60}
                          height={60}
                          className="rounded-lg object-cover bg-gray-100 size-12.5 aspect-square"
                        />
                        <div>
                          <h2 className="font-semibold text-gray-800 text-sm md:text-base flex items-center gap-2">
                            {validItem?.productName || localItem.title}
                            {isOutOfStock && (
                              <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                                Out of Stock
                              </span>
                            )}
                          </h2>
                          <p className="text-xs text-gray-500">
                            {validItem?.variantLabel || localItem.variantKey}
                          </p>

                          {/* Mobile Price */}
                          <p className="md:hidden text-sm font-medium mt-1">
                            ৳{validItem?.finalPrice || localItem.price || 0}
                          </p>
                        </div>
                      </div>

                      {/* Price (Desktop) */}
                      <div className="hidden md:block md:col-span-2 text-center">
                        ৳{validItem?.finalPrice || localItem.price || 0}
                      </div>

                      {/* Quantity Controls */}
                      <div className="col-span-1 md:col-span-2 flex md:justify-center items-center gap-2">
                        <button
                          disabled={isOutOfStock}
                          onClick={() =>
                            decreaseQuantity(
                              localItem.productId,
                              localItem.variantKey,
                            )
                          }
                          className="border rounded-md p-1 hover:bg-amber-800 hover:text-white cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Minus size={14} />
                        </button>
                        <span>{localItem.quantity}</span>
                        <button
                          disabled={isOutOfStock}
                          onClick={() =>
                            increaseQuantity(
                              localItem.productId,
                              localItem.variantKey,
                            )
                          }
                          className="border rounded-md p-1 hover:bg-amber-800 hover:text-white cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Total Subtotal */}
                      <div className="col-span-1 md:col-span-1 text-right md:text-center font-semibold">
                        {isOutOfStock ? (
                          <span className="text-xs text-red-500">
                            Unavailable
                          </span>
                        ) : (
                          `৳${validItem.subtotal}`
                        )}
                      </div>

                      {/* Delete Action */}
                      <div className="col-span-2 md:col-span-1 flex justify-end md:justify-center">
                        <button
                          onClick={() =>
                            removeFromCart(
                              localItem.productId,
                              localItem.variantKey,
                            )
                          }
                          className="text-white p-2 rounded-full bg-amber-800 hover:scale-105 transition cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Summary */}
          <div className="col-span-4 lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 ring ring-amber-900/10 lg:sticky lg:top-24">
              <h3 className="text-lg font-semibold mb-2">Order Summary</h3>

              <div className="flex justify-between text-sm mb-2">
                <span>Subtotal</span>
                <span>৳{cartSummary?.summary?.subtotal || 0}</span>
              </div>

              <div className="flex justify-between text-sm mb-4">
                <span>Discount</span>
                <span>- ৳{cartSummary?.summary?.discount || 0}</span>
              </div>

              <div className="border-t border-gray-300 pt-4 flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>৳{cartSummary?.summary?.subtotal || 0}</span>
              </div>

              <Link href="/checkout">
                <button className="mt-6 w-full bg-linear-to-r from-[#800000] via-[#6b0000] to-[#4a0000] text-white py-3 rounded-xl font-semibold cursor-pointer">
                  Checkout
                </button>
              </Link>

              <Link href="/shop">
                <button className="mt-3 w-full border py-3 rounded-xl text-amber-900 cursor-pointer">
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
