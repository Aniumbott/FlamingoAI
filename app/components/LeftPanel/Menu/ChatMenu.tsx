// Modules
import { Menu, Button, Stack, Text } from "@mantine/core";
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

const ChatMenu = () => {
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
      <Menu.Target>
        <Button
          color="#047857"
          px={6}
          radius="0"
          style={{
            borderRadius: " 0 5px 5px 0",
          }}
        >
          <IconChevronDown size={15} />
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item onClick={createPublicChat}>
          <MenuButton properties={MenuData[0]} />
        </Menu.Item>
        <Menu.Item onClick={createPrivateChat}>
          <MenuButton properties={MenuData[1]} />
        </Menu.Item>
        <Menu.Item onClick={createPublicFolder}>
          <MenuButton properties={MenuData[2]} />
        </Menu.Item>
        <Menu.Item onClick={createPrivateFolder}>
          <MenuButton properties={MenuData[3]} />
        </Menu.Item>
        <Menu.Item>
          <MenuButton properties={MenuData[4]} />
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

const createPublicChat = async () => {
  // console.log("creating public chat");
  const res = await createChat("public", null);
  // console.log("res", res);
};

const createPrivateChat = async () => {
  // console.log("creating private chat");
  const res = await createChat("private", null);
  // console.log("res", res);
};

const createPublicFolder = async () => {
  // console.log("creating public folder");
  const res = await createChatFolder("public", null);
  // console.log("res", res);
};

const createPrivateFolder = async () => {
  // console.log("creating private folder");
  const res = await createChatFolder("private", null);
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
