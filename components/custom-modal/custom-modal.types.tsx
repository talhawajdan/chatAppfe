import type { ButtonProps, TypographyProps } from "@mui/material";
import type { Dispatch, ReactNode, SetStateAction } from "react";

export interface CustomModalProps {
  isOpen: boolean;
  onClose?: Dispatch<SetStateAction<boolean>>;
  headerLabel?: string | ReactNode;
  acceptButtonLabel?: string;
  footer?: boolean;
  children?: ReactNode;
  cancelButtonsProps?: ButtonProps;
  acceptButtonProps?: ButtonProps;
  closeButtonProps?: ButtonProps;
  headerTypographyProps?: TypographyProps;
  rootSx?: object | undefined;
  headerSubLabel?: string | ReactNode;
}
