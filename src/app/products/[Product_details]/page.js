import React from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ProductDetail from "@/app/components/Product_details";
import Recommended from "@/app/components/Recommended";
import { getProductBySlug } from "@/app/api/supabaseQueries";

export default async function ProductDetailsPage({ params }) {
  const slug = params.Product_details;
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto py-25 px-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold">Product not found</h1>
            <p className="mt-2">The product you are looking for does not exist.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <ProductDetail product={product} />
      <Recommended />
      <Footer />
    </div>
  );
}
