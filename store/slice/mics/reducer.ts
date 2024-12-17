import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  NotificationCount: 0,
};

const slice = createSlice({
  name: "mics",
  initialState,
  reducers: {
    setNotificationCount: (state: any, action) => {
      state.NotificationCount = action.payload;
    },
  },
});

export const micsActions = slice.actions;
export const micsReducer = slice.reducer;
