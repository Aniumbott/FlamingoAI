"use client";

import React, { useEffect, useState } from "react";
import Workspace from "../page";
import { usePathname } from "next/navigation";
import { Button, Container, Divider, Text } from "@mantine/core";
import { getChat, updateChat } from "@/app/controllers/chat";
import { auth, clerkClient, useOrganization } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import { Content } from "next/font/google";
import dummies from "@/public/messages.json";
import { sendMessage } from "@/app/controllers/message";

import * as Mongoose from "mongoose";

export default function ChatWindow() {
  const pathname = usePathname();
  const [currentChatId, setCurrentChatID] = useState<String>(
    pathname.split("/")[3]
  );
  const { organization } = useOrganization();
  const [chat, setChat] = useState<any>(null);
  const [messages, setMessages] = useState<any>([]);

  useEffect(() => {
    console.log(Mongoose.models);
    const getCurrentChat = async () => {
      setChat((await getChat(currentChatId, organization?.id || "")).chats[0]);
      setMessages(chat.messages);
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

      {messages.map((message: any) => {
        return (
          <Container key={message._id}>
            <Text>{message.content}</Text>
          </Container>
        );
      })}

      <Container>
        <Button
          color="red"
          onClick={() => {
            const message = dummies[1];
            sendMessage(
              message.createdBy,
              message.content,
              message.type,
              message.chatId
            ).then((res) => {
              updateChat(currentChatId, {
                ...chat,
                messages: [...chat.messages, res.message._id],
              }).then((res) => {
                setChat(res.chat);
                console.log(res.message);
              });
              setMessages([...messages, res.message]);
            });
          }}
        >
          Send Dummy
        </Button>
      </Container>
    </Workspace>
  );
}
