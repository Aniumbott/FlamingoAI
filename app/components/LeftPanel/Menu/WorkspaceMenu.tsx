// Modules
import { useState } from "react";
import { useHover } from "@mantine/hooks";
import { Menu, Button, Text, ActionIcon, rem } from "@mantine/core";
import {
  IconBuilding,
  IconFileImport,
  IconSettings,
} from "@tabler/icons-react";

// Components
import Workspace from "../../RightPanel/Modals/Workspace/Workspace";

type MenuButtonProps = {
  properties: {
    title: string;
    icon: React.ReactNode;
  };
};

const WorkspaceMenu = () => {
  const [openWorkspaceModal, setOpenWorkspaceModal] = useState(false);

  const { ref } = useHover();
  return (
    <>
      <Menu width={200}>
        <Menu.Target ref={ref}>
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
      <Button leftSection={props.properties.icon}>
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
];

export default WorkspaceMenu;
