// Modules
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionControl,
  AccordionPanel,
  ActionIcon,
  Group,
  ScrollArea,
  Text,
} from "@mantine/core";
import {
  IconCaretRightFilled,
  IconFolderPlus,
  IconPlus,
} from "@tabler/icons-react";

// Components
import ChatItem, { newChat } from "./ChatItem";
import FolderItem, { newFolder } from "./FolderItem";
import { getIndependentChats } from "@/app/controllers/chat";
import { IChatDocument } from "@/app/models/Chat";
import { IChatFolderDocument } from "@/app/models/ChatFolder";
import { getChatFolders } from "@/app/controllers/folders";
import PromptMenu from "./Menu/PromptMenu";
import style from "../RightPanel/RightPanel.module.css";

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
        setPublicChats((await getIndependentChats("public")).chats);
        setPrivateChats((await getIndependentChats("private")).chats);
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      }
    };

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
    // console.log("privateChats", privateChats);
    // console.log("publicChats", publicChats);
  }, [privateChats, publicChats]);

  return (
    <ScrollArea scrollbarSize={3} pb={"10"}>
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
            "--ai-hover": "#047857",
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
            newFolder(props.scope, null);
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

export default PersonalChats;
