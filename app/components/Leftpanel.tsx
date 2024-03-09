import React, { useState } from "react";
import {
  Menu,
  Button,
  Text,
  rem,
  Popover,
  Stack,
  Group,
  ThemeIcon,
} from "@mantine/core";
import {
  IconSettings,
  IconBuilding,
  IconUsers,
  IconFileImport,
  IconBriefcase,
  IconSelector,
  IconListDetails,
  IconCalendarClock,
  IconStar,
  IconArchive,
  IconPlus,
  IconChevronDown,
  IconMessages,
  IconLock,
  IconFolderPlus,
  IconFolder,
  IconNews,
  IconFolderRoot,
} from "@tabler/icons-react";
import MyButton from "./Menu/MenuButton";
import MenuBody from "./Menu/MenuBody";
import { useHover } from "@mantine/hooks";
import PersonalChats from "./Menu/PersonalChats";

const WorkspaceTarget = (hovered: boolean) => (
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
);

const SelectedItemComponent = (item: any, filterHover: boolean) => (
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
    fullWidth
    leftSection={item?.icon}
    rightSection={<IconSelector color="gray" size={20} />}
    {...(filterHover ? { color: "gray" } : { color: "#9CA3AF" })}
    variant="subtle"
  >
    {item?.title}
  </Button>
);

const WorkspaceMenu: any = [
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
];

const FilterMenu: any = [
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

const NewMenu: any = [
  {
    title: "New Shared Chat",
    description: "Chat with AI and collaborate with the team",
    icon: <IconMessages />,
  },
  {
    title: "New Personal Chat",
    description: "Individual chats with AI",
    icon: <IconLock />,
  },
  {
    title: "New Shared Folder",
    description: "Organize shared chats in folders",
    icon: <IconFolderPlus />,
  },
  {
    title: "New Personal Folder",
    description: "Organize personal chats in folders",
    icon: <IconFolderRoot />,
  },
  {
    title: "New Prompt",
    description: "Prompt template to start chats with",
    icon: <IconNews />,
  },
];

const LeftPanel = () => {
  const { hovered, ref } = useHover();
  const { hovered: filterHover, ref: filterRef } = useHover();
  const [selectedFilter, setSelectedFilter] = useState(FilterMenu[0]);

  const handleSelect = (item: any) => {
    setSelectedFilter(item);
  };
  return (
    <Stack align="stretch" justify="center" mt={10}>
      <MenuBody
        children={WorkspaceMenu}
        target={<div ref={ref}>{WorkspaceTarget(hovered)}</div>}
      />

      <Group
        justify="flex-start"
        wrap="nowrap"
        grow
        preventGrowOverflow={false}
        style={{ height: "100%" }}
        gap={10}
      >
        <MenuBody
          children={FilterMenu.map((item: any) => ({
            ...item,
            onClickAction: () => handleSelect(item),
          }))}
          target={
            <div ref={filterRef}>
              {SelectedItemComponent(selectedFilter, filterHover)}
            </div>
          }
        />
        <Group
          color="#047857"
          wrap="nowrap"
          justify="flex-start"
          gap={3}          
          w={'10%'}
          >
          <Button color="#047857" px={"xs"}>
            <IconPlus size={20} />
          </Button>
          <MenuBody
            children={NewMenu}
            target={
              <Button color="#047857" py={0} px={1}>
                <IconChevronDown size={20} />
              </Button>
            }
          />
        </Group>
      </Group>
      {/* <PersonalChats /> */}
    </Stack>
  );
};

export default LeftPanel;
