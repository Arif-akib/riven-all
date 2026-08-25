"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from 'lucide-react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollTop}
      className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-[#800000] to-[#6b0000] text-white p-1.5 rounded-full shadow-lg hover:scale-110 transition cursor-pointer"
      aria-label="Scroll to top"
    >
      <ChevronUp/>
    </button>
  );
}