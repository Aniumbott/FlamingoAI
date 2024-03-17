import React from "react";
import { Button, Stack, Group, Divider } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import PersonalChats from "./Menu/PersonalChats";
import SingleMenu from "./Menu/WorkspaceMenu";
import FilterMenuComponent from "./Menu/FilterMenu";
import NewMenuComponent from "./Menu/NewMenu";

const LeftPanel = () => {
  return (
    <Stack h={"100%"} justify="flex-start" align="strech" mt={10}>
      <SingleMenu />
      <Group
        justify="flex-start"
        wrap="nowrap"
        grow
        preventGrowOverflow={false}
        gap={10}
      >
        <FilterMenuComponent />
        <Group
          color="#047857"
          wrap="nowrap"
          justify="flex-start"
          gap={1}
          w={"10%"}
        >
          <Button color="#047857" px={"xs"}>
            <IconPlus size={20} />
          </Button>
          <NewMenuComponent />
        </Group>
      </Group>

      <PersonalChats />
      <Divider orientation="horizontal" />
    </Stack>
  );
};

export default LeftPanel;
