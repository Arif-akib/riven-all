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
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 my-10">
          {data?.map((item: ProductCardType, index: number) => (
            <div key={index}>
              <ProductCard item={item} />
            </div>
          ))}
        </div>
        <HomeButton text="See All" link="/offer?offer=true" />
      </WebWrapper>
    </>
  );
}
