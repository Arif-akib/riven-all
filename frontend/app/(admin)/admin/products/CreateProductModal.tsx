"use client";

import API from "@/lib/axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import RichTextEditor from "@/components/Admin/textEditor";

type AttributeType = "size" | "color";

export default function CreateProductModal({
  setShowModal,
  editingProduct,
  setProducts,
  isEditMode,
}: any) {
  const [product, setProduct] = useState({
    name: "",
    slug: "",
    description: "",
    richDescription: "",
    materials: "",
    brand: "",
    isFeatured: false,
    isActive: true,
    isNewArrival: false,
    isOnsale: false,
    attributes: {
      size: [] as string[],
      color: [] as string[],
    },
  });

  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [brands, setBrands] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode && editingProduct) {
      setProduct({
        name: editingProduct.name || "",
        slug: editingProduct.slug || "",
        description: editingProduct.description || "",
        richDescription: editingProduct.richDescription || "",
        materials: editingProduct.materials || "",
        brand:
          typeof editingProduct.brand === "object"
            ? editingProduct.brand.id || editingProduct.brand._id
            : editingProduct.brand || "",
        isFeatured: editingProduct.isFeatured || false,
        isActive: editingProduct.isActive ?? true,
        isNewArrival: editingProduct.isNewArrival || false,
        isOnsale: editingProduct.isOnsale || false,
        attributes: {
          size: [],
          color: [],
        },
      });

      setVariants(editingProduct.variants || []);
    }
  }, [isEditMode, editingProduct]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setProduct((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "name") {
        updated.slug = value.toLowerCase().trim().replace(/\s+/g, "-");
      }

      return updated;
    });
  };

  const addAttribute = (type: AttributeType, value: string, setter: any) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    if (product.attributes[type].includes(trimmed)) {
      toast.error(`${trimmed} already added`);
      return;
    }

    setProduct((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [type]: [...prev.attributes[type], trimmed],
      },
    }));

    setter("");
  };

  const removeAttribute = (type: AttributeType, index: number) => {
    const updated = product.attributes[type].filter((_, i) => i !== index);

    setProduct((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [type]: updated,
      },
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/subcategory/admin/list");
        setBrands(res.data.data || res.data);
      } catch (error) {
        console.error("Failed to fetch subcategories:", error);
      }
    };

    fetchData();
  }, []);

  const generateVariants = () => {
    if (
      product.attributes.size.length === 0 ||
      product.attributes.color.length === 0
    ) {
      toast.error("Add at least one size and color first");
      return;
    }

    const generated = product.attributes.size.flatMap((size) =>
      product.attributes.color.map((color) => ({
        size,
        color,
        price: 0,
        discountPrice: 0,
        countInStock: 0,
        images: [] as string[],
        pendingImages: [] as File[],
        sku: `${product.slug}-${color}-${size}`
          .toUpperCase()
          .replace(/\s+/g, "-"),
      }))
    );
    setVariants(generated);
  };

  const handleVariantImage = (e: any, index: number) => {
    const files = Array.from(e.target.files || []);

    setVariants((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        pendingImages: [...(updated[index].pendingImages || []), ...files],
      };
      return updated;
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("name", product.name);
      formData.append("slug", product.slug);
      formData.append("description", product.description);
      formData.append("richDescription", product.richDescription);
      formData.append("materials", product.materials);
      formData.append("brand", product.brand);

      formData.append("isFeatured", String(product.isFeatured));
      formData.append("isActive", String(product.isActive));
      formData.append("isNewArrival", String(product.isNewArrival));
      formData.append("isOnsale", String(product.isOnsale));

      const cleanVariants = variants.map((v) => ({
        size: v.size,
        color: v.color,
        price: v.price,
        discountPrice: v.discountPrice,
        countInStock: v.countInStock,
        images: v.images || [],
        sku: v.sku,
      }));

      formData.append("variants", JSON.stringify(cleanVariants));

      variants.forEach((variant, vIndex) => {
        (variant.pendingImages || []).forEach((file: File) => {
          formData.append(`variant_${vIndex}_image`, file);
        });
      });

      const url = isEditMode
        ? `/products/admin/update/${editingProduct._id}`
        : `/products/admin/create`;

      const method = isEditMode ? "patch" : "post";
      const res = await API[method](url, formData);

      if (res.data.success) {
        toast.success(isEditMode ? "Product updated" : "Product created");
        setShowModal(false);

        setProducts((prev: any[]) => {
          if (isEditMode) {
            return prev.map((p) =>
              p._id === editingProduct._id ? res.data.data : p
            );
          }
          return [res.data.data, ...prev];
        });
      } else {
        toast.error(res.data.message || "Operation failed");
      }
    } catch (err: any) {
      console.error(err?.response?.data || err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 sm:p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-7xl rounded-2xl shadow-2xl overflow-hidden grid lg:grid-cols-3 max-h-[90vh] relative"
      >
        {/* LEFT COLUMN - CONTENT AREA */}
        <div className="lg:col-span-2 p-6 sm:p-8 space-y-8 overflow-y-auto max-h-[45vh] lg:max-h-[90vh]">
          <div className="flex items-center justify-between border-b pb-4">
            <h1 className="text-2xl font-bold text-[#800000]">
              {isEditMode ? "Edit Product" : "Create Product"}
            </h1>
            <span className="text-sm text-gray-500">
              {isEditMode ? `ID: ${editingProduct._id}` : "Draft Mode"}
            </span>
          </div>

          {/* BASIC INFO */}
          <div className="bg-gray-50 p-6 rounded-2xl space-y-4 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-800 text-lg">Basic Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <input
                name="name"
                placeholder="Product Name"
                value={product.name}
                onChange={handleChange}
                disabled={isSubmitting}
                className="border-b border-gray-300 focus:border-[#800000] focus:outline-none py-1.5 transition disabled:opacity-50"
              />

              <input
                name="slug"
                placeholder="Slug"
                value={product.slug}
                onChange={handleChange}
                disabled={isSubmitting}
                className="border-b border-gray-300 focus:border-[#800000] focus:outline-none py-1.5 transition disabled:opacity-50"
              />

              <select
                name="brand"
                value={product.brand}
                onChange={handleChange}
                disabled={isSubmitting}
                className="border-b border-gray-300 focus:border-[#800000] focus:outline-none py-1.5 text-gray-700 bg-transparent transition disabled:opacity-50"
              >
                <option value="">Select Brand</option>
                {brands.map((c: any) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <div className="md:col-span-3 space-y-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                    Short Description
                  </label>
                  <RichTextEditor
                    value={product.description}
                    placeholder="Short description..."
                    onChange={(val: any) =>
                      setProduct((prev) => ({ ...prev, description: val }))
                    }
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                    Materials
                  </label>
                  <RichTextEditor
                    value={product.materials}
                    placeholder="Materials description..."
                    onChange={(val: any) =>
                      setProduct((prev) => ({ ...prev, materials: val }))
                    }
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                    Full Description
                  </label>
                  <RichTextEditor
                    value={product.richDescription}
                    placeholder="Full product description..."
                    onChange={(val: any) =>
                      setProduct((prev) => ({ ...prev, richDescription: val }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ATTRIBUTES */}
          <div className="bg-gray-50 p-6 rounded-2xl space-y-5 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-800 text-lg">Attributes</h2>

            {/* SIZE */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                Sizes
              </label>
              <div className="flex gap-2">
                <input
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  placeholder="Add size (e.g. XL, 42)"
                  disabled={isSubmitting}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addAttribute("size", sizeInput, setSizeInput);
                    }
                  }}
                  className="border rounded-lg px-3 py-1.5 flex-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#800000] disabled:opacity-50"
                />
                <button
                  type="button"
                  disabled={isSubmitting}
                  className="bg-amber-900 hover:bg-amber-800 text-white px-4 py-1.5 rounded-lg text-sm transition disabled:opacity-50 cursor-pointer"
                  onClick={() => addAttribute("size", sizeInput, setSizeInput)}
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-3 text-xs">
                {product.attributes.size.map((s, i) => (
                  <span
                    key={i}
                    onClick={() => !isSubmitting && removeAttribute("size", i)}
                    className="bg-amber-900/10 text-amber-900 border border-amber-900/20 px-2.5 py-1 rounded-md cursor-pointer hover:bg-amber-900 hover:text-white transition flex items-center gap-1 font-medium"
                  >
                    {s} <span>✕</span>
                  </span>
                ))}
              </div>
            </div>

            {/* COLOR */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                Colors
              </label>
              <div className="flex gap-2">
                <input
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  placeholder="Add color (e.g. Red, Blue)"
                  disabled={isSubmitting}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addAttribute("color", colorInput, setColorInput);
                    }
                  }}
                  className="border rounded-lg px-3 py-1.5 flex-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#800000] disabled:opacity-50"
                />
                <button
                  type="button"
                  disabled={isSubmitting}
                  className="bg-amber-900 hover:bg-amber-800 text-white px-4 py-1.5 rounded-lg text-sm transition disabled:opacity-50 cursor-pointer"
                  onClick={() =>
                    addAttribute("color", colorInput, setColorInput)
                  }
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-3 text-xs">
                {product.attributes.color.map((c, i) => (
                  <span
                    key={i}
                    onClick={() => !isSubmitting && removeAttribute("color", i)}
                    className="bg-amber-900/10 text-amber-900 border border-amber-900/20 px-2.5 py-1 rounded-md cursor-pointer hover:bg-amber-900 hover:text-white transition flex items-center gap-1 font-medium"
                  >
                    {c} <span>✕</span>
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={generateVariants}
              className="bg-amber-900 hover:bg-amber-800 text-white px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer w-full transition shadow-sm disabled:opacity-50"
            >
              Generate Variant Combinations
            </button>
          </div>

          {/* VARIANTS LIST */}
          {variants.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-800 text-lg">
                Variants ({variants.length})
              </h2>

              {variants.map((v, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm grid md:grid-cols-2 gap-5 relative hover:border-gray-300 transition"
                >
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() =>
                      setVariants(variants.filter((_, idx) => idx !== i))
                    }
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50 transition disabled:opacity-50"
                  >
                    ✕
                  </button>

                  <div className="space-y-4">
                    <p className="font-bold text-[#800000] text-lg">
                      {v.size} / {v.color}
                    </p>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-600 uppercase">
                        Price
                      </label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={v.price}
                        disabled={isSubmitting}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[i].price = +e.target.value;
                          setVariants(updated);
                        }}
                        className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#800000] disabled:opacity-50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-600 uppercase">
                        Discount Price
                      </label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={v.discountPrice}
                        disabled={isSubmitting}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[i].discountPrice = +e.target.value;
                          setVariants(updated);
                        }}
                        className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#800000] disabled:opacity-50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-600 uppercase">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={v.countInStock}
                        disabled={isSubmitting}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[i].countInStock = +e.target.value;
                          setVariants(updated);
                        }}
                        className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#800000] disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-gray-600 uppercase block">
                      Product Images
                    </label>

                    <label className={`block border-2 border-dashed border-gray-300 rounded-xl p-5 text-center transition ${isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-[#800000] hover:bg-amber-50/20"}`}>
                      <input
                        type="file"
                        multiple
                        disabled={isSubmitting}
                        className="hidden"
                        onChange={(e) => handleVariantImage(e, i)}
                      />
                      <div className="text-xs text-gray-500 font-medium">
                        Click to upload images
                      </div>
                    </label>

                    <div className="flex gap-2 flex-wrap">
                      {v.images?.map((img: string, idx: number) => (
                        <div key={`up-${idx}`} className="relative group">
                          <img
                            src={img}
                            className="w-14 h-14 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => {
                              setVariants((prev) => {
                                const updated = [...prev];
                                updated[i] = {
                                  ...updated[i],
                                  images: updated[i].images.filter(
                                    (_: string, index: number) => index !== idx
                                  ),
                                };
                                return updated;
                              });
                            }}
                            className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition disabled:opacity-50"
                          >
                            ✕
                          </button>
                        </div>
                      ))}

                      {v.pendingImages?.map((file: File, idx: number) => (
                        <div key={`pending-${idx}`} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            className="w-14 h-14 object-cover rounded-lg border border-dashed border-amber-600 opacity-80"
                          />
                          <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => {
                              setVariants((prev) => {
                                const updated = [...prev];
                                updated[i] = {
                                  ...updated[i],
                                  pendingImages: updated[
                                    i
                                  ].pendingImages.filter(
                                    (_: File, index: number) => index !== idx
                                  ),
                                };
                                return updated;
                              });
                            }}
                            className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition disabled:opacity-50"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN - ACTIONS & TOGGLES */}
        <div className="bg-[#800000] text-white p-6 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-amber-900/30">
          <div className="space-y-6">
            <h3 className="text-lg font-bold border-b border-white/20 pb-2">
              Product Settings
            </h3>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={product.isActive}
                  name="isActive"
                  disabled={isSubmitting}
                  onChange={handleChange}
                  className="w-4 h-4 accent-amber-600 rounded cursor-pointer disabled:opacity-50"
                />
                <span className="font-medium text-sm">Active Status</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={product.isFeatured}
                  name="isFeatured"
                  disabled={isSubmitting}
                  onChange={handleChange}
                  className="w-4 h-4 accent-amber-600 rounded cursor-pointer disabled:opacity-50"
                />
                <span className="font-medium text-sm">Featured Product</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={product.isNewArrival}
                  name="isNewArrival"
                  disabled={isSubmitting}
                  onChange={handleChange}
                  className="w-4 h-4 accent-amber-600 rounded cursor-pointer disabled:opacity-50"
                />
                <span className="font-medium text-sm">New Arrival</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={product.isOnsale}
                  name="isOnsale"
                  disabled={isSubmitting}
                  onChange={handleChange}
                  className="w-4 h-4 accent-amber-600 rounded cursor-pointer disabled:opacity-50"
                />
                <span className="font-medium text-sm">On Sale</span>
              </label>
            </div>
          </div>

          <div className="space-y-3 mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-white text-[#800000] hover:bg-gray-100 w-full py-3 rounded-xl font-bold transition flex justify-center items-center gap-2 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-[#800000]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{isEditMode ? "Updating..." : "Creating..."}</span>
                </>
              ) : (
                <span>{isEditMode ? "Update Product" : "Create Product"}</span>
              )}
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setShowModal(false)}
              className="border border-white/40 hover:bg-white/10 text-white w-full py-2.5 rounded-xl font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}