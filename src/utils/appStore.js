import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../utils/cartSlice";
import allProductsReducer from "../utils/productSlice";

const appStore = configureStore({
  reducer: {
    cart: cartReducer,
    allProducts: allProductsReducer,
  },
});

export default appStore;
