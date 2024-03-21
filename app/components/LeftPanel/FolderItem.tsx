import { Accordion, Text } from "@mantine/core";
import {
  IconCaretRightFilled,
  IconFolderOpen,
  IconFolderFilled,
} from "@tabler/icons-react";
import { IChatDocument } from "@/app/models/Chat";
import { IChatFolderDocument } from "@/app/models/ChatFolder";
import ChatItem from "./ChatItem";
import style from "../RightPanel/RightPanel.module.css";

export default function FolderItem(props: { folder: IChatFolderDocument }) {
  const { folder } = props;
  return (
    <>
      <Accordion.Item value={folder._id}>
        <Accordion.Control>
          <FolderLabel title={folder.name} isOpened={false} />
        </Accordion.Control>

        <Accordion.Panel>
          {folder.subFolders.map((subFolder, subIndex) => (
            <div key={subIndex}>
              <Accordion
                chevronPosition="left"
                classNames={{ chevron: style.chevron }}
                chevron={<IconCaretRightFilled className={style.icon} />}
              >
                <div>{subFolder.toString()}</div>
                <FolderItem folder={subFolder as IChatFolderDocument} />
              </Accordion>
            </div>
          ))}
          {folder.chats.map((chat, chatIndex) => (
            <div key={chatIndex}>
              <div>{chat.toString()}</div>
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
}

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
