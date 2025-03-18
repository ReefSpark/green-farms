import { useDispatch } from "react-redux";
import { addItem } from "../utils/cartSlice";
import useFetchCart from "./useFetchCart";

const useFetchAddCart = () => {
  const token = localStorage.getItem("authToken");
  const dispatch = useDispatch();
  const getCarts = useFetchCart();
  async function handleAddToCart(productId) {
    try {
      const response = await fetch("http://localhost:8000/api/user/add-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ product_id: productId, qty: 1 }),
      });
      const data = await response.json();
      const responseData = data;

      if (response.ok) {
        getCarts();
      } else {
        console.error("Failed to add product.");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  }

  return handleAddToCart;
};

export default useFetchAddCart;
