import React from "react";

import { SvgIcon } from "@mui/material";
import type { SvgIconProps } from "@mui/material";

export function WarningIcon(props: SvgIconProps): JSX.Element {
  return (
    <SvgIcon {...props}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 12V18.6667"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.0006 28.5461H7.92056C3.29389 28.5461 1.36056 25.2394 3.60056 21.1994L7.76056 13.7061L11.6806 6.66605C14.0539 2.38605 17.9472 2.38605 20.3206 6.66605L24.2406 13.7194L28.4006 21.2127C30.6406 25.2527 28.6939 28.5594 24.0806 28.5594H16.0006V28.5461Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.9922 22.667H16.0042"
          stroke="currentColor"
          strokeWidth="2.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SvgIcon>
  );
}
