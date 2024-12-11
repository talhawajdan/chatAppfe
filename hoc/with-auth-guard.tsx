import type { FC } from "react";

import { AuthGuard } from "@guards/auth-guard";
import { SocketProvider } from "@contexts/socket/socket";
import { Box, useTheme } from "@mui/material";

export const withAuthGuard = <P extends object>(Component: FC<P>): FC<P> => {
  return function WithAuthGuard(props: P) {
    const theme = useTheme();
    return (
      <AuthGuard>
        <SocketProvider>
          <Box
            sx={{
              "&::-webkit-scrollbar": {
                width: "3px",
                height: "3px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "primary.main !important",
                borderRadius: "6px",
              },
            }}
          >
            <Component {...props} />
          </Box>
        </SocketProvider>
      </AuthGuard>
    );
  };
};
