import React, { useEffect, useState } from "react";
import CartItems from "./CartItems";
import Header from "./Header";
import useFetchProductByType from "../customhooks/useFetchProductByType";
import { useSelector } from "react-redux";

const WelcomePage = () => {
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [productType, setProductType] = useState("Greens");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const token = localStorage.getItem("authToken");
  const fetchProductByType = useFetchProductByType();
  const productsByType = useSelector(
    (state) => state.allProducts.productByType
  );

  async function fetchProfile(userId) {
    try {
      const response = await fetch(
        `http://localhost:8000/api/user/profile/${userId}`,
        {
          method: "GET",
          headers: { Authorization: token },
        }
      );

      const data = await response.json();
      const responseData = data?.data?.attributes?.data;

      if (response.ok && responseData) {
        setUserName(responseData?.address_details?.name || "Guest");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    productsByType[productType] &&
      setFilteredProducts(productsByType[productType]);
  }, [productType, productsByType]);

  useEffect(() => {
    fetchProfile();
    fetchProductByType("Greens");
  }, []);

  return (
    <div>
      <Header />
      <div className="p-2 m-2">
        <header className="flex justify-between pb-6 flex-col">
          <h1 className="text-xl font-semibold">
            Welcome {loading ? "..." : userName}
          </h1>
          <div className="my-1">
            <p className=" text-sm">All Your Cooking Greens In One Place</p>
          </div>
        </header>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => {
              fetchProductByType("Greens");
              setProductType("Greens");
            }}
            className="px-2 py-2 bg-[#E7DBC4] rounded-lg flex items-center sm:w-auto"
          >
            <img
              src="/assets/grass.png"
              alt="Greens"
              className="w-10 h-10 rounded-full pr-1"
            />
            Greens
          </button>
          <button
            onClick={() => {
              fetchProductByType("Batters");
              setProductType("Batters");
            }}
            className="px-2 py-2 bg-[#E7DBC4] rounded-lg flex items-center sm:w-auto"
          >
            <img
              src="/assets/batters.jpg"
              alt="Batters"
              className="w-10 h-10 rounded-full pr-1"
            />
            Batters
          </button>
          <button
            onClick={() => {
              fetchProductByType("Sprouts");
              setProductType("Sprouts");
            }}
            className="px-2 py-2 bg-[#E7DBC4] rounded-lg flex items-center sm:w-auto"
          >
            <img
              src="/assets/sprouts.jpg"
              alt="Sprouts"
              className="w-10 h-10 rounded-full pr-1"
            />
            Sprouts
          </button>
        </div>

        <CartItems cartProductArray={filteredProducts} />
      </div>
    </div>
  );
};

export default WelcomePage;
