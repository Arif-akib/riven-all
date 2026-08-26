"use client";

import { useState } from "react";
import Link from "next/link";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import WebWrapper from "../Wrapper/webWrapper";
import Image from "next/image";
import { Offer } from "@/types/home.type";

type OfferProps = {
  data: Offer[];
};

export default function PromoSection({ data }: OfferProps) {
   const [currentSlide, setCurrentSlide] = useState(0);
  const autoplay = (slider: any) => {
  let timeout: ReturnType<typeof setTimeout>;
  let mouseOver = false;

  const clearNextTimeout = () => {
    clearTimeout(timeout);
  };

  const nextTimeout = () => {
    clearTimeout(timeout);

    if (mouseOver) return;

    timeout = setTimeout(() => {
      slider.next();
    }, 4000);
  };

  slider.on("created", () => {
    slider.container.addEventListener("mouseenter", () => {
      mouseOver = true;
      clearNextTimeout();
    });

    slider.container.addEventListener("mouseleave", () => {
      mouseOver = false;
      nextTimeout();
    });

    nextTimeout();
  });

  slider.on("dragStarted", clearNextTimeout);

  slider.on("animationEnded", nextTimeout);

  slider.on("updated", nextTimeout);
};

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>(
  {
    loop: true,
    mode: "snap",
    slides: {
      perView: 1,
    },

    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  },
  [autoplay],
);

  return (
    <div className="text-center pt-20">
      <WebWrapper>
        <div className="relative">
          {/* Slider */}
          <div
            ref={sliderRef}
            className="keen-slider rounded-3xl overflow-hidden"
          >
            {data.map((item: any, i: number) => (
              <div key={i} className="keen-slider__slide">
                <div className="w-full relative h-80 rounded-2xl overflow-hidden group">
                  <Image
                    width={1920}
                    height={600}
                    alt=""
                    src={item.image}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-100 scale-105 transition duration-500"
                  />

                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />

                  <div className="absolute left-10 bottom-10 text-white">
                    <h3 className="text-3xl font-bold mb-2">{ item.title}</h3>
                    <p className="mb-4">{ item.subtitle}</p>

                    {/* <button className="bg-gradient-to-r from-[#800000] via-[#6b0000] to-[#4a0000] px-6 py-1.5 rounded-md text-white font-semibold flex items-center justify-center gap-2 hover:px-10 duration-300 cursor-pointer mx-auto">
                      Shop Now
                    </button> */}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
            {data.map((_, idx) => (
              <button
                key={idx}
                onClick={() => slider.current?.moveToIdx(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx
                    ? "w-6 bg-amber-600"
                    : "w-2 bg-white/50 hover:bg-amber-600"
                }`}
              />
            ))}
          </div>
        </div>
      </WebWrapper>
    </div>
  );
}
