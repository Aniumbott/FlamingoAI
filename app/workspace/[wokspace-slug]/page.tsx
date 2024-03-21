"use client";

import React, { useEffect, useState } from "react";
import { AppShell, Group, Title, ActionIcon, Button } from "@mantine/core";
import { IconLayoutSidebarRightExpand } from "@tabler/icons-react";
// import { MantineLogo } from '@mantinex/mantine-logo';
import { useDisclosure } from "@mantine/hooks";
import NavigationBar from "../../components/NavigationBar";
import RightPanel from "../../components/RightPanel/RightPanel";
import LeftPanel from "../../components/LeftPanel/Leftpanel";
import {
  OrganizationList,
  OrganizationProfile,
  OrganizationSwitcher,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import { getChats } from "@/app/controllers/chat";
import { usePathname } from "next/navigation";

const Workspace = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [leftOpened, { toggle: toggleLeft }] = useDisclosure(true);
  const [rightOpened, { toggle: toggleRight }] = useDisclosure(true);
  const { orgId } = useAuth();

  const pathname = usePathname();

  useEffect(() => {
    console.log("orgId", orgId);
  }, [orgId]);

  return (
    <AppShell
      // header={{ height: 60 }}

      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { desktop: !leftOpened, mobile: !leftOpened },
      }}
      aside={{
        width: 325,
        breakpoint: "md",
        collapsed: { desktop: !rightOpened, mobile: !rightOpened },
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
        {pathname.split("/")[2] ? children : <Button>GET CHATS!!!</Button>}
      </AppShell.Main>
    </AppShell>
  );
};

export default Workspace;
