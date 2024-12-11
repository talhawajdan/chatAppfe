"use client";
import BgTwo from "@assets/auth/bg-two";
import BgOne from "@assets/auth/bgone";
import bgIMG from "@assets/common/chat_signinbg.svg";
import LogoIcon from "@assets/icons/logo-icon";
import { withGuestGuard } from "@hoc/with-guest-guard";
import {
  alpha,
  Box,
  Grid2 as Grid,
  Paper,
  Typography,
  useTheme
} from "@mui/material";

function layout(props: any) {
  const { children } = props;
  const theme=useTheme()
  return (
    <Grid container maxWidth={"100%"}>
      <Grid
        size={12}
        bgcolor={theme.palette.primary.main}
        height={"100vh"}
        width="100%"
      >
        <Box
          position={"absolute"}
          sx={{ display: { xs: "none", lg: "block" } }}
          zIndex={1}
        >
          <BgOne sx={{ fontSize: "65.5rem" }} />
        </Box>
        <Box zIndex={1} position={"relative"}>
          <Grid
            container
            mt={5}
            flexDirection={{ xs: "column-reverse", lg: "row" }}
          >
            <Grid size={{ lg: 2 }} />
            <Grid size={{ xs: 12, lg: 8 }}>
              <Paper variant="elevation" elevation={10} >
                <Grid container>
                  <Grid
                    size={{
                      xs: 12,
                      lg: 6,
                    }}
                    sx={{
                      backgroundImage: `url(${bgIMG.src})`,
                      backgroundRepeat: "no-repeat",

                      display: { xs: "none", lg: "flex" },
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      height: "90vh",
                      borderRadius: 1,
                      position: "relative",
                      backgroundPositionY: "50%",
                    }}
                  >
                    <Box
                      position={"relative"}
                      zIndex={3}
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"center"}
                      px={2}
                      gap={2}
                      width={"100%"}
                      height={"100%"}
                      justifyContent={"center"}
                      textAlign={"center"}
                    >
                      <LogoIcon
                        sx={{
                          width: 300,
                          height: 80,
                          "& path": { fill: "white" },
                        }}
                      />
                      <Typography variant="body1" color="white">
                      Welcome to Chatee - Your Next-Generation App! Sign up now to unlock seamless access to powerful features, personalized experiences, and secure interactions. Get started today and elevate your productivity with ease!
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: alpha(theme.palette.primary.main, 0.9),  
                        zIndex: 2,
                        borderRadius: 1,
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, lg: 6 }}>
                    {/* form sections */}
                    {children}

                    {/* form sections */}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid size={{ lg: 2 }} />
          </Grid>
        </Box>
        <Box
          position={"absolute"}
          right={0}
          sx={{ display: { xs: "none", lg: "block" } }}
          bottom={0}
        >
          <BgTwo sx={{ fontSize: "65.5rem" }} />
        </Box>
      </Grid>
    </Grid>
  );
}

export default withGuestGuard(layout);
