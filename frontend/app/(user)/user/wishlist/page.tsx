"use client";

import ProductCard2 from "@/components/ProductCard";



const products = new Array(4).fill({
  name: "Premium Headphones",
  price: 120,
  oldPrice: 150,
  image: "/assets/images/home-3.webp",
  inStock: true,
});

export default function WishlistPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-6">My Wishlist ❤️</h1>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((item, i) => (
          <ProductCard2/>
        ))}
      </div>
    </div>
  );
}
