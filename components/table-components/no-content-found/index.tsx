"use client";

import { Box } from "@mui/material";
import { NoContent } from "@assets/common/no-content";

export function NoContentFound(): JSX.Element {
  return (
    <Box display="flex">
      {/* <NoContent /> */}
      <NoContent sx={{ fontSize: 180, opacity: 0.6 }} />
    </Box>
  );
}
