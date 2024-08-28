import { createSlice } from '@reduxjs/toolkit'

export const bookingsSlice = createSlice({
  name: 'bookingsData',
  initialState: {
    bookingsData: null,
  },
  reducers: {
    setBookingsData: (state, action) => {
      state.bookingsData = action.payload;
    }
  }
});

export const { setBookingsData } = bookingsSlice.actions;

export default bookingsSlice.reducer;