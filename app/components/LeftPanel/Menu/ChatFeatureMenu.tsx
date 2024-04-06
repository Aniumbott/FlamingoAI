// Modules
import { Menu, Button, Stack, Text, rem } from "@mantine/core";
import {
  IconDots,
  IconFolderUp,
  IconStar,
  IconTrash,
  IconCopy,
  IconPencilMinus,
} from "@tabler/icons-react";
import { useHover } from "@mantine/hooks";
import { createChatFolder } from "@/app/controllers/folders";
import { createChat } from "@/app/controllers/chat";
import { IChatDocument } from "@/app/models/Chat";
import { setRequestMeta } from "next/dist/server/request-meta";
import MoveChats from "../Modals/MoveItems";
import { useEffect, useState } from "react";

export default function ChatFeatureMenu(props: {
  chat: IChatDocument;
  members: any[];
  open: boolean;
  setOpen: (value: boolean) => void;
  setRename: (value: boolean) => void;
  setMoveModal: (value: boolean) => void;
}) {
  return (
    <>
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
          <IconDots size={15} stroke={1.5} />
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>
            <Text fw={"500"} fz={"sm"} c={"#000000"}>
              {props.chat.name}
            </Text>
          </Menu.Label>
          <Menu.Item onClick={() => props.setRename(true)}>
            <MenuButton properties={MenuData[0]} />
          </Menu.Item>

          <Menu.Item>
            <MenuButton properties={MenuData[1]} />
          </Menu.Item>
          <Menu.Item>
            <MenuButton properties={MenuData[2]} />
          </Menu.Item>
          <Menu.Item onClick={() => props.setMoveModal(true)}>
            <MenuButton properties={MenuData[3]} />
          </Menu.Item>
          <Menu.Item>
            <MenuButton properties={MenuData[4]} />
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
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
    title: "Copy Link",
    icon: <IconCopy size={20} />,
  },
  {
    title: "Add to favourite",
    icon: <IconStar size={20} />,
  },
  {
    title: "Move",
    icon: <IconFolderUp size={20} />,
  },
  {
    title: "Archive",
    icon: <IconTrash size={20} />,
  },
];
