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
import { sendAssistantMessage, createMessage } from "@/app/controllers/message";
import { getChat } from "@/app/controllers/chat";
import { socket } from "@/socket";
import { useScrollIntoView } from "@mantine/hooks";
import { ICommentDocument } from "@/app/models/Comment";
import ForkChatModal from "./ForkChatModal";

export default function ChatWindow(props: { currentChatId: String }) {
  const { currentChatId } = props;
  const { organization } = useOrganization();
  const { user } = useUser();
  const [chat, setChat] = useState<any>({
    name: "",
    messages: [],
    participants: [],
    workspaceId: "",
    _id: "",
  });
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
    console.log("chat", chat);
    socket.on("newMessage", (msg) => {
      console.log("new message", msg);
      setChat({
        ...chat,
        messages: [...chat.messages, msg],
      });
    });

    socket.on("deleteMessage", (msg) => {
      setChat({
        ...chat,
        messages: chat.messages.filter((m: any) => m._id != msg._id),
      });
    });

    socket.on("updateMessage", (msg) => {
      // delete all messages from index to end
      const index = chat.messages.findIndex((m: any) => m._id == msg._id);
      setChat({
        ...chat,
        messages: [...chat.messages.slice(0, index), msg],
      });
    });

    socket.on("newComment", (comment: ICommentDocument) => {
      let message = chat.messages.find(
        (msg: any) => msg._id == comment.messageId
      );

      if (comment.parent) {
        message.comments = message.comments.map((c: any) => {
          if (c._id == comment.parent) {
            c.replies.push(comment);
            return c;
          }
          return c;
        });
      } else {
        message.comments.push(comment);
      }

      setChat({
        ...chat,
        messages: chat.messages.map((msg: any) => {
          if (msg._id == message._id) return message;
          return msg;
        }),
      });
    });

    socket.on("updateComment", (comment: ICommentDocument) => {
      let message = chat.messages.find(
        (msg: any) => msg._id == comment.messageId
      );
      message.comments = message.comments.map((c: any) => {
        if (c._id == comment._id) return comment;
        return c;
      });
      setChat({
        ...chat,
        messages: chat.messages.map((msg: any) => {
          if (msg._id == message._id) return message;
          return msg;
        }),
      });
    });

    socket.on("deleteComment", (comment: ICommentDocument) => {
      let message = chat.messages.find(
        (msg: any) => msg._id == comment.messageId
      );

      if (comment.parent) {
        message.comments = message.comments.map((c: any) => {
          if (c._id == comment.parent) {
            c.replies = c.replies.filter((r: any) => r._id != comment._id);
            return c;
          }
          return c;
        });
      } else {
        message.comments = message.comments.filter(
          (c: any) => c._id != comment._id
        );
      }

      setChat({
        ...chat,
        messages: chat.messages.map((msg: any) => {
          if (msg._id == message._id) return message;
          return msg;
        }),
      });
    });

    return () => {
      socket.off("newMessage");
      socket.off("deleteMessage");
      socket.off("newComment");
      socket.off("updateComment");
      socket.off("deleteComment");
    };
  }, [chat]);

  useEffect(() => {
    scrollIntoView();
  }, [chat.messages?.length]);

  useEffect(() => {
    const fetchParticipants = async () => {
      const res =
        (await organization?.getMemberships())?.map(
          (member: any) => member.publicUserData
        ) || [];
      setParticipants(res);
    };
    fetchParticipants();
  }, [organization?.membersCount]);

  useEffect(() => {
    if (currentChatId != "") {
      socket.emit("joinChatRoom", currentChatId);
      const getCurrentChat = async () => {
        return await getChat(currentChatId, organization?.id || "");
      };
      getCurrentChat().then((res) => {
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
        {chat.messages ? (
          chat.messages.map((message: any, index: Number) => {
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
                <MessageItem message={message} participants={participants} />
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
              createMessage(
                user?.id || "",
                messageInput,
                "user",
                currentChatId
              ).then((res) => {
                sendAssistantMessage(
                  res.message,
                  chat.workspaceId,
                  "gpt-3.5-turbo"
                );
                setMessageInput("");
              });
            }
          }}
        />

        <ActionIcon
          size="50"
          radius="0"
          color="teal"
          onClick={() => {
            createMessage(
              user?.id || "",
              messageInput,
              "user",
              currentChatId
            ).then((res) => {
              sendAssistantMessage(
                res.message,
                chat.workspaceId,
                "gpt-3.5-turbo"
              );
              setMessageInput("");
            });
          }}
        >
          <IconSend size="24" />
        </ActionIcon>
      </div>
    </Stack>
  );
}
