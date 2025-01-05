"use client";
import React, { memo, useCallback, useEffect, useState } from "react";

import { NoContent } from "@assets/common";
import LogoIcon from "@assets/icons/logo-icon";
import { IsFetching } from "@components/table-components";
import { getSocket } from "@contexts/socket/socket";
import { socketEvent } from "@enums/event";
import { useSocketEvents } from "@hooks/hooks";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Divider,
  Drawer,
  Grid2 as Grid,
  IconButton,
  Paper,
  Popover,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { baseAPI } from "@services/base-api";
import {
  useGetChatsListQuery,
  usePostCreateChatMutation,
} from "@services/chats/chat-api";
import { useGetContactsListQuery } from "@services/contacts/contacts-api";
import { CHATS, CHATSSingle } from "@services/tags";
import {
  removeNewMessagesAlert,
  setNewMessagesAlert,
} from "@store/slice/chatmessageAlert/reducer";
import dayjs from "dayjs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import CreateGroupModal from "./createGroupModal/createGroupModal";
import TopNavBar from "./top-navbar";
import { motion } from "framer-motion";
import { micsActions } from "@store/slice/mics/reducer";

function DashBoardLayout(props: any) {
  const { children } = props;
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const onlineUsers = useSelector((state: any) => state.mics.onlineUsers);
  const dispatch = useDispatch();

  ///socket works

  const socket = getSocket();
  useEffect(() => {
    const handleOnlineUsers = (data: any) => {
      dispatch(micsActions.setOnlineUsers(data));
    };
    const handleRefresh = (data: any) => {
      dispatch(baseAPI.util.invalidateTags([CHATSSingle, CHATS]));
    };

    socket.on(socketEvent.onlineUsers, handleOnlineUsers);
    socket.on(socketEvent.refetchRequest, handleRefresh);

    return () => {
      socket.off(socketEvent.onlineUsers, handleOnlineUsers);
      socket.off(socketEvent.refetchRequest, handleRefresh);
    };
  }, [socket, dispatch]);

  const toggleDrawer = (newOpen: boolean) => () => {
    setDrawerOpen(newOpen);
  };
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

  //apis
  const { data, isLoading, isFetching, isError } = useGetContactsListQuery({});
  const theme = useTheme();
  const [CreateChat] = usePostCreateChatMutation();

  const handleCreateSingleChat = async (memberid: any) => {
    try {
      const payload = {
        body: {
          members: [memberid],
          name: "not a group chat",
          groupChat: false,
        },
      };

      await CreateChat(payload).unwrap();

      // toast.success(String(successMessage ?? "Chat created successfully"));
    } catch (error: any) {
      console.log("error", error?.data?.errorMessage);
      toast.error(
        String(error?.data?.errorMessage?.message ?? "Something went wrong!")
      );
    }
  };

  return (
    <Box>
      <TopNavBar socket={socket} toggleDrawer={toggleDrawer} />
      <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            borderRadius: 1,
            backgroundColor: "background.paper",
            height: "100%",
            minHeight: "75vh",
            maxWidth: 440,
            a: {
              textDecoration: "none",
            },
          }}
        >
          <LogoIcon
            sx={{
              width: 200,
              height: 50,
              my: 2,
            }}
          />
          <Stack gap={1}>
            <Paper variant="elevation" elevation={0} sx={{ p: 1 }}>
              <Stack gap={2}>
                <Stack flexDirection={"row"} gap={2} alignItems={"center"}>
                  <Typography
                    variant="body1"
                    fontWeight={"bold"}
                    color="neutral.600"
                  >
                    Chats
                  </Typography>
                  <IconButton
                    aria-describedby={id}
                    onClick={handleClick}
                    sx={{
                      ml: "auto",
                      color: "primary.main",
                      backgroundColor: "background.paper",
                    }}
                  >
                    <FilterListIcon />
                  </IconButton>
                  <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                  >
                    <Stack p={1} px={2} pl={0.8} gap={1}>
                      <Stack
                        flexDirection={"row"}
                        gap={2}
                        alignItems={"center"}
                      >
                        <Typography
                          variant="subtitle2"
                          color="neutral.600"
                          fontWeight={"bold"}
                          pl={0.4}
                        >
                          All Contacts
                        </Typography>
                        <CreateGroupModal />
                      </Stack>
                      {isLoading || isFetching ? (
                        <Box>
                          <IsFetching isFetching />
                        </Box>
                      ) : data?.data?.friends &&
                        data?.data?.friends.length > 0 &&
                        !isError ? (
                        <Box
                          height={"100%"}
                          width={"100%"}
                          sx={{
                            overflowY: "scroll",
                            "&::-webkit-scrollbar": {
                              width: "0.6em",
                            },
                            "&::-webkit-scrollbar-thumb": {
                              backgroundColor: theme.palette.primary.main,
                              borderRadius: 2,
                            },
                          }}
                        >
                          {data?.data?.friends?.map(
                            ({
                              avatar,
                              firstName,
                              lastName,
                              email,
                              _id,
                            }: any) => (
                              <Stack
                                flexDirection={"row"}
                                gap={1}
                                justifyContent={"space-between"}
                                alignItems={"center"}
                                width={"100%"}
                                mb={1}
                                sx={{ cursor: "pointer" }}
                                onClick={() => handleCreateSingleChat(_id)}
                              >
                                {avatar ? (
                                  <Avatar
                                    src={avatar?.url}
                                    alt={
                                      firstName.charAt(0).toUpperCase() ?? "A"
                                    }
                                    variant="circular"
                                    sx={{ width: 40, height: 40 }}
                                  />
                                ) : (
                                  <Avatar
                                    variant="circular"
                                    sx={{ width: 40, height: 40 }}
                                  >
                                    {/* {firstName.charAt(0).toUpperCase()} */}
                                  </Avatar>
                                )}

                                <Stack mr={"auto"}>
                                  <Typography
                                    variant="body1"
                                    color="initial"
                                    mr={"auto"}
                                  >
                                    {firstName ?? ""} {lastName ?? ""}
                                  </Typography>
                                  <Typography
                                    variant="subtitle2"
                                    color="initial"
                                    mr={"auto"}
                                  >
                                    {email ?? "-"}
                                  </Typography>
                                </Stack>
                              </Stack>
                            )
                          )}
                        </Box>
                      ) : (
                        <Box
                          display={"flex"}
                          justifyContent={"center"}
                          width={"100%"}
                        >
                          <NoContent sx={{ fontSize: 180, opacity: 0.6 }} />
                        </Box>
                      )}
                    </Stack>
                  </Popover>
                </Stack>
                <Stack
                  gap={2}
                  sx={{
                    overflowY: "auto",
                    height: "100%",
                    maxHeight: "50vh",
                    "&::-webkit-scrollbar": {
                      width: "3px",
                      height: "3px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "primary.main",
                      borderRadius: "6px",
                    },
                  }}
                >
                  <ChatMain onlineUsers={onlineUsers} />
                </Stack>
              </Stack>
            </Paper>
          </Stack>
        </Box>
      </Drawer>
      <Grid px={2} pt={2} spacing={2} container>
        <Grid size={3} sx={{ display: { xs: "none", lg: "block" } }}>
          <Box
            sx={{
              borderRadius: 1,
              backgroundColor: "background.paper",

              a: {
                textDecoration: "none",
              },
            }}
          >
            <Stack gap={1}>
              <Paper variant="elevation" elevation={0} sx={{ p: 1 }}>
                <Stack gap={2}>
                  <Stack flexDirection={"row"} gap={2} alignItems={"center"}>
                    <Typography
                      variant="body1"
                      fontWeight={"bold"}
                      color="neutral.600"
                    >
                      Chats
                    </Typography>
                    <IconButton
                      aria-describedby={id}
                      onClick={handleClick}
                      sx={{
                        ml: "auto",
                        color: "primary.main",
                        backgroundColor: "background.paper",
                      }}
                    >
                      <FilterListIcon />
                    </IconButton>
                    <Popover
                      id={id}
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                    >
                      <Stack p={1} px={2} pl={0.8} gap={1}>
                        <Stack
                          flexDirection={"row"}
                          gap={2}
                          alignItems={"center"}
                        >
                          <Typography
                            variant="subtitle2"
                            color="neutral.600"
                            fontWeight={"bold"}
                            pl={0.4}
                          >
                            All Contacts
                          </Typography>
                          <CreateGroupModal />
                        </Stack>
                        {isLoading || isFetching ? (
                          <Box>
                            <IsFetching isFetching />
                          </Box>
                        ) : data?.data?.friends &&
                          data?.data?.friends.length > 0 &&
                          !isError ? (
                          <Box
                            height={220}
                            width={"100%"}
                            sx={{
                              overflowY: "scroll",
                              "&::-webkit-scrollbar": {
                                width: "0.4em",
                              },
                              "&::-webkit-scrollbar-thumb": {
                                backgroundColor: theme.palette.primary.main,
                                borderRadius: 2,
                              },
                            }}
                          >
                            {data?.data?.friends?.map(
                              ({
                                avatar,
                                _id,
                                firstName,
                                lastName,
                                email,
                              }: any) => (
                                <Stack
                                  flexDirection={"row"}
                                  gap={1}
                                  justifyContent={"space-between"}
                                  alignItems={"center"}
                                  width={"100%"}
                                  mb={1}
                                  sx={{ cursor: "pointer" }}
                                  onClick={() => handleCreateSingleChat(_id)}
                                >
                                  {avatar ? (
                                    <Avatar
                                      src={avatar?.url}
                                      alt={
                                        firstName.charAt(0).toUpperCase() ?? "A"
                                      }
                                      variant="circular"
                                      sx={{ width: 40, height: 40 }}
                                    />
                                  ) : (
                                    <Avatar
                                      variant="circular"
                                      sx={{ width: 40, height: 40 }}
                                    >
                                      {/* {firstName.charAt(0).toUpperCase()} */}
                                    </Avatar>
                                  )}

                                  <Stack mr={"auto"}>
                                    <Typography
                                      variant="body1"
                                      color="initial"
                                      mr={"auto"}
                                    >
                                      {firstName ?? ""} {lastName ?? ""}
                                    </Typography>
                                    <Typography
                                      variant="subtitle2"
                                      color="initial"
                                      mr={"auto"}
                                    >
                                      {email ?? "-"}
                                    </Typography>
                                  </Stack>
                                </Stack>
                              )
                            )}
                          </Box>
                        ) : (
                          <Box
                            display={"flex"}
                            justifyContent={"center"}
                            width={"100%"}
                          >
                            <NoContent sx={{ fontSize: 180, opacity: 0.6 }} />
                          </Box>
                        )}
                      </Stack>
                    </Popover>
                  </Stack>
                  <ChatMain onlineUsers={onlineUsers} />
                </Stack>
              </Paper>
            </Stack>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, lg: 9 }}>
          <Box
            sx={{
              borderRadius: 1,
              backgroundColor: "background.paper",
              px: 2,
              pt: 2,
              pb: 1,
              minHeight: "500px",
              height: "100%",
            }}
          >
            {children}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashBoardLayout;

const ChatMain = memo(({ onlineUsers }: any) => {
  const { data, isLoading, isFetching, isError } = useGetChatsListQuery({});
  const theme = useTheme();
  const socket = getSocket();
  const [chats, setChats] = React.useState<any>([]);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");
  const userID = useSelector((state: any) => state.auth?.user?._id);
  useEffect(() => {
    setChats(data?.data);
  }, [data]);
  const updateChats = useCallback(
    (data: any) => {
      setChats((prev: any) => {
        // Make a shallow copy of the previous state
        let updatedChats = [...prev];

        const index = prev.findIndex((item: any) => item._id === data.chatId);
        if (index !== -1) {
          // Create a new object for the updated chat to ensure immutability
          const updatedChat = {
            ...updatedChats[index],
            latestMessage: {
              content: data.message.content,
              sender: data.message.sender._id,
              createdAt: data.message.createdAt,
            },
          };

          // Replace the old chat object with the updated one
          updatedChats[index] = updatedChat;
        }

        return updatedChats;
      });
      if (userID !== data.message.sender._id && chatId !== data.chatId) {
        dispatch(setNewMessagesAlert(data));
      }
    },
    [data, userID, chatId]
  );
  const eventHandler = {
    [socketEvent.NewMessageAlert]: updateChats,
  };
  useSocketEvents(socket, eventHandler);

  return (
    <Stack
      gap={2}
      sx={{
        overflowY: "auto",
        height: "78vh",
        "&::-webkit-scrollbar": {
          width: "3px",
          height: "3px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "primary.main",
          borderRadius: "6px",
        },
      }}
    >
      {isLoading || isFetching ? (
        <Box position={"relative"}>
          <IsFetching isFetching />
        </Box>
      ) : chats && chats.length > 0 && !isError ? (
        <Box
          width={"100%"}
          sx={{
            overflowY: "scroll",
            height: "85vh",
            "&::-webkit-scrollbar": {
              width: "0.4em",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: theme.palette.primary.main,
              borderRadius: 2,
            },
          }}
        >
          {chats?.map((item: any, index: any) => (
            <ChatList
              onlineUsers={onlineUsers}
              key={item?._id}
              {...item}
              index={index}
            />
          ))}
        </Box>
      ) : (
        <Box
          height={"85vh"}
          display={"flex"}
          justifyContent={"center"}
          width={"100%"}
        >
          <Typography variant="body1" color="neutral.400">
            Select a friend to start a chat
          </Typography>
        </Box>
      )}
    </Stack>
  );
});

const ChatList = memo((props: any) => {
  const {
    _id,
    members,
    groupChat,
    name,
    latestMessage,
    creator,
    index,
    onlineUsers = [],
  } = props;
  const [mergedImage, setMergedImage] = useState<string | null>(null);
  const newMessagesAlert = useSelector(
    (state: any) => state.newMessagesAlert.newMessagesAlert
  );

  const newMessages: any = newMessagesAlert.find(
    (item: any) => item.chatId === _id
  );
  const dispatch = useDispatch();
  const userID = useSelector((state: any) => state.auth?.user?._id);
  useEffect(() => {
    if (groupChat) {
      // Merge avatars for group chat
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      let avatars = members.map((member: any) => member?.avatar?.url);
      avatars.push(creator?.avatar?.url);

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
  }, [groupChat, members]);
  return (
    <>
      <Tooltip
        title={
          groupChat
            ? `${name}`
            : `${members[0]?.firstName} ${members[0]?.lastName}`
        }
        placement="right-end"
      >
        <Link href={{ pathname: `/dashboard`, query: { chatId: _id } }}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Stack
              gap={1}
              alignItems={"flex-start"}
              sx={{ width: "100%", px: 1 }}
              onClick={() => dispatch(removeNewMessagesAlert(_id))}
            >
              <Stack
                justifyContent="space-between"
                alignItems="center"
                flexDirection={"row"}
                width="100%"
                gap={1}
                py={1}
              >
                {!groupChat ? (
                  <AvatarGroup max={0}>
                    {members.map((member: any) => (
                      <Badge
                        overlap="circular"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        variant="dot"
                        sx={(theme) => ({
                          "& .MuiBadge-badge": {
                            backgroundColor: onlineUsers.includes(member?._id)
                              ? "#44b700"
                              : "neutral.400",
                            color: onlineUsers.includes(member?._id)
                              ? "#44b700"
                              : "neutral.400",
                            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
                            "&::after": {
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              borderRadius: "50%",
                              animation: "ripple 1.2s infinite ease-in-out",
                              border: "1px solid currentColor",
                              content: '""',
                            },
                          },
                          "@keyframes ripple": {
                            "0%": {
                              transform: "scale(.8)",
                              opacity: 1,
                            },
                            "100%": {
                              transform: "scale(2.4)",
                              opacity: 0,
                            },
                          },
                        })}
                      >
                        <Avatar
                          sx={{
                            width: 45,
                            height: 45,
                            fontSize: 14,
                            fontWeight: "bold",
                            color: "white",
                            bgcolor: "primary.main",
                          }}
                          alt=""
                          variant="circular"
                          src={member?.avatar?.url}
                        >
                          {member?.firstName.charAt(0).toUpperCase()}
                        </Avatar>
                      </Badge>
                    ))}
                  </AvatarGroup>
                ) : (
                  <Avatar
                    sx={{
                      width: 45,
                      height: 45,
                      fontSize: 14,
                      fontWeight: "bold",
                      color: "white",
                      bgcolor: "primary.main",
                    }}
                    alt=""
                    variant="circular"
                    src={mergedImage || ""}
                  >
                    {name?.charAt(0).toUpperCase()}
                  </Avatar>
                )}

                <Stack gap={1}>
                  <Typography
                    variant="body1"
                    fontWeight={"bold"}
                    color="text.primary"
                    maxWidth={200}
                    sx={{
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      display: "block",
                    }}
                  >
                    {groupChat
                      ? name
                      : `${members[0]?.firstName} ${members[0]?.lastName}`}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    fontWeight={"600"}
                    color="neutral.600"
                    maxWidth={200}
                    sx={{
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      display: "block",
                    }}
                  >
                    {userID === latestMessage?.sender ? "You: " : ""}{" "}
                    {latestMessage?.content}
                  </Typography>
                </Stack>
                <Stack
                  justifyContent={"space-between"}
                  ml={"auto"}
                  alignContent={"center"}
                  alignItems={"center"}
                  gap={1}
                >
                  {latestMessage?.createdAt && (
                    <Typography
                      whiteSpace={"nowrap"}
                      color="neutral.600"
                      fontSize={12}
                    >
                      {dayjs(latestMessage?.createdAt).format("hh:mm A")}
                    </Typography>
                  )}

                  {newMessages ? (
                    <Box
                      sx={{
                        width: "25px",
                        height: "25px",
                        bgcolor: "primary.main",
                        borderRadius: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        variant="subtitle1"
                        color="common.white"
                      >
                        {newMessages.count}
                      </Typography>
                    </Box>
                  ) : null}
                </Stack>
              </Stack>
              <Divider
                variant="fullWidth"
                orientation="horizontal"
                sx={{ borderColor: "neutral.300" }}
              />
            </Stack>
          </motion.div>
        </Link>
      </Tooltip>
    </>
  );
});
