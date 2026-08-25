import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { X, Search } from "lucide-react";

export default function SearchModal({ searchOpen, setSearchOpen }: any) {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [productList, setProductList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchOpen || !searchQuery.trim()) {
      setProductList([]);
      return;
    }

    const controller = new AbortController();
    const delayDebounce = setTimeout(async () => {
      try {
        setLoading(true);

        // const res = await apiClient.get<{
        //   success: boolean;
        //   data: any[];
        // }>(`/products/search?query=${encodeURIComponent(searchQuery)}`, {
        //   signal: controller.signal,
        // });

        // if (res.data.success) {
        //   setProductList(res.data.data);
        // }
      } catch (error: any) {
        if (error.name !== "CanceledError") {
          console.error("Search error:", error);
        }
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      clearTimeout(delayDebounce);
      controller.abort();
    };
  }, [searchOpen, searchQuery]);

  return (
    <div className="fixed inset-0 z-100 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="min-h-screen flex items-start justify-center p-4 pt-20">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col animate-in slide-in-from-top duration-300">
          {/* Modal Header */}
          <div className="p-6 border-b border-gray-100 relative">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for watches..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-900 focus:bg-white transition-all text-gray-700 text-sm md:text-base"
                  autoFocus
                />
              </div>
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className="p-2 bg-amber-900  rounded-full shadow-md hover:rotate-90 duration-300 cursor-pointer absolute top-2 right-2"
              >
                <X className="size-5 md:size-6 text-white" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {searchQuery.trim() === "" ? (
              // ================= EMPTY =================
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-amber-900" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Search Products
                </h3>
                <p className="text-gray-500 text-sm">
                  Start typing to search for your favorite watches
                </p>
              </div>
            ) : loading ? (
              // ================= LOADING =================
              <div className="text-center py-12">
                <div className="animate-pulse text-sm text-gray-500">
                  Searching products...
                </div>
              </div>
            ) : productList.length > 0 ? (
              // ================= RESULTS =================
              <div className="space-y-3">
                <p className="text-sm text-gray-500 mb-4">
                  Found {productList.length} products
                </p>

                {productList.slice(0, 8).map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                      router.push(`/shop/${product.slug}`);
                    }}
                    className="w-full flex items-start gap-4 p-4 hover:bg-pink-50 rounded-xl transition-colors group cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />

                    <div className="flex-1 text-left">
                      <h4 className="font-medium text-gray-900 group-hover:text-amber-900 transition-colors">
                        {product.name}
                      </h4>
                      {product.category && (
                        <p className="text-sm text-gray-500">
                          {product.category.name}
                        </p>
                      )}
                    </div>

                    <div className="text-lg font-semibold text-amber-900">
                      BDT{" "}
                      {product?.default_attribute?.discounted_price ??
                        product?.default_attribute?.price ??
                        product?.price}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              // ================= NO RESULT =================
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 text-sm">
                  Try searching with different keywords
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
