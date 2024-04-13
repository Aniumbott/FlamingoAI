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
  Combobox,
  useCombobox,
  Group,
  Title,
} from "@mantine/core";
import { IconLayoutSidebarLeftExpand, IconSend } from "@tabler/icons-react";
import { useOrganization, useUser } from "@clerk/nextjs";

// Components
import MessageItem from "./MessageItem";
import { sendAssistantMessage, createMessage } from "@/app/controllers/message";
import { deleteChat, getChat, updateChat } from "@/app/controllers/chat";
import { socket } from "@/socket";
import { useScrollIntoView } from "@mantine/hooks";
import { ICommentDocument } from "@/app/models/Comment";
import ForkChatModal from "./ForkChatModal";
import { getAllPrompts } from "@/app/controllers/prompt";
import { IPromptDocument } from "@/app/models/Prompt";
import PromptItem from "@/app/components/RightPanel/PromptItem";
import ShareChatModal from "@/app/components/ShareChatModal";

export default function ChatWindow(props: {
  currentChatId: String;
  leftOpened: boolean;
  toggleLeft: () => void;
}) {
  const { currentChatId, leftOpened, toggleLeft } = props;
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
  const [prompts, setPrompts] = useState<IPromptDocument[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const filteredPrompts = prompts?.filter((prompt) => {
    return prompt.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const [shareChatOpened, setShareChatOpened] = useState(false);
  const updateParticipants = () => {
    if (chat.participants.includes(user?.id)) return chat.participants;
    return [...chat.participants, user?.id];
  };

  let isViewOnly = false;

  useEffect(() => {
    console.log("chat", chat);

    isViewOnly =
      (chat?.createdBy !== user?.id &&
        chat?.memberAccess?.find((m: any) => m.userId === user?.id)?.access ===
          "view") ||
      (chat?.createdBy !== user?.id &&
        chat?.scope === "viewOnly" &&
        chat?.memberAccess?.find((m: any) => m.userId === user?.id)?.access !==
          "edit") ||
      (chat?.createdBy !== user?.id &&
        chat?.scope === "public" &&
        chat?.memberAccess?.find((m: any) => m.userId === user?.id)?.access ===
          "viewOnly");

    socket.on("newMessage", (msg) => {
      // console.log("new message", msg);
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
  }, [chat?.messages?.length]);

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
        setChat(res.chats?.[0]);
      });
      getAllPrompts(organization?.id || "", user?.id || "").then((res) => {
        setPrompts(res.prompts);
      });
    }
  }, [currentChatId]);

  useEffect(() => {
    if (chat?.messages) {
      scrollIntoView();
    }
  }, [chat?.messages?.length]);

  return (
    <Stack gap={0} h={"100%"} justify="space-between" w="100%" mr={20}>
      {/* <Group gap={30} justify="space-between" py={5} px={10}> */}
      <div clGrouame="w-full flex flex-row justify-start p-2">
        {!leftOpened ? (
          <Group ml={5}>
            <Title order={4}>TeamGPT</Title>
            <ActionIcon
              variant="subtle"
              color="grey"
              aria-label="Settings"
              onClick={toggleLeft}
            >
              <IconLayoutSidebarLeftExpand
                style={{ width: "90%", height: "90%" }}
                stroke={1.5}
              />
            </ActionIcon>
          </Group>
        ) : null}
        <Text size="sm" ml={5} fw={500}>
          {chat?.name}
        </Text>
        <Button
          variant="subtle"
          color="white"
          onClick={() => setShareChatOpened(true)}
          mx={10}
        >
          Share
        </Button>
        {shareChatOpened && (
          <ShareChatModal
            opened={shareChatOpened}
            setOpened={setShareChatOpened}
            chat={chat}
            setChat={setChat}
            members={participants}
          />
        )}
      </div>
      {/* </Group> */}
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
        {chat?.messages ? (
          chat?.messages?.map((message: any, index: Number) => {
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

      {chat?.archived ? (
        <div
          className="w-full h-fit py-2 pb-4 flex justify-center items-center"
          style={{
            background:
              colorScheme == "dark"
                ? "var(--mantine-color-dark-8)"
                : "var(--mantine-color-gray-0)",
          }}
        >
          <Group
            gap={25}
            justify="space-between"
            w={"80%"}
            c={"white"}
            bg={
              colorScheme === "dark"
                ? "var(--mantine-color-gray-8)"
                : "var(--mantine-color-gray-4)"
            }
            p={10}
          >
            <Text ta={"center"} style={{ flexGrow: 1 }}>
              This chat has been archived.
            </Text>
            <Group gap={15}>
              <Button
                variant="default"
                onClick={() => {
                  updateChat(chat?._id, {
                    archived: false,
                  }).then((res) => {
                    console.log(res);
                  });
                }}
              >
                Restore
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  deleteChat(chat).then((res) => {
                    console.log(res);
                  });
                }}
              >
                Delete
              </Button>
            </Group>
          </Group>
        </div>
      ) : isViewOnly ? (
        <div
          className="w-full h-fit py-2 pb-4 flex justify-center items-center"
          style={{
            background:
              colorScheme == "dark"
                ? "var(--mantine-color-dark-8)"
                : "var(--mantine-color-gray-0)",
          }}
        >
          <Text
            p={20}
            bg={
              colorScheme === "dark"
                ? "var(--mantine-color-gray-8)"
                : "var(--mantine-color-gray-4)"
            }
            w={"80%"}
            ta={"center"}
            style={{ borderRadius: "10px" }}
          >
            You can only view this chat. Ask the owner to grant you access.
          </Text>
        </div>
      ) : (
        <Combobox
          store={combobox}
          onOptionSubmit={(val) => {
            combobox.closeDropdown();
            setSearchTerm("");
          }}
          position="top"
        >
          <div
            className="w-full h-fit py-2 pb-4 flex justify-center items-center"
            style={{
              background:
                colorScheme == "dark"
                  ? "var(--mantine-color-dark-8)"
                  : "var(--mantine-color-gray-0)",
            }}
          >
            <Combobox.Target>
              <TextInput
                variant="filled"
                placeholder="Type a message"
                w="75%"
                size="lg"
                radius="0"
                value={messageInput}
                onChange={(e) => {
                  setMessageInput(e.currentTarget.value);
                  if (e.currentTarget.value.includes("/")) {
                    // Set searchTerm with the value after "/"
                    setSearchTerm(e.currentTarget.value.split("/").pop() ?? "");
                    combobox.openDropdown();
                  } else {
                    combobox.closeDropdown();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !messageInput.includes("/")) {
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
            </Combobox.Target>
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

          <Combobox.Dropdown>
            <Combobox.Options>
              {/* <Text>Select Prompts</Text>
            <Divider /> */}
              <ScrollArea.Autosize mah={200} type="scroll">
                {filteredPrompts?.length > 0 ? (
                  filteredPrompts.map((prompt) => (
                    <Combobox.Option
                      key={prompt._id}
                      value={prompt._id}
                      onClick={() => {
                        let newMessageInput = messageInput;
                        if (newMessageInput.includes("/")) {
                          newMessageInput = newMessageInput.substring(
                            0,
                            newMessageInput.lastIndexOf("/")
                          );
                        }
                        setMessageInput(newMessageInput + prompt.content);
                        setSearchTerm("");
                      }}
                    >
                      <Text c={"white"}>{prompt.name}</Text>
                    </Combobox.Option>
                  ))
                ) : (
                  <Combobox.Empty>No prompts found</Combobox.Empty>
                )}
              </ScrollArea.Autosize>
            </Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>
      )}
    </Stack>
  );
}
