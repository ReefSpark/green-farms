import React, { use } from "react";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useFetchCart from "../customhooks/useFetchCart";
import useFetchAddCart from "../customhooks/useFetchAddCart";
import useCartIncrease from "../customhooks/useCartIncrease";
import ProductCard from "./ProductCard";
// import { toast } from "react-toastify";
const CartItems = ({ cartProductArray }) => {
  // const [cartItems, setCartItems] = useState({});
  // const [cartItemsCount, setCartItemsCount] = useState(0);
  const [hideCart, setHideCart] = useState(false);
  const [getCommunity, setGetCommunity] = useState([]);
  const [occurence,setOccurence]=useState('');
  const navigate = useNavigate();
  const cartItemSelector = useSelector((state) => state.cart.items);
  const countItemSelector = useSelector((state) => state.cart.count);
  const counterItemSelector = useSelector((state) => state.cart.itemsCount);
  const { handleIncreaseQuantity, handleDecreseQuantity } = useCartIncrease();
  const addProductCart = useFetchAddCart();
  const addfetchCarts = useFetchCart();

  async function fetchCommunity() {
    try {
      
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast("User not logged in.");
      return;
    }

      const response = await fetch(
        "http://localhost:8000/api/user/community-occurence",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
         
        }
      );
      const data = await response.json();
      const responseData = data?.data?.attributes;

      if (response.ok) {
        const currentDay = new Date().toLocaleString("en-US", {
          weekday: "long",
        });
        let occurenceValue = responseData.community_occurence.split(',')
        let isCartHidden = false;
        let findIndexValue =occurenceValue.indexOf(currentDay.toLowerCase())
        if(findIndexValue==-1) isCartHidden=true
        else isCartHidden=false
        const result = occurenceValue.map(word => word.charAt(0).toUpperCase() + word.slice(1));
        setOccurence(result.toString())
        // const isCartHidden = responseData.some(
        //   (community) =>
        //     community.community_occurence.toLowerCase() !=
        //     currentDay.toLowerCase()
        // );


        setHideCart(isCartHidden);
        setGetCommunity(responseData);
      } else {
        console.error("Failed to fetch community:", data.message);
      }
    } catch (error) {
      console.error("Error fetching community:", error);
    }
  }

  useEffect(() => {
    fetchCommunity();
    addProductCart();
    addfetchCarts();
  }, [cartProductArray]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  mt-4 w-full">
      {hideCart ? (
        <div className="flex  items-center h-[66vh] w-[45vh] text-red-500 text-lg font-semibold">
          Products are unavailable today based on community
          occurrence[{occurence}]
        </div>
      ) : cartProductArray && Object.keys(cartProductArray).length > 0 ? (
        Object.values(cartProductArray).map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            addProductCart={addProductCart}
            handleDecreseQuantity={handleDecreseQuantity}
            handleIncreaseQuantity={handleIncreaseQuantity}
          />
        ))
      ) : (
        <div className="flex justify-center items-center h-[66vh] w-[42vh]">
          <p>No items available</p>
        </div>
      )}

      {countItemSelector > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-700 text-white rounded-full flex justify-between items-center w-full max-w-[90%] sm:max-w-[70%] p-2 gap-3 shadow-lg">
          <div className="flex -space-x-2 flex-wrap">
            {cartItemSelector.map((item, index) => (
              <img
                key={item?.cart_id}
                src={item?.product_id?.product_img}
                alt={item?.name}
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-green-200"
                style={{ zIndex: cartItemSelector.length - index }}
              />
            ))}
          </div>

          <div className="text-xs sm:text-sm font-medium">View Cart</div>

          <div className="text-xs sm:text-sm">{`(${countItemSelector} Items)`}</div>

          <button
            className="px-3 py-1 bg-white text-green-500 rounded-full text-sm sm:text-base"
            onClick={() => navigate("/user/cartpage")}
          >
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default CartItems;
