"use client";
// Modules
import { use, useEffect, useState } from "react";
import {
  AppShell,
  Title,
  ActionIcon,
  Button,
  Stack,
  Container,
  Text,
  Loader,
  Tooltip,
  Card,
  Paper,
  ScrollArea,
  useMantineColorScheme,
  Box,
  em,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  IconLayoutSidebarLeftExpand,
  IconLayoutSidebarRightExpand,
  IconPlus,
} from "@tabler/icons-react";
import { notFound, usePathname, useRouter } from "next/navigation";
import {
  ClerkLoaded,
  ClerkLoading,
  useAuth,
  useOrganization,
} from "@clerk/nextjs";
import { socket } from "@/socket";

// Compontets
import RightPanel from "../../components/RightPanel/RightPanel";
import LeftPanel from "../../components/LeftPanel/Leftpanel";
import ChatWindow from "../../components/ChatWindow/ChatWindow";
import { createChat } from "@/app/controllers/chat";
import { getWorkspace } from "@/app/controllers/workspace";
import RecentChats from "../../components/LeftPanel/ChatFilters/RecentChats";
import ImageGenWindow from "@/app/components/ImageGenWindow/ImageGenWindow";
import PageWindow from "@/app/components/PageWindow/PageWindow";
// import PageWindow from "@/app/components/PageWindow/PageWindow";

export default function Workspace() {
  const isMobile = useMediaQuery(`(max-width: 48em)`);
  const [leftOpened, { toggle: toggleLeft }] = useDisclosure(true);
  const [rightOpened, { toggle: toggleRight }] = useDisclosure(true);
  const { colorScheme } = useMantineColorScheme();
  const [currentChatId, setCurrentChatId] = useState("");
  const [currentImageGenId, setCurrentImageGenId] = useState("");
  const [currentPageId, setCurrentPageId] = useState("");
  const { orgId, userId } = useAuth();
  const { organization } = useOrganization();
  const router = useRouter();
  const pathname = usePathname();
  const [orgMembers, setOrgMembers] = useState<any>([]);
  const [workspace, setWorkspace] = useState<any>(null);
  const isAdmin =
    orgMembers?.find((member: any) => member.userId === userId)?.role ===
    "org:admin";
  const allowPublic = isAdmin || workspace?.allowPublic;
  const allowPersonal = isAdmin || workspace?.allowPersonal;

  useEffect(() => {
    if (isMobile) {
      toggleRight();
    }
  }, [isMobile]);

  useEffect(() => {
    if (organization?.id) {
      const fetchWorkspace = async () => {
        const res = await getWorkspace(organization.id);
        setWorkspace(res.workspace);
      };
      fetchWorkspace();
    }
  }, [organization?.id]);

  useEffect(() => {
    const fetchOrgMembers = async () => {
      const res =
        (await organization?.getMemberships())?.map((member: any) => {
          return { ...member.publicUserData, role: member.role };
        }) ?? [];
      setOrgMembers(res);
    };
    fetchOrgMembers();
  }, [organization?.membersCount]);

  useEffect(() => {
    socket.emit("joinWorkspaceRoom", orgId);
    return () => {
      socket.emit("leaveWorkspaceRoom", orgId);
    };
  }, [orgId]);

  useEffect(() => {
    const pathVariables = pathname?.split("/");
    if (
      pathVariables[3] !== "gallery" &&
      pathVariables[3] !== "page" &&
      currentChatId != pathVariables[3]
    ) {
      console.log("leaving", currentChatId);
      socket.emit("leaveChatRoom", currentChatId, userId);
    }
    if (pathVariables[3] === "gallery") {
      setCurrentImageGenId(pathVariables[4] || "");
    } else if (pathVariables[3] === "page") {
      setCurrentPageId(pathVariables[4] || "");
    } else {
      setCurrentChatId(pathVariables[3] || "");
    }
  }, [pathname]);

  useEffect(() => {
    if (organization && pathname?.split("/")[2] != organization?.slug) {
      notFound();
    }
  }, [organization]);

  return (
    <>
      <ClerkLoading>
        <Loader
          size="xl"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </ClerkLoading>
      <ClerkLoaded>
        <AppShell
          navbar={{
            width: 300,
            breakpoint: 500,
            collapsed: { desktop: !leftOpened, mobile: !leftOpened },
          }}
          aside={{
            width: 330,
            breakpoint: "md",
            collapsed: {
              desktop: !rightOpened || pathname.split("/")[3] == "page",
              mobile: !rightOpened || pathname.split("/")[3] == "page",
            },
          }}
          padding="md"
        >
          <AppShell.Navbar
            p="0.5rem"
            style={{
              margin: 0,
              background:
                colorScheme === "dark"
                  ? "var(--mantine-color-dark-8)"
                  : "var(--mantine-color-gray-1)",
              borderRight: "0px",
            }}
          >
            <div className="flex justify-between my-2">
              <Title order={3} ml={5}>
                TeamGPT
              </Title>
              <Tooltip label="Collapse panel" fz="xs" position="right">
                <ActionIcon
                  variant="subtle"
                  color="grey"
                  aria-label="Expand panel"
                  onClick={toggleLeft}
                >
                  <IconLayoutSidebarRightExpand
                    style={{ width: "90%", height: "90%" }}
                    stroke={1.5}
                  />
                </ActionIcon>
              </Tooltip>
            </div>

            <LeftPanel toggleLeft={toggleLeft} />
          </AppShell.Navbar>
          <AppShell.Aside
            style={{
              background:
                colorScheme === "dark"
                  ? "var(--mantine-color-dark-8)"
                  : "var(--mantine-color-gray-1)",
            }}
          >
            <RightPanel rightOpened={rightOpened} toggleRight={toggleRight} />
          </AppShell.Aside>
          <AppShell.Main
            {...(isMobile
              ? {
                  p: "0",
                }
              : { py: "0" })}
            style={{
              position: "relative",
              paddingBottom: "0rem",
              overflowY: "hidden",
              background:
                colorScheme === "dark"
                  ? "var(--mantine-color-dark-7)"
                  : "var(--mantine-color-gray-0)",
            }}
          >
            {!leftOpened &&
            (!pathname.split("/")[3] || pathname.split("/")[3] == "gallery") ? (
              <>
                <Box
                  visibleFrom="sm"
                  className="absolute top-3 flex flex-row items-center justify-between z-50"
                >
                  <Title order={4} mr={10}>
                    TeamGPT
                  </Title>
                  <Tooltip label="Expand panel" fz="xs" position="right">
                    <ActionIcon
                      variant="subtle"
                      color="grey"
                      aria-label="Expand panel"
                      onClick={toggleLeft}
                    >
                      <IconLayoutSidebarLeftExpand
                        style={{ width: "90%", height: "90%" }}
                        stroke={1.5}
                      />
                    </ActionIcon>
                  </Tooltip>
                </Box>
                <Box
                  hiddenFrom="sm"
                  py="xs"
                  px="md"
                  className="absolute top-0 w-full flex flex-row justify-between"
                >
                  <Tooltip label="Expand panel" fz="xs" position="right">
                    <ActionIcon
                      variant="subtle"
                      color="grey"
                      aria-label="Expand panel"
                      onClick={toggleLeft}
                    >
                      <IconLayoutSidebarLeftExpand
                        style={{ width: "90%", height: "90%" }}
                        stroke={1.5}
                      />
                    </ActionIcon>
                  </Tooltip>
                  <Title order={4} mr={10}>
                    TeamGPT
                  </Title>
                  <Tooltip label="Expand panel" fz="xs" position="right">
                    <ActionIcon
                      variant="subtle"
                      color="grey"
                      aria-label="Expand panel"
                      onClick={toggleRight}
                    >
                      <IconLayoutSidebarRightExpand
                        style={{ width: "90%", height: "90%" }}
                        stroke={1.5}
                      />
                    </ActionIcon>
                  </Tooltip>
                </Box>
              </>
            ) : null}

            <div
              className="h-[100vh] w-full flex flex-col"
              style={{
                marginLeft: !isMobile ? "-24px" : "",
              }}
            >
              <div className="flex flex-col grow justify-center">
                {pathname?.split("/")[3] ? (
                  pathname?.split("/")[3] == "gallery" ? (
                    <ImageGenWindow
                      imageGenId={currentImageGenId}
                      productId={workspace?.subscription?.product_id || ""}
                    />
                  ) : pathname?.split("/")[3] == "page" ? (
                    <PageWindow
                      leftOpened={leftOpened}
                      toggleLeft={toggleLeft}
                      currentPageId={currentPageId}
                    />
                  ) : (
                    <ChatWindow
                      currentChatId={currentChatId}
                      leftOpened={leftOpened}
                      toggleLeft={toggleLeft}
                      toggleRight={toggleRight}
                    />
                  )
                ) : (
                  <Stack align="center" justify="space-between">
                    <Container>
                      <Text>What do you want to do ?</Text>
                      <Button
                        radius="md"
                        mt={20}
                        size="lg"
                        onClick={() => {
                          createChat(
                            "public",
                            null,
                            userId || "",
                            orgId || "",
                            orgMembers
                          ).then((res) => {
                            router.push(
                              pathname?.split("/").slice(0, 3).join("/") +
                                "/" +
                                res.chat._id
                            );
                          });
                        }}
                        leftSection={<IconPlus />}
                      >
                        Start a Chat
                      </Button>
                    </Container>
                    <Card
                      radius="md"
                      p="xl"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "90%",
                        maxWidth: "40rem",
                        maxHeight: "30rem",
                      }}
                    >
                      <Title order={4} mb="md">
                        Everyone&apos; Recent Chats
                      </Title>
                      <RecentChats
                        toggleLeft={toggleLeft}
                        members={orgMembers}
                        allowPublic={allowPublic}
                        allowPersonal={allowPersonal}
                      />
                    </Card>
                  </Stack>
                )}
              </div>
            </div>
          </AppShell.Main>
        </AppShell>
      </ClerkLoaded>
    </>
  );
}
