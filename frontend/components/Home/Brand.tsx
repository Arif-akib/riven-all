"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import Headline from "../Headline";
import WebWrapper from "../Wrapper/webWrapper";
import HeadlineBadge from "../HeadlineBadge";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Brand } from "@/types/home.type";

type BrandProps = {
  data:Brand[]
}

type BrandCardProps = {
  brand:Brand
}

export default function HomeBrand({data}:BrandProps) {

  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: "snap",
    slides: {
      perView: 1,
    },

    breakpoints: {
      "(min-width: 640px)": {
        slides: {
          perView: 2,
        },
      },
      "(min-width: 768px)": {
        slides: {
          perView: 3,
        },
      },
      "(min-width: 1024px)": {
        slides: {
          perView: 4,
        },
      },
      "(min-width: 1280px)": {
        slides: {
          perView: 5,
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
      <div className="text-center pt-20">
        <WebWrapper>
          <HeadlineBadge text="Shop by brands" />
          <Headline
            mainText="Discover luxury Brands"
            subText="Explore our curated collection of luxury watches from world-renowned brands"
          />

          <div className="relative my-7">
            <div ref={sliderRef} className="keen-slider">
              {data.map((brand , i) => (
                <div key={i} className="keen-slider__slide">
                  <BrandCard brand={brand} />
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
        </WebWrapper>
      </div>
    </>
  );
}

const BrandCard = ({ brand }: BrandCardProps) => {
  return (
    <Link
      key={brand.id}
      href={`/brand/${brand.slug}`}
      className="flex items-center justify-center p-4 bg-rose-50/40 hover:bg-white/50 rounded-lg shadow hover:shadow-md transition duration-300 mx-3 my-5"
    >
      <Image
        src={brand.image ? brand.image : '/assets/images/no-img.jpg'}
        alt={brand.name}
        width={120}
        height={60}
        className="object-contain"
      />
    </Link>
  );
};
