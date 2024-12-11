// MUI IMPORTS
"use client";
import {
  Alert,
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Theme,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect } from "react";

//ICONS
import MenuIcon from "@mui/icons-material/Menu";
//next imports

import LogoIcon from "@assets/icons/logo-icon";
import LoginIcon from "@mui/icons-material/Login";
import { useDispatch } from "@store/index";
import { authActions } from "@store/slice/auth";
import { useState } from "react";

import { socketEvent, ToastMessageType } from "@enums/event";
import { useGetProfileQuery } from "@services/profile/profile-api";
import toast from "react-hot-toast";
import NotificationsModal from "./notificationsModal/NotificationsModal";
import SearchUserModal from "./searchuserModal/searchUserModal";
import SettingModal from "./settingModal/settingModal";

function TopNavBar(props: any) {
  const theme: any = useTheme();
  const { toggleDrawer ,socket} = props;
  // to handle drawer in different size

  const screenSizeHandler = useMediaQuery(theme.breakpoints.down("lg"));
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { data, isLoading, isFetching } = useGetProfileQuery({});

   useEffect(() => {

     const handleToastMessage = (data: any) => {
      if (ToastMessageType.error === data.type) toast.error(data.message);
      
      if (ToastMessageType.success === data.type) toast.success(data.message);
      if (ToastMessageType.customFriendRequest === data.type) toast.custom((t)=>{
        return (
          <Alert severity="success">{data.message}</Alert>
        )
      });
     };

     // Register the event listener
     socket.on(socketEvent.sendToastNewMessage, handleToastMessage);

     // Cleanup the listener when the component unmounts
     return () => {
       socket.off(socketEvent.sendToastNewMessage, handleToastMessage);
     };
   }, []);
  return (
    <Box position={"relative"} boxShadow={1} sx={Styles.mainBoxStyle(theme)}>
      <Stack
        flexDirection={"row"}
        alignItems={"center"}
        flexWrap={"wrap"}
        justifyContent={"center"}
      >
        <Stack flexDirection={"row"} alignItems={"flex-end"}>
          {screenSizeHandler && (
            <IconButton onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          )}
          <LogoIcon
            sx={{
              width: 200,
              height: 50,
              ...(screenSizeHandler && { mr: "auto" }),
            }}
          />
        </Stack>

        <Box
          sx={{
            ml: { xs: "unset", md: "auto" },
          }}
          display={"flex"}
          alignItems={"center"}
          gap={3}
          flexWrap={"wrap"}
        >
          <SearchUserModal />
          <NotificationsModal />

          <SettingModal />

          <Tooltip
            title={`${data?.data?.firstName} ${data?.data?.lastName}`}
            arrow
            placement="bottom"
          >
            <IconButton
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <Box
                sx={{
                  backgroundColor: "white",
                  borderRadius: "50%",
                  width: "50px",
                  height: "50px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                {isLoading || isFetching ? (
                  <CircularProgress size={40} sx={{}} />
                ) : data?.data?.avatar ? (
                  <Avatar
                    variant="circular"
                    src={data?.data?.avatar}
                    alt={"avatar"}
                    sx={{ width: 50, height: 50 }}
                  />
                ) : (
                  <Avatar
                    variant="circular"
                    src=""
                    alt={"avatar"}
                    sx={{ width: 50, height: 50 }}
                  >
                    {data?.data?.firstName?.charAt(0).toUpperCase()}
                  </Avatar>
                )}
              </Box>
            </IconButton>
          </Tooltip>

          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={() => dispatch(authActions.logout())}>
              <Box display="flex" gap={1}>
                <LoginIcon sx={{ color: theme.palette.primary.main }} />
                <Typography variant="subtitle1" color="primary.main">
                  Logout
                </Typography>
              </Box>
            </MenuItem>
          </Menu>
        </Box>
      </Stack>
    </Box>
  );
}

export default TopNavBar;
//===============================================================================================
// TOPNAVBAR STYLE COMPONENTS

const Styles = {
  mainBoxStyle: (theme: Theme) => ({
    px: 1,
    py: 1,
    background: theme.palette.background.paper,
    zIndex: 1000,
    width: "100%",
    transition: theme.transitions.create("width", {
      duration: 400,
    }),
  }),
};
