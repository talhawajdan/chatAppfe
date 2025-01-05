"use client";
import { NoContent } from "@assets/common";
import { FormProvider, RHFTextField } from "@components/rhf";
import { getSocket } from "@contexts/socket/socket";
import { socketEvent } from "@enums/event";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSocketEvents } from "@hooks/hooks";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
  Avatar,
} from "@mui/material";
import { useGetMessagesListQuery } from "@services/message/message";
import { isToday, isYesterday, format } from "date-fns";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import * as Yup from "yup";
const messageFormSchema: any = Yup.object().shape({
  message: Yup.string()
    .min(1, "Message is required")
    .trim("you can't send empty message")
    .required("Message is required"),
});

function MessageContainer(props: any) {
  const { memberIDs, chatData } = props;
  const socket = getSocket();
  const searchParams = useSearchParams();
  const router = useRouter();
  const chatId = searchParams.get("chatId");
  const chatBoxRef: any = useRef(null);
  const bottomRef: any = useRef(null);
  const typingTimeout: any = useRef(null);
  const userId = useSelector((state: any) => state.auth.user?._id);
  // State for managing pagination and message list
  const [page, setPage] = useState(1);
  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [isFetchingOlder, setIsFetchingOlder] = useState(false);
  const { data, isLoading, isFetching, isError, refetch } =
    useGetMessagesListQuery(
      {
        params: { chatId: chatId, page: page, limit: 20 },
      },
      { skip: !chatId }
    );

  useEffect(() => {
    if (data && data?.data?.messages) {
      setMessages((prevMessages) => {
        const newMessages = data?.data.messages;
        // Avoid re-setting the same messages
        if (JSON.stringify(prevMessages) === JSON.stringify(newMessages)) {
          return prevMessages;
        }
        return page === 1
          ? newMessages // Replace on first page
          : [...newMessages, ...prevMessages]; // Append for older pages
      });
      setIsFetchingOlder(false);
    }
  }, [data, page]);

  // Handle scrolling to fetch older messages
  const handleScroll = () => {
    if (!chatBoxRef.current || isFetchingOlder || isFetching) return;
    const totalPages = data?.data?.meta?.totalPages;

    if (chatBoxRef.current.scrollTop === 0 && page < totalPages) {
      setIsFetchingOlder(true);
      setPage((prevPage) => prevPage + 1); // Fetch the next page
    }
  };

  // Scroll to the bottom when the first page loads
  useEffect(() => {
    if (chatBoxRef.current && page === 1) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, page]);

  // setup from send
  interface MessageFormData {
    message: string;
  }

  const methods = useForm<MessageFormData>({
    defaultValues: {},
    resolver: yupResolver(messageFormSchema),
  });
  const { handleSubmit, reset, watch } = methods;
  const message = watch("message");

  const onSubmit = async (payload: any) => {
    const { message } = payload;

    socket.emit(socketEvent.NewMessage, {
      chatId,
      members: [...memberIDs, userId],
      message,
    });
    reset({ message: "" });
  };
  const newMessagesListener = useCallback(
    (data: any) => {
      if (data.chatId !== chatId) return;
      setMessages((prev) => [...prev, data?.message]);
    },
    [chatId]
  );
  // Handle typing events
  const handleTypingEvent = useCallback(
    (data: any) => {
      if (data.chatId === chatId && data.userId !== userId) {
        setUserTyping(true);
        clearTimeout(typingTimeout.current);

        typingTimeout.current = setTimeout(() => {
          setUserTyping(false);
        }, 2000);
      }
    },
    [chatId, userId]
  );

  const eventHandler = {
    [socketEvent.NewMessage]: newMessagesListener,
    [socketEvent.typing]: handleTypingEvent,
    [socketEvent.stopTyping]: () => setUserTyping(false),
    // [socketEvent.refetchRequest]: useCallback(() => {
    //   refetch();
    // }, [refetch]),
  };
  // Handle typing events locally
  useEffect(() => {
    if (message && message.trim() !== "") {
      if (!IamTyping) {
        socket.emit(socketEvent.typing, {
          chatId,
          members: [...memberIDs],
        });
        setIamTyping(true);
      }
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        socket.emit(socketEvent.stopTyping, {
          chatId,
          members: [...memberIDs],
        });
        setIamTyping(false);
      }, 2000);
    }
  }, [message, IamTyping, socket, chatId, userId]);
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [newMessagesListener, IamTyping, userTyping]);
  useSocketEvents(socket, eventHandler);
  const formatDate = (date: string) => {
    const messageDate = new Date(date);
    if (isToday(messageDate)) return "Today";
    if (isYesterday(messageDate)) return "Yesterday";
    return format(messageDate, "dd MMM yyyy");
  };
 const groupedMessages = useMemo(() => {
   return messages.reduce((groups: any, message: any) => {
     const dateKey = formatDate(message.createdAt);
     if (!groups[dateKey]) groups[dateKey] = [];
     groups[dateKey].push(message);
     return groups;
   }, {});
 }, [messages]);
  useEffect(() => {
    if (isError) {
      router.push("/dashboard");
    }
  }, [isError]);

  if (isLoading) {
    <Stack justifyContent="center" alignItems="center">
      <CircularProgress size={24} />
    </Stack>;
  }
  return (
    <>
      <Stack
        ref={chatBoxRef}
        onScroll={handleScroll}
        gap={2}
        width={"100%"}
        mt={2}
        sx={{
          overflowY: "auto",
          height: "60vh",
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "3px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "primary.main",
            borderRadius: "6px",
          },
          pt: 1,
          px: 2,
        }}
      >
        {/* Show a loader at the top when fetching older messages */}
        {isFetchingOlder && (
          <Stack justifyContent="center" alignItems="center">
            <CircularProgress size={24} />
          </Stack>
        )}

        {/* Render messages */}
        {Object.entries(groupedMessages).map(([dateLabel, messages]: any) => (
          <Stack gap={1} key={dateLabel}>
            {/* Date Label */}
            <Typography
              textAlign="center"
              color="neutral.600"
              fontSize={12}
              mt={1}
              mb={1}
            >
              {dateLabel}
            </Typography>
            {/* Messages for the Date */}
            {messages.map((msg: any, index: number) => (
              <Message key={index} {...msg} />
            ))}
          </Stack>
        ))}

        {userTyping && (
          <Message
            content={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // Space between text and dots
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: "4px", // Space between dots
                  }}
                >
                  {[...Array(3)].map((_, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "common.white",
                        animation: "typing 1.2s infinite",
                        animationDelay: `${i * 0.2}s`,
                        "@keyframes typing": {
                          "0%": { opacity: 0.2 },
                          "50%": { opacity: 1 },
                          "100%": { opacity: 0.2 },
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            }
            hideAvatar
          />
        )}

        <div ref={bottomRef} />

        {/* Error message */}
        {isError && (
          <Box display={"flex"} justifyContent={"center"} width={"100%"}>
            <NoContent sx={{ fontSize: 180, opacity: 0.6 }} />
          </Box>
        )}
      </Stack>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <RHFTextField
          name="message"
          fullWidth
          variant="outlined"
          required
          placeholder="Enter Message Here"
          sx={{
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: "neutral.200",
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "inherit",
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Stack flexDirection={"row"} alignItems={"center"} gap={1}>
                  <IconButton>
                    <AttachFileIcon />
                  </IconButton>
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<SendIcon />}
                    type="submit"
                    {...(chatData?.isdisabled && {
                      disabled: chatData?.isdisabled,
                    })}
                  >
                    Send
                  </Button>
                </Stack>
              </InputAdornment>
            ),
          }}
          {...(chatData?.isdisabled && { disabled: chatData?.isdisabled })}
        />
      </FormProvider>
    </>
  );
}

export default MessageContainer;
const Message = (props: any) => {
  const { content, createdAt, sender, hideAvatar, system } = props;
  const userId = useSelector((state: any) => state.auth.user?._id);
  if (system) {
    return (
      <Stack justifyContent="center" alignItems="center">
        <Typography color="neutral.700" fontSize={12}>
          {content}
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack
      gap={2}
      alignItems={sender?._id === userId ? "flex-end" : "flex-start"}
    >
      <Stack flexDirection="row" gap={1}>
        {sender?._id !== userId && (
          <>
            {!hideAvatar && (
              <Avatar
                variant="circular"
                src={sender?.avatar?.url}
                alt={sender?.firstName?.charAt(0).toUpperCase()}
                sx={{ width: 40, height: 40 }}
              >
                {sender?.firstName?.charAt(0).toUpperCase()}
              </Avatar>
            )}
          </>
        )}

        <Stack
          className="message"
          alignItems={sender?._id === userId ? "flex-end" : "flex-start"}
          gap={1}
        >
          <Box
            sx={{
              width: "fit-content",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: sender?._id === userId ? "flex-end" : "flex-start",
              backgroundColor:
                sender?._id === userId ? "primary.main" : "neutral.400",
              borderRadius: 1,
              maxWidth: 350,
              wordBreak: "break-word", // Break long words to prevent overflow
              overflowWrap: "break-word", // Ensure proper wrapping of text
              px: 1,
              py: 0.5,
            }}
          >
            <Typography variant="subtitle2" fontSize={11} color="common.white">
              {sender?._id === userId
                ? "You"
                : `${sender?.firstName ?? ""} ${sender?.lastName ?? ""}`}
            </Typography>
            <Typography variant="body2" color="common.white">
              {content}
            </Typography>
          </Box>
          {createdAt && (
            <Typography whiteSpace={"nowrap"} color="neutral.600" fontSize={12}>
              {dayjs(createdAt).format("hh:mm A")}
            </Typography>
          )}
        </Stack>
        {sender?._id === userId && (
          <Avatar
            variant="circular"
            src={sender?.avatar?.url}
            alt={sender?.firstName?.charAt(0).toUpperCase()}
            sx={{ width: 40, height: 40 }}
          >
            {sender?.firstName?.charAt(0).toUpperCase()}
          </Avatar>
        )}
      </Stack>
    </Stack>
  );
};
