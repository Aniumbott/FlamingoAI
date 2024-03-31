"use client";

// Modules
import { useEffect, useState } from "react";
import {
  ActionIcon,
  Divider,
  ScrollArea,
  Text,
  TextInput,
  useMantineColorScheme,
} from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { useOrganization, useUser } from "@clerk/nextjs";

// Components
import MessageItem from "./MessageItem";
import { sendMessage } from "@/app/controllers/message";
import { getChat, updateChat } from "@/app/controllers/chat";

export default function ChatWindow(props: { currentChatId: String }) {
  const { currentChatId } = props;
  const { organization } = useOrganization();
  const { user } = useUser();
  const [chat, setChat] = useState<any>(null);
  const [messages, setMessages] = useState<any>([]);
  const { colorScheme } = useMantineColorScheme();
  const [participants, setParticipants] = useState<any>([]);
  const [messageInput, setMessageInput] = useState("");
  const updateParticipants = () => {
    if (chat.participants.includes(user?.id)) return chat.participants;
    return [...chat.participants, user?.id];
  };

  useEffect(() => {
    const fetchParticipants = async () => {
      const res =
        (await organization?.getMemberships())?.map(
          (member: any) => member.publicUserData
        ) || [];
      setParticipants(res);
    };
    fetchParticipants();
  }, [organization]);

  useEffect(() => {
    const getCurrentChat = async () => {
      return await getChat(currentChatId, organization?.id || "");
    };
    getCurrentChat().then((res) => {
      setChat(res.chats[0]);
    });
  }, [currentChatId]);

  useEffect(() => {
    console.log(chat);
    setMessages(chat?.messages);
  }, [chat]);

  return (
    <>
      <div
        style={{
          padding: "0.5rem 1rem",
          position: "absolute",
          top: "3rem",
        }}
      >
        <Text size="sm">
          {chat?.name} : {chat?._id}
        </Text>
      </div>
      <Divider
        style={{
          marginTop: "-5.45rem",
        }}
      />

      <ScrollArea
        h="100vh"
        style={{
          paddingBottom: "4rem",
        }}
      >
        {messages?.map((message: any) => {
          const user = participants.find(
            (participant: any) => participant.userId == message.createdBy
          ) || {
            hasImage: false,
            firstName: "Unknown",
            lastName: "User",
            imageUrl: "",
          };
          return (
            <div key={message._id} className="mb-1">
              <MessageItem
                message={{
                  createdBy: {
                    hasImage: user.hasImage,
                    name: `${user.firstName} ${user.lastName}`,
                    avatar: user.imageUrl,
                  },
                  content: message.content,
                  type: message.type,
                  updatedAt: message.updatedAt,
                  createdAt: message.createdAt,
                }}
              />
            </div>
          );
        })}
      </ScrollArea>

      <div
        className="w-full h-32 flex justify-center items-center"
        style={{
          position: "fixed",
          bottom: "0",
          left: "0",
          background:
            colorScheme == "dark"
              ? "var(--mantine-color-dark-8)"
              : "var(--mantine-color-gray-0)",
        }}
      >
        <div className="w-1/2 ">
          <TextInput
            variant="filled"
            placeholder="Type a message"
            w="100%"
            size="lg"
            radius="0"
            onChange={(e) => setMessageInput(e.currentTarget.value)}
          />
        </div>

        <ActionIcon
          size="50"
          radius="0"
          color="teal"
          onClick={() => {
            sendMessage(
              user?.id || "",
              messageInput,
              "user",
              currentChatId
            ).then((res) => {
              updateChat(currentChatId, {
                ...chat,
                messages: [...chat.messages, res.message._id],
                participants: updateParticipants(),
              }).then((res) => {
                setChat(res.chat);
              });
            });
          }}
        >
          <IconSend size="24" />
        </ActionIcon>
      </div>
    </>
  );
}
