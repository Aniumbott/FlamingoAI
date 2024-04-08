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
import {
  sendAssistantMessage,
  sendMessage,
  updateMessage,
} from "@/app/controllers/message";
import { getChat, updateChat } from "@/app/controllers/chat";
import { socket } from "@/socket";
import { useScrollIntoView } from "@mantine/hooks";
import { getAssistantResponse } from "@/app/controllers/assistant";
import { getWorkspace } from "@/app/controllers/Workspace";
import { ICommentDocument } from "@/app/models/Comment";
import { updateComment } from "@/app/controllers/comment";

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

    socket.on("newMessage", (msg) => {
      console.log("msg", msg);
      updateChat(currentChatId, {
        ...chat,
        messages: [...(chat?.messages || []), msg._id],
        participants: updateParticipants(),
      }).then((res) => {
        setChat(res.chat);
      });
    });

    socket.on("deleteMessage", (msg) => {
      console.log("msg", msg);
      updateChat(currentChatId, {
        ...chat,
        messages: chat?.messages
          .map((m: any) => m._id)
          .filter((m: any) => m != msg._id),
      }).then((res) => {
        console.log("res", res);
        setChat(res.chat);
      });
    });

    socket.on("deleteMessages", (messages)=>{
      console.log("messages", messages);
      updateChat(currentChatId, {
        ...chat,
        messages: chat?.messages
          .map((m: any) => m._id)
          .filter((m: any) => !messages.includes(m)),
      }).then((res) => {
        console.log("res", res);
        setChat(res.chat);
      });
    
    })

    return () => {
      socket.off("newMessage");
      socket.off("deleteMessage");
    };
  }, [chat]);

  // useEffect(() => {
  //   console.log("chat", chat);
  // }, [chat]);

  useEffect(() => {
    socket.on("newComment", (comment: ICommentDocument) => {
      const message = messages.find((msg: any) => msg._id == comment.messageId);
      // console.log("message", message);
      updateMessage(message._id, {
        comments: [...message.comments.map((c: any) => c._id), comment._id],
      })
        .then((res) => {
          updateChat(currentChatId, {
            ...chat,
            participants: updateParticipants(),
          }).then((res) => {
            setChat(res.chat);
          });

          return res;
        })
        .then((res) => {
          console.log("res", res.message);

          console.log("messages");
          setMessages(
            messages.map((msg: any) => {
              if (msg._id == res.message._id) return res.message;
              return msg;
            })
          );
        });
    });

    socket.on("updateComment", (comment: ICommentDocument) => {
      // console.log("comment", comment);
      let message = messages.find((msg: any) => msg._id == comment.messageId);
      message.comments = message.comments.map((c: any) => {
        if (c._id == comment._id) return comment;
        return c;
      });
      setMessages(
        messages.map((msg: any) => {
          if (msg._id == message._id) return message;
          return msg;
        })
      );
    });

    socket.on("deleteComment", (comment: ICommentDocument) => {
      let message = messages.find((msg: any) => msg._id == comment.messageId);

      updateMessage(message._id, {
        comments: message.comments
          .filter((c: any) => c._id != comment._id)
          .map((c: any) => c._id),
      }).then((res) => {
        setMessages(
          messages.map((msg: any) => {
            if (msg._id == res.message._id) return res.message;
            return msg;
          })
        );
      });
    });

    socket.on("deleteReply", (reply: ICommentDocument) => {
      console.log("reply", reply);
      let message = messages.find((msg: any) => msg._id == reply.messageId);
      console.log("message", message);
      let comment = message.comments.find((c: any) =>
        c.replies.map((r: any) => r._id).includes(reply._id)
      );

      updateComment(comment._id, {
        replies: comment.replies
          .filter((r: any) => r._id != reply._id)
          .map((r: any) => r._id),
      });

      comment.replies = comment.replies.filter((r: any) => r._id != reply._id);

      message.comments = message.comments.map((c: any) => {
        if (c._id == comment._id) return comment;
        return c;
      });

      setMessages(
        messages.map((msg: any) => {
          if (msg._id == message._id) return message;
          return msg;
        })
      );
    });

    return () => {
      socket.off("newComment");
      socket.off("updateComment");
      socket.off("deleteComment");
      socket.off("deleteReply");
    };
  }, [messages]);

  useEffect(() => {
    scrollIntoView();
  }, [messages?.length]);

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
        console.log(
          "currentChatId",
          currentChatId,
          organization?.id || "orgid"
        );
        return await getChat(currentChatId, organization?.id || "");
      };
      getCurrentChat().then((res) => {
        // console.log("currentChat", res);
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
              sendMessage(
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
            sendMessage(
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
