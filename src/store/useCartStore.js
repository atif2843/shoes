"use client";

import { create } from "zustand";
import { ShoppingBag, X, Minus, Plus, Trash } from "lucide-react";
import { useEffect } from "react";

// Zustand Store for Cart State Management
const useCartStore = create((set) => ({
  isCartOpen: false,
  cartItems: [
    {
      id: 1,
      name: "Nike Air Max",
      price: 120,
      quantity: 1,
      image: "/shoe1.jpg",
    },
    {
      id: 2,
      name: "Adidas Ultraboost",
      price: 150,
      quantity: 1,
      image: "/shoe2.jpg",
    },
  ],
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  increaseQty: (id) =>
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      ),
    })),
  decreaseQty: (id) =>
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ),
    })),
  removeItem: (id) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    })),
}));

export default useCartStore;
