import type { AnyAction } from "@reduxjs/toolkit";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import type { TypedUseSelectorHook } from "react-redux";
import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from "react-redux";
import { persistReducer } from "redux-persist";
import type { ThunkAction } from "redux-thunk";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import {
  clearLocalStorage,
  clearSessionStorage,
  getLocalStorage,
  setLocalStorage,
} from "@utils";
import { enableDevTools } from "@root/config";

// reducers
import { baseAPI } from "@services/base-api";
import { authReducer } from "@store/slice/auth";
import { micsReducer } from "./slice/mics/reducer";

// Fallback to a no-op storage engine for SSR
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, _value: string) {
      return Promise.resolve();
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

const isBrowser = typeof window !== "undefined";
const storage = isBrowser ? createWebStorage("local") : createNoopStorage();

const persistConfig = {
  key: "root",
  version: 1,
  whitelist: ["auth"],
  storage,
};

const appReducer = combineReducers({
  auth: authReducer,
  mics:micsReducer,
  [baseAPI.reducerPath]: baseAPI.reducer,
});

const rootReducer = (state: any, action: any): any => {
  if (action.type === "auth/logout") {
    state = undefined;
    const rememberMeData = getLocalStorage("rememberMe");
    clearLocalStorage();
    clearSessionStorage();
    if (rememberMeData) {
      setLocalStorage("rememberMe", rememberMeData);
    }
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: enableDevTools as boolean,
  middleware: (defaultMiddleware) =>
    defaultMiddleware({ serializableCheck: false }).concat(baseAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk = ThunkAction<void, RootState, unknown, AnyAction>;

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

export const useDispatch = (): any => useReduxDispatch<AppDispatch>();
