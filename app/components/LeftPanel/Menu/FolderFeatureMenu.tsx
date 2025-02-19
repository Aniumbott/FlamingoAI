// Modules
import {
  Menu,
  Button,
  Stack,
  Text,
  rem,
  ColorPicker,
  Paper,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconDots,
  IconFolderUp,
  IconFolderPlus,
  IconPlus,
  IconPencilMinus,
  IconTrash,
} from "@tabler/icons-react";
import { useHover } from "@mantine/hooks";
import {
  createChatFolder,
  deleteChatFolders,
  updateChatFolders,
} from "@/app/controllers/folders";
import { createChat } from "@/app/controllers/chat";

import { IChatFolderDocument } from "@/app/models/ChatFolder";
import { useRouter, usePathname } from "next/navigation";
import { Protect } from "@clerk/nextjs";

export default function FolderFeatureMenu(props: {
  folder: IChatFolderDocument;
  scope: "public" | "private";
  workspaceId: string;
  userId: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  setRename: (value: boolean) => void;
  setMoveModal: (value: boolean) => void;
  members: any[];
  allowPublic: boolean;
  allowPersonal: boolean;
}) {
  const colors = [
    "#2596FF",
    "#AF75F8",
    "#1CAB83",
    "#FFE066",
    "#FF5656",
    "#F875B4",
  ]; // Add more colors if needed
  const router = useRouter();
  const pathname = usePathname();

  return (
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
      <Tooltip label="Menu" fz="xs">
        <Menu.Target>
          <ActionIcon
            size="25px"
            variant="subtle"
            color="grey"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <IconDots size={15} stroke={1.5} />
          </ActionIcon>
        </Menu.Target>
      </Tooltip>

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
              props.workspaceId,
              props.members
            ).then((res: any) => {
              router.push(
                pathname.split("/").slice(0, 3).join("/") + "/" + res.chat._id
              );
            })
          }
          disabled={
            props.scope === "public" ? !props.allowPublic : !props.allowPersonal
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
          disabled={
            props.scope === "public" ? !props.allowPublic : !props.allowPersonal
          }
        >
          <MenuButton properties={MenuData[2]} />
        </Menu.Item>
        <Menu.Item onClick={() => props.setMoveModal(true)}>
          <MenuButton properties={MenuData[3]} />
        </Menu.Item>
        <Menu.Item>
          <div className="flex gap-2 justify-evenly m-1">
            {colors.map((color, index) => (
              <Paper
                key={index}
                style={{
                  backgroundColor: color,
                  height: "15px",
                  width: "15px",
                  borderRadius: "100%",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
                onClick={() => {
                  updateChatFolders(props.folder._id, {
                    folderColor: color,
                  }).then((res) => {
                    console.log(res);
                  });
                }}
              />
            ))}
          </div>
        </Menu.Item>
        <Protect role="org:admin">
          <Menu.Item
            onClick={() => {
              deleteChatFolders(props.folder).then((res) => {
                console.log(res);
              });
            }}
          >
            <MenuButton properties={MenuData[4]} />
          </Menu.Item>
        </Protect>
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
          ? {
              color: "var(--mantine-primary-color-filled)",
              variant: "outline",
              fz: "xl",
            }
          : { color: "00000000", variant: "transparent" })}
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
  {
    title: "Delete",
    icon: <IconTrash size={20} />,
  },
];
