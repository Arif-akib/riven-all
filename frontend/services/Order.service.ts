import API from "@/lib/axios";
import { PlaceOrderPayload, OrderResponse } from "@/types/order.type";

export const orderService = {
  /**
   * Place a new order
   */
  placeOrder: async (payload: PlaceOrderPayload): Promise<OrderResponse> => {
    try {
      const response = await API.post<OrderResponse>("/order/customer/place-order", payload);
      return response.data;
    } catch (error) {
       console.log(error)
        return error as any
    }
  },

  /**
   * Get single order details by ID
   */
  getOrderById: async (orderId: string): Promise<OrderResponse["order"]> => {
    try {
      const response = await API.get(`/orders/${orderId}`);
      return response.data.order;
    } catch (error) {
       console.log(error)
        return error as any
    }
  },

  /**
   * Get order history for the logged-in user
   */
  getUserOrders: async (): Promise<OrderResponse["order"][]> => {
    try {
      const response = await API.get("/orders/my-orders");
      return response.data.orders;
    } catch (error) {
        console.log(error)
        return error as any
      
    }
  }
};