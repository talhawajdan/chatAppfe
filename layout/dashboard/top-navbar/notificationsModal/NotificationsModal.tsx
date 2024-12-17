import React, { useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  Pagination,
  PaginationItem,
  Popover,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { CustomModal } from "@components/custom-modal";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { useGetSearchUserApiQuery } from "@services/search/search-api";
import { IsFetching, NoContentFound } from "@components/table-components";
import { useDispatch, useSelector } from "react-redux";
import { getSocket } from "@contexts/socket/socket";
import { micsActions } from "@store/slice/mics/reducer";
import { socketEvent } from "@enums/event";
import {
  useGetNotificationQuery,
  usePostAcceptRequestMutation,
  usePostCreateRequestMutation,
} from "@services/request/requestApi";
import { NoContent } from "@assets/common";
import { LoadingButton } from "@mui/lab";
import toast from "react-hot-toast";

function NotificationsModal() {
  const notificationCount = useSelector(
    (state: any) => state.mics.NotificationCount
  );

   const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
      null
    );
  
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;
  const [params, setParams] = useState({
    search: "",
    page: 1,
    limit: 10,
  });
  const { data, isLoading, isFetching, refetch } = useGetNotificationQuery({
    params,
  });
  const dispatch = useDispatch();
  const socket = getSocket();
  socket.on(socketEvent.NewRequest, () => {
    dispatch(micsActions.setNotificationCount(notificationCount + 1));
    refetch();
  });
  const theme = useTheme();
  return (
    <>
      <IconButton
        onClick={(e) => {
          handleClick(e);
          dispatch(micsActions.setNotificationCount(0));
        }}
      >
        <Badge badgeContent={notificationCount} color="primary">
          <NotificationsIcon
            sx={{
              fontSize: 30,
              color: "#9A9A9A",
            }}
          />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: 25,
        }}
        sx={{
          "& .MuiPopover-paper": {
            borderRadius: 2,
          },
        }}
      >
        <Stack minHeight={400} width={400} p={1.5}>
          <Typography fontWeight={600} variant="body1" color="initial">
            Notifications
          </Typography>
          <Stack justifyContent={"center"} alignItems={"center"} gap={2}>
            <Stack
              justifyContent={"flex-start"}
              alignItems={"flex-start"}
              width={"100%"}
              gap={1}
              mt={3}
              minHeight={300}
              overflow={"auto"}
            >
              {isLoading || isFetching ? (
                <Box position={"relative"}>
                  <IsFetching isFetching />
                </Box>
              ) : data?.data?.request.length > 0 ? (
                data?.data?.request?.map((item: any, index: number) => (
                  <UserList key={index} {...item} />
                ))
              ) : (
                <Box display={"flex"} justifyContent={"center"} width={"100%"}>
                  <NoContent sx={{ fontSize: 180, opacity: 0.6 }} />
                </Box>
              )}
              <Box mt="auto" ml={"auto"}>
                <Pagination
                  sx={{
                    ".Mui-selected": {
                      backgroundColor: `${theme.palette.primary.main} !important`,
                      color: "#FFFFFF !important",
                    },
                  }}
                  renderItem={(item: any) => (
                    <PaginationItem
                      slots={{
                        previous: () => <>Previous</>,
                        next: () => <>Next</>,
                      }}
                      {...item}
                    />
                  )}
                  size="small"
                  variant="outlined"
                  shape="rounded"
                  count={Number(data?.data?.meta?.totalPages) ?? 1}
                  page={Number(data?.data?.meta?.page) ?? 1}
                  onChange={(e, page) => {
                    setParams((prv) => ({ ...prv, page }));
                  }}
                  color="primary"
                />
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Popover>
    </>
  );
}
const UserList = ({ _id, sender, ...rest }: any) => {
  const [AcceptRequest, { isLoading }] = usePostAcceptRequestMutation();
  const acceptRequest = async (id: string) => {
    try {
      const { successMessage } = await AcceptRequest({
        body: { requestId: _id },
      }).unwrap();
      toast.success(successMessage ?? "success");
    } catch (error: any) {
      toast.error(
        error?.data?.errorMessage?.message ?? "Something went wrong!"
      );
    }
  };
  return (
    <Stack
      flexDirection={"row"}
      gap={1}
      justifyContent={"space-between"}
      alignItems={"center"}
      width={"100%"}
    >
      {sender.avatar ? (
        <Avatar
          src={sender?.avatar?.url}
          variant="circular"
          sx={{ width: 40, height: 40 }}
        >
          {sender?.firstName.charAt(0)}
        </Avatar>
      ) : (
        <Avatar variant="circular" sx={{ width: 40, height: 40 }}>
          {sender?.firstName.charAt(0)}
        </Avatar>
      )}

      <Typography variant="body2" color="initial" mr={"auto"}>
        {sender?.firstName} {sender?.lastName} Send you a friend request
      </Typography>
      <Tooltip title="Accept Friend Request">
        <LoadingButton
          size="small"
          loading={isLoading}
          onClick={() => acceptRequest(_id)}
          variant="text"
        >
          <DoneIcon sx={{ color: "primary.main" }} />
        </LoadingButton>
      </Tooltip>
      <Tooltip title="Reject Friend Request">
        <LoadingButton size="small" variant="text">
          <CloseIcon sx={{ color: "error.main" }} />
        </LoadingButton>
      </Tooltip>
    </Stack>
  );
};

export default NotificationsModal;
