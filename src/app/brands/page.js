import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Brands_all from "../components/Brands_all";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Brands_all />
      <Footer />
    </div>
  );
}
