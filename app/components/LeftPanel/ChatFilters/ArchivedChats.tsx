// Modules
import { useEffect, useState } from "react";

// Components
import { getArchivedChats } from "@/app/controllers/chat";
import { IChatDocument } from "@/app/models/Chat";
import ChatItem from "../Items/ChatItem";
import { useAuth } from "@clerk/nextjs";
import {
  Button,
  Group,
  Menu,
  ScrollArea,
  Stack,
  Text,
  Loader,
} from "@mantine/core";
import { socket } from "@/socket";
import { useHover } from "@mantine/hooks";
import {
  IconChevronRight,
  IconCircle,
  IconCircleFilled,
  IconFolderUp,
  IconSortAscending,
  IconSortDescending2,
  IconSortDescendingLetters,
} from "@tabler/icons-react";
import { IconSortDescending } from "@tabler/icons-react";
import { IconSortAscendingLetters } from "@tabler/icons-react";

const ArchivedChats = (props: {
  members: any[];
  allowPublic: boolean;
  allowPersonal: boolean;
}) => {
  const { members, allowPersonal, allowPublic } = props;
  const { userId, orgId } = useAuth();
  useEffect(() => {
    const fetchAllChats = async () => {
      const chats = (await getArchivedChats(userId || "", orgId || "")).chats;
      setArchivedChats(chats);
    };
    fetchAllChats();
    socket.on("refreshChats", () => {
      fetchAllChats();
    });
    return () => {
      console.log("unmounting archived chats");
      socket.off("refreshChats");
    };
  }, []);

  const [archivedChats, setArchivedChats] = useState<IChatDocument[]>([]);
  const [sort, setSort] = useState<string>("New");
  const [autoArchive, setAutoArchive] = useState<string>("Never");

  return (
    <div className="flex flex-col justify-between h-full w-full">
      <ScrollArea h="50vh" scrollbarSize={10} offsetScrollbars>
        {archivedChats.length > 0 ? (
          archivedChats.map((chat, key) => {
            return (
              <ChatItem
                item={chat}
                key={key}
                members={members}
                allowPersonal={allowPersonal}
                allowPublic={allowPublic}
              />
            );
          })
        ) : (
          <Loader type="dots" w={"100%"} color="teal" />
        )}
      </ScrollArea>
      <div className="flex gap-1">
        <AutomaticArchive
          autoArchive={autoArchive}
          setAutoArchive={setAutoArchive}
        />
        <SortMenu sort={sort} setSort={setSort} />
      </div>
    </div>
  );
};

const AutomaticArchive = (props: {
  autoArchive: string;
  setAutoArchive: (value: string) => void;
}) => {
  return (
    <Menu
      width={150}
      position="right-end"
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
        <Button
          rightSection={<IconChevronRight size={20} />}
          fullWidth
          color="0F172A"
          variant="default"
          justify="flex-start"
          styles={{
            root: {
              padding: "6px",
              height: "auto",
            },
            label: {
              flexGrow: 1,
            },
          }}
        >
          <Stack gap={1} align="start">
            <Text fw={"400"} fz={"xs"}>
              Auto Archive
            </Text>
          </Stack>
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item onClick={() => props.setAutoArchive("Never")}>
          <AutoArchiveMenuButton
            properties={{ title: "Never" }}
            autoArchive={props.autoArchive}
          />
        </Menu.Item>
        <Menu.Item onClick={() => props.setAutoArchive("7 days")}>
          <AutoArchiveMenuButton
            properties={{ title: "7 days" }}
            autoArchive={props.autoArchive}
          />
        </Menu.Item>
        <Menu.Item onClick={() => props.setAutoArchive("14 days")}>
          <AutoArchiveMenuButton
            properties={{ title: "14 days" }}
            autoArchive={props.autoArchive}
          />
        </Menu.Item>
        <Menu.Item onClick={() => props.setAutoArchive("30 days")}>
          <AutoArchiveMenuButton
            properties={{ title: "30 days" }}
            autoArchive={props.autoArchive}
          />
        </Menu.Item>
        <Menu.Item onClick={() => props.setAutoArchive("90 days")}>
          <AutoArchiveMenuButton
            properties={{ title: "90 days" }}
            autoArchive={props.autoArchive}
          />
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

const AutoArchiveMenuButton = (props: {
  properties: { title: string };
  autoArchive: string;
}) => {
  const { hovered, ref } = useHover();
  return (
    <div ref={ref}>
      <Button
        fullWidth
        {...(hovered
          ? { color: "green", variant: "outline", fz: "xl" }
          : { color: "0F172A", variant: "transparent" })}
        {...(props.properties.title === props.autoArchive
          ? { variant: "filled", color: "teal" }
          : null)}
        justify="flex-start"
        styles={{
          root: {
            padding: "6px",
            height: "auto",
          },
        }}
        // onClick={props.properties.onClickAction}
      >
        <Stack gap={1} align="start">
          <Text fw={"400"} fz={"xs"}>
            {props.properties.title}
          </Text>
        </Stack>
      </Button>
    </div>
  );
};

const SortMenu = (props: {
  sort: string;
  setSort: (value: string) => void;
}) => {
  const { sort, setSort } = props;
  return (
    <Menu
      width={150}
      position="right-end"
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
        <Button
          rightSection={<IconChevronRight size={20} />}
          fullWidth
          color="0F172A"
          variant="default"
          justify="flex-start"
          styles={{
            root: {
              padding: "6px",
              height: "auto",
            },
            label: {
              flexGrow: 1,
            },
          }}
        >
          <Stack gap={1} align="start">
            <Text fw={"400"} fz={"xs"}>
              Sort By
            </Text>
          </Stack>
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>
          <Text fw={"500"} fz={"sm"}>
            Sort
          </Text>
        </Menu.Label>
        <Menu.Item onClick={() => setSort("A-Z")}>
          <MenuButton properties={MenuData[0]} sort={sort} />
        </Menu.Item>
        <Menu.Item onClick={() => setSort("Z-A")}>
          <MenuButton properties={MenuData[1]} sort={sort} />
        </Menu.Item>
        <Menu.Item onClick={() => setSort("New")}>
          <MenuButton properties={MenuData[2]} sort={sort} />
        </Menu.Item>
        <Menu.Item onClick={() => setSort("Old")}>
          <MenuButton properties={MenuData[3]} sort={sort} />
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

const MenuButton = (props: {
  properties: { title: string; icon: React.ReactNode; id: string };
  sort?: string;
}) => {
  const { hovered, ref } = useHover();
  return (
    <div ref={ref}>
      <Button
        leftSection={props.properties.icon}
        fullWidth
        {...(hovered
          ? { color: "green", variant: "outline", fz: "xl" }
          : { color: "0F172A", variant: "transparent" })}
        {...(props.properties.id === props.sort
          ? { color: "teal", variant: "filled", fz: "xl" }
          : null)}
        justify="flex-start"
        styles={{
          root: {
            padding: "6px",
            height: "auto",
          },
        }}
        // onClick={props.properties.onClickAction}
      >
        <Stack gap={1} align="start">
          <Text fw={"400"} fz={"xs"}>
            {props.properties.title}
          </Text>
        </Stack>
      </Button>
    </div>
  );
};

const MenuData: { title: string; icon: React.ReactNode; id: string }[] = [
  {
    title: "Name A-Z",
    icon: <IconSortAscendingLetters size={20} />,
    id: "A-Z",
  },
  {
    title: "Name Z-A",
    icon: <IconSortDescendingLetters size={20} />,
    id: "Z-A",
  },
  {
    title: "Newest First",
    icon: <IconSortDescending size={20} />,
    id: "New",
  },
  {
    title: "Oldest First",
    icon: <IconSortAscending size={20} />,
    id: "Old",
  },
];

export default ArchivedChats;
