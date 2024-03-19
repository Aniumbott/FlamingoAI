import React from "react";
import { Menu, Button, Stack, Text } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import {
  IconArchive,
  IconCalendarClock,
  IconChevronDown,
  IconFolderPlus,
  IconFolderRoot,
  IconListDetails,
  IconLock,
  IconMessages,
  IconNews,
  IconSelector,
  IconStar,
  IconUsers,
} from "@tabler/icons-react";

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

const NewMenu = () => {
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
        <Button color="#047857" py={0} px={1}>
          <IconChevronDown size={20} />
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item>
          <MenuButton properties={NewMenuData[0]} />
        </Menu.Item>
        <Menu.Item>
          <MenuButton properties={NewMenuData[1]} />
        </Menu.Item>
        <Menu.Item>
          <MenuButton properties={NewMenuData[2]} />
        </Menu.Item>
        <Menu.Item>
          <MenuButton properties={NewMenuData[3]} />
        </Menu.Item>
        <Menu.Item>
          <MenuButton properties={NewMenuData[4]} />
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
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

const NewMenuData: MenuData[] = [
  {
    title: "New Shared Chat",
    description: "Chat with AI and collaborate with the team",
    icon: <IconMessages />,
  },
  {
    title: "New Personal Chat",
    description: "Individual chats with AI",
    icon: <IconLock />,
  },
  {
    title: "New Shared Folder",
    description: "Organize shared chats in folders",
    icon: <IconFolderPlus />,
  },
  {
    title: "New Personal Folder",
    description: "Organize personal chats in folders",
    icon: <IconFolderRoot />,
  },
  {
    title: "New Prompt",
    description: "Prompt template to start chats with",
    icon: <IconNews />,
  },
];

export default NewMenu;
