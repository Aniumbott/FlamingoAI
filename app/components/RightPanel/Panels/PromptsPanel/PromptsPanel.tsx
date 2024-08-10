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
  Paper,
  Title,
  Combobox,
  TextInput,
  useCombobox,
  Tooltip,
  ComboboxItemGroup,
} from "@mantine/core";
import {
  IconSearch,
  IconCaretRightFilled,
  IconFolderPlus,
  IconPlus,
} from "@tabler/icons-react";

// Components
import style from "../../RightPanel.module.css";
import { useAuth, useUser } from "@clerk/nextjs";
import { IPromptDocument } from "@/app/models/Prompt";
import { getPrompts } from "@/app/controllers/prompt";
import SortMenu from "../../../LeftPanel/Menu/SortMenu";
import PromptItem from "./PromptItem";
import { IPromptFolderDocument } from "@/app/models/PromptFolder";
import {
  createPromptFolder,
  getPromptFolders,
} from "@/app/controllers/promptFolder";
import PromptFolderItem from "./PromptFolderItem";
import PromptModal from "../../Modals/PromptModal";
import * as Mongoose from "mongoose";
import { socket } from "@/socket";
import { sortItems } from "@/app/controllers/chat";
import { group } from "console";

export type ModalControls = {
  setModalItem: (value: IPromptDocument | null) => void;
  setModalScope: (value: "public" | "private" | "") => void;
  setModalParentFolder: (value: Mongoose.Types.ObjectId | null) => void;
  setOpenModal: (value: boolean) => void;
};

export default function PromptsPanel(props: { toggleRight: () => void }) {
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
  const { user } = useUser();
  const [systemSort, setSystemSort] = useState<string>("New");
  const [publicSort, setPublicSort] = useState<string>("New");
  const [privateSort, setPrivateSort] = useState<string>("New");
  const [openModal, setOpenModal] = useState(false);
  const [modalItem, setModalItem] = useState<IPromptDocument | null>(null);
  const [modalScope, setModalScope] = useState<"public" | "private" | "">("");
  const [modalParentFolder, setModalParentFolder] =
    useState<Mongoose.Types.ObjectId | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [combinedSystemPrompts, setCombinedSystemPrompts] = useState<IPromptDocument[]>([]);
  const [combinedPublicPrompts, setCombinedPublicPrompts] = useState<IPromptDocument[]>([]);
  const [combinedPersonalPrompts, setCombinedPersonalPrompts] = useState<IPromptDocument[]>([]);
  const [comboBoxList, setComboBoxList] = useState<any[]>([
    {
      group: "System",
      items: combinedSystemPrompts,
    },
    {
      group: "Public",
      items: combinedPublicPrompts,
    },
    {
      group: "Private",
      items: combinedPersonalPrompts,
    },
  ]);

  const searchPromptsInFolders = (folders: any[], searchTerm: string) => {
    let results: any = [];
    if (folders) {
      for (let folder of folders) {
        if (folder.prompts) {
          const matchedPrompts = folder.prompts.filter((prompt: any) =>
            prompt.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
          results = results.concat(matchedPrompts);
        }
        if (folder.subfolders) {
          results = results.concat(
            searchPromptsInFolders(folder.subfolders, searchTerm)
          );
        }
      }
    }
    return results;
  };

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

    socket.on("refreshPrompts", fetchPromptsAndFolders);

    return () => {
      socket.off("refreshPrompts");
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

  useEffect(() => {
    const filteredSystemPrompts =
      systemPrompt?.filter((prompt) =>
        prompt.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [];
    const filteredSystemFolderPrompts = searchPromptsInFolders(
      systemFolder,
      searchTerm
    );
    setCombinedSystemPrompts([
      ...filteredSystemPrompts,
      ...filteredSystemFolderPrompts,
    ]);

    const filteredPublicPrompts = publicPrompt?.filter((prompt) =>
      prompt.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filterPublicFolderPrompts = searchPromptsInFolders(
      publicFolder,
      searchTerm
    );
    setCombinedPublicPrompts([
      ...filteredPublicPrompts,
      ...filterPublicFolderPrompts,
    ]);

    const filteredPersonalPrompts = personalPrompt?.filter((prompt) =>
      prompt.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filterPersonalFolderPrompts = searchPromptsInFolders(
      personalFolder,
      searchTerm
    );
    setCombinedPersonalPrompts([
      ...filteredPersonalPrompts,
      ...filterPersonalFolderPrompts,
    ]);
  }, [searchTerm])
  useEffect(() => {
    setComboBoxList([
      {
        group: "System",
        items: combinedSystemPrompts,
      },
      {
        group: "Public",
        items: combinedPublicPrompts,
      },
      {
        group: "Private",
        items: combinedPersonalPrompts,
      },
    ]);
  }, [combinedPublicPrompts, combinedPersonalPrompts, combinedSystemPrompts])

  return (
    <>
      <div className={style.activeTitle}>
        <Text>SAVED PROMPTS</Text>
        <Tooltip label="Close" position="left" fz="xs">
          <CloseButton onClick={toggleRight} />
        </Tooltip>
      </div>
      <Divider my="md" />
      <Stack gap={"sm"} p={"8px"}>
        <Combobox store={combobox}>
          <Combobox.Target>
            <TextInput
              placeholder="Search Prompts..."
              leftSection={<IconSearch size={16} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={() => combobox.openDropdown()}
              onFocus={() => combobox.openDropdown()}
              onBlur={() => combobox.closeDropdown()}
            />
          </Combobox.Target>
          {searchTerm.length > 0 && (
            <Combobox.Dropdown>
              <Combobox.Options>
                <ScrollArea.Autosize mah={200} type="scroll">
                  {
                    (comboBoxList.every((group) => group.items.length === 0)) ?
                      (
                        <Combobox.Empty>Nothing found...</Combobox.Empty>
                      ) :
                      (comboBoxList.map((group, key) => (
                        <Combobox.Group label={group.group} key={key}>
                          {group.items.map((prompt: IPromptDocument, key: number) => (
                            <Combobox.Option value={prompt._id} key={key}>
                              <PromptItem
                                item={prompt}
                                key={key}
                                modalControls={modalControls}
                                user={user}
                                orgId={orgId || ""}
                              />
                            </Combobox.Option>
                          ))}
                        </Combobox.Group>
                      )))
                  }
                </ScrollArea.Autosize>
              </Combobox.Options>
            </Combobox.Dropdown>
          )}
        </Combobox>

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
              <ScrollArea.Autosize
                mah="50vh"
                scrollbarSize={10}
                offsetScrollbars
              >
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
                      orgId={orgId || ""}
                      user={user}
                      modalControls={modalControls}
                    />
                  </Accordion>
                ))}
                {systemPrompt?.map((prompt, key) => (
                  <PromptItem
                    item={prompt}
                    key={key}
                    modalControls={modalControls}
                    user={user}
                    orgId={orgId || ""}
                  />
                ))}
              </ScrollArea.Autosize>
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
              <ScrollArea.Autosize
                mah="50vh"
                scrollbarSize={10}
                offsetScrollbars
              >
                <Button
                  variant="default"
                  style={{
                    border: "1px solid grey",
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
                      orgId={orgId || ""}
                      user={user}
                      modalControls={modalControls}
                    />
                  </Accordion>
                ))}
                {publicPrompt?.map((prompt, key) => (
                  <PromptItem
                    item={prompt}
                    key={key}
                    modalControls={modalControls}
                    user={user}
                    orgId={orgId || ""}
                  />
                ))}
              </ScrollArea.Autosize>
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
              <ScrollArea.Autosize
                mah="50vh"
                scrollbarSize={10}
                offsetScrollbars
              >
                <Button
                  variant="default"
                  style={{
                    border: "1px solid grey",
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
                      orgId={orgId || ""}
                      user={user}
                      modalControls={modalControls}
                    />
                  </Accordion>
                ))}
                {personalPrompt?.map((prompt, key) => (
                  <PromptItem
                    item={prompt}
                    key={key}
                    modalControls={modalControls}
                    user={user}
                    orgId={orgId || ""}
                  />
                ))}
              </ScrollArea.Autosize>
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
            <Tooltip label="Create new folder" fz="xs">
              <ActionIcon
                size="sm"
                variant="subtle"
                color="grey"
                onClick={(event) => {
                  event.stopPropagation();
                  createPromptFolder(
                    props.scope,
                    null,
                    props.userId,
                    props.workspaceId
                  );
                }}
              >
                <IconFolderPlus size={"1rem"} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Create new prompt" fz="xs">
              <ActionIcon
                size="sm"
                variant="subtle"
                color="grey"
                onClick={(event) => {
                  event.stopPropagation();
                  props.modalControls?.setModalItem(null);
                  props.modalControls?.setModalScope(
                    props.scope === "public" ? "public" : "private"
                  );
                  props.modalControls?.setModalParentFolder(null);
                  props.modalControls?.setOpenModal(true);
                  console.log("new prompt");
                  // Add any additional logic for the ActionIcon click here
                }}
              >
                <IconPlus size={"1rem"} />
              </ActionIcon>
            </Tooltip>
          </>
        ) : null}
      </Group>
    </Group>
  );
};
