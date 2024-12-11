import { SvgIcon } from "@mui/material";
import type { SxProps } from "@mui/material";

interface IconProps {
    width?: string;
    height?: string;
    sx?: SxProps;
}

export function ToastSuccessIcon(props: IconProps): JSX.Element {
    const { width = "20px", height = "20px", sx = {} } = props;

    return (
        <SvgIcon sx={{ width, height, ...sx }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.9974 18.3346C14.5807 18.3346 18.3307 14.5846 18.3307 10.0013C18.3307 5.41797 14.5807 1.66797 9.9974 1.66797C5.41406 1.66797 1.66406 5.41797 1.66406 10.0013C1.66406 14.5846 5.41406 18.3346 9.9974 18.3346Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6.46094 9.99896L8.81927 12.3573L13.5443 7.64062" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </SvgIcon>
    );
}