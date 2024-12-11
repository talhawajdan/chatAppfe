import type { PayloadAction } from "@reduxjs/toolkit";
import { setSessionStorage } from "@utils";

type LoginAction = PayloadAction<any>;

export const loginSuccess = (state: any, action: LoginAction): void => {
  const { data } = action.payload;
  state.accessToken = data.authToken;
  state.refreshToken = data.refreshToken;
  state.user = data.user;
  state.isAuthenticated = true;

  setSessionStorage("accessToken", data.authToken);
  setSessionStorage("refreshToken", data.refreshToken);
};

export const authMeSuccess = (state: any, action: LoginAction): void => {
  const { data } = action.payload;
  state.accessToken = data.authToken;
  state.refreshToken = data.refreshToken;
  state.isAuthenticated = true;

  setSessionStorage("accessToken", data.authToken);
  setSessionStorage("refreshToken", data.refreshToken);
};
