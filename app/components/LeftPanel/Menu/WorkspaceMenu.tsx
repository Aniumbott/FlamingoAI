import React, { useState } from "react";
import { Menu, Button, Stack, Text } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import {
  IconBriefcase,
  IconBuilding,
  IconFileImport,
  IconSelector,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import InvitePeople from "../Modals/InvitePeople";
import WorkspaceBranding from "../Modals/WorkspaceBranding";

type MenuButtonProps = {
  properties: {
    title: string;
    icon: React.ReactNode;
    // onClickAction?: () => void;
  };
};

const WorkspaceMenu = () => {
  const [openInviteModal, setOpenInviteModal] = useState(false);
  const [openBrandingModal, setOpenBrandingModal] = useState(false);

  const { hovered, ref } = useHover();
  return (
    <>
      <Menu
        position="top-start"
        width={300}
        styles={{
          dropdown: {
            backgroundColor: "#ffffff",
          },
          item: {
            backgroundColor: "#ffffff",
            color: "#0F172A",
            height: "auto",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            padding: "0px",
          },
        }}
      >
        <Menu.Target ref={ref}>
          <Button
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
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item onClick={() => setOpenInviteModal(true)}>
            <MenuButton properties={WorkspaceMenuData[0]} />
          </Menu.Item>
          <Menu.Item>
            <MenuButton properties={WorkspaceMenuData[1]} />
          </Menu.Item>
          <Menu.Item onClick={() => setOpenBrandingModal(true)}>
            <MenuButton properties={WorkspaceMenuData[2]} />
          </Menu.Item>
          <Menu.Item>
            <MenuButton properties={WorkspaceMenuData[3]} />
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <InvitePeople opened={openInviteModal} setOpened={setOpenInviteModal} />
      <WorkspaceBranding
        opened={openBrandingModal}
        setOpened={setOpenBrandingModal}
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
          section: {},
        }}
        // onClick={props.properties.onClickAction}
      >
        <Text fz={"sm"}>{props.properties.title}</Text>
      </Button>
    </div>
  );
};

const WorkspaceMenuData: any = [
  {
    title: "Invite people",
    icon: <IconUsers />,
  },
  {
    title: "Import from ChatGPT",
    icon: <IconFileImport />,
  },
  {
    title: "Workspace Branding",
    icon: <IconBriefcase />,
  },
  {
    title: "Create New Workspace",
    icon: <IconBuilding />,
  },
];

export default WorkspaceMenu;
