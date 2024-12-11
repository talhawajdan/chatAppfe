import { createSlice } from "@reduxjs/toolkit";
import { loginSuccess, authMeSuccess } from "./extra-reducers";
import { authAPI } from "@services/auth-api";

const initialState: any = {
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  user: {},
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state: any) => {
      state.isAuthenticated = initialState.isAuthenticated;
      state.user = initialState.user;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authAPI.endpoints.login.matchFulfilled, loginSuccess);
    builder.addMatcher(authAPI.endpoints.authMe.matchFulfilled, authMeSuccess);
    builder.addMatcher(authAPI.endpoints.signUp.matchFulfilled, loginSuccess);
  },
});

export const authActions = slice.actions;
export const authReducer = slice.reducer;
