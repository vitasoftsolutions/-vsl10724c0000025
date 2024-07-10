import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pagination: {
    page: 1,
    perPage: 10,
    allData: 1,
  },
};

const paginationSlice = createSlice({
  name: "globalPagination",
  initialState,
  reducers: {
    updatePage: (state, action) => {
      const { page } = action.payload;
      state.pagination.page = page;
    },
    updatePageSize: (state, action) => {
      const { perPage } = action.payload;
      state.pagination.perPage = perPage;
      state.pagination.page = 1;
    },
  },
});

export const { updatePage, updatePageSize } = paginationSlice.actions;

export const selectPagination = (state) => state.pagination.pagination;

export default paginationSlice.reducer;
