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
    console.log("personalChats", personalChats);
    console.log("sharedChats", sharedChats);
  }, [personalChats, sharedChats]);

  return (
    <ScrollArea scrollbarSize={0}>
      <Accordion
        chevronPosition="left"
        className={style.parent}
        classNames={{ chevron: style.chevron }}
        chevron={<IconCaretRightFilled className={style.icon} />}
      >
        <Accordion.Item value={sharedChats.title} key={sharedChats.title}>
          <Accordion.Control>
            <AccordianLabel title={sharedChats.title} />
          </Accordion.Control>
          <AccordionPanel>
            {sharedChats.content.map((subItem, subIndex) => {
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
            })}
          </AccordionPanel>
        </Accordion.Item>

        <Accordion.Item value={personalChats.title} key={personalChats.title}>
          <AccordionControl>
            <AccordianLabel title={personalChats.title} />
          </AccordionControl>
          <AccordionPanel>
            {personalChats.content.map((subItem, subIndex) => {
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
            })}
          </AccordionPanel>
        </Accordion.Item>
      </Accordion>
    </ScrollArea>
  );
};

const AccordianLabel = (props: { title: string }) => {
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
            // Add any additional logic for the ActionIcon click here
          }}
        >
          <IconPlus size={"1rem"} />
        </ActionIcon>
      </Group>
    </Group>
  );
};

const FolderLabel = (props: { title: string; isOpened: boolean }) => {
  return (
    <div className="flex justify-start items-center">
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
      <Text size="sm" style={{ marginLeft: "0.5rem" }}>
        {props.title}
      </Text>
    </div>
  );
};

const FolderItem = (props: { item: ChatItem }) => {
  const { item } = props;
  return (
    <>
      <Accordion.Item value={item.id}>
        <Accordion.Control>
          <FolderLabel title={item.title} isOpened={false} />
        </Accordion.Control>

        <Accordion.Panel>
          {Array.isArray(item.content) &&
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
                  <div key={subIndex}>
                    <ChatItem item={subItem} />
                  </div>
                );
            })}
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

const ChatItem = (props: { item: ChatItem }) => {
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
        <Text size="sm" style={{ marginLeft: "0.5rem" }}>
          {item.title}
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
