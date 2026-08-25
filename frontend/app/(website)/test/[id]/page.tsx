"use client";
import { useState } from "react";
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
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
export default function ProductDetailsPage() {
  const product = {
    name: "Premium Leather Shoes",
    price: 199,
    images: [
      "/products/shoe1.jpg",
      "/products/shoe2.jpg",
      "/products/shoe3.jpg",
    ],
    description:
      "Premium leather shoes handcrafted with care. Comfortable, stylish, and long-lasting.",
    materials:
      "Genuine leather, rubber sole, cotton laces. Eco-friendly dyes used.",
    reviews: [
      { id: 1, user: "Alice", rating: 5, comment: "Super comfortable!" },
      { id: 2, user: "Bob", rating: 4, comment: "Stylish, but a bit tight." },
    ],
    sizes: ["6", "7", "8", "9", "10"],
    colors: ["#800000", "#6b0000", "#4a0000"],
  };
  const relatedProducts = new Array(4).fill(null);
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  return (
    <div className="pt-10">
      {" "}
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-gray-500 text-sm mb-6 flex gap-1 items-center">
          <Link href="/" className="hover:text-[#800000]">
            {" "}
            Home{" "}
          </Link>
          <ChevronRight size={14} />{" "}
          <Link href="/shop" className="hover:text-[#800000]">
            {" "}
            Shop{" "}
          </Link>{" "}
          <ChevronRight size={14} />{" "}
          <span className="text-gray-700">{product.name}</span>{" "}
        </nav>
        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-10">
          {" "}
          {/* Left: Images */}
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-125 object-cover group-hover:scale-105 transition duration-500 bg-white"
              />
            </div>
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <div
                  key={i}
                  className={`w - 20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer ${selectedImage === img ? "border-[#800000]" : "border-gray-300"}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${i}`}
                    className="w-full h-full object-cover bg-white"
                  />
                </div>
              ))}
            </div>
          </div>{" "}
          {/* Right: Product Info */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center gap-4">
              {" "}
              <span className="text-3xl font-bold text-[#800000]">
                {" "}
                ৳ {product.price}{" "}
              </span>{" "}
              <span className="text-sm text-gray-500 line-through">
                $249
              </span>{" "}
            </div>
            {/* Brief Description */}
            <p className="text-gray-600 text-sm mt-2">
              {" "}
              Handcrafted premium leather shoes designed for comfort, style, and
              durability.{" "}
            </p>
            {/* Sizes */}
            <div>
              <h4 className="font-medium mb-2">Size</h4>
              <div className="flex gap-2">
                {" "}
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className="border border-gray-300 px-3 py-1 rounded-md hover:border-[#800000] hover:text-[#800000] transition"
                  >
                    {" "}
                    {size}{" "}
                  </button>
                ))}
              </div>
            </div>{" "}
            {/* Colors */}
            <div>
              <h4 className="font-medium mb-2">Colors</h4>
              <div className="flex gap-2">
                {" "}
                {product.colors.map((color, i) => (
                  <span
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer hover:border-[#800000] transition"
                    style={{ backgroundColor: color }}
                  ></span>
                ))}
              </div>
            </div>
            {/* Quantity Selector */}
            <div className="flex items-center gap-3">
              {" "}
              <h4 className="font-medium">Quantity:</h4>{" "}
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                {" "}
                <button
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition"
                  onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                >
                  {" "}
                  -{" "}
                </button>{" "}
                <span className="px-4 py-1">{quantity}</span>
                <button
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  {" "}
                  +{" "}
                </button>{" "}
              </div>{" "}
            </div>{" "}
            {/* Add to Cart / Wishlist */}{" "}
            <div className="flex gap-3 mt-4">
              <button className="flex items-center px-8 bg-[#800000] text-white py-3 rounded-lg font-semibold hover:bg-[#5e0000] transition">
                {" "}
                <ShoppingCart className="inline mr-2" size={16} /> Add to
                Cart{" "}
              </button>{" "}
              <button className="border border-[#800000] text-[#800000] py-3 px-4 rounded-lg hover:bg-[#800000] hover:text-white transition">
                {" "}
                <Heart size={16} />{" "}
              </button>{" "}
            </div>
            {/* Social Sharing */}{" "}
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
            </div>{" "}
          </div>{" "}
        </div>
        {/* Tabs: Description, Ingredients, Reviews */}
        <div className="mt-12 bg-white p-6 rounded-xl shadow-sm">
          {" "}
          <div className="flex gap-6 border-b mb-4">
            {" "}
            {["description", "materials", "reviews"].map((tab) => (
              <button
                key={tab}
                className={`pb - 2 font-medium text-sm ${activeTab === tab ? "border-b-2 border-[#800000] text-[#800000]" : "text-gray-500"}`}
                onClick={() => setActiveTab(tab)}
              >
                {" "}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}{" "}
              </button>
            ))}{" "}
          </div>
          <div className="text-gray-700 text-sm">
            {" "}
            {activeTab === "description" && <p>{product.description}</p>}{" "}
            {activeTab === "materials" && <p>{product.materials}</p>}{" "}
            {activeTab === "reviews" && (
              <div className="space-y-4">
                {" "}
                {product.reviews.map((rev) => (
                  <div key={rev.id} className="border-b pb-2">
                    {" "}
                    <div className="flex justify-between items-center">
                      {" "}
                      <span className="font-medium">{rev.user}</span>{" "}
                      <span>{rev.rating} ⭐</span>{" "}
                    </div>{" "}
                    <p className="text-gray-500 text-sm">{rev.comment}</p>{" "}
                  </div>
                ))}{" "}
              </div>
            )}{" "}
          </div>
        </div>
        {/* Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-sm text-[#800000] py-3">
          {" "}
          <div className="flex flex-col justify-center items-center">
            {" "}
            <Gift className="text-[#800000] " size={40} />{" "}
            <p className="text-lg font-bold">100% Genuine Products</p>{" "}
            <p>Authentic products guaranteed</p>{" "}
          </div>{" "}
          <div className="flex flex-col justify-center items-center">
            {" "}
            <ShieldCheck className="text-[#800000] " size={40} />{" "}
            <p className="text-lg font-bold">100% Secure Payments</p>{" "}
            <p>Your payment is safe with us</p>{" "}
          </div>{" "}
          <div className="flex flex-col justify-center items-center">
            {" "}
            <Headset className="text-[#800000] " size={40} />{" "}
            <p className="text-lg font-bold">Help Center (+8809666737475)</p>{" "}
            <p>24/7 customer support</p>{" "}
          </div>{" "}
        </div>
        {/* Related Products */}
        <div className="mt-12">
          {" "}
          <h3 className="text-2xl font-bold mb-6 text-[#800000]">
            {" "}
            Related Products{" "}
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {" "}
            {relatedProducts.map((_, i) => (
              <ProductCard key={i} />
            ))}{" "}
          </div>{" "}
        </div>
      </div>{" "}
    </div>
  );
}
