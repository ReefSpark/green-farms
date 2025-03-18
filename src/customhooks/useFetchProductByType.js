import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getProductByType } from "../utils/productSlice";

const useFetchProductByType = () => {
  const token = localStorage.getItem("authToken");
  const dispatch = useDispatch();
  async function fetchProductsByType(type) {
    try {
      const response = await fetch(
        `http://localhost:8000/api/admin/list/product/${type}`,
        {
          method: "GET",
          headers: { Authorization: token },
        }
      );

      const data = await response.json();
      if (response.ok) {
        const updatedCart = {};
        const responseArray = data?.data?.attributes?.data;
        responseArray.forEach((item) => {
          updatedCart[item._id] = {
            id: item._id,
            name: item.product_name,
            price: item.price,
            discountPrice: item.discount,
            product_img: item.product_img,
            description: item.description,
            count: item.qty || 0,
            stock: item.stock,
          };
        });
        dispatch(
          getProductByType({ productType: type, productList: updatedCart })
        );
      } else {
        console.error(`Failed to fetch products for ${type}:`, data.message);
      }
    } catch (error) {
      console.error(`Error fetching products for ${type}:`, error);
    }
  }
  return fetchProductsByType;
};

export default useFetchProductByType;
