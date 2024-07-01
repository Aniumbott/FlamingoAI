import React from "react";
import { useHover } from "@mantine/hooks";

import { IPageDocument } from "@/app/models/Page";
import {
  Menu,
  Button,
  Stack,
  Text,
  Divider,
  ActionIcon,
  Tooltip,
} from "@mantine/core";

import {
  IconDots,
  IconFolderUp,
  IconTrash,
  IconCopy,
  IconPencilMinus,
  IconMessagePlus,
} from "@tabler/icons-react";

import { deletePage } from "@/app/controllers/pages";

const PageMenu = (props: {
  page: IPageDocument;
  open: boolean;
  setOpen: (value: boolean) => void;
  setRename: (value: boolean) => void;
}) => {
  const { page, setRename } = props;
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
            aria-label="Dots"
            color="#9CA3AF"
            // {...(hovered ? { opacity: "1" } : { opacity: "0" })}
            style={{
              "--ai-hover-color": "white",
            }}
          >
            <IconDots size={15} stroke={1.5} />
          </ActionIcon>
        </Menu.Target>
      </Tooltip>
      <Menu.Dropdown>
        <Menu.Label>
          <Text fw={"500"} fz={"sm"} c={"#000000"}>
            {page.name}
          </Text>
        </Menu.Label>
        <Divider color={"#d8dce0"} my={2} />
        <Menu.Item>
          <MenuButton properties={MenuData[0]} />
        </Menu.Item>
        <Menu.Item onClick={() => setRename(true)}>
          <MenuButton properties={MenuData[2]} />
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            deletePage(page);
          }}
        >
          <MenuButton properties={MenuData[1]} />
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

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
          : { color: "0F172A", variant: "transparent" })}
        justify="flex-start"
        styles={{
          root: {
            padding: "6px",
            height: "auto",
          },
          label: {
            textWrap: "wrap",
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
    title: "Start new chat with page context",
    icon: <IconMessagePlus size={20} />,
  },
  {
    title: "Delete",
    icon: <IconTrash size={20} />,
  },
  {
    title: "Rename",
    icon: <IconPencilMinus size={20} />,
  },
];

export default PageMenu;
