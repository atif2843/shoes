"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus, Pencil, LogOut } from "lucide-react";
import useAuthStore from "@/store/useAuthModal";
import { auth, logOut } from "@/lib/firebase";

const ordersData = [
  {
    id: 1,
    name: "CHUCK 70 WORN IN",
    price: 4999,
    originalPrice: 15295,
    discount: 26,
    size: 7,
    image: "/images/shoe1.png",
  },
  {
    id: 2,
    name: "RUN STAR LEGACY CX TORTOISE HIGH TOP",
    price: 14999,
    originalPrice: 15295,
    discount: 5,
    size: 7,
    image: "/images/shoe2.png",
  },
  {
    id: 3,
    name: "DAME CERTIFIED 3",
    price: 9999,
    size: 7,
    image: "/images/shoe3.png",
  },
];

const wishlist = [
  {
    id: 1,
    name: "CHUCK 70 WORN IN",
    price: 4999,
    originalPrice: 15295,
    discount: 26,
    size: 7,
    image: "/images/shoe1.png",
  },
  {
    id: 2,
    name: "RUrrrrN STAR LEGACY CX TORTOISE ",
    price: 14999,
    originalPrice: 15295,
    discount: 5,
    size: 7,
    image: "/images/shoe2.png",
  },
];

export default function UserProfile() {
  const { isLoggedIn, loginSuccess } = useAuthStore();
  const user = auth.currentUser;
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: "20 Cooper Square, New York, NY 10003, USA",
    phone: "+91 ************",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.displayName || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "O"; // Default to "O"

    const nameParts = name.trim().split(" ");
    console.log("Name Parts:", nameParts); // Debugging log

    return nameParts.length > 1
      ? (nameParts[0][0] + nameParts[1][0]).toUpperCase() // First letter of first & last name
      : nameParts[0][0].toUpperCase(); // Single name case
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogout = async () => {
    await logOut(); // Firebase Logout
    loginSuccess(false); // Clear Zustand state
  };

  const [activeTab, setActiveTab] = useState("orders");
  const [quantities, setQuantities] = useState(
    ordersData.reduce((acc, item) => ({ ...acc, [item.id]: 1 }), {})
  );

  const increaseQuantity = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const decreaseQuantity = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, prev[id] - 1) }));
  };

  return (
    <div className="w-full mx-auto px-8 py-40">
      <div className="flex justify-between flex-wrap gap-14">
        <div>
          <div className="flex gap-4 mb-6">
            <Button
              className={
                activeTab === "orders"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }
              onClick={() => setActiveTab("orders")}
            >
              My Orders
            </Button>
            <Button
              className={
                activeTab === "wishlist"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }
              onClick={() => setActiveTab("wishlist")}
            >
              My Wishlist
            </Button>
          </div>

          <h2 className="text-xl font-bold mb-2">My Order</h2>
          <p className="text-gray-600 mb-4">
            Here you can find all the products you have purchased.
          </p>

          {activeTab === "orders" &&
            ordersData.map((item) => (
              <Card
                key={item.id}
                className="p-4 flex gap-4 mb-4 items-center border flex-row relative"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover"
                />
                {item.discount && (
                  <div className="top-1.5 left-1.5 absolute">
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      -{item.discount}%
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 justify-between">
                    <h3 className="font-bold">{item.name}</h3>
                    <Button className="bg-cyan-600 text-white">
                      Add to Cart
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold">
                      ₹ {item.price.toLocaleString()}
                    </p>
                    {item.originalPrice && (
                      <p className="text-sm line-through text-gray-500">
                        ₹ {item.originalPrice.toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 justify-between mt-5">
                    <p className="text-xs px-2 py-1 outline-1 outline-gray-200 rounded-md">
                      Shoe Size: {item.size}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => decreaseQuantity(item.id)}
                      >
                        <Minus size={16} />
                      </Button>
                      <span>{quantities[item.id]}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => increaseQuantity(item.id)}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

          {activeTab === "wishlist" &&
            wishlist.map((item) => (
              <Card
                key={item.id}
                className="p-4 flex gap-4 mb-4 items-center border flex-row relative"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover"
                />
                {item.discount && (
                  <div className="top-1.5 left-1.5 absolute">
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      -{item.discount}%
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 justify-between">
                    <h3 className="font-bold">{item.name}</h3>
                    <Button className="bg-cyan-600 text-white">
                      Add to Cart
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold">
                      ₹ {item.price.toLocaleString()}
                    </p>
                    {item.originalPrice && (
                      <p className="text-sm line-through text-gray-500">
                        ₹ {item.originalPrice.toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 justify-between mt-5">
                    <p className="text-xs px-2 py-1 outline-1 outline-gray-200 rounded-md">
                      Shoe Size: {item.size}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => decreaseQuantity(item.id)}
                      >
                        <Minus size={16} />
                      </Button>
                      <span>{quantities[item.id]}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => increaseQuantity(item.id)}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

          <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
            <span>Rows per page: 10</span>
            <div className="flex gap-2">
              <button className="text-gray-500">&lt; Previous</button>
              <span>1</span>
              <button className="text-gray-500">Next &gt;</button>
            </div>
          </div>
        </div>

        <div className="max-w-lg mx-auto py-10 text-center flex-2">
          <h2 className="text-2xl font-bold">My Profile</h2>
          <p className="text-gray-500">Here you can find your profile data.</p>

          {/* Profile Picture */}
          <div className="mt-6 flex flex-col items-center">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-20 h-20 rounded-full border border-gray-300"
              />
            ) : (
              <div className="w-20 h-20 flex items-center justify-center bg-gray-300 rounded-full text-2xl font-bold">
                {getInitials(user?.displayName).toUpperCase()}
              </div>
            )}
            <Button
              variant="ghost"
              className="mt-2 flex items-center gap-2"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Pencil size={16} /> {isEditing ? "Cancel" : "Update"}
            </Button>
          </div>

          {/* Profile Details */}
          <Card className="p-4 mt-6 space-y-4 text-left">
            <div>
              <p className="text-sm text-gray-500">Number</p>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <Input name="email" value={formData.email} disabled />
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </Card>

          {/* Logout Button */}
          <div className="flex items-center gap-24 justify-center">
            <Button
              variant="destructive"
              className="mt-6 "
              onClick={handleLogout}
            >
              <LogOut size={16} /> Log out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
