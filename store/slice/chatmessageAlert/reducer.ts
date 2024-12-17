import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  newMessagesAlert: [],
};

const slice = createSlice({
  name: "chatMessageAlert",
  initialState,
  reducers: {
    setNewMessagesAlert: (state, action) => {
      const chatId = action.payload.chatId;

      const index = state.newMessagesAlert.findIndex(
        (item:any) => item.chatId === chatId
      );

      if (index !== -1) {
        state.newMessagesAlert[index].count += 1;
      } else {
        state.newMessagesAlert.push({
          chatId,
          count: 1,
        });
      }
    },

    removeNewMessagesAlert: (state, action) => {
      state.newMessagesAlert = state.newMessagesAlert.filter(
        (item:any) => item.chatId !== action.payload
      );
    },
  },
});

export const chatMessageAlertReducer = slice.reducer;
export const { setNewMessagesAlert, removeNewMessagesAlert } = slice.actions;
