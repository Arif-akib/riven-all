"use client";

import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, PhoneCall } from "lucide-react";
import API from "@/lib/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SignupComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [registerLoader, setRegisterLoader] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassowrd: "",
    phone: "",
  });

  const router = useRouter();

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setRegisterLoader(true);
    try {
      if (form.password != form.confirmPassowrd) {
        toast.error("Password and Confirm Password didnot match");
        return;
      }
      const res = await API.post("/user/register", form);
      router.push("/signin");
      toast.success("Registration complete");
    } catch (err) {
      toast.error("Can not Register");
    } finally {
      setRegisterLoader(false);
    }
  };
  return (
    <div className="p-10 bg-white">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>

      <p className="text-gray-500 mb-5">Sign up to start shopping</p>

      <form onSubmit={handleRegister} className="space-y-3">
        {/* Name */}
        <div>
          <label className="text-sm text-gray-600">Full Name</label>

          <div className="flex items-center mt-1 border border-amber-800 rounded-lg px-3 py-2 focus-within:border-[#800020]">
            <User size={18} className="text-amber-800 mr-2" />

            <input
              onChange={handleChange}
              value={form.name}
              name="name"
              type="text"
              placeholder="John Doe"
              className="w-full outline-none"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-gray-600">Email Address</label>

          <div className="flex items-center mt-1 border border-amber-800 rounded-lg px-3 py-2 focus-within:border-[#800020]">
            <Mail size={18} className="text-amber-800 mr-2" />

            <input
              onChange={handleChange}
              value={form.email}
              name="email"
              type="email"
              placeholder="you@email.com"
              className="w-full outline-none"
            />
          </div>
        </div>
        {/* phone  */}
        <div>
          <label className="text-sm text-gray-600">Phone Number</label>

          <div className="flex items-center mt-1 border border-amber-800 rounded-lg px-3 py-2 focus-within:border-[#800020]">
            <PhoneCall size={18} className="text-amber-800 mr-2" />

            <input
              onChange={handleChange}
              value={form.phone}
              name="phone"
              min={11}
              max={11}
              type="number"
              placeholder="01xxxxxxxxx"
              className="w-full outline-none"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-sm text-gray-600">Password</label>

          <div className="flex items-center mt-1 border border-amber-800 rounded-lg px-3 py-2 focus-within:border-[#800020]">
            <Lock size={18} className="text-amber-800 mr-2" />

            <input
              onChange={handleChange}
              value={form.password}
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={18} className="text-amber-800" />
              ) : (
                <Eye size={18} className="text-amber-800" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-sm text-gray-600">Confirm Password</label>

          <div className="flex items-center mt-1 border border-amber-800 rounded-lg px-3 py-2 focus-within:border-[#800020]">
            <Lock size={18} className="text-amber-800 mr-2" />

            <input
              onChange={handleChange}
              value={form.confirmPassowrd}
              name="confirmPassowrd"
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              className="w-full outline-none"
            />

            <button type="button" onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? (
                <EyeOff size={18} className="text-amber-800" />
              ) : (
                <Eye size={18} className="text-amber-800" />
              )}
            </button>
          </div>
        </div>

        {/* Terms */}
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" />I agree to the Terms & Conditions
        </label>

        {/* Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-[#800020] text-white font-semibold hover:bg-[#650018] transition"
        >
          Create Account
        </button>

        {/* Divider */}
        {/* <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div> */}

        {/* Google Login */}
        {/* <div className="flex items-center justify-center gap-3 w-full py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition font-medium text-gray-700">
              <Image
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                width={20}
                height={20}
              />
              Continue with Google
            </div> */}

        {/* <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-[#800020] font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p> */}
      </form>
    </div>
  );
}
