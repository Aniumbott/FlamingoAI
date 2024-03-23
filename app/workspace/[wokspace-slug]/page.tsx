"use client";

import React, { useEffect, useState } from "react";
import {
  AppShell,
  Group,
  Title,
  ActionIcon,
  Button,
  Stack,
  Container,
  Text,
} from "@mantine/core";
import { IconLayoutSidebarRightExpand, IconPlus } from "@tabler/icons-react";
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
import { usePathname, useRouter } from "next/navigation";
import { newChat } from "@/app/components/LeftPanel/ChatItem";

const Workspace = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [leftOpened, { toggle: toggleLeft }] = useDisclosure(true);
  const [rightOpened, { toggle: toggleRight }] = useDisclosure(true);
  const { orgId } = useAuth();
  const router = useRouter();
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
      <AppShell.Main
        style={{ paddingTop: 0, position: "relative", paddingBottom: "0rem" }}
      >
        <NavigationBar leftOpened={leftOpened} toggleLeft={toggleLeft} />
        {pathname.split("/")[3] ? (
          children
        ) : (
          <Stack>
            <Container mt={150}>
              <Text>What do you want to do ?</Text>
              <Button
                radius="md"
                mt={20}
                size="lg"
                color="teal"
                onClick={() => {
                  const req = newChat("public", null);
                  req.then((res) => {
                    router.push(
                      pathname.split("/").slice(0, 3).join("/") +
                        "/" +
                        res.chat._id
                    );
                  });
                }}
                leftSection={<IconPlus />}
              >
                Share a Chat
              </Button>
            </Container>
          </Stack>
        )}
      </AppShell.Main>
    </AppShell>
  );
};

export default Workspace;
