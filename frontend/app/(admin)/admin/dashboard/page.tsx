"use client";

import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  PackageCheck,
  Clock,
  Plus,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const metrics = [
    {
      title: "Total Revenue",
      value: "$48,294.00",
      change: "+12.5%",
      isPositive: true,
      icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
      bgColor: "bg-emerald-50",
    },
    {
      title: "Total Orders",
      value: "1,248",
      change: "+8.2%",
      isPositive: true,
      icon: <ShoppingBag className="w-5 h-5 text-rose-600" />,
      bgColor: "bg-rose-50",
    },
    {
      title: "New Customers",
      value: "384",
      change: "-2.1%",
      isPositive: false,
      icon: <Users className="w-5 h-5 text-blue-600" />,
      bgColor: "bg-blue-50",
    },
    {
      title: "Conversion Rate",
      value: "3.42%",
      change: "+1.8%",
      isPositive: true,
      icon: <TrendingUp className="w-5 h-5 text-amber-600" />,
      bgColor: "bg-amber-50",
    },
  ];

  const recentOrders = [
    {
      id: "#ORD-9482",
      customer: "Sarah Jenkins",
      email: "sarah.j@example.com",
      items: 3,
      total: "$240.00",
      status: "Delivered",
      date: "10 mins ago",
    },
    {
      id: "#ORD-9481",
      customer: "Michael Chen",
      email: "m.chen@example.com",
      items: 1,
      total: "$85.50",
      status: "Processing",
      date: "25 mins ago",
    },
    {
      id: "#ORD-9480",
      customer: "Emma Watson",
      email: "emma.w@example.com",
      items: 5,
      total: "$412.00",
      status: "Pending",
      date: "1 hour ago",
    },
    {
      id: "#ORD-9479",
      customer: "David Kim",
      email: "d.kim@example.com",
      items: 2,
      total: "$120.00",
      status: "Processing",
      date: "2 hours ago",
    },
  ];

  const topProducts = [
    { name: "Wireless Noise-Canceling Headphones", sales: 432, stock: 18, price: "$299.00" },
    { name: "Ergonomic Mechanical Keyboard", sales: 312, stock: 45, price: "$149.00" },
    { name: "Ultra-Wide Gaming Monitor 34\"", sales: 289, stock: 8, price: "$699.00" },
    { name: "Smart Fitness Watch v2", sales: 201, stock: 64, price: "$199.00" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-100 text-emerald-700";
      case "Processing":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-sm text-slate-500">Monitor your store's sales performance and operations.</p>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((metric) => (
          <div key={metric.title} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">{metric.title}</span>
              <div className={`p-2.5 rounded-lg ${metric.bgColor}`}>{metric.icon}</div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">{metric.value}</span>
              <span
                className={`flex items-center text-xs font-semibold ${
                  metric.isPositive ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {metric.isPositive ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* MIDDLE SECTION: CHART PLACEHOLDER & TOP PRODUCTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Analytics Visual */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Sales Analytics</h2>
              <p className="text-xs text-slate-500">Revenue performance over the last 7 days</p>
            </div>
            <select className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-slate-50 text-slate-600 font-medium">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          
          {/* Mock Bar Chart */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 border-b border-slate-100 pb-2">
            {[
              { day: "Mon", val: "40%" },
              { day: "Tue", val: "65%" },
              { day: "Wed", val: "30%" },
              { day: "Thu", val: "85%" },
              { day: "Fri", val: "55%" },
              { day: "Sat", val: "90%" },
              { day: "Sun", val: "70%" },
            ].map((bar) => (
              <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div
                  style={{ height: bar.val }}
                  className="w-full max-w-[36px] bg-rose-900/90 hover:bg-rose-900 rounded-t-md transition-all duration-200"
                />
                <span className="text-xs text-slate-400 font-medium">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Top Products</h2>
            <Link href="/admin/products" className="text-xs text-rose-900 font-medium hover:underline flex items-center gap-1">
              View All <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {topProducts.map((product) => (
              <div key={product.name} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-slate-800 truncate">{product.name}</p>
                  <p className="text-xs text-slate-400">{product.sales} sales • {product.stock} in stock</p>
                </div>
                <span className="text-xs font-bold text-slate-900 shrink-0">{product.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Recent Orders</h2>
            <p className="text-xs text-slate-500">Latest transactions placed across your store</p>
          </div>
          <Link href="/admin/orders" className="text-xs text-rose-900 font-medium hover:underline flex items-center gap-1">
            Manage Orders <ArrowUpRight size={12} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="p-4 pl-6">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 pl-6 font-semibold text-slate-900">{order.id}</td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-slate-800">{order.customer}</p>
                      <p className="text-xs text-slate-400">{order.email}</p>
                    </div>
                  </td>
                  <td className="p-4">{order.items} pcs</td>
                  <td className="p-4 font-semibold text-slate-900">{order.total}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-xs text-slate-400">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}