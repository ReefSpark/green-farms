import { useDispatch, useSelector } from "react-redux";
import { decrementQuantity, incrementQuantity } from "../utils/cartSlice";
import useFetchCart from "./useFetchCart";
import { toast } from "react-toastify";
const useCartIncrease = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("authToken");
  const cartItems = useSelector((state) => state.cart.items);
  const getCarts = useFetchCart();
  const handleIncreaseQuantity = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/user/incerment-homepage-cart/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ qty: 1 }),
        }
      );

      if (response.ok) {
        getCarts();
      } else if (response.status === 400) {
        const errorData = await response.json(); // Assuming the response is JSON
        console.error(
          "Bad request:",
          errorData?.data?.attributes?.message || "Invalid request."
        );
        toast(errorData?.data?.attributes?.message || "Invalid request.");
        //alert("Failed to update quantity: " + (errorData?.data?.attributes?.message || "Invalid request."));
      } else {
        console.error("Failed to update quantity.");
        const errorData = await response.json(); // You can also try to extract message from response
        console.log("Error details:", errorData);
      }
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  };

  async function handleDecreseQuantity(productId) {
    console.log("handleDecreseQuantity", productId);

    try {
      const response = await fetch(
        `http://localhost:8000/api/user/decerment-homepage-cart/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ qty: -1 }),
        }
      );

      if (response.ok) {
        getCarts();
      } else if (response.status === 400) {
        const errorData = await response.json(); // Assuming the response is JSON
        console.error(
          "Bad request:",
          errorData?.data?.attributes?.message || "Invalid request."
        );
        toast(errorData?.data?.attributes?.message || "Invalid request.");
        //alert("Failed to update quantity: " + (errorData?.data?.attributes?.message || "Invalid request."));
      } else {
        console.error("Failed to update quantity.");
        const errorData = await response.json(); // You can also try to extract message from response
        console.log("Error details:", errorData);
      }
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  }
  async function handleDeleteProduct(productId) {
    console.log("Deleting product:", productId);
    try {
      const response = await fetch(
        `http://localhost:8000/api/user/delete-cart/${productId}`,
        {
          method: "DELETE",
          headers: { Authorization: token },
        }
      );

      const data = await response.json();
      if (response.ok) {
        getCarts();
      } else {
        console.error("Failed to delete product:", data.message);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }

  return { handleIncreaseQuantity, handleDecreseQuantity, handleDeleteProduct };
};

export default useCartIncrease;
