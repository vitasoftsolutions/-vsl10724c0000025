import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchParams: {},
};

const paramSlice = createSlice({
  name: "param",
  initialState,
  reducers: {
    setParams: (state, action) => {
      state.searchParams = action.payload;
    },

    clearParams: (state) => {
      state.searchParams = {};
    },
  },
});

export const { setParams, clearParams } = paramSlice.actions;

export const selectParams = (state) => state.param.searchParams;

export default paramSlice.reducer;
