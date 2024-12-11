import { SvgIcon } from "@mui/material";
import type { SxProps } from "@mui/material";

interface IconProps {
    width?: string;
    height?: string;
    sx?: SxProps;
}

export function ToastErrorIcon(props: IconProps): JSX.Element {
    const { width = "20px", height = "20px", sx = {} } = props;

    return (
        <SvgIcon sx={{ width, height, ...sx }}>
            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22.9766C17.5 22.9766 22 18.4766 22 12.9766C22 7.47656 17.5 2.97656 12 2.97656C6.5 2.97656 2 7.47656 2 12.9766C2 18.4766 6.5 22.9766 12 22.9766Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9.17188 15.8084L14.8319 10.1484" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14.8319 15.8084L9.17188 10.1484" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </SvgIcon>
    );
}