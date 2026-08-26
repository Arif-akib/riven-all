"use client";

import { useState } from "react";
import Image from "next/image";

import WebWrapper from "../Wrapper/webWrapper";
import Headline from "../Headline";
import HeadlineBadge from "../HeadlineBadge";
import ProductCard from "../ProductCard";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ProductCardType } from "@/types/product.type";
import Link from "next/link";
import HomeButton from "./HomeButton";

type ProductProps = {
  data: ProductCardType[];
};

export default function HomeOffer({ data }: ProductProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: "snap",
    slides: {
      perView: 1.5,
      spacing:10
    },

  breakpoints: {
    "(min-width: 640px)": {
      slides: {
        perView: 2.5,
        spacing: 16,
      },
    },
    "(min-width: 768px)": {
      slides: {
        perView: 3.5,
        spacing: 20,
      },
    },
    "(min-width: 1024px)": {
      slides: {
        perView: 4.5,
        spacing: 24,
      },
    },
    "(min-width: 1280px)": {
      slides: {
        perView: 5,
        spacing: 24,
      },
    },
    "(min-width: 1400px)": {
      slides: {
        perView: 6,
        spacing: 24,
      },
    },
  },

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
    <>
      <WebWrapper>
        <div className="text-center mt-10 lg:mb-7">
          <HeadlineBadge text="LIMITED-TIME OFFERS" />
          <Headline
            mainText="More Value, More to Love"
            subText="Discover our latest deals, handpicked to bring you exceptional value"
          />
        </div>
        <div className="relative">
          <div ref={sliderRef} className="keen-slider">
            {data?.map((item: ProductCardType, index: number) => (
              <div key={index} className="keen-slider__slide">
                <ProductCard item={item} />
              </div>
            ))}
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
            {data.map((_, idx) => (
              <button
                key={idx}
                onClick={() => slider.current?.moveToIdx(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx
                    ? "w-6 bg-amber-700"
                    : "w-2 bg-amber-900 hover:bg-amber-700"
                }`}
              />
            ))}
          </div>
         <HomeButton text="See All" link="/offer?offer=true"/>
        </div>
      </WebWrapper>
    </>
  );
}
