import React, { useEffect } from "react";

const useFetchAllProduct = () => {
  async function fetchAllProduct() {
    try {
      const response = await fetch(
        "http://localhost:8000/api/admin/all-product"
      );
      const data = await response.json();
      const responseData = data?.data?.attributes?.data || [];

      if (response.ok) {
        const updatedCart = {};
        responseData.forEach((item) => {
          updatedCart[item._id] = {
            id: item._id,
            name: item.product_name,
            price: item.price,
            discountPrice: item.discount,
            product_img: item.product_img,
            description: item.description,
            count: item.qty || 0,
          };
        });
      } else {
        console.error("Failed to fetch products:", data.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }
  useEffect(() => {
    fetchAllProduct();
  }, []);
};

export default useFetchAllProduct;
