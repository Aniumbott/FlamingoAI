// Modules
import { useState } from "react";
import { useHover } from "@mantine/hooks";
import Mongoose from "mongoose";
import { Accordion, Text, Group, ActionIcon } from "@mantine/core";
import {
  IconCaretRightFilled,
  IconFolderOpen,
  IconFolderFilled,
  IconFolderPlus,
  IconPlus,
} from "@tabler/icons-react";
import { IChatDocument } from "@/app/models/Chat";
import { IChatFolderDocument } from "@/app/models/ChatFolder";

// Components
import PromptMenu from "./Menu/PromptMenu";
import ChatItem, { newChat } from "./ChatItem";
import { createChatFolder } from "@/app/controllers/folders";
import style from "../RightPanel/RightPanel.module.css";

export const newFolder = async (
  scope: "public" | "private",
  parentFolder: Mongoose.Types.ObjectId | null
) => {
  console.log("creating new folder");
  const res = await createChatFolder(scope, parentFolder);
  console.log("res", res);
};

export default function FolderItem(props: {
  folder: IChatFolderDocument;
  scope: "public" | "private";
}) {
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
          {folder.subFolders?.length > 0 &&
            folder.subFolders.map((subFolder, subIndex) => (
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
          {folder.chats?.length > 0 &&
            folder.chats.map((chat, chatIndex) => (
              <div key={chatIndex}>
                <ChatItem item={chat as IChatDocument} />
              </div>
            ))}
        </Accordion.Panel>
      </Accordion.Item>
    </>
  );
}

const FolderLabel = (props: {
  folder: IChatFolderDocument;
  scope: "public" | "private";
  isOpened: boolean;
  isHovered: boolean;
}) => {
  return (
    // <div className="flex justify-start items-center">
    <Group wrap="nowrap" justify="space-between" preventGrowOverflow={false}>
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
        <Text size="sm" w={100} ml={8} truncate="end">
          {props.folder.name} {props.folder._id.slice(-2)}
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
