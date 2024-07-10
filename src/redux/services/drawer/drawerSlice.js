import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  detailsId: undefined,
  editId: undefined,
  statusId: undefined,
  deleteId: undefined,

  isCreateDrawerOpen: false,
  isEditDrawerOpen: false,
  // isBrandDrawerOpen: false,
  // isCategoryDrawerOpen: false,
  // isTaxDrawerOpen: false,

  isNotificationDrawerOpen: false,
};

const drawerSlice = createSlice({
  name: "globalDrawer",
  initialState,
  reducers: {
    setDetailsId: (state, action) => {
      state.detailsId = action.payload;
    },
    setEditId: (state, action) => {
      state.editId = action.payload;
    },
    setDeleteId: (state, action) => {
      state.deleteId = action.payload;
    },
    removeId: (state) => {
      state.detailsId = undefined;
      state.editId = undefined;
      state.deleteId = undefined;
      state.statusId = undefined;
    },

    openCreateDrawer: (state) => {
      state.isCreateDrawerOpen = true;
    },
    closeCreateDrawer: (state) => {
      state.isCreateDrawerOpen = false;

      state.detailsId = undefined;
      state.editId = undefined;
      state.deleteId = undefined;
      state.statusId = undefined;
    },

    openEditDrawer: (state) => {
      state.isEditDrawerOpen = true;
    },

    closeEditDrawer: (state) => {
      state.isEditDrawerOpen = false;

      state.detailsId = undefined;
      state.editId = undefined;
      state.deleteId = undefined;
      state.statusId = undefined;
    },

    openNotificationDrawer: (state) => {
      state.isNotificationDrawerOpen = true;
    },
    closeNotificationDrawer: (state) => {
      state.isNotificationDrawerOpen = false;
    },

    // openBrandDrawer: (state) => {
    //   state.isBrandDrawerOpen = true;
    // },
    // closeBrandDrawer: (state) => {
    //   state.isBrandDrawerOpen = false;
    // },

    // openCategoryDrawer: (state) => {
    //   state.isCategoryDrawerOpen = true;
    // },
    // closeCategoryDrawer: (state) => {
    //   state.isCategoryDrawerOpen = false;
    // },

    // openTaxDrawer: (state) => {
    //   state.isTaxDrawerOpen = true;
    // },
    // closeTaxDrawer: (state) => {
    //   state.isTaxDrawerOpen = false;
    // },
  },
});

export default drawerSlice.reducer;

export const selectEditId = (state) => state.drawer.editId;

export const {
  setDetailsId,
  setEditId,
  setDeleteId,
  removeId,
  openCreateDrawer,
  closeCreateDrawer,
  openEditDrawer,
  closeEditDrawer,
  openNotificationDrawer,
  closeNotificationDrawer,
  // openBrandDrawer,
  // closeBrandDrawer,
  // openCategoryDrawer,
  // closeCategoryDrawer,
  // openTaxDrawer,
  // closeTaxDrawer,
} = drawerSlice.actions;
