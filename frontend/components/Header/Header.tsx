"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { useAuthStore } from "@/store/auth.store";

import {
  Search,
  ShoppingBag,
  Heart,
  User,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  TrendingUp,
  Flame,
} from "lucide-react";

import WebWrapper from "../Wrapper/webWrapper";
import { navbarData } from "./HeaderData";

// Dynamic Navigation & Mega Menu Data
const categoriesMegaMenu = [
  {
    title: "Apparel & Fashion",
    href: "/category/fashion",
    featured: true,
    subcategories: [
      "Men's Wear",
      "Women's Collection",
      "Streetwear",
      "Footwear",
      "Accessories",
    ],
  },
  {
    title: "Electronics & Tech",
    href: "/category/electronics",
    subcategories: [
      "Audio & Headphones",
      "Smartwatches",
      "Laptops & Tablets",
      "Gaming Accessories",
    ],
  },
  {
    title: "Home & Living",
    href: "/category/home",
    subcategories: ["Furniture", "Lighting", "Decor", "Kitchenware"],
  },
  {
    title: "Beauty & Wellness",
    href: "/category/beauty",
    highlight: true,
    subcategories: ["Skincare", "Fragrances", "Haircare", "Organic Care"],
  },
];

const trendingSearches = [
  "Men's Watch",
  "Men's Sunglass",
  "Women's Watch",
  "Women's Sunglass",
];

export default function NextGenNavbar() {
  const { user, isAuthenticated } = useAuthStore();

  const cartItemCount = useCartStore((state) =>
    state.cart.reduce((sum, item) => sum + item.quantity, 0),
  );

  const getTotalWishlistItems = useWishlistStore((state) => state.wishlist);

  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const megaMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        megaMenuRef.current &&
        !megaMenuRef.current.contains(event.target as Node)
      ) {
        setIsMegaMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-neutral-200/80 transition-all">
      <WebWrapper>
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center group">
            <Image
              src="/assets/logo/logoh.png"
              width={160}
              height={40}
              alt="Brand Logo"
              className="w-32 lg:w-36 h-auto object-contain transition-transform group-hover:scale-105 duration-200"
              priority
            />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-5 2xl:gap-8 text-sm font-semibold text-neutral-800">
            {navbarData.map((item, index) => {
              if (item.hasMegaMenu) {
                return (
                  <div
                    key={index}
                    className="relative cursor-pointer"
                    ref={megaMenuRef}
                    onMouseEnter={() => setIsMegaMenuOpen(true)}
                    onMouseLeave={() => setIsMegaMenuOpen(false)}
                  >
                    <Link
                      href={item.link}
                      className={`flex items-center gap-1.5 py-3 hover:text-amber-800 transition-colors ${
                        isMegaMenuOpen ? "text-amber-800" : ""
                      }`}
                    >
                      <span className="whitespace-nowrap">{item.name}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isMegaMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </Link>

                    {/* Mega Menu Overlay */}
                    <div
                      className={`absolute top-full -left-12 w-212.5 bg-white rounded-2xl shadow-2xl border border-neutral-100 p-8 grid grid-cols-4 gap-6 z-50 transition-all duration-200 ease-out origin-top ${
                        isMegaMenuOpen
                          ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                      }`}
                    >
                      {item.categories?.map((cat, idx) => (
                        <div key={idx} className="space-y-3">
                          <Link
                            href={cat.href}
                            className="font-bold text-neutral-900 hover:text-amber-800 flex items-center gap-1 text-base transition-colors"
                          >
                            {cat.title}
                            {cat.featured && (
                              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            )}
                          </Link>
                          <ul className="space-y-2 text-sm text-neutral-500 font-normal">
                            {cat.items.map((sub, sIdx) => (
                              <li key={sIdx}>
                                <Link
                                  href={`${cat.href}/${sub
                                    .toLowerCase()
                                    .replace(/ /g, "-")}`}
                                  className="hover:text-neutral-900 transition-colors block"
                                >
                                  {sub}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}

                      {/* Mega Menu Promo Banner */}
                      <div className="col-span-4 mt-4 p-4 rounded-xl bg-linear-to-r from-amber-900 to-amber-950 text-white flex justify-between items-center">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                            Seasonal Sale
                          </p>
                          <p className="text-sm font-bold">
                            Up to 40% off on premium apparel
                          </p>
                        </div>
                        <Link
                          href="/offer"
                          className="bg-white text-neutral-900 px-4 py-2 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors"
                        >
                          Explore Deals
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={index}
                  href={`${item.link}${item.query}`}
                  className="hover:text-amber-800 transition-colors flex items-center gap-1"
                >
                  <span className="whitespace-nowrap">{item.name}</span>
                  {item.badge && (
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md">
                      {item.badge}
                    </span>
                  )}
                  {item.icon && (
                    <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Interactive Search Field */}
          <div className="hidden xl:flex max-w-xs relative">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between pl-10 pr-4 py-2.5 text-sm bg-neutral-100/80 hover:bg-neutral-100 text-neutral-500 rounded-full border border-transparent focus:border-neutral-300 transition-all text-left"
            >
              <span className="truncate">Search products, categories...</span>
              <kbd className="hidden lg:inline-block px-2 py-0.5 text-[10px] font-bold text-neutral-400 bg-white rounded-md border border-neutral-200">
                ⌘K
              </kbd>
            </button>
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Utility Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Account */}
            <Link
              href={user?.id && isAuthenticated ? "/user/dashboard" : "/signin" }
              className={`p-2.5 text-neutral-700 hover:text-amber-900 hover:bg-amber-50 rounded-full transition-all ${user?.id && isAuthenticated ? "bg-amber-700 text-white" : "" }`}
              aria-label="Account"
            >
              {user?.id && isAuthenticated ? <p className="size-5 flex justify-center items-center text-xl font-black">{ user.name.charAt(0)}</p> : <User className="w-5 h-5" /> }
              
            </Link>

            {/* Wishlist Button */}
            <Link
              href="/user/wishlist"
              className="p-2.5 text-neutral-700 hover:text-amber-900 hover:bg-amber-50 rounded-full transition-all relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {getTotalWishlistItems.length > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-amber-800 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {getTotalWishlistItems.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart Trigger */}
            <Link
              href="/cart"
              className="flex items-center gap-2.5 bg-amber-800 hover:bg-amber-900 text-white px-4 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-neutral-950 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-neutral-900">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="xl:hidden p-2 text-neutral-700 hover:text-amber-900 transition-colors cursor-pointer"
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* 3. Full-Screen Search Modal Overlay */}
        <div
          className={`fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-md flex justify-center pt-20 px-4 transition-opacity duration-200 h-screen ${
            isSearchOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 overflow-hidden h-fit transition-all duration-200 ease-out ${
              isSearchOpen
                ? "scale-100 translate-y-0 opacity-100"
                : "scale-95 -translate-y-5 opacity-0"
            }`}
          >
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-3 flex-1">
                <Search className="w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search for items, brands, or collections..."
                  className="w-full text-base outline-none text-neutral-800 placeholder-neutral-400 font-medium bg-transparent"
                  autoFocus={isSearchOpen}
                />
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Search Suggestions */}
            <div className="pt-4 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5 text-amber-800" />
                <span>Trending Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((term, i) => (
                  <button
                    key={i}
                    onClick={() => setIsSearchOpen(false)}
                    className="text-xs font-medium bg-neutral-100 hover:bg-amber-100 hover:text-amber-900 text-neutral-700 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Slide-Over Mobile Navigation Drawer */}
        <div
          className={`fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-xs xl:hidden transition-opacity duration-300 h-screen overflow-hidden ${
            isMobileMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-in-out ${
              isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4 border-neutral-100">
                <span className="font-bold text-lg text-neutral-900">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-4">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Explore
                </p>
                {categoriesMegaMenu.map((cat, i) => (
                  <Link
                    key={i}
                    href={cat.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-base font-semibold text-neutral-800 hover:text-amber-800 transition-colors"
                  >
                    {cat.title}
                  </Link>
                ))}
                <Link
                  href="/deals"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-semibold text-amber-800 flex items-center gap-1.5"
                >
                  <span>Flash Deals</span>
                  <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
                </Link>
              </div>
            </div>

            {/* Mobile Footer Meta Actions */}
            <div className="border-t border-neutral-100 pt-6 space-y-3">
              <Link
                href={user?.id && isAuthenticated ? "/user/dashboard" : "/signin" }
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-neutral-100 text-neutral-800 font-semibold rounded-xl text-sm hover:bg-neutral-200 transition-colors"
              >
                <User className="w-4 h-4" /> Account
              </Link>
            </div>
          </div>
        </div>
      </WebWrapper>
    </header>
  );
}
