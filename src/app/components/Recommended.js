"use client";
import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Card from "./Card";

const products = [
  {
    id: 1,
    image: "/images/products/shoe1.png",
    categories: ["Crocs", "Man"],
    name: "SALEHE BEMBURY X THE POLLEX SLIDE",
    price: "₹3,599",
    colors: ["#EDEDED", "#4A4A4A"],
  },
  {
    id: 2,
    image: "/images/products/shoe2.png",
    categories: ["Adidas", "Men"],
    name: "CRAZY INFINITY",
    price: "₹10,000",
    colors: ["#EDEDED", "#4A4A4A"],
  },
  {
    id: 3,
    image: "/images/products/shoe3.png",
    categories: ["Converse", "Man"],
    name: "CHUCK TAYLOR ALL STAR LIFT",
    price: "₹8,999",
    colors: ["#000000", "#EDEDED"],
  },
  {
    id: 4,
    image: "/images/products/shoe4.png",
    categories: ["Converse", "Women"],
    name: "CHUCK 70 Pink",
    price: "₹8,999",
    colors: ["#FFC0CB", "#EDEDED"],
  },
  {
    id: 5,
    image: "/images/products/shoe4.png",
    categories: ["Converse", "Women", "Trans"],
    name: "CHUCK 70 Pink",
    price: "₹8,999",
    colors: ["#FFC0CB", "#EDEDED"],
  },
];

export default function TrendingSection() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: false });
  const [isPrevDisabled, setPrevDisabled] = useState(true);
  const [isNextDisabled, setNextDisabled] = useState(false);

  // Function to check if previous/next buttons should be disabled
  const updateButtons = useCallback(() => {
    if (!embla) return;
    setPrevDisabled(!embla.canScrollPrev());
    setNextDisabled(!embla.canScrollNext());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    updateButtons();
    embla.on("select", updateButtons);
    embla.on("reInit", updateButtons);
  }, [embla, updateButtons]);

  return (
    <div className="relative w-full pt-10 px-8 pb-20">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Recommended Products</h2>
        <div className="flex items-center gap-4">
          <button
            className={`p-2 rounded-md ${
              isPrevDisabled
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-cyan-600 hover:bg-cyan-800 text-white"
            }`}
            onClick={() => embla && embla.scrollPrev()}
            disabled={isPrevDisabled}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className={`p-2 rounded-md ${
              isNextDisabled
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-cyan-600 hover:bg-cyan-800 text-white"
            }`}
            onClick={() => embla && embla.scrollNext()}
            disabled={isNextDisabled}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Embla Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {products.map((product) => (
            <div key={product.id} className="flex-none w-[300px]">
              <Card product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
