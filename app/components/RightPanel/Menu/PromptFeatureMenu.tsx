// Modules
import {
  Menu,
  Button,
  Stack,
  Text,
  rem,
  Avatar,
  Divider,
  ActionIcon,
} from "@mantine/core";
import {
  IconDots,
  IconFolderUp,
  IconStar,
  IconTrash,
  IconCopy,
  IconPencilMinus,
  IconStarFilled,
  IconStarOff,
  IconArchive,
} from "@tabler/icons-react";
import { useHover } from "@mantine/hooks";
import { createChatFolder } from "@/app/controllers/folders";
import { createChat, deleteChat, updateChat } from "@/app/controllers/chat";
import { IChatDocument } from "@/app/models/Chat";
import { setRequestMeta } from "next/dist/server/request-meta";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { IPromptDocument } from "@/app/models/Prompt";
import { deletePrompt } from "@/app/controllers/prompt";

export default function PromptFeatureMenu(props: {
  prompt: IPromptDocument;
  open: boolean;
  setOpen: (value: boolean) => void;
  setRename: (value: boolean) => void;
  setMoveModal: (value: boolean) => void;
}) {
  const { userId, orgId } = useAuth();
  return (
    <>
      <Menu
        width={200}
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
        opened={props.open}
        onChange={props.setOpen}
      >
        <Menu.Target>
          <ActionIcon
            size="25px"
            variant="subtle"
            aria-label=""
            color="#9CA3AF"
            // {...(hovered ? { opacity: "1" } : { opacity: "0" })}
            style={{
              "--ai-hover-color": "white",
            }}
          >
            <IconDots size={15} stroke={1.5} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>
            <Text fw={"500"} fz={"sm"} c={"#000000"}>
              {props.prompt.name}
            </Text>
          </Menu.Label>
          <Divider color={"#d8dce0"} my={2} />

          <Menu.Item onClick={() => {}}>
            <MenuButton properties={MenuData[0]} />
          </Menu.Item>
          <Menu.Item>
            <MenuButton properties={MenuData[1]} />
          </Menu.Item>
          <Menu.Item onClick={() => props.setMoveModal(true)}>
            <MenuButton properties={MenuData[2]} />
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              deletePrompt(props.prompt);
            }}
          >
            <MenuButton properties={MenuData[3]} />
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
    title: "Edit",
    icon: <IconPencilMinus size={20} />,
  },
  {
    title: "Duplicate",
    icon: <IconCopy size={20} />,
  },
  {
    title: "Move",
    icon: <IconFolderUp size={20} />,
  },
  {
    title: "Delete",
    icon: <IconTrash size={20} />,
  },
];
