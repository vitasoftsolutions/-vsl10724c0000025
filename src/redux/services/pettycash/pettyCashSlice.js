import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pettyCash: "Close",
};

const pettyCashSlice = createSlice({
  name: "pettyCash",
  initialState,
  reducers: {
    setPettyCash: (state, action) => {
      state.pettyCash = action.payload;
    },
    clearPettyCash: (state) => {
      state.pettyCash = "Close";
    },
  },
});

export const { setPettyCash, clearPettyCash } = pettyCashSlice.actions;

export default pettyCashSlice.reducer;
