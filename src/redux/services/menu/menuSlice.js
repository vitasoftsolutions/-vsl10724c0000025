import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  menuItems: [],
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenuItems: (state, action) => {
      const { menuItems } = action.payload;
      state.menuItems = menuItems;
    },
  },
});

export const { setMenuItems } = menuSlice.actions;

export default menuSlice.reducer;

export const useMenuPaths = (state) => state.menu.menuItems;
