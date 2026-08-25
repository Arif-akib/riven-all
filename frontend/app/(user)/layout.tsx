"use client";

import { Home, Package, MapPin, Heart, Settings, LogOut } from "lucide-react";
import ScrollToTop from "@/components/ScrollToTop";
import WebWrapper from "@/components/Wrapper/webWrapper";
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

  const pageContent = {
    "/user/dashboard": {
      title: "My Account",
      subtitle: "Welcome back, Arif Akib 👋",
    },
    "/user/orders": {
      title: "My Orders",
      subtitle: "Track, manage and review your orders",
    },
    "/user/address": {
      title: "My Addresses",
      subtitle: "Manage your shipping and billing addresses",
    },
    "/user/wishlist": {
      title: "Wishlist",
      subtitle: "Your saved favorite products",
    },
    "/user/settings": {
      title: "Account Settings",
      subtitle: "Update your profile and account preferences",
    },
  };

  const renderContent = () => {
    const content =
      pageContent[pathname as keyof typeof pageContent] ??
      pageContent["/user/dashboard"];

    return (
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">{content.title}</h1>
        <p className="text-rose-100 text-sm md:text-base">{content.subtitle}</p>
      </div>
    );
  };

  const menuItems = [
    { label: "Overview", icon: <Home size={18} />, href: "/user/dashboard" },
    {
      label: "My Orders",
      icon: <Package size={18} />,
      href: "/user/orders",
    },
    { label: "Wishlist", icon: <Heart size={18} />, href: "/user/wishlist" },
    {
      label: "Addresses",
      icon: <MapPin size={18} />,
      href: "/user/address",
    },
    {
      label: "Settings",
      icon: <Settings size={18} />,
      href: "/user/settings",
    },
  ];

  return (
    <>
      <Header />
      <div className="w-full min-h-[70vh] bg-gradient-to-br from-rose-50 via-red-50 to-amber-50 pb-12">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#800000] via-[#6b0000] to-[#4a0000] min-h-44 flex items-center text-white shadow-lg">
          <WebWrapper>{renderContent()}</WebWrapper>
        </div>

        <WebWrapper>
          <div className="flex items-start gap-8 mt-8 relative">
            {/* SIDEBAR */}
            <aside className="w-72 bg-white rounded-2xl shadow-xl border border-rose-200 flex flex-col overflow-hidden sticky top-24">
              {/* User Profile */}
              <div className="p-6 flex items-center gap-2 bg-rose-100">
                <p className="size-10 bg-gradient-to-r from-[#800000] via-[#6b0000] to-[#4a0000] text-2xl font-extrabold text-white rounded-full flex justify-center items-center">
                  A
                </p>

                <div>
                  <p className="font-semibold text-gray-800">Arif Akib</p>
                  <p className="text-sm text-gray-500">a@gmail.com</p>
                </div>
              </div>

              {/* MENU */}
              <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => {
                  const active = pathname === item.href;

                  return (
                    <Link
                      href={item.href}
                      key={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium ${active ? "bg-gradient-to-r from-[#800000] via-[#6b0000] to-[#4a0000] text-white" : "text-gray-700 hover:bg-rose-100"}`}
                    >
                      <span>{item.icon}</span>

                      {item.label}
                    </Link>
                  );
                })}
                <button
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium text-rose-800 hover:bg-rose-100 w-full`}
                >
                  <span className={`text-rose-700`}>
                    <LogOut size={18} />
                  </span>
                  Logout
                </button>
              </nav>
            </aside>

            {/* CONTENT AREA */}
            <main className="flex-1 bg-white rounded-2xl shadow-xl border border-rose-100 p-8 min-h-[440px]">
              {children}
            </main>
          </div>
        </WebWrapper>
      </div>

      <ScrollToTop />
      <Footer />
    </>
  );
}
