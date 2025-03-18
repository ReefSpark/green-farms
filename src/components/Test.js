import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const products = [
  { id: 1, name: "Spinach", price: 12, image: "spinach1.jpg" },
  { id: 2, name: "Spinach", price: 12, image: "spinach2.jpg" },
  { id: 3, name: "Spinach", price: 12, image: "spinach3.jpg" },
  { id: 4, name: "Spinach", price: 12, image: "spinach4.jpg" },
  { id: 5, name: "Arai Keerai", price: 12, image: "araikeerai.jpg" },
];

export default function HomePage() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white px-4 py-6">
      <header className="flex justify-between items-center pb-6">
        <h1 className="text-xl font-semibold">Welcome DJ.</h1>
        <button className="text-green-600 underline">Contact us</button>
      </header>

      <div className="flex gap-2 mb-4">
        <button className="px-4 py-2 bg-green-200 rounded-full">Greens</button>
        <button className="px-4 py-2 bg-yellow-200 rounded-full">
          Batters
        </button>
        <button className="px-4 py-2 bg-yellow-300 rounded-full">
          Sprouts
        </button>
        <button className="px-4 py-2 bg-yellow-400 rounded-full">Ghee</button>
      </div>

      <div className="flex gap-2 mb-4">
        <button className="px-4 py-2 bg-gray-200 rounded-full">All</button>
        <button className="px-4 py-2 bg-green-300 rounded-full">
          Trending
        </button>
        <button className="px-4 py-2 bg-green-300 rounded-full">
          Seasonal
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow p-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-32 object-cover rounded-md"
            />
            <h3 className="mt-2 text-sm font-semibold">{product.name}</h3>
            <p className="text-gray-600">₹{product.price}</p>
            <button
              onClick={() => addToCart(product)}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md w-full"
            >
              Add
            </button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full flex items-center gap-2">
          <span>View Cart</span>
          <span className="bg-white text-green-600 px-2 py-1 rounded-full">
            {cart.length} Items
          </span>
        </div>
      )}
    </div>
  );
}
