import React, { useState } from "react";
import { Menu, Button, Stack, Text, ActionIcon, rem } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import {
  IconBriefcase,
  IconBuilding,
  IconDotsVertical,
  IconFileImport,
  IconSelector,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import InvitePeople from "../Modals/InvitePeople";
import WorkspaceBranding from "../Modals/WorkspaceBranding";
import Workspace from "../../RightPanel/Modals/Workspace/Workspace";

type MenuButtonProps = {
  properties: {
    title: string;
    icon: React.ReactNode;
    // onClickAction?: () => void;
  };
};

const WorkspaceMenu = () => {
  const [openWorkspaceModal, setOpenWorkspaceModal] = useState(false);

  const { hovered, ref } = useHover();
  return (
    <>
      <Menu
        // position="top-start"
        width={200}
        // styles={{
        //   dropdown: {
        //     backgroundColor: "#ffffff",
        //   },
        //   item: {
        //     backgroundColor: "#ffffff",
        //     color: "#0F172A",
        //     height: "auto",
        //     display: "flex",
        //     flexDirection: "row",
        //     justifyContent: "flex-start",
        //     padding: "0px",
        //   },
        // }}
      >
        <Menu.Target ref={ref}>
          {/* <Button
            justify="space-between"
            style={{
              padding: "6px",
            }}
            styles={{
              label: {
                flexGrow: 1,
              },
            }}
            fullWidth
            leftSection={<IconBuilding color="white" />}
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
          >
            Poorvank Workspace
          </Button> */}
          <ActionIcon variant="subtle" color="grey">
            <IconSettings />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            onClick={() => setOpenWorkspaceModal(true)}
            leftSection={WorkspaceMenuData[0].icon}
          >
            {WorkspaceMenuData[0].title}
          </Menu.Item>
          <Menu.Item leftSection={WorkspaceMenuData[1].icon}>
            {WorkspaceMenuData[1].title}
          </Menu.Item>
          {/* <Menu.Item
            onClick={() => setOpenBrandingModal(true)}
            leftSection={WorkspaceMenuData[2].icon}
          >
            {WorkspaceMenuData[2].title}
          </Menu.Item>
          <Menu.Item leftSection={WorkspaceMenuData[3].icon}>
            {WorkspaceMenuData[3].title}
          </Menu.Item> */}
        </Menu.Dropdown>
      </Menu>

      <Workspace
        opened={openWorkspaceModal}
        setOpened={setOpenWorkspaceModal}
      />
    </>
  );
};

const MenuButton = (props: MenuButtonProps) => {
  const { hovered, ref } = useHover();
  return (
    <div ref={ref}>
      <Button
        leftSection={props.properties.icon}
        // fullWidth
        // {...(hovered
        //   ? { color: "green", variant: "outline", fz: "xl" }
        //   : { color: "0F172A", variant: "transparent" })}
        // justify="flex-start"
        // styles={{
        //   root: {
        //     padding: "6px",
        //     height: "auto",
        //   },
        //   section: {},
        // }}
        // onClick={props.properties.onClickAction}
      >
        <Text fz={"sm"}>{props.properties.title}</Text>
      </Button>
    </div>
  );
};

const WorkspaceMenuData: any = [
  {
    title: "Workspace Settings",
    icon: <IconBuilding style={{ width: rem(14), height: rem(14) }} />,
  },
  {
    title: "Import from ChatGPT",
    icon: <IconFileImport style={{ width: rem(14), height: rem(14) }} />,
  },
  // {
  //   title: "Workspace Branding",
  //   icon: <IconBriefcase style={{ width: rem(14), height: rem(14) }} />,
  // },
  // {
  //   title: "Create New Workspace",
  //   icon: <IconBuilding style={{ width: rem(14), height: rem(14) }} />,
  // },
];

export default WorkspaceMenu;
