"use client";
import { IsFetching } from "@components/table-components";
import { getSocket } from "@contexts/socket/socket";
import { socketEvent } from "@enums/event";
// import CallIcon from "@mui/icons-material/Call";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
// import VideocamIcon from "@mui/icons-material/Videocam";
import { useSocketEvents } from "@hooks/hooks";
import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  AvatarGroup,
  Box,
  IconButton,
  Popover,
  Stack,
  Typography,
  useTheme
} from "@mui/material";
import { Path } from "@root/path";
import { baseAPI } from "@services/base-api";
import {
  useDeleteChatMutation,
  useGetChatSingleListQuery,
} from "@services/chats/chat-api";
import { CHATSSingle } from "@services/tags";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import MessageContainer from "../messagesContainer/messageContainer";


function MessagesSection() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<any>([]);
  const router = useRouter();
  const socket:any = getSocket();
  const theme = useTheme();
  const handleClick = (event: any) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");
  const openPoper = Boolean(anchorEl);
   const dispatch = useDispatch();
  const id = openPoper ? "simple-popover" : undefined;
  const [DeleteChat, { isLoading }] = useDeleteChatMutation();
  const handleDelete = async () => {
    try {
      const { successMessage }: any = await DeleteChat({
        body: {
          chatId,
        },
      }).unwrap();
      toast.success(successMessage ?? "Chat Deleted Successfully");
      router.push(Path.Dashboard);
    } catch (error: any) {
      toast.error(
        error?.data?.errorMessage?.message ?? "Something went wrong!"
      );
    }
  };
  const {
    data,
    isLoading: isLoadingChat,
    isFetching,
  } = useGetChatSingleListQuery({
    params: {
      chatId,
    },
  });
const eventHandler = {
  [socketEvent.refetchRequest]: () =>
    dispatch(baseAPI.util.invalidateTags([CHATSSingle])),
  [socketEvent.onlineUsers]: (data: any) => setOnlineUsers(data),
};
  useSocketEvents(socket, eventHandler);
  if (isLoadingChat || isFetching) {
    return (
      <Box>
        <IsFetching isFetching />
      </Box>
    );
  }
  console.log(data);

  return (
    <>
      <Stack direction={"row"} gap={1}>
        <Stack
          gap={2.5}
          minWidth={"100%"}
          sx={{
            transition: "all 0.5s",
          }}
        >
          <Stack gap={2} flexDirection={"row"} alignItems={"center"}>
            {data?.data?.members.map((member: any) => (
              <>
                <AvatarGroup max={4}>
                  <Avatar
                    sx={{
                      width: 50,
                      height: 50,
                      fontSize: 14,
                      fontWeight: "bold",
                      color: "white",
                      bgcolor: "primary.main",
                    }}
                    alt=""
                    variant="rounded"
                    src={member?.avatar?.url}
                  >
                    {member?.firstName.charAt(0).toUpperCase()}
                  </Avatar>
                </AvatarGroup>
                {data?.data?.groupChat === false && (
                  <Stack gap={1}>
                    <Typography
                      variant="body1"
                      fontWeight={600}
                      color="text.primary"
                    >
                      {member?.firstName ?? "-"} {member?.lastName}
                    </Typography>

                    <Stack
                      flexDirection={"row"}
                      alignItems={"center"}
                      gap={1}
                      position={"relative"}
                    >
                      <Box
                        sx={(theme) => ({
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: onlineUsers.includes(member?._id)
                            ? "#44b700"
                            : "neutral.500",
                          color: onlineUsers.includes(member?._id)
                            ? "#44b700"
                            : "neutral.500",
                          boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
                          position: "relative", // To ensure the animation stays within its bounds
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            backgroundColor: onlineUsers.includes(member?._id)
                              ? "#44b700"
                              : "neutral.500",
                            animation: "pulse 1.5s infinite ease-in-out",
                            opacity: 0.5,
                          },
                          "@keyframes pulse": {
                            "0%": {
                              transform: "scale(1)",
                              opacity: 0.5,
                            },
                            "50%": {
                              transform: "scale(2.5)",
                              opacity: 0,
                            },
                            "100%": {
                              transform: "scale(1)",
                              opacity: 0,
                            },
                          },
                        })}
                      />
                      <Typography variant="subtitle2" color="neutral.600">
                        {onlineUsers.includes(member?._id)
                          ? "online"
                          : "offline"}
                      </Typography>
                    </Stack>
                  </Stack>
                )}
              </>
            ))}

            <Stack
              flexDirection={"row"}
              alignItems={"flex-end"}
              gap={1}
              justifyContent={"flex-end"}
              ml={"auto"}
            >
              {/* <IconButton>
                <CallIcon />
              </IconButton> */}
              {/* <IconButton>
                <VideocamIcon />
              </IconButton> */}
              <IconButton onClick={handleClick}>
                <MoreHorizIcon />
              </IconButton>
            </Stack>
          </Stack>
          <MessageContainer
            chatData={data?.data}
            memberIDs={data?.data?.members.map((member: any) => member?._id)}
          />
        </Stack>
        <Popover
          id={id}
          open={openPoper}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <LoadingButton
            fullWidth
            startIcon={<DeleteIcon />}
            variant="text"
            color="error"
            loading={isLoading}
            onClick={handleDelete}
          >
            Delete Chat
          </LoadingButton>
        </Popover>
      </Stack>
    </>
  );
}

export default MessagesSection;

