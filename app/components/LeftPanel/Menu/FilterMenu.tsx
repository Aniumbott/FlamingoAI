import React from "react";
import { Menu, Button, Stack, Text } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import {
  IconArchive,
  IconCalendarClock,
  IconListDetails,
  IconSelector,
  IconStar,
  IconUsers,
} from "@tabler/icons-react";

type MenuData = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

type MenuButtonProps = {
  properties: {
    title: string;
    description: string;
    icon: React.ReactNode;
    // onClickAction?: () => void;
  };
};

const FilterMenu = (props: {filterMenu:number, setFilterMenu: (value: number) => void }) => {
  const { hovered, ref } = useHover();
  const {filterMenu,setFilterMenu} = props;
  return (
    <Menu
      position="top-start"
      width={300}
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
      <Menu.Target ref={ref}>
        <Button
          justify="space-between "
          style={{
            padding: "6px",
          }}
          styles={{
            label: {
              flexGrow: 1,
            },
          }}
          leftSection={FilterMenuData[0].icon}
          rightSection={<IconSelector color="gray" size={20} />}
          {...(hovered ? { color: "gray" } : { color: "#9CA3AF" })}
          variant="subtle"
        >
          {FilterMenuData[filterMenu].title}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item onClick={()=>props.setFilterMenu(0)}>
          <MenuButton properties={FilterMenuData[0]} />
        </Menu.Item>
        <Menu.Item onClick={()=>props.setFilterMenu(1)}>
          <MenuButton properties={FilterMenuData[1]} />
        </Menu.Item>
        <Menu.Item onClick={()=>props.setFilterMenu(2)}>
          <MenuButton properties={FilterMenuData[2]} />
        </Menu.Item>
        <Menu.Item onClick={()=>props.setFilterMenu(3)}>
          <MenuButton properties={FilterMenuData[3]} />
        </Menu.Item>
        <Menu.Item onClick={()=>props.setFilterMenu(4)}>
          <MenuButton properties={FilterMenuData[4]} />
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
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
        }}
        // onClick={props.properties.onClickAction}
      >
        <Stack gap={1} align="start">
          <Text fw={"600"} fz={"sm"}>
            {props.properties.title}
          </Text>
          {props.properties.description && (
            <Text fz={"xs"} fw={"500"} c={"gray.7"}>
              {props.properties.description}
            </Text>
          )}
        </Stack>
      </Button>
    </div>
  );
};

const FilterMenuData: MenuData[] = [
  {
    title: "General",
    description: "All chats and folders",
    icon: <IconListDetails />,
  },
  {
    title: "By People",
    description: "Chats by their participants",
    icon: <IconUsers />,
  },
  {
    title: "Recent",
    description: "Most recent chats of any kind",
    icon: <IconCalendarClock />,
  },
  {
    title: "Favorites",
    description: "Saved chats for later",
    icon: <IconStar />,
  },
  {
    title: "Archive",
    description: "Archived chats",
    icon: <IconArchive />,
  },
];

export default FilterMenu;
