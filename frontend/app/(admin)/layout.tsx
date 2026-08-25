"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  ListTree  ,
  Layers,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: Readonly<AdminLayoutProps>) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    {
      label: "Overview",
      icon: <LayoutDashboard size={20} />,
      href: "/admin/dashboard",
    },
    {
      label: "Categories",
      icon: <FolderTree size={20} />,
      href: "/admin/category",
    },
    {
      label: "Sub-Categories",
      icon: <ListTree   size={20} />,
      href: "/admin/sub-category",
    },
    {
      label: "Products",
      icon: <ShoppingBag size={20} />,
      href: "/admin/products",
    },
    {
      label: "Orders",
      icon: <Package size={20} />,
      href: "/admin/orders",
    },
    {
      label: "Users",
      icon: <Users size={20} />,
      href: "/admin/user",
    },
    {
      label: "CMS",
      icon: <Layers size={20} />,
      href: "/admin/cms",
    },
    {
      label: "Settings",
      icon: <Settings size={20} />,
      href: "/admin/settings",
    },
  ];

  return (
    <div className="h-screen overflow-y-auto bg-slate-50 text-slate-800 flex flex-col md:flex-row relative overflow-x-hidden">
      {/* MOBILE OVERLAY */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-xs"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed md:sticky top-0 h-screen bg-white border-r border-slate-200 flex flex-col shrink-0 z-50 transition-all duration-300 ease-in-out ${
          isCollapsed ? "md:w-20" : "md:w-64"
        } ${
          isMobileOpen
            ? "translate-x-0 w-64"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Toggle Button for Desktop */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-3 top-7 bg-white border border-slate-200 text-slate-600 hover:text-rose-900 rounded-full p-1 shadow-sm transition-transform duration-300"
          aria-label="Toggle Sidebar"
        >
          <ChevronLeft
            size={16}
            className={`transition-transform duration-300 ${
              isCollapsed ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* User Profile */}
        <div
          className={`p-4 border-b border-slate-100 flex items-center gap-3 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-900 to-red-600 text-white font-bold flex items-center justify-center shrink-0 shadow-md">
            A
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="font-semibold text-sm text-slate-900 truncate">
                Arif Akib
              </p>
              <p className="text-xs text-slate-500 truncate">a@gmail.com</p>
            </div>
          )}
          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden text-slate-500 hover:text-slate-800 ml-auto"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isCollapsed ? "justify-center" : ""
                } ${
                  isActive
                    ? "bg-rose-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-rose-50 hover:text-rose-900"
                }`}
              >
                <span className={isActive ? "text-white" : "text-slate-400"}>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="p-3 border-t border-slate-100">
          <button
            type="button"
            title={isCollapsed ? "Logout" : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-rose-700 hover:bg-rose-50 transition-colors ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* MOBILE TOP BAR */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
            <span className="font-semibold text-slate-900">Admin Panel</span>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}