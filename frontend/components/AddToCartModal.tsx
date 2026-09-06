"use client";

import Image from "next/image";
import { X, ShoppingCart, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { getProductDetails } from "@/services/Product.service";
import type { Product } from "@/types/product.type";

import { useCartStore } from "@/store/cart.store";

type Props = {
  open: boolean;
  onClose: () => void;
  productId: string;
};

export default function AddToCartModal({ open, onClose, productId }: Props) {
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState<Product | null>(null);

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState("");

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!open || !productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);

        const data = await getProductDetails(productId);

        setProduct(data);
        const firstImage = data?.variants?.[0]?.images?.[0];
        if (firstImage) setSelectedImage(firstImage);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [open, productId]);

  const activeVariant = product?.variants?.[selectedVariantIndex];
  const images = activeVariant?.images || [];

  const cartItem = useCartStore((state) =>
    state.cart.find(
      (item) =>
        item.productId === product?.id &&
        item.variantKey === activeVariant?.sku,
    ),
  );

  useEffect(() => {
    if (!activeVariant) return;

    const existingQty = cartItem?.quantity || 1;

    setQuantity(existingQty);
  }, [selectedVariantIndex, activeVariant]);

  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    if (!product || !activeVariant) return;

    addToCart({
      productId: product.id,
      variantKey: activeVariant.sku,
      quantity,

      productName: product.name,

      productImage: selectedImage || activeVariant.images?.[0] || "",

      variantLabel: `${activeVariant.color || ""} / ${activeVariant.size || ""}`,

      price: activeVariant.discountPrice || activeVariant.price,
    });

    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-300">
          <h2 className="text-xl font-bold">Add to Cart</h2>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-red-600 hover:text-white transition cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-20 flex items-center justify-center">
            <Loader2 className="size-8 animate-spin text-[#800000]" />
          </div>
        )}

        {/* Content */}
        {!loading && product && (
          <div className="p-5">
            <div className="flex gap-4">
              <div className="space-y-4">
                <div className="rounded-xl overflow-hidden">
                  <Image
                    src={selectedImage || activeVariant?.images?.[0] || ""}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="size-28 object-cover bg-white"
                  />
                </div>

                <div className="flex gap-3">
                  {images.map((img: string, i: number) => (
                    <div
                      key={i}
                      className={`size-10 rounded-lg overflow-hidden border-2 cursor-pointer ${
                        selectedImage === img
                          ? "border-[#800000]"
                          : "border-gray-300"
                      }`}
                      onClick={() => setSelectedImage(img)}
                    >
                      <Image
                        src={img}
                        alt=""
                        width={100}
                        height={100}
                        className="w-full h-full object-cover bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-lg text-start capitalize">
                  {product.name}
                </h3>

                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold text-[#800000]">
                    ৳{" "}
                    {activeVariant?.discountPrice
                      ? activeVariant?.discountPrice
                      : activeVariant?.price || 0}
                  </span>
                  {activeVariant?.discountPrice && (
                    <span
                      className={`line-through text-sm text-gray-400 ml-2 ${activeVariant?.discountPrice ? "" : "hidden"}`}
                    >
                      ৳{" "}
                      {activeVariant?.discountPrice
                        ? activeVariant?.price
                        : activeVariant?.discountPrice || 0}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="mt-6">
              <p className="font-medium mb-3 text-start">Select Variant</p>

              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedVariantIndex(i);

                      const newVariant = product.variants[i];

                      const existing = useCartStore
                        .getState()
                        .cart.find(
                          (item) =>
                            item.variantKey ===
                            `${newVariant.color}-${newVariant.size}`,
                        );

                      setQuantity(existing?.quantity || 1);
                    }}
                    className={`px-4 py-2 rounded-xl border text-xs font-medium transition cursor-pointer ${
                      selectedVariantIndex === i
                        ? "bg-[#800000] text-white border-[#800000]"
                        : "border-gray-300"
                    }`}
                  >
                    {variant.color} / {variant.size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-6">
              <p className="font-medium mb-3 text-start">Quantity</p>

              <div className="flex items-center w-fit rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-1.5 text-lg font-semibold text-gray-600 hover:bg-gray-100 active:scale-95 transition cursor-pointer"
                >
                  −
                </button>

                <span className="px-6 py-1.5 min-w-12 text-center font-medium text-gray-800 border-l border-r border-gray-200">
                  {quantity}
                </span>

                <button
                  onClick={() =>
                    setQuantity((q) => (activeVariant ? Math.min(q + 1) : q))
                  }
                  className="px-4 py-1.5 text-lg font-semibold text-gray-600 hover:bg-gray-100 active:scale-95 transition cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add To Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!activeVariant}
              className="w-full mt-8 bg-linear-to-r from-[#800000] to-[#b30000] text-white py-2 rounded-xl font-semibold flex items-center justify-center gap-2 transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >
              <ShoppingCart className="size-5" />
              Add To Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
