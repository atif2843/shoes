"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Plus, Minus, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import useCartStore from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { supabase } from "../api/auth/supabaseClient";
import { toast } from "sonner";

export default function Cart() {
  const {
    cartItems,
    isCartOpen,
    openCart,
    closeCart,
    increaseQty,
    decreaseQty,
    removeItem,
  } = useCartStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleClose = () => {
    closeCart();
  };

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity > item.quantity) {
      increaseQty(item.id);
    } else if (newQuantity < item.quantity) {
      decreaseQty(item.id);
    }
  };

  const handleRemoveItem = (item) => {
    removeItem(item.id);
  };

  const generateOrderId = () => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
  };

  const getDateAfter7Days = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const sendWhatsAppMessage = async (orderId, deliveryDate) => {
    try {
      const response = await fetch("/api/whatsapp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          deliveryDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("WhatsApp API error:", data);
        throw new Error(data.error || "Failed to send WhatsApp message");
      }

      return data;
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
      throw error;
    }
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setIsSubmitting(true);

      const newOrderId = generateOrderId();
      setOrderId(newOrderId);

      const deliveryDate = getDateAfter7Days();

      const orderItems = cartItems.map((item) => ({
        name: item.name,
        price: item.price,
        qty: item.quantity,
        order_id: newOrderId,
        status: "pending",
      }));

      const { error } = await supabase.from("Order_details").insert(orderItems);

      if (error) {
        console.error("Database error:", error);
        throw new Error(error.message || "Failed to insert order details");
      }

      try {
        await sendWhatsAppMessage(newOrderId, deliveryDate);
      } catch (whatsappError) {
        console.error("WhatsApp error:", whatsappError);
        setErrorMessage(whatsappError.message || "Failed to send WhatsApp message");
        setShowErrorPopup(true);
      }

      closeCart();
      setShowSuccessPopup(true);

      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 5000);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(`Failed to place order: ${error.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualWhatsApp = () => {
    const message = `Order Summary (Order ID: ${orderId})`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/919820313746?text=${encodedMessage}`, "_blank");
    setShowErrorPopup(false);
  };

  return (
    <>
      <div className={`fixed inset-0 z-50 ${isCartOpen ? "block" : "hidden"}`}>
        <div
          className="absolute inset-0 bg-opacity-50"
          onClick={handleClose}
        ></div>
        <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-lg flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Shopping Cart ({cartItems.length} items)
            </h2>
            <button onClick={handleClose} className="p-1">
              <X size={24} />
            </button>
          </div>

          {cartItems.length === 0 ? (
            <div className="p-8 text-center flex-1 flex flex-col justify-center">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <Link href="/products">
                <Button className="bg-blue-500 text-white">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="p-4 overflow-y-auto flex-1">
                {cartItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex gap-4 mb-4 pb-4 border-b"
                  >
                    <div className="relative w-20 h-20">
                      <Image
                        src={item.image}
                        alt={item.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-600">₹{item.price}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleQuantityChange(item, item.quantity - 1)}
                          className="p-1 border rounded"
                        >
                          <Minus size={16} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item, item.quantity + 1)}
                          className="p-1 border rounded"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item)}
                      className="text-red-500"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t">
                <div className="flex justify-between mb-4">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">
                    ₹{cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)}
                  </span>
                </div>
                <Button
                  className="w-full bg-blue-500 text-white"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Placing Order..." : "Place Order"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Order Placed Successfully!</h3>
            <p className="mb-4">Your order ID is: {orderId}</p>
            <Button onClick={() => setShowSuccessPopup(false)}>Close</Button>
          </div>
        </div>
      )}

      {showErrorPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Error Sending WhatsApp</h3>
            <p className="mb-4">{errorMessage}</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={handleManualWhatsApp}>Send Manually</Button>
              <Button onClick={() => setShowErrorPopup(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
