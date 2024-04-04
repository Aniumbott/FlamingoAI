// Modules
import { Menu, Button, Stack, Text, rem } from "@mantine/core";
import {
  IconDots,
  IconFolderUp,
  IconFolderPlus,
  IconPlus,
  IconPencilMinus,
} from "@tabler/icons-react";
import { useHover } from "@mantine/hooks";
import { createChatFolder } from "@/app/controllers/folders";
import { createChat } from "@/app/controllers/chat";

import { IChatFolderDocument } from "@/app/models/ChatFolder";

export default function FolderFeatureMenu(props: {
  folder: IChatFolderDocument;
  scope: "public" | "private";
  workspaceId: string;
  userId: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  setRename: (value: boolean) => void;
}) {
  return (
    <Menu
      width={200}
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
      opened={props.open}
      onChange={props.setOpen}
    >
      <Menu.Target>
        <IconDots style={{ width: "70%", height: "70%" }} stroke={1.5} />
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>
          <Text fw={"500"} fz={"sm"} c={"#000000"}>
            {props.folder.name}
          </Text>
        </Menu.Label>
        <Menu.Item onClick={() => props.setRename(true)}>
          <MenuButton properties={MenuData[0]} />
        </Menu.Item>

        <Menu.Item
          onClick={() =>
            createChat(
              props.scope,
              props.folder._id,
              props.userId,
              props.workspaceId
            )
          }
        >
          <MenuButton properties={MenuData[1]} />
        </Menu.Item>
        <Menu.Item
          onClick={() =>
            createChatFolder(
              props.scope,
              props.folder._id,
              props.userId,
              props.workspaceId
            )
          }
        >
          <MenuButton properties={MenuData[2]} />
        </Menu.Item>
        <Menu.Item>
          <MenuButton properties={MenuData[3]} />
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

const MenuButton = (props: {
  properties: { title: string; icon: React.ReactNode };
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

const MenuData: { title: string; icon: React.ReactNode }[] = [
  {
    title: "Rename",
    icon: <IconPencilMinus size={20} />,
  },
  {
    title: "New Chat",
    icon: <IconPlus size={20} />,
  },
  {
    title: "New Folder",
    icon: <IconFolderPlus size={20} />,
  },
  {
    title: "Move",
    icon: <IconFolderUp size={20} />,
  },
];
