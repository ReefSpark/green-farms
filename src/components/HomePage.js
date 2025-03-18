import React from "react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <img src="/assets/logo.png" alt="Logo" className="h-10 w-10 mr-2" />
          <h1 className="text-xl font-bold">Welcome DJ.</h1>
        </div>
        <div className="flex space-x-4">
          <button>
            <img src="/cart-icon.png" alt="Cart" className="h-6 w-6" />
          </button>
          <button>
            <img src="/profile-icon.png" alt="Profile" className="h-6 w-6" />
          </button>
        </div>
      </header>

      <p className="text-gray-500 mb-4">
        All your cooking greens in one place.
      </p>

      <div className="flex overflow-x-auto space-x-4 mb-4">
        <button className="bg-green-100 px-4 py-2 rounded-lg">Greens</button>
        <button className="bg-gray-100 px-4 py-2 rounded-lg">Batters</button>
        <button className="bg-gray-100 px-4 py-2 rounded-lg">Sprouts</button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <button className="bg-green-200 px-4 py-2 rounded-lg">Trending</button>
        <button className="bg-green-200 px-4 py-2 rounded-lg">Seasonal</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {["Spinach", "Arai Keerai"].map((item, index) => (
          <div
            key={index}
            className="border rounded-lg shadow-sm p-2 bg-white text-center"
          >
            <img
              src="/assets/grass.png"
              alt={item}
              className="h-32 w-full object-cover mb-2 rounded-lg"
            />
            <p className="font-semibold">{item}</p>
            <p className="text-gray-500">₹12</p>
            <button className="bg-green-500 text-white px-4 py-1 mt-2 rounded-lg">
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
