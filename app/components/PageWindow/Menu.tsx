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
  Tooltip,
  CopyButton,
} from "@mantine/core";
import {
  IconDots,
  IconFolderUp,
  IconCopy,
  IconStarOff,
  IconTextPlus,
  IconCircle,
  IconCircleDotted,
  IconTextSpellcheck,
  IconSparkles,
  IconMessages,
  IconStar,
  IconAlignJustified,
} from "@tabler/icons-react";
import { useHover } from "@mantine/hooks";

export default function EditorMenu(props: {
  open: boolean;
  setOpen: (value: boolean) => void;
  setIsPanelOpened: (value: boolean) => void;
}) {
  const { open, setOpen, setIsPanelOpened } = props;
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
        opened={open}
        onChange={setOpen}
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
              <IconDots size={20} stroke={1.5} />
            </ActionIcon>
          </Menu.Target>
        </Tooltip>

        <Menu.Dropdown>
          <Menu.Label>
            <Text fw={"500"} fz={"sm"} c={"#000000"}>
              Modify response
            </Text>
          </Menu.Label>
          <Menu.Item>
            <MenuButton
              setIsPanelOpened={setIsPanelOpened}
              properties={MenuData[0]}
            />
          </Menu.Item>
          <Menu.Item>
            <MenuButton
              setIsPanelOpened={setIsPanelOpened}
              properties={MenuData[1]}
            />
          </Menu.Item>
          <Menu.Item>
            <MenuButton
              setIsPanelOpened={setIsPanelOpened}
              properties={MenuData[2]}
            />
          </Menu.Item>
          <Menu.Item>
            <MenuButton
              setIsPanelOpened={setIsPanelOpened}
              properties={MenuData[3]}
            />
          </Menu.Item>
          <Menu.Item>
            <MenuButton
              setIsPanelOpened={setIsPanelOpened}
              properties={MenuData[4]}
            />
          </Menu.Item>
          <Menu.Item>
            <MenuButton
              setIsPanelOpened={setIsPanelOpened}
              properties={MenuData[5]}
            />
          </Menu.Item>
          <Menu.Item>
            <MenuButton
              setIsPanelOpened={setIsPanelOpened}
              properties={MenuData[6]}
            />
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}

const MenuButton = (props: {
  setIsPanelOpened: (value: boolean) => void;
  properties: { title: string; icon: React.ReactNode };
}) => {
  const { setIsPanelOpened, properties } = props;
  const { hovered, ref } = useHover();
  return (
    <div ref={ref}>
      <Button
        leftSection={properties.icon}
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
        }}
        onClick={() => {
          setIsPanelOpened(true);
        }}
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
    title: "Longer",
    icon: <IconTextPlus size={15} />,
  },
  {
    title: "Shorter",
    icon: <IconAlignJustified size={15} />,
  },
  {
    title: "Simpler",
    icon: <IconCircle size={15} />,
  },
  {
    title: "Summarize",
    icon: <IconCircleDotted size={15} />,
  },
  {
    title: "Improve Writing",
    icon: <IconStar size={15} />,
  },
  {
    title: "Fix grammar & spelling",
    icon: <IconTextSpellcheck size={15} />,
  },
  {
    title: "Custom instruction",
    icon: <IconMessages size={15} />,
  },
];
