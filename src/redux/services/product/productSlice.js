import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  productDetails: [],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProduct: (state, action) => {
      const exists = state.productDetails.some(
        (product) => product.value === action.payload.value
      );

      // If it does not exist, add the new product
      if (!exists) {
        state.productDetails.push(action.payload);
      }
    },
    removeProduct: (state, action) => {
      state.productDetails = state.productDetails.filter(
        (product) => product.id !== action.payload.id
      );
    },
    clearProduct: (state) => {
      state.productDetails = [];
    },
  },
});

export default productSlice.reducer;

export const { setProduct, removeProduct, clearProduct } = productSlice.actions;
