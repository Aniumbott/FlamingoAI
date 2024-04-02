"use client";

// Modules
import { useEffect, useRef, useState } from "react";
import {
  ActionIcon,
  Button,
  Divider,
  Loader,
  Paper,
  ScrollArea,
  Text,
  TextInput,
  useMantineColorScheme,
  Stack,
  Box,
} from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { useOrganization, useUser } from "@clerk/nextjs";

// Components
import MessageItem from "./MessageItem";
import { sendMessage } from "@/app/controllers/message";
import { getChat, updateChat } from "@/app/controllers/chat";
import { socket } from "@/socket";
import { useScrollIntoView } from "@mantine/hooks";

export default function ChatWindow(props: { currentChatId: String }) {
  const { currentChatId } = props;
  const { organization } = useOrganization();
  const { user } = useUser();
  const [chat, setChat] = useState<any>(null);
  const [messages, setMessages] = useState<any>([]);
  const { colorScheme } = useMantineColorScheme();
  const [participants, setParticipants] = useState<any>([]);
  const [messageInput, setMessageInput] = useState("");
  const { scrollIntoView, targetRef, scrollableRef } = useScrollIntoView<
    HTMLDivElement,
    HTMLDivElement
  >();

  const updateParticipants = () => {
    if (chat.participants.includes(user?.id)) return chat.participants;
    return [...chat.participants, user?.id];
  };

  useEffect(() => {
    setMessages(chat?.messages);

    if (socket.connected) {
      console.log("socket already connected");
    }
    socket.on("newMessage", (msg) => {
      // console.log("newMessage", msg);
      // console.log("insocketlistner", chat);
      updateChat(currentChatId, {
        ...chat,
        messages: [...(chat?.messages || []), msg._id],
        participants: updateParticipants(),
      }).then((res) => {
        console.log("response at chat", res);
        setChat(res.chat);
      });
    });
    return () => {
      socket.off("newMessage");
    };
  }, [chat]);

  useEffect(() => {
    scrollIntoView();
  }, [messages]);

  // useEffect(() => {
  //   console.log(chat);
  // }, [chat]);

  // Functions
  // async function sendMessageHandler() {
  //   sendMessage(user?.id || "", messageInput, "user", currentChatId).then(
  //     (res) => {
  //       updateChat(currentChatId, {
  //         ...chat,
  //         messages: [
  //           ...chat?.messages.slice(
  //             Math.max(chat?.messages.length - 19, 0),
  //             chat?.messages.length
  //           ),
  //           res.message._id,
  //         ],
  //         participants: updateParticipants(),
  //       }).then((res) => {
  //         console.log("sendcomplete");
  //         setChat(res.chat);
  //       });
  //     }
  //   );
  // }

  async function sendMessageHandler() {
    sendMessage(user?.id || "", messageInput, "user", currentChatId).then(
      (res) => {
        socket.emit("createMessage", currentChatId, res.message);
        setMessageInput("");
      }
    );
  }

  async function updateChatHandler(msg: any, chat: any) {
    console.log("chat", chat);
  }

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
    if (currentChatId != "") {
      socket.emit("joinChatRoom", currentChatId);
      const getCurrentChat = async () => {
        console.log(
          "currentChatId",
          currentChatId,
          organization?.id || "orgid"
        );
        return await getChat(currentChatId, organization?.id || "");
      };
      getCurrentChat().then((res) => {
        console.log("currentChat", res);
        setChat(res.chats[0]);
      });
    }
  }, [currentChatId]);

  return (
    <Stack gap={0} h={"100%"} justify="space-between" w="100%" mr={20}>
      <Text p="0.4rem" size="sm">
        {chat?.name} : {chat?._id}
      </Text>
      <Divider />

      <Paper
        h={"70vh"}
        w={"100%"}
        style={{
          overflowY: "scroll",
          flexGrow: "1",
        }}
        ref={scrollableRef}
      >
        {messages ? (
          messages.map((message: any, index: Number) => {
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
          })
        ) : (
          <Loader
            style={{
              position: "absolute",
              top: "30%",
              left: "50%",
            }}
            type="dots"
          />
        )}

        <div ref={targetRef}></div>
      </Paper>

      <div
        className="w-full h-fit py-2 pb-4 flex justify-center items-center"
        style={{
          background:
            colorScheme == "dark"
              ? "var(--mantine-color-dark-8)"
              : "var(--mantine-color-gray-0)",
        }}
      >
        <TextInput
          variant="filled"
          placeholder="Type a message"
          w="75%"
          size="lg"
          radius="0"
          value={messageInput}
          onChange={(e) => setMessageInput(e.currentTarget.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendMessageHandler();
            }
          }}
        />

        <ActionIcon
          size="50"
          radius="0"
          color="teal"
          onClick={() => sendMessageHandler()}
        >
          <IconSend size="24" />
        </ActionIcon>
      </div>
    </Stack>
  );
}
