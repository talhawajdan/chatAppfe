"use client";
import {
  getSessionStorage,
  setSessionStorage,
  removeSessionStorage,
} from "./session-storage";
import { jwtDecode } from "jwt-decode";

const isValidToken = (accessToken: any): any => {
  if (!accessToken) {
    return false;
  }
  const decoded: any = jwtDecode(accessToken);
  if (!decoded) return;
  const currentTime: any = Date.now() / 1000;
  return decoded?.exp > currentTime;
};

const setSession = (accessToken: any) => {
  if (accessToken) {
    setSessionStorage("accessToken", accessToken);
  } else {
    removeSessionStorage("accessToken");
  }
};

export const isAuthenticated = (): boolean =>
  Boolean(getSessionStorage("accessToken"));

export const handleAuthentication = (): any => {
  const accessToken = getSessionStorage("accessToken");
  if (!accessToken) {
    return;
  }
  if (isValidToken(accessToken)) {
    setSession(accessToken);
  } else {
    setSession(null);
  }
};
