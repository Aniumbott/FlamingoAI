"use client";

import {
  OrganizationSwitcher,
  UserButton,
  UserProfile,
  useAuth,
  useOrganization,
  useUser,
} from "@clerk/nextjs";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  FileInput,
  List,
  SegmentedControl,
  Select,
  Stack,
  Table,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { dark } from "@clerk/themes";
import {
  IconExternalLink,
  IconEye,
  IconFileImport,
  IconLock,
  IconWorld,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { createChat } from "@/app/controllers/chat";
import { createMessage } from "@/app/controllers/message";
import {
  showLoadingNotification,
  showSuccessNotification,
} from "@/app/controllers/notification";
import { useListState } from "@mantine/hooks";
import { IAIModelDocument } from "@/app/models/AIModel";
import { constructSelectModels, getAIModels } from "@/app/controllers/aiModel";
import { model } from "mongoose";

export default function ImportPage() {
  const { colorScheme } = useMantineColorScheme();
  const [file, setFile] = useState<File | null>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [models, handleModels] = useListState<IAIModelDocument>([]);
  const [model, setModel] = useState<IAIModelDocument | null>(null);
  const [allScope, setAllScope] = useState<string>("private");
  const [selected, setSelected] = useState<any[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const { userId, orgId } = useAuth();
  const { organization } = useOrganization();
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    const fetchModels = async () => {
      const res = await getAIModels(orgId || "");
      handleModels.setState(res.aiModels);
    };
    fetchModels();
  }, []);

  useEffect(() => {
    setModel(models[0]);
  }, [models]);

  useEffect(() => {
    if (file) {
      new Response(file || "").json().then((conversations: any[]) => {
        // console.log(conversations);
        let chats: any = [];
        conversations.forEach((conversation: any) => {
          let chat = {
            id: conversation.id,
            selected: false,
            scope: allScope,
            chatId: "",
            name: conversation.title,
            createdAt: conversation.create_time,
            updatedAt: conversation.update_time,
            messages: [],
            aiModel: model?._id,
          };

          let messages: any = [];
          Object.keys(conversation.mapping).forEach((key) => {
            const message = conversation.mapping[key].message;
            if (
              message &&
              message.content &&
              message.content.content_type == "text" &&
              message.content.parts.length > 0 &&
              message.content.parts[0].length > 0 &&
              (message.author.role !== "system" ||
                message.metadata.is_user_system_message)
            ) {
              messages.push({
                content: message.content.parts[0],
                role: message.author.role,
                createdAt: message.create_time,
              });
            }
          });

          chat.messages = messages.sort(
            (a: any, b: any) => a.createdAt - b.createdAt
          );
          chats.push(chat);
        });
        setChats(chats);
      });
    } else {
      setChats([]);
    }
  }, [file]);

  useEffect(() => {
    if (allScope != "unset") {
      setChats(
        chats.map((chat) => {
          return {
            ...chat,
            scope: allScope,
          };
        })
      );
    }
  }, [allScope]);

  useEffect(() => {
    setChats(
      chats.map((chat) => {
        return {
          ...chat,
          aiModel: model?._id,
        };
      })
    );
  }, [model]);

  useEffect(() => {
    const getmembers = async () => {
      const userList =
        (await organization?.getMemberships())?.map((member: any) => {
          // console.log(member);
          return { ...member.publicUserData, role: member.role };
        }) ?? [];
      setMembers(userList);
    };
    getmembers();
  }, [organization?.membersCount]);

  useEffect(() => {
    setSelected(chats.filter((chat) => chat.selected && chat.chatId === ""));
    if (chats.some((chat) => chat.scope !== allScope)) {
      setAllScope("unset");
    }
    console.log(chats);
  }, [chats]);

  // useEffect(() => {
  //   console.log(conversation);
  // }, [conversation]);

  return (
    <>
      <header
        className="sticky top-0 h-16 mb-3 px-5 flex flex-row justify-between items-center"
        style={{
          zIndex: 1000,
          backgroundColor: "var(--mantine-color-body)",
          borderBottom: "1px solid var(--mantine-color-default-border)",
        }}
      >
        <div className="h-full flex flex-row items-center">
          <Title order={3} mr="xl">
            Flamingo.ai
          </Title>
          <OrganizationSwitcher
            hidePersonal
            createOrganizationUrl="/onboarding/"
            afterCreateOrganizationUrl="/workspace/:slug"
            afterSelectPersonalUrl="/user/:id"
            afterSelectOrganizationUrl="/workspace/:slug"
            appearance={{
              baseTheme: colorScheme === "dark" ? dark : undefined,
            }}
          />
        </div>
        <div>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              baseTheme: colorScheme === "dark" ? dark : undefined,
            }}
          />
        </div>
      </header>
      <Stack
        gap={10}
        my="xl"
        maw="50rem"
        mx="auto"
        style={{
          overflowY: "scroll",
        }}
      >
        <Card p="xl">
          <Title order={4} ta="center" mb="md">
            Import chats from OpenAI ChatGPT
          </Title>
          <List type="ordered" size="sm" mb="md">
            <List.Item>
              Login in <b>ChatGPT</b> at https://chat.openai.com/
            </List.Item>
            <List.Item>
              Click on your name on the left and select <b>Settings</b>.
            </List.Item>
            <List.Item>
              Click on <b>Data controls</b>.
            </List.Item>
            <List.Item>
              Click on <b>Export</b> and confirm.
            </List.Item>
            <List.Item>
              Look for email from OpenAI in your inbox called
              <b>ChatGPT - Your data export is ready</b>
            </List.Item>
            <List.Item>
              Click on the link <b>Download data export</b>
            </List.Item>
            <List.Item>Extract the archive contents</List.Item>
            <List.Item>
              Upload file called <b>conversations.json</b>
            </List.Item>
          </List>
          <FileInput
            clearable
            m="md"
            value={file}
            onChange={setFile}
            accept="application/json"
            placeholder="Upload conversation.json"
          />
          {/* <Text mt="md" ta="center" size="xs">
            All chats will be imported as <b>personal</b>, not shared with the
            team.
          </Text> */}
        </Card>
        {file && (
          <div className="w-full mt-10">
            <div className="flex flex-row items-center justify-between">
              <div>
                <Button
                  size="xs"
                  variant="subtle"
                  radius="md"
                  onClick={() => {
                    setChats(
                      chats.map((chat) => {
                        return {
                          ...chat,
                          selected: true,
                        };
                      })
                    );
                  }}
                >
                  Select all
                </Button>
                <Button
                  size="xs"
                  variant="subtle"
                  color="red"
                  radius="md"
                  onClick={() => {
                    setChats(
                      chats.map((chat) => {
                        return {
                          ...chat,
                          selected: false,
                        };
                      })
                    );
                  }}
                >
                  Deselect all
                </Button>
              </div>
              <Button
                size="xs"
                variant="filled"
                radius="md"
                onClick={() => {
                  let selectedChats = selected;
                  selectedChats.forEach(async (chat) => {
                    await ImportChat(
                      chat,
                      userId || "",
                      organization?.id || "",
                      members,
                      model
                    ).then((newChat) => {
                      chat.chatId = newChat._id;
                    });
                    setChats(
                      chats.map((c) => {
                        const updatedChat = selectedChats.find(
                          (chat) => chat.id === c.id
                        );
                        if (updatedChat) {
                          return updatedChat;
                        }
                        return c;
                      })
                    );
                  });
                }}
              >
                Import Selected
              </Button>
            </div>
            <Card mt="md" p="md">
              <div className="flex flex-row justify-between">
                <div className="flex flex-row mr-5  items-center">
                  <Text size="xs" mr={5}>
                    Import all as:
                  </Text>
                  <ScopeControl value={allScope} setValue={setAllScope} />
                  <Text size="xs" mr={5}>
                    Select Model:
                  </Text>
                  <Select
                    allowDeselect={false}
                    data={constructSelectModels(models)}
                    value={model?._id}
                    onChange={(e) => {
                      setModel(models.find((m) => m._id == e) || null);
                    }}
                  />
                </div>
                <div className="flex flex-row items-center">
                  <Badge variant="light" radius="sm">
                    {selected.length}/{chats.length} conversations are selected.
                  </Badge>
                </div>
              </div>
              <ChatsTable
                chats={chats}
                setChats={setChats}
                pathname={pathname}
                organization={organization}
                userId={userId || ""}
                members={members}
                model={model}
              />
            </Card>
          </div>
        )}
      </Stack>
    </>
  );
}

const ScopeControl = (props: {
  value: string;
  setValue: (value: string) => void;
}) => {
  const { value, setValue } = props;
  return (
    <SegmentedControl
      mr={10}
      value={value}
      onChange={(value) => setValue(value)}
      data={[
        {
          value: "private",
          label: (
            <>
              <IconLock size="20px" />
            </>
          ),
        },
        {
          value: "viewOnly",
          label: (
            <>
              <IconEye size="20px" />
            </>
          ),
        },
        {
          value: "public",
          label: (
            <>
              <IconWorld size="20px" />
            </>
          ),
        },
      ]}
    />
  );
};

const ChatsTable = (props: {
  chats: any[];
  pathname: string;
  userId: string;
  organization: any;
  members: any[];
  model: IAIModelDocument | null;
  setChats: (value: any) => void;
}) => {
  const { chats, pathname, userId, organization, members, setChats, model } =
    props;
  return (
    <Table mt={10} highlightOnHover verticalSpacing="sm">
      <Table.Tbody>
        {chats.map((chat, index) => (
          <Table.Tr key={index}>
            <Table.Td>
              <Checkbox
                checked={chat.selected}
                onChange={(e) => {
                  setChats(
                    chats.map((c, i) => {
                      if (i === index) {
                        return {
                          ...c,
                          selected: e.currentTarget.checked,
                        };
                      }
                      return c;
                    })
                  );
                }}
                disabled={chat.chatId !== ""}
              />
            </Table.Td>
            <Table.Td>
              <Text>{chat.name}</Text>
              <Text c="dimmed" size="xs">
                Created At:{" "}
                {new Date(chat.createdAt * 1000).toLocaleDateString()} and last
                updated on:{" "}
                {new Date(chat.updatedAt * 1000).toLocaleDateString()}
              </Text>
            </Table.Td>
            {/* <Table.Td>{chat.createdAt}</Table.Td>
            <Table.Td>{chat.updatedAt}</Table.Td> */}
            {chat.chatId === "" ? (
              <>
                <Table.Td>
                  <ScopeControl
                    value={chat.scope}
                    setValue={(value) => {
                      setChats(
                        chats.map((c, i) => {
                          if (i === index) {
                            return {
                              ...c,
                              scope: value,
                            };
                          }
                          return c;
                        })
                      );
                    }}
                  />
                </Table.Td>
                <Table.Td>
                  <Button
                    size="xs"
                    variant="subtle"
                    color="light"
                    leftSection={<IconFileImport size="20px" />}
                    onClick={() => {
                      ImportChat(
                        chat,
                        userId || "",
                        organization?.id || "",
                        members,
                        model
                      ).then((newChat) => {
                        setChats(
                          chats.map((c) => {
                            if (c === chat) {
                              return {
                                ...c,
                                chatId: newChat._id,
                              };
                            }
                            return c;
                          })
                        );
                      });
                    }}
                  >
                    Import
                  </Button>
                </Table.Td>
              </>
            ) : (
              <>
                <Table.Td>
                  <Badge variant="light" radius="xl" size="md">
                    OK
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Link
                    href={
                      pathname.split("/").slice(0, 3).join("/") +
                      "/" +
                      String(chat.chatId)
                    }
                    target="_blank"
                  >
                    <Button
                      size="xs"
                      variant="subtle"
                      color="light"
                      rightSection={<IconExternalLink size="20px" />}
                    >
                      View
                    </Button>
                  </Link>
                </Table.Td>
              </>
            )}
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};

async function ImportChat(
  chat: any,
  createdBy: string,
  workspaceId: string,
  members: any[],
  model: IAIModelDocument | null
) {
  const res = await createChat(
    chat.scope,
    null,
    createdBy,
    workspaceId,
    members,
    chat.name,
    { type: "text", text: "", pageId: null },
    model?._id
  );

  const notifications = showLoadingNotification("Loading Messages...");

  const messages = chat.messages;
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    await createMessage(createdBy, message.content, message.role, res.chat._id);
  }

  showSuccessNotification(notifications, "Chat Imported Successfully");

  return res.chat;
}
