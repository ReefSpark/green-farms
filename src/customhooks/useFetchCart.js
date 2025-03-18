import { useDispatch } from "react-redux";
import { setCart } from "../utils/cartSlice";

const useFetchCart = () => {
  const token = localStorage.getItem("authToken");
  const dispatch = useDispatch();
  async function fetchCartItems() {
    try {
      const response = await fetch("http://localhost:8000/api/user/cart", {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });

      const data = await response.json();
      const responseData = data?.data?.attributes?.data || [];

      if (response.ok) {
        dispatch(setCart(responseData));
      } else {
        console.error("Failed to fetch cart items:", data.message);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  }
  return fetchCartItems;
};

export default useFetchCart;
