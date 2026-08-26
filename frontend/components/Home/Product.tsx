import Link from "next/link";
import Headline from "../Headline";
import HeadlineBadge from "../HeadlineBadge";
import ProductCard from "../ProductCard";
import WebWrapper from "../Wrapper/webWrapper";

import { ProductCardType } from "@/types/product.type";
import HomeButton from "./HomeButton";

type ProductProps = {
  data:ProductCardType[]
}

export default function HomeProduct({ data }: ProductProps) {
  return (
    <>
      <div className="text-center pt-20">
        <WebWrapper>
          <HeadlineBadge text="CURATED FOR YOU" />
          <Headline
            mainText="Quality You Can Choose"
            subText="Discover thoughtfully selected products designed to bring more value to every purchase."
          />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 my-10">
            {data?.map((item:ProductCardType , index:number) => (
              <div key={index}>
                <ProductCard item={item} />
              </div>
            ))}
          </div>
           <HomeButton text="See All" link="/shop"/>
        </WebWrapper>
      </div>
    </>
  );
}
