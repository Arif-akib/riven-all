"use client";

import { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import WebWrapper from "../Wrapper/webWrapper";
import { HeroBanner } from "@/types/home.type";

type HeroProps = {
  data: HeroBanner[];
};

export default function HeroKeen({data}:HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: "snap",
    slides: { perView: 1 },

    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },

    created(slider) {
      let timeout: any;
      let mouseOver = false;

      const clearNextTimeout = () => clearTimeout(timeout);
      const nextTimeout = () => {
        clearTimeout(timeout);
        if (mouseOver) return;
        timeout = setTimeout(() => {
          slider.next();
        }, 4000);
      };

      slider.on("created", () => {
        slider.container.addEventListener("mouseover", () => {
          mouseOver = true;
          clearNextTimeout();
        });
        slider.container.addEventListener("mouseout", () => {
          mouseOver = false;
          nextTimeout();
        });
        nextTimeout();
      });

      slider.on("dragStarted", clearNextTimeout);
      slider.on("animationEnded", nextTimeout);
      slider.on("updated", nextTimeout);
    },
  });

  return (
    <section className="pt-5">
      <WebWrapper>
        <div className="relative">
          
          {/* Slider */}
          <div ref={sliderRef} className="keen-slider rounded-3xl overflow-hidden">
            {data.map((item, i) => (
              <div key={i} className="keen-slider__slide">
                <Image
                  src={item.image}
                  alt="hero"
                  width={2000}
                  height={671}
                  className="w-full h-auto object-cover"
                />
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
    </section>
  );
}