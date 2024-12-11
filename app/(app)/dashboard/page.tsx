"use client";
import LogoIcon from "@assets/icons/logo-icon";
import { Stack } from "@mui/material";
import MessagesSection from "@sections/app/dashboard/messagesSection";
import { useSearchParams } from "next/navigation";
import React from "react";

function DashBoard() {
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");
  if (!chatId)
    return (
      <Stack height={"60vh"} justifyContent={"center"} alignItems={"center"}>
        <LogoIcon
          sx={{
            width: 300,
            height: 80,
            "& path": { fill: "#D0D5DD" },
          }}
        />
      </Stack>
    );
  return <MessagesSection/>
}

export default DashBoard;
