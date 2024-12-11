import { Box, Grid, Typography } from "@mui/material";
import { WarningIcon } from "@assets/common/warning-icon";
import { CustomModal } from "@components/custom-modal";
import React, { useState } from "react";
import type { BoxProps, ButtonProps } from "@mui/material";
import type { ReactNode } from "react";

interface WarningPromptProps {
  modalOpenProps?: BoxProps;
  acceptButtonProps?: ButtonProps;
  acceptButtonLabel?: string;
  heading: string;
  subTitle: string;
  mainColor: string;
  modelOpenLabel: ReactNode;
}

export function WarningPrompt({
  modalOpenProps,
  acceptButtonProps,
  modelOpenLabel,
  acceptButtonLabel,
  heading,
  subTitle,
  mainColor,
}: WarningPromptProps): JSX.Element {
  const [modal, setModal] = useState<boolean>(false);
  return (
    <>
      <Box
        onClick={() => {
          setModal(true);
        }}
        {...modalOpenProps}
      >
        {modelOpenLabel}
      </Box>
      <CustomModal
        onClose={() => {
          setModal(false);
        }}
        rootSx={{
          maxWidth: { md: 500, xs: 400 },
        }}
        closeButtonProps={{
          onClick: () => {
            setModal(false);
          },
        }}
        isOpen={modal}
        footer
        cancelButtonsProps={{
          onClick: () => {
            setModal(false);
          },
          sx: {
            color: "text.primary",
            border: "1px solid #D0D5DD",
            borderRadius: 1,
          },
        }}
        acceptButtonProps={{
          sx: () => ({
            background: mainColor,
            color: mainColor,
            "&:hover": {
              background: mainColor,
            },
          }),
          disableElevation: true,
          disableFocusRipple: true,
          disableTouchRipple: true,
          disableRipple: true,
          ...acceptButtonProps,
        }}
        acceptButtonLabel={acceptButtonLabel}
      >
        <Grid container>
          <Grid item xs={12}>
            <Box display="flex" flexDirection="column" gap={2} mb={2}>
              <Box
                gap={1}
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
              >
                <WarningIcon
                  sx={{
                    color: mainColor,
                    fontSize: 35,
                  }}
                />
                <Typography
                  variant="h4"
                  fontWeight={600}
                  sx={{ color: "text.primary" }}
                >
                  {heading}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "text.secondary" }}
                >
                  {subTitle}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CustomModal>
    </>
  );
}
