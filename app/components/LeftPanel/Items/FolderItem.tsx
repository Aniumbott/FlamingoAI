// Modules
import { useState, useEffect } from "react";
import { useHover } from "@mantine/hooks";
import Mongoose from "mongoose";
import {
  Accordion,
  Text,
  Group,
  ActionIcon,
  TextInput,
  Tooltip,
} from "@mantine/core";
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
import PromptMenu from "../Menu/SortMenu";
import FolderFeatureMenu from "../Menu/FolderFeatureMenu";
import ChatItem from "./ChatItem";
import { createChatFolder, updateChatFolders } from "@/app/controllers/folders";
import { createChat } from "@/app/controllers/chat";
import style from "../LeftPanel.module.css";
import MoveChats from "../Modals/MoveItems/MoveItems";
import { usePathname, useRouter } from "next/navigation";

export const newFolder = async (
  scope: "public" | "private",
  parentFolder: Mongoose.Types.ObjectId | null,
  createdBy: string,
  workspaceId: string
) => {
  // console.log("creating new folder");
  const res = await createChatFolder(
    scope,
    parentFolder,
    createdBy,
    workspaceId
  );
  // console.log("res", res);
};

export default function FolderItem(props: {
  folder: IChatFolderDocument;
  scope: "public" | "private";
  members: any[];
  userId: string;
  workspaceId: string;
  allowPublic: boolean;
  allowPersonal: boolean;
}) {
  const {
    folder,
    scope,
    members,
    userId,
    workspaceId,
    allowPersonal,
    allowPublic,
  } = props;
  const [isOpened, setIsOpened] = useState(false);
  const { ref, hovered } = useHover();
  const [openMoveModal, setOpenMoveModal] = useState(false);
  props.members.find((member) => member.userId === userId)?.role ===
    "org:admin";
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
              userId={userId}
              workspaceId={workspaceId}
              setMoveModal={setOpenMoveModal}
              members={members}
              allowPublic={allowPublic}
              allowPersonal={allowPersonal}
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
                    members={members}
                    userId={props.userId}
                    workspaceId={props.workspaceId}
                    allowPersonal={allowPersonal}
                    allowPublic={allowPublic}
                  />
                </Accordion>
              </div>
            ))}
          {folder.chats?.length > 0 &&
            folder.chats.map((chat, chatIndex) => (
              <div key={chatIndex}>
                <ChatItem
                  item={chat as IChatDocument}
                  members={members}
                  allowPublic={allowPublic}
                  allowPersonal={allowPersonal}
                />
              </div>
            ))}
        </Accordion.Panel>
      </Accordion.Item>
      {openMoveModal && (
        <MoveChats
          opened={openMoveModal}
          setOpened={setOpenMoveModal}
          item={folder}
          allowPublic={allowPublic}
          allowPersonal={allowPersonal}
        />
      )}
    </>
  );
}

const FolderLabel = (props: {
  folder: IChatFolderDocument;
  scope: "public" | "private";
  isOpened: boolean;
  isHovered: boolean;
  userId: string;
  workspaceId: string;
  setMoveModal: (value: boolean) => void;
  members: any[];
  allowPublic: boolean;
  allowPersonal: boolean;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  let actionIconVisible = props.isHovered || menuOpen;
  const [rename, setRename] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    actionIconVisible = props.isHovered || menuOpen;
  }, [props.isHovered, menuOpen]);
  return (
    // <div className="flex justify-start items-center">
    <Group wrap="nowrap" justify="space-between" preventGrowOverflow={false}>
      <Group wrap="nowrap" gap={2} align="center">
        {props.isOpened ? (
          <IconFolderOpen
            style={{
              width: "1rem",
              height: "1rem",
              color: props.folder.folderColor || "#FFE066",
            }}
          />
        ) : (
          <IconFolderFilled
            style={{
              width: "1rem",
              height: "1rem",
              color: props.folder.folderColor || "#FFE066",
            }}
          />
        )}
        {rename ? (
          <TextInput
            autoFocus
            variant="filled"
            placeholder="Rename"
            onClick={(event) => {
              event.stopPropagation();
            }}
            onBlur={() => setRename(false)}
            onKeyDown={(event) => {
              event.stopPropagation();
              if (event.key === "Enter") {
                updateChatFolders(props.folder._id, {
                  name: event.currentTarget.value,
                }).then((res) => {
                  setRename(false);
                });
              } else if (event.key === " ") {
                event.preventDefault();
                event.currentTarget.value += " ";
              }
            }}
          />
        ) : (
          <Text size="sm" style={{ marginLeft: "0.1rem" }}>
            {props.folder.name}
          </Text>
        )}
      </Group>
      {!rename && actionIconVisible && (
        <Group wrap="nowrap" gap={5} align="center">
          <Tooltip label="Create new folder" fz="xs">
            <ActionIcon
              size="sm"
              variant="subtle"
              color="grey"
              onClick={(event) => {
                event.stopPropagation();
                newFolder(
                  props.scope,
                  props.folder._id,
                  props.userId,
                  props.workspaceId
                );
                // Add any additional logic for the ActionIcon click here
              }}
              disabled={
                props.scope === "public"
                  ? !props.allowPublic
                  : !props.allowPersonal
              }
            >
              <IconFolderPlus size={"1rem"} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Create new chat" fz="xs">
            <ActionIcon
              size="sm"
              variant="subtle"
              color="grey"
              onClick={(event) => {
                event.stopPropagation();
                createChat(
                  props.scope,
                  props.folder._id,
                  props.userId,
                  props.workspaceId,
                  props.members
                ).then((res: any) => {
                  router.push(
                    pathname.split("/").slice(0, 3).join("/") +
                      "/" +
                      res.chat._id
                  );
                });
              }}
              disabled={
                props.scope === "public"
                  ? !props.allowPublic
                  : !props.allowPersonal
              }
            >
              <IconPlus size={"1rem"} />
            </ActionIcon>
          </Tooltip>
          {/* <ActionIcon
            size="sm"
            // variant="unstyled"
            // aria-label="Sort"
            // color="#9CA3AF"
            // style={{
            //   "--ai-hover-color": "white",
            // }}
            
          > */}
          <FolderFeatureMenu
            folder={props.folder}
            scope={props.scope}
            workspaceId={props.workspaceId}
            userId={props.userId}
            open={menuOpen}
            setOpen={setMenuOpen}
            setRename={setRename}
            setMoveModal={props.setMoveModal}
            members={props.members}
            allowPublic={props.allowPublic}
            allowPersonal={props.allowPersonal}
          />
          {/* </ActionIcon> */}
        </Group>
      )}
    </Group>
  );
};
