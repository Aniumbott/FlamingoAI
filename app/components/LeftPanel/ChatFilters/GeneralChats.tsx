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
  Tooltip,
  Button,
  Container,
  Image,
  BackgroundImage,
  Card,
  Box,
  Flex,
  Avatar,
} from "@mantine/core";
import {
  IconCaretRightFilled,
  IconFolderPlus,
  IconPhotoPlus,
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
import { usePathname, useRouter } from "next/navigation";
import { useHover } from "@mantine/hooks";
import { IImageGenDocument } from "@/app/models/ImageGen";
import { getImageGens } from "@/app/controllers/imageGen";
import { CldImage } from "next-cloudinary";

const GeneralChats = (props: {
  members: any[];
  allowPublic: boolean;
  allowPersonal: boolean;
  productId: string;
}) => {
  const { members, allowPersonal, allowPublic, productId } = props;
  const { userId, orgId } = useAuth();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [publicChats, setPublicChats] = useState<IChatDocument[]>([]);
  const [privateChats, setPrivateChats] = useState<IChatDocument[]>([]);
  const [publicFolders, setPublicFolders] = useState<IChatFolderDocument[]>([]);
  const [privateFolders, setPrivateFolders] = useState<IChatFolderDocument[]>(
    []
  );
  const [allPopulatedChats, setAllPopulatedChats] = useState<IChatDocument[]>(
    []
  );
  const [imageGens, setImageGens] = useState<IImageGenDocument[]>([]);
  const [searchContent, setSearchContent] = useState<boolean>(false);
  const [sort, setSort] = useState<string>("New");

  const [searchTerm, setSearchTerm] = useState<string>("");
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  useEffect(() => {
    if (orgId) {
      const fetchChats = async () => {
        try {
          setPublicChats(
            (await getIndependentChats("public", userId || "", orgId || ""))
              .chats
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
            (await getChatFolders("public", userId || "", orgId || ""))
              .chatFolder
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

      const fetchChatsAndFolders = async () => {
        console.log("fetching chats and folders");
        await fetchChats().then(() => fetchFolders());
      };

      const fetchImageGens = async () => {
        try {
          setImageGens((await getImageGens(orgId || "")).imageGens);
        } catch (error) {
          console.error("Failed to fetch image gens:", error);
        }
      };

      setIsLoading(true);
      fetchChatsAndFolders().then(() => {
        fetchImageGens().then(() => {
          setIsLoading(false);
          console.log(
            "data",
            privateChats,
            publicChats,
            privateFolders,
            publicFolders,
            imageGens
          );
        });
      });
      fetchAllPopulatedChats();

      socket.on("refreshChats", () => {
        console.log("refreshchats fetching chats and folder");
        fetchChatsAndFolders();
        fetchAllPopulatedChats();
      });

      socket.on("refreshImageGens", () => {
        console.log("refreshImageGens fetching image gens");
        fetchImageGens();
      });
    }
    return () => {
      console.log("turning off socket at generatChats");
      socket.off("refreshChats");
      socket.off("refreshImageGens");
    };
  }, [orgId]);

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
        defaultValue={"SHARED"}
      >
        <Accordion.Item value={"SHARED"} key={"SHARED"}>
          <Accordion.Control>
            <AccordionLabel
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
            <ScrollArea.Autosize
              mah="calc(100vh - 475px)"
              scrollbarSize={10}
              offsetScrollbars
            >
              {isLoading ? (
                <Loader type="dots" w={"100%"} />
              ) : publicFolders.length > 0 || publicChats.length > 0 ? (
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
                <Text style={{ textAlign: "center" }} c="dimmed" size="xs">
                  No shared chats or folders
                </Text>
              )}
            </ScrollArea.Autosize>
          </AccordionPanel>
        </Accordion.Item>
        {allowPersonal && (
          <Accordion.Item value={"PERSONAL"} key={"PERSONAL"}>
            <AccordionControl>
              <AccordionLabel
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
                {isLoading ? (
                  <Loader type="dots" w={"100%"} />
                ) : privateFolders.length > 0 || privateChats.length > 0 ? (
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
                  <Text style={{ textAlign: "center" }} c="dimmed" size="xs">
                    No personal chats or folders
                  </Text>
                )}
              </ScrollArea.Autosize>
            </AccordionPanel>
          </Accordion.Item>
        )}
        {productId === process.env.NEXT_PUBLIC_MAX_PLAN && (
          <Accordion.Item value={"GENERATED-IMAGES"} key={"GENERATED-IMAGES"}>
            <Accordion.Control>
              <AccordionLabelImage pathname={pathname} />
            </Accordion.Control>
            <AccordionPanel>
              <ScrollArea.Autosize
                mah="50vh"
                scrollbarSize={10}
                offsetScrollbars
              >
                <Flex wrap="wrap" gap="md" p="5">
                  <ActionIcon
                    variant="default"
                    h="70"
                    w="70"
                    onClick={() => {
                      window.history.pushState(
                        {},
                        "",
                        pathname.split("/").slice(0, 3).join("/") + "/gallery"
                      );
                    }}
                  >
                    <IconPhotoPlus size="35" />
                  </ActionIcon>
                  {imageGens.map((imageGen) => (
                    <ImageCard
                      key={imageGen._id}
                      imageGen={imageGen}
                      createdBy={
                        members.filter(
                          (member) => member.userId == imageGen.createdBy
                        )[0]
                      }
                    />
                  ))}
                </Flex>
              </ScrollArea.Autosize>
            </AccordionPanel>
          </Accordion.Item>
        )}
      </Accordion>
    </Stack>
  );
};

const AccordionLabel = (props: {
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
  const router = useRouter();
  const pathname = usePathname();

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
        <Tooltip label="Create new folder" fz="xs">
          <ActionIcon
            size="sm"
            variant="subtle"
            color="grey"
            onClick={(event) => {
              event.stopPropagation();
              newFolder(props.scope, null, props.userId, props.workspaceId);
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
                null,
                props.userId,
                props.workspaceId,
                props.members
              ).then((res: any) => {
                router.push(
                  pathname.split("/").slice(0, 3).join("/") + "/" + res.chat._id
                );
              });
              // Add any additional logic for the ActionIcon click here
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
      </Group>
    </Group>
  );
};

const AccordionLabelImage = (props: { pathname: string }) => {
  const { pathname } = props;
  return (
    <Group wrap="nowrap" justify="space-between">
      <Text size="sm" fw={600}>
        GENERATED IMAGES
      </Text>
      <ActionIcon
        size="sm"
        variant="subtle"
        color="grey"
        onClick={(event) => {
          event.stopPropagation();
          window.history.pushState(
            {},
            "",
            pathname.split("/").slice(0, 3).join("/") + "/gallery"
          );
        }}
      >
        <IconPlus size={"1rem"} />
      </ActionIcon>
    </Group>
  );
};

const ImageCard = (props: { imageGen: IImageGenDocument; createdBy: any }) => {
  const { hovered, ref } = useHover();
  const pathname = usePathname();
  const { imageGen, createdBy } = props;
  // console.log("createdBy", createdBy);
  return (
    <Card
      h="70"
      w="70"
      p="0"
      key="i"
      ref={ref}
      style={{
        outline:
          hovered || pathname.split("/")[4] === imageGen._id
            ? "2px solid var(--mantine-primary-color-filled)"
            : "none",
        outlineOffset: "3px",
      }}
      onClick={() => {
        window.history.pushState(
          {},
          "",
          pathname.split("/").slice(0, 3).join("/") + `/gallery/${imageGen._id}`
        );
      }}
    >
      {/* <Avatar size="sm" radius="sm" pos="absolute" bottom="0" right="0" /> */}
      {createdBy?.hasImage ? (
        <Avatar
          size="sm"
          radius="sm"
          pos="absolute"
          bottom="0"
          right="0"
          src={createdBy?.imageUrl}
        />
      ) : (
        <Avatar size="sm" radius="sm" pos="absolute" bottom="0" right="0">
          {createdBy?.firstName + createdBy?.lastName}
        </Avatar>
      )}

      <Flex align={"center"} justify={"center"}>
        <CldImage
          src={
            imageGen?._id ||
            "https://images.unsplash.com/photo-1667835949430-a2516cc93d27"
          } // Use this sample image or upload your own via the Media Explorer
          width="70"
          height="70"
          crop={{
            type: "auto",
            source: true,
          }}
          alt="Generated Image"
        />
      </Flex>
    </Card>
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
      <Tooltip label="Menu" fz="xs">
        <Menu.Target>
          <ActionIcon variant="subtle" color="grey" size="24px">
            <IconSettings size={20} />
          </ActionIcon>
        </Menu.Target>
      </Tooltip>
      <Menu.Dropdown>
        <Menu.Item>
          <Checkbox
            label="Search chat content"
            checked={searchContent}
            onChange={(event) => setSearchContent(event.currentTarget.checked)}
            size="xs"
            p={"xs"}
          />
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default GeneralChats;
