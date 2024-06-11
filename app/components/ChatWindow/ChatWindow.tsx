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
  Affix,
  SegmentedControl,
  Center,
  Select,
  Tooltip,
  HoverCard,
  Card,
} from "@mantine/core";
import {
  IconBuilding,
  IconInfoCircle,
  IconLayoutSidebarLeftExpand,
  IconLayoutSidebarRightExpand,
  IconRefresh,
  IconSend,
  IconSettings,
  IconShare,
} from "@tabler/icons-react";
import {
  Protect,
  auth,
  useAuth,
  useOrganization,
  useUser,
} from "@clerk/nextjs";

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
import { useMediaQuery, useScrollIntoView } from "@mantine/hooks";
import { ICommentDocument } from "@/app/models/Comment";
import ForkChatModal from "./Modals/ForkChatModal";
import { getAllPrompts } from "@/app/controllers/prompt";
import { IPromptDocument } from "@/app/models/Prompt";
import PromptModal from "@/app/components/RightPanel/Modals/PromptModal";
import PromptVariableModal from "@/app/components/RightPanel/Modals/PromptVariableModal";
import ShareChatModal from "@/app/components/ChatWindow/Modals/ShareChatModal";
import ErrorPage from "./ErrorPage/ErrorPage";
import SettingsModal from "./Modals/SettingsModal";
import { usePathname, useRouter } from "next/navigation";
import OnlineUsers from "./OnlineUsers";
import MessageInput from "./MessageInput";

export default function ChatWindow(props: {
  currentChatId: string;
  leftOpened: boolean;
  toggleLeft: () => void;
  toggleRight: () => void;
}) {
  const { currentChatId, leftOpened, toggleLeft, toggleRight } = props;
  const { organization } = useOrganization();
  const { userId } = useAuth();
  const { colorScheme } = useMantineColorScheme();
  const { scrollIntoView, targetRef, scrollableRef } = useScrollIntoView<
    HTMLDivElement,
    HTMLDivElement
  >();
  const [chat, setChat] = useState<any>({
    name: "",
    messages: [],
    participants: [],
    workspaceId: "",
    _id: "",
  });
  const [participants, setParticipants] = useState<any>([]);
  const [messageInput, setMessageInput] = useState("");
  const [forkMessage, setForkMessage] = useState<any>(null);
  const [prompts, setPrompts] = useState<IPromptDocument[]>([]);
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const filteredPrompts = prompts?.filter((prompt) => {
    return prompt.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const [shareChatOpened, setShareChatOpened] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);

  function isViewOnly(chat: any) {
    const ans =
      (chat?.createdBy !== userId &&
        chat?.memberAccess?.find((m: any) => m.userId === userId)?.access ===
          "view") ||
      (chat?.createdBy !== userId &&
        chat?.scope === "viewOnly" &&
        chat?.memberAccess?.find((m: any) => m.userId === userId)?.access !==
          "edit") ||
      (chat?.createdBy !== userId &&
        chat?.scope === "public" &&
        chat?.memberAccess?.find((m: any) => m.userId === userId)?.access ===
          "viewOnly");
    return ans;
  }

  useEffect(() => {
    // console.log("chat", chat);
    socket.on("refreshChatWindow", () => {
      console.log("refreshing chat");
      getChat(currentChatId, organization?.id || "", userId || "").then(
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
        (await organization?.getMemberships())?.map((member: any) => {
          return { ...member.publicUserData, role: member.role };
        }) ?? [];
      setParticipants(res);
    };
    fetchParticipants();
  }, [organization?.membersCount]);

  useEffect(() => {
    if (participants) {
      const user = participants.find(
        (participant: any) => participant.userId == userId
      );
      if (user) {
        setIsAllowed(
          user.userId == chat?.createdBy || user.role == "org:admin"
        );
      }
    }
  }, [participants, chat]);

  useEffect(() => {
    setMessageInput("");

    if (currentChatId != "") {
      socket.emit("joinChatRoom", currentChatId, userId || "");
      const getCurrentChat = async () => {
        return await getChat(
          currentChatId,
          organization?.id || "",
          userId || ""
        );
      };

      getCurrentChat().then((res) => {
        setChat(res.chats?.[0]);
        setLoading(false);
      });

      getAllPrompts(organization?.id || "", userId || "").then((res) => {
        setPrompts(res.prompts);
      });
    }
  }, [currentChatId]);

  useEffect(() => {
    socket.on("refreshPrompts", () => {
      getAllPrompts(organization?.id || "", userId || "").then((res) => {
        setPrompts(res.prompts);
      });
    });

    return () => {
      socket.off("refreshPrompts");
    };
  }, []);

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
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMediaQuery(`(max-width: 48em)`);

  return (
    <>
      {!chat ? (
        <Affix top={0} left={0} right={0} bottom={0} zIndex={1000} bg="dark">
          <ErrorPage />
        </Affix>
      ) : (
        <Stack gap={0} h={"100%"} justify="space-between" w="100%" mr={20}>
          {/* <Group gap={30} justify="space-between" py={5} px={10}> */}
          <Box
            hiddenFrom="sm"
            py="xs"
            px="md"
            className="w-full flex flex-row justify-between"
            style={{
              background:
                colorScheme === "dark"
                  ? "var(--mantine-color-dark-8)"
                  : "var(--mantine-color-gray-1)",
            }}
          >
            <Tooltip label="Expand panel" fz="xs" position="right">
              <ActionIcon
                variant="subtle"
                color="grey"
                aria-label="Expand panel"
                onClick={toggleLeft}
              >
                <IconLayoutSidebarLeftExpand
                  style={{ width: "90%", height: "90%" }}
                  stroke={1.5}
                />
              </ActionIcon>
            </Tooltip>
            <Title order={4} mr={10}>
              TeamGPT
            </Title>
            <Tooltip label="Expand panel" fz="xs" position="right">
              <ActionIcon
                variant="subtle"
                color="grey"
                aria-label="Expand panel"
                onClick={toggleRight}
              >
                <IconLayoutSidebarRightExpand
                  style={{ width: "90%", height: "90%" }}
                  stroke={1.5}
                />
              </ActionIcon>
            </Tooltip>
          </Box>
          <div
            className="w-full flex flex-row justify-start p-1"
            style={{
              background:
                colorScheme === "dark"
                  ? "var(--mantine-color-dark-8)"
                  : "var(--mantine-color-gray-1)",
            }}
          >
            {!leftOpened ? (
              <Box
                visibleFrom="sm"
                className="flex flex-row items-center justify-between ml-2"
              >
                <Title order={4} mr={10}>
                  TeamGPT
                </Title>
                <Tooltip label="Expand panel" fz="xs" position="right">
                  <ActionIcon
                    variant="subtle"
                    color="grey"
                    aria-label="Expand panel"
                    onClick={toggleLeft}
                  >
                    <IconLayoutSidebarLeftExpand
                      style={{ width: "90%", height: "90%" }}
                      stroke={1.5}
                    />
                  </ActionIcon>
                </Tooltip>
              </Box>
            ) : null}
            <Group justify="space-between" px={"md"} w={"100%"}>
              <Group gap="sm">
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
              <Group gap="sm" p={3}>
                <OnlineUsers
                  participants={participants}
                  chatId={currentChatId}
                />

                <Tooltip label="Share chat" fz="sm">
                  <ActionIcon
                    variant="subtle"
                    color="grey"
                    onClick={() => setShareChatOpened(true)}
                  >
                    <IconShare size={20} />
                  </ActionIcon>
                </Tooltip>
                {isAllowed ? (
                  <Tooltip label="Chat settings" fz="sm">
                    <ActionIcon
                      variant="subtle"
                      color="grey"
                      onClick={() => setSettingsOpen(true)}
                    >
                      <IconSettings size={20} />
                    </ActionIcon>
                  </Tooltip>
                ) : null}
              </Group>
            </Group>
            {shareChatOpened && (
              <ShareChatModal
                organizationName={organization?.name || ""}
                opened={shareChatOpened}
                setOpened={setShareChatOpened}
                chat={chat}
                setChat={setChat}
                members={participants}
                userId={userId || ""}
              />
            )}
            {settingsOpen && (
              <SettingsModal
                opened={settingsOpen}
                setOpened={setSettingsOpen}
                chat={chat}
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

          {/* <Divider /> */}

          <Paper
            h={"70vh"}
            w={"100%"}
            pt="xs"
            radius={0}
            style={{
              alignItems: "center",
              overflowY: "scroll",
              flexGrow: "1",
              margin: "0px 100px 0px 0px",
              display: "flex",
              flexDirection: "column",
              alignContent: "center",
              background:
                colorScheme === "dark"
                  ? "var(--mantine-color-dark-7)"
                  : "var(--mantine-color-gray-0)",
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
                <Card w="calc(min(90vw,500px))" radius="md">
                  <SegmentedControl
                    orientation={isMobile ? "vertical" : "horizontal"}
                    disabled={!isAllowed}
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
                    // variant="light"
                    disabled={!isAllowed}
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
                </Card>
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
                  <div
                    key={message._id}
                    className="w-full mb-3 flex items-center justify-center max-w-[1300px]"
                  >
                    <MessageItem
                      message={message}
                      participants={participants}
                      userId={userId || ""}
                      orgId={organization?.id || ""}
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
              style={{
                background:
                  colorScheme == "dark"
                    ? "var(--mantine-color-dark-8)"
                    : "var(--mantine-color-gray-1)",
              }}
            >
              <Card w="80%" my="lg" mx="10%" radius="md">
                <Group justify="space-between" px="md" my="sm">
                  <Text>This chat has been archived.</Text>
                  <Group gap={15}>
                    <Button
                      disabled={!isAllowed}
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
                      disabled={!isAllowed}
                      variant="default"
                      onClick={() => {
                        deleteChat(chat)
                          .then((res) => {
                            console.log(res);
                          })
                          .then(() => {
                            if (pathname.split("/")[3] == chat._id) {
                              router.push(
                                pathname.split("/").slice(0, 3).join("/")
                              );
                            }
                          });
                      }}
                    >
                      Delete
                    </Button>
                  </Group>
                </Group>
              </Card>
            </div>
          ) : isViewOnly(chat) ? (
            <div
              style={{
                background:
                  colorScheme == "dark"
                    ? "var(--mantine-color-dark-8)"
                    : "var(--mantine-color-gray-1)",
              }}
            >
              <Card w="80%" my="lg" mx="10%" radius="md">
                <Text ta="center" my="sm">
                  You can only view this chat. Ask the owner to grant you
                  access.
                </Text>
              </Card>
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
              <Combobox.Target>
                <Box>
                  <MessageInput
                    userId={userId || ""}
                    currentChatId={currentChatId}
                    chat={chat}
                    processing={processing}
                    setProcessing={setProcessing}
                    setSearchTerm={setSearchTerm}
                    combobox={combobox}
                  />
                </Box>
              </Combobox.Target>

              <Combobox.Dropdown>
                <Combobox.Options>
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
                              setMessageInput(newMessageInput + prompt.content);
                              setSearchTerm("");
                            }
                          }}
                        >
                          <Text>{prompt.name}</Text>
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
      )}
    </>
  );
}
