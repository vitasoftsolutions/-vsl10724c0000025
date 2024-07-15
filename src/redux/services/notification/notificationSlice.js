import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  newNotification: false,
  notificationList: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNewNotification: (state, action) => {
      state.newNotification = action.payload;
    },
    setNotification: (state, action) => {
      state.notificationList = action.payload;
    },
  },
});

export default notificationSlice.reducer;

export const { setNewNotification, setNotification } =
  notificationSlice.actions;
