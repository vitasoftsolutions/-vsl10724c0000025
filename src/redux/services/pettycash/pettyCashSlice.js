import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pettyCash: "Close",
  pettyCashId: undefined,
};

const pettyCashSlice = createSlice({
  name: "pettyCash",
  initialState,
  reducers: {
    setPettyCash: (state, action) => {
      state.pettyCash = action.payload?.status;
      state.pettyCashId = action.payload?.id;
    },
    clearPettyCash: (state) => {
      state.pettyCash = "Close";
    },
  },
});

export const { setPettyCash, clearPettyCash } = pettyCashSlice.actions;

export default pettyCashSlice.reducer;
