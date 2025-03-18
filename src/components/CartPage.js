import React from "react";

import { useNavigate } from "react-router-dom";
import useCartIncrease from "../customhooks/useCartIncrease";
import { useSelector } from "react-redux";

const CartPage = () => {
  // const [cartItems, setCartItems] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [cartshow, setCartShow] = useState(true);
  const navigate = useNavigate();
  const cartItemSelector = useSelector((state) => state.cart.items);
  const { handleIncreaseQuantity, handleDecreseQuantity, handleDeleteProduct } =
    useCartIncrease();
  let total = cartItemSelector
    .reduce((total, item) => total + item.product_id?.price * item.qty, 0)
    .toFixed(2);
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Cart</h1>
        <button
          onClick={() => navigate("/user/welcomepage")}
          className="flex items-center space-x-2"
        >
          <i class="fa-solid fa-arrow-left font-bold"></i>
        </button>
      </header>

      <div className="space-y-4 mb-6">
        {cartItemSelector.length > 0 ? (
          cartItemSelector.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item?.product_id?.product_img}
                  alt={item.name}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div>
                  <p className="font-semibold">
                    {item?.product_id?.product_name}
                  </p>
                  <p className="text-gray-500">
                    ₹{item.product_id?.price?.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="bg-green-100 text-green-600 px-3 py-1 rounded-lg"
                  onClick={() => handleDecreseQuantity(item.product_id?._id)}
                >
                  -
                </button>
                <span>{item.qty}</span>
                <button
                  className="bg-green-100 text-green-600 px-3 py-1 rounded-lg"
                  onClick={() => handleIncreaseQuantity(item.product_id?._id)}
                >
                  +
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded-lg"
                  onClick={() => handleDeleteProduct(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex justify-between text-lg font-semibold mb-4">
          <span>Subtotal</span>
          <span>₹{total}</span>
        </div>
        <button
          className="bg-green-700 text-white w-full py-2 rounded-lg mb-2"
          onClick={() => navigate("/user/checkoutpage")}
        >
          Proceed To Buy
        </button>
        <button className="border border-green-500 text-green-500 w-full py-2 rounded-lg">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CartPage;
