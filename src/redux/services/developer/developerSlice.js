import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  developedBy: null,
  hyperLink: null,
};

const developerSlice = createSlice({
  name: "developer",
  initialState,
  reducers: {
    setDeveloper: (state, action) => {
      const { developedBy, hyperLink } = action.payload;

      state.developedBy = developedBy;
      state.hyperLink = hyperLink;
    },
  },
});

export const { setDeveloper } = developerSlice.actions;

export default developerSlice.reducer;
