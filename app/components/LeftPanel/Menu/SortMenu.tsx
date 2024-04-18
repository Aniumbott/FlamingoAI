// Modules
import {
  ActionIcon,
  Button,
  Menu,
  Stack,
  Text,
  rem,
  Tooltip,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import {
  IconDots,
  IconSortAscending,
  IconSortDescending,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
} from "@tabler/icons-react";

export default function SortMenu(props: {
  sort: string;
  setSort: (value: string) => void;
}) {
  const { sort, setSort } = props;
  return (
    <Menu
      width={150}
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
      <Tooltip label="Sort by" fz="xs">
        <Menu.Target>
          <ActionIcon
            size="sm"
            variant="subtle"
            aria-label="Sort"
            color="#9CA3AF"
            style={{
              "--ai-hover-color": "white",
              "--ai-hover": "#6bcb99",
            }}
            onClick={(event) => {
              event.stopPropagation();
              // Add any additional logic for the ActionIcon click here
            }}
          >
            <IconDots size={15} stroke={1.5} />
          </ActionIcon>
        </Menu.Target>
      </Tooltip>

      <Menu.Dropdown>
        <Menu.Label>
          <Text fw={"500"} fz={"sm"}>
            Sort
          </Text>
        </Menu.Label>
        <Menu.Item onClick={() => setSort("A-Z")}>
          <MenuButton properties={MenuData[0]} sort={sort} />
        </Menu.Item>
        <Menu.Item onClick={() => setSort("Z-A")}>
          <MenuButton properties={MenuData[1]} sort={sort} />
        </Menu.Item>
        <Menu.Item onClick={() => setSort("New")}>
          <MenuButton properties={MenuData[2]} sort={sort} />
        </Menu.Item>
        <Menu.Item onClick={() => setSort("Old")}>
          <MenuButton properties={MenuData[3]} sort={sort} />
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

const MenuButton = (props: {
  properties: { title: string; icon: React.ReactNode; id: string };
  sort?: string;
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
        {...(props.properties.id === props.sort
          ? { color: "teal", variant: "filled", fz: "xl" }
          : null)}
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

const MenuData: { title: string; icon: React.ReactNode; id: string }[] = [
  {
    title: "Name A-Z",
    icon: <IconSortAscendingLetters size={20} />,
    id: "A-Z",
  },
  {
    title: "Name Z-A",
    icon: <IconSortDescendingLetters size={20} />,
    id: "Z-A",
  },
  {
    title: "Newest First",
    icon: <IconSortDescending size={20} />,
    id: "New",
  },
  {
    title: "Oldest First",
    icon: <IconSortAscending size={20} />,
    id: "Old",
  },
];
