import { createContext } from "react";
import type { Settings, State, SettingsContextType } from "@types";

export const defaultSettings: Settings = {
  direction: "ltr",
  layout: "vertical",
  responsiveFontSizes: false,
  colorPreset: "seaGreen",
  contrast: "normal",
  navColor: "evident",
  paletteMode: "light",
  stretch: false,
  disableButtonsOnLoginAs: false,
};

export const initialState: State = {
  isInitialized: false,
  openDrawer: false,
};

export const SettingsContext = createContext<SettingsContextType>({
  ...defaultSettings,
  ...initialState,
  handleDrawerClose: () => {},
  handleDrawerOpen: () => {},
  handleReset: () => {},
  handleUpdate: () => {},
  isCustom: false,
});
