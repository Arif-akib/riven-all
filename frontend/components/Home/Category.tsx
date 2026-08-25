"use client";

import { useState } from "react";
import Image from "next/image";

import WebWrapper from "../Wrapper/webWrapper";
import Headline from "../Headline";
import HeadlineBadge from "../HeadlineBadge";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Category } from "@/types/home.type";
import Link from "next/link";

type CategoryProps ={
  data:Category[]
}

type CategoryCardProps = {
  item: Category;
};

export default function HomeCategory({ data }: CategoryProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: "snap",
    slides: {
    perView: 1.5,
  },

  breakpoints: {
    "(min-width: 640px)": {
      slides: {
        perView: 2.5,
      },
    },
    "(min-width: 768px)": {
      slides: {
        perView: 3.5,
      },
    },
    "(min-width: 1024px)": {
      slides: {
        perView: 4.5,
      },
    },
    "(min-width: 1280px)": {
      slides: {
        perView: 5,
      },
    },
    "(min-width: 1400px)": {
      slides: {
        perView: 6,
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
          <HeadlineBadge text="Shop by category" />
          <Headline
            mainText="Our Categories"
            subText="Some of our popular categories"
          />
        </div>
        <div className="relative">
          <div ref={sliderRef} className="keen-slider">
            {data.map((item,i) => (
              <div key={i} className="keen-slider__slide">
                <CategoryCard item={ item} />
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
    </>
  );
}

const CategoryCard = ({item}:CategoryCardProps) => {
  return (
    <><Link href={`/shop?catId=${item.id}`}>
      <div className="group relative text-center transition-all duration-500 hover:-translate-y-2 cursor-pointer mx-3 my-5">
        {/* Glow background */}
        <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-[#800000]/0 via-[#800000]/50 to-[#800000]/0 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"></div>

        {/* Card */}
        <div className="relative bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl p-5 shadow-md group-hover:shadow-xl transition-all duration-500">
          {/* Image */}
          <div className="relative">
            <Image
              src={item.image ? item.image : '/assets/images/no-img-3.jpg'}
              alt="watch"
              height={200}
              width={200}
              className="mx-auto rounded-full size-40 object-cover border-4 border-white shadow-md transition-transform duration-500 group-hover:scale-110"
            />

            {/* Floating badge */}
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-[#800000] text-white text-xs px-3 py-1 rounded-full shadow-md">
              {item.productCount} Items
            </span>
          </div>

          {/* Content */}
          <div className="mt-8 space-y-1">
            <h3 className="font-semibold text-lg tracking-wide group-hover:text-[#800000] transition-colors capitalize">
              {item.name}
            </h3>
            <p className="text-sm text-gray-500 group-hover:text-gray-600">
             {item.color}
            </p>
          </div>
        </div>
      </div>
      </Link>
    </>
  );
};
