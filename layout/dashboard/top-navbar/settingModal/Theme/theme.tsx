import { SettingsConsumer } from "@contexts/settings";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import Badge, { badgeClasses } from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import type { Settings } from "@types";
import { useCallback } from "react";

// components
import { Scrollbar } from "@components/scrollbar";

import { OptionsColorPreset } from "./options-color-preset";
import { OptionsColorScheme } from "./options-color-scheme";
import { OptionsContrast } from "./options-contrast";
import { OptionsNavColor } from "./options-nav-color";
interface SettingsDrawerProps {
  canReset?: boolean;
  onClose?: () => void;
  onReset?: () => void;
  onUpdate?: (settings: Settings) => void;
  open?: boolean;
  values?: Settings;
}

function ThemeComponent() {
  return (
    <SettingsConsumer>
      {(themeSettings) => {
       
        return (
          <ChildrenComponent
            canReset={themeSettings.isCustom}
            onClose={themeSettings.handleDrawerClose}
            onReset={themeSettings.handleReset}
            onUpdate={themeSettings.handleUpdate}
            open={themeSettings.openDrawer}
            values={{
              direction: themeSettings.direction,
              responsiveFontSizes: themeSettings.responsiveFontSizes,
              stretch: themeSettings.stretch,
              layout: themeSettings.layout,
              colorPreset: themeSettings.colorPreset,
              contrast: themeSettings.contrast,
              paletteMode: themeSettings.paletteMode,
              navColor: themeSettings.navColor,
            }}
          />
        );
      }}
    </SettingsConsumer>
  );
}
const ChildrenComponent = (props: SettingsDrawerProps) => {
  const {
    canReset,
    onClose,
    onUpdate,
    onReset,
    open,
    values = {},
    ...other
  } = props;

  const handleFieldUpdate = useCallback(
    (field: keyof Settings, value: unknown): void => {
      onUpdate?.({
        [field]: value,
      });
    },
    [onUpdate]
  );

  return (
    <Scrollbar
      sx={{
        height: "100%",
        "& .simplebar-content": {
          height: "100%",
        },
        "& .simplebar-placeholder": {
          height: "0 !important",
        },
        "& .simplebar-scrollbar:before": {
          background: "var(--nav-scrollbar-color)",
        },
      }}
    >
    
      <Stack spacing={5} sx={{ p: 3 }}>
        <OptionsColorPreset
          onChange={(value) => {
            handleFieldUpdate("colorPreset", value);
          }}
          value={values.colorPreset}
        />
        <OptionsColorScheme
          onChange={(value) => {
            handleFieldUpdate("paletteMode", value);
          }}
          value={values.paletteMode}
        />
        <OptionsNavColor
          onChange={(value) => {
            handleFieldUpdate("navColor", value);
          }}
          value={values.navColor}
        />
        {/* <OptionsLayout
            onChange={(value) => {
              handleFieldUpdate("layout", value);
            }}
            value={values.layout}
          />
          <OptionsStretch
            onChange={(value) => {
              handleFieldUpdate("stretch", value);
            }}
            value={values.stretch}
          /> */}
        <OptionsContrast
          onChange={(value) => {
            handleFieldUpdate("contrast", value);
          }}
          value={values.contrast}
        />
        {/* <OptionsDirection
            onChange={(value) => {
              handleFieldUpdate("direction", value);
            }}
            value={values.direction}
          /> */}
      </Stack>
    </Scrollbar>
  );
};
export default ThemeComponent;
