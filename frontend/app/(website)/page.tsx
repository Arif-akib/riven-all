import HomeBrand from "@/components/Home/Brand";
import HomeCategory from "@/components/Home/Category";
import Hero from "@/components/Home/Hero";
import HomeProduct from "@/components/Home/Product";
import PromoSection from "@/components/Home/PromoSection";
import Review from "@/components/Home/Review";
import Trending from "@/components/Home/Trending";
import USP from "@/components/Home/Usp";

import {
  getBrandList,
  getCategoryList,
  getHeroSliders,
  getOfferList,
  getProductList,
  getReviewList,
  getTrendingList,
} from "@/services/Home.service";

export default async function HomePage() {
  const [
    heroSlider,
    categoryList,
    productList,
    brandList,
    trendingList,
    offerList,
    reviewList,
  ] = await Promise.all([
    getHeroSliders(),
    getCategoryList(),
    getProductList(),
    getBrandList(),
    getTrendingList(),
    getOfferList(),
    getReviewList(),
  ]);

  return (
    <>
      <Hero data={heroSlider} />

      <USP />

      <HomeCategory data={categoryList} />

      <HomeProduct data={productList} />

      <HomeBrand data={brandList} />

      <Trending data={trendingList} />

      <PromoSection data={offerList} />

      <Review data={reviewList} />
    </>
  );
}
