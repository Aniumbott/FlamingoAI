import * as Mongoose from "mongoose";
import {
  Accordion,
  AccordionControl,
  AccordionPanel,
  ActionIcon,
  Center,
  Divider,
  Group,
  Menu,
  ScrollArea,
  Text,
  rem,
} from "@mantine/core";
import {
  IconAlignJustified,
  IconCaretRightFilled,
  IconDots,
  IconFolderFilled,
  IconFolderOpen,
  IconFolderPlus,
  IconPlus,
  IconSortAscending,
  IconSortAscendingLetters,
  IconSortDescending,
  IconSortDescendingLetters,
} from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import style from "../../RightPanel/RightPanel.module.css";
import { createChat, getChats } from "@/app/controllers/chat";
import { IChatDocument } from "@/app/models/Chat";
import { IChatFolderDocument } from "@/app/models/ChatFolder";
import { createChatFolder, getChatFolders } from "@/app/controllers/folders";
import { ObjectId } from "mongodb";
import { useHover } from "@mantine/hooks";
const chats: Chats = {
  title: "Chats",
  content: [
    {
      id: "1jkjhhhjkh",
      type: "folder",
      title: "Folder 1",
      scope: "shared",
      content: [
        {
          id: "1u89jij",
          type: "chat",
          title: "Prompt 1",
          scope: "shared",
          content: "This is the content of prompt 1",
        },
        {
          id: "2jjginou9",
          type: "folder",
          title: "Folder 2",
          scope: "shared",
          content: [
            {
              id: "1jbuiujoij",
              type: "prompt",
              title: "Prompt 2",
              scope: "shared",
              content: "This is the content of prompt 2",
            },
          ],
        },
      ],
    },
    {
      id: "1jkjhhhjkh",
      type: "folder",
      title: "Folder 2",
      scope: "personal",
      content: [
        {
          id: "1u89jij",
          type: "prompt",
          scope: "personal",

          title: "Prompt 1",
          content: "This is the content of prompt 1",
        },
        {
          id: "2jjginou9",
          type: "folder",
          scope: "personal",

          title: "Folder 2",
          content: [
            {
              id: "1jbuiujoij",
              type: "prompt",
              title: "Prompt 2",
              scope: "personal",

              content: "This is the content of prompt 2",
            },
          ],
        },
      ],
    },
    {
      id: "1u89jij",
      type: "prompt",
      scope: "personal",

      title: "Prompt 1",
      content: "This is the content of prompt 1",
    },
    {
      id: "2jjginou9",
      type: "folder",
      scope: "personal",

      title: "Folder 2",
      content: [
        {
          id: "1jbuiujoij",
          type: "prompt",
          title: "Prompt 2",
          scope: "personal",

          content: "This is the content of prompt 2",
        },
      ],
    },
  ],
};
// type AccordionItem = {
//   id: string;
//   title: string;
//   content: any[];
// };

interface ChatFolder {
  name: string;
  createdBy: string;
  workspaceId: string;
  scope: string;
  subFolders: ChatFolder[];
  chats: IChatDocument[];
}

interface Chats {
  title: string;
  content: ChatItem[];
}
interface ChatItem {
  id: string;
  type: string;
  title: string;
  scope: "personal" | "shared";
  content: string | ChatItem[];
}

const PersonalChats = () => {
  const [publicChats, setPublicChats] = useState<IChatDocument[]>([]);
  const [privateChats, setPrivateChats] = useState<IChatDocument[]>([]);
  const [publicFolders, setPublicFolders] = useState<IChatFolderDocument[]>([]);
  const [privateFolders, setPrivateFolders] = useState<IChatFolderDocument[]>(
    []
  );

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setPublicChats((await getChats("public")).chats);
        setPrivateChats((await getChats("private")).chats);
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      }
    };

    console.log("fetching chats");
    fetchChats();
  }, []);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        setPublicFolders((await getChatFolders("public")).chatFolder);
        setPrivateFolders((await getChatFolders("private")).chatFolder);
      } catch (error) {
        console.error("Failed to fetch folders:", error);
      }
    };
    console.log("fetching folders");
    fetchFolders();
  }, []);

  const [personalChats, setPersonalChats] = useState<Chats>({
    title: "PERSONAL",
    content: [],
  });
  const [sharedChats, setSharedChats] = useState<Chats>({
    title: "SHARED",
    content: [],
  });

  useEffect(() => {
    const filterChats = (
      chats: ChatItem[],
      scope: "personal" | "shared"
    ): ChatItem[] => {
      return chats
        .filter((chat) => chat.scope === scope)
        .map((chat) => ({
          ...chat,
          content:
            chat.type === "folder"
              ? filterChats(chat.content as ChatItem[], scope)
              : chat.content,
        }));
    };

    const personalChatItems = filterChats(chats.content, "personal");
    const sharedChatItems = filterChats(chats.content, "shared");

    setPersonalChats({ ...personalChats, content: personalChatItems });
    setSharedChats({ ...sharedChats, content: sharedChatItems });
  }, []);
  useEffect(() => {
    console.log("privateChats", privateChats);
    console.log("publicChats", publicChats);
  }, [privateChats, publicChats]);

  return (
    <ScrollArea scrollbarSize={3} pb={"10"}>
      {/* <div className="text-lg font-bold">Public Folders</div>
      {publicFolders.length > 0 &&
        publicFolders.map((folder, key) => <div key={key}>{folder.name}</div>)}
      <div className="text-lg font-bold">Private Folders</div>
      {privateFolders.length > 0 &&
        privateFolders.map((folder, key) => <div key={key}>{folder.name}</div>)}

      <div className="text-lg font-bold">Public Chats</div>
      {publicChats.length > 0 &&
        publicChats.map((chat, key) => <div key={key}>{chat.name}</div>)}
      <div className="text-lg font-bold">Private Chats</div>
      {privateChats.length > 0 &&
        privateChats.map((chat, key) => <div key={key}>{chat.name}</div>)} */}

      <Accordion
        chevronPosition="left"
        className={style.parent}
        classNames={{ chevron: style.chevron }}
        chevron={<IconCaretRightFilled className={style.icon} />}
      >
        <Accordion.Item value={sharedChats.title} key={sharedChats.title}>
          <Accordion.Control>
            <AccordianLabel title={"SHARED"} scope="public" />
          </Accordion.Control>
          <AccordionPanel>
            {/* {sharedChats.content.map((subItem, subIndex) => {
              if (subItem.type == "folder")
                return (
                  <div key={subIndex}>
                    <Accordion
                      chevronPosition="left"
                      classNames={{ chevron: style.chevron }}
                      chevron={<IconCaretRightFilled className={style.icon} />}
                    >
                      <FolderItem item={subItem} />
                    </Accordion>
                  </div>
                );
              else
                return (
                  <div key={subIndex}>
                     <ChatItem item={subItem} /> 
                  </div>
                );
            })} */}
            {publicFolders.map((folder, key) => (
              <Accordion
                chevronPosition="left"
                classNames={{ chevron: style.chevron }}
                chevron={<IconCaretRightFilled className={style.icon} />}
                key={key}
              >
                <FolderItem folder={folder} scope={"public"} />
              </Accordion>
            ))}
            {publicChats.map((chat, key) => (
              <ChatItem item={chat} key={key} />
            ))}
          </AccordionPanel>
        </Accordion.Item>

        <Accordion.Item value={"PERSONAL"} key={"PERSONAL"}>
          <AccordionControl>
            <AccordianLabel title={"PERSONAL"} scope="private" />
          </AccordionControl>
          <AccordionPanel>
            {/* {personalChats.content.map((subItem, subIndex) => {
              if (subItem.type == "folder")
                return (
                  <div key={subIndex}>
                    <Accordion
                      chevronPosition="left"
                      classNames={{ chevron: style.chevron }}
                      chevron={<IconCaretRightFilled className={style.icon} />}
                    >
                      <FolderItem item={subItem} />
                    </Accordion>
                  </div>
                );
              else
                return (
                  <div key={subIndex}>
                    <ChatItem item={subItem} />
                  </div>
                );
            })} */}
            {privateFolders.map((folder, key) => (
              <Accordion
                chevronPosition="left"
                classNames={{ chevron: style.chevron }}
                chevron={<IconCaretRightFilled className={style.icon} />}
                key={key}
              >
                <FolderItem folder={folder} scope={"private"} />
              </Accordion>
            ))}
            {privateChats.map((chat, key) => (
              <ChatItem item={chat} key={key} />
            ))}
          </AccordionPanel>
        </Accordion.Item>
      </Accordion>
    </ScrollArea>
  );
};

const newChat = async (
  scope: "private" | "public",
  parentFolder: Mongoose.Types.ObjectId | null
) => {
  console.log("creating new chat");
  const res = await createChat(scope, parentFolder);
  console.log("res", res);
};

const newFolder = async (
  scope: "public" | "private",
  parentFolder: Mongoose.Types.ObjectId | null
) => {
  console.log("creating new folder");
  const res = await createChatFolder(scope, parentFolder);
  console.log("res", res);
};

const AccordianLabel = (props: {
  title: string;
  scope: "private" | "public";
}) => {
  return (
    <Group
      wrap="nowrap"
      justify="space-between"
      grow
      preventGrowOverflow={false}
    >
      <Text size="sm" fw={600}>
        {props.title}
      </Text>
      <Group wrap="nowrap" grow gap={2} align="center">
        <ActionIcon
          size="sm"
          variant="subtle"
          aria-label="Sort"
          color="#9CA3AF"
          style={{
            "--ai-hover-color": "white",
          }}
          onClick={(event) => {
            event.stopPropagation();
            // Add any additional logic for the ActionIcon click here
          }}
        >
          <PromptMenu />
        </ActionIcon>
        <ActionIcon
          size="sm"
          variant="subtle"
          aria-label="Sort"
          color="#9CA3AF"
          style={{
            "--ai-hover-color": "white",
            "--ai-hover": "#047857",
          }}
          onClick={(event) => {
            event.stopPropagation();
            newFolder(props.scope,null);
            // Add any additional logic for the ActionIcon click here
          }}
        >
          <IconFolderPlus size={"1rem"} />
        </ActionIcon>
        <ActionIcon
          size="sm"
          variant="subtle"
          aria-label="Sort"
          color="#9CA3AF"
          style={{
            "--ai-hover-color": "white",
            "--ai-hover": "#047857",
          }}
          onClick={(event) => {
            event.stopPropagation();
            newChat(props.scope, null);
            // Add any additional logic for the ActionIcon click here
          }}
        >
          <IconPlus size={"1rem"} />
        </ActionIcon>
      </Group>
    </Group>
  );
};

const FolderLabel = (props: {
  folder: IChatFolderDocument;
  scope: "public" | "private";
  isOpened: boolean;
  isHovered: boolean;
}) => {
  return (
    // <div className="flex justify-start items-center">
    <Group
      wrap="nowrap"
      justify="space-between"
      preventGrowOverflow={false}
    >
      <Group wrap="nowrap" gap={2} align="center">
        {props.isOpened ? (
          <IconFolderOpen
            style={{
              width: "1rem",
              height: "1rem",
              color: "var(--mantine-color-yellow-3)",
            }}
          />
        ) : (
          <IconFolderFilled
            style={{
              width: "1rem",
              height: "1rem",
              color: "var(--mantine-color-yellow-3)",
            }}
          />
        )}
        <Text size="sm" w={100} ml={8} truncate="end" >
          {props.folder.name} {" "}
          {props.folder._id.slice(-2)}
        </Text>
      </Group>
      {props.isHovered && (
        <Group wrap="nowrap" gap={5} align="center">
          <ActionIcon
          size="sm"
          variant="subtle"
          aria-label="Sort"
          color="#9CA3AF"
          style={{
            "--ai-hover-color": "white",
            "--ai-hover": "#047857",
          }}
          onClick={(event) => {
            event.stopPropagation();
            newFolder(props.scope, props.folder._id);
            // Add any additional logic for the ActionIcon click here
          }}
        >
          <IconFolderPlus size={"1rem"} />
        </ActionIcon>
          <ActionIcon
            size="sm"
            variant="subtle"
            aria-label="Sort"
            color="#9CA3AF"
            style={{
              "--ai-hover-color": "white",
              "--ai-hover": "#047857",
            }}
            onClick={(event) => {
              event.stopPropagation();
              newChat(props.scope, props.folder._id);
              // Add any additional logic for the ActionIcon click here
            }}
          >
            <IconPlus size={"1rem"} />
          </ActionIcon>
          <ActionIcon
            size="sm"
            variant="subtle"
            aria-label="Sort"
            color="#9CA3AF"
            style={{
              "--ai-hover-color": "white",
            }}
            onClick={(event) => {
              event.stopPropagation();
              // Add any additional logic for the ActionIcon click here
            }}
          >
            <PromptMenu />
          </ActionIcon>
        </Group>
      )}
    </Group>
  );
};

const FolderItem = (props: {
  folder: IChatFolderDocument;
  scope: "public" | "private";
}) => {
  const { folder, scope } = props;
  const [isOpened, setIsOpened] = useState(false);
  const { ref, hovered } = useHover();
  return (
    <>
      <Accordion.Item value={folder._id}>
        <div ref={ref}>
          <Accordion.Control onClick={() => setIsOpened(!isOpened)}>
            <FolderLabel
              folder={folder}
              scope={scope}
              isHovered={hovered}
              isOpened={isOpened}
            />
          </Accordion.Control>
        </div>

        <Accordion.Panel>
          {folder.subFolders?.length > 0 && folder.subFolders.map((subFolder, subIndex) => (
            <div key={subIndex}>
              <Accordion
                chevronPosition="left"
                classNames={{ chevron: style.chevron }}
                chevron={<IconCaretRightFilled className={style.icon} />}
              >
                <FolderItem
                  folder={subFolder as IChatFolderDocument}
                  scope={scope}
                />
              </Accordion>
            </div>
          ))}
          { folder.chats?.length > 0 && folder.chats.map((chat, chatIndex) => (
            <div key={chatIndex}>
              <ChatItem item={chat as IChatDocument} />
            </div>
          ))}

          {/* {Array.isArray(folder.content) &&
            item.content.map((subItem, subIndex) => {
              if (subItem.type == "folder")
                return (
                  <div key={subIndex}>
                    <Accordion
                      chevronPosition="left"
                      classNames={{ chevron: style.chevron }}
                      chevron={<IconCaretRightFilled className={style.icon} />}
                    >
                      <FolderItem item={subItem} />
                    </Accordion>
                  </div>
                );
              else
                return (
                  <div key={subIndex}> <ChatItem item={subItem} /> </div>
                );
            })} */}
        </Accordion.Panel>
      </Accordion.Item>
    </>
  );
};

// const PromptItem = (props: { item: AccordionItem }) => {
//   const { item } = props;
//   return (
//     <>
//       <div className={style.prompt}>
//         <IconBulbFilled
//           style={{
//             width: "1rem",
//             height: "1rem",
//             color: "var(--mantine-color-teal-3)",
//           }}
//         />
//         <Text size="sm" style={{ marginLeft: "0.5rem" }}>
//           {item.title}
//         </Text>
//       </div>
//     </>
//   );
// };

const ChatItem = (props: { item: IChatDocument }) => {
  const { item } = props;
  return (
    <>
      <div className={style.prompt}>
        <IconAlignJustified
          color="gray"
          style={{
            width: "1rem",
            height: "1rem",
          }}
        />
        <Text size="sm" w={150} truncate="end" ml={8}>
          {item.name}{" "}{item._id.slice(-4)}
        </Text>
      </div>
    </>
  );
};
const PromptMenu = () => {
  return (
    <Menu>
      <Menu.Target>
        <IconDots style={{ width: "70%", height: "70%" }} stroke={1.5} />
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Sort</Menu.Label>
        <Menu.Item
          leftSection={
            <IconSortAscendingLetters
              style={{ width: rem(14), height: rem(14) }}
            />
          }
        >
          Name A-Z
        </Menu.Item>
        <Menu.Item
          leftSection={
            <IconSortDescendingLetters
              style={{ width: rem(14), height: rem(14) }}
            />
          }
        >
          Name Z-A
        </Menu.Item>
        <Menu.Item
          leftSection={
            <IconSortAscending style={{ width: rem(14), height: rem(14) }} />
          }
        >
          Oldest First
        </Menu.Item>
        <Menu.Item
          leftSection={
            <IconSortDescending style={{ width: rem(14), height: rem(14) }} />
          }
        >
          Newest First
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
export default PersonalChats;
