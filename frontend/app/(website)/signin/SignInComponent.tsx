"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Loader } from "lucide-react";
import toast from "react-hot-toast";
import API from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";

export default function SignInComponent() {
  const { setUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/user/login", form);

      if (!res.data.success) {
        toast.error("Login failed");
        return;
      }

      const user = res.data.data.user;

      const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      setUser(userData);

      const role = user.role;
      if (role == "riven") {
        router.push("/admin/dashboard");
      } else {
        router.push("/user/dashboard");
      }
    } catch (err) {
      toast.error("Login failed");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleLogin} className="space-y-3">
        {/* Email */}
        <div>
          <label className="text-sm text-gray-600">Email Address</label>

          <div className="flex items-center mt-1 border border-amber-800 rounded-lg px-3 py-2 focus-within:border-[#800020]">
            <Mail size={18} className="text-amber-800 mr-2" />
            <input
              type="email"
              name="email"
              placeholder="you@email.com"
              className="w-full outline-none"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-sm text-gray-600">Password</label>

          <div className="flex items-center mt-1 border border-amber-800 rounded-lg px-3 py-2 focus-within:border-[#800020]">
            <Lock size={18} className="text-amber-800 mr-2" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              className="w-full outline-none"
              required
              value={form.password}
              onChange={handleChange}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff size={18} className="text-amber-800" />
              ) : (
                <Eye size={18} className="text-amber-800" />
              )}
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center gap-2 text-xs">
            Don't remember password
          </label>

          <Link
            href="/forgot-password"
            className="text-[#800020] font-medium hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-[#800020] text-white font-semibold hover:bg-[#650018] transition active:scale-95 cursor-pointer flex justify-center items-center gap-2"
        >
          {loading && <Loader size={15} className="animate-spin"/>}
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </>
  );
}
