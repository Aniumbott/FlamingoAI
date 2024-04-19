// Modules
import { use, useEffect, useState } from "react";
import {
  Accordion,
  AccordionControl,
  AccordionPanel,
  ActionIcon,
  Combobox,
  Group,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  useCombobox,
  Loader,
  Menu,
  Checkbox,
  Button,
} from "@mantine/core";
import {
  IconCaretRightFilled,
  IconFolderPlus,
  IconPlus,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react";

// Components
import ChatItem from "../Items/ChatItem";
import FolderItem, { newFolder } from "../Items/FolderItem";
import {
  getIndependentChats,
  createChat,
  sortItems,
  getAllPopulatedChats,
} from "@/app/controllers/chat";
import { IChatDocument } from "@/app/models/Chat";
import { IChatFolderDocument } from "@/app/models/ChatFolder";
import { getChatFolders } from "@/app/controllers/folders";
import SortMenu from "../Menu/SortMenu";
import style from "../LeftPanel.module.css";
import { useAuth } from "@clerk/nextjs";
import { socket } from "@/socket";
import { createSubscription, getCustomer, getSubscriptions } from "@/app/controllers/payment";

const GeneralChats = (props: {
  members: any[];
  allowPublic: boolean;
  allowPersonal: boolean;
}) => {
  const { members, allowPersonal, allowPublic } = props;
  const { userId, orgId } = useAuth();
  const [publicChats, setPublicChats] = useState<IChatDocument[]>([]);
  const [privateChats, setPrivateChats] = useState<IChatDocument[]>([]);
  const [publicFolders, setPublicFolders] = useState<IChatFolderDocument[]>([]);
  const [privateFolders, setPrivateFolders] = useState<IChatFolderDocument[]>(
    []
  );
  const [allPopulatedChats, setAllPopulatedChats] = useState<IChatDocument[]>(
    []
  );
  const [searchContent, setSearchContent] = useState<boolean>(false);
  const [sort, setSort] = useState<string>("New");

  const [searchTerm, setSearchTerm] = useState<string>("");
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  useEffect(() => {
    console.log("creating customer");
    // createCustomer();
    getCustomer();
    getSubscriptions();
  }, []);

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

    const fetchAllPopulatedChats = async () => {
      try {
        setAllPopulatedChats(
          (await getAllPopulatedChats(userId || "", orgId || "")).chats
        );
      } catch (error) {
        console.error("Failed to fetch all populated chats:", error);
      }
    };

    const fetchChatsAndFolders = () => {
      fetchChats().then(() => fetchFolders());
    };

    fetchChatsAndFolders();
    fetchAllPopulatedChats();

    socket.on("refreshChats", () => {
      console.log("refreshchats fetching chats and folder");
      fetchChatsAndFolders();
      fetchAllPopulatedChats();
    });

    return () => {
      console.log("turning off socket at generatChats");
      socket.off("refreshChats");
    };
  }, []);

  const allFilteredChats = allPopulatedChats?.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (searchContent &&
        chat.messages.some((message: any) =>
          message.content.toLowerCase().includes(searchTerm.toLowerCase())
        ))
  );

  const handleSort = () => {
    // console.log("sorting items", sort);
    if (publicChats.length > 0) setPublicChats(sortItems(publicChats, sort));
    if (privateChats.length > 0) setPrivateChats(sortItems(privateChats, sort));
    if (publicFolders.length > 0)
      setPublicFolders(sortItems(publicFolders, sort));
    if (privateFolders.length > 0)
      setPrivateFolders(sortItems(privateFolders, sort));
    // console.log("items sorted");
  };

  useEffect(() => {
    console.log("useeffect");
    handleSort();
  }, [sort]);

  return (
    <Stack gap={"sm"}>
      <Combobox
        store={combobox}
        onOptionSubmit={(val) => {
          combobox.closeDropdown();
          setSearchTerm("");
        }}
      >
        <Combobox.Target>
          <TextInput
            placeholder="Search Chats..."
            leftSection={<IconSearch size={16} />}
            rightSection={
              <SearchMenu
                searchContent={searchContent}
                setSearchContent={setSearchContent}
              />
            }
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
                {allFilteredChats.length === 0 &&
                  allFilteredChats.length === 0 && (
                    <Combobox.Empty>Nothing found</Combobox.Empty>
                  )}
                {allFilteredChats.length > 0 && (
                  <>
                    {/* <Text fw={500}>Shared Chats</Text> */}
                    {allFilteredChats.map((chat, key) => (
                      <Combobox.Option key={key} value={chat._id}>
                        <ChatItem
                          item={chat}
                          members={members}
                          allowPublic={allowPublic}
                          allowPersonal={allowPersonal}
                        />
                      </Combobox.Option>
                    ))}
                  </>
                )}
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
        <Accordion.Item value={"SHARED"} key={"SHARED"}>
          <Accordion.Control>
            <AccordianLabel
              title={"SHARED"}
              scope="public"
              userId={userId || ""}
              workspaceId={orgId || ""}
              sort={sort}
              setSort={setSort}
              members={members}
              allowPublic={allowPublic}
              allowPersonal={allowPersonal}
            />
          </Accordion.Control>
          <AccordionPanel>
            <ScrollArea.Autosize mah="50vh" scrollbarSize={10} offsetScrollbars>
              {publicFolders.length > 0 || publicChats.length > 0 ? (
                <>
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
                        allowPublic={allowPublic}
                        allowPersonal={allowPersonal}
                      />
                    </Accordion>
                  ))}
                  {publicChats?.map((chat, key) => (
                    <ChatItem
                      item={chat}
                      key={key}
                      members={members}
                      allowPublic={allowPublic}
                      allowPersonal={allowPersonal}
                    />
                  ))}
                </>
              ) : (
                <Loader type="dots" w={"100%"} color="teal" />
              )}
            </ScrollArea.Autosize>
          </AccordionPanel>
        </Accordion.Item>
        {allowPersonal && (
          <Accordion.Item value={"PERSONAL"} key={"PERSONAL"}>
            <AccordionControl>
              <AccordianLabel
                title={"PERSONAL"}
                scope="private"
                userId={userId || ""}
                workspaceId={orgId || ""}
                sort={sort}
                setSort={setSort}
                members={members}
                allowPersonal={allowPersonal}
                allowPublic={allowPublic}
              />
            </AccordionControl>
            <AccordionPanel>
              <ScrollArea.Autosize
                mah="50vh"
                scrollbarSize={10}
                offsetScrollbars
              >
                {privateFolders.length > 0 || privateChats.length > 0 ? (
                  <>
                    {privateFolders?.map((folder, key) => (
                      <Accordion
                        chevronPosition="left"
                        classNames={{ chevron: style.chevron }}
                        chevron={
                          <IconCaretRightFilled className={style.icon} />
                        }
                        key={key}
                      >
                        <FolderItem
                          folder={folder}
                          scope={"private"}
                          members={members}
                          userId={userId || ""}
                          workspaceId={orgId || ""}
                          allowPublic={allowPublic}
                          allowPersonal={allowPersonal}
                        />
                      </Accordion>
                    ))}
                    {privateChats?.map((chat, key) => (
                      <ChatItem
                        item={chat}
                        key={key}
                        members={members}
                        allowPublic={allowPublic}
                        allowPersonal={allowPersonal}
                      />
                    ))}
                  </>
                ) : (
                  <Loader type="dots" w={"100%"} color="teal" />
                )}
              </ScrollArea.Autosize>
            </AccordionPanel>
          </Accordion.Item>
        )}
      </Accordion>
    </Stack>
  );
};

const AccordianLabel = (props: {
  title: string;
  scope: "private" | "public";
  userId: string;
  workspaceId: string;
  sort: string;
  setSort: (sort: string) => void;
  members: any[];
  allowPublic: boolean;
  allowPersonal: boolean;
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
          disabled={
            props.scope === "public" ? !props.allowPublic : !props.allowPersonal
          }
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
            createChat(
              props.scope,
              null,
              props.userId,
              props.workspaceId,
              props.members
            );
            // Add any additional logic for the ActionIcon click here
          }}
          disabled={
            props.scope === "public" ? !props.allowPublic : !props.allowPersonal
          }
        >
          <IconPlus size={"1rem"} />
        </ActionIcon>
      </Group>
    </Group>
  );
};

const SearchMenu = (props: {
  searchContent: boolean;
  setSearchContent: (searchContent: boolean) => void;
}) => {
  const { searchContent, setSearchContent } = props;
  return (
    <Menu
      position="bottom-end"
      styles={{
        dropdown: {
          backgroundColor: "#ffffff",
        },
        item: {
          backgroundColor: "#ffffff",
          color: "#000000",
          hover: {
            backgroundColor: "#000000",
          },
          height: "auto",
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          padding: "0px",
        },
      }}
    >
      <Menu.Target>
        <ActionIcon variant="subtle" color="grey" size="24px">
          <IconSettings size={20} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item>
          <Checkbox
            label="Search chat content"
            checked={searchContent}
            onChange={(event) => setSearchContent(event.currentTarget.checked)}
            color="teal"
            size="xs"
            p={"xs"}
          />
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default GeneralChats;
