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
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconLayoutSidebarRightExpand, IconPlus } from "@tabler/icons-react";
import { notFound, usePathname, useRouter } from "next/navigation";
import {
  ClerkLoaded,
  ClerkLoading,
  useAuth,
  useOrganization,
} from "@clerk/nextjs";
import { socket } from "@/socket";

// Compontets
import NavigationBar from "../../components/NavigationBar";
import RightPanel from "../../components/RightPanel/RightPanel";
import LeftPanel from "../../components/LeftPanel/Leftpanel";
import ChatWindow from "./ChatWindow";
import { createChat } from "@/app/controllers/chat";
import { createAssistant } from "@/app/controllers/assistant";
import path from "path";

const Workspace = () => {
  const [leftOpened, { toggle: toggleLeft }] = useDisclosure(true);
  const [rightOpened, { toggle: toggleRight }] = useDisclosure(true);
  const [currentChatId, setCurrentChatId] = useState("");
  const { orgId, userId } = useAuth();
  const { organization } = useOrganization();
  const router = useRouter();
  const pathname = usePathname();

  const [orgMembers, setOrgMembers] = useState<any>([]);
  useEffect(() => {
    const fetchOrgMembers = async () => {
      const res =
        (await organization?.getMemberships())?.map(
          (member: any) => member.publicUserData
        ) || [];
      setOrgMembers(res);
    };
    fetchOrgMembers();
  }, [organization?.membersCount]);

  useEffect(() => {
    console.log("organization ID", orgId);

    socket.emit("joinWorkspaceRoom", orgId);
    return () => {
      socket.emit("leaveWorkspaceRoom", orgId);
    };
  }, [orgId]);

  useEffect(() => {
    if (socket.connected) {
      console.log("socket already connected");
    }

    socket.on("hello", (value) => {
      console.log(value, "socket listeners");
    });
    socket.on("connect", () => {
      console.log("socket connected");
    });
    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });
    socket.on("newMessage", (message) => {
      console.log("newMessage", message);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    // console.log("slug", organization?.slug);
    // if (pathname?.split("/")[2] != organization?.slug) {
    //   // notFound();
    //}

    if (currentChatId != "") socket.emit("leaveChatRoom", currentChatId);
    setCurrentChatId(pathname?.split("/")[3] || "");
  }, [pathname]);

  useEffect(() => {
    if (organization && pathname?.split("/")[2] != organization?.slug) {
      notFound();
    }
  }, [organization]);

  // useEffect(() => {
  // console.log("orgId", orgId);
  // }, [orgId]);

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
            breakpoint: "sm",
            collapsed: { desktop: !leftOpened, mobile: !leftOpened },
          }}
          aside={{
            width: 330,
            breakpoint: "md",
            collapsed: { desktop: !rightOpened, mobile: !rightOpened },
          }}
          padding="md"
        >
          <AppShell.Navbar p="0.5rem" style={{ margin: 0 }}>
            <div className="flex justify-between my-2">
              <Title order={3} ml={5}>
                TeamGPT
              </Title>
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
            style={{
              paddingTop: 0,
              position: "relative",
              paddingBottom: "0rem",
              overflowY: "hidden",
            }}
          >
            <div
              className="h-[100vh] w-full flex flex-col"
              style={{
                marginLeft: "-15px",
              }}
            >
              {/* <div className="max-h-[50px]">
                <NavigationBar
                  leftOpened={leftOpened}
                  toggleLeft={toggleLeft}
                />
              </div> */}
              <div className="grow">
                {pathname?.split("/")[3] ? (
                  <ChatWindow
                    currentChatId={currentChatId}
                    leftOpened={leftOpened}
                    toggleLeft={toggleLeft}
                  />
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
                          const req = createChat(
                            "public",
                            null,
                            userId || "",
                            orgId || "",
                            orgMembers
                          );

                          req.then((res) => {
                            router.push(
                              pathname?.split("/").slice(0, 3).join("/") +
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
              </div>
            </div>
          </AppShell.Main>
        </AppShell>
      </ClerkLoaded>
    </>
  );
};

export default Workspace;
