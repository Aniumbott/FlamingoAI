"use client";

import React, { useEffect, useState } from "react";
import { AppShell, Group, Title, ActionIcon } from "@mantine/core";
import { IconLayoutSidebarRightExpand } from "@tabler/icons-react";
// import { MantineLogo } from '@mantinex/mantine-logo';
import { useDisclosure } from "@mantine/hooks";
import NavigationBar from "./components/NavigationBar";
import RightPanel from "./components/RightPanel/RightPanel";
import LeftPanel from "./components/Leftpanel";

const Home = () => {
  const [leftOpened, { toggle: toggleLeft }] = useDisclosure(true);
  const [rightOpened, { toggle: toggleRight }] = useDisclosure(true);

  return (
    <AppShell
      // header={{ height: 60 }}

      navbar={{
        width: 270,
        breakpoint: "sm",
        collapsed: { desktop: !leftOpened },
      }}
      aside={{
        width: 325,
        breakpoint: "md",
        collapsed: { desktop: !rightOpened },
      }}
      padding="md"
    >
      <AppShell.Navbar p="0.5rem" style={{ margin: 0 }}>
        <div className="flex justify-between">
          <Title order={3}>TeamGPT</Title>
          <ActionIcon
            variant="subtle"
            color="grey"
            aria-label="Settings"
            onClick={toggleLeft}
          >
            <IconLayoutSidebarRightExpand
              style={{ width: "90%", height: "90%" }}
              stroke={1.5}
            />
          </ActionIcon>
        </div>

        <LeftPanel />
      </AppShell.Navbar>
      <AppShell.Aside>
        <RightPanel rightOpened={rightOpened} toggleRight={toggleRight} />
      </AppShell.Aside>
      <AppShell.Main style={{ paddingTop: 0 }}>
        <NavigationBar leftOpened={leftOpened} toggleLeft={toggleLeft} />
      </AppShell.Main>
    </AppShell>
  );
};

export default Home;
