"use client";

import { useState } from "react";
import Headline from "../Headline";
import WebWrapper from "../Wrapper/webWrapper";

import { Star } from "lucide-react";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import type { Review } from "@/types/home.type";
import HomeButton from "./HomeButton";

type ReviewProps = {
  data: Review[];
};

type ReviewCardProps = {
  review: Review;
};

export default function Review({ data }: ReviewProps) {
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
        spacing: 10,
      },
      breakpoints: {
        // "(min-width: 640px)": {
        //   slides: {
        //     perView: 2,
        //     spacing: 12,
        //   },
        // },
        "(min-width: 768px)": {
          slides: {
            perView: 2,
            spacing: 15,
          },
        },
        // "(min-width: 1024px)": {
        //   slides: {
        //     perView: 4,
        //     spacing: 20,
        //   },
        // },
        "(min-width: 1280px)": {
          slides: {
            perView: 3,
            spacing: 20,
          },
        },
      },

      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
    },
    [autoplay],
  );

  return (
    <>
      <div className="text-center pt-20">
        <WebWrapper>
          <Headline mainText="What people say" subText="" />

          <div className="relative">
            <div ref={sliderRef} className="keen-slider">
              {data.map((review: any, index: number) => (
                <div key={index} className="keen-slider__slide">
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
              {data.map((_: any, idx: any) => (
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

             {/* <HomeButton text="See All" link="/offer?offer=true"/> */}
          </div>
        </WebWrapper>
      </div>
    </>
  );
}

const ReviewCard = ({ review }: ReviewCardProps) => (
  <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
    <div className="flex mb-3 justify-center">
      {"⭐".repeat(Number(review.rating))}
    </div>

    <p className="text-gray-600 mb-4">"{review.comment}"</p>

    <div className="font-semibold">{review.name}</div>
    <div className="text-sm text-gray-400">Verified Buyer</div>
  </div>
);
