'use client'

import { useState } from 'react';
import { 
  Package, ShoppingBag, Heart, CreditCard, 
  ChevronRight, Clock, MapPin, ArrowUpRight 
} from 'lucide-react';

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample Data
  const recentOrder = {
    id: '#ORD-8921',
    date: 'Sep 1, 2026',
    status: 'In Transit',
    estimatedDelivery: 'Tomorrow by 8 PM',
    itemsCount: 3,
    total: '$148.50',
    progress: 75,
  };

  const savedItems = [
    { id: 1, name: 'Minimalist Leather Watch', price: '$120.00', tag: 'Restocked' },
    { id: 2, name: 'Wireless Noise-Canceling Earbuds', price: '$89.00', tag: 'Sale' },
  ];

  return (
    <div className="space-y-8">
        

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Orders', value: '1', icon: Package, color: 'text-amber-900 bg-amber-50' },
            { label: 'Total Orders', value: '24', icon: ShoppingBag, color: 'text-purple-900 bg-purple-50' },
            { label: 'Wishlist Items', value: '12', icon: Heart, color: 'text-rose-900 bg-rose-50' },
            { label: 'Store Credit', value: '$45.00', icon: CreditCard, color: 'text-emerald-900 bg-emerald-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Active Order Tracking & Quick Links */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Active Order Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full">
                    {recentOrder.status}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mt-2">Order {recentOrder.id}</h2>
                </div>
                <button className="text-sm font-medium text-amber-900 hover:text-amber-700 flex items-center gap-1">
                  Details <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Order Delivery Banner */}
              <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3 text-sm text-slate-900">
                <Clock className="w-5 h-5 text-slate-400 shrink-0" />
                <span>Estimated Delivery: <strong className="text-slate-900">{recentOrder.estimatedDelivery}</strong></span>
              </div>

              {/* Tracking Visual Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500 font-medium">
                  <span>Order Placed</span>
                  <span>Shipped</span>
                  <span className="text-amber-900 font-bold">Out for Delivery</span>
                  <span>Delivered</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-900 h-full rounded-full" style={{ width: `${recentOrder.progress}%` }} />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-slate-300 transition cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-100 rounded-xl group-hover:bg-slate-900 group-hover:text-white transition">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Shipping Addresses</p>
                    <p className="text-xs text-slate-400">2 saved addresses</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition" />
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-slate-300 transition cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-100 rounded-xl group-hover:bg-slate-900 group-hover:text-white transition">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Payment Methods</p>
                    <p className="text-xs text-slate-400">Visa ending in 4242</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition" />
              </div>
            </div>
          </div>

          {/* Right Column: Wishlist Shortcuts */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Saved for Later</h3>
                <a href="#wishlist" className="text-xs font-semibold text-slate-500 hover:text-slate-900">View All</a>
              </div>

              <div className="divide-y divide-slate-100">
                {savedItems.map((item) => (
                  <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900 truncate max-w-[150px]">{item.name}</p>
                      <p className="text-xs font-bold text-slate-500">{item.price}</p>
                    </div>
                    <button className="text-xs bg-slate-100 hover:bg-slate-900 hover:text-white font-medium px-3 py-1.5 rounded-lg transition">
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
  );
}