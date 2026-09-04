import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ProductCardType } from "@/types/product.type";

type WishlistStore = {
  wishlist: ProductCardType[];

  // Core Actions
  toggleWishlist: (item: ProductCardType) => void;
  clearWishlist: () => void;

  // Computed Utilities
  isInWishlist: (productId: string) => boolean;
};

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlist: [],

      toggleWishlist: (item) =>
        set((state) => {
          const exists = state.wishlist.some(
            (w) =>
              w.id === item.id
          );

          if (exists) {
            return {
              wishlist: state.wishlist.filter(
                (w) =>
                  !(
                    w.id === item.id
                  )
              ),
            };
          }

          return {
            wishlist: [...state.wishlist, item],
          };
        }),

      /**
       * CLEAR WISHLIST
       * Flushes all stored items from state and localStorage.
       */
      clearWishlist: () => set({ wishlist: [] }),

      /**
       * CHECK IF IN WISHLIST
       * Returns boolean status for UI heart icon highlights.
       */
      isInWishlist: (productId) => {
        return get().wishlist.some(
          (w) => w.id === productId
        );
      },
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);