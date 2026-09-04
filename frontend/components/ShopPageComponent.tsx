"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

import Pagination from "@/components/Pagination";
import ProductCard from "./ProductCard";
import Loading from "@/app/loading";

import { getProductList } from "@/services/Product.service";
import { ProductCardType } from "@/types/product.type";

import API from "@/lib/axios";

type SortOption = "" | "newest" | "oldest" | "price_asc" | "price_desc";

export default function ShopPageComponent() {
  const params = useSearchParams();

  const [products, setProducts] = useState<ProductCardType[]>([]);
  const [brandList, setBrandList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const itemsPerPage = 12;

  const [loading, setLoading] = useState(true);

  // FILTER STATES
  const [sort, setSort] = useState<SortOption>("");
  const [onSale, setOnSale] = useState<boolean | undefined>(undefined);
  const [isNewArrival, setIsNewArrival] = useState<boolean | undefined>(
    undefined,
  );

  // const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const offerParam = params.get("offer");
    const newParam = params.get("new");

    setOnSale(offerParam === null ? undefined : offerParam === "true");

    setIsNewArrival(newParam === null ? undefined : newParam === "true");

    // Reset pagination when URL filters change
    setPage(1);
  }, [params]);

  /*
   * Fetch products
   */
  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      setLoading(true);

      try {
        const data = await getProductList({
          page,
          limit: itemsPerPage,

          // category: selectedCategory || undefined,
          brand: selectedBrand || undefined,

          onsale: onSale,
          isNew: isNewArrival,

          sort: sort || undefined,
        });

        if (cancelled) return;

        setProducts(data.data || []);
        setTotalPages(data.pages || 1);
        setTotalItems(data.total || 0);
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to fetch products:", error);

        setProducts([]);
        setTotalPages(1);
        setTotalItems(0);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [page, sort, onSale, isNewArrival, selectedBrand]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/subcategory/admin/list");
        setBrandList(res.data.data || res.data);
      } catch (error) {
        console.error("Failed to fetch subcategories:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {!loading && (
        <div className="flex flex-col xl:flex-row gap-6 relative">
          {/* Mobile Overlay */}
          {open && (
            <div
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/40 z-50 xl:hidden"
            />
          )}

          {/* Sidebar */}
          <aside
            className={`fixed xl:sticky top-0 xl:top-22 left-0 h-screen overflow-y-auto xl:h-[88vh] w-60 bg-white xl:mt-5 z-50 xl:z-0 transform transition-transform p-5 xl:p-0 ${
              open ? "translate-x-0" : "-translate-x-full"
            } xl:translate-x-0`}
          >
            {/* Sidebar Header */}
            <div className="flex justify-between items-center mb-3 border-b border-amber-900/50 pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-amber-900" />

                <h3 className="font-semibold text-[#800000]">Filters</h3>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="xl:hidden text-amber-800"
              >
                ✕
              </button>
            </div>

            {/* On Sale */}
            <div className="border-b border-amber-900/50 pb-3 mb-3">
              <h4 className="font-semibold text-sm mb-3 text-[#800000] flex justify-between items-center">
                On Sale
                <button
                  type="button"
                  onClick={() => {
                    setPage(1);
                    setOnSale(undefined);
                  }}
                  className="text-xs text-gray-500 hover:text-[#800000]"
                >
                  Clear
                </button>
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
                     className=" accent-amber-700"
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
                     className=" accent-amber-700"
                  />
                  No
                </label>

              </div>
            </div>

            {/* Category */}
            <div className="">
              <h4 className="font-semibold text-sm mb-3 text-[#800000] flex items-center justify-between">
                Category
                <button
                  type="button"
                  onClick={() => {
                    setPage(1);
                    setSelectedBrand('');
                  }}
                  className="text-xs text-gray-500 hover:text-[#800000]"
                >
                  Clear
                </button>
              </h4>

              <div className="space-y-2 text-sm">
                {brandList.map((cat:any, i:number) => (
                  <label key={i} className="flex gap-2 items-center cursor-pointer capitalize">
                    <input
                      type="radio"
                      checked={selectedBrand === cat.id}
                      onChange={() => {
                        setPage(1);
                        setSelectedBrand(cat.id);
                      }}
                      className=" accent-amber-700"
                    />
                    {cat.name}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Section */}
          <div className="flex-1 mt-5">
            {/* Mobile Header */}
            <div className="flex justify-between items-center mb-4 xl:hidden">
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
            <div className="hidden xl:flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#800000]">
                Shop Products
              </h2>

              <select
                value={sort}
                onChange={(e) => {
                  setPage(1);
                  setSort(e.target.value as SortOption);
                }}
                className="border border-[#800000] text-[#800000] rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#800000]"
              >
                <option value="">Sort by</option>
                <option value="newest">New → Old</option>
                <option value="oldest">Old → New</option>
                <option value="price_asc">Price Low → High</option>
                <option value="price_desc">Price High → Low</option>
              </select>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
              {products.length > 0 ? (
                products.map((item, i) => (
                  <div key={item._id || i}>
                    <ProductCard item={item} />
                  </div>
                ))
              ) : (
                <div className="col-span-full py-16 text-center">
                  <p className="text-gray-500">No products found.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {products.length > 0 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setPage}
              />
            )}
          </div>
        </div>
      )}

      {loading && <Loading />}
    </>
  );
}
