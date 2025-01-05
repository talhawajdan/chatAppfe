import React, { useEffect, useState, useCallback } from "react";
import {
  Avatar,
  AvatarGroup,
  Box,
  IconButton,
  List,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useDeleteChatMutation,
  useGetChatSingleListQuery,
} from "@services/chats/chat-api";
import { getSocket } from "@contexts/socket/socket";
import { socketEvent } from "@enums/event";
import { useRouter, useSearchParams } from "next/navigation";
import { baseAPI } from "@services/base-api";
import { CHATS, CHATSSingle } from "@services/tags";
import GroupChatManagementModal from "./groupChatManangementModal/groupChatManangementModal";
import MessageContainer from "../messagesContainer/messageContainer";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { IsFetching } from "@components/table-components";
import { useSocketEvents } from "@hooks/hooks";

function MessagesSection() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [mergedImage, setMergedImage] = useState<string | null>(null);
  const router = useRouter();
  const socket = getSocket();
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");
  const openPoper = Boolean(anchorEl);
  const dispatch = useDispatch();
  const {
    data,
    isLoading: isLoadingChat,
    isError,
    isFetching,
  } = useGetChatSingleListQuery({ params: { chatId } });
  const [DeleteChat, { isLoading }] = useDeleteChatMutation();
  const { onlineUsers: onlineUsersState } = useSelector(
    (state: any) => state.mics
  );
  const userData = useSelector((state: any) => state.auth?.user);

  const updateRefetchHandler = useCallback(() => {
    dispatch(baseAPI.util.invalidateTags([CHATSSingle, CHATS]));
  }, []);
  const eventHandler = {
    [socketEvent.refetchRequest]: updateRefetchHandler,
  };

  useSocketEvents(socket, eventHandler);

  useEffect(() => {
    if (data?.data?.groupChat) {
      // Merge avatars for group chat
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      let avatars = data?.data?.members.map(
        (member: any) => member?.avatar?.url
      );
      avatars.push(data?.data?.creator?.avatar?.url);
      const imagePromises = avatars.map((url: any) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = url;
          img.onload = () => resolve(img);
        });
      });

      Promise.all(imagePromises).then((images: any) => {
        // Adjust the canvas size and grid layout based on the number of avatars
        const avatarCount = images.length;
        let width = 100;
        let height = 100;
        let columns = 2;
        let rows = 2;

        // For 2 members, arrange avatars side by side in a single row
        if (avatarCount === 2) {
          columns = 1;
          rows = 2;
          width = 200; // Total width for 2 avatars side by side
          height = 100;
        }
        // For 4 members, arrange in a 2x2 grid
        else if (avatarCount === 4) {
          columns = 2;
          rows = 2;
          width = 200; // Total width for 2 columns
          height = 200; // Total height for 2 rows
        }

        canvas.width = width;
        canvas.height = height;

        images.forEach((img: any, index: number) => {
          const x = (index % columns) * (width / columns);
          const y = Math.floor(index / columns) * (height / rows);
          ctx?.drawImage(img, x, y, width / columns, height / rows);
        });

        const mergedDataUrl = canvas.toDataURL();
        setMergedImage(mergedDataUrl);
      });
    }
  }, [data]);


  const handleDelete = async () => {
    try {
      const { successMessage }: any = await DeleteChat({
        body: { chatId },
      }).unwrap();
      toast.success(successMessage ?? "Deleted Successfully");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(
        error?.data?.errorMessage?.message ?? "Something went wrong!"
      );
    }
  };
  useEffect(() => {
    if (isError) {
      router.push("/dashboard");
    }
  }, [isError]);
  if (isLoadingChat || isFetching) {
    return (
      <Box position={"relative"}>
        <IsFetching isFetching />
      </Box>
    );
  }

  return (
    <>
      <Stack direction={"row"} gap={1}>
        <Stack gap={2.5} minWidth={"100%"} sx={{ transition: "all 0.5s" }}>
          <Stack gap={2} flexDirection={"row"} alignItems={"center"}>
            {data?.data?.groupChat ? (
              // Show merged avatar for group chat
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
                variant="circular"
                src={mergedImage || ""}
              >
                {data?.data?.name.charAt(0).toUpperCase()}
              </Avatar>
            ) : (
              // Show individual member avatar for non-group chat
              <AvatarGroup max={1}>
                <Avatar
                  sx={{
                    width: 50,
                    height: 50,
                    fontSize: 14,
                    fontWeight: "bold",
                    color: "white",
                    bgcolor: "neutral.500",
                  }}
                  alt=""
                  variant="circular"
                  src={data?.data?.members[0]?.avatar?.url}
                >
                  {data?.data?.members[0]?.firstName.charAt(0).toUpperCase()}
                </Avatar>
              </AvatarGroup>
            )}
            <Stack gap={1}>
              <Typography variant="body1" fontWeight={600} color="text.primary">
                {data?.data?.groupChat
                  ? data?.data?.name
                  : `${data?.data?.members[0]?.firstName} ${data?.data?.members[0]?.lastName}`}
              </Typography>
              <Stack
                flexDirection={"row"}
                alignItems={"center"}
                gap={1}
                position={"relative"}
              >
                <Typography variant="subtitle2" color="neutral.600">
                  {data?.data?.groupChat ? (
                    data?.data?.members.length > 3 ? (
                      `You,${data?.data?.members
                        .slice(0, 3)
                        .map(
                          (member: any) =>
                            `${member.firstName} ${member.lastName}`
                        )
                        .join(", ")} +${data?.data?.members.length - 3}`
                    ) : (
                      `You,${data?.data?.members
                        .map(
                          (member: any) =>
                            `${member.firstName} ${member.lastName}`
                        )
                        .join(", ")}`
                    )
                  ) : (
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
                          backgroundColor: onlineUsersState.includes(
                            data?.data?.members[0]?._id
                          )
                            ? "#44b700"
                            : "neutral.500",
                          color: onlineUsersState.includes(
                            data?.data?.members[0]?._id
                          )
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
                            backgroundColor: onlineUsersState.includes(
                              data?.data?.members[0]?._id
                            )
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
                        {onlineUsersState.includes(data?.data?.members[0]?._id)
                          ? "online"
                          : "offline"}
                      </Typography>
                    </Stack>
                  )}
                </Typography>
              </Stack>
            </Stack>
            <Stack
              flexDirection={"row"}
              alignItems={"flex-end"}
              gap={1}
              justifyContent={"flex-end"}
              ml={"auto"}
            >
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
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
          open={openPoper}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <List>
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
            {data?.data?.groupChat ? (
              <GroupChatManagementModal
                popState={setAnchorEl}
                apiData={data?.data}
                isCreator={data?.data?.creator?._id === userData?._id}
                isFetching={isFetching}
              />
            ) : null}
          </List>
        </Popover>
      </Stack>
    </>
  );
}

export default MessagesSection;
