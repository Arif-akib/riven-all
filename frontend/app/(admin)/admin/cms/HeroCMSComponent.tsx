import { useEffect, useState } from "react";
import API from "@/lib/axios";
import toast from "react-hot-toast";

type Hero = {
  _id: string;
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  image: string;
  order?: number;
  isActive?: boolean;
};

export default function HeroCMS() {
  const [list, setList] = useState<Hero[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Hero | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [form, setForm] = useState<any>({
    title: "",
    subtitle: "",
    buttonText: "",
    buttonLink: "",
    order: 0,
    image: "",
    isActive: false,
  });

  // ---------------- FETCH ----------------
  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const res = await API.get("/cms/hero/admin/list");
        setList(res.data.data);
      } catch (err) {
        toast.error("No banner found");
      }
    };
    fetchHeroes();
  }, []);

  // ---------------- INPUT ----------------
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("subtitle", form.subtitle);
      formData.append("buttonText", form.buttonText);
      formData.append("buttonLink", form.buttonLink);
      formData.append("order", String(form.order || 0));
      formData.append("isActive", String(form.isActive));

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const url = editingBanner
        ? `/cms/hero/admin/update/${editingBanner._id}`
        : `/cms/hero/admin/create`;

      const method = editingBanner ? "patch" : "post";

      const res = await API[method](url, formData);

      if (res.data.success) {
        toast.success(editingBanner ? "Hero updated" : "Hero created");

        setList((prev: any[]) => {
          if (editingBanner) {
            return prev.map((p) =>
              p._id === editingBanner._id ? res.data.data : p,
            );
          }
          return [res.data.data, ...prev];
        });

        closeModal();
      } else {
        toast.error(res.data.message);
      }
    } catch (err: any) {

      toast.error(
        err?.response?.data?.message || err?.message || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------- EDIT ----------------
  const handleEdit = (item: Hero) => {
    setEditingBanner(item);

    setForm({
      title: item.title,
      subtitle: item.subtitle,
      buttonText: item.buttonText,
      buttonLink: item.buttonLink,
      order: item.order,
      isActive: item.isActive,
      image: item.image,
    });

    setPreview(item.image || null);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditingBanner(null);
    setPreview(null);
    setForm({
      title: "",
      subtitle: "",
      buttonText: "",
      buttonLink: "",
      order: 0,
      image: "",
      isActive: false,
    });
  };

  return (
    <div className="space-y-6 p-2">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-amber-900">Hero Banner</h2>

        <button
          onClick={() => setOpen(true)}
          className="border py-1.5 px-5 rounded-xl text-white bg-amber-900 text-xs"
        >
          Create
        </button>
      </div>

      {/* LIST */}
      <div className="grid grid-cols-3 gap-4">
        {list.map((item, i) => (
          <div
            key={item._id}
            className="group flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-1 shadow-sm hover:shadow-md transition relative"
          >
            {item.isActive && (
              <p className="text-xs bg-amber-900 absolute size-4 text-white rounded-full top-0 left-0"></p>
            )}
            {/* LEFT SIDE */}
            <div className="flex items-center gap-4 min-w-0">
              {/* IMAGE */}
              <div className="w-16 h-16 rounded-lg overflow-hidden border bg-gray-100 shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>

              {/* TEXT */}
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {item.order}. {item.title}
                </p>

                <p className="text-xs text-gray-500 truncate">
                  {item.buttonLink || "No link set"}
                </p>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <button
              onClick={() => handleEdit(item)}
              className="shrink-0 rounded-lg bg-[#7a001f] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-90 active:scale-[0.98] transition"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-white">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingBanner ? "Update Banner" : "Create Banner"}
              </h3>

              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-900 text-xl"
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5 max-h-[70vh] overflow-y-auto"
            >
              <div className="grid gap-4">
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Title"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:bg-white focus:border-gray-400 focus:ring-2 focus:ring-[#7a001f]/20 outline-none transition"
                />

                <input
                  name="subtitle"
                  value={form.subtitle}
                  onChange={handleChange}
                  placeholder="Subtitle"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:bg-white focus:border-gray-400 focus:ring-2 focus:ring-[#7a001f]/20 outline-none transition"
                />

                {/* IMAGE UPLOAD */}
                <label className="cursor-pointer">
                  <div className="border border-dashed border-gray-300 rounded-xl p-4 text-center bg-gray-50 hover:bg-gray-100 transition">
                    <p className="text-sm text-gray-600">
                      Click to upload banner image
                    </p>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      setImageFile(file);
                      setPreview(URL.createObjectURL(file));
                    }}
                    className="hidden"
                  />
                </label>

                {/* IMAGE PREVIEW */}
                {preview && (
                  <div className="relative rounded-xl overflow-hidden border shadow-sm">
                    <img src={preview} className="w-full h-44 object-cover" />

                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setPreview(null);
                      }}
                      className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 text-xs rounded-full hover:bg-black"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <input
                    name="buttonText"
                    value={form.buttonText}
                    onChange={handleChange}
                    placeholder="Button Text"
                    className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:bg-white focus:border-gray-400 focus:ring-2 focus:ring-[#7a001f]/20 outline-none transition"
                  />

                  <input
                    name="buttonLink"
                    value={form.buttonLink}
                    onChange={handleChange}
                    placeholder="Button Link"
                    className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:bg-white focus:border-gray-400 focus:ring-2 focus:ring-[#7a001f]/20 outline-none transition"
                  />
                </div>

                <input
                  name="order"
                  type="number"
                  value={form.order}
                  onChange={handleChange}
                  placeholder="Order"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:bg-white focus:border-gray-400 focus:ring-2 focus:ring-[#7a001f]/20 outline-none transition"
                />

                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                    className="accent-[#7a001f]"
                  />
                  Active Banner
                </label>
              </div>

              {/* FOOTER BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#7a001f] py-3 text-white font-semibold shadow-md hover:opacity-90 active:scale-[0.99] transition disabled:opacity-60"
              >
                {loading
                  ? "Saving..."
                  : editingBanner
                    ? "Update Banner"
                    : "Create Banner"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
