import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  register: false,
};

const cashRegisterSlice = createSlice({
  name: "cashRegister",
  initialState,
  reducers: {
    setCashRegister: (state) => {
      state.register = true;
    },
    clearCashRegister: (state) => {
      state.register = false;
    },
  },
});

export const { setCashRegister, clearCashRegister } = cashRegisterSlice.actions;

export default cashRegisterSlice.reducer;
