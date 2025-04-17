"use client";

import { create } from "zustand";

const useWishlistStore = create((set) => ({
  isWishlistOpen: false,
  wishlistItems: [
    {
      id: 1,
      name: "Nike Air Max",
      price: 120,
      image: "/shoe1.jpg",
    },
    {
      id: 2,
      name: "Adidas Ultraboost",
      price: 150,
      image: "/shoe2.jpg",
    },
  ],
  openWishlist: () => set({ isWishlistOpen: true }),
  closeWishlist: () => set({ isWishlistOpen: false }),
  removeItem: (id) =>
    set((state) => ({
      wishlistItems: state.wishlistItems.filter((item) => item.id !== id),
    })),
}));

export default useWishlistStore;
