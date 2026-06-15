import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  addedAt: string;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (
    productId: string,
    productName: string,
    productImage: string,
    productPrice: number
  ) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId, productName, productImage, productPrice) => {
        set((state) => {
          if (state.items.some((item) => item.productId === productId)) {
            return state;
          }

          return {
            items: [
              ...state.items,
              {
                id: `${productId}-${Date.now()}`,
                productId,
                name: productName,
                image: productImage,
                price: productPrice,
                addedAt: new Date().toISOString(),
              },
            ],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.productId === productId);
      },

      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'beb-fragrance-wishlist',
    }
  )
);
