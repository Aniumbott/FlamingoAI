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
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconLayoutSidebarRightExpand, IconPlus } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { socket } from "@/socket";

// Compontets
import { newChat } from "@/app/components/LeftPanel/ChatItem";
import NavigationBar from "../../components/NavigationBar";
import RightPanel from "../../components/RightPanel/RightPanel";
import LeftPanel from "../../components/LeftPanel/Leftpanel";
import ChatWindow from "./ChatWindow";

const Workspace = () => {
  const [leftOpened, { toggle: toggleLeft }] = useDisclosure(true);
  const [rightOpened, { toggle: toggleRight }] = useDisclosure(true);
  const { orgId } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  useEffect(() => {
    console.log("isConnected", isConnected);
  }, [isConnected]);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);
      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }
    socket.on("hello", (value) => {
     console.log(value,"socket listeners")
    });
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    // console.log("orgId", orgId);
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
        style={{
          paddingTop: 0,
          position: "relative",
          paddingBottom: "0rem",
          overflowY: "hidden",
        }}
      >
        <div
          className="h-dvh w-full"
          style={{
            position: "relative",
            marginLeft: "-15px",
          }}
        >
          <NavigationBar leftOpened={leftOpened} toggleLeft={toggleLeft} />
          {pathname?.split("/")[3] ? (
            <ChatWindow currentChatId={pathname?.split("/")[3]} />
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
                <Button onClick={()=>{
                  socket.emit("hello","world")
                }}>Socket</Button>
              </Container>
            </Stack>
          )}
        </div>
      </AppShell.Main>
    </AppShell>
  );
};

export default Workspace;
