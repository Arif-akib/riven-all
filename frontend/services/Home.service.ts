import API from "@/lib/axios";
import type { Promotion, HeroBanner, Category, Brand, Review, Offer } from "@/types/home.type";
import type {ProductCardType} from '@/types/product.type'

export const getPromotionList = async():Promise<Promotion[]> => {
  try {
    const response = await API.get("/cms/promotion/list");
    return response.data?.data ?? [];
  } catch (error) {
    console.error("Failed to fetch promotion Sliders info", error);
    return [] as Promotion[] ;
  }
};

export const getHeroSliders = async ():Promise<HeroBanner[]> => {
  try {
    const response = await API.get("/cms/hero/list");
    return response.data?.data ?? [];
  } catch (error) {
    console.error("Failed to fetch Hero Sliders info", error);
    return [] as HeroBanner[];
  }
};

export const getCategoryList = async ():Promise<Category[]> => {
  try {
    const response = await API.get("/category/list");
    return response.data?.data ?? [];
  } catch (error) {
    console.error("Failed to fetch category list info", error);
    return [] as Category[];
  }
};

export const getOnsaleList = async () => {
  try {
    const response = await API.get("/products/list?onsale=true");
    return response.data?.data;
  } catch (error) {
    console.error("Failed to fetch Hero Sliders info", error);
    return [] ;
  }
};

export const getProductList = async ():Promise<ProductCardType[]> => {
  try {
    const response = await API.get("/products/list?limit=12&page=1");
    return response.data?.data ?? [];
  } catch (error) {
    console.error("Failed to fetch product list info", error);
    return [] as ProductCardType[] ;
  }
};

export const getBrandList = async ():Promise<Brand[]> => {
  try {
    const response = await API.get("/brand/list");
    return response.data?.data ?? [];
  } catch (error) {
    console.error("Failed to fetch Hero Sliders info", error);
    return [] as Brand[] ;
  }
};

export const getTrendingList = async () => {
  try {
    const response = await API.get("/products/featured-list");
    return response.data?.data;
  } catch (error) {
    console.error("Failed to fetch Hero Sliders info", error);
    return [] ;
  }
};

export const getOfferList = async ():Promise<Offer[]> => {
  try {
    const response = await API.get("/cms/offer/list");
    return response.data?.data ?? [];
  } catch (error) {
    console.error("Failed to fetch offer Sliders info", error);
    return [] as Offer[] ;
  }
};

export const getReviewList = async ():Promise<Review[]> => {
  try {
    const response = await API.get("/cms/review/list");
    return response.data?.data ?? [];
  } catch (error) {
    console.error("Failed to fetch review Sliders info", error);
    return [] as Review[];
  }
};