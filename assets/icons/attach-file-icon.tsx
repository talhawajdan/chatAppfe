import { SvgIcon } from "@mui/material";
import type { SxProps } from "@mui/material";

interface IconProps {
  width?: string;
  height?: string;
  sx?: SxProps;
}

export function AttachFileIcon(props: IconProps): JSX.Element {
  const { width = "25.26px", height = "24px", sx = {} } = props;

  return (
    <SvgIcon sx={{ width, height, ...sx }}>
      <svg
        width="26"
        height="24"
        viewBox="0 0 26 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.3287 11.8002L11.8446 13.2102C11.0236 13.9902 11.0236 15.2602 11.8446 16.0402C12.6656 16.8202 14.0023 16.8202 14.8233 16.0402L17.16 13.8202C18.8019 12.2602 18.8019 9.73023 17.16 8.16023C15.518 6.60023 12.8551 6.60023 11.2026 8.16023L8.65546 10.5802C7.24506 11.9202 7.24506 14.0902 8.65546 15.4302"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.9615 22H16.2767C21.5394 22 23.6445 20 23.6445 15V9C23.6445 4 21.5394 2 16.2767 2H9.9615C4.69882 2 2.59375 4 2.59375 9V15C2.59375 20 4.69882 22 9.9615 22Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SvgIcon>
  );
}
