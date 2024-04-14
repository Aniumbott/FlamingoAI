// Modules
import { useEffect, useState } from "react";
import {
  Button,
  Stack,
  Group,
  Divider,
  useMantineColorScheme,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import {
  OrganizationSwitcher,
  Protect,
  useAuth,
  useOrganization,
} from "@clerk/nextjs";

// Components
import WorkspaceMenu from "./Menu/WorkspaceMenu";
import ChatMenu from "./Menu/ChatMenu";
import FilterMenuComponent from "./Menu/FilterMenu";
import { dark } from "@clerk/themes";
import { createChat } from "../../controllers/chat";
import PeopleChats from "./ChatFilters/PeopleChats";
import RecentChats from "./ChatFilters/RecentChats";
import { socket } from "@/socket";
import FavouriteChats from "./ChatFilters/FavouriteChats";
import ArchivedChats from "./ChatFilters/ArchivedChats";
import { getWorkspace, updateWorkspace } from "@/app/controllers/workspace";
import { set } from "mongoose";
import GeneralChats from "./ChatFilters/GeneralChats";

const LeftPanel = () => {
  const { colorScheme } = useMantineColorScheme();
  const [filterMenu, setFilterMenu] = useState(0);
  const [members, setMembers] = useState<any>([]);
  const [workspace, setWorkspace] = useState<any>(null);
  const { organization } = useOrganization();
  const { userId, orgId } = useAuth();

  useEffect(() => {
    const getmembers = async () => {
      const userList =
        (await organization?.getMemberships())?.map(
          (member: any) => member.publicUserData
        ) ?? [];
      setMembers(userList);
    };
    getmembers();

    if (organization?.id) {
      const fetchWorkspace = async () => {
        const res = await getWorkspace(organization.id);
        setWorkspace(res.workspace);
      };
      fetchWorkspace();
    }
  }, [organization?.id]);

  useEffect(() => {
    socket.on("updateWorkspace", (wsp) => {
      setWorkspace(wsp);
    });
    return () => {
      socket.off("updateWorkspace");
    };
  }, [workspace]);

  return (
    <Stack h={"100%"} justify="flex-start" align="strech" mt={10}>
      <Group
        justify="space-between"
        align="center"
        grow
        gap={10}
        preventGrowOverflow={false}
      >
        <OrganizationSwitcher
          hidePersonal
          afterCreateOrganizationUrl="/workspace/:slug"
          afterSelectPersonalUrl="/user/:id"
          afterSelectOrganizationUrl="/workspace/:slug"
          appearance={{
            baseTheme: colorScheme === "dark" ? dark : undefined,
          }}
        />

        <Protect role="org:admin">
          <WorkspaceMenu workspace={workspace} />
        </Protect>
      </Group>

      <Group
        justify="space-between"
        wrap="nowrap"
        grow
        preventGrowOverflow={false}
        gap={10}
      >
        <FilterMenuComponent
          filterMenu={filterMenu}
          setFilterMenu={setFilterMenu}
        />
        <Group color="#047857" wrap="nowrap" justify="flex-end" gap={1}>
          <Button
            color="#047857"
            radius="0"
            px={12}
            style={{
              borderRadius: "5px 0 0 5px ",
            }}
            onClick={() => createPublicChat(userId || "", orgId || "", members)}
          >
            <IconPlus size={15} />
          </Button>
          <ChatMenu members={members} />
        </Group>
      </Group>

      {(() => {
        switch (filterMenu) {
          case 0:
            return <GeneralChats members={members} />;
          case 1:
            return <PeopleChats members={members} />;
          case 2:
            return <RecentChats members={members} />;
          case 3:
            return <FavouriteChats members={members} />;
          case 4:
            return <ArchivedChats members={members} />;
          default:
            return null;
        }
      })()}

      <Divider orientation="horizontal" />
    </Stack>
  );
};

const createPublicChat = async (
  userId: string,
  workspaceId: string,
  members: any
) => {
  // console.log("creating a chat");
  socket.emit("hello", "world");
  // console.log("emmiting");
  const res = await createChat("public", null, userId, workspaceId, members);
  // console.log("res", res);
};

export default LeftPanel;
