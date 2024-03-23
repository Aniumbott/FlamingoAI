import React, { useState } from "react";
import {
  Button,
  Stack,
  Group,
  Divider,
  useMantineColorScheme,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import GeneralChats from "./GeneralChats";
import SingleMenu from "./Menu/WorkspaceMenu";
import FilterMenuComponent from "./Menu/FilterMenu";
import NewMenuComponent from "./Menu/NewMenu";
import { ClerkLoaded, ClerkLoading, OrganizationSwitcher } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { createChat } from "../../controllers/chat";
import PeopleChats from "./PeopleChats";
import RecentChats from "./RecentChats";

const LeftPanel = () => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const [filterMenu, setFilterMenu] = useState(0);
  return (
    <Stack h={"100%"} justify="flex-start" align="strech" mt={10}>
      <Group
        justify="space-between"
        align="center"
        grow
        preventGrowOverflow={false}
      >
        <OrganizationSwitcher
          hidePersonal
          appearance={{
            baseTheme: colorScheme === "dark" ? dark : undefined,
          }}
        />
        <SingleMenu />
      </Group>

      {/* <ClerkLoading>
        <div>Loading</div>
      </ClerkLoading> */}
      {/* <ClerkLoaded> */}

      {/* </ClerkLoaded> */}
      <Group
        justify="flex-start"
        wrap="nowrap"
        grow
        preventGrowOverflow={false}
        gap={10}
      >
        <FilterMenuComponent
          filterMenu={filterMenu}
          setFilterMenu={setFilterMenu}
        />
        <Group
          color="#047857"
          wrap="nowrap"
          justify="flex-start"
          gap={1}
          w={"10%"}
        >
          <Button color="#047857" px={"xs"} onClick={createPublicChat}>
            <IconPlus size={20} />
          </Button>
          <NewMenuComponent />
        </Group>
      </Group>

      {(() => {
        switch (filterMenu) {
          case 0:
            return <GeneralChats />;
          case 1:
            return <PeopleChats />;
          case 2:
            return <RecentChats />;
          default:
            return null;
        }
      })()}

      <Divider orientation="horizontal" />
    </Stack>
  );
};

const createPublicChat = async () => {
  console.log("creating a chat");
  const res = await createChat("public", null);
  console.log("res", res);
};

export default LeftPanel;
