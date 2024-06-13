// Modules
import { useEffect, useState } from "react";
import {
  Button,
  Stack,
  Group,
  Divider,
  useMantineColorScheme,
  Tooltip,
  Card,
  Alert,
  Text,
  Box,
  List,
} from "@mantine/core";
import { IconInfoCircle, IconPlus } from "@tabler/icons-react";
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
import { createChat } from "../../controllers/chat";
import PeopleChats from "./ChatFilters/PeopleChats";
import RecentChats from "./ChatFilters/RecentChats";
import { socket } from "@/socket";
import FavouriteChats from "./ChatFilters/FavouriteChats";
import ArchivedChats from "./ChatFilters/ArchivedChats";
import { getWorkspace } from "@/app/controllers/workspace";
import GeneralChats from "./ChatFilters/GeneralChats";
import { usePathname, useRouter } from "next/navigation";

export default function LeftPanel(props: { toggleLeft: () => void }) {
  const { toggleLeft } = props;
  const [filterMenu, setFilterMenu] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const [members, setMembers] = useState<any>([]);
  const [workspace, setWorkspace] = useState<any>(null);
  const { organization } = useOrganization();
  const { userId, orgId } = useAuth();
  const isAdmin =
    members?.find((member: any) => member.userId === userId)?.role ===
    "org:admin";
  const allowPublic = isAdmin || workspace?.allowPublic;
  const allowPersonal = isAdmin || workspace?.allowPersonal;

  useEffect(() => {
    const getmembers = async () => {
      const userList =
        (await organization?.getMemberships())?.map((member: any) => {
          return { ...member.publicUserData, role: member.role };
        }) ?? [];
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
    socket.on("updateWorkspace", () => {
      const fetchWorkspace = async () => {
        const res = await getWorkspace(organization?.id || "");
        setWorkspace(res.workspace);
      };
      fetchWorkspace();
    });
    return () => {
      socket.off("updateWorkspace");
    };
  }, [workspace]);

  return (
    <Stack h={"100%"} justify="flex-start" align="strech" mt={10} w="100%">
      <Group
        justify="space-between"
        align="center"
        preventGrowOverflow={false}
        gap={10}
      >
        <div className="grow">
          <OrganizationSwitcher
            // skipInvitationScreen={true}
            hidePersonal
            createOrganizationMode="navigation"
            afterLeaveOrganizationUrl="/workspace/"
            afterCreateOrganizationUrl="/workspace/"
            afterSelectOrganizationUrl="/workspace/"
          />
        </div>

        <WorkspaceMenu workspace={workspace} />
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
        <Group wrap="nowrap" justify="flex-end" gap={1}>
          <Tooltip label="New Chat" fz="xs">
            <Button
              radius="0"
              px={12}
              disabled={!workspace?.allowPublic}
              style={{
                borderRadius: "5px 0 0 5px ",
              }}
              onClick={() =>
                createChat(
                  "public",
                  null,
                  userId || "",
                  orgId || "",
                  members
                ).then((res: any) => {
                  router.push(
                    pathname.split("/").slice(0, 3).join("/") +
                      "/" +
                      res.chat._id
                  );
                })
              }
            >
              <IconPlus size={15} />
            </Button>
          </Tooltip>
          <ChatMenu
            members={members}
            allowPersonal={allowPersonal}
            allowPublic={allowPublic}
          />
        </Group>
      </Group>

      {(() => {
        switch (filterMenu) {
          case 0:
            return (
              <GeneralChats
                toggleLeft={toggleLeft}
                members={members}
                allowPublic={allowPublic}
                allowPersonal={allowPersonal}
                productId={workspace?.subscription?.product_id || ""}
              />
            );
          case 1:
            return (
              <PeopleChats
                toggleLeft={toggleLeft}
                members={members}
                allowPublic={allowPublic}
                allowPersonal={allowPersonal}
              />
            );
          case 2:
            return (
              <RecentChats
                toggleLeft={toggleLeft}
                members={members}
                allowPublic={allowPublic}
                allowPersonal={allowPersonal}
              />
            );
          case 3:
            return (
              <FavouriteChats
                toggleLeft={toggleLeft}
                members={members}
                allowPublic={allowPublic}
                allowPersonal={allowPersonal}
              />
            );
          case 4:
            return (
              <ArchivedChats
                toggleLeft={toggleLeft}
                members={members}
                allowPublic={allowPublic}
                allowPersonal={allowPersonal}
              />
            );
          default:
            return null;
        }
      })()}

      {workspace?.subscription == null ||
      workspace?.subscription.status != "active" ? (
        <>
          <Divider orientation="horizontal" />
          <Card
            style={{
              background: "var(--mantine-primary-color-light)",
              border: "1px solid var(--mantine-primary-color-filled)",
            }}
          >
            <Group justify="space-between">
              <Group gap={"xs"}>
                <IconInfoCircle size="20px" />
                <Text size="md" fw={700}>
                  Upgrade
                </Text>
              </Group>
              <Button
                size="xs"
                radius="sm"
                variant="outline"
                fullWidth={false}
                onClick={() => {
                  router.push(
                    pathname.split("/").slice(0, 3).join("/") + "/upgrade"
                  );
                }}
              >
                Explore plans
              </Button>
            </Group>
            <Text mt="sm" size="sm">
              Get access to more features by subscribing one of our plans.
            </Text>
          </Card>
        </>
      ) : null}
    </Stack>
  );
}
