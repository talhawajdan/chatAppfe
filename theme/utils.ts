import type { PaletteColor } from "@mui/material/styles/createPalette";

import { blue, green, indigo, seaGreen } from "./colors";
import type { ColorPreset } from "@types";

export const getPrimary = (preset?: ColorPreset): PaletteColor => {
  switch (preset) {
    case "blue":
      return blue;
    case "green":
      return green;
    case "indigo":
      return indigo;
    case "seaGreen":
      return seaGreen;
    default:
      console.error(
        'Invalid color preset, accepted values: "blue", "green", "indigo" or "seaGreen"".'
      );
      return blue;
  }
};
