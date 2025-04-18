"use client";
import { useState, useCallback } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import useEmblaCarousel from "embla-carousel-react";

export default function Card({ product }) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: "trimSnaps",
    dragFree: false,
    skipSnaps: false,
  });

  // Ensure images is an array and has at least one image
  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [product.image || "/images/placeholder.png"];

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition w-full max-w-xs h-[500px] flex flex-col">
      {/* Product Image with Wishlist Icon */}
      <div className="relative border-1 border-gray-200 rounded-lg flex justify-center h-[300px]">
        <div className="overflow-hidden w-full h-full" ref={emblaRef}>
          <div className="flex h-full">
            {images.map((image, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0 h-full">
                <div className="h-full flex items-center justify-center">
                  <img
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    className="max-w-full max-h-full w-auto h-auto object-contain hover:scale-105 transition duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  emblaApi?.selectedScrollSnap() === index
                    ? "bg-black"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="relative flex-1">
          {/* Wishlist Button */}
          <button className="absolute top-4 right-2 p-1 bg-white rounded-full shadow">
            <Heart
              size={18}
              className="text-gray-500 hover:text-red-500 transition hover:fill-red-500"
            />
          </button>

          {/* Categories */}
          <div className="flex gap-2 text-xs text-black-500 mt-3">
            {product.categories.map((cat, index) => (
              <span
                key={index}
                className="bg-gray-50 px-2 py-1 rounded border-1 border-gray-200"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Color Options */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-2 mt-2">
              {product.colors.map((color, index) => (
                <span
                  key={index}
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                ></span>
              ))}
            </div>
          )}

          {/* Product Details */}
          <div className="">
            <div className="flex flex-col justify-between">
              <a href={`/products/${product.slug}`}>
              <h3 className="text-sm font-semibold mt-2 line-clamp-2">
                {product.name}
              </h3>
              </a>
              <p className="text-lg font-bold text-gray-800 mt-1">
                {product.price}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
