"use client";

import { useState } from "react";
import HeroCMS from "./HeroCMSComponent";
import OfferCMS from "./OfferCMSComponent";
import ReviewCMS from "./ReviewCMSComponent";
import PopupCMS from "./PopupCMSComponent";
import PromotionCMS from "./PromotionCMSComponent";

export default function CMSPage() {
  const [tab, setTab] = useState("hero");

  return (
    <div className="">
      {/* Tabs */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {["hero", "offer", "review", "popup", "promotion"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 border border-gray-400
        ${
          tab === t
            ? "bg-linear-to-r from-[#7a001f] to-[#c1123f] text-white shadow-lg scale-105"
            : "text-gray-500 hover:text-white hover:bg-[#2a0010]"
        }`}
          >
            <span className="text-sm font-medium capitalize">{t}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="rounded-2xl">
        {tab === "hero" && <HeroCMS />}
        {tab === "offer" && <OfferCMS />}
        {tab === "review" && <ReviewCMS />}
        {tab === "popup" && <PopupCMS />}
        {tab === "promotion" && <PromotionCMS />}
      </div>
    </div>
  );
}


