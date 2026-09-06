import API from "@/lib/axios";
import { PlaceOrderPayload, OrderResponse } from "@/types/order.type";

export const orderService = {
  // Place a new order
  placeOrder: async (payload: PlaceOrderPayload): Promise<OrderResponse> => {
    try {
      const response = await API.post<OrderResponse>(
        "/order/customer/place-order",
        payload,
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return error as any;
    }
  },

  // Get single order details by ID
  getOrderById: async (orderId: string): Promise<OrderResponse["order"]> => {
    try {
      const response = await API.get(`/orders/${orderId}`);
      return response.data.order;
    } catch (error) {
      console.log(error);
      return error as any;
    }
  },

  // order history for the logged-in user
  getUserOrders: async () => {
    try {
      const response = await API.get("/order/customer/my-orders");
      return response;
    } catch (error) {
      console.log(error);
      return error as any;
    }
  },

  // admin
  getAllUserOrders: async () => {
    try {
      const response = await API.get("/order/admin/all-orders");
      return response;
    } catch (error) {
      console.log(error);
      return error as any;
    }
  },

  updateOrderStatus: async (orderId: any, updateData: any) => {
    try {
      const response = API.put(`/order/admin/order/${orderId}`, updateData);
      return response;
    } catch (error) {
      throw error as any;
    }
  },
};
