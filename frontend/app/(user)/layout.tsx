"use client";

import {
  LayoutDashboard,
  ShoppingBag,
  MapPin,
  Heart,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import ScrollToTop from "@/components/ScrollToTop";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const pageContent: Record<string, { title: string; subtitle: string }> = {
    "/user/dashboard": {
      title: "Account Overview",
      subtitle: "Here is what's happening with your account and recent orders",
    },
    "/user/orders": {
      title: "My Orders",
      subtitle: "Track shipments, view invoices, and manage returns",
    },
    "/user/address": {
      title: "Saved Addresses",
      subtitle: "Update shipping and billing locations for faster checkout",
    },
    "/user/wishlist": {
      title: "My Wishlist",
      subtitle: "Items you saved for later purchase",
    },
    "/user/settings": {
      title: "Account Settings",
      subtitle: "Control profile security, password, and notifications",
    },
  };

  const currentContent = pageContent[pathname] ?? {
    title: "User Account",
    subtitle: "Manage your account activity and preferences",
  };

  const menuItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/user/dashboard" },
    { label: "My Orders", icon: ShoppingBag, href: "/user/orders" },
    { label: "Wishlist", icon: Heart, href: "/user/wishlist" },
    { label: "Addresses", icon: MapPin, href: "/user/address" },
    { label: "Settings", icon: Settings, href: "/user/settings" },
  ];

  return (
    <div className="min-h-[70vh] bg-slate-50/70 selection:bg-rose-200">
      <Header />

      {/* Main Layout Area */}
      <div className="flex flex-col lg:flex-row">
        {/* Desktop Sticky Sidebar */}
        <aside className="hidden lg:block sticky top-20 w-60 h-[calc(100vh-80px)] bg-linear-to-r from-[#800000] via-[#6b0000] to-[#4a0000]">
          <div className="flex flex-col justify-between border-r border-slate-200/80 overflow-y-auto p-3 space-y-2 h-[calc(100vh-80px)]">
            <div className="space-y-3">
              <div className="p-1 bg-linear-to-b from-rose-50/70 to-slate-50/30 rounded-2xl border border-rose-100/60 flex items-center gap-3.5">
                <div className="relative">
                  <div className="h-12 w-12 rounded-2xl bg-linear-to-tr from-rose-950 via-rose-900 to-rose-700 text-white font-bold text-lg flex items-center justify-center shadow-md shadow-rose-900/10">
                    A
                  </div>
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-rose-950 truncate text-sm">
                    Arif Akib
                  </h2>
                  <p className="text-xs text-rose-950 truncate">a@gmail.com</p>
                </div>
              </div>

              {/* Sidebar Navigation */}
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        active
                          ? "bg-linear-to-r from-white to-rose-300 text-red-900 shadow-md shadow-rose-900/10"
                          : "text-slate-200 hover:bg-slate-100/70 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          size={18}
                          className={
                            active
                              ? "text-red-900"
                              : "text-slate-100 group-hover:text-slate-700"
                          }
                        />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight
                        size={16}
                        className={`transition-transform duration-200 ${
                          active
                            ? "opacity-100 text-red-900 translate-x-0"
                            : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-slate-800"
                        }`}
                      />
                    </Link>
                  );
                })}
              </nav>
            </div>
            {/* User Profile Card */}

            {/* Logout Button */}
            <div className="pt-2 border-t border-rose-500/30">
              <button
                type="button"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white hover:text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="min-h-[calc(100vh-80px)] w-full max-w-[calc(100%-240px)] bg-slate-50/50 p-4 sm:p-8 font-sans text-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                {currentContent.title}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {currentContent.subtitle}
              </p>
            </div>
            <button className="self-start sm:self-auto bg-amber-800 hover:bg-amber-800 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition shadow-sm hover:shadow flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Start Shopping
            </button>
          </div>

          {children}
        </main>

        {/* Mobile Horizontal Navigation Tabs */}
        <div className="lg:hidden pb-2 w-[95%] sticky bottom-0 mx-auto">
          <nav className="flex items-center justify-around gap-2 min-w-max p-1.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? "bg-rose-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                  }`}
                >
                  <Icon size={16} />
                  <span className={`hidden md:inline`}>{item.label}</span>
                </Link>
              );
            })}
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all text-slate-600 hover:bg-slate-100/80 hover:text-slate-900">
              <LogOut size={16} />
              <span className={`hidden md:inline`}>Logout</span>
            </button>
          </nav>
        </div>
      </div>

      <ScrollToTop />
      <Footer />
    </div>
  );
}
