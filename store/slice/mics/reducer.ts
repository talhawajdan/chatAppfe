import { createSlice } from "@reduxjs/toolkit";


const initialState: any = {
  NotificationCount: 0,
  onlineUsers: [],
};

const slice = createSlice({
  name: "mics",
  initialState,
  reducers: {
    setNotificationCount: (state: any, action) => {
      state.NotificationCount = action.payload;
    },
    setOnlineUsers: (state: any, action) => {
      state.onlineUsers = action.payload;
    },
    
  },
});

export const micsActions = slice.actions;
export const micsReducer = slice.reducer;
