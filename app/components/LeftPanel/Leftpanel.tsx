// Modules
import { useState } from "react";
import {
  Button,
  Stack,
  Group,
  Divider,
  useMantineColorScheme,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { OrganizationSwitcher, Protect } from "@clerk/nextjs";

// Components
import WorkspaceMenu from "./Menu/WorkspaceMenu";
import ChatMenu from "./Menu/ChatMenu";
import FilterMenuComponent from "./Menu/FilterMenu";
import GeneralChats from "./GeneralChats";
import { dark } from "@clerk/themes";
import { createChat } from "../../controllers/chat";
import PeopleChats from "./PeopleChats";
import RecentChats from "./RecentChats";

const LeftPanel = () => {
  const { colorScheme } = useMantineColorScheme();
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

        <Protect role="org:admin">
          <WorkspaceMenu />
        </Protect>
      </Group>

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
          <Button
            color="#047857"
            radius="0"
            px={12}
            style={{
              borderRadius: "5px 0 0 5px ",
            }}
            onClick={createPublicChat}
          >
            <IconPlus size={15} />
          </Button>
          <ChatMenu />
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
  // console.log("creating a chat");
  const res = await createChat("public", null);
  // console.log("res", res);
};

export default LeftPanel;
