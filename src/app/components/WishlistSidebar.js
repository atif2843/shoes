"use client";

import React from "react";
import useWishlistStore from "@/store/useWishlistStore";
import { X, Trash } from "lucide-react";

export default function WishlistSidebar() {
  const { isWishlistOpen, closeWishlist, wishlistItems, removeItem } =
    useWishlistStore();

  return (
    <>
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50" onClick={closeWishlist}></div>
      )}
      <div
        className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg transform ${
          isWishlistOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-bold">My Wishlist</h2>
          <button onClick={closeWishlist}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {wishlistItems.length === 0 ? (
            <p className="text-gray-500 text-center">Your wishlist is empty.</p>
          ) : (
            wishlistItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border p-2 rounded-md"
              >
                <img src={item.image} alt={item.name} className="w-14 h-14" />
                <div className="flex-1 px-2">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">${item.price}</p>
                </div>
                <button onClick={() => removeItem(item.id)}>
                  <Trash className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
