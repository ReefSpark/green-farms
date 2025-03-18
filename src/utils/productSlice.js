import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "Product",
  initialState: {
    allPrdouct: [],
    productByType: {},
  },
  reducers: {
    getAllProducts: (state, action) => {
      state.allPrdouct = action.payload;
    },
    getProductByType: (state, action) => {
      state.productByType[action.payload.productType] =
        action.payload.productList;
    },
  },
});

export const { getAllProducts, getProductByType } = productSlice.actions;

export default productSlice.reducer;
