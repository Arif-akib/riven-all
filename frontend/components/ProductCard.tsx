"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Eye, Heart, ShoppingCart } from "lucide-react";

import { ProductCardType } from "@/types/product.type";
import AddToCartModal from "./AddToCartModal";
import { useWishlistStore } from "@/store/wishlist.store";

type ProductCardProps = {
  item: ProductCardType;
};

export default function ProductCard({ item }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(item._id);
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="group relative bg-white/70 backdrop-blur-xl border border-amber-800/20 rounded-xl shadow-sm duration-500 overflow-hidden p-2">
        {/* Soft glow */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-500 bg-linear-to-tr from-[#800000]/10 via-transparent to-[#800000]/10 blur-xl"></div>

        {/* Image */}
        <Link href={`/shop/${item?.id}`}>
          <div className="relative rounded-xl overflow-hidden bg-gray-50  w-full h-48">
            <div className="gap-1 flex flex-col items-end absolute top-1 right-1 z-10 font-medium">
              {item?.isNewArrival && (
                <div className=" flex items-center gap-1 py-0.5 px-2 text-xs rounded-md bg-linear-to-tr from-teal-600 to-emerald-500 text-white backdrop-blur">
                  {/* <TrendingUp className="size-5 text-white" /> */}
                  New Arrival
                </div>
              )}

              {item?.isFeatured && (
                <div className=" flex items-center gap-1 py-0.5 px-2 text-xs rounded-md bg-linear-to-tr from-orange-600 to-rose-500 text-white backdrop-blur">
                  {/* <TrendingUp className="size-5 text-white" /> */}
                  Best Selling
                </div>
              )}

              {item?.isOnsale && (
                <div className=" flex items-center gap-1 py-0.5 px-2 text-xs rounded-md bg-linear-to-tr from-rose-600 to-red-500 text-white">
                  {/* <BadgePercent className="size-5 text-white" /> */}
                  On Sale
                </div>
              )}
            </div>

            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover scale-105 group-hover:scale-110 transition duration-700 ease-out"
            />
          </div>

          {/* Content */}
          <div className=" space-y-1 relative z-10 mt-3 text-center">
            {/* Brand */}
            <p className="text-xs tracking-widest uppercase text-gray-400 font-medium">
              {item?.brand?.name}
            </p>

            {/* Title */}
            <h3 className="font-semibold leading-tight text-gray-900 group-hover:text-[#800000] transition h-10.25 line-clamp-2 capitalize">
              {item?.name}
            </h3>

            {/* Price */}
            <div className="flex items-center gap-3 justify-center">
              <p className="text-lg font-bold text-gray-900">
                ৳ {item?.discountPrice ? item.discountPrice : item?.price}
              </p>
              <p
                className={`text-sm text-gray-400 line-through ${item?.discountPrice ? "" : "hidden"}`}
              >
                ৳ {item?.discountPrice ? item.price : item?.discountPrice}
              </p>
            </div>
          </div>
        </Link>
        <div className="flex items-center justify-between pt-4">
          {/* Add to Cart Button */}
          <button
            onClick={() => setOpen(true)}
            className="relative px-5 py-2 text-sm font-semibold rounded-full bg-linear-to-r from-[#800000] to-[#b30000] text-white shadow-md shadow-red-900/30 hover:shadow-lg hover:shadow-red-900/50 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 overflow-hidden group cursor-pointer"
          >
            {/* Glow effect */}
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition rounded-full"></span>

            <span className="relative z-10 flex items-center gap-2">
              <ShoppingCart className="size-4" /> Cart
            </span>
          </button>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {/* View Button */}
            <Link href={`/shop/${item?.id}`} className="p-2 rounded-full bg-white/70 backdrop-blur-md border border-gray-200 shadow-sm hover:shadow-md hover:bg-amber-800 hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer">
              <Eye className="size-4" />
            </Link>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(item)}
              className={`p-2 rounded-full backdrop-blur-md border shadow-sm hover:shadow-md hover:bg-amber-700 hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer ${
                isWishlisted
                  ? "bg-amber-700 text-white border-amber-700"
                  : "bg-white/70 border-gray-200"
              }`}
            >
              <Heart className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <AddToCartModal
        open={open}
        onClose={() => setOpen(false)}
        productId={item.id}
      />
    </>
  );
}
