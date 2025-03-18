import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    count: 0,
  },
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload;
      state.count = action.payload.length;
    },
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
    incrementQuantity: (state, action) => {
      const { productId, newQty } = action.payload;
      const item = state.items.find((item) => item.id === productId);
      if (item) {
        item.items = newQty;
      }
    },
    decrementQuantity: (state, action) => {
      const { productId, newQty } = action.payload;
      if (newQty < 1) {
        delete state.items[productId];
      } else if (state.items[productId]) {
        state.items[productId].count = newQty;
      }
    },
  },
});

export const { setCart, addItem, incrementQuantity, decrementQuantity } =
  cartSlice.actions;

export default cartSlice.reducer;
