"use client";

//types
import type { Theme } from "@mui/material/styles";
import type { ReactNode } from "react";

// next
import Head from "next/head";

// @mui
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

// redux
import { store } from "@store/index";
import { Provider as ReduxProvider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

//contexts
import { SettingsConsumer, SettingsProvider } from "@contexts/settings";
import { AuthInitializer } from "@hoc/with-auth-initializer";

//other
import Cookies from "js-cookie";
import { NextAppDirEmotionCacheProvider } from "tss-react/next/appDir";

// components
import { SettingsButton } from "@components/settings/settings-button";
import { SettingsDrawer } from "@components/settings/settings-drawer";
import { Toaster } from "@components/toaster";
import { createTheme } from "@themeMain/index";
import type { Settings } from "@types";
import MetaTagImage from "./meta-logo.png";

const SETTINGS_STORAGE_KEY = "app.settings";

const resetSettings = (): void => {
  try {
    Cookies.remove(SETTINGS_STORAGE_KEY);
    // window.location.reload();
  } catch (err) {
    console.error(err);
  }
};

const updateSettings = (settings: Settings): void => {
  try {
    Cookies.set(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    // window.location.reload();
  } catch (err) {
    console.error(err);
  }
};

interface LayoutProps {
  children: ReactNode;
  settings?: Settings;
}

const persistor = persistStore(store);

export function Layout(props: LayoutProps): JSX.Element {
  const { children, settings } = props;
 return (
    <NextAppDirEmotionCacheProvider options={{ key: "css" }}>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
         
          <SettingsProvider
            onReset={resetSettings}
            onUpdate={updateSettings}
            settings={settings}
          >
            <SettingsConsumer>
              {(themeSettings) => {
                const theme: Theme = createTheme({
                  direction: themeSettings.direction,
                  responsiveFontSizes: themeSettings.responsiveFontSizes,
                  colorPreset: themeSettings.colorPreset,
                  contrast: themeSettings.contrast,
                  paletteMode: themeSettings.paletteMode,
                });
                return (
                  <ThemeProvider theme={theme}>
                    <Head>
                      <meta
                        name="color-scheme"
                        content={themeSettings.paletteMode}
                      />
                      <meta
                        name="theme-color"
                        content={theme.palette.neutral[900]}
                      />
                      <meta property="og:image" content={MetaTagImage.src} />
                    </Head>
                    <CssBaseline />
                    <AuthInitializer handleTheme={themeSettings.handleUpdate}>
                    

                      {children}
                  

                    

                      <SettingsDrawer
                        canReset={themeSettings.isCustom}
                        onClose={themeSettings.handleDrawerClose}
                        onReset={themeSettings.handleReset}
                        onUpdate={themeSettings.handleUpdate}
                        open={themeSettings.openDrawer}
                        values={{
                          direction: themeSettings.direction,
                          responsiveFontSizes:
                            themeSettings.responsiveFontSizes,
                          stretch: themeSettings.stretch,
                          layout: themeSettings.layout,
                          colorPreset: themeSettings.colorPreset,
                          contrast: themeSettings.contrast,
                          paletteMode: themeSettings.paletteMode,
                          navColor: themeSettings.navColor,
                        }}
                      />
                    </AuthInitializer>
                    <Toaster />
                  </ThemeProvider>
                );
              }}
            </SettingsConsumer>
          </SettingsProvider>
        </PersistGate>
      </ReduxProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
