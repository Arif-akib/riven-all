"use client";

import ProductCard from "@/components/ProductCard";
import { useWishlistStore } from "@/store/wishlist.store";
import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const wishlist = useWishlistStore((state) => state.wishlist);
  if (wishlist.length < 1) {
    return (
      <div className="col-span-4 lg:col-span-3 min-h-112 flex flex-col items-center justify-center p-6 text-center bg-white rounded-xl border border-dashed border-gray-300">
        {/* Icon Container */}
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-800 mb-5 shadow-inner">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>

        {/* Heading & Text */}
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
          You have nothing saved
        </h2>
        <p className="text-gray-500 max-w-md mb-8 text-sm leading-relaxed">
          Looks like you haven't added anything to your wishlist yet. Explore
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
    );
  }
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
      {wishlist.map((item, i) => (
        <ProductCard item={item} />
      ))}
    </div>
  );
}
