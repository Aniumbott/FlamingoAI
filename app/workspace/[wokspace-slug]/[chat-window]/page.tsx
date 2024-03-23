"use client";

import React, { useEffect, useState } from "react";
import Workspace from "../page";
import { usePathname } from "next/navigation";
import { Container, Divider, Text } from "@mantine/core";
import { getChat, getChats } from "@/app/controllers/chat";
import { auth, clerkClient, useOrganization } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import { Content } from "next/font/google";

export default function ChatWindow() {
  const pathname = usePathname();
  const [currentChatId, setCurrentChatID] = useState<String>(
    pathname.split("/")[3]
  );
  const { organization } = useOrganization();
  const [chat, setChat] = useState<any>(null);

  useEffect(() => {
    const getCurrentChat = async () => {
      setChat((await getChat(currentChatId, organization?.id || "")).chats[0]);
    };
    getCurrentChat();
  }, [currentChatId, organization]);

  return (
    <Workspace>
      <div
        style={{
          padding: "0.5rem 1rem",
          marginLeft: "-15px",
          position: "absolute",
          top: "3rem",
        }}
      >
        <Text size="sm">
          {" "}
          {chat?.name} : {chat?._id}
        </Text>
      </div>
      <Divider
        style={{
          marginTop: "-5.45rem",
          marginLeft: "-15px",
        }}
      />
    </Workspace>
  );
}
