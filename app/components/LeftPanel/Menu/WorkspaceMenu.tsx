// Modules
import { useState } from "react";
import { useHover } from "@mantine/hooks";
import {
  Menu,
  Button,
  Text,
  ActionIcon,
  rem,
  Stack,
  Tooltip,
} from "@mantine/core";
import {
  IconBrandOpenai,
  IconBuilding,
  IconFileImport,
  IconSettings,
} from "@tabler/icons-react";

// Components
import Workspace from "../Modals/WorkspaceSettings/WorkspaceSettings";
import { usePathname, useRouter } from "next/navigation";

type MenuButtonProps = {
  properties: {
    title: string;
    icon: React.ReactNode;
  };
};

const WorkspaceMenu = (props: { workspace: any }) => {
  const { workspace } = props;
  const [openWorkspaceModal, setOpenWorkspaceModal] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { ref } = useHover();
  return (
    <>
      <Menu
        position="bottom-end"
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
      >
        <Tooltip label="Menu" fz="xs">
          <Menu.Target ref={ref}>
            <ActionIcon variant="subtle" color="grey" size="24px">
              <IconSettings />
            </ActionIcon>
          </Menu.Target>
        </Tooltip>
        <Menu.Dropdown>
          <Menu.Item onClick={() => setOpenWorkspaceModal(true)}>
            <MenuButton properties={WorkspaceMenuData[0]} />
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              router.replace(
                pathname.split("/").slice(0, 3).join("/") + "/import"
              );
            }}
          >
            <MenuButton properties={WorkspaceMenuData[1]} />
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      {openWorkspaceModal && (
        <Workspace
          opened={openWorkspaceModal}
          setOpened={setOpenWorkspaceModal}
          workspace={workspace}
        />
      )}
    </>
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

const WorkspaceMenuData: any = [
  {
    title: "Workspace Settings",
    icon: <IconBuilding style={{ width: rem(14), height: rem(14) }} />,
  },
  {
    title: "Import from ChatGPT",
    icon: <IconBrandOpenai style={{ width: rem(14), height: rem(14) }} />,
  },
];

export default WorkspaceMenu;
