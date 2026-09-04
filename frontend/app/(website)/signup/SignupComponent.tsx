"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Mail, PhoneCall, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
  };

  return (
    <div className="bg-white p-6 sm:p-8">
      {/* Header */}
      <div className="mb-6 text-center sm:text-left">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Create Account
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Join us today to manage orders and fast checkout.
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-3.5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Full Name
          </label>
          <div className="relative flex items-center">
            <User size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              onChange={handleChange}
              value={form.name}
              name="name"
              type="text"
              placeholder="John Doe"
              required
              className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50/70 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-900/10 focus:border-rose-900 transition-all"
            />
          </div>
        </div>

        {/* Email & Phone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email
            </label>
            <div className="relative flex items-center">
              <Mail size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                onChange={handleChange}
                value={form.email}
                name="email"
                type="email"
                placeholder="you@email.com"
                required
                className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50/70 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-900/10 focus:border-rose-900 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Phone
            </label>
            <div className="relative flex items-center">
              <PhoneCall size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                onChange={handleChange}
                value={form.phone}
                name="phone"
                type="tel"
                placeholder="01XXXXXXXXX"
                required
                className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50/70 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-900/10 focus:border-rose-900 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Password & Confirm Password Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                onChange={handleChange}
                value={form.password}
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-9 py-2 text-xs bg-slate-50/70 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-900/10 focus:border-rose-900 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                onChange={handleChange}
                value={form.confirmPassword}
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-9 py-2 text-xs bg-slate-50/70 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-900/10 focus:border-rose-900 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={form.agreeToTerms}
              onChange={handleChange}
              required
              className="h-4 w-4 rounded border-slate-300 text-rose-900 focus:ring-rose-900/20 transition"
            />
            <span className="text-xs text-slate-600">
              I agree to the{" "}
              <Link href="/terms" className="text-rose-900 font-medium underline-offset-2 hover:underline">
                Terms & Conditions
              </Link>
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-950 via-rose-900 to-rose-800 text-white font-medium text-xs sm:text-sm shadow-md shadow-rose-950/10 hover:shadow-lg hover:shadow-rose-950/20 transition-all flex items-center justify-center gap-2 group mt-2"
        >
          <span>Create Account</span>
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </button>
      </form>
    </div>
  );
}