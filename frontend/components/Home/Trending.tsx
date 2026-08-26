"use client";

import { useState } from "react";
import Headline from "../Headline";
import HeadlineBadge from "../HeadlineBadge";
import ProductCard from "../ProductCard";
import WebWrapper from "../Wrapper/webWrapper";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import { ProductCardType } from "@/types/product.type";
import HomeButton from "./HomeButton";

type ProductProps = {
  data:ProductCardType[]
}

export default function Trending({data}:ProductProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: "snap",
    slides: {
      perView: 1.5,
      spacing: 10,
    },

    breakpoints: {
      "(min-width: 540px)": {
        slides: {
          perView: 2,
          spacing: 12,
        },
      },
      "(min-width: 768px)": {
        slides: {
          perView: 3,
          spacing: 15,
        },
      },
      "(min-width: 1024px)": {
        slides: {
          perView: 4,
          spacing: 20,
        },
      },
      "(min-width: 1280px)": {
        slides: {
          perView: 5,
          spacing: 20,
        },
      },
       "(min-width: 1400px)": {
        slides: {
          perView: 6,
          spacing: 20,
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
      <div className="text-center pt-10">
        <WebWrapper>
          <HeadlineBadge text="Trending COLLECTION" />
          <Headline
            mainText="Discover What’s Trending"
            subText="Explore whats trending in our collection, curated with style and quality in mind"
          />
          <div className="relative my-10">
            <div ref={sliderRef} className="keen-slider">
              {data.map((item:ProductCardType , index:number) => (
                <div key={index} className="keen-slider__slide">
                  <ProductCard item={item} />
                </div>
              ))}
            </div>

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
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
          </div>
           <HomeButton text="See All" link="/new_arrival?new=true"/>
        </WebWrapper>
      </div>
    </>
  );
}
