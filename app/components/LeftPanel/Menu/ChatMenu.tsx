// Modules
import { Menu, Button, Stack, Text, Tooltip } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import {
  IconChevronDown,
  IconFolderPlus,
  IconFolderRoot,
  IconLock,
  IconMessages,
  IconNews,
} from "@tabler/icons-react";

// Components
import { createChat } from "@/app/controllers/chat";
import { createChatFolder } from "@/app/controllers/folders";
import { useAuth } from "@clerk/nextjs";
type MenuData = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

type MenuButtonProps = {
  properties: {
    title: string;
    description: string;
    icon: React.ReactNode;
    // onClickAction?: () => void;
  };
};

const ChatMenu = (props: {
  members: any[];
  allowPublic: boolean;
  allowPersonal: boolean;
}) => {
  const { orgId, userId } = useAuth();
  const { allowPublic, allowPersonal } = props;
  return (
    <Menu
      position="top-start"
      width={300}
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
          <Button
            color="teal"
            px={6}
            radius="0"
            style={{
              borderRadius: " 0 5px 5px 0",
            }}
          >
            <IconChevronDown size={15} />
          </Button>
        </Menu.Target>
      </Tooltip>

      <Menu.Dropdown>
        {allowPublic && (
          <Menu.Item
            onClick={() =>
              createPublicChat(userId as string, orgId as string, props.members)
            }
          >
            <MenuButton properties={MenuData[0]} />
          </Menu.Item>
        )}
        {allowPersonal && (
          <Menu.Item
            onClick={() =>
              createPrivateChat(
                userId as string,
                orgId as string,
                props.members
              )
            }
          >
            <MenuButton properties={MenuData[1]} />
          </Menu.Item>
        )}
        {allowPublic && (
          <Menu.Item
            onClick={() =>
              createPublicFolder(userId as string, orgId as string)
            }
          >
            <MenuButton properties={MenuData[2]} />
          </Menu.Item>
        )}
        {allowPersonal && (
          <Menu.Item
            onClick={() =>
              createPrivateFolder(userId as string, orgId as string)
            }
          >
            <MenuButton properties={MenuData[3]} />
          </Menu.Item>
        )}
        {/* <Menu.Item>
          <MenuButton properties={MenuData[4]} />
        </Menu.Item> */}
      </Menu.Dropdown>
    </Menu>
  );
};

const createPublicChat = async (
  userId: string,
  orgId: string,
  members: any[]
) => {
  // console.log("creating public chat");
  const res = await createChat("public", null, userId, orgId, members);
  // console.log("res", res);
};

const createPrivateChat = async (
  userId: string,
  orgId: string,
  members: any[]
) => {
  // console.log("creating private chat");
  const res = await createChat("private", null, userId, orgId, members);
  console.log("res", res.chat);
};

const createPublicFolder = async (userId: string, orgId: string) => {
  // console.log("creating public folder");
  const res = await createChatFolder("public", null, userId, orgId);
  // console.log("res", res);
};

const createPrivateFolder = async (userId: string, orgId: string) => {
  // console.log("creating private folder");
  const res = await createChatFolder("private", null, userId, orgId);
  // console.log("res", res);
};

const MenuButton = (props: MenuButtonProps) => {
  const { hovered, ref } = useHover();
  return (
    <div ref={ref}>
      <Button
        leftSection={props.properties.icon}
        fullWidth
        {...(hovered
          ? { color: "green", variant: "outline", fz: "xl" }
          : { color: "0F172A", variant: "transparent" })}
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
          <Text fw={"600"} fz={"sm"}>
            {props.properties.title}
          </Text>
          {props.properties.description && (
            <Text fz={"xs"} fw={"500"} c={"gray.7"}>
              {props.properties.description}
            </Text>
          )}
        </Stack>
      </Button>
    </div>
  );
};

const MenuData: MenuData[] = [
  {
    title: "New Shared Chat",
    description: "Chat with AI and collaborate with the team",
    icon: <IconMessages size={20} />,
  },
  {
    title: "New Personal Chat",
    description: "Individual chats with AI",
    icon: <IconLock size={20} />,
  },
  {
    title: "New Shared Folder",
    description: "Organize shared chats in folders",
    icon: <IconFolderPlus size={20} />,
  },
  {
    title: "New Personal Folder",
    description: "Organize personal chats in folders",
    icon: <IconFolderRoot size={20} />,
  },
  {
    title: "New Prompt",
    description: "Prompt template to start chats with",
    icon: <IconNews size={20} />,
  },
];

export default ChatMenu;
