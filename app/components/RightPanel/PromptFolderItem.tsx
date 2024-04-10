// Modules
import { useState, useEffect } from "react";
import { useHover } from "@mantine/hooks";
import Mongoose from "mongoose";
import { Accordion, Text, Group, ActionIcon, TextInput } from "@mantine/core";
import {
  IconCaretRightFilled,
  IconFolderOpen,
  IconFolderFilled,
  IconFolderPlus,
  IconPlus,
} from "@tabler/icons-react";
import { ModalControls } from "./PromptPanel";


// Components
import style from "../RightPanel/RightPanel.module.css";
import { IPromptFolderDocument } from "@/app/models/PromptFolder";
import PromptItem from "./PromptItem";
import { IPromptDocument } from "@/app/models/Prompt";
import PromptFolderFeatureMenu from "./Menu/PromptFolderFeatureMenu";
import { updatePromptFolder } from "@/app/controllers/promptFolder";
import MovePromptItems from "./Modals/MovePromptItems";

export default function PromptFolderItem(props: {
  folder: IPromptFolderDocument;
  scope: "public" | "private" | "system";
  userId: string;
  workspaceId: string;
  modalControls: ModalControls;
}) {
  const { folder, scope, userId, workspaceId } = props;
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
              userId={userId}
              workspaceId={workspaceId}
              setMoveModal={setOpenMoveModal}
              modalControls={props.modalControls}
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
                    userId={props.userId}
                    workspaceId={props.workspaceId}
                    modalControls={props.modalControls}
                  />
                </Accordion>
              </div>
            ))}
          {folder.prompts?.length > 0 &&
            folder.prompts.map((prompt, index) => (
              <div key={index}>
                <PromptItem item={prompt as IPromptDocument} modalControls={props.modalControls} />
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
  workspaceId: string;
  setMoveModal: (value: boolean) => void;
  modalControls: ModalControls;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  let actionIconVisible = (props.isHovered || menuOpen) && props.folder.scope!=="system";
  const [rename, setRename] = useState(false);

  useEffect(() => {
    actionIconVisible = (props.isHovered || menuOpen) && props.folder.scope!=="system";
  }, [props.isHovered, menuOpen]);
  return (
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
                updatePromptFolder(props.folder._id, {
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
          <ActionIcon
            size="16px"
            variant="subtle"
            aria-label="Sort"
            color="#9CA3AF"
            style={{
              "--ai-hover-color": "white",
              "--ai-hover": "#047857",
            }}
            onClick={(event) => {
              event.stopPropagation();
              props.modalControls.setModalItem(null);
              props.modalControls.setModalScope(props.scope === "public" ? "public" : "private");
              props.modalControls.setModalParentFolder(props.folder._id);
              props.modalControls.setOpenModal(true);
            }}

          >
            <IconPlus size={"1rem"} />
          </ActionIcon>
          <ActionIcon
            size="16px"
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
            <PromptFolderFeatureMenu
              folder={props.folder}
              scope={props.scope}
              workspaceId={props.workspaceId}
              userId={props.userId}
              open={menuOpen}
              setOpen={setMenuOpen}
              setRename={setRename}
              setMoveModal={props.setMoveModal}
              modalControls={props.modalControls}
            />
          </ActionIcon>
        </Group>
      )}
    </Group>
  );
};
