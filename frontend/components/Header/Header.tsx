"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import WebWrapper from "../Wrapper/webWrapper";
import { navbarData, navbarDataSecondary } from "./HeaderData";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import SubHeader from "./SubHeader";

import { Menu, X } from "lucide-react";
import SearchModal from "./SeachModal";

export default function Header() {
  const path = usePathname();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSecondaryNavClick = (data: any) => {
    if (data.link) {
      router.push(data.link);
    } else {
      setSearchOpen(true);
    }
  };

  useEffect(() => {
    console.log(path);
  }, [path]);

  return (
    <>
      {/* <SubHeader /> */}
      <div className="bg-white sticky top-0 z-40 shadow-sm shadow-amber-900/10">
        <WebWrapper>
          <div className="grid grid-cols-3 items-center h-20">
            <Link href="/" className="col-span-2 lg:col-span-1">
              <Image
                src="/assets/logo/logoh.png"
                width={317}
                height={74}
                alt=""
                className="w-37"
              />
            </Link>
            <div className="hidden lg:flex justify-center gap-5 xl:gap-8 text-lg font-semibold">
              {navbarData.map((data, i) => {
                const isActive =
                  data.link === "/" ? path === "/" : path.startsWith(data.link);
                return (
                  <Link key={i} href={data.link + data.query} className="group">
                    <p
                      className={`duration-300 whitespace-nowrap ${isActive ? "text-amber-800" : "text-gray-700"}`}
                    >
                      {data.name}
                    </p>
                    <p
                      className={`w-full h-0.75 bg-amber-800 group-hover:scale-100 duration-300 ${isActive ? "scale-100" : "scale-0"}`}
                    ></p>
                  </Link>
                );
              })}
            </div>
            <div className="hidden lg:flex justify-end gap-6 text-xs">
              {navbarDataSecondary.map((data, i) => {
                const Icon = data.icon;

                return (
                  <button
                    key={i}
                    onClick={() => handleSecondaryNavClick(data)}
                    className="flex flex-col items-center cursor-pointer font-semibold text-gray-500 group relative"
                  >
                    {(data.type === "wish" || data.type === "cart") && (
                      <p className="size-4.5 flex items-center justify-center rounded-full bg-linear-to-r from-[#800000] via-[#6b0000] to-[#4a0000] text-white text-[10px] absolute top-0 right-0">
                        0
                      </p>
                    )}

                    <span
                      className={`${path == data.link ? "bg-rose-50 text-amber-800" : ""} rounded-full p-2 group-hover:bg-rose-50 group-hover:text-amber-800 duration-300`}
                    >
                      <Icon size={16} className="" />
                    </span>
                    <p
                      className={`${path == data.link ? "text-amber-800" : ""} group-hover:text-amber-800 duration-300`}
                    >
                      {data.name}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="lg:hidden flex justify-end items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className=" p-2 text-gray-600 hover:text-amber-900 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
          
        </WebWrapper>
        {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden relative">
              <div className="py-4 border-t border-b border-b-amber-900/50 border-gray-100 duration-300 absolute top-0 left-0 w-full bg-white px-5 ">
                <nav className="flex flex-col gap-1">
                  {navbarData.map((item, i) => (
                    <Link
                      key={i}
                      href={item.link + item.query}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        path === item.link
                          ? "bg-linear-to-r from-[#800000] via-[#6b0000] to-[#4a0000] text-white"
                          : "text-gray-700 hover:bg-orange-50"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                {/* Mobile Icons */}
                <div className="lg:hidden flex justify-evenly gap-6 text-xs border-t pt-3 mt-3 border-gray-200">
                  {navbarDataSecondary.map((data, i) => {
                    const Icon = data.icon;

                    return (
                      <button
                        key={i}
                        onClick={() => handleSecondaryNavClick(data)}
                        className="flex flex-col items-center cursor-pointer font-semibold text-gray-500 group relative"
                      >
                        {(data.type === "wish" || data.type === "cart") && (
                          <p className="size-4.5 flex items-center justify-center rounded-full bg-linear-to-r from-[#800000] via-[#6b0000] to-[#4a0000] text-white text-[10px] absolute top-0 right-0">
                            0
                          </p>
                        )}

                        <span
                          className={`${path == data.link ? "bg-rose-50 text-amber-800" : ""} rounded-full p-2 group-hover:bg-rose-50 group-hover:text-amber-800 duration-300`}
                        >
                          <Icon size={16} className="" />
                        </span>
                        <p
                          className={`${path == data.link ? "text-amber-800" : ""} group-hover:text-amber-800 duration-300`}
                        >
                          {data.name}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
      </div>

      {/* Search Modal */}
      {searchOpen && (
        <SearchModal searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
      )}
    </>
  );
}
