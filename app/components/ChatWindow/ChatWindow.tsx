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
  Textarea,
  LoadingOverlay,
  Affix,
  SegmentedControl,
  Center,
  Select,
  Tooltip,
  HoverCard,
} from "@mantine/core";
import {
  IconBuilding,
  IconInfoCircle,
  IconLayoutSidebarLeftExpand,
  IconSend,
} from "@tabler/icons-react";
import { useOrganization, useUser } from "@clerk/nextjs";

// Components
import MessageItem from "./Items/MessageItem/MessageItem";
import { sendAssistantMessage, createMessage } from "@/app/controllers/message";
import {
  deleteChat,
  getChat,
  updateChat,
  updateChatAccess,
} from "@/app/controllers/chat";
import { socket } from "@/socket";
import { useScrollIntoView } from "@mantine/hooks";
import { ICommentDocument } from "@/app/models/Comment";
import ForkChatModal from "./Modals/ForkChatModal";
import { getAllPrompts } from "@/app/controllers/prompt";
import { IPromptDocument } from "@/app/models/Prompt";
import PromptModal from "@/app/components/RightPanel/Modals/PromptModal";
import PromptVariableModal from "@/app/components/RightPanel/Modals/PromptVariableModal";
import ShareChatModal from "@/app/components/ChatWindow/Modals/ShareChatModal";
import ErrorPage from "./ErrorPage/ErrorPage";
import SettingsModal from "./Modals/SettingsModal";

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
  const [forkMessage, setForkMessage] = useState<any>(null);
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
  const [settingsOpen, setSettingsOpen] = useState(false);

  function isViewOnly(chat: any) {
    const ans =
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
    return ans;
  }

  useEffect(() => {
    // console.log("chat", chat);
    socket.on("refreshChatWindow", () => {
      console.log("refreshing chat");
      getChat(currentChatId, organization?.id || "", user?.id || "").then(
        (res) => {
          setChat(res.chats?.[0]);
        }
      );
    });

    socket.on("newMessage", (msg) => {
      console.log("new message", msg);
      setProcessing(msg.type != "assistant");
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
      console.log("updateMessage", msg);
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
      socket.off("refreshChatWindow");
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
    setMessageInput("");

    if (currentChatId != "") {
      socket.emit("joinChatRoom", currentChatId);
      const getCurrentChat = async () => {
        return await getChat(
          currentChatId,
          organization?.id || "",
          user?.id || ""
        );
      };

      getCurrentChat().then((res) => {
        setChat(res.chats?.[0]);
        setLoading(false);
      });

      getAllPrompts(organization?.id || "", user?.id || "").then((res) => {
        setPrompts(res.prompts);
      });
    }
  }, [currentChatId]);

  useEffect(() => {
    socket.on("refreshPrompts", () => {
      getAllPrompts(organization?.id || "", user?.id || "").then((res) => {
        setPrompts(res.prompts);
      });
    });

    return () => {
      socket.off("refreshPrompts");
    };
  }, []);

  function tillLastUserMessage(messages: any[]) {
    let lastUserMessageIndex = 0;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].type === "user") {
        lastUserMessageIndex = i;
        break;
      }
    }
    return messages.slice(0, lastUserMessageIndex + 1);
  }

  const [promptVariables, setPromptVariables] = useState<string[]>([]);
  const [promptContent, setPromptContent] = useState("");
  const [newMessageInput, setNewMessageInput] = useState(messageInput);

  const [promptVariablesOpened, setPromptVariablesOpened] = useState(false);
  const [promptOpened, setPromptOpened] = useState(false);
  const [newPrompt, setnewPrompt] = useState<IPromptDocument | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isForkModalOpen, setIsForkModalOpen] = useState(false);

  return (
    <>
      {!chat ? (
        <Affix top={0} left={0} right={0} bottom={0} zIndex={1000} bg="dark">
          <ErrorPage />
        </Affix>
      ) : (
        <Stack gap={0} h={"100%"} justify="space-between" w="100%" mr={20}>
          {/* <Group gap={30} justify="space-between" py={5} px={10}> */}
          <div className="w-full flex flex-row justify-start p-1">
            {!leftOpened ? (
              <div className="flex flex-row items-center justify-between">
                <Title order={4} mr={10}>
                  TeamGPT
                </Title>
                <Tooltip label="Expand panel" fz="xs" position="right">
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
                </Tooltip>
              </div>
            ) : null}
            <Group justify="space-between" px={"md"} w={"100%"}>
              <Group>
                <HoverCard width={280} position="bottom-start" withArrow>
                  <HoverCard.Target>
                    <IconInfoCircle size={20} />
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <Text fw={700} c="dimmed" mb="xs">
                      Instructions
                    </Text>
                    <Text size="sm">{chat.instructions}</Text>
                  </HoverCard.Dropdown>
                </HoverCard>
                <Text size="sm" ml={5} fw={500}>
                  {chat?.name}
                </Text>
              </Group>
              <Group gap={0}>
                <Button
                  variant="default"
                  // color="default"
                  onClick={() => setShareChatOpened(true)}
                  mx={5}
                >
                  Share
                </Button>
                <Button
                  variant="default"
                  // color="default"
                  onClick={() => setSettingsOpen(true)}
                  mx={5}
                >
                  Settings
                </Button>
              </Group>
            </Group>
            {shareChatOpened && (
              <ShareChatModal
                opened={shareChatOpened}
                setOpened={setShareChatOpened}
                chat={chat}
                setChat={setChat}
                members={participants}
              />
            )}
            {settingsOpen && (
              <SettingsModal
                opened={settingsOpen}
                setOpened={setSettingsOpen}
                chat={chat}
                setChat={setChat}
              />
            )}
            {promptOpened && (
              <PromptModal
                opened={promptOpened}
                setOpened={setPromptOpened}
                scope="public"
                modalItem={newPrompt}
                setModalItem={setnewPrompt}
                parentFolder={null}
                messageContent={messageContent}
              />
            )}
            {promptVariablesOpened && (
              <PromptVariableModal
                opened={promptVariablesOpened}
                setOpened={setPromptVariablesOpened}
                variables={promptVariables}
                promptContent={promptContent}
                setMessageInput={setMessageInput}
                newMessageInput={newMessageInput}
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
            <ForkChatModal
              isOpen={isForkModalOpen}
              setIsOpen={setIsForkModalOpen}
              message={forkMessage}
              chat={chat}
            />

            {!chat?.messages?.length ? (
              <div className="w-full flex flex-col items-center justify-center pt-20">
                <div
                  className="p-5"
                  style={{
                    width: "500px",
                    border: "1px solid var(--mantine-color-default-border)",
                    borderRadius: "var(--mantine-radius-md)",
                  }}
                >
                  <SegmentedControl
                    value={chat?.scope}
                    onChange={(value) => {
                      if (chat.parentFolder) {
                        updateChatAccess(chat?._id, {
                          scope: value,
                          parentFolder: null,
                        }).then((res) => {
                          setChat(res.chat);
                        });
                      } else {
                        updateChatAccess(chat?._id, {
                          scope: value,
                        }).then((res) => {
                          setChat(res.chat);
                        });
                      }
                    }}
                    fullWidth
                    style={{ flexGrow: 1 }}
                    data={[
                      {
                        value: "private",
                        label: (
                          <Center style={{ gap: 10 }}>
                            <Text size="sm">Private</Text>
                          </Center>
                        ),
                      },
                      {
                        value: "viewOnly",
                        label: (
                          <Center style={{ gap: 10 }}>
                            <IconBuilding size={16} />
                            <Text size="sm">View Only</Text>
                          </Center>
                        ),
                      },
                      {
                        value: "public",
                        label: (
                          <Center style={{ gap: 10 }}>
                            <IconBuilding size={16} />
                            <Text size="sm">Public</Text>
                          </Center>
                        ),
                      },
                    ]}
                  />
                  <Select
                    allowDeselect={false}
                    description="Assistant Model"
                    data={chat?.assistant?.assistantId?.models}
                    value={chat?.assistant?.model}
                    onChange={(e) => {
                      updateChat(chat?._id, {
                        assistant: {
                          assistantId: chat?.assistant?.assistantId,
                          model: e,
                        },
                      });
                    }}
                    mt={20}
                  />
                </div>
              </div>
            ) : null}

            {!loading ? (
              chat?.messages?.map((message: any, index: Number) => {
                const user = participants.find(
                  (participant: any) => participant.userId == message?.createdBy
                ) || {
                  hasImage: false,
                  firstName: "Unknown",
                  lastName: "User",
                  imageUrl: "",
                };
                return (
                  <div key={message._id} className="mb-1">
                    <MessageItem
                      message={message}
                      participants={participants}
                      instructions={chat.instructions}
                      assistant={{
                        ...chat.assistant,
                        scope: chat.scope == "private" ? "private" : "public",
                      }}
                      setPromptOpened={setPromptOpened}
                      setPromptContent={setMessageContent}
                      setForkMessage={setForkMessage}
                      setIsForkModalOpen={setIsForkModalOpen}
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
          ) : isViewOnly(chat) ? (
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
            <Stack
              align="center"
              gap={3}
              style={{
                background:
                  colorScheme == "dark"
                    ? "var(--mantine-color-dark-8)"
                    : "var(--mantine-color-gray-0)",
              }}
            >
              {chat?.messages?.length &&
              chat.messages.some((message: any) => message.type === "user") ? (
                <Button
                  variant="outline"
                  fw={300}
                  w={"fit-content"}
                  disabled={processing}
                  onClick={() => {
                    setProcessing(true);
                    let contexWindow = tillLastUserMessage(chat.messages);
                    sendAssistantMessage(
                      contexWindow.slice(0, -1),
                      contexWindow[contexWindow.length - 1],
                      chat.instructions,
                      chat.workspaceId,
                      {
                        ...chat.assistant,
                        scope: chat.scope == "private" ? "private" : "public",
                      }
                    );
                  }}
                >
                  Regenerate
                </Button>
              ) : null}
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
                    <Textarea
                      autosize
                      maxRows={4}
                      variant="default"
                      size="lg"
                      radius="0"
                      w="75%"
                      placeholder="Type a message or type '/' to select a prompt"
                      value={messageInput}
                      disabled={processing}
                      onChange={(e) => {
                        setMessageInput(e.currentTarget.value);

                        if (e.currentTarget.value.includes("/")) {
                          setSearchTerm(
                            e.currentTarget.value.split("/").pop() ?? ""
                          );
                          combobox.openDropdown();
                        } else {
                          combobox.closeDropdown();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (
                          messageInput != "" &&
                          e.key === "Enter" &&
                          !e.shiftKey &&
                          !messageInput.includes("/")
                        ) {
                          setProcessing(true);
                          createMessage(
                            user?.id || "",
                            messageInput,
                            "user",
                            currentChatId
                          ).then((res) => {
                            sendAssistantMessage(
                              chat.messages,
                              res.message,
                              chat.instructions,
                              chat.workspaceId,
                              {
                                ...chat.assistant,
                                scope:
                                  chat.scope == "private"
                                    ? "private"
                                    : "public",
                              }
                            );
                            setMessageInput("");
                          });
                        }
                      }}
                    />
                  </Combobox.Target>
                  <Tooltip label="Send message" fz="xs">
                    <ActionIcon
                      size="50"
                      radius="0"
                      disabled={processing}
                      onClick={() => {
                        if (messageInput != "") {
                          setProcessing(true);
                          createMessage(
                            user?.id || "",
                            messageInput,
                            "user",
                            currentChatId
                          ).then((res) => {
                            sendAssistantMessage(
                              chat.messages,
                              res.message,
                              chat.instructions,
                              chat.workspaceId,
                              {
                                ...chat.assistant,
                                scope:
                                  chat.scope == "private"
                                    ? "private"
                                    : "public",
                              }
                            );
                            setMessageInput("");
                          });
                        }
                      }}
                    >
                      <IconSend size="24" />
                    </ActionIcon>
                  </Tooltip>
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
                              if (prompt.variables.length > 0) {
                                setNewMessageInput(newMessageInput);
                                setPromptContent(prompt.content);
                                setPromptVariables(prompt.variables);
                                setPromptVariablesOpened(true);
                              } else {
                                setMessageInput(
                                  newMessageInput + prompt.content
                                );
                                setSearchTerm("");
                              }
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
            </Stack>
          )}
        </Stack>
      )}
    </>
  );
}
