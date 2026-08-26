import API from "@/lib/axios";
import type { Product, ProductCardType, ProductListResponse } from "@/types/product.type";

interface GetProductListParams {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  onsale?: boolean;
  isNew?: boolean;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc";
}

export const getProductList = async ({
  page = 1,
  limit = 12,
  category,
  brand,
  onsale,
  isNew,
  sort,
}: GetProductListParams = {}): Promise<ProductListResponse> => {
  try {
    const params = new URLSearchParams();

    params.append("page", String(page));
    params.append("limit", String(limit));

    if (category) {
      params.append("category", category);
    }

    if (brand) {
      params.append("brand", brand);
    }

    if (onsale !== undefined) {
      params.append("onsale", String(onsale));
    }

    if (isNew !== undefined) {
      params.append("newArrival", String(isNew));
    }

    if (sort) {
      params.append("sort", sort);
    }

    const response = await API.get(
      `/products/list?${params.toString()}`
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch product list info", error);

    return {
      success: false,
      count: 0,
      total: 0,
      page: 1,
      pages: 1,
      data: [],
    };
  }
};

export const getProductDetails = async (id: string): Promise<Product> => {
  try {
    const response = await API.get(`/products/details/${id}`);
    return response.data?.data;
  } catch (error: any) {
    console.error(
      error?.response?.data?.message || "Failed to fetch product details",
    );
    return {} as Product;
  }
};

export const getRelatedProducts = async (
  categoryId: string,
  productId: string,
): Promise<ProductCardType[]> => {
  try {
    const response = await API.get(
      `products/related/${categoryId}/${productId}`,
    );

    return response.data.data || [];
  } catch (error: any) {
    console.error(
      error?.response?.data?.message || "Failed to fetch related products",
    );
    return [] as ProductCardType[];
  }
};
