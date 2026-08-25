"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { SlidersHorizontal } from "lucide-react";

import Pagination from "@/components/Pagination";
import ProductCard from "./ProductCard";
import Loading from "@/app/loading";

import { getProductList } from "@/services/Product.service";
import { ProductCardType } from "@/types/product.type";

export default function ShopPageComponent() {
  const params = useSearchParams();

  const [products, setProducts] = useState<ProductCardType[]>([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 12;

  const [loading, setLoading] = useState(true);

  // FILTER STATES
  const [sort, setSort] = useState("");
  const [onSale, setOnSale] = useState<boolean | undefined>(undefined);
  const [isNewArrival, setIsNewArrival] = useState<boolean | undefined>(
    undefined,
  );

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  const [open, setOpen] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const data = await getProductList({
        page,
        limit: itemsPerPage,
        category: selectedCategory || undefined,
        brand: selectedBrand || undefined,
        onsale: onSale,
        isNew: isNewArrival,
        sort: sort as any,
      });

      setProducts(data.data || []);
      setTotalPages(data.pages || 1);
      setTotalItems(data.total || 0);
    } catch (err) {
      setProducts([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, sort, onSale, selectedCategory, selectedBrand]);

  useEffect(() => {
    const offer = params.get("offer");
    const newArrival = params.get("new");

    if (offer === "true") {
      setOnSale(true);
    }

    if (newArrival === "true") {
      setIsNewArrival(true);
    }
  }, [params]);

  return (
    <>
      {!loading && (
        <div className="flex flex-col lg:flex-row gap-6 relative">
          {/* Overlay (Mobile) */}
          {open && (
            <div
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />
          )}

          {/* Sidebar */}
          <aside
            className={`fixed lg:sticky top-0 lg:top-22 left-0 h-screen overflow-y-auto lg:h-fit w-60 bg-white p-6 shadow-lg lg:shadow-sm z-50 lg:z-0 transform transition-transform duration-300 rounded-none lg:rounded-2xl ${
              open ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0`}
          >
            {/* Mobile Header */}
            <div className="flex justify-between items-center mb-3 border-b border-amber-900/50 pb-3">
              <div className="flex items-center gap-2 ">
                <SlidersHorizontal size={18} className="text-amber-900" />
                <h3 className="font-semibold text-[#800000]">Filters</h3>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="lg:hidden text-amber-800"
              >
                ✕
              </button>
            </div>

            {/* On Sale */}
            <div className="border-b border-amber-900/50 pb-3 mb-3">
              <h4 className="font-semibold text-sm mb-3 text-[#800000]">
                On Sale
              </h4>

              <div className="space-y-2 text-sm">
                <label className="flex gap-2 items-center cursor-pointer">
                  <input
                    type="radio"
                    name="onSale"
                    checked={onSale === true}
                    onChange={() => {
                      setPage(1);
                      setOnSale(true);
                    }}
                  />
                  Yes
                </label>

                <label className="flex gap-2 items-center cursor-pointer">
                  <input
                    type="radio"
                    name="onSale"
                    checked={onSale === false}
                    onChange={() => {
                      setPage(1);
                      setOnSale(false);
                    }}
                  />
                  No
                </label>
              </div>
            </div>

            {/* Category */}
            <div className="mb-3 border-b border-amber-900/50 pb-3">
              <h4 className="font-semibold text-sm mb-3 text-[#800000]">
                Category
              </h4>

              <div className="space-y-2 text-sm">
                <label className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={selectedCategory === "watches"}
                    onChange={() => {
                      setPage(1);
                      setSelectedCategory(
                        selectedCategory === "watches" ? "" : "watches",
                      );
                    }}
                  />
                  Watches
                </label>

                <label className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={selectedCategory === "smart-watches"}
                    onChange={() => {
                      setPage(1);
                      setSelectedCategory(
                        selectedCategory === "smart-watches"
                          ? ""
                          : "smart-watches",
                      );
                    }}
                  />
                  Smart Watches
                </label>
              </div>
            </div>

            {/* Brand */}
            <div>
              <h4 className="font-semibold text-sm mb-3 text-[#800000]">
                Brand
              </h4>

              <div className="space-y-2 text-sm">
                <label className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={selectedBrand === "rolex"}
                    onChange={() => {
                      setPage(1);
                      setSelectedBrand(
                        selectedBrand === "rolex" ? "" : "rolex",
                      );
                    }}
                  />
                  Rolex
                </label>

                <label className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={selectedBrand === "casio"}
                    onChange={() => {
                      setPage(1);
                      setSelectedBrand(
                        selectedBrand === "casio" ? "" : "casio",
                      );
                    }}
                  />
                  Casio
                </label>
              </div>
            </div>
          </aside>

          {/* Products Section */}
          <div className="flex-1 mt-5">
            {/* Mobile Header */}
            <div className="flex justify-between items-center mb-4 lg:hidden">
              <h2 className="text-xl font-bold text-[#800000]">
                Shop Products
              </h2>

              <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-4 py-2 border border-[#800000] text-[#800000] rounded-md"
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#800000]">
                Shop Products
              </h2>

              <select
                value={sort}
                onChange={(e) => {
                  setPage(1);
                  setSort(e.target.value);
                }}
                className="border border-[#800000] text-[#800000] rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#800000] accent-amber-900"
              >
                <option value="">Sort by</option>
                <option value="newest" className=" accent-amber-900">New → Old</option>
                <option value="oldest">Old → New</option>
                <option value="price_asc">Price Low → High</option>
                <option value="price_desc">Price High → Low</option>
              </select>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
              {products.map((item, i) => (
                <div key={i}>
                  <ProductCard item={item} />
                </div>
              ))}
            </div>

            {/* Loading */}

            {/* Pagination */}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}

      {loading && <Loading />}
    </>
  );
}
