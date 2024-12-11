import { SvgIcon } from "@mui/material";
import type { SxProps } from "@mui/material";

interface IconProps {
  width?: string;
  height?: string;
  sx?: SxProps;
}

export function ChangePasswordIcon(props: IconProps): JSX.Element {
  const { width = "34px", height = "42px", sx = {} } = props;

  return (
    <SvgIcon sx={{ width, height, ...sx }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M13.7062 27H22.6663C26.3463 27 29.3329 24.0133 29.3329 20.3333V11.6667C29.3329 7.98667 26.3463 5 22.6663 5H13.7062C11.8262 5 10.0396 5.78667 8.77292 7.18667L4.06625 12.36C2.18625 14.4267 2.18625 17.5733 4.06625 19.64L8.77292 24.8133C10.0396 26.2133 11.8262 27 13.7062 27Z"
          stroke="currentColor"
        />
        <path d="M21.3367 19.2937L14.75 12.707" stroke="currentColor" />
        <path d="M14.75 19.2937L21.3367 12.707" stroke="currentColor" />
      </svg>
    </SvgIcon>
  );
}
