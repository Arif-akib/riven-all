import Link from "next/link";
import Headline from "../Headline";
import HeadlineBadge from "../HeadlineBadge";
import ProductCard from "../ProductCard";
import WebWrapper from "../Wrapper/webWrapper";

import { ProductCardType } from "@/types/product.type";

type ProductProps = {
  data:ProductCardType[]
}

export default function HomeProduct({ data }: ProductProps) {
  return (
    <>
      <div className="text-center pt-20">
        <WebWrapper>
          <HeadlineBadge text="Shop by product" />
          <Headline
            mainText="Luxury on Your Wrist"
            subText="Precision, elegance, and performance in every piece"
          />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 my-10">
            {data?.map((item:ProductCardType , index:number) => (
              <div key={index}>
                <ProductCard item={item} />
              </div>
            ))}
          </div>
          <Link href="/shop">
            <button className="bg-linear-to-r from-[#800000] via-[#6b0000] to-[#4a0000] px-6 py-1.5 rounded-md text-white font-semibold flex items-center justify-center gap-2 hover:-translate-y-2 transition-transform duration-300 cursor-pointer mx-auto">
              See All
            </button>
          </Link>
        </WebWrapper>
      </div>
    </>
  );
}
