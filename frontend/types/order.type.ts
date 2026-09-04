export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
}

export interface Address {
  city: string;    // Division
  zip: string;     // District
  country: string; // Area
  street: string;
}

export interface OrderItemInput {
  productId: string;
  variantKey: string;
  quantity: number;
}

export type PaymentMethod = "cod" | "online" | "bkash";

export interface PlaceOrderPayload {
  items: OrderItemInput[];
  address: Address;
  paymentMethod: PaymentMethod;
  note?: string;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  order: {
    _id: string;
    userId: string;
    customerInfo: CustomerInfo;
    items: Array<any>;
    paymentMethod: PaymentMethod;
    pricing: {
      subtotal: number;
      discount: number;
      shipping: number;
      total: number;
    };
    paymentStatus: string;
    orderStatus: string;
    createdAt: string;
  };
}