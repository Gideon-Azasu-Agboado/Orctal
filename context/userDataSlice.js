import { createSlice } from '@reduxjs/toolkit'

export const userDataSlice = createSlice({
  name: 'personalInfo',
  initialState: {
    personalInfo: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.personalInfo = action.payload;
    }
  }
});

export const { setUserData } = userDataSlice.actions;

export default userDataSlice.reducer;