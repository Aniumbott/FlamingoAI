// Modules
import { use, useEffect, useState } from "react";
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
import ChatItem from "./ChatItem";
import FolderItem, { newFolder } from "./FolderItem";
import {
  getIndependentChats,
  createChat,
  sortItems,
} from "@/app/controllers/chat";
import { IChatDocument } from "@/app/models/Chat";
import { IChatFolderDocument } from "@/app/models/ChatFolder";
import { getChatFolders } from "@/app/controllers/folders";
import SortMenu from "./Menu/SortMenu";
import style from "../RightPanel/RightPanel.module.css";
import { useAuth } from "@clerk/nextjs";
import { socket } from "@/socket";

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

const GeneralChats = (props: { members: any[] }) => {
  const { members } = props;
  const [publicChats, setPublicChats] = useState<IChatDocument[]>([]);
  const [privateChats, setPrivateChats] = useState<IChatDocument[]>([]);
  const [publicFolders, setPublicFolders] = useState<IChatFolderDocument[]>([]);
  const [privateFolders, setPrivateFolders] = useState<IChatFolderDocument[]>(
    []
  );
  const { userId, orgId } = useAuth();
  const [sort, setSort] = useState<string>("New");

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setPublicChats(
          (await getIndependentChats("public", userId || "", orgId || "")).chats
        );
        setPrivateChats(
          (await getIndependentChats("private", userId || "", orgId || ""))
            .chats
        );
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      }
    };

    const fetchFolders = async () => {
      try {
        setPublicFolders(
          (await getChatFolders("public", userId || "", orgId || "")).chatFolder
        );
        setPrivateFolders(
          (await getChatFolders("private", userId || "", orgId || ""))
            .chatFolder
        );
      } catch (error) {
        console.error("Failed to fetch folders:", error);
      }
    };

    const fetchChatsAndFolders = () => {
      fetchChats().then(() => fetchFolders());
    };

    fetchChatsAndFolders();

    socket.on("newChat", (chat) => {
      // console.log("newChat", chat);
      fetchChatsAndFolders();
    });

    socket.on("newChatFolder", (folder) => {
      // console.log("newChatFolder", folder);
      fetchChatsAndFolders();
    });

    return () => {
      socket.off("newChat", fetchChatsAndFolders);
      socket.off("newChatFolder", fetchChatsAndFolders);
    };
  }, []);

  const handleSort = () => {
    console.log("sorting items", sort);
    if (publicChats.length > 0) setPublicChats(sortItems(publicChats, sort));
    if (privateChats.length > 0) setPrivateChats(sortItems(privateChats, sort));
    if (publicFolders.length > 0)
      setPublicFolders(sortItems(publicFolders, sort));
    if (privateFolders.length > 0)
      setPrivateFolders(sortItems(privateFolders, sort));
    console.log("items sorted");
  };

  useEffect(() => {
    console.log("useeffect");
    handleSort();
  }, [sort]);

  return (
    // <ScrollArea scrollbarSize={3} pb={"10"}>
    <Accordion
      chevronPosition="left"
      className={style.parent}
      classNames={{ chevron: style.chevron }}
      chevron={<IconCaretRightFilled className={style.icon} />}
    >
      <Accordion.Item value={"SHARED"} key={"SHARED"}>
        <Accordion.Control>
          <AccordianLabel
            title={"SHARED"}
            scope="public"
            userId={userId || ""}
            workspaceId={orgId || ""}
            sort={sort}
            setSort={setSort}
          />
        </Accordion.Control>
        <AccordionPanel>
          <ScrollArea h="50vh" scrollbarSize={10} offsetScrollbars>
            {publicFolders?.map((folder, key) => (
              <Accordion
                chevronPosition="left"
                classNames={{ chevron: style.chevron }}
                chevron={<IconCaretRightFilled className={style.icon} />}
                key={key}
              >
                <FolderItem
                  folder={folder}
                  scope={"public"}
                  members={members}
                  userId={userId || ""}
                  workspaceId={orgId || ""}
                />
              </Accordion>
            ))}
            {publicChats?.map((chat, key) => (
              <ChatItem item={chat} key={key} members={members} />
            ))}
          </ScrollArea>
        </AccordionPanel>
      </Accordion.Item>

      <Accordion.Item value={"PERSONAL"} key={"PERSONAL"}>
        <AccordionControl>
          <AccordianLabel
            title={"PERSONAL"}
            scope="private"
            userId={userId || ""}
            workspaceId={orgId || ""}
            sort={sort}
            setSort={setSort}
          />
        </AccordionControl>
        <AccordionPanel>
          <ScrollArea h="50vh" scrollbarSize={10} offsetScrollbars>
            {privateFolders?.map((folder, key) => (
              <Accordion
                chevronPosition="left"
                classNames={{ chevron: style.chevron }}
                chevron={<IconCaretRightFilled className={style.icon} />}
                key={key}
              >
                <FolderItem
                  folder={folder}
                  scope={"private"}
                  members={members}
                  userId={userId || ""}
                  workspaceId={orgId || ""}
                />
              </Accordion>
            ))}
            {privateChats?.map((chat, key) => (
              <ChatItem item={chat} key={key} members={members} />
            ))}
          </ScrollArea>
        </AccordionPanel>
      </Accordion.Item>
    </Accordion>
    // </ScrollArea>
  );
};

const AccordianLabel = (props: {
  title: string;
  scope: "private" | "public";
  userId: string;
  workspaceId: string;
  sort: string;
  setSort: (sort: string) => void;
}) => {
  return (
    <Group wrap="nowrap" justify="space-between">
      <Text size="sm" fw={600}>
        {props.title}
      </Text>
      <Group
        wrap="nowrap"
        gap={5}
        align="center"
        onClick={(event) => event.stopPropagation()}
      >
        <SortMenu sort={props.sort} setSort={props.setSort} />
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
            newFolder(props.scope, null, props.userId, props.workspaceId);
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
            createChat(props.scope, null, props.userId, props.workspaceId);
            // Add any additional logic for the ActionIcon click here
          }}
        >
          <IconPlus size={"1rem"} />
        </ActionIcon>
      </Group>
    </Group>
  );
};

export default GeneralChats;
