import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  warehouseId: null,
  cashierId: null,
  employeeId: null,
  currency: {
    name: "USD",
    symbol: "$",
    position: "0",
  },
};

const posSlice = createSlice({
  name: "pos",
  initialState,
  reducers: {
    setWarehouse: (state, action) => {
      const { warehouseId } = action.payload;
      state.warehouseId = warehouseId;
    },
    setCashier: (state, action) => {
      const { cashierId } = action.payload;
      state.cashierId = cashierId;
    },
    setEmployee: (state, action) => {
      const { employeeId } = action.payload;
      state.employeeId = employeeId;
    },
    setCurrency: (state, action) => {
      const { name, symbol, position } = action.payload;

      state.currency.name = name;
      state.currency.symbol = symbol;
      state.currency.position = position;
    },
  },
});

export const { setWarehouse, setCashier, setEmployee, setCurrency } =
  posSlice.actions;

export default posSlice.reducer;

export const useCurrentWarehouse = (state) => state.pos.warehouseId;
export const useCurrentCashier = (state) => state.pos.cashierId;
export const useCurrentEmployee = (state) => state.pos.employeeId;
export const useCurrency = (state) => state.pos.currency;
