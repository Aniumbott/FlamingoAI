import React from "react";
import { Menu, Button, Text, rem, Popover } from "@mantine/core";
import {
  IconSettings,
  IconBuilding,
  IconUsers,
  IconFileImport,
  IconBriefcase,
  IconSelector,
} from "@tabler/icons-react";
import MyButton from "./Menu/MenuButton";
import MenuBody from "./Menu/MenuBody";
import { useHover } from "@mantine/hooks";

const MenuTarget = (hovered: boolean) => (
  <Button
    justify="space-between"
    fullWidth
    {...(hovered
      ? {
          color: "teal",
          variant: "subtle",
          rightSection: <IconSelector color="teal" />,
        }
      : {
          color: "black",
          variant: "transparent",
          rightSection: <IconSettings color="white" />,
        })}
    color="#05a87a"
    className="hover:bg-red"
  >
    <IconBuilding
      color="white"
      style={{
        marginRight: "10px",
      }}
    />
    DropDown
  </Button>
);

const Items: any = [
  {
    title: "Invite people",
    description: "Chats by participants",
    icon: <IconUsers />,
  },
  {
    title: "Import from ChatGPT",
    description: "Files by participants",
    icon: <IconFileImport />,
  },
  {
    title: "Workspace Branding",
    description: "Tasks by participants",
    icon: <IconBriefcase />,
  },
];
const LeftPanel = () => {
  const { hovered, ref } = useHover();
  return (
    <div className="w-50%">
      <MenuBody
        children={Items}
        target={<div ref={ref}>{MenuTarget(hovered)}</div>}
      />
    </div>
  );
};

export default LeftPanel;
