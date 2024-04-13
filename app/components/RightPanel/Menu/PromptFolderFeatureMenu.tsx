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
import { IPromptFolderDocument } from "@/app/models/PromptFolder";
import { createPrompt } from "@/app/controllers/prompt";
import {
  createPromptFolder,
  deletePromptFolder,
  updatePromptFolder,
} from "@/app/controllers/promptFolder";
import { IPromptDocument } from "@/app/models/Prompt";
import Mongoose from "mongoose";
import { ModalControls } from "../PromptPanel"; 


export default function PromptFolderFeatureMenu(props: {
  folder: IPromptFolderDocument;
  scope: "public" | "private" | "system";
  workspaceId: string;
  userId: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  setRename: (value: boolean) => void;
  setMoveModal: (value: boolean) => void;
  modalControls: ModalControls;
}) {
  const colors = [
    "#2596FF",
    "#AF75F8",
    "#1CAB83",
    "#FFE066",
    "#FF5656",
    "#F875B4",
  ]; // Add more colors if needed

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
            {props.folder.name}
          </Text>
        </Menu.Label>
        <Menu.Item onClick={() => props.setRename(true)}>
          <MenuButton properties={MenuData[0]} />
        </Menu.Item>

        <Menu.Item
          onClick={() => {
            props.modalControls.setModalItem(null);
            props.modalControls.setModalScope(
              props.scope === "public" ? "public" : "private"
            );
            props.modalControls.setModalParentFolder(props.folder._id);
            props.modalControls.setOpenModal(true);
          }}
        >
          <MenuButton properties={MenuData[1]} />
        </Menu.Item>
        <Menu.Item
          onClick={() =>
            createPromptFolder(
              props.scope,
              props.folder._id,
              props.userId,
              props.workspaceId
            )
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
                  updatePromptFolder(props.folder._id, {
                    folderColor: color,
                  });
                }}
              />
            ))}
          </div>
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            deletePromptFolder(props.folder).then((res) => {});
          }}
        >
          <MenuButton properties={MenuData[4]} />
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
    title: "New Prompt",
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
