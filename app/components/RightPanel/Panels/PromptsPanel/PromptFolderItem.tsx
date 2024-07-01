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
import { ModalControls } from "./PromptsPanel";

// Components
import style from "../../RightPanel.module.css";
import { IPromptFolderDocument } from "@/app/models/PromptFolder";
import PromptItem from "./PromptItem";
import { IPromptDocument } from "@/app/models/Prompt";
import PromptFolderFeatureMenu from "../../Menu/PromptFolderFeatureMenu";
import { updatePromptFolder } from "@/app/controllers/promptFolder";
import MovePromptItems from "../../Modals/MoveItems/MovePromptItems";

export default function PromptFolderItem(props: {
  folder: IPromptFolderDocument;
  scope: "public" | "private" | "system";
  user: any;
  orgId: string;
  modalControls: ModalControls;
}) {
  const { folder, scope, user, orgId, modalControls } = props;
  const [isOpened, setIsOpened] = useState(false);
  const { ref, hovered } = useHover();
  const [openMoveModal, setOpenMoveModal] = useState(false);

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
              userId={user?.id || ""}
              orgId={orgId}
              setMoveModal={setOpenMoveModal}
              modalControls={modalControls}
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
                  <PromptFolderItem
                    folder={subFolder as IPromptFolderDocument}
                    scope={scope}
                    user={user}
                    orgId={orgId}
                    modalControls={modalControls}
                  />
                </Accordion>
              </div>
            ))}
          {folder.prompts?.length > 0 &&
            folder.prompts.map((prompt, index) => (
              <div key={index}>
                <PromptItem
                  item={prompt as IPromptDocument}
                  modalControls={modalControls}
                  user={user}
                  orgId={orgId}
                />
              </div>
            ))}
        </Accordion.Panel>
      </Accordion.Item>
      {openMoveModal && (
        <MovePromptItems
          opened={openMoveModal}
          setOpened={setOpenMoveModal}
          item={folder}
        />
      )}
    </>
  );
}

const FolderLabel = (props: {
  folder: IPromptFolderDocument;
  scope: "public" | "private" | "system";
  isOpened: boolean;
  isHovered: boolean;
  userId: string;
  orgId: string;
  setMoveModal: (value: boolean) => void;
  modalControls: ModalControls;
}) => {
  const {
    folder,
    scope,
    isOpened,
    isHovered,
    userId,
    orgId,
    setMoveModal,
    modalControls,
  } = props;
  const [menuOpen, setMenuOpen] = useState(false);
  let actionIconVisible = (isHovered || menuOpen) && folder.scope !== "system";
  const [rename, setRename] = useState(false);

  useEffect(() => {
    actionIconVisible = (isHovered || menuOpen) && folder.scope !== "system";
  }, [isHovered, menuOpen]);
  return (
    <Group wrap="nowrap" justify="space-between" preventGrowOverflow={false}>
      <Group wrap="nowrap" gap={2} align="center">
        {isOpened ? (
          <IconFolderOpen
            style={{
              width: "1rem",
              height: "1rem",
              color: folder.folderColor || "#FFE066",
            }}
          />
        ) : (
          <IconFolderFilled
            style={{
              width: "1rem",
              height: "1rem",
              color: folder.folderColor || "#FFE066",
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
                updatePromptFolder(folder._id, {
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
            {folder.name}
          </Text>
        )}
      </Group>
      {!rename && actionIconVisible && (
        <Group wrap="nowrap" gap={5} align="center">
          <Tooltip label="create new prompt" fz="xs">
            <ActionIcon
              size="sm"
              variant="subtle"
              color="grey"
              onClick={(event) => {
                event.stopPropagation();
                modalControls.setModalItem(null);
                modalControls.setModalScope(
                  scope === "public" ? "public" : "private"
                );
                modalControls.setModalParentFolder(folder._id);
                modalControls.setOpenModal(true);
              }}
            >
              <IconPlus size={"1rem"} />
            </ActionIcon>
          </Tooltip>
          <ActionIcon
            size="sm"
            variant="subtle"
            color="grey"
            onClick={(event) => {
              event.stopPropagation();
              // Add any additional logic for the ActionIcon click here
            }}
          >
            <PromptFolderFeatureMenu
              folder={folder}
              scope={scope}
              orgId={orgId}
              userId={userId}
              open={menuOpen}
              setOpen={setMenuOpen}
              setRename={setRename}
              setMoveModal={setMoveModal}
              modalControls={modalControls}
            />
          </ActionIcon>
        </Group>
      )}
    </Group>
  );
};
