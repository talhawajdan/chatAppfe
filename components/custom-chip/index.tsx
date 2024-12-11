"use client";

import { Chip } from "@mui/material";
import type { ChipProps } from "@mui/material";

import { style } from "./table-chip.style";
import { statusColorHandler } from "@utils";

type Variants =
  | "success"
  | "warning"
  | "danger"
  | "started"
  | "custom"
  | "darkDanger"
  | "primary"
  | "customColor";
interface TableChipProps {
  variant: Variants;
  ChipProps: ChipProps;
  rootSx?: object;
}

export function CustomChip({
  variant,
  ChipProps,
  rootSx,
}: TableChipProps): JSX.Element {
  return (
    <Chip sx={style.root(statusColorHandler(variant), rootSx)} {...ChipProps} />
  );
}
