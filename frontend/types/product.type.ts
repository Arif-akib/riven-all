export interface Product {
  _id: string;
  id: string;
  name: string;
  description: string;
  richDescription: string;
  materials: string;
  brand: Brand;
  category: Category;
  image: string[];
  isFeatured: boolean;
  isOnsale: boolean;
  isNewArrival: boolean;
  rating: number;
  numReviews: number;
  variants: Variant[];
  createdAt: string;
}

export interface Category {
  _id: string;
  id: string;
  name: string;
}

export interface Brand {
  _id: string;
  id: string;
  name: string;
}

export interface Variant {
  size: string;
  color: string;
  price: number;
  discountPrice: number;
  countInStock: number;
  images: string[];
  sku:string
}

export interface ProductCardType {
  _id: string;
  id: string;
  name: string;
  description: string;
  brand: Brand;
  category: Category;
  image: string;
  isFeatured: boolean;
  isOnsale: boolean;
  isNewArrival: boolean;
  price: number;
  discountPrice: number;
  createdAt: string;
}

export interface ProductListResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: ProductCardType[];
}
