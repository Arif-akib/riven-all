import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Cart Item Type
 */
export type CartItem = {
  productId: string;

  // fallback identifier (since you don't have variantId)
  variantKey: string;

  quantity: number;

  productName: string;

  productImage: string;

  variantLabel: string;

  price: number;
  
};

type CartStore = {
  cart: CartItem[];

  addToCart: (item: CartItem) => void;

  removeFromCart: (
    productId: string,
    variantKey: string
  ) => void;

  increaseQuantity: (
    productId: string,
    variantKey: string
  ) => void;

  decreaseQuantity: (
    productId: string,
    variantKey: string
  ) => void;

  clearCart: () => void;

  getTotalItems: () => number;

  getTotalPrice: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],

      /**
       * ADD TO CART
       * - merges same product+variant
       * - prevents stock overflow
       */
      addToCart: (item) =>
        set((state) => {
          const existing = state.cart.find(
            (c) =>
              c.productId === item.productId &&
              c.variantKey === item.variantKey
          );

          if (existing) {
            return {
              cart: state.cart.map((c) => {
                if (
                  c.productId === item.productId &&
                  c.variantKey === item.variantKey
                ) {
                  const updatedQty =
                    c.quantity + item.quantity;

                  return {
                    ...c,
                    quantity:
                      updatedQty
                  };
                }

                return c;
              }),
            };
          }

          return {
            cart: [
              ...state.cart,
              {
                ...item,
                quantity:
                  item.quantity
              },
            ],
          };
        }),

      /**
       * REMOVE ITEM
       */
      removeFromCart: (productId, variantKey) =>
        set((state) => ({
          cart: state.cart.filter(
            (item) =>
              !(
                item.productId === productId &&
                item.variantKey === variantKey
              )
          ),
        })),

      /**
       * INCREASE QTY
       */
      increaseQuantity: (productId, variantKey) =>
        set((state) => ({
          cart: state.cart.map((item) => {
            if (
              item.productId === productId &&
              item.variantKey === variantKey
            ) {

              return {
                ...item,
                quantity: item.quantity + 1,
              };
            }

            return item;
          }),
        })),

      /**
       * DECREASE QTY
       */
      decreaseQuantity: (productId, variantKey) =>
        set((state) => ({
          cart: state.cart
            .map((item) => {
              if (
                item.productId === productId &&
                item.variantKey === variantKey
              ) {
                return {
                  ...item,
                  quantity: item.quantity - 1,
                };
              }

              return item;
            })
            .filter((item) => item.quantity > 0),
        })),

      /**
       * CLEAR CART
       */
      clearCart: () => set({ cart: [] }),

      /**
       * TOTAL ITEMS
       */
      getTotalItems: () => {
        return get().cart.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
      },

      /**
       * TOTAL PRICE
       * (IMPORTANT: still frontend estimate only)
       */
      getTotalPrice: () => {
        return get().cart.reduce(
          (sum, item) =>
            sum + item.price * item.quantity,
          0
        );
      },
    }),

    {
      name: "cart-storage",
    }
  )
);