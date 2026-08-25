"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import {
  Heart,
  ShoppingCart,
  Facebook,
  Twitter,
  Instagram,
  ChevronRight,
  Gift,
  ShieldCheck,
  Headset,
} from "lucide-react";

import ProductCard from "@/components/ProductCard";
import Loading from "@/app/loading";

import {
  getProductDetails,
  getRelatedProducts,
} from "@/services/Product.service";

import type { Product, ProductCardType } from "@/types/product.type";

import { useCartStore } from "@/store/cart.store";

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductCardType[]>([]);

  const [loading, setLoading] = useState(true);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    if (!productId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await getProductDetails(productId);
        setProduct(res);

        const firstImage = res?.variants?.[0]?.images?.[0];
        if (firstImage) setSelectedImage(firstImage);

        if (res?.category?._id) {
          const related = await getRelatedProducts(res.category._id, productId);
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  const activeVariant = product?.variants?.[selectedVariantIndex];
  const images = activeVariant?.images || [];

  const addToCart = useCartStore((state) => state.addToCart);

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
  }, [selectedVariantIndex , activeVariant]);

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
  };

  if (loading || !product) {
    return <Loading />;
  }

  return (
    <div className="pt-5 px-5">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-gray-500 text-sm mb-6 flex gap-1 items-center">
          <Link href="/" className="hover:text-[#800000]">
            Home
          </Link>
          <ChevronRight size={14} />
          <Link href="/shop" className="hover:text-[#800000]">
            Shop
          </Link>
          <ChevronRight size={14} />
          <span className="text-amber-800">{product.name}</span>
        </nav>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Images */}
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden">
              <Image
                src={selectedImage || activeVariant?.images?.[0] || ""}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-125 object-cover bg-white"
              />
            </div>

            <div className="flex gap-3">
              {images.map((img: string, i: number) => (
                <div
                  key={i}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer ${
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

          {/* Product Info */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-gray-900 capitalize">
              {product.name}
            </h1>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-[#800000]">
                ৳{" "}
                {activeVariant?.discountPrice
                  ? activeVariant?.discountPrice
                  : activeVariant?.price || 0}
              </span>
              {activeVariant?.discountPrice && (
                <span
                  className={`line-through text-gray-400 ml-2 ${activeVariant?.discountPrice ? "" : "hidden"}`}
                >
                  ৳{" "}
                  {activeVariant?.discountPrice
                    ? activeVariant?.price
                    : activeVariant?.discountPrice || 0}
                </span>
              )}
            </div>

            <p className="text-gray-600 text-sm">{product.description}</p>

            {/* Sizes */}
            {/* <div>
              <h4 className="font-medium mb-2">Size</h4>
              <div className="flex gap-2">
                {product.variants?.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedVariantIndex(i)}
                    className={`border px-3 py-1 rounded-md transition ${
                      selectedVariantIndex === i
                        ? "border-[#800000] text-[#800000]"
                        : "border-gray-300"
                    }`}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div> */}

            {/* Colors */}
            {/* <div>
              <h4 className="font-medium mb-2">Colors</h4>
              <div className="flex gap-2">
                {product.variants?.map((v, i) => (
                  <span
                    key={i}
                    onClick={() => setSelectedVariantIndex(i)}
                    className={`w-8 h-8 rounded-full border cursor-pointer ${
                      selectedVariantIndex === i ? "ring-2 ring-[#800000]" : ""
                    }`}
                    style={{ backgroundColor: v.color }}
                  />
                ))}
              </div>
            </div> */}

            <div className="">
              <p className="font-medium mb-2">Select Variant</p>
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
                    className={`px-4 py-2 rounded-xl border text-xs font-medium transition ${
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
            <div className="flex flex-col items-start gap-3">
              <h4 className="font-medium">Quantity</h4>
              <div className="flex items-center rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-1.5 text-lg font-semibold text-gray-600 hover:bg-gray-100 active:scale-95 transition"
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
                  className="px-4 py-1.5 text-lg font-semibold text-gray-600 hover:bg-gray-100 active:scale-95 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleAddToCart}
                className="flex items-center px-8 bg-[#800000] text-white py-3 rounded-lg"
              >
                <ShoppingCart className="mr-2" size={16} />
                Add to Cart
              </button>

              <button className="border border-[#800000] text-[#800000] py-3 px-4 rounded-lg">
                <Heart size={16} />
              </button>
            </div>

            <div className="flex items-center gap-3 mt-4 text-gray-500">
              {" "}
              <span>Share:</span>{" "}
              <Facebook
                className="cursor-pointer hover:text-[#800000] transition"
                size={18}
              />{" "}
              <Twitter
                className="cursor-pointer hover:text-[#800000] transition"
                size={18}
              />{" "}
              <Instagram
                className="cursor-pointer hover:text-[#800000] transition"
                size={18}
              />{" "}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 bg-white p-6 rounded-xl shadow-sm">
          <div className="flex gap-6 border-b border-gray-200 mb-4">
            {["description", "materials"].map((tab) => (
              <button
                key={tab}
                className={`pb-2 text-sm capitalize ${
                  activeTab === tab
                    ? "border-b-2 border-[#800000] text-[#800000]"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="text-sm text-gray-700">
            {activeTab === "description" && <p>{product.description}</p>}
            {activeTab === "materials" && <p>{product.materials}</p>}
          </div>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-sm text-[#800000] py-3">
          <div className="flex flex-col justify-center items-center">
            <Gift className="text-[#800000] " size={40} />
            <p className="text-lg font-bold">100% Genuine Products</p>
            <p>Authentic products guaranteed</p>
          </div>
          <div className="flex flex-col justify-center items-center">
            <ShieldCheck className="text-[#800000] " size={40} />
            <p className="text-lg font-bold">100% Secure Payments</p>
            <p>Your payment is safe with us</p>
          </div>
          <div className="flex flex-col justify-center items-center">
            <Headset className="text-[#800000] " size={40} />
            <p className="text-lg font-bold">Help Center (+8809666737475)</p>
            <p>24/7 customer support</p>
          </div>
        </div>

        {/* Related */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6 text-[#800000]">
            Related Products
          </h3>
          {relatedProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts?.map((item, i) => (
                <ProductCard key={i} item={item} />
              ))}
            </div>
          ) : (
            <p>No products found</p>
          )}
        </div>
      </div>
    </div>
  );
}
