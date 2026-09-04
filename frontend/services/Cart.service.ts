import API from "@/lib/axios";

export const validateCart = async (cart: any[]) => {
  const response = await API.post("/order/cart/validate", {
    items: cart,
  });

  return response.data;
};