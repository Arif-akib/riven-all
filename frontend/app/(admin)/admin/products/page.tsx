"use client";

import API from "@/lib/axios";
import { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import CreateProductModal from "./CreateProductModal";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Image as ImageIcon,
  Star,
  CheckCircle2,
  XCircle,
  Loader2,
  Package,
  Filter,
} from "lucide-react";

type Variant = {
  size: string;
  color: string;
  price: number;
  discountPrice?: number;
  countInStock: number;
  images: string[];
};

type Category = {
  _id: string;
  name: string;
};

type Brand = {
  _id: string;
  name: string;
};

type Product = {
  _id: string;
  name: string;
  category: Category;
  brand: Brand;
  variants: Variant[];
  isFeatured: boolean;
  isActive: boolean;
  dateCreated: string;
};

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // ------------------ FETCH DATA ------------------
  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        API.get("/products/admin/all-list"),
        API.get("/category/admin/list"),
      ]);
      setProducts(prodRes.data.data || []);
      setCategories(catRes.data.data || []);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to load product data",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ------------------ FILTER PRODUCTS ------------------
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory
        ? p.category?.name === selectedCategory ||
          p.category?._id === selectedCategory
        : true;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // ------------------ ACTIONS ------------------
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleToggleStatus = async (
    product: Product,
    field: "isActive" | "isFeatured",
  ) => {
    try {
      const updatedValue = !product[field];
      const res = await API.patch(`/products/admin/update/${product._id}`, {
        [field]: updatedValue,
      });

      if (res.data.success) {
        toast.success(
          `${field === "isActive" ? "Status" : "Featured"} updated successfully`,
        );
        setProducts((prev) =>
          prev.map((item) =>
            item._id === product._id
              ? { ...item, [field]: updatedValue }
              : item,
          ),
        );
      }
    } catch (err: any) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await API.delete(`/products/admin/delete/${id}`);
      if (res.data.success) {
        toast.success("Product deleted successfully");
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div className="space-y-6">
      {/* TOP CONTROLS & FILTERS */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 max-w-2xl">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product by title..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-900 focus:bg-white transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-rose-900 focus:bg-white transition-all text-slate-700 cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Create Button */}
        <button
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 bg-rose-900 hover:bg-rose-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-2xs cursor-pointer shrink-0"
        >
          <Plus size={18} /> Create Product
        </button>
      </div>

      {/* PRODUCT TABLE CONTAINER */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-rose-900" />
            <p className="text-sm">Fetching catalog products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Package className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-base font-medium text-slate-600">
              No products found
            </p>
            <p className="text-xs">
              Try adjusting your filters or add a new product.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="p-4 pl-6">Product</th>
                  <th className="p-4">Sub-Category</th>
                  <th className="p-4">Variants & Stock</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right sticky right-0 bg-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredProducts.map((p) => {
                  const primaryImage = p.variants?.[0]?.images?.[0];

                  return (
                    <tr
                      key={p._id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Product Name & Thumbnail */}
                      <td className="p-4 pl-6 max-w-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                            {primaryImage ? (
                              <img
                                src={primaryImage}
                                alt={p.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          <div className="truncate">
                            <p
                              className="font-semibold text-slate-900 truncate"
                              title={p.name}
                            >
                              {p.name}
                            </p>
                            <p className="text-[11px] font-mono text-slate-400 truncate">
                              ID: {p._id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4">
                        <p className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 whitespace-nowrap capitalize">
                          {p.brand?.name || "Unassigned"}
                        </p>
                      </td>

                      {/* Variants Grid */}
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1.5 max-w-sm">
                          {p.variants?.length ? (
                            p.variants.map((v, i) => {
                              const isOutOfStock = v.countInStock === 0;
                              const isLowStock =
                                v.countInStock <= 5 && !isOutOfStock;

                              return (
                                <div
                                  key={`pid${p._id}-vid${i}`}
                                  className="bg-slate-50 border border-slate-200 rounded-md p-1.5 text-[11px] space-y-0.5 min-w-[110px]"
                                >
                                  <div className="flex justify-between font-semibold text-slate-800">
                                    <span>
                                      {v.size || "-"} / {v.color || "-"}
                                    </span>
                                    <span>${v.price}</span>
                                  </div>
                                  <div className="flex justify-between items-center text-[10px]">
                                    <span
                                      className={
                                        isOutOfStock
                                          ? "text-red-600 font-medium"
                                          : isLowStock
                                            ? "text-amber-600 font-medium"
                                            : "text-emerald-600"
                                      }
                                    >
                                      Stock: {v.countInStock}
                                    </span>
                                    {v.discountPrice ? (
                                      <span className="text-rose-700 font-medium">
                                        ${v.discountPrice}
                                      </span>
                                    ) : null}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </div>
                      </td>

                      {/* Featured Toggle */}
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleStatus(p, "isFeatured")}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full font-medium border transition-colors cursor-pointer ${
                            p.isFeatured
                              ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                              : "bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              p.isFeatured
                                ? "fill-amber-500 text-amber-500"
                                : ""
                            }`}
                          />
                          {p.isFeatured ? "Featured" : "Regular"}
                        </button>
                      </td>

                      {/* Created Date */}
                      <td className="p-4 text-xs text-slate-500 whitespace-nowrap">
                        {p.dateCreated
                          ? new Date(p.dateCreated).toLocaleDateString()
                          : "N/A"}
                      </td>

                      {/* Active Toggle */}
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleStatus(p, "isActive")}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full font-medium border transition-colors cursor-pointer ${
                            p.isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          {p.isActive ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5" />
                          )}
                          {p.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>

                      {/* Action Buttons */}
                      <td className="p-4 pr-6 text-right whitespace-nowrap sticky right-0 bg-white">
                        <div className="flex items-center justify-center gap-2">
                          
                          <button
                            onClick={() => handleEdit(p)}
                            className="p-1.5 text-slate-600 hover:text-rose-900 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <CreateProductModal
          setProducts={setProducts}
          setShowModal={setShowModal}
          showModal={showModal}
          editingProduct={editingProduct}
          isEditMode={isEditMode}
        />
      )}
    </div>
  );
}
