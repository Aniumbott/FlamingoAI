// Modules
import { useEffect, useState } from "react";
import {
  ActionIcon,
  CloseButton,
  Text,
  Divider,
  Input,
  Accordion,
  ScrollArea,
  AccordionPanel,
  Group,
  Stack,
  Button,
} from "@mantine/core";
import {
  IconSearch,
  IconCaretRightFilled,
  IconFolderPlus,
  IconPlus,
} from "@tabler/icons-react";

// Components
import style from "./RightPanel.module.css";
import { UserButton, useAuth } from "@clerk/nextjs";
import { IPromptDocument } from "@/app/models/Prompt";
import { getPrompts } from "@/app/controllers/prompt";
import SortMenu from "../LeftPanel/Menu/SortMenu";
import PromptItem from "./PromptItem";
import { IPromptFolderDocument } from "@/app/models/PromptFolder";
import {
  createPromptFolder,
  getPromptFolders,
} from "@/app/controllers/promptFolder";
import PromptFolderItem from "./PromptFolderItem";
import PromptModal from "./Modals/PromptModal";
import * as Mongoose from "mongoose";
import { socket } from "@/socket";
import { sortItems } from "@/app/controllers/chat";

export type ModalControls = {
  setModalItem: (value: IPromptDocument | null) => void;
  setModalScope: (value: "public" | "private" | "") => void;
  setModalParentFolder: (value: Mongoose.Types.ObjectId | null) => void;
  setOpenModal: (value: boolean) => void;
};

export default function PromptPanel(props: { toggleRight: () => void }) {
  const { toggleRight } = props;
  const [systemPrompt, setSystemPrompt] = useState<IPromptDocument[]>([]);
  const [publicPrompt, setPublicPrompt] = useState<IPromptDocument[]>([]);
  const [personalPrompt, setPersonalPrompt] = useState<IPromptDocument[]>([]);

  const [systemFolder, setSystemFolder] = useState<IPromptFolderDocument[]>([]);
  const [publicFolder, setPublicFolder] = useState<IPromptFolderDocument[]>([]);
  const [personalFolder, setPersonalFolder] = useState<IPromptFolderDocument[]>(
    []
  );
  const { userId, orgId } = useAuth();
  const [systemSort, setSystemSort] = useState<string>("New");
  const [publicSort, setPublicSort] = useState<string>("New");
  const [privateSort, setPrivateSort] = useState<string>("New");
  const [openModal, setOpenModal] = useState(false);
  const [modalItem, setModalItem] = useState<IPromptDocument | null>(null);
  const [modalScope, setModalScope] = useState<"public" | "private" | "">("");
  const [modalParentFolder, setModalParentFolder] =
    useState<Mongoose.Types.ObjectId | null>(null);

  const modalControls: ModalControls = {
    setModalItem,
    setModalScope,
    setModalParentFolder,
    setOpenModal,
  };

  useEffect(() => {
    const fetchSystem = async () => {
      try {
        setSystemPrompt(
          (await getPrompts(orgId || "", "system", userId || "")).prompts
        );
        setSystemFolder(
          (await getPromptFolders(orgId || "", "system", userId || ""))
            .promptFolders
        );
      } catch (error) {
        console.error("Failed to fetch system prompts:", error);
      }
    };
    const fetchPrompts = async () => {
      try {
        setPublicPrompt(
          (await getPrompts(orgId || "", "public", userId || "")).prompts
        );
        setPersonalPrompt(
          (await getPrompts(orgId || "", "private", userId || "")).prompts
        );
      } catch (error) {
        console.error("Failed to fetch prompts:", error);
      }
    };

    const fetchPromptFolders = async () => {
      try {
        setPublicFolder(
          (await getPromptFolders(orgId || "", "public", userId || ""))
            .promptFolders
        );
        setPersonalFolder(
          (await getPromptFolders(orgId || "", "private", userId || ""))
            .promptFolders
        );
      } catch (error) {
        console.error("Failed to fetch prompt folders:", error);
      }
    };

    const fetchPromptsAndFolders = () => {
      fetchPrompts().then(() => fetchPromptFolders());
    };

    fetchPromptsAndFolders();
    fetchSystem();

    socket.on("fetchPrompts", fetchPromptsAndFolders);
    socket.on("fetchPromptFolders", fetchPromptsAndFolders);

    return () => {
      socket.off("fetchPrompts", fetchPrompts);
      socket.off("fetchPromptFolders", fetchPromptFolders);
    };
  }, []);

  useEffect(() => {
    if (systemPrompt.length > 0)
      setSystemPrompt(sortItems(systemPrompt, systemSort));
    if (systemFolder.length > 0)
      setSystemFolder(sortItems(systemFolder, systemSort));
  }, [systemSort]);

  useEffect(() => {
    if (publicPrompt.length > 0)
      setPublicPrompt(sortItems(publicPrompt, publicSort));
    if (publicFolder.length > 0)
      setPublicFolder(sortItems(publicFolder, publicSort));
  }, [publicSort]);

  useEffect(() => {
    if (personalPrompt.length > 0)
      setPersonalPrompt(sortItems(personalPrompt, privateSort));
    if (personalFolder.length > 0)
      setPersonalFolder(sortItems(personalFolder, privateSort));
  }, [privateSort]);

  return (
    <>
      <div className={style.activeTitle}>
        <Text>SAVED PROMPTS</Text>
        <CloseButton onClick={toggleRight} />
      </div>
      <Divider my="md" />
      <Stack gap={"sm"} p={"8px"}>
        <Input
          placeholder="Search Prompts..."
          leftSection={<IconSearch size={16} />}
          style={{ margin: "0 1rem" }}
        />

        <Accordion
          chevronPosition="left"
          className={style.parent}
          classNames={{ chevron: style.chevron }}
          chevron={<IconCaretRightFilled className={style.icon} />}
        >
          <Accordion.Item value={"System Library"} key={"System Library"}>
            <Accordion.Control>
              <AccordianLabel
                title={"System Library"}
                scope="system"
                userId={userId || ""}
                workspaceId={orgId || ""}
                sort={systemSort}
                setSort={setSystemSort}
              />
            </Accordion.Control>
            <AccordionPanel>
              <ScrollArea h="50vh" scrollbarSize={10} offsetScrollbars>
                {systemFolder?.map((folder, key) => (
                  <Accordion
                    chevronPosition="left"
                    classNames={{ chevron: style.chevron }}
                    chevron={<IconCaretRightFilled className={style.icon} />}
                    key={key}
                  >
                    <PromptFolderItem
                      folder={folder}
                      scope="system"
                      workspaceId={orgId || ""}
                      userId={userId || ""}
                      modalControls={modalControls}
                    />
                  </Accordion>
                ))}
                {systemPrompt?.map((prompt, key) => (
                  <PromptItem
                    item={prompt}
                    key={key}
                    modalControls={modalControls}
                  />
                ))}
              </ScrollArea>
            </AccordionPanel>
          </Accordion.Item>

          <Accordion.Item value={"Workspace Library"} key={"Workspace Library"}>
            <Accordion.Control>
              <AccordianLabel
                title={"Workspace Library"}
                scope="public"
                userId={userId || ""}
                workspaceId={orgId || ""}
                sort={publicSort}
                setSort={setPublicSort}
                modalControls={modalControls}
              />
            </Accordion.Control>
            <AccordionPanel>
              <ScrollArea h="50vh" scrollbarSize={10} offsetScrollbars>
                <Button
                  variant="default"
                  style={{
                    border: "1px solid gray",
                  }}
                  fw={300}
                  fz={"xs"}
                  my={5}
                  leftSection={<IconPlus size={16} />}
                  onClick={() => {
                    setModalItem(null);
                    setModalScope("public");
                    setModalParentFolder(null);
                    setOpenModal(true);
                  }}
                >
                  New Prompt
                </Button>

                {publicFolder?.map((folder, key) => (
                  <Accordion
                    chevronPosition="left"
                    classNames={{ chevron: style.chevron }}
                    chevron={<IconCaretRightFilled className={style.icon} />}
                    key={key}
                  >
                    <PromptFolderItem
                      folder={folder}
                      scope="public"
                      workspaceId={orgId || ""}
                      userId={userId || ""}
                      modalControls={modalControls}
                    />
                  </Accordion>
                ))}
                {publicPrompt?.map((prompt, key) => (
                  <PromptItem
                    item={prompt}
                    key={key}
                    modalControls={modalControls}
                  />
                ))}
              </ScrollArea>
            </AccordionPanel>
          </Accordion.Item>

          <Accordion.Item value={"Personal Library"} key={"Personal Library"}>
            <Accordion.Control>
              <AccordianLabel
                title={"Personal Library"}
                scope="private"
                userId={userId || ""}
                workspaceId={orgId || ""}
                sort={privateSort}
                setSort={setPrivateSort}
                modalControls={modalControls}
              />
            </Accordion.Control>
            <AccordionPanel>
              <ScrollArea h="50vh" scrollbarSize={10} offsetScrollbars>
                <Button
                  variant="default"
                  style={{
                    border: "1px solid gray",
                  }}
                  fw={300}
                  fz={"xs"}
                  my={5}
                  leftSection={<IconPlus size={16} />}
                  onClick={() => {
                    setModalItem(null);
                    setModalScope("private");
                    setModalParentFolder(null);
                    setOpenModal(true);
                  }}
                >
                  New Prompt
                </Button>

                {personalFolder?.map((folder, key) => (
                  <Accordion
                    chevronPosition="left"
                    classNames={{ chevron: style.chevron }}
                    chevron={<IconCaretRightFilled className={style.icon} />}
                    key={key}
                  >
                    <PromptFolderItem
                      folder={folder}
                      scope="private"
                      workspaceId={orgId || ""}
                      userId={userId || ""}
                      modalControls={modalControls}
                    />
                  </Accordion>
                ))}
                {personalPrompt?.map((prompt, key) => (
                  <PromptItem
                    item={prompt}
                    key={key}
                    modalControls={modalControls}
                  />
                ))}
              </ScrollArea>
            </AccordionPanel>
          </Accordion.Item>
        </Accordion>
        {openModal && (
          <PromptModal
            opened={openModal}
            setOpened={setOpenModal}
            modalItem={modalItem}
            setModalItem={setModalItem}
            scope={modalScope}
            parentFolder={modalParentFolder}
          />
        )}
      </Stack>
    </>
  );
}

const AccordianLabel = (props: {
  title: string;
  scope: "private" | "public" | "system";
  userId: string;
  workspaceId: string;
  sort: string;
  setSort: (sort: string) => void;
  modalControls?: ModalControls;
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
        {props.scope !== "system" ? (
          <>
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
                createPromptFolder(
                  props.scope,
                  null,
                  props.userId,
                  props.workspaceId
                );
                // newFolder(props.scope, null, props.userId, props.workspaceId);
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
                props.modalControls?.setModalItem(null);
                props.modalControls?.setModalScope(
                  props.scope === "public" ? "public" : "private"
                );
                props.modalControls?.setModalParentFolder(null);
                props.modalControls?.setOpenModal(true);
                console.log("new prompt");
                // createChat(props.scope, null, props.userId, props.workspaceId);
                // Add any additional logic for the ActionIcon click here
              }}
            >
              <IconPlus size={"1rem"} />
            </ActionIcon>
          </>
        ) : null}
      </Group>
    </Group>
  );
};
